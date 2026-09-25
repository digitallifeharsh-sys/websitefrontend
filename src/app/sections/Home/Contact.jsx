"use client";

import { BookOpen, MessageCircle, Phone, Target } from "lucide-react";

export default function Contact() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-600 to-violet-600 p-8 text-white shadow-[0_20px_60px_rgba(79,70,229,.16)] lg:col-span-2 lg:p-10">
            <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-white/15" />
            <div className="absolute right-8 top-8 h-28 w-28 rotate-12 rounded-3xl border border-white/15" />

            <p className="text-xs font-bold tracking-[.2em] text-indigo-100">
              NEED HELP?
            </p>
            <h2 className="mt-3 text-4xl font-black lg:text-5xl">
              Talk to DNS.
            </h2>
            <p className="mt-4 max-w-xl text-indigo-100">
              Course selection, admission help or learning support — contact
              our team directly.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <a href="tel:8920830582" className="rounded-2xl bg-white/15 p-4 transition hover:bg-white/20">
                <Phone size={19} />
                <b className="mt-3 block text-sm">Call</b>
                <span className="text-xs text-indigo-100">8920830582</span>
              </a>
              <a href="https://wa.me/918920830582" target="_blank" rel="noreferrer" className="rounded-2xl bg-white/15 p-4 transition hover:bg-white/20">
                <MessageCircle size={19} />
                <b className="mt-3 block text-sm">WhatsApp</b>
                <span className="text-xs text-indigo-100">Chat with us</span>
              </a>
              <a href="mailto:manishvermaclasses@gmail.com" className="rounded-2xl bg-white/15 p-4 transition hover:bg-white/20">
                <BookOpen size={19} />
                <b className="mt-3 block text-sm">Email</b>
                <span className="text-xs text-indigo-100">Send enquiry</span>
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Target size={21} />
            </div>
            <h3 className="mt-5 text-2xl font-black text-slate-950">
              Start learning
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Choose a course and complete your purchase online.
            </p>
            <a
              href="/courses"
              className="mt-8 block rounded-2xl bg-indigo-600 py-4 text-center font-bold text-white transition hover:bg-indigo-700"
            >
              Browse Courses →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
