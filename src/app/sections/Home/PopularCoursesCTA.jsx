"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function PopularCoursesCTA() {
  return (
    <section className="relative overflow-hidden bg-white py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-7 sm:p-10 shadow-[0_20px_70px_rgba(79,70,229,0.10)]">
          <div className="absolute -top-20 -right-16 h-48 w-48 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-violet-200/40 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-600">
                <Sparkles size={14} />
                Popular Courses
              </div>
              <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
                Apna course choose karo
              </h2>
              <p className="mt-2 text-slate-600">
                Complete course list, details aur purchase options ek hi jagah.
              </p>
            </div>

            <Link
              href="/courses"
              className="group shrink-0 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-600"
            >
              View Famous Courses
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
