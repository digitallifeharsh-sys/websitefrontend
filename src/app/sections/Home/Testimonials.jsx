"use client";

import { motion } from "framer-motion";

export default function Testimonials() {
  const reviews = [
    { 
      name: "Rahul Singh", 
      role: "Selected in SSC CGL", 
      text: "DNS Education helped me crack my exam in the first attempt. The mock tests are exactly like the real exam. The faculty support is just incredible." 
    },
    { 
      name: "Priya Sharma", 
      role: "Web Developer", 
      text: "The full stack course is amazing. No fluff, just pure coding and building projects. I landed my first internship right after completing the modules! Highly recommended." 
    }
  ];

  return (
    <section className="relative w-full bg-slate-50 py-20 lg:py-28 overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* HEADING */}
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-1.5 bg-white border border-slate-200 rounded-full text-slate-600 font-semibold text-sm mb-6 shadow-sm"
          >
            🌟 Wall of Love
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight"
          >
            Student{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Success Stories
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-2xl text-slate-600 text-lg"
          >
            Don't just take our word for it. Hear from our students who transformed their careers with us.
          </motion.p>
        </div>
        
        {/* TESTIMONIALS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {reviews.map((review, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8 }}
              key={index} 
              className="relative bg-white rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300"
            >
              
              {/* Large Quote Icon Background */}
              <div className="absolute top-6 right-8 text-indigo-50 opacity-80 pointer-events-none">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Review Text */}
              <div className="relative z-10 mb-8">
                {/* 5 Star Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 text-lg leading-relaxed font-medium">
                  "{review.text}"
                </p>
              </div>

              {/* User Info Line */}
              <div className="relative z-10 flex items-center gap-4 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-bold text-xl shadow-md">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-lg tracking-tight">{review.name}</h4>
                  <p className="text-sm font-semibold text-indigo-600 mt-0.5">{review.role}</p>
                </div>
              </div>
              
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}