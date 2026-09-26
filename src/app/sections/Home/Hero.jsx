"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const EducationOrbit = dynamic(() => import("../Home/EducationOrbit"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-indigo-300/30 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-10 h-96 w-96 rounded-full bg-violet-300/30 blur-[120px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-6 pb-14 pt-24 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-20 lg:pt-28">
        <div className="relative z-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
            </span>
            Your Learning • Your Future
          </div>

          <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-slate-900 lg:text-7xl">
            Learn today.
            <span className="mt-2 block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Build tomorrow.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Courses, exam preparation and structured learning — all in one
            place. Build strong concepts and move confidently towards your
            goals.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/courses"
              className="rounded-2xl bg-slate-950 px-6 py-4 font-bold text-white shadow-lg shadow-indigo-500/10 transition hover:-translate-y-0.5"
            >
              Explore Courses →
            </Link>

            <Link
              href="/auth/number"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200"
            >
              Login
            </Link>
          </div>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-3">
            {["Courses", "Weekly Tests", "Guidance"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur"
              >
                <b className="text-sm text-slate-900">{item}</b>
                <p className="mt-1 text-xs text-slate-500">DNS learning</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-20 h-[440px] sm:h-[500px]">
          <div className="pointer-events-none absolute inset-0 z-10">
            <EducationOrbit />
          </div>

          <div className="absolute right-0 top-8 z-30 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-bold text-slate-900 shadow-xl backdrop-blur">
            Learn. Practice. Progress.
          </div>

          <div className="absolute bottom-6 left-4 z-30 rounded-2xl border border-indigo-100 bg-white/90 px-4 py-3 text-xs font-bold text-indigo-700 shadow-lg backdrop-blur">
            10th • 12th • Graduation • More
          </div>
        </div>
      </div>
    </section>
  );
}
