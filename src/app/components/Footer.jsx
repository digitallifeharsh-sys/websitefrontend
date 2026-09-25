"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Phone,
  Mail,
} from "lucide-react";

import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";

const API_URL =
  "http://15.252.146.207:5000";

const SOCIAL_ICONS = {
  YOUTUBE: FaYoutube,
  INSTAGRAM: FaInstagram,
  FACEBOOK: FaFacebook,
  X: FaTwitter,
};

export default function Footer() {
  const [socialMedia, setSocialMedia] = useState([]);
  const [socialLoading, setSocialLoading] = useState(true);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/v1/social-media`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch social media");
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.accounts)) {
          setSocialMedia(data.accounts);
        }
      } catch (error) {
        console.error("Social media fetch error:", error);
        setSocialMedia([]);
      } finally {
        setSocialLoading(false);
      }
    };

    fetchSocialMedia();
  }, []);

  return (
    <footer className="w-full bg-[#111] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">

          {/* Column 1: Logo & Follow Us */}
          <div className="flex flex-col">

            {/* Logo Area */}
            <div className="mb-8">
              <div className="w-28 h-28 bg-white border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <span className="text-white font-black text-center leading-tight tracking-tight">
                  <span className="text-3xl text-black">
                    DNS
                  </span>
                  <br />
                  <span className="text-sm">
                    EDUCATION
                  </span>
                </span>
              </div>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="font-black text-white uppercase tracking-wider mb-4 border-b-2 border-black inline-block pb-1">
                Follow us
              </h3>

              <div className="flex items-center gap-3 flex-wrap">

                {socialLoading ? (
                  <div className="text-sm font-bold text-gray-600">
                    Loading...
                  </div>
                ) : socialMedia.length > 0 ? (
                  socialMedia.map((account) => {
                    const Icon = SOCIAL_ICONS[account.platform];

                    if (!Icon || !account.profileUrl) {
                      return null;
                    }

                    return (
                      <a
                        key={account.platform}
                        href={account.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={
                          account.label || account.platform
                        }
                        title={
                          account.label || account.platform
                        }
                        className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 hover:bg-white hover:text-white transition-all"
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })
                ) : (
                  <span className="text-sm font-semibold text-gray-500">
                    Social media coming soon
                  </span>
                )}

              </div>
            </div>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h3 className="font-black text-white uppercase tracking-wider mb-4 border-b-2 border-black inline-block pb-1">
              Contact
            </h3>

            <ul className="space-y-4">

              <li className="flex items-center gap-3 text-white font-semibold text-sm">
                <div className="p-1.5 bg-white/5 border border-white/10">
                  <Phone size={16} />
                </div>
                <span>8920830582</span>
              </li>

              <li className="flex items-center gap-3 text-white font-semibold text-sm">
                <div className="p-1.5 bg-white/5 border border-white/10">
                  <span className="text-sm font-black">WA</span>
                </div>
                <span>8920830582</span>
              </li>

              <li className="flex items-center gap-3 text-white font-semibold text-sm">
                <div className="p-1.5 bg-white/5 border border-white/10">
                  <Mail size={16} />
                </div>
                <span>
                  manishvermaclasses@gmail.com
                </span>
              </li>

              <li className="flex items-center gap-3 text-white font-semibold text-sm">
                <div className="p-1.5 bg-white/5 border border-white/10">
                  <Phone size={16} />
                </div>
                <span>7982803422</span>
              </li>

            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="font-black text-white uppercase tracking-wider mb-4 border-b-2 border-black inline-block pb-1">
              Legal
            </h3>

            <ul className="space-y-3 font-bold text-sm">

              <li>
                <Link
                  href="/terms"
                  className="text-white hover:bg-white hover:text-white inline-block px-1 -ml-1 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="text-white hover:bg-white hover:text-white inline-block px-1 -ml-1 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/refunds"
                  className="text-white hover:bg-white hover:text-white inline-block px-1 -ml-1 transition-colors leading-relaxed"
                >
                  Refunds & Cancellation
                  <br />
                  Policy
                </Link>
              </li>

            </ul>
          </div>

          {/* Column 4: Download App */}
          <div>
            <h3 className="font-black text-white uppercase tracking-wider mb-4 border-b-2 border-black inline-block pb-1">
              Download App
            </h3>

            <a
              href="#"
              className="inline-block group"
            >
              <div className="bg-black text-white border-2 border-black px-4 py-3 flex items-center gap-3 shadow-[6px_6px_0px_0px_rgba(79,70,229,1)] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all w-[180px]">

                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7 fill-current"
                >
                  <path d="M5 22.193V1.807L20.803 12 5 22.193z" />
                </svg>

                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider leading-none text-gray-300">
                    GET IT ON
                  </span>

                  <span className="text-lg font-black leading-none mt-1">
                    Google Play
                  </span>
                </div>

              </div>
            </a>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="font-bold text-sm text-white">
            © {new Date().getFullYear()} DNS Education. All rights reserved.
          </p>

          <div className="font-mono text-xs font-bold text-white uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Learn • Grow • Success
          </div>

        </div>

      </div>
    </footer>
  );
}