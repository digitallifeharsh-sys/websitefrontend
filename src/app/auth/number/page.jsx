"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Phone,
    ShieldCheck,
} from "lucide-react";

const API_URL =
    process.env.NEXT_PUBLIC_AUTH_API_URL ||
    "http://localhost:5000/api/v1/auth";

export default function NumberPage() {
    const router = useRouter();

    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        sessionStorage.removeItem("authOtpPurpose");
        sessionStorage.removeItem("authResetToken");
        sessionStorage.removeItem("authAuthType");
    }, []);

    const handleContinue = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError("");

        const cleanNumber = phoneNumber.replace(/\D/g, "");

        if (cleanNumber.length !== 10) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }

        const fullPhoneNumber = `+91${cleanNumber}`;

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/start`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phoneNumber: fullPhoneNumber,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Unable to continue."
                );
            }

            if (!data?.success) {
                throw new Error(
                    data?.message || "Unable to continue."
                );
            }

            sessionStorage.setItem(
                "authPhoneNumber",
                fullPhoneNumber
            );

            if (data.exists === true) {
                sessionStorage.setItem(
                    "authAuthType",
                    "LOGIN"
                );
            } else {
                sessionStorage.setItem(
                    "authAuthType",
                    "REGISTER"
                );
            }

            router.push("/auth/details");

        } catch (error) {
            console.error("Start Auth Error:", error);

            setError(
                error?.message ||
                "Unable to connect to authentication server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f4f4f0] px-5 py-10 flex items-center justify-center">

            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">

                <section className="hidden lg:block">

                    <div className="inline-block px-4 py-2 bg-white border-2 border-black shadow-[4px_4px_0px_#000] text-sm font-black mb-8">
                        DNS EDUCATION
                    </div>

                    <h1 className="text-6xl font-black leading-tight">
                        Learn.
                        <br />
                        Grow.
                        <br />

                        <span className="inline-block bg-indigo-600 text-white px-4 py-1 border-2 border-black shadow-[6px_6px_0px_#000] mt-2">
                            Succeed.
                        </span>
                    </h1>

                    <p className="mt-8 max-w-lg text-lg font-semibold leading-8 text-slate-700">
                        Access your courses, test series,
                        previous year papers and learning
                        resources with your DNS Education account.
                    </p>

                    <div className="mt-8 flex items-center gap-3">

                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center">
                            <ShieldCheck size={20} />
                        </div>

                        <p className="font-bold text-sm">
                            Secure authentication with OTP verification.
                        </p>

                    </div>

                </section>

                <section>

                    <div className="max-w-md mx-auto bg-white border-2 border-black shadow-[8px_8px_0px_#000] p-7 sm:p-9">

                        <div className="flex items-center gap-3 mb-8">

                            <div className="w-12 h-12 bg-indigo-600 text-white border-2 border-black flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_#000]">
                                DNS
                            </div>

                            <div>
                                <h2 className="font-black text-xl">
                                    DNS Education
                                </h2>

                                <p className="text-[11px] font-bold tracking-widest text-indigo-600">
                                    LEARN • GROW • SUCCESS
                                </p>
                            </div>

                        </div>

                        <div className="mb-7">

                            <div className="inline-block bg-black text-white px-3 py-1 text-xs font-black mb-4">
                                GET STARTED
                            </div>

                            <h3 className="text-3xl sm:text-4xl font-black">
                                Enter your number
                            </h3>

                            <p className="mt-3 text-sm font-semibold text-slate-600">
                                Enter your mobile number to continue securely.
                            </p>

                        </div>

                        <form onSubmit={handleContinue}>

                            <label className="block text-sm font-black mb-2">
                                Mobile Number
                            </label>

                            <div className="flex border-2 border-black">

                                <div className="px-4 flex items-center gap-2 border-r-2 border-black bg-slate-100 font-black">
                                    <Phone size={17} />
                                    +91
                                </div>

                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    value={phoneNumber}
                                    disabled={loading}
                                    onChange={(e) => {
                                        const value =
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            );

                                        setPhoneNumber(
                                            value.slice(0, 10)
                                        );

                                        setError("");
                                    }}
                                    placeholder="Enter 10-digit number"
                                    className="w-full px-4 py-4 outline-none font-bold"
                                />

                            </div>

                            {error && (
                                <div className="mt-4 px-4 py-3 border-2 border-red-600 bg-red-50 text-red-700 text-sm font-bold">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    phoneNumber.length !== 10
                                }
                                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white border-2 border-black shadow-[5px_5px_0px_#000] px-5 py-4 flex items-center justify-center gap-3 font-black"
                            >
                                {loading ? (
                                    "Checking..."
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                        </form>

                        <div className="mt-7 pt-5 border-t-2 border-slate-200 text-center">
                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        "/auth/forgot-password"
                                    )
                                }
                                className="text-sm font-black text-indigo-600 hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>

                    </div>

                </section>

            </div>

        </main>
    );
}