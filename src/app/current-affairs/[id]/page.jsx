"use client";

import Script from "next/script";
import { Fraunces, Inter } from "next/font/google";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
    useParams,
    useRouter,
    useSearchParams,
} from "next/navigation";
import {
    Sparkles,
    Check,
    Lock,
    BookOpen,
    FileText,
    ShieldCheck,
    Clock,
    Languages,
    GraduationCap,
    ChevronDown,
    ArrowRight,
    ArrowLeft,
    Tag,
    CreditCard,
    Bell,
    Download,
    ExternalLink,
    CircleCheck,
    AlertCircle,
    Loader2,
    Newspaper,
    Repeat,
} from "lucide-react";

/* =====================================================
   FONTS
   Editorial serif for display type, a quiet grotesk for
   UI and body copy. This pairing is specific to a
   current-affairs / print-magazine subject matter.
===================================================== */

const display = Fraunces({
    subsets: ["latin"],
    weight: ["500", "600", "700", "900"],
    style: ["normal", "italic"],
    variable: "--font-display",
});

const body = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-body",
});

/* =====================================================
   CONFIG / UTILITIES
   Preserves the existing backend contract exactly.
===================================================== */

const API_URL = "http://15.252.146.207:5000/api/v1";

const getToken = () => {
    if (typeof window === "undefined") {
        return null;
    }

    return localStorage.getItem("accessToken");
};

const clearSession = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

const money = (value, currency = "INR") => {
    const amount = Number(value || 0);

    if (currency === "INR") {
        return `₹${amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }

    return `${currency} ${amount.toFixed(2)}`;
};

const findPurchaseForId = (purchases, id) =>
    purchases.find((purchase) => {
        const purchaseId =
            purchase.currentAffairsId ??
            purchase.current_affairs_id ??
            purchase.itemId ??
            purchase.courseId;

        return String(purchaseId) === String(id);
    });

/* =====================================================
   PRIMITIVES
===================================================== */

function Eyebrow({ children }) {
    return (
        <p className="text-[13px] font-semibold tracking-wide text-[#2457FF]">
            {children}
        </p>
    );
}

function SectionHeading({ title, subtitle, dark = false }) {
    return (
        <div className="mb-8 max-w-2xl">
            <h2
                className={`font-[family-name:var(--font-display)] text-[28px] sm:text-[34px] leading-[1.1] font-semibold ${
                    dark ? "text-white" : "text-[#111318]"
                }`}
            >
                {title}
            </h2>

            {subtitle && (
                <p
                    className={`mt-3 text-[15px] leading-7 ${
                        dark ? "text-white/70" : "text-[#5B5A55]"
                    }`}
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
}

function Panel({ children, className = "" }) {
    return (
        <section
            className={`bg-white rounded-[6px] border border-[#E4E1D8] p-6 sm:p-10 ${className}`}
        >
            {children}
        </section>
    );
}

/* =====================================================
   PRICE BREAKDOWN
===================================================== */

function PriceBreakdown({ course, offerPreview, currency, discount, total, isFree }) {
    if (isFree) return null;

    const base =
        offerPreview?.base ??
        course?.pricing?.breakdown?.base ??
        course?.pricing?.basePrice ??
        0;

    const gst =
        offerPreview?.gst ?? course?.pricing?.breakdown?.gst ?? 0;

    const platform =
        offerPreview?.platform ??
        course?.pricing?.breakdown?.platform ??
        0;

    const rows = [
        { label: "Course price", value: base },
        discount > 0
            ? { label: "Discount", value: -discount, positive: true }
            : null,
        { label: "GST", value: gst },
        { label: "Platform charge", value: platform },
    ].filter(Boolean);

    return (
        <div className="mt-6 rounded-[6px] bg-[#F7F4ED] border border-[#E4E1D8] p-5">
            <div className="space-y-2.5 text-[14px]">
                {rows.map((row) => (
                    <div
                        key={row.label}
                        className="flex items-center justify-between"
                    >
                        <span className="text-[#5B5A55]">{row.label}</span>

                        <span
                            className={`font-semibold tabular-nums ${
                                row.positive
                                    ? "text-[#2E7D46]"
                                    : "text-[#111318]"
                            }`}
                        >
                            {row.value < 0 ? "− " : ""}
                            {money(Math.abs(row.value), currency)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[#D9D6CE] flex items-center justify-between">
                <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold text-[#111318]">
                    You pay
                </span>

                <span className="font-[family-name:var(--font-display)] text-[22px] font-semibold text-[#111318] tabular-nums">
                    {money(total, currency)}
                </span>
            </div>
        </div>
    );
}

/* =====================================================
   OFFER CODE BOX
===================================================== */

function OfferCodeBox({
    offerCode,
    setOfferCode,
    onApply,
    loading,
    error,
    preview,
    onClear,
    currency,
}) {
    return (
        <div className="mt-6">
            <label
                htmlFor="offer-code"
                className="block text-[13px] font-semibold text-[#111318] mb-2"
            >
                Offer code
            </label>

            <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                    <Tag
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C9A91]"
                        aria-hidden="true"
                    />

                    <input
                        id="offer-code"
                        value={offerCode}
                        onChange={(e) => {
                            setOfferCode(e.target.value);
                            onClear();
                        }}
                        placeholder="Enter code"
                        className="w-full pl-10 pr-4 py-3 rounded-[6px] border border-[#D9D6CE] bg-white text-[15px] text-[#111318] outline-none focus:border-[#2457FF] focus-visible:ring-2 focus-visible:ring-[#2457FF]/30 transition"
                    />
                </div>

                <button
                    type="button"
                    onClick={onApply}
                    disabled={loading}
                    className="shrink-0 px-5 py-3 rounded-[6px] border border-[#111318] bg-white text-[#111318] font-semibold text-[14px] hover:bg-[#111318] hover:text-white disabled:opacity-50 disabled:pointer-events-none transition inline-flex items-center gap-2"
                >
                    {loading && (
                        <Loader2
                            className="w-4 h-4 animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    Apply
                </button>
            </div>

            {error && (
                <p
                    role="alert"
                    className="mt-2 text-[13px] text-[#C4432B] flex items-center gap-1.5"
                >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {error}
                </p>
            )}

            {preview && (
                <p className="mt-2 text-[13px] text-[#2E7D46] font-semibold flex items-center gap-1.5">
                    <CircleCheck className="w-3.5 h-3.5 shrink-0" />
                    Code applied — final total {money(preview.total, currency)}
                </p>
            )}
        </div>
    );
}

/* =====================================================
   DOCUMENT CARD
===================================================== */

function DocumentCard({ doc, index, locked, token }) {
    const url =
        typeof doc === "string" ? doc : doc?.downloadUrl || doc?.url;

    const name =
        typeof doc === "string"
            ? `Document ${index + 1}`
            : doc?.name || `Document ${index + 1}`;

    const type = typeof doc === "object" ? doc?.type : null;
    const date = typeof doc === "object" ? doc?.date : null;

    if (locked) {
        return (
            <div className="flex items-center gap-4 rounded-[6px] border border-[#E4E1D8] bg-[#F7F4ED] p-4">
                <div className="w-10 h-10 rounded-full bg-white border border-[#D9D6CE] flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-[#9C9A91]" />
                </div>

                <div className="min-w-0">
                    <p className="font-semibold text-[#111318] text-[14px] truncate">
                        {name}
                    </p>

                    <p className="text-[12.5px] text-[#9C9A91] mt-0.5">
                        Purchase required to access
                    </p>
                </div>
            </div>
        );
    }

    if (!url) {
        return (
            <div className="flex items-center gap-4 rounded-[6px] border border-[#D9D6CE] bg-white p-4">
                <div className="w-10 h-10 rounded-full bg-[#B7D65A]/25 flex items-center justify-center shrink-0">
                    <Loader2 className="w-4 h-4 text-[#5B6B2A] animate-spin" />
                </div>

                <div className="min-w-0">
                    <p className="font-semibold text-[#111318] text-[14px] truncate">
                        {name}
                    </p>
                    <p className="text-[12.5px] text-[#9C9A91] mt-0.5">
                        Preparing access
                    </p>
                </div>
            </div>
        );
    }

    const href = `${url}${
        url.includes("?") ? "&" : "?"
    }access_token=${encodeURIComponent(token || "")}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-[6px] border border-[#D9D6CE] bg-white p-4 hover:border-[#2457FF] transition group"
        >
            <div className="w-10 h-10 rounded-full bg-[#2457FF]/10 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-[#2457FF]" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#111318] text-[14px] truncate">
                    {name}
                </p>

                <p className="text-[12.5px] text-[#2E7D46] mt-0.5 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Available
                    {type ? ` · ${type}` : ""}
                    {date ? ` · ${date}` : ""}
                </p>
            </div>

            <ExternalLink className="w-4 h-4 text-[#9C9A91] group-hover:text-[#2457FF] transition shrink-0" />
        </a>
    );
}

/* =====================================================
   SERVER-DRIVEN SECTIONS
===================================================== */

function FAQItem({ item }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="border-b border-[#E4E1D8] last:border-0">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="w-full py-5 flex items-center justify-between gap-6 text-left"
            >
                <span className="font-semibold text-[15px] text-[#111318]">
                    {item?.question}
                </span>

                <ChevronDown
                    className={`w-4.5 h-4.5 shrink-0 text-[#9C9A91] transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            <div
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
            >
                <div className="overflow-hidden">
                    <p className="pb-5 text-[14.5px] leading-7 text-[#5B5A55]">
                        {item?.answer}
                    </p>
                </div>
            </div>
        </div>
    );
}

function RenderSection({ section }) {
    if (!section?.enabled) {
        return null;
    }

    const content = section.content || {};

    switch (section.key) {
        case "HIGHLIGHTS": {
            const items = content.items || [];

            return (
                <Panel>
                    <SectionHeading
                        title={content.heading || "Why this pack works"}
                    />

                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
                        {items.map((item, index) => (
                            <div key={index} className="flex gap-4">
                                <Check className="w-5 h-5 text-[#2457FF] shrink-0 mt-0.5" />
                                <p className="text-[15px] leading-7 text-[#33322E]">
                                    {String(item)}
                                </p>
                            </div>
                        ))}
                    </div>
                </Panel>
            );
        }

        case "EXAM_COVERAGE": {
            const groups = [
                ["Exams", content.exams, GraduationCap],
                ["Subjects", content.subjects, BookOpen],
                ["Languages", content.languages, Languages],
            ];

            return (
                <Panel>
                    <SectionHeading
                        title={content.heading || "Exam coverage"}
                    />

                    <div className="grid md:grid-cols-3 gap-6">
                        {groups.map(([label, values, Icon]) => (
                            <div key={label}>
                                <div className="flex items-center gap-2 text-[#5B5A55]">
                                    <Icon className="w-4 h-4" />
                                    <p className="text-[12.5px] font-semibold uppercase tracking-wide">
                                        {label}
                                    </p>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {(Array.isArray(values)
                                        ? values
                                        : []
                                    ).map((value) => (
                                        <span
                                            key={value}
                                            className="px-3 py-1.5 rounded-[4px] border border-[#D9D6CE] bg-[#F7F4ED] text-[13.5px] font-medium text-[#111318]"
                                        >
                                            {value}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {content.frequency && (
                        <div className="mt-6 pt-6 border-t border-[#E4E1D8] flex items-center gap-3">
                            <Repeat className="w-4 h-4 text-[#2457FF]" />
                            <p className="text-[14px] text-[#33322E]">
                                Updated{" "}
                                <span className="font-semibold text-[#111318]">
                                    {content.frequency}
                                </span>
                            </p>
                        </div>
                    )}
                </Panel>
            );
        }

        case "DELIVERABLES": {
            const items = content.items || [];

            return (
                <Panel>
                    <SectionHeading
                        title={content.heading || "Everything included"}
                    />

                    <div className="divide-y divide-[#E4E1D8]">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="py-5 first:pt-0 last:pb-0 flex items-start gap-5"
                            >
                                {item?.frequency && (
                                    <span className="shrink-0 mt-0.5 px-2.5 py-1 rounded-[4px] bg-[#111318] text-white text-[11px] font-bold uppercase tracking-wide">
                                        {item.frequency}
                                    </span>
                                )}

                                <div>
                                    <h3 className="font-semibold text-[15px] text-[#111318]">
                                        {item?.title || "Deliverable"}
                                    </h3>

                                    {item?.description && (
                                        <p className="mt-1.5 text-[14px] leading-6 text-[#5B5A55]">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Panel>
            );
        }

        case "SAMPLE_PREVIEW":
            if (!content.sampleUrl) return null;

            return (
                <section className="rounded-[6px] bg-[#111318] p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="max-w-lg">
                        <div className="flex items-center gap-2 text-[#B7D65A]">
                            <Sparkles className="w-4 h-4" />
                            <p className="text-[12.5px] font-semibold uppercase tracking-wide">
                                Free sample
                            </p>
                        </div>

                        <h2 className="mt-3 font-[family-name:var(--font-display)] text-[24px] sm:text-[28px] leading-tight font-semibold text-white">
                            {content.heading || "See the quality before you buy"}
                        </h2>

                        {content.description && (
                            <p className="mt-3 text-[14.5px] leading-7 text-white/65">
                                {content.description}
                            </p>
                        )}
                    </div>

                    <a
                        href={content.sampleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[6px] bg-[#B7D65A] text-[#111318] font-semibold text-[14.5px] hover:brightness-95 transition"
                    >
                        {content.cta || "Open free sample"}
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </section>
            );

        case "SMART_REVISION": {
            const stages = Array.isArray(content.stages)
                ? content.stages
                : null;

            return (
                <Panel>
                    <SectionHeading
                        title={content.heading || "Smart revision"}
                    />

                    <div className="grid md:grid-cols-3 gap-6 items-start">
                        {content.minutesPerDay != null && (
                            <div className="rounded-[6px] bg-[#F7F4ED] border border-[#E4E1D8] p-5">
                                <div className="flex items-center gap-2 text-[#5B5A55]">
                                    <Clock className="w-4 h-4" />
                                    <p className="text-[12.5px] font-semibold uppercase tracking-wide">
                                        Daily time
                                    </p>
                                </div>

                                <p className="mt-2 font-[family-name:var(--font-display)] text-[34px] font-semibold text-[#111318] leading-none">
                                    {content.minutesPerDay}
                                    <span className="text-[15px] font-semibold ml-1">
                                        min
                                    </span>
                                </p>
                            </div>
                        )}

                        {content.workflow && (
                            <div className="md:col-span-2 rounded-[6px] bg-[#F7F4ED] border border-[#E4E1D8] p-5">
                                <p className="text-[12.5px] font-semibold uppercase tracking-wide text-[#5B5A55]">
                                    Workflow
                                </p>

                                <p className="mt-2 text-[14.5px] leading-7 text-[#33322E]">
                                    {content.workflow}
                                </p>
                            </div>
                        )}
                    </div>

                    {stages && stages.length > 0 && (
                        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
                            {stages.map((stage, index) => (
                                <div
                                    key={stage}
                                    className="flex items-center gap-3"
                                >
                                    <span className="px-3 py-1.5 rounded-[4px] border border-[#D9D6CE] text-[13px] font-semibold text-[#111318]">
                                        {stage}
                                    </span>

                                    {index < stages.length - 1 && (
                                        <ArrowRight className="w-3.5 h-3.5 text-[#9C9A91]" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {Array.isArray(content.features) &&
                        content.features.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {content.features.map((feature) => (
                                    <span
                                        key={feature}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#B7D65A]/20 text-[#4C5A22] text-[13px] font-semibold"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        )}
                </Panel>
            );
        }

        case "PRACTICE": {
            const metrics = [
                ["Daily MCQs", content.dailyMcqs],
                ["Mock tests", content.mockTests],
                [
                    "Answer writing",
                    content.answerWriting != null
                        ? content.answerWriting
                            ? "Yes"
                            : "No"
                        : null,
                ],
                [
                    "Analytics",
                    content.performanceAnalytics != null
                        ? content.performanceAnalytics
                            ? "Yes"
                            : "No"
                        : null,
                ],
            ].filter(([, value]) => value != null && value !== "");

            if (metrics.length === 0) return null;

            return (
                <Panel>
                    <SectionHeading
                        title={content.heading || "Practice & assessment"}
                        subtitle={content.description}
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {metrics.map(([label, value]) => (
                            <div key={label}>
                                <p className="font-[family-name:var(--font-display)] text-[32px] font-semibold text-[#111318] leading-none">
                                    {value}
                                </p>

                                <p className="mt-2 text-[13px] font-medium text-[#5B5A55]">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </Panel>
            );
        }

        case "TRUST": {
            const rows = [
                ["Expert", content.expert],
                ["Source policy", content.sourcePolicy],
                ["Freshness promise", content.freshnessPromise],
                ["Assurance", content.guarantee],
            ].filter(([, value]) => Boolean(value));

            if (rows.length === 0) return null;

            return (
                <Panel>
                    <div className="flex items-center gap-2 mb-8">
                        <ShieldCheck className="w-5 h-5 text-[#2457FF]" />
                        <h2 className="font-[family-name:var(--font-display)] text-[28px] sm:text-[34px] leading-[1.1] font-semibold text-[#111318]">
                            {content.heading || "Editorial trust"}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
                        {rows.map(([label, value]) => (
                            <div
                                key={label}
                                className="pb-6 border-b border-[#E4E1D8] md:border-b-0 md:pb-0"
                            >
                                <p className="text-[12.5px] font-semibold uppercase tracking-wide text-[#5B5A55]">
                                    {label}
                                </p>

                                <p className="mt-2 text-[14.5px] leading-7 text-[#33322E]">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>
                </Panel>
            );
        }

        case "MENTOR_SUPPORT":
            if (!content.faculty && !content.description) return null;

            return (
                <Panel>
                    <SectionHeading
                        title={content.heading || "Mentor support"}
                    />

                    <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
                        {content.avatarUrl ? (
                            <img
                                src={content.avatarUrl}
                                alt={content.faculty || "Mentor"}
                                className="w-20 h-20 rounded-full object-cover border border-[#E4E1D8] shrink-0"
                            />
                        ) : (
                            content.faculty && (
                                <div className="w-20 h-20 rounded-full bg-[#111318] text-white flex items-center justify-center shrink-0 font-[family-name:var(--font-display)] text-2xl font-semibold">
                                    {content.faculty.charAt(0)}
                                </div>
                            )
                        )}

                        <div>
                            {content.faculty && (
                                <h3 className="font-[family-name:var(--font-display)] text-[20px] font-semibold text-[#111318]">
                                    {content.faculty}
                                </h3>
                            )}

                            {content.experience && (
                                <p className="mt-1 text-[13.5px] font-semibold text-[#2457FF]">
                                    {content.experience}
                                </p>
                            )}

                            {content.mode && (
                                <p className="mt-2 text-[13.5px] text-[#5B5A55]">
                                    Mode:{" "}
                                    <span className="font-semibold text-[#111318]">
                                        {content.mode}
                                    </span>
                                </p>
                            )}

                            {content.description && (
                                <p className="mt-3 text-[14.5px] leading-7 text-[#33322E]">
                                    {content.description}
                                </p>
                            )}
                        </div>
                    </div>
                </Panel>
            );

        case "FAQ": {
            const items = content.items || [];
            if (items.length === 0) return null;

            return (
                <Panel>
                    <SectionHeading
                        title={content.heading || "Questions, answered"}
                    />

                    <div>
                        {items.map((item, index) => (
                            <FAQItem key={index} item={item} />
                        ))}
                    </div>
                </Panel>
            );
        }

        case "PURCHASE_CTA":
            return null;

        default:
            // Unknown backend section keys are ignored for forward
            // compatibility — new modules won't break this page.
            return null;
    }
}

/* =====================================================
   LOADING / ERROR STATES
===================================================== */

function SkeletonBlock({ className }) {
    return (
        <div
            className={`rounded-[6px] bg-[#EDEAE1] relative overflow-hidden ${className}`}
        >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
    );
}

function SkeletonPage() {
    return (
        <main className="min-h-screen bg-[#F7F4ED] pt-24 pb-24 px-4 sm:px-6">
            <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>

            <div className="max-w-6xl mx-auto">
                <SkeletonBlock className="h-4 w-32 mb-8" />

                <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10">
                    <div>
                        <SkeletonBlock className="h-4 w-24 mb-4" />
                        <SkeletonBlock className="h-12 w-full mb-3" />
                        <SkeletonBlock className="h-12 w-4/5 mb-6" />
                        <SkeletonBlock className="h-4 w-full mb-2" />
                        <SkeletonBlock className="h-4 w-3/4 mb-8" />
                        <SkeletonBlock className="h-72 w-full" />
                    </div>

                    <SkeletonBlock className="h-[420px] w-full" />
                </div>

                <div className="mt-10 space-y-6">
                    <SkeletonBlock className="h-48 w-full" />
                    <SkeletonBlock className="h-48 w-full" />
                </div>
            </div>
        </main>
    );
}

function ErrorState({ title, description, actionLabel, onAction }) {
    return (
        <main className="min-h-screen bg-[#F7F4ED] pt-32 px-4">
            <div className="max-w-lg mx-auto text-center">
                <div className="w-14 h-14 rounded-full bg-[#111318] text-white flex items-center justify-center mx-auto">
                    <Newspaper className="w-6 h-6" />
                </div>

                <h1 className="mt-6 font-[family-name:var(--font-display)] text-[26px] font-semibold text-[#111318]">
                    {title}
                </h1>

                <p className="mt-3 text-[14.5px] leading-7 text-[#5B5A55]">
                    {description}
                </p>

                {onAction && (
                    <button
                        onClick={onAction}
                        className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-[6px] bg-[#111318] text-white font-semibold text-[14px] hover:bg-[#2457FF] transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {actionLabel}
                    </button>
                )}
            </div>
        </main>
    );
}

/* =====================================================
   MAIN PAGE
===================================================== */

export default function CurrentAffairsDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const id = params?.id;

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [purchases, setPurchases] = useState([]);
    const [checkingPurchase, setCheckingPurchase] = useState(false);
    const [verifyingPayment, setVerifyingPayment] = useState(false);
    const [paymentNotice, setPaymentNotice] = useState("");

    const [buying, setBuying] = useState(false);
    const [buyError, setBuyError] = useState("");

    const [offerCode, setOfferCode] = useState("");
    const [offerLoading, setOfferLoading] = useState(false);
    const [offerError, setOfferError] = useState("");
    const [offerPreview, setOfferPreview] = useState(null);

    const [scrolledPastHero, setScrolledPastHero] = useState(false);

    /* Reusable redirect-to-login helper. Preserves the existing
       redirect-back-here contract used across the page. */
    const redirectToLogin = useCallback(() => {
        router.push(`/auth/number?redirect=/current-affairs/${id}`);
    }, [router, id]);

    /* =========================================
       LOAD DETAIL
    ========================================= */

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            try {
                setLoading(true);
                setLoadError("");

                const response = await fetch(
                    `${API_URL}/current-affairs/${encodeURIComponent(id)}`,
                    {
                        headers: { Accept: "application/json" },
                        cache: "no-store",
                    }
                );

                const payload = await response.json();

                if (!response.ok || !payload?.success) {
                    throw new Error(
                        payload?.message ||
                            `Detail request failed: ${response.status}`
                    );
                }

                setCourse(payload.data || null);
            } catch (error) {
                console.error("Current Affairs Detail Error:", error);
                setCourse(null);
                setLoadError(
                    error.message ||
                        "Current Affairs load nahi ho paya."
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    useEffect(() => {
        if (typeof document !== "undefined" && course?.name) {
            document.title = `${course.name} | Current Affairs`;
        }
    }, [course?.name]);

    /* =========================================
       LOAD PURCHASES
       401/403 now clears the session and sends the
       user back through login, consistent with the
       rest of the page — fixes stale/expired tokens
       silently failing this call.
    ========================================= */

    const loadPurchases = useCallback(async () => {
        const accessToken = getToken();

        if (!accessToken) {
            return [];
        }

        try {
            setCheckingPurchase(true);

            const response = await fetch(
                `${API_URL}/payments/purchases`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    cache: "no-store",
                }
            );

            if (response.status === 401 || response.status === 403) {
                clearSession();
                setPurchases([]);
                return [];
            }

            const payload = await response.json();

            if (!response.ok || !payload?.success) {
                return [];
            }

            const list = payload.data || payload.purchases || [];
            const safeList = Array.isArray(list) ? list : [];

            setPurchases(safeList);
            return safeList;
        } catch (error) {
            console.error("Purchase load error:", error);
            return [];
        } finally {
            setCheckingPurchase(false);
        }
    }, []);

    useEffect(() => {
        loadPurchases();
    }, [id, loadPurchases]);

    /* =========================================
       FIND OWNED PURCHASE
    ========================================= */

    const ownedPurchase = useMemo(
        () => findPurchaseForId(purchases, id),
        [purchases, id]
    );

    const documents = useMemo(() => {
        if (!ownedPurchase) return [];
        return ownedPurchase.documents || ownedPurchase.documentUrls || [];
    }, [ownedPurchase]);

    const isOwned = Boolean(ownedPurchase);

    const refundInfo = useMemo(() => {
        if (!ownedPurchase) return null;

        const status =
            ownedPurchase.refundStatus ??
            ownedPurchase.refund_status ??
            ownedPurchase.refund?.status;

        const amount =
            ownedPurchase.refundAmount ??
            ownedPurchase.refund_amount ??
            ownedPurchase.refund?.amount;

        if (!status && !amount) return null;

        return { status, amount };
    }, [ownedPurchase]);

    const notifications = useMemo(() => {
        const list = Array.isArray(course?.notifications)
            ? course.notifications
            : [];
        return list.filter((n) => n && (n.title || n.description));
    }, [course]);

    /* =========================================
       VERIFY RETURNED ORDER
    ========================================= */

    useEffect(() => {
        const orderId = searchParams?.get("order_id");
        const accessToken = getToken();

        if (!orderId || !accessToken) return;

        let cancelled = false;

        const verifyOrder = async () => {
            try {
                setVerifyingPayment(true);
                setCheckingPurchase(true);
                setPaymentNotice("Verifying your payment…");

                const response = await fetch(
                    `${API_URL}/payments/orders/${encodeURIComponent(orderId)}`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                        cache: "no-store",
                    }
                );

                if (response.status === 401 || response.status === 403) {
                    clearSession();
                    if (!cancelled) redirectToLogin();
                    return;
                }

                const payload = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(
                        payload?.message ||
                            `Order verification failed (${response.status})`
                    );
                }

                const orderStatus = String(
                    payload?.data?.status || payload?.status || ""
                ).toUpperCase();

                if (orderStatus === "FAILED" || orderStatus === "CANCELLED") {
                    if (!cancelled) {
                        setPaymentNotice("");
                        setBuyError(
                            "Payment was not completed. You can try again."
                        );
                    }
                    return;
                }

                let found = false;

                for (let attempt = 0; attempt < 10; attempt++) {
                    if (cancelled) return;

                    const list = await loadPurchases();
                    found = Boolean(findPurchaseForId(list, id));

                    if (found) break;

                    await new Promise((resolve) => setTimeout(resolve, 1500));
                }

                if (!cancelled) {
                    setPaymentNotice(
                        found
                            ? ""
                            : "Payment is being confirmed. This can take a minute — refresh shortly."
                    );
                }

                if (!found) {
                    console.warn(
                        "Order verified but purchase is not visible yet."
                    );
                }
            } catch (error) {
                console.error("Order verification error:", error);
                if (!cancelled) {
                    setPaymentNotice("");
                    setBuyError(
                        error.message ||
                            "Could not verify your payment. Please refresh."
                    );
                }
            } finally {
                if (!cancelled) {
                    setCheckingPurchase(false);
                    setVerifyingPayment(false);
                }
            }
        };

        verifyOrder();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, id]);

    /* =========================================
       VALIDATE OFFER
       Fixes the reported bug: 401/403 responses
       (expired/invalid token) are now handled the
       same way as everywhere else on this page —
       the session is cleared and the user is sent
       back through login instead of surfacing a
       raw "Invalid or expired access token" error.
    ========================================= */

    const validateOffer = async () => {
        const code = offerCode.trim();

        if (!code) {
            setOfferError("Enter an offer code first.");
            return;
        }

        const accessToken = getToken();

        if (!accessToken) {
            redirectToLogin();
            return;
        }

        try {
            setOfferLoading(true);
            setOfferError("");
            setOfferPreview(null);

            const response = await fetch(
                `${API_URL}/payments/offers/validate`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        currentAffairsId: Number(id),
                        offerCode: code,
                    }),
                }
            );

            if (response.status === 401 || response.status === 403) {
                clearSession();
                redirectToLogin();
                return;
            }

            const payload = await response.json();

            if (!response.ok || !payload?.success) {
                throw new Error(payload?.message || "Offer code invalid.");
            }

            setOfferPreview(payload.priceBreakdown || null);
        } catch (error) {
            console.error("Offer validation error:", error);
            setOfferError(
                error.message || "Offer code validate nahi hua."
            );
        } finally {
            setOfferLoading(false);
        }
    };

    /* =========================================
       BUY NOW
    ========================================= */

    const handleBuyNow = async () => {
        if (buying || isOwned) return;

        const accessToken = getToken();

        if (!accessToken) {
            redirectToLogin();
            return;
        }

        try {
            setBuying(true);
            setBuyError("");

            const requestBody = { currentAffairsId: Number(id) };

            if (offerCode.trim()) {
                requestBody.offerCode = offerCode.trim();
            }

            const response = await fetch(`${API_URL}/payments/orders`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (response.status === 401 || response.status === 403) {
                clearSession();
                redirectToLogin();
                return;
            }

            const payload = await response.json().catch(() => ({}));

            if (!response.ok || !payload?.success) {
                throw new Error(
                    payload?.message ||
                        payload?.error ||
                        `Payment order failed (${response.status})`
                );
            }

            const paymentSessionId =
                payload?.cashfree?.paymentSessionId ||
                payload?.paymentSessionId ||
                payload?.data?.paymentSessionId;

            if (!paymentSessionId) {
                throw new Error("Cashfree payment session nahi mila.");
            }

            const environment = String(
                payload?.cashfree?.environment || "SANDBOX"
            ).toUpperCase();

            if (typeof window === "undefined" || !window.Cashfree) {
                throw new Error(
                    "Cashfree SDK load nahi hua. Page refresh karke dobara try karo."
                );
            }

            const cashfree = window.Cashfree({
                mode: environment === "PRODUCTION" ? "production" : "sandbox",
            });

            await cashfree.checkout({
                paymentSessionId,
                redirectTarget: "_self",
            });
        } catch (error) {
            console.error("Buy Now Error:", error);
            setBuyError(error.message || "Payment start nahi ho pa raha.");
        } finally {
            setBuying(false);
        }
    };

    /* =========================================
       SCROLL LISTENER FOR STICKY BAR
    ========================================= */

    useEffect(() => {
        const onScroll = () => setScrolledPastHero(window.scrollY > 560);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* =========================================
       LOADING / NOT FOUND
    ========================================= */

    if (loading) {
        return <SkeletonPage />;
    }

    if (!course) {
        return (
            <ErrorState
                title={
                    loadError && !loadError.toLowerCase().includes("not")
                        ? "Couldn't load Current Affairs"
                        : "Current Affairs not found"
                }
                description={
                    loadError ||
                    "This item may be unpublished, expired, or unavailable."
                }
                actionLabel="Back to Current Affairs"
                onAction={() => router.push("/current-affairs")}
            />
        );
    }

    /* =========================================
       DERIVED VALUES
    ========================================= */

    const sections = [...(course.sections || [])]
        .filter((section) => section?.enabled !== false)
        .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));

    const currency =
        course.pricing?.breakdown?.currency ||
        course.pricing?.currency ||
        "INR";

    const basePrice = Number(
        course.pricing?.breakdown?.base ?? course.pricing?.basePrice ?? 0
    );

    const discount = Number(
        offerPreview?.discount ?? course.pricing?.breakdown?.discount ?? 0
    );

    const total = Number(
        offerPreview?.total ?? course.pricing?.breakdown?.total ?? basePrice
    );

    const purchaseType = course.purchase?.type || "PAID";
    const isFree = purchaseType === "FREE" || total <= 0;

    const purchaseCta =
        sections.find((section) => section.key === "PURCHASE_CTA")
            ?.content || {};

    const highlightsContent = sections.find(
        (s) => s.key === "HIGHLIGHTS"
    )?.content;

    const badges = [
        course.exams?.length ? `${course.exams.length} exams` : null,
        course.languages?.length
            ? course.languages.join(", ")
            : null,
        course.updateFrequency || course.pricing?.frequency,
    ].filter(Boolean);

    const buyLabel = isFree ? "Get access" : "Buy now";

    return (
        <>
            <Script
                src="https://sdk.cashfree.com/js/v3/cashfree.js"
                strategy="afterInteractive"
            />

            <main
                className={`${display.variable} ${body.variable} min-h-screen bg-[#F7F4ED] pt-20 pb-32 px-4 sm:px-6 font-[family-name:var(--font-body)]`}
            >
                <div className="max-w-6xl mx-auto">
                    {/* BACK */}
                    <button
                        onClick={() => router.push("/current-affairs")}
                        className="mb-8 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#5B5A55] hover:text-[#111318] transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Current Affairs
                    </button>

                    {/* =================================
                        HERO
                    ================================= */}

                    <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-10 items-start">
                        {/* LEFT */}
                        <div>
                            <Eyebrow>Current Affairs</Eyebrow>

                            <h1 className="mt-3 font-[family-name:var(--font-display)] text-[38px] sm:text-[48px] leading-[1.05] font-semibold text-[#111318]">
                                {course.name}
                            </h1>

                            <p className="mt-5 text-[16px] leading-8 text-[#5B5A55] max-w-lg">
                                {course.description?.long ||
                                    course.description?.short ||
                                    "Complete exam-oriented Current Affairs preparation."}
                            </p>

                            {badges.length > 0 && (
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {badges.map((badge) => (
                                        <span
                                            key={badge}
                                            className="px-3 py-1.5 rounded-[4px] border border-[#D9D6CE] bg-white text-[13px] font-medium text-[#33322E]"
                                        >
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {Array.isArray(highlightsContent?.items) &&
                                highlightsContent.items.length > 0 && (
                                    <ul className="mt-8 space-y-3">
                                        {highlightsContent.items
                                            .slice(0, 4)
                                            .map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="flex gap-3 text-[14.5px] text-[#33322E]"
                                                >
                                                    <Check className="w-4.5 h-4.5 text-[#2457FF] shrink-0 mt-0.5" />
                                                    {String(item)}
                                                </li>
                                            ))}
                                    </ul>
                                )}

                            <div className="mt-10 hidden lg:block relative h-[300px] rounded-[6px] overflow-hidden border border-[#E4E1D8]">
                                {course.imageUrl ? (
                                    <img
                                        src={course.imageUrl}
                                        alt={course.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#111318] flex items-center justify-center">
                                        <Newspaper className="w-10 h-10 text-white/30" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PURCHASE PANEL */}
                        <div className="bg-white rounded-[6px] border border-[#E4E1D8] p-6 sm:p-8 lg:sticky lg:top-24">
                            <div className="lg:hidden relative h-[200px] rounded-[6px] overflow-hidden border border-[#E4E1D8] mb-6 -mt-1">
                                {course.imageUrl ? (
                                    <img
                                        src={course.imageUrl}
                                        alt={course.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#111318] flex items-center justify-center">
                                        <Newspaper className="w-8 h-8 text-white/30" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-[12.5px] font-semibold uppercase tracking-wide text-[#5B5A55]">
                                        Final price
                                    </p>

                                    <p className="mt-1 font-[family-name:var(--font-display)] text-[36px] font-semibold text-[#111318] leading-none">
                                        {isFree ? "Free" : money(total, currency)}
                                    </p>
                                </div>

                                {discount > 0 && !isFree && (
                                    <span className="px-2.5 py-1.5 rounded-[4px] bg-[#B7D65A]/25 text-[#4C5A22] text-[12.5px] font-bold">
                                        Save {money(discount, currency)}
                                    </span>
                                )}
                            </div>

                            <PriceBreakdown
                                course={course}
                                offerPreview={offerPreview}
                                currency={currency}
                                discount={discount}
                                total={total}
                                isFree={isFree}
                            />

                            {!isOwned && !isFree && (
                                <OfferCodeBox
                                    offerCode={offerCode}
                                    setOfferCode={setOfferCode}
                                    onApply={validateOffer}
                                    loading={offerLoading}
                                    error={offerError}
                                    preview={offerPreview}
                                    currency={currency}
                                    onClear={() => {
                                        setOfferPreview(null);
                                        setOfferError("");
                                    }}
                                />
                            )}

                            {paymentNotice && (
                                <div className="mt-6 rounded-[6px] border border-[#2457FF]/30 bg-[#2457FF]/5 p-4 flex items-start gap-3">
                                    <Loader2 className="w-4 h-4 text-[#2457FF] animate-spin shrink-0 mt-0.5" />
                                    <p className="text-[13.5px] text-[#111318]">
                                        {paymentNotice}
                                    </p>
                                </div>
                            )}

                            {buyError && (
                                <div className="mt-6 rounded-[6px] border border-[#F0C7BC] bg-[#FDF3F0] p-4">
                                    <p className="font-semibold text-[13.5px] text-[#C4432B] flex items-center gap-1.5">
                                        <AlertCircle className="w-4 h-4" />
                                        Payment error
                                    </p>

                                    <p className="mt-1 text-[13.5px] text-[#A8442F]">
                                        {buyError}
                                    </p>
                                </div>
                            )}

                            {isOwned ? (
                                <div className="mt-6 rounded-[6px] border border-[#B7D65A]/50 bg-[#B7D65A]/12 p-5">
                                    <p className="font-semibold text-[14.5px] text-[#4C5A22] flex items-center gap-1.5">
                                        <CircleCheck className="w-4.5 h-4.5" />
                                        Purchased — unlocked
                                    </p>

                                    <p className="mt-1 text-[13px] text-[#4C5A22]/80">
                                        Verified by the server.
                                    </p>

                                    {refundInfo && (
                                        <p className="mt-3 pt-3 border-t border-[#B7D65A]/40 text-[13px] text-[#4C5A22]">
                                            Refund:{" "}
                                            <span className="font-semibold">
                                                {refundInfo.status || "Processing"}
                                                {refundInfo.amount
                                                    ? ` · ${money(refundInfo.amount, currency)}`
                                                    : ""}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleBuyNow}
                                        disabled={
                                            buying ||
                                            course.status !== "PUBLISHED" ||
                                            course.purchase?.available === false
                                        }
                                        className="mt-6 w-full py-4 rounded-[6px] bg-[#2457FF] text-white font-semibold text-[15.5px] hover:bg-[#1c47da] disabled:opacity-50 disabled:cursor-not-allowed transition inline-flex items-center justify-center gap-2"
                                    >
                                        {buying ? (
                                            <>
                                                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                                                Creating payment…
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-4.5 h-4.5" />
                                                {purchaseCta.buttonLabel || buyLabel}
                                            </>
                                        )}
                                    </button>

                                    {course.purchase?.requiresLogin && (
                                        <p className="mt-3 text-center text-[12px] text-[#9C9A91]">
                                            Login is required before purchase.
                                        </p>
                                    )}
                                </>
                            )}

                            {course.schedule && (
                                <div className="mt-6 pt-6 border-t border-[#E4E1D8] text-[13px] space-y-2">
                                    {course.schedule?.startDate && (
                                        <div className="flex justify-between gap-5">
                                            <span className="text-[#9C9A91]">Start</span>
                                            <span className="font-semibold text-[#33322E]">
                                                {new Date(
                                                    course.schedule.startDate
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}

                                    {course.schedule?.endDate && (
                                        <div className="flex justify-between gap-5">
                                            <span className="text-[#9C9A91]">End</span>
                                            <span className="font-semibold text-[#33322E]">
                                                {new Date(
                                                    course.schedule.endDate
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* =================================
                        PURCHASED CONTENT
                    ================================= */}

                    {isOwned && (
                        <section className="mt-10 bg-white rounded-[6px] border border-[#E4E1D8] p-6 sm:p-10">
                            <SectionHeading
                                title="Your content"
                                subtitle={
                                    documents.length === 0
                                        ? checkingPurchase
                                            ? "Checking for documents…"
                                            : "Documents will appear here as they're published."
                                        : undefined
                                }
                            />

                            {documents.length > 0 && (
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {documents.map((doc, index) => (
                                        <DocumentCard
                                            key={index}
                                            doc={doc}
                                            index={index}
                                            locked={false}
                                            token={getToken()}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* =================================
                        NOTIFICATIONS
                    ================================= */}

                    {notifications.length > 0 && (
                        <section className="mt-8 bg-white rounded-[6px] border border-[#E4E1D8] p-6 sm:p-10">
                            <div className="flex items-center gap-2 mb-6">
                                <Bell className="w-4.5 h-4.5 text-[#2457FF]" />
                                <h2 className="font-[family-name:var(--font-display)] text-[20px] font-semibold text-[#111318]">
                                    Course updates
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {notifications.map((n, index) => (
                                    <div
                                        key={index}
                                        className="border-l-2 border-[#2457FF] pl-4"
                                    >
                                        {n.title && (
                                            <p className="font-semibold text-[14.5px] text-[#111318]">
                                                {n.title}
                                            </p>
                                        )}

                                        {n.description && (
                                            <p className="mt-1 text-[13.5px] leading-6 text-[#5B5A55]">
                                                {n.description}
                                            </p>
                                        )}

                                        {(n.activeFrom || n.activePeriod) && (
                                            <p className="mt-1 text-[12px] text-[#9C9A91]">
                                                {n.activePeriod ||
                                                    `From ${n.activeFrom}`}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* =================================
                        ENABLED SECTIONS
                    ================================= */}

                    <div className="mt-10 space-y-6">
                        {sections.map((section) => (
                            <RenderSection
                                key={`${section.key}-${section.sortOrder}`}
                                section={section}
                            />
                        ))}
                    </div>

                    {/* =================================
                        LOCKED DOCUMENTS PREVIEW
                    ================================= */}

                    {!isOwned &&
                        Array.isArray(course.documents) &&
                        course.documents.length > 0 && (
                            <section className="mt-8 bg-white rounded-[6px] border border-[#E4E1D8] p-6 sm:p-10">
                                <SectionHeading
                                    title="Included documents"
                                    subtitle="Documents unlock after a verified purchase."
                                />

                                <div className="grid sm:grid-cols-2 gap-3">
                                    {course.documents.map((doc, index) => (
                                        <DocumentCard
                                            key={doc.id || index}
                                            doc={doc}
                                            index={index}
                                            locked
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                </div>
            </main>

            {/* =================================
                STICKY PURCHASE BAR
            ================================= */}

            {!isOwned && course.status === "PUBLISHED" && (
                <div
                    className={`fixed bottom-0 left-0 right-0 z-40 border-t border-[#E4E1D8] bg-white/97 backdrop-blur p-3 sm:p-4 transition-transform duration-200 ${
                        scrolledPastHero
                            ? "translate-y-0"
                            : "translate-y-0 sm:translate-y-full"
                    }`}
                >
                    <div className="max-w-6xl mx-auto flex items-center gap-4">
                        <div className="hidden sm:block flex-1 min-w-0">
                            <p className="font-[family-name:var(--font-display)] font-semibold text-[#111318] truncate">
                                {course.name}
                            </p>

                            <p className="text-[13px] text-[#5B5A55]">
                                {isFree ? "Free access" : money(total, currency)}
                                {discount > 0 && !isFree
                                    ? ` · saving ${money(discount, currency)}`
                                    : ""}
                            </p>
                        </div>

                        <button
                            onClick={handleBuyNow}
                            disabled={buying}
                            className="w-full sm:w-auto min-w-[180px] px-7 py-3.5 rounded-[6px] bg-[#2457FF] text-white font-semibold hover:bg-[#1c47da] disabled:opacity-50 transition inline-flex items-center justify-center gap-2"
                        >
                            {buying ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing…
                                </>
                            ) : (
                                purchaseCta.buttonLabel || buyLabel
                            )}
                        </button>
                    </div>
                </div>
            )}

            {isOwned && course.status === "PUBLISHED" && (
                <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E4E1D8] bg-white/97 backdrop-blur p-3 sm:p-4 sm:hidden">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            document
                                .getElementById("your-content")
                                ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="w-full py-3.5 rounded-[6px] bg-[#111318] text-white font-semibold flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Open my content
                    </a>
                </div>
            )}
        </>
    );
}