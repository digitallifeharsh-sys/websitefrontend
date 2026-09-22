"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import 3D Scene to prevent Next.js hydration & window errors
const EducationOrbit = dynamic(() => import('../Home/EducationOrbit'), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 flex items-center justify-center text-indigo-300">Loading Universe...</div>
});

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#F8FAFC] overflow-hidden selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      
      {/* --- BACKGROUND ATMOSPHERE --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#EFF6FF] rounded-full blur-[100px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#EEF2FF] rounded-full blur-[120px] opacity-70 pointer-events-none" />
      <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] bg-[#F5F3FF] rounded-full blur-[100px] opacity-60 pointer-events-none" />

      {/* Pattern Overlay */}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center min-h-screen pt-24 pb-16 lg:pt-0 lg:pb-0">
        
        {/* =========================================
            LEFT COLUMN: MAIN CONTENT
        ========================================= */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-20">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-indigo-700 uppercase">DNS Education</span>
          </div>

          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[#0F172A] leading-[1.1] tracking-tight mb-6">
            Your Success <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
              Starts Here.
            </span>
          </h1>

          <p className="text-lg text-[#475569] mb-8 max-w-xl leading-relaxed">
            Embark on a seamless journey from school to higher education. Expert guidance, comprehensive resources, and a structured path to your dream career.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto">
            <Link 
              href="/courses" 
              className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              Explore Courses
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            
            <Link 
              href="/guidance" 
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-[#0F172A] bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all duration-300 shadow-sm"
            >
              Get Free Guidance
            </Link>
          </div>

          {/* Trust Points */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-10 border-t border-slate-200/60 pt-8">
            {[
              { title: "Expert Faculty", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
              { title: "Weekly Tests", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
              { title: "Personal Guidance", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }
            ].map((point, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-[#4F46E5]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={point.icon} /></svg>
                </div>
                <span className="text-sm font-semibold text-[#0F172A]">{point.title}</span>
              </div>
            ))}
          </div>

        </div>

        {/* =========================================
            RIGHT COLUMN: 3D EDUCATION UNIVERSE
        ========================================= */}
        <div className="w-full lg:w-1/2 h-[500px] lg:h-screen relative mt-12 lg:mt-0 flex items-end justify-center">
          
          {/* 3D Canvas Context (Rendered strictly behind the student in DOM) */}
          <div className="absolute inset-0 z-0 scale-110">
            <EducationOrbit />
          </div>

          <div className="relative z-10 w-[88%] max-w-[480px] pointer-events-none pb-0 lg:pb-12">
            <div className="relative rounded-[2.5rem] border border-white/80 bg-white/70 backdrop-blur-2xl shadow-[0_35px_90px_rgba(79,70,229,0.16)] p-6 sm:p-8">
              <div className="absolute -top-5 -right-5 w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl rotate-6">
                <span className="text-2xl font-black">DNS</span>
              </div>
              <div className="h-64 sm:h-80 rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-slate-950 flex flex-col items-center justify-center overflow-hidden">
                <div className="w-28 h-28 rounded-full bg-white/15 border border-white/20 flex items-center justify-center mb-6 backdrop-blur">
                  <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeWidth="1.5" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />
                  </svg>
                </div>
                <p className="text-white text-2xl sm:text-3xl font-black">Learn. Practice. Grow.</p>
                <p className="mt-2 text-indigo-100 text-sm">Your complete learning journey</p>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {["Courses", "Tests", "App Videos"].map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-50 border border-slate-100 px-3 py-4 text-center">
                    <p className="text-xs font-bold text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating UI Elements (To integrate into the right side dynamically) */}
          <div className="absolute top-1/4 right-[10%] z-20 animate-[bounce_4s_ease-in-out_infinite] pointer-events-none hidden lg:block">
            <div className="px-4 py-2 rounded-lg bg-white/70 backdrop-blur-md border border-white/60 shadow-lg text-xs font-semibold text-[#3730A3]">
              Test Series
            </div>
          </div>
          <div className="absolute bottom-1/4 left-0 z-20 animate-[bounce_5s_ease-in-out_infinite_reverse] pointer-events-none hidden lg:block">
            <div className="px-4 py-2 rounded-lg bg-white/70 backdrop-blur-md border border-white/60 shadow-lg text-xs font-semibold text-[#3730A3]">
              NIOS / Open Schooling
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}