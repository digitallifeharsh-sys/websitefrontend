"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const EducationOrbit = dynamic(() => import("../Home/EducationOrbit"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section className="min-h-[88vh] overflow-hidden bg-[#f7f8fc]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-28 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-bold text-indigo-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            Your Board • Your Chance
          </div>

          <h1 className="mt-6 text-5xl font-black leading-[.98] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Pass Your 10th
            <br />
            &amp; 12th
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Your Success Starts Here
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Expert academic support, structured courses and exam preparation —
            all in one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/courses"
              className="rounded-2xl bg-indigo-600 px-6 py-4 font-bold text-white shadow-[0_12px_30px_rgba(79,70,229,.18)] transition hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              Explore Courses →
            </Link>

            <Link
              href="/auth/number"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600"
            >
              Login
            </Link>
          </div>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-3">
            {["Courses", "Weekly Tests", "Guidance"].map((x) => (
              <div
                key={x}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <b className="text-sm text-slate-900">{x}</b>
                <p className="mt-1 text-xs text-slate-500">DNS learning</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[480px]">
          <EducationOrbit />

          <div className="absolute right-4 top-16 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-xl">
            Learn. Practice. Progress.
          </div>
        </div>
      </div>
    </section>
  );
}
