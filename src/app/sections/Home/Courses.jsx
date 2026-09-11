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
  // Duplicate boards for seamless infinite slider
  const sliderBoards = [...boards, ...boards, ...boards];

  return (
    <section className="relative w-full bg-slate-50 py-20 lg:py-28 overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* HEADING SECTION */}
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 font-semibold text-sm mb-6 shadow-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            Your Board • Your Chance
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Pass Your 10th & 12th
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Your Success Starts Here
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 max-w-2xl text-slate-600 text-lg"
          >
            Expert academic support for students from major
            school boards. Choose your board and start your journey today.
          </motion.p>
        </div>

        {/* SLIDER WRAPPER */}
        <div className="relative w-full py-8">
          
          {/* Edge Fade Masks for smooth slider entry/exit */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-20 pointer-events-none" />

          {/* SLIDER */}
          <motion.div
            className="relative z-10 flex gap-8 w-max"
            animate={{
              x: ["0%", "-33.33%"],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {sliderBoards.map((board, index) => (
              <motion.div
                key={`${board.name}-${index}`}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative flex-shrink-0 w-[260px] h-[240px] bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(79,70,229,0.1)] hover:border-indigo-100 p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
              >
                {/* Subtle Background Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300" />

                {/* Logo */}
                <div className="relative w-24 h-24 mb-5 z-10 p-2 bg-white rounded-2xl shadow-sm border border-slate-50 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={board.logo}
                    alt={`${board.name} logo`}
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                  />
                </div>

                {/* Text Content */}
                <div className="relative z-10 text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {board.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[200px]">
                    {board.fullName}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* BOTTOM BADGES */}
        <div className="flex flex-wrap justify-center items-center gap-3 mt-12">
          {boards.map((board, idx) => (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={board.name}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold shadow-sm hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-default"
            >
              {board.name}
            </motion.span>
          ))}
        </div>

      </div>
    </section>
  );
}