"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Lock,
    Phone,
    Eye,
    EyeOff,
} from "lucide-react";

const API_URL = "/backend-api/auth";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [step, setStep] = useState("number");

    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const savedPhone =
            sessionStorage.getItem("authPhoneNumber");

        const resetToken =
            sessionStorage.getItem("authResetToken");

        if (savedPhone) {
            setPhoneNumber(savedPhone);
        }

        if (
            searchParams.get("step") === "password" &&
            resetToken
        ) {
            setStep("password");
        }

    }, [searchParams]);

    /*
     * STEP 1
     * Send forgot-password OTP
     */
    const handleSendOtp = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError("");

        const cleanNumber =
            phoneNumber.replace(/\D/g, "");

        if (cleanNumber.length !== 10) {
            setError(
                "Please enter a valid 10-digit phone number."
            );
            return;
        }

        const fullPhoneNumber =
            `+91${cleanNumber}`;

        setLoading(true);

        try {

            const response = await fetch(
                `${API_URL}/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        phoneNumber: fullPhoneNumber,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Unable to send OTP."
                );
            }

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    "Unable to send OTP."
                );
            }

            sessionStorage.setItem(
                "authPhoneNumber",
                fullPhoneNumber
            );

            sessionStorage.setItem(
                "authOtpPurpose",
                "FORGOT_PASSWORD"
            );

            router.push("/auth/verify-otp");

        } catch (error) {

            console.error(
                "Forgot Password Error:",
                error
            );

            setError(
                error?.message ||
                "Unable to send OTP."
            );

        } finally {
            setLoading(false);
        }
    };

    /*
     * STEP 3
     * Reset password
     */
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError("");

        if (password.length < 8) {
            setError(
                "Password must be at least 8 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const resetToken =
            sessionStorage.getItem("authResetToken");

        if (!resetToken) {
            setError(
                "Reset session expired. Please request a new OTP."
            );
            setStep("number");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                `${API_URL}/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        phoneNumber,
                        password,
                        confirmPassword,
                        resetToken,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Unable to reset password."
                );
            }

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    "Unable to reset password."
                );
            }

            sessionStorage.removeItem(
                "authResetToken"
            );

            sessionStorage.removeItem(
                "authOtpPurpose"
            );

            router.replace("/auth/number");

        } catch (error) {

            console.error(
                "Reset Password Error:",
                error
            );

            setError(
                error?.message ||
                "Unable to reset password."
            );

        } finally {
            setLoading(false);
        }
    };

    /*
     * PASSWORD STEP
     */
    if (step === "password") {
        return (
            <main className="min-h-screen bg-[#f4f4f0] flex items-center justify-center px-5">

                <div className="w-full max-w-md bg-white border border-zinc-200 shadow-[0_20px_60px_rgba(0,0,0,.08)] rounded-3xl p-7 sm:p-9">

                    <button
                        onClick={() =>
                            router.push(
                                "/auth/number"
                            )
                        }
                        className="mb-7 flex items-center gap-2 font-black"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black shadow-[3px_3px_0px_#000] mb-6">
                        DNS
                    </div>

                    <div className="inline-block bg-black text-white px-3 py-1 text-xs font-black mb-4">
                        NEW PASSWORD
                    </div>

                    <h1 className="text-3xl font-black">
                        Reset password
                    </h1>

                    <p className="mt-3 text-sm font-semibold text-slate-600">
                        Create a new password for your account.
                    </p>

                    <form
                        onSubmit={handleResetPassword}
                        className="mt-7"
                    >

                        <label className="block text-sm font-black mb-2">
                            New Password
                        </label>

                        <div className="flex border-2 border-black mb-5">

                            <div className="px-4 flex items-center bg-slate-100 border-r-2 border-black">
                                <Lock size={18} />
                            </div>

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Minimum 8 characters"
                                className="w-full px-4 py-4 outline-none font-bold"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="px-4"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>

                        </div>

                        <label className="block text-sm font-black mb-2">
                            Confirm Password
                        </label>

                        <div className="flex border-2 border-black">

                            <div className="px-4 flex items-center bg-slate-100 border-r-2 border-black">
                                <Lock size={18} />
                            </div>

                            <input
                                type={
                                    showConfirm
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirm password"
                                className="w-full px-4 py-4 outline-none font-bold"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirm(
                                        !showConfirm
                                    )
                                }
                                className="px-4"
                            >
                                {showConfirm ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>

                        </div>

                        {error && (
                            <div className="mt-4 px-4 py-3 border-2 border-red-600 bg-red-50 text-red-700 text-sm font-bold">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 bg-black text-white disabled:opacity-40 py-4 flex items-center justify-center gap-3 font-black"
                        >
                            {loading
                                ? "Resetting..."
                                : "Reset Password"}

                            <ArrowRight size={20} />
                        </button>

                    </form>

                </div>

            </main>
        );
    }

    /*
     * STEP 1
     */
    return (
        <main className="min-h-screen bg-[#f4f4f0] flex items-center justify-center px-5">

            <div className="w-full max-w-md bg-white border border-zinc-200 shadow-[0_20px_60px_rgba(0,0,0,.08)] rounded-3xl p-7 sm:p-9">

                <button
                    onClick={() =>
                        router.push(
                            "/auth/number"
                        )
                    }
                    className="mb-7 flex items-center gap-2 font-black"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black shadow-[3px_3px_0px_#000] mb-6">
                    DNS
                </div>

                <div className="inline-block bg-black text-white px-3 py-1 text-xs font-black mb-4">
                    FORGOT PASSWORD
                </div>

                <h1 className="text-3xl sm:text-4xl font-black">
                    Forgot password?
                </h1>

                <p className="mt-3 text-sm font-semibold text-slate-600">
                    Enter your registered mobile number.
                    We will send you an OTP.
                </p>

                <form
                    onSubmit={handleSendOtp}
                    className="mt-7"
                >

                    <label className="block text-sm font-black mb-2">
                        Mobile Number
                    </label>

                    <div className="flex border-2 border-black">

                        <div className="px-4 flex items-center gap-2 bg-slate-100 border-r-2 border-black font-black">
                            <Phone size={18} />
                            +91
                        </div>

                        <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={
                                phoneNumber
                                    .replace("+91", "")
                            }
                            onChange={(e) => {
                                const value =
                                    e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 10);

                                setPhoneNumber(
                                    value
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
                            phoneNumber
                                .replace(/\D/g, "")
                                .replace(/^91/, "")
                                .length < 10
                        }
                        className="w-full mt-6 bg-black text-white disabled:opacity-40 py-4 flex items-center justify-center gap-3 font-black"
                    >
                        {loading
                            ? "Sending OTP..."
                            : "Send OTP"}

                        <ArrowRight size={20} />
                    </button>

                </form>

            </div>

        </main>
    );
}