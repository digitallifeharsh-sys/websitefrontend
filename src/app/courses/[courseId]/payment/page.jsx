"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { load } from "@cashfreepayments/cashfree-js";

const API = "/backend-api";

export default function CoursePayment() {
  const { courseId } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const response = await fetch(`${API}/courses/${courseId}`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok || !data?.success) {
          throw new Error(data?.message || "Unable to load course");
        }
        setCourse(data.data);
      } catch (error) {
        setMsg(error.message || "Unable to load course");
      }
    };

    if (courseId) loadCourse();
  }, [courseId]);

  const pay = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      sessionStorage.setItem(
        "authRedirect",
        `/courses/${courseId}/payment`
      );
      router.push("/auth/number");
      return;
    }

    setBusy(true);
    setMsg("");

    try {
      const response = await fetch(`${API}/course-payments/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: Number(courseId) }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to create order");
      }

      const cashfree = await load({
        mode:
          String(data.cashfree?.environment).toLowerCase() === "production"
            ? "production"
            : "sandbox",
      });

      await cashfree.checkout({
        paymentSessionId: data.cashfree.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (error) {
      setMsg(error.message || "Payment could not be started.");
      setBusy(false);
    }
  };

  if (!course) {
    return (
      <main className="min-h-screen bg-[#f4f3ef] px-4 py-28">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8">
          {msg || "Loading..."}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f3ef] px-4 py-24 sm:py-28">
      <div className="mx-auto w-full max-w-xl">
        <button
          onClick={() => router.back()}
          className="mb-5 font-bold"
        >
          ← Back
        </button>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-bold tracking-[0.2em] text-zinc-500">
            CHECKOUT
          </p>
          <h1 className="mt-2 break-words text-2xl font-black sm:text-3xl">
            {course.name}
          </h1>

          <div className="mt-6 text-3xl font-black sm:text-4xl">
            ₹{Number(course.price || 0).toLocaleString("en-IN")}
          </div>

          {msg && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {msg}
            </p>
          )}

          <button
            disabled={busy}
            onClick={pay}
            className="mt-7 w-full rounded-2xl bg-black py-4 font-bold text-white disabled:opacity-40"
          >
            {busy ? "Opening payment..." : "Pay Now"}
          </button>
        </div>
      </div>
    </main>
  );
}
