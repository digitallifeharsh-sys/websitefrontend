"use client";

import { Suspense, useEffect, useState } from "react";
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

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState("number");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedPhone = sessionStorage.getItem("authPhoneNumber");
    const resetToken = sessionStorage.getItem("authResetToken");

    if (savedPhone) {
      setPhoneNumber(savedPhone);
    }

    if (searchParams.get("step") === "password" && resetToken) {
      setStep("password");
    }
  }, [searchParams]);

  const handleSendOtp = async (event) => {
    event.preventDefault();

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
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: fullPhoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to send OTP.");
      }

      sessionStorage.setItem("authPhoneNumber", fullPhoneNumber);
      sessionStorage.setItem("authOtpPurpose", "FORGOT_PASSWORD");

      router.push("/auth/verify-otp");
    } catch (requestError) {
      console.error("Forgot Password Error:", requestError);
      setError(requestError?.message || "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const resetToken = sessionStorage.getItem("authResetToken");

    if (!resetToken) {
      setError("Reset session expired. Please request a new OTP.");
      setStep("number");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/reset-password`, {
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
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to reset password.");
      }

      sessionStorage.removeItem("authResetToken");
      sessionStorage.removeItem("authOtpPurpose");

      router.replace("/auth/number");
    } catch (requestError) {
      console.error("Reset Password Error:", requestError);
      setError(requestError?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "password") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f4f0] px-5">
        <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,.08)] sm:p-9">
          <button
            onClick={() => router.push("/auth/number")}
            className="mb-7 flex items-center gap-2 font-black"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="mb-6 flex h-12 w-12 items-center justify-center bg-black font-black text-white shadow-[3px_3px_0px_#000]">
            DNS
          </div>

          <div className="mb-4 inline-block bg-black px-3 py-1 text-xs font-black text-white">
            NEW PASSWORD
          </div>

          <h1 className="text-3xl font-black">Reset password</h1>

          <p className="mt-3 text-sm font-semibold text-slate-600">
            Create a new password for your account.
          </p>

          <form onSubmit={handleResetPassword} className="mt-7">
            <label className="mb-2 block text-sm font-black">
              New Password
            </label>

            <div className="mb-5 flex border-2 border-black">
              <div className="flex items-center border-r-2 border-black bg-slate-100 px-4">
                <Lock size={18} />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-4 font-bold outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-4"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="mb-2 block text-sm font-black">
              Confirm Password
            </label>

            <div className="flex border-2 border-black">
              <div className="flex items-center border-r-2 border-black bg-slate-100 px-4">
                <Lock size={18} />
              </div>

              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-4 font-bold outline-none"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="px-4"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="mt-4 border-2 border-red-600 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-3 bg-black py-4 font-black text-white disabled:opacity-40"
            >
              {loading ? "Resetting..." : "Reset Password"}
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f4f0] px-5">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,.08)] sm:p-9">
        <button
          onClick={() => router.push("/auth/number")}
          className="mb-7 flex items-center gap-2 font-black"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="mb-6 flex h-12 w-12 items-center justify-center bg-black font-black text-white shadow-[3px_3px_0px_#000]">
          DNS
        </div>

        <div className="mb-4 inline-block bg-black px-3 py-1 text-xs font-black text-white">
          FORGOT PASSWORD
        </div>

        <h1 className="text-3xl font-black sm:text-4xl">
          Forgot password?
        </h1>

        <p className="mt-3 text-sm font-semibold text-slate-600">
          Enter your registered mobile number. We will send you an OTP.
        </p>

        <form onSubmit={handleSendOtp} className="mt-7">
          <label className="mb-2 block text-sm font-black">
            Mobile Number
          </label>

          <div className="flex border-2 border-black">
            <div className="flex items-center gap-2 border-r-2 border-black bg-slate-100 px-4 font-black">
              <Phone size={18} />
              +91
            </div>

            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phoneNumber.replace("+91", "")}
              onChange={(event) => {
                const value = event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10);

                setPhoneNumber(value);
                setError("");
              }}
              placeholder="Enter 10-digit number"
              className="w-full px-4 py-4 font-bold outline-none"
            />
          </div>

          {error && (
            <div className="mt-4 border-2 border-red-600 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
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
            className="mt-6 flex w-full items-center justify-center gap-3 bg-black py-4 font-black text-white disabled:opacity-40"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f4f4f0]" />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
