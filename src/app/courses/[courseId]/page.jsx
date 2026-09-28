"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  GraduationCap,
  LockKeyhole,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Tag,
  WalletCards,
} from "lucide-react";

const API = "/backend-api";

const getImageUrl = (value) => {
  if (!value) return "";
  const raw = String(value).trim();

  if (raw.startsWith("/backend-api/")) return raw;

  const uploadsIndex = raw.indexOf("/uploads/");
  if (uploadsIndex >= 0) return "/backend-api" + raw.slice(uploadsIndex);

  if (raw.startsWith("/home/ubuntu/dns_harsh/public/")) {
    return "/backend-api" + raw.replace("/home/ubuntu/dns_harsh/public", "");
  }

  return raw.startsWith("/") ? raw : raw;
};

const money = (value) =>
  \`₹\${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}\`;

function PriceBreakdown({ pricing, offerCodePreview, offerCodeApplied }) {
  const current = offerCodePreview || pricing || {};
  const discount = Number(current.discount || 0);

  const rows = [
    { label: "Course price", value: Number(current.base || 0) },
    discount > 0
      ? {
          label: offerCodeApplied ? "Offer discount" : "Discount",
          value: -discount,
        }
      : null,
    { label: "GST", value: Number(current.gst || 0) },
    { label: "Platform charge", value: Number(current.platform || 0) },
  ].filter(Boolean);

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span className="text-slate-500">{row.label}</span>
            <span
              className={
                row.value < 0
                  ? "font-semibold text-emerald-600"
                  : "font-semibold text-slate-900"
              }
            >
              {row.value < 0 ? "− " : ""}
              {money(Math.abs(row.value))}
            </span>
          </div>
        ))}
      </div>

      {offerCodeApplied && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          <Check className="h-3.5 w-3.5" />
          Offer code applied
        </div>
      )}

      <div className="mt-4 border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between gap-4">
          <span className="font-semibold text-slate-900">You pay</span>
          <span className="text-2xl font-black tracking-tight text-slate-950">
            {money(current.total)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CourseDetail() {
  const { courseId } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [offerCode, setOfferCode] = useState("");
  const [offerPreview, setOfferPreview] = useState(null);
  const [offerError, setOfferError] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(\`\${API}/courses/\${courseId}\`, {
          cache: "no-store",
        });

        const payload = await response.json();

        if (!response.ok || !payload?.success || !payload?.data) {
          throw new Error(payload?.message || "Course not found");
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
  const activeOffer = course?.offer?.active ? course.offer : null;

  const effectivePricing = useMemo(
    () => offerPreview || pricing,
    [offerPreview, pricing]
  );

  const applyOffer = async () => {
    const code = offerCode.trim();

    if (!code) {
      setOfferError("Enter an offer code.");
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      sessionStorage.setItem("authRedirect", \`/courses/\${courseId}\`);
      router.push("/auth/number");
      return;
    }

    try {
      setOfferLoading(true);
      setOfferError("");

      const response = await fetch(
        \`\${API}/course-payments/offers/validate\`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: \`Bearer \${token}\`,
          },
          body: JSON.stringify({
            courseId: Number(courseId),
            offerCode: code,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Offer code is invalid.");
      }

      setOfferPreview(data.priceBreakdown);
    } catch (err) {
      setOfferPreview(null);
      setOfferError(err.message || "Offer code could not be applied.");
    } finally {
      setOfferLoading(false);
    }
  };

  const imageUrl = getImageUrl(course?.imageUrl);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-28">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-5 w-24 rounded bg-slate-200" />
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
            <div className="h-[460px] rounded-3xl bg-slate-200" />
            <div className="h-[460px] rounded-3xl bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-28">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <p className="font-semibold text-red-600">
            {error || "Course not found"}
          </p>
          <button
            onClick={() => router.push("/courses")}
            className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white"
          >
            Back to Courses
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={course.name || "Course"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-50 to-sky-50">
                  <div className="rounded-2xl border border-indigo-100 bg-white/80 px-7 py-5 text-2xl font-black text-indigo-700 shadow-sm">
                    DNS Academy
                  </div>
                </div>
              )}

              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-slate-800 backdrop-blur">
                <GraduationCap className="h-4 w-4 text-indigo-600" />
                {course.subject?.name || "Course"}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                <Sparkles className="h-3.5 w-3.5" />
                DNS Academy
              </div>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                {course.name}
              </h1>

              <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                {course.description?.long ||
                  course.description?.short ||
                  "Structured learning course."}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    Secure checkout
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Payment is verified by the server.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <Clock3 className="h-5 w-5 text-indigo-600" />
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    Instant access
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Course unlocks after successful payment.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <LockKeyhole className="h-5 w-5 text-slate-700" />
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    Protected content
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Content is available only to enrolled users.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:sticky lg:top-24 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Course pricing
                </p>
                <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
                  {money(effectivePricing.total)}
                </p>
              </div>

              {Number(effectivePricing.discount || 0) > 0 && (
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  Save {money(effectivePricing.discount)}
                </span>
              )}
            </div>

            {activeOffer && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2 text-amber-700">
                  <Tag className="h-4 w-4" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Current offer
                  </span>
                </div>
                <p className="mt-2 font-bold text-slate-900">
                  {activeOffer.name}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {activeOffer.type === "PERCENT"
                    ? \`\${activeOffer.value}% discount included\`
                    : \`\${money(activeOffer.value)} discount included\`}
                </p>
              </div>
            )}

            <PriceBreakdown
              pricing={pricing}
              offerCodePreview={offerPreview}
              offerCodeApplied={Boolean(offerPreview)}
            />

            <div className="mt-6">
              <label className="mb-2 block text-sm font-bold text-slate-900">
                Have an offer code?
              </label>

              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={offerCode}
                    onChange={(event) => {
                      setOfferCode(event.target.value);
                      setOfferPreview(null);
                      setOfferError("");
                    }}
                    placeholder="Enter code"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                <button
                  type="button"
                  onClick={applyOffer}
                  disabled={offerLoading}
                  className="rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {offerLoading ? "..." : "Apply"}
                </button>
              </div>

              {offerError && (
                <p className="mt-2 text-xs font-semibold text-red-600">
                  {offerError}
                </p>
              )}
            </div>

            <button
              onClick={() =>
                router.push(
                  \`/courses/\${courseId}/payment\${
                    offerPreview
                      ? \`?offerCode=\${encodeURIComponent(
                          offerCode.trim()
                        )}\`
                      : ""
                  }\`
                )
              }
              disabled={Number(effectivePricing.total || 0) < 1}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-4 font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue to payment
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <WalletCards className="h-4 w-4" />
              Secure payment powered by Cashfree
            </div>

            {course.schedule?.startDate && (
              <div className="mt-6 border-t border-slate-100 pt-5 text-xs text-slate-500">
                <div className="flex items-center justify-between gap-4">
                  <span>Course start</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(
                      course.schedule.startDate
                    ).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
            )}
          </aside>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            <ReceiptText className="h-4 w-4" />
            Pricing transparency
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-bold text-slate-900">Offer-aware pricing</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Active course offers and valid offer codes are reflected before payment.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-bold text-slate-900">GST shown separately</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Tax is displayed independently from the discounted course amount.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-bold text-slate-900">
                Platform charge shown separately
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                The configured platform charge is included in the final payable amount.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push("/courses")}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950"
        >
          All courses
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </main>
  );
}
