"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = "/backend-api";

export default function PaymentReturnPage() {
    const router = useRouter();
    const [status, setStatus] = useState("Verifying payment...");
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const verify = async () => {
            const params = new URLSearchParams(window.location.search);
            const orderId = params.get("order_id");
            const token = localStorage.getItem("accessToken");

            if (!orderId) {
                router.replace("/courses");
                return;
            }

            if (!token) {
                const redirect = encodeURIComponent(
                    `/payment/return?order_id=${orderId}`
                );
                router.replace(`/auth/number?redirect=${redirect}`);
                return;
            }

            try {
                setStatus("Confirming your payment...");

                const response = await fetch(
                    `${API}/payments/orders/${encodeURIComponent(orderId)}`,
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        cache: "no-store",
                    }
                );

                const payload = await response.json().catch(() => ({}));

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    const redirect = encodeURIComponent(
                        `/payment/return?order_id=${orderId}`
                    );
                    router.replace(`/auth/number?redirect=${redirect}`);
                    return;
                }

                if (!response.ok || !payload?.success) {
                    throw new Error(
                        payload?.message || "Payment verification failed."
                    );
                }

                const order = payload.order;
                const orderStatus = String(order?.status || "").toUpperCase();
                const itemType = String(order?.item?.type || "").toUpperCase();
                const itemId = order?.item?.id;

                if (orderStatus === "PAID") {
                    if (!cancelled) setStatus("Payment successful. Opening your content...");

                    if (itemType === "COURSE" && itemId) {
                        router.replace(`/my-courses/${itemId}`);
                        return;
                    }

                    if (itemType === "CURRENT_AFFAIRS" && itemId) {
                        router.replace(
                            `/current-affairs/${itemId}?order_id=${encodeURIComponent(orderId)}`
                        );
                        return;
                    }

                    router.replace("/profile");
                    return;
                }

                if (orderStatus === "FAILED" || orderStatus === "CANCELLED") {
                    setError("Payment was not completed. You can try again.");
                    setStatus("");
                    return;
                }

                setStatus("Payment is still being confirmed...");
                await new Promise((resolve) => setTimeout(resolve, 2000));

                if (!cancelled) {
                    window.location.reload();
                }
            } catch (err) {
                console.error("Payment return verification error:", err);
                if (!cancelled) {
                    setStatus("");
                    setError(
                        err.message ||
                            "Payment verification failed. Please try again."
                    );
                }
            }
        };

        verify();

        return () => {
            cancelled = true;
        };
    }, [router]);

    return (
        <main className="min-h-screen bg-[#f4f3ef] px-4 py-24 sm:py-32">
            <div className="mx-auto max-w-md rounded-3xl border border-zinc-200 bg-white p-7 text-center shadow-sm sm:p-9">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 text-xl text-white">
                    {error ? "!" : "✓"}
                </div>

                <h1 className="mt-5 text-2xl font-black text-zinc-950">
                    {error ? "Payment status" : "Processing payment"}
                </h1>

                {status && (
                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                        {status}
                    </p>
                )}

                {error && (
                    <>
                        <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </p>

                        <button
                            onClick={() => router.back()}
                            className="mt-6 w-full rounded-2xl bg-black py-3.5 font-bold text-white"
                        >
                            Back to payment
                        </button>
                    </>
                )}
            </div>
        </main>
    );
}
