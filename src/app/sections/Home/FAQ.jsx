"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { 
    q: "Are the classes live or recorded?", 
    a: "We provide both! You can attend live classes, and recordings are available right after the session ends." 
  },
  { 
    q: "Is there a refund policy?", 
    a: "Yes, we offer a 7-day money-back guarantee if you are not satisfied with the course content." 
  },
  { 
    q: "How long is the course access valid?", 
    a: "Most of our premium courses come with lifetime access." 
  }
];

export default function FAQ() {
  // State to track which FAQ is open. 'null' means all are closed.
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full bg-slate-50 py-20 lg:py-28 overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
        
        {/* HEADING */}
        <div className="text-center mb-14">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight"
          >
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Questions
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-slate-600 text-lg"
          >
            Everything you need to know about our courses.
          </motion.p>
        </div>
        
        {/* FAQ ACCORDION */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                key={index} 
                className={`group bg-white rounded-2xl border transition-all duration-300 ${
                  isOpen 
                    ? "border-indigo-200 shadow-[0_10px_40px_-10px_rgba(79,70,229,0.15)]" 
                    : "border-slate-100 shadow-sm hover:border-indigo-100 hover:shadow-md"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left flex justify-between items-center p-6 focus:outline-none"
                >
                  <span className={`text-lg font-bold transition-colors duration-300 ${
                    isOpen ? "text-indigo-600" : "text-slate-800"
                  }`}>
                    {faq.q}
                  </span>
                  
                  {/* Plus/Minus Icon */}
                  <motion.div 
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    className={`flex-shrink-0 ml-4 flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ${
                      isOpen ? "bg-indigo-100 text-indigo-600" : "bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </motion.div>
                </button>

                {/* Animated Answer Section */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-50 mt-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}