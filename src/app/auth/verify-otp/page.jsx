"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
    process.env.NEXT_PUBLIC_AUTH_API_URL ||
    "http://localhost:5000/api/v1/auth";

export default function VerifyOtpPage() {
    const router = useRouter();

    const [phoneNumber, setPhoneNumber] = useState("");
    const [purpose, setPurpose] = useState("");

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const phone =
            sessionStorage.getItem("authPhoneNumber");

        const otpPurpose =
            sessionStorage.getItem("authOtpPurpose");

        if (!phone || !otpPurpose) {
            router.replace("/auth/number");
            return;
        }

        setPhoneNumber(phone);
        setPurpose(otpPurpose);

    }, [router]);

    const handleVerify = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError("");

        if (otp.length !== 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                `${API_URL}/verify-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        phoneNumber,
                        otp,
                        purpose,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "OTP verification failed."
                );
            }

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    "OTP verification failed."
                );
            }

            /*
             * REGISTER
             */
            if (purpose === "REGISTER") {

                localStorage.setItem(
                    "accessToken",
                    data.accessToken
                );

                localStorage.setItem(
                    "refreshToken",
                    data.refreshToken
                );

                localStorage.setItem(
                    "authUser",
                    JSON.stringify(data.user)
                );

                sessionStorage.removeItem(
                    "authOtpPurpose"
                );

                router.replace("/");

                return;
            }

            /*
             * FORGOT PASSWORD
             */
            if (purpose === "FORGOT_PASSWORD") {

                sessionStorage.setItem(
                    "authResetToken",
                    data.resetToken
                );

                router.push(
                    "/auth/forgot-password?step=password"
                );

                return;
            }

        } catch (error) {

            console.error(
                "Verify OTP Error:",
                error
            );

            setError(
                error?.message ||
                "Unable to verify OTP."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f4f4f0] flex items-center justify-center px-5">

            <div className="w-full max-w-md bg-white border-2 border-black shadow-[8px_8px_0px_#000] p-7 sm:p-9">

                <div className="mb-8">

                    <div className="w-12 h-12 bg-indigo-600 text-white border-2 border-black flex items-center justify-center font-black shadow-[3px_3px_0px_#000] mb-6">
                        DNS
                    </div>

                    <div className="inline-block bg-black text-white px-3 py-1 text-xs font-black mb-4">
                        VERIFY OTP
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black">
                        Enter OTP
                    </h1>

                    <p className="mt-3 text-sm font-semibold text-slate-600">
                        OTP sent to
                    </p>

                    <p className="font-black mt-1">
                        {phoneNumber}
                    </p>

                </div>

                <form onSubmit={handleVerify}>

                    <label className="block text-sm font-black mb-2">
                        6-Digit OTP
                    </label>

                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                            setOtp(
                                e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 6)
                            );

                            setError("");
                        }}
                        placeholder="Enter OTP"
                        className="w-full border-2 border-black px-4 py-4 outline-none text-center text-2xl font-black tracking-[0.5em]"
                    />

                    {error && (
                        <div className="mt-4 px-4 py-3 border-2 border-red-600 bg-red-50 text-red-700 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={
                            loading ||
                            otp.length !== 6
                        }
                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white border-2 border-black shadow-[5px_5px_0px_#000] py-4 font-black"
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify OTP"}
                    </button>

                </form>

            </div>

        </main>
    );
}