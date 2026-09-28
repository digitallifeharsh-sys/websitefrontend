"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { load } from "@cashfreepayments/cashfree-js";

const API = "/backend-api";

const money = (value) =>
  "₹" +
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getImageUrl = (value) => {
  if (!value) return "";
  const raw = String(value).trim();
  if (raw.startsWith("/backend-api/")) return raw;
  const uploadsIndex = raw.indexOf("/uploads/");
  if (uploadsIndex >= 0) return "/backend-api" + raw.slice(uploadsIndex);
  if (raw.startsWith("/home/ubuntu/dns_harsh/public/")) {
    return "/backend-api" + raw.replace("/home/ubuntu/dns_harsh/public", "");
  }
  if (raw.startsWith("/")) return raw;
  return raw;
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [offerCode, setOfferCode] = useState("");
  const [offerPreview, setOfferPreview] = useState(null);
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerError, setOfferError] = useState("");
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          API + "/courses/" + courseId,
          { cache: "no-store" }
        );

        const payload = await response.json().catch(() => ({}));

        if (!response.ok || !payload?.success || !payload?.data) {
          throw new Error(
            payload?.message || "Unable to load course"
          );
        }

        setCourse(payload.data);
      } catch (err) {
        console.error("Course detail error:", err);
        setError(err.message || "Unable to load course");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) loadCourse();
  }, [courseId]);

  const pricing = course?.pricing || {};
  const offer = course?.offer?.active ? course.offer : null;
  const price = offerPreview || pricing;

  const base = Number(
    price.base ?? pricing.base ?? course?.price ?? 0
  );

  const discount = Number(
    price.discount ?? pricing.discount ?? 0
  );

  const gst = Number(price.gst ?? pricing.gst ?? 0);
  const platform = Number(price.platform ?? pricing.platform ?? 0);

  const total = Number(
    price.total ?? pricing.total ?? base
  );

  const applyOffer = async () => {
    const code = offerCode.trim();

    if (!code) {
      setOfferError("Enter an offer code.");
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      sessionStorage.setItem(
        "authRedirect",
        "/courses/" + courseId
      );
      router.push("/auth/number");
      return;
    }

    try {
      setOfferLoading(true);
      setOfferError("");
      setOfferPreview(null);

      const response = await fetch(
        API + "/course-payments/offers/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            courseId: Number(courseId),
            offerCode: code,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("accessToken");
        router.push("/auth/number");
        return;
      }

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "Offer code is invalid."
        );
      }

      setOfferPreview(
        data.data?.priceBreakdown || null
      );
    } catch (err) {
      setOfferError(
        err.message || "Unable to validate offer."
      );
    } finally {
      setOfferLoading(false);
    }
  };

  const buy = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      sessionStorage.setItem(
        "authRedirect",
        "/courses/" + courseId
      );
      router.push("/auth/number");
      return;
    }

    try {
      setBuying(true);
      setError("");

      const body = {
        courseId: Number(courseId),
      };

      if (offerCode.trim()) {
        body.offerCode = offerCode.trim();
      }

      const response = await fetch(
        API + "/course-payments/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("accessToken");
        router.push("/auth/number");
        return;
      }

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
            "Unable to create payment order."
        );
      }

      const cashfree = await load({
        mode:
          String(data.cashfree?.environment).toLowerCase() ===
          "production"
            ? "production"
            : "sandbox",
      });

      await cashfree.checkout({
        paymentSessionId:
          data.cashfree.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      setError(
        err.message || "Payment could not be started."
      );
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-28">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8">
          Loading course...
        </div>
      </main>
    );
  }

  if (error && !course) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-28">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-100 bg-white p-8">
          <p className="font-bold text-red-600">
            {error}
          </p>

          <button
            onClick={() => router.push("/courses")}
            className="mt-5 rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white"
          >
            Back to Courses
          </button>
        </div>
      </main>
    );
  }

  const imageUrl = getImageUrl(course.imageUrl);

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.push("/courses")}
          className="mb-6 font-semibold text-slate-600 hover:text-slate-950"
        >
          ← Back to Courses
        </button>

        <div className="grid gap-7 lg:grid-cols-[1.15fr_.85fr]">
          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={course.name || "Course"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-3xl font-black text-indigo-700">
                  DNS Academy
                </div>
              )}

              <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-slate-800 backdrop-blur">
                {course.subject?.name || "DNS Academy"}
              </div>
            </div>

            <div className="p-6 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                DNS Academy
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                {course.name}
              </h1>

              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                {course.description?.long ||
                  course.description?.short ||
                  "Structured learning course."}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Learning
                  </p>
                  <p className="mt-1 font-bold text-slate-900">
                    Structured course
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Access
                  </p>
                  <p className="mt-1 font-bold text-slate-900">
                    After verified payment
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Security
                  </p>
                  <p className="mt-1 font-bold text-slate-900">
                    Server verified
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:sticky lg:top-24 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Course access
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              {course.name}
            </h2>

            {offer && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-amber-700">
                  Current offer
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {offer.name}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {offer.type === "PERCENT"
                    ? offer.value + "% discount included"
                    : money(offer.value) +
                      " discount included"}
                </p>
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Course price
                  </span>
                  <span className="font-semibold">
                    {money(base)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Discount
                    </span>
                    <span className="font-semibold text-emerald-600">
                      − {money(discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    GST
                  </span>
                  <span className="font-semibold">
                    {money(gst)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Platform charge
                  </span>
                  <span className="font-semibold">
                    {money(platform)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between border-t border-slate-200 pt-4">
                <span className="font-bold text-slate-700">
                  You pay
                </span>

                <span className="text-3xl font-black text-slate-950">
                  {money(total)}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="course-offer"
                className="text-sm font-bold text-slate-900"
              >
                Offer code
              </label>

              <div className="mt-2 flex gap-2">
                <input
                  id="course-offer"
                  value={offerCode}
                  onChange={(e) => {
                    setOfferCode(e.target.value);
                    setOfferError("");
                    setOfferPreview(null);
                  }}
                  placeholder="Enter code"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <button
                  type="button"
                  onClick={applyOffer}
                  disabled={offerLoading}
                  className="rounded-xl border border-slate-900 px-4 py-3 text-sm font-bold disabled:opacity-50"
                >
                  {offerLoading ? "Checking..." : "Apply"}
                </button>
              </div>

              {offerError && (
                <p className="mt-2 text-sm font-semibold text-red-600">
                  {offerError}
                </p>
              )}

              {offerPreview && (
                <p className="mt-2 text-sm font-semibold text-emerald-600">
                  Offer applied successfully.
                </p>
              )}
            </div>

            {error && (
              <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}

            <button
              onClick={buy}
              disabled={buying}
              className="mt-6 w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {buying
                ? "Opening payment..."
                : "Buy Course & Pay"}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-slate-400">
              Payment amount is calculated and verified by the backend.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
