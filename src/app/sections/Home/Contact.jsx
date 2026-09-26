"use client";

import { BookOpen, MessageCircle, Phone, Target } from "lucide-react";
import { motion } from "framer-motion";

const contactOptions = [
  {
    icon: Phone,
    title: "Call",
    text: "9711909570",
    href: "tel:9711909570",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    text: "Chat with us",
    href: "https://wa.me/919711909570",
  },
  {
    icon: BookOpen,
    title: "Email",
    text: "delhinationalopenschool@gmail.com",
    href: "mailto:delhinationalopenschool@gmail.com",
  },
];

export default function Contact() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-50 py-20 lg:py-28">
      <div className="pointer-events-none absolute left-[10%] top-0 h-80 w-80 rounded-full bg-indigo-300/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-[10%] top-20 h-80 w-80 rounded-full bg-violet-300/20 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-600"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-indigo-500" />
            </span>
            Need Help?
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-black leading-[0.95] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Talk to DNS.
            <span className="mt-2 block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              We’re Here to Help.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600"
          >
            Course selection, admission help or learning support —
            contact our team directly.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative lg:col-span-2"
          >
            <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[30px] border border-indigo-100 bg-indigo-50" />

            <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.07)] transition-all duration-500 group-hover:border-indigo-200 group-hover:shadow-[0_30px_80px_rgba(79,70,229,0.14)] lg:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-100/70 blur-3xl" />
              <div className="pointer-events-none absolute right-8 top-8 h-24 w-24 rotate-12 rounded-3xl border border-indigo-100" />
              <div className="pointer-events-none absolute right-20 top-20 h-12 w-12 rotate-12 rounded-2xl bg-violet-100" />

              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
                    <MessageCircle size={22} />
                  </div>
                  <span className="text-sm font-bold text-indigo-600">
                    Contact Support
                  </span>
                </div>

                <h3 className="mt-7 max-w-xl text-3xl font-black tracking-tight text-slate-900 lg:text-4xl">
                  Have a question?
                  <span className="block text-slate-400">Let's talk.</span>
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 lg:text-base">
                  Get help with courses, admission, payments or your learning
                  journey. Our team is ready to assist you.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {contactOptions.map(({ icon: Icon, title, text, href }) => (
                    <a
                      key={title}
                      href={href}
                      target={title === "WhatsApp" ? "_blank" : undefined}
                      rel={title === "WhatsApp" ? "noreferrer" : undefined}
                      className="group/item rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-lg"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm transition-all group-hover/item:bg-indigo-600 group-hover/item:text-white">
                        <Icon size={19} />
                      </div>
                      <b className="mt-4 block text-sm text-slate-900">
                        {title}
                      </b>
                      <span className="mt-1 block truncate text-xs text-slate-500">
                        {text}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 group-hover:w-32" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            whileHover={{ y: -8 }}
            className="group relative"
          >
            <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[30px] border border-violet-100 bg-violet-50" />

            <div className="relative flex min-h-[100%] flex-col justify-between overflow-hidden rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.07)] transition-all duration-500 group-hover:border-violet-200 group-hover:shadow-[0_30px_80px_rgba(124,58,237,0.14)]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-100 blur-3xl" />

              <div className="relative z-10">
                <div className="relative h-14 w-14">
                  <div className="absolute inset-0 translate-x-1 translate-y-1 rotate-6 rounded-2xl bg-violet-100" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-110">
                    <Target size={23} />
                  </div>
                </div>

                <p className="mt-8 text-xs font-bold tracking-[0.18em] text-indigo-600">
                  READY TO START?
                </p>

                <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                  Start
                  <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Learning.
                  </span>
                </h3>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Choose a course and continue your learning journey with DNS
                  Academy.
                </p>
              </div>

              <a
                href="/courses"
                className="relative z-10 mt-8 flex items-center justify-center rounded-2xl bg-slate-950 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-600 hover:shadow-indigo-500/20"
              >
                Browse Courses
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>

              <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 group-hover:w-24" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}