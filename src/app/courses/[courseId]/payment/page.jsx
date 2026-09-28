"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CreditCard, Loader2, LockKeyhole, ShieldCheck, Tag } from "lucide-react";
import { load } from "@cashfreepayments/cashfree-js";

const API = "/backend-api";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function Breakdown({ price }) {
  if (!price) return null;
  const rows = [
    { label: "Course price", value: Number(price.base || 0) },
    Number(price.discount || 0) > 0 ? { label: "Discount", value: -Number(price.discount) } : null,
    { label: "GST", value: Number(price.gst || 0) },
    { label: "Platform charge", value: Number(price.platform || 0) },
  ].filter(Boolean);

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-500">{row.label}</span>
            <span className={row.value < 0 ? "font-semibold text-emerald-600" : "font-semibold text-slate-900"}>
              {row.value < 0 ? "− " : ""}{money(Math.abs(row.value))}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
        <span className="font-bold text-slate-900">Final payable</span>
        <span className="text-2xl font-black text-slate-950">{money(price.total)}</span>
      </div>
    </div>
  );
}

export default function CoursePayment() {
  const { courseId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [price, setPrice] = useState(null);
  const [busy, setBusy] = useState(false);
  const [offerBusy, setOfferBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [offerCode, setOfferCode] = useState("");

  useEffect(() => {
    setOfferCode(searchParams?.get("offerCode") || "");
  }, [searchParams]);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const response = await fetch(`${API}/courses/${courseId}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data?.success) throw new Error(data?.message || "Unable to load course");
        setCourse(data.data);
        setPrice(data.data.pricing || null);
      } catch (error) {
        setMsg(error.message || "Unable to load course");
      }
    };
    if (courseId) loadCourse();
  }, [courseId]);

  const applyOffer = async () => {
    const code = offerCode.trim();
    if (!code) {
      setPrice(course?.pricing || null);
      setMsg("");
      return;
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
      sessionStorage.setItem("authRedirect", `/courses/${courseId}/payment?offerCode=${encodeURIComponent(code)}`);
      router.push("/auth/number");
      return;
    }
    try {
      setOfferBusy(true);
      setMsg("");
      const response = await fetch(`${API}/course-payments/offers/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId: Number(courseId), offerCode: code }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.message || "Offer code is invalid.");
      setPrice(data.priceBreakdown);
    } catch (error) {
      setPrice(course?.pricing || null);
      setMsg(error.message || "Offer code could not be applied.");
    } finally {
      setOfferBusy(false);
    }
  };

  const pay = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      sessionStorage.setItem("authRedirect", `/courses/${courseId}/payment${offerCode.trim() ? `?offerCode=${encodeURIComponent(offerCode.trim())}` : ""}`);
      router.push("/auth/number");
      return;
    }

    setBusy(true);
    setMsg("");
    try {
      const response = await fetch(`${API}/course-payments/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId: Number(courseId), ...(offerCode.trim() ? { offerCode: offerCode.trim() } : {}) }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.message || "Unable to create order");
      setPrice(data.order?.priceBreakdown || price);
      const cashfree = await load({ mode: String(data.cashfree?.environment).toLowerCase() === "production" ? "production" : "sandbox" });
      await cashfree.checkout({ paymentSessionId: data.cashfree.paymentSessionId, redirectTarget: "_self" });
    } catch (error) {
      setMsg(error.message || "Payment could not be started.");
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!course || !searchParams?.get("offerCode") || !localStorage.getItem("accessToken")) return;
    applyOffer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  if (!course) {
    return <main className="min-h-screen bg-slate-50 px-4 py-28"><div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">{msg || "Loading..."}</div></main>;
  }

  const activeOffer = course.offer?.active ? course.offer : null;

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto w-full max-w-3xl">
        <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><ArrowLeft className="h-4 w-4" />Back</button>
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="bg-gradient-to-r from-indigo-600 to-sky-500 p-6 text-white sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Secure checkout</p>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">{course.name}</h1>
            <p className="mt-2 text-sm text-white/80">Review your pricing before opening Cashfree.</p>
          </div>
          <div className="p-5 sm:p-8">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4"><ShieldCheck className="h-5 w-5 text-emerald-600" /><p className="mt-2 text-sm font-bold text-slate-900">Verified total</p><p className="mt-1 text-xs text-slate-500">Calculated by the backend.</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><LockKeyhole className="h-5 w-5 text-indigo-600" /><p className="mt-2 text-sm font-bold text-slate-900">Secure payment</p><p className="mt-1 text-xs text-slate-500">Cashfree handles the payment.</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><CreditCard className="h-5 w-5 text-slate-700" /><p className="mt-2 text-sm font-bold text-slate-900">Course access</p><p className="mt-1 text-xs text-slate-500">Enrollment follows successful verification.</p></div>
            </div>
            {activeOffer && <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4"><Tag className="mt-0.5 h-4 w-4 text-amber-700" /><div><p className="text-xs font-black uppercase tracking-wider text-amber-700">Included course offer</p><p className="mt-1 font-bold text-slate-900">{activeOffer.name}</p></div></div>}
            <label className="mt-6 block text-sm font-bold text-slate-900">Offer code</label>
            <div className="mt-2 flex gap-2">
              <input value={offerCode} onChange={(event) => { setOfferCode(event.target.value); setMsg(""); }} placeholder="Enter offer code (optional)" className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" />
              <button type="button" onClick={applyOffer} disabled={offerBusy} className="rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-bold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60">{offerBusy ? "..." : "Apply"}</button>
            </div>
            <Breakdown price={price || course.pricing} />
            {msg && <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">{msg}</p>}
            <button disabled={busy || Number(price?.total || 0) < 1} onClick={pay} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" />Opening payment...</> : <>Pay {money(price?.total)}<ArrowRight className="h-4 w-4" /></>}
            </button>
            <p className="mt-4 text-center text-xs leading-5 text-slate-500">The backend recalculates discount, GST and platform charge when the order is created.</p>
          </div>
        </div>
      </div>
    </main>
  );
}