"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, LockKeyhole, PlayCircle, ShieldCheck, Smartphone } from "lucide-react";
import { apiJson, API_URL } from "../../lib/api";
import { DetailSkeleton } from "../../components/PageSkeleton";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await apiJson(`/api/v1/courses/${courseId}`);
        setCourse(data?.data || data?.course || data);
      } catch (err) {
        setError(err.message || "Course details load nahi ho paaye.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [courseId]);

  const buyCourse = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    if (!token) {
      router.push(`/auth/number?redirect=/courses/${courseId}`);
      return;
    }

    try {
      setBuying(true);
      setError("");

      const data = await apiJson("/api/v1/course-payments/orders", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ courseId: Number(courseId) }),
      });

      const paymentSessionId = data?.cashfree?.paymentSessionId;
      const environment = String(data?.cashfree?.environment || "sandbox").toLowerCase();

      if (!paymentSessionId) {
        throw new Error("Payment session create nahi hua.");
      }

      if (!window.Cashfree) {
        await loadCashfreeScript();
      }

      const cashfree = window.Cashfree({
        mode: environment === "production" ? "production" : "sandbox",
      });

      await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      setError(err.message || "Payment start nahi ho paaya.");
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6"><DetailSkeleton /></div>
      </main>
    );
  }

  if (error && !course) {
    return (
      <main className="min-h-screen bg-slate-50 pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600">
            <ArrowLeft size={17} /> Back to Courses
          </Link>
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
            {error}
          </div>
        </div>
      </main>
    );
  }

  const price = Number(course?.price || 0);

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600">
          <ArrowLeft size={17} /> All Courses
        </Link>

        <div className="mt-6 grid lg:grid-cols-[1.08fr_0.92fr] gap-8 items-start">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            <div className="relative h-[300px] sm:h-[460px] bg-gradient-to-br from-indigo-600 to-violet-700">
              {course?.imageUrl ? (
                <img src={course.imageUrl} alt={course.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <PlayCircle size={92} className="text-white/80" strokeWidth={1.2} />
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-9 shadow-xl shadow-slate-200/40">
            <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
              {course?.subject?.name || "DNS Course"}
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              {course?.name}
            </h1>
            <p className="mt-4 leading-7 text-slate-600">
              {course?.description?.long || course?.description?.short || "Complete course for structured exam preparation."}
            </p>

            <div className="mt-7 rounded-2xl bg-slate-50 border border-slate-100 p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Course fee</p>
                  <p className="mt-1 text-4xl font-black text-slate-950">
                    ₹{price.toLocaleString("en-IN")}
                  </p>
                </div>
                <ShieldCheck className="text-emerald-500" size={30} />
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={buyCourse}
              disabled={buying}
              className="mt-5 w-full rounded-2xl bg-indigo-600 px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 transition"
            >
              {buying ? "Opening secure payment..." : `Buy Course • ₹${price.toLocaleString("en-IN")}`}
            </button>

            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              {[
                [LockKeyhole, "Secure purchase"],
                [Smartphone, "Videos on DNS App"],
                [CheckCircle2, "Course in My Courses"],
              ].map(([Icon, label]) => (
                <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
                  <Icon size={20} className="mx-auto text-indigo-600" />
                  <p className="mt-2 text-xs font-bold text-slate-600">{label}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs leading-5 text-slate-400">
              Website par course purchase hoga. Course videos website par stream nahi honge;
              unlocked course ko DNS App me access kiya jaayega.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

async function loadCashfreeScript() {
  if (window.Cashfree) return;

  await new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-cashfree-sdk="true"]');
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.dataset.cashfreeSdk = "true";
    script.onload = resolve;
    script.onerror = () => reject(new Error("Payment SDK load nahi hua."));
    document.head.appendChild(script);
  });
}
