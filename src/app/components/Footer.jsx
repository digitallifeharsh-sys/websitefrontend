"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";

const API_URL = "/backend-api";

const SOCIAL_LABELS = {
  YOUTUBE: "YT",
  INSTAGRAM: "IG",
  FACEBOOK: "FB",
  X: "X",
};

export default function Footer() {
  const [socialMedia, setSocialMedia] = useState([]);

  useEffect(() => {
    const loadSocialMedia = async () => {
      try {
        const response = await fetch(`${API_URL}/social-media`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Failed to fetch social media");

        const data = await response.json();
        if (data.success && Array.isArray(data.accounts)) {
          setSocialMedia(data.accounts);
        }
      } catch (error) {
        console.error("Social media fetch error:", error);
      }
    };

    loadSocialMedia();
  }, []);

  return (
    <footer className="w-full bg-white text-slate-800 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-7">
              <div className="w-14 h-14 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-[0_8px_24px_rgba(79,70,229,.22)]">
                DNS
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">DNS Education</h3>
                <p className="text-[9px] font-semibold text-slate-400 tracking-[.16em] uppercase">
                  Learn • Grow • Success
                </p>
              </div>
            </div>

            <p className="text-sm leading-6 text-slate-500 max-w-xs">
              Structured learning, exam preparation and academic support for students.
            </p>

            <div className="mt-6">
              <h3 className="font-black text-sm text-slate-900 mb-3">Follow us</h3>
              <div className="flex items-center gap-2.5 flex-wrap">
                {socialMedia.length > 0 ? (
                  socialMedia.map((account) => {
                    const label = SOCIAL_LABELS[account.platform];
                    if (!label || !account.profileUrl) return null;

                    return (
                      <a
                        key={account.platform}
                        href={account.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={account.label || account.platform}
                        className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                      >
                        <span className="text-xs font-black">{label}</span>
                      </a>
                    );
                  })
                ) : (
                  <span className="text-sm text-slate-400">Social media coming soon</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-black text-sm text-slate-900 mb-4">Contact</h3>
            <ul className="space-y-4 text-sm font-semibold text-slate-600">
              <li className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Phone size={16} />
                </span>
                9711909570
              </li>

              <li className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                  WA
                </span>
                9711909570
              </li>

              <li className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Phone size={16} />
                </span>
                8882011045
              </li>

              <li className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Mail size={16} />
                </span>
                delhinationalopenschool@gmail.com
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-black text-sm text-slate-900 mb-4">Legal</h3>
            <ul className="space-y-3 text-sm font-semibold text-slate-600">
              <li><Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refunds" className="hover:text-indigo-600 transition-colors">Refunds & Cancellation Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-black text-sm text-slate-900 mb-4">Download App</h3>
            <a href="#" className="inline-flex items-center gap-3 rounded-xl bg-slate-950 text-white px-4 py-3 shadow-[0_8px_20px_rgba(15,23,42,.16)] hover:-translate-y-0.5 transition-all">
              <span className="text-2xl">▶</span>
              <span>
                <span className="block text-[9px] font-bold text-slate-300 uppercase">Get it on</span>
                <span className="block text-base font-black">Google Play</span>
              </span>
            </a>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-semibold text-sm text-slate-500">
            © {new Date().getFullYear()} DNS Education. All rights reserved.
          </p>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            Learn • Grow • Success
          </div>
        </div>
      </div>
    </footer>
  );
}
