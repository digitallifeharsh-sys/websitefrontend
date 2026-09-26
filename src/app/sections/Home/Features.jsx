"use client";

import { Award, BookOpenCheck, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  {
    icon: Users,
    title: "Personal Guidance",
    text: "Clear guidance and support when you need it.",
  },
  {
    icon: BookOpenCheck,
    title: "Exam Focused",
    text: "Courses and material built around practical exam preparation.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Learning",
    text: "Purchased content stays behind your account.",
  },
  {
    icon: Award,
    title: "Learn With Confidence",
    text: "Simple lessons, practice and structured progress.",
  },
];

export default function Features() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-50 py-20 lg:py-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-[10%] top-0 h-80 w-80 rounded-full bg-indigo-300/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-[10%] top-20 h-80 w-80 rounded-full bg-violet-300/20 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">

          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="
              mb-6
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-indigo-100
              bg-indigo-50
              px-4
              py-1.5
              text-sm
              font-semibold
              text-indigo-600
            "
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-indigo-500" />
            </span>

            Why DNS Academy
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="
              text-4xl
              font-black
              leading-[0.95]
              tracking-tight
              text-slate-900
              sm:text-5xl
              lg:text-6xl
            "
          >
            Everything You Need

            <span className="mt-2 block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              To Keep Moving Forward
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-lg
              leading-8
              text-slate-600
            "
          >
            Simple learning, expert guidance and secure access —
            everything you need in one place.
          </motion.p>

        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {items.map(({ icon: Icon, title, text }, index) => (

            <motion.div
              key={title}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -10,
              }}
              className="group relative"
            >

              {/* Back Layer */}
              <div
                className="
                  absolute
                  inset-0
                  translate-x-2
                  translate-y-2
                  rounded-[28px]
                  border
                  border-indigo-100
                  bg-indigo-50
                  opacity-70
                "
              />

              {/* Main Card */}
              <div
                className="
                  relative
                  min-h-[290px]
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-slate-200/80
                  bg-white
                  p-7
                  shadow-[0_15px_45px_rgba(15,23,42,0.07)]
                  transition-all
                  duration-500
                  group-hover:border-indigo-200
                  group-hover:shadow-[0_25px_65px_rgba(79,70,229,0.15)]
                "
              >

                {/* Background Glow */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-40
                    w-40
                    rounded-full
                    bg-indigo-100
                    opacity-0
                    blur-3xl
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  "
                />

                {/* Number */}
                <div className="absolute right-6 top-5 text-xs font-black tracking-[0.2em] text-slate-200">
                  0{index + 1}
                </div>

                {/* Icon */}
                <div className="relative z-10">

                  {/* Icon Back Layer */}
                  <div
                    className="
                      absolute
                      left-2
                      top-2
                      h-14
                      w-14
                      rotate-6
                      rounded-2xl
                      bg-indigo-100
                      transition-transform
                      duration-300
                      group-hover:rotate-12
                    "
                  />

                  {/* Icon Box */}
                  <div
                    className="
                      relative
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-indigo-600
                      to-violet-600
                      text-white
                      shadow-[0_10px_25px_rgba(79,70,229,0.25)]
                      transition-transform
                      duration-300
                      group-hover:scale-110
                      group-hover:-rotate-3
                    "
                  >
                    <Icon size={24} strokeWidth={2.2} />
                  </div>

                </div>

                {/* Content */}
                <div className="relative z-10 mt-10">

                  <h3
                    className="
                      text-xl
                      font-black
                      tracking-tight
                      text-slate-900
                      transition-colors
                      duration-300
                      group-hover:text-indigo-600
                    "
                  >
                    {title}
                  </h3>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-6
                      text-slate-500
                    "
                  >
                    {text}
                  </p>

                </div>

                {/* Bottom Link */}
                <div
                  className="
                    absolute
                    bottom-6
                    left-7
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-bold
                    text-indigo-600
                    opacity-60
                    transition-all
                    duration-300
                    group-hover:gap-3
                    group-hover:opacity-100
                  "
                >
                  Learn More
                  <span>→</span>
                </div>

                {/* Bottom Accent */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-1/2
                    h-1
                    w-0
                    -translate-x-1/2
                    rounded-full
                    bg-gradient-to-r
                    from-indigo-500
                    to-violet-500
                    transition-all
                    duration-500
                    group-hover:w-24
                  "
                />

              </div>
            </motion.div>

          ))}

        </div>

      </div>
    </section>
  );
}