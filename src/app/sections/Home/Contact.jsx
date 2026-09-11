"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section className="relative w-full bg-slate-50 py-20 lg:py-28 overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden"
        >
          
          {/* LEFT SIDE - CONTACT INFO (Dark Premium Panel) */}
          <div className="relative w-full lg:w-2/5 bg-gradient-to-br from-indigo-600 to-violet-700 p-10 lg:p-14 text-white overflow-hidden">
            {/* Decorative background circles */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-40 h-40 bg-black/10 rounded-full blur-2xl" />

            <div className="relative z-10 h-full flex flex-col">
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight">
                Get In Touch
              </h2>
              <p className="text-indigo-100 text-lg mb-10 font-medium leading-relaxed">
                Have a question about our courses? Drop us a message and our team will get back to you within 24 hours.
              </p>
              
              <div className="space-y-6 mt-auto">
                {/* Email Item */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-indigo-200 font-medium">Email Us</p>
                    <p className="font-semibold text-lg">support@dnseducation.com</p>
                  </div>
                </div>

                {/* Phone Item */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-indigo-200 font-medium">Call Us</p>
                    <p className="font-semibold text-lg">+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* RIGHT SIDE - FORM */}
          <div className="w-full lg:w-3/5 p-10 lg:p-14 bg-white">
            <form className="space-y-6">
              
              {/* Form Grid for Desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-800 font-medium"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-800 font-medium"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea 
                  rows="4" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-800 font-medium resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button" 
                className="w-full py-4 mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 flex justify-center items-center gap-2"
              >
                Send Message
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>
              
            </form>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}