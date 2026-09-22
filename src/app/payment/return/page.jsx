"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock3, ArrowRight, XCircle } from "lucide-react";
import { apiJson } from "../../lib/api";

export default function PaymentReturnPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [state, setState] = useState("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!orderId) {
      setState("error");
      setMessage("Payment order ID missing.");
      return;
    }

    const verify = async () => {
      try {
        const data = await apiJson(
          `/api/v1/course-payments/orders/${encodeURIComponent(orderId)}`,
          { auth: true }
        );

        if (data?.data?.unlocked || data?.data?.status === "PAID") {
          setState("success");
          return;
        }

        if (["EXPIRED", "TERMINATED", "FAILED"].includes(data?.data?.status)) {
          setState("failed");
          setMessage("Payment complete nahi hua. Aap dobara course purchase try kar sakte hain.");
          return;
        }

        setState("pending");
        setMessage("Payment abhi confirm ho raha hai. Thodi der baad My Courses check karein.");
      } catch (error) {
        setState("error");
        setMessage(error.message || "Payment verification failed.");
      }
    };

    verify();
  }, [orderId]);

  const config = {
    checking: {
      icon: Clock3,
      title: "Payment check ho raha hai…",
      text: "Securely Cashfree order status verify kiya ja raha hai.",
    },
    success: {
      icon: CheckCircle2,
      title: "Course unlocked!",
      text: "Payment successful hai. Aapka course My Courses me available hai.",
    },
    pending: {
      icon: Clock3,
      title: "Payment pending",
      text: message,
    },
    failed: {
      icon: XCircle,
      title: "Payment not completed",
      text: message,
    },
    error: {
      icon: XCircle,
      title: "Unable to verify payment",
      text: message,
    },
  }[state];

  const Icon = config.icon;

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20 flex items-start justify-center">
      <div className="w-full max-w-2xl px-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xl shadow-slate-200/50">
          <div className={`mx-auto h-20 w-20 rounded-full flex items-center justify-center ${
            state === "success" ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
          }`}>
            <Icon size={40} />
          </div>
          <h1 className="mt-6 text-3xl font-black text-slate-950">{config.title}</h1>
          <p className="mt-3 text-slate-600 leading-7">{config.text}</p>

          {state === "success" && (
            <Link
              href="/my-courses"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-bold text-white hover:bg-indigo-700"
            >
              Open My Courses <ArrowRight size={17} />
            </Link>
          )}

          {(state === "failed" || state === "error") && (
            <Link
              href="/courses"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 font-bold text-white"
            >
              Back to Courses <ArrowRight size={17} />
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
