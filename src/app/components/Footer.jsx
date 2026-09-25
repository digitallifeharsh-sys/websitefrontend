"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, Mail, Instagram, Facebook, Youtube, Twitter } from "lucide-react";

const API_URL = "/backend-api";

const SOCIAL_ICONS = {
  YOUTUBE: Youtube,
  INSTAGRAM: Instagram,
  FACEBOOK: Facebook,
  X: Twitter,
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
    <footer className="w-full border-t border-slate-200 bg-[#f7f8fc] pt-16 pb-8 text-slate-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 font-black text-white shadow-[0_8px_24px_rgba(79,70,229,.22)]">
                DNS
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">DNS Education</h3>
                <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-slate-400">
                  Learn • Grow • Success
                </p>
              </div>
            </div>

            <p className="max-w-xs text-sm leading-6 text-slate-500">
              Structured learning, exam preparation and academic support for students.
            </p>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-black text-slate-900">Follow us</h3>
              <div className="flex flex-wrap items-center gap-2.5">
                {socialMedia.length > 0 ? (
                  socialMedia.map((account) => {
                    const Icon = SOCIAL_ICONS[account.platform];
                    if (!Icon || !account.profileUrl) return null;

                    return (
                      <a
                        key={account.platform}
                        href={account.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={account.label || account.platform}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-indigo-600 hover:bg-indigo-600 hover:text-white"
                      >
                        <Icon size={18} />
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
            <h3 className="mb-4 text-sm font-black text-slate-900">Contact</h3>
            <ul className="space-y-4 text-sm font-semibold text-slate-600">
              <li className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Phone size={16} /></span>8920830582</li>
              <li className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-black text-xs">WA</span>8920830582</li>
              <li className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Mail size={16} /></span>manishvermaclasses@gmail.com</li>
              <li className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Phone size={16} /></span>7982803422</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-black text-slate-900">Legal</h3>
            <ul className="space-y-3 text-sm font-semibold text-slate-600">
              <li><Link href="/terms" className="transition-colors hover:text-indigo-600">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="transition-colors hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link href="/refunds" className="transition-colors hover:text-indigo-600">Refunds & Cancellation Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-black text-slate-900">Download App</h3>
            <a href="#" className="inline-flex items-center gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-white shadow-[0_8px_20px_rgba(79,70,229,.16)] transition-all hover:-translate-y-0.5 hover:bg-indigo-700">
              <span className="text-2xl">▶</span>
              <span>
                <span className="block text-[9px] font-bold uppercase text-indigo-100">Get it on</span>
                <span className="block text-base font-black">Google Play</span>
              </span>
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 md:flex-row">
          <p className="text-sm font-semibold text-slate-500">
            © {new Date().getFullYear()} DNS Education. All rights reserved.
          </p>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">
            Learn • Grow • Success
          </div>
        </div>
      </div>
    </footer>
  );
}
