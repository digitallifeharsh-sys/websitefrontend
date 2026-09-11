"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Lock,
    User,
    Eye,
    EyeOff,
} from "lucide-react";

const API_URL =
    process.env.NEXT_PUBLIC_AUTH_API_URL ||
    "http://localhost:5000/api/v1/auth";

export default function DetailsPage() {
    const router = useRouter();

    const [phoneNumber, setPhoneNumber] = useState("");
    const [authType, setAuthType] = useState("");

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const phone =
            sessionStorage.getItem("authPhoneNumber");

        const type =
            sessionStorage.getItem("authAuthType");

        if (!phone || !type) {
            router.replace("/auth/number");
            return;
        }

        setPhoneNumber(phone);
        setAuthType(type);
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError("");

        if (!password || password.length < 8) {
            setError(
                "Password must be at least 8 characters."
            );
            return;
        }

        if (authType === "REGISTER") {

            if (!name.trim()) {
                setError("Please enter your name.");
                return;
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
        }

        setLoading(true);

        try {

            const endpoint =
                authType === "LOGIN"
                    ? "/login"
                    : "/register";

            const body =
                authType === "LOGIN"
                    ? {
                        phoneNumber,
                        password,
                    }
                    : {
                        phoneNumber,
                        name: name.trim(),
                        password,
                        confirmPassword,
                    };

            const response = await fetch(
                `${API_URL}${endpoint}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Authentication failed."
                );
            }

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    "Authentication failed."
                );
            }

            /*
             * LOGIN
             */
            if (authType === "LOGIN") {

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

                const redirect =
                    sessionStorage.getItem("authRedirect");

                sessionStorage.removeItem("authRedirect");
                sessionStorage.removeItem("authPhoneNumber");
                sessionStorage.removeItem("authAuthType");

                router.replace(
                    redirect && redirect.startsWith("/")
                        ? redirect
                        : "/"
                );

                return;
            }

            /*
             * REGISTER
             */
            sessionStorage.setItem(
                "authOtpPurpose",
                "REGISTER"
            );

            router.push("/auth/verify-otp");

        } catch (error) {

            console.error(
                "Authentication Error:",
                error
            );

            setError(
                error?.message ||
                "Something went wrong."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f4f4f0] flex items-center justify-center px-5 py-10">

            <div className="w-full max-w-md bg-white border-2 border-black shadow-[8px_8px_0px_#000] p-7 sm:p-9">

                <div className="mb-8">

                    <div className="w-12 h-12 bg-indigo-600 text-white border-2 border-black flex items-center justify-center font-black shadow-[3px_3px_0px_#000] mb-6">
                        DNS
                    </div>

                    <div className="inline-block bg-black text-white px-3 py-1 text-xs font-black mb-4">
                        {authType === "LOGIN"
                            ? "WELCOME BACK"
                            : "CREATE ACCOUNT"}
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black">
                        {authType === "LOGIN"
                            ? "Enter your password"
                            : "Create your account"}
                    </h1>

                    <p className="mt-3 text-sm font-semibold text-slate-600">
                        {phoneNumber}
                    </p>

                </div>

                <form onSubmit={handleSubmit}>

                    {authType === "REGISTER" && (
                        <div className="mb-5">

                            <label className="block text-sm font-black mb-2">
                                Full Name
                            </label>

                            <div className="flex border-2 border-black">

                                <div className="px-4 flex items-center bg-slate-100 border-r-2 border-black">
                                    <User size={18} />
                                </div>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-4 outline-none font-bold"
                                />

                            </div>

                        </div>
                    )}

                    <div className="mb-5">

                        <label className="block text-sm font-black mb-2">
                            Password
                        </label>

                        <div className="flex border-2 border-black">

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
                                    setPassword(e.target.value)
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

                    </div>

                    {authType === "REGISTER" && (
                        <div className="mb-5">

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

                        </div>
                    )}

                    {error && (
                        <div className="mb-5 px-4 py-3 border-2 border-red-600 bg-red-50 text-red-700 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white border-2 border-black shadow-[5px_5px_0px_#000] py-4 flex items-center justify-center gap-3 font-black"
                    >
                        {loading ? (
                            "Please wait..."
                        ) : (
                            <>
                                {authType === "LOGIN"
                                    ? "Login"
                                    : "Create Account"}

                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                </form>

                {authType === "LOGIN" && (
                    <button
                        onClick={() =>
                            router.push(
                                "/auth/forgot-password"
                            )
                        }
                        className="w-full mt-6 text-sm font-black text-indigo-600 hover:underline"
                    >
                        Forgot Password?
                    </button>
                )}

            </div>

        </main>
    );
}