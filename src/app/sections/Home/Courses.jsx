"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const boards = [
  {
    name: "NIOS",
    fullName: "National Institute of Open Schooling",
    logo: "/boards/nios.jpeg",
  },
  {
    name: "CBSE",
    fullName: "Central Board of Secondary Education",
    logo: "/boards/cbse.jpeg",
  },
  {
    name: "ICSE",
    fullName: "Indian Certificate of Secondary Education",
    logo: "/boards/icse.jpeg",
  },
  {
    name: "BOSSE",
    fullName: "Board of Open Schooling & Skill Education",
    logo: "/boards/bosse.jpeg",
  },
];

export default function BoardSlider() {
  const sliderBoards = [...boards, ...boards, ...boards];

  return (
    <section className="relative w-full overflow-hidden bg-slate-50 py-20 lg:py-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-[20%] top-0 h-80 w-80 rounded-full bg-indigo-300/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-[20%] top-0 h-80 w-80 rounded-full bg-violet-300/20 blur-[120px]" />

      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-8">
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

          Your Board • Your Chance
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-black leading-tight tracking-tight text-slate-900 lg:text-6xl"
        >
          Pass Your 10th & 12th

          <span className="mt-2 block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Your Success Starts Here
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600"
        >
          Expert academic support for students from major school boards.
          Choose your board and start your journey today.
        </motion.p>
      </div>

      {/* FULL WIDTH SLIDER */}
      <div className="relative mt-14 w-full overflow-hidden py-10">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-30 h-full w-24 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent lg:w-40" />

        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-30 h-full w-24 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent lg:w-40" />

        <motion.div
          className="flex w-max gap-6"
          animate={{
            x: ["0%", "-33.3333%"],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {sliderBoards.map((board, index) => (
            <motion.div
              key={`${board.name}-${index}`}
              whileHover={{
                y: -10,
                scale: 1.02,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="
                group
                relative
                flex
                h-[250px]
                w-[270px]
                flex-shrink-0
                flex-col
                items-center
                justify-center
                overflow-hidden
                rounded-[28px]
                border
                border-slate-200/80
                bg-white
                p-6
                shadow-[0_12px_35px_rgba(15,23,42,0.06)]
                transition-all
                duration-300
                hover:border-indigo-200
                hover:shadow-[0_25px_55px_rgba(79,70,229,0.14)]
              "
            >
              {/* Hover background */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-50/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Logo */}
              <div
                className="
                  relative
                  z-10
                  mb-5
                  h-24
                  w-24
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-100
                  bg-white
                  p-2
                  shadow-[0_8px_20px_rgba(15,23,42,0.06)]
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >
                <Image
                  src={board.logo}
                  alt={`${board.name} logo`}
                  fill
                  sizes="96px"
                  className="object-contain p-2"
                />
              </div>

              {/* Text */}
              <div className="relative z-10 text-center">
                <h3 className="mb-1 text-xl font-extrabold text-slate-900 transition-colors group-hover:text-indigo-600">
                  {board.name}
                </h3>

                <p className="mx-auto max-w-[210px] text-xs font-medium leading-relaxed text-slate-500">
                  {board.fullName}
                </p>
              </div>

              {/* Bottom line */}
              <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300 group-hover:w-20" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Board Pills */}
      <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3 px-6">
        {boards.map((board, index) => (
          <motion.span
            key={board.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.1,
            }}
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2
              text-sm
              font-semibold
              text-slate-600
              shadow-sm
              transition-all
              hover:border-indigo-200
              hover:bg-indigo-50
              hover:text-indigo-600
            "
          >
            {board.name}
          </motion.span>
        ))}
      </div>
    </section>
  );
}