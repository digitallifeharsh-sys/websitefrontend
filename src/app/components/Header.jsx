
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  User,
  BookOpen,
  FileText,
  GraduationCap,
  LogOut,
  Menu,
  X,
} from "lucide-react";

/* =========================================================
   HEADER SKELETONS
========================================================= */

function LogoSkeleton() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-slate-200" />

      <div className="hidden sm:flex flex-col gap-2">
        <div className="h-4 w-28 rounded bg-slate-200" />
        <div className="h-2.5 w-20 rounded bg-slate-100" />
      </div>
    </div>
  );
}

function NavigationSkeleton() {
  return (
    <div className="hidden lg:flex items-center gap-8 h-12 animate-pulse">
      <div className="h-4 w-12 rounded-md bg-slate-200" />
      <div className="h-4 w-16 rounded-md bg-slate-200" />
      <div className="h-4 w-20 rounded-md bg-slate-200" />
      <div className="h-4 w-28 rounded-md bg-slate-200" />
      <div className="h-4 w-24 rounded-md bg-slate-200" />
      <div className="h-4 w-12 rounded-md bg-slate-200" />
    </div>
  );
}

function AuthSkeleton() {
  return (
    <div className="hidden lg:flex items-center gap-3 animate-pulse">
      <div className="w-9 h-9 rounded-full bg-slate-200" />
      <div className="h-4 w-24 rounded-md bg-slate-200" />
      <div className="h-10 w-20 rounded-xl bg-slate-200" />
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const [sticky, setSticky] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const [authLoading, setAuthLoading] = useState(true);

  const moreRef = useRef(null);

  /* =========================================================
     CHECK LOGIN + GET SAVED USER
     
     Backend /auth/me ki zarurat nahi.
     Login ke time authUser localStorage me save ho raha hai.
  ========================================================= */

  useEffect(() => {
    const checkAuth = () => {
      try {
        const accessToken =
          localStorage.getItem("accessToken");

        const savedUser =
          localStorage.getItem("authUser");

        if (!accessToken || !savedUser) {
          setIsLoggedIn(false);
          setUser(null);
          setAuthLoading(false);
          return;
        }

        const userData = JSON.parse(savedUser);

        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Header Auth Error:", error);

        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();

    const handleAuthChange = () => {
      setAuthLoading(true);
      checkAuth();
    };

    window.addEventListener(
      "auth-change",
      handleAuthChange
    );

    window.addEventListener(
      "storage",
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        "auth-change",
        handleAuthChange
      );

      window.removeEventListener(
        "storage",
        handleAuthChange
      );
    };
  }, [pathname]);

  /* =========================================================
     STICKY HEADER
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 10);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  /* =========================================================
     CLOSE MORE DROPDOWN
  ========================================================= */

  useEffect(() => {
    function outside(e) {
      if (
        moreRef.current &&
        !moreRef.current.contains(e.target)
      ) {
        setMoreOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      outside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        outside
      );
  }, []);

  /* =========================================================
     MOBILE BODY LOCK
  ========================================================= */

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authUser");

    sessionStorage.removeItem("authPhoneNumber");
    sessionStorage.removeItem("authOtpPurpose");
    sessionStorage.removeItem("authAuthType");
    sessionStorage.removeItem("authResetToken");

    setIsLoggedIn(false);
    setUser(null);

    setMobileMenuOpen(false);
    setMoreOpen(false);

    window.dispatchEvent(
      new Event("auth-change")
    );

    router.push("/auth/number");
  };

  /* =========================================================
     MENUS
  ========================================================= */

  const menus = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Courses",
      link: "/courses",
    },
    {
      name: "Test Series",
      link: "/test-series",
    },
    {
      name: "Previous Year Papers",
      link: "/pyq",
    },
    {
      name: "Current Affairs",
      link: "/current-affairs",
    },
  ];

  const moreMenus = [
    {
      name: "Books",
      link: "/books",
      icon: BookOpen,
    },
    {
      name: "Free Courses",
      link: "/free-courses",
      icon: GraduationCap,
    },
    {
      name: "PDF Notes",
      link: "/notes",
      icon: FileText,
    },
  ];

  /* =========================================================
     USER NAME
  ========================================================= */

  const getUserName = () => {
    if (!user) return "User";

    return (
      user.name ||
      user.fullName ||
      user.username ||
      user.firstName ||
      user.phone ||
      "User"
    );
  };

  const userName = getUserName();

  const userInitial =
    userName?.charAt(0)?.toUpperCase() ||
    "U";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* HEADER */}

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          sticky
            ? "bg-white/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.08)] border-b border-slate-200/80 py-1"
            : "bg-white border-b border-slate-100 py-3"
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-5 sm:px-8 lg:px-12">

          {/* LOGO */}

          {authLoading ? (
            <LogoSkeleton />
          ) : (
            <Link
              href="/"
              className="flex items-center gap-3 group z-50"
            >
              <div className="w-11 h-11 rounded-md bg-indigo-600 text-white flex items-center justify-center font-black text-base tracking-tight shadow-[0_8px_24px_rgba(79,70,229,0.22)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_30px_rgba(79,70,229,0.30)]">
                DNS
              </div>

              <div className="flex flex-col justify-center">
                <h2 className="font-extrabold text-[18px] text-slate-900 leading-tight tracking-[-0.025em] group-hover:text-indigo-600 transition-colors">
                  DNS Education
                </h2>

                <p className="text-[9px] font-semibold text-slate-400 tracking-[0.16em] uppercase">
                  Learn • Grow • Success
                </p>
              </div>
            </Link>
          )}

          {/* DESKTOP CENTER MENU */}

          {authLoading ? (
            <NavigationSkeleton />
          ) : (
            <nav className="hidden lg:flex items-center gap-1 h-12">

              {menus.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className={`relative px-4 py-2.5 text-[13px] font-semibold tracking-[-0.01em] transition-all duration-300 ${
                    pathname === item.link
                      ? "text-slate-950"
                      : "text-slate-600 hover:text-indigo-600"
                  }`}
                >
                  {item.name}
                  {pathname === item.link && (
                    <span className="absolute left-4 right-4 -bottom-0.5 h-[2px] rounded-full bg-indigo-600" />
                  )}
                </Link>
              ))}

              {/* MORE */}

              <div
                ref={moreRef}
                className="relative flex items-center"
              >
                <button
                  onClick={() =>
                    setMoreOpen(!moreOpen)
                  }
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-slate-600 hover:text-indigo-600 transition-all duration-300 ${
                    moreOpen
                      ? "text-slate-950"
                      : "text-slate-600 hover:text-indigo-600"
                  }`}
                >
                  More

                  <ChevronDown
                    size={16}
                    strokeWidth={2}
                    className={`transition-transform duration-300 ${
                      moreOpen
                        ? "rotate-180 text-indigo-600"
                        : "text-slate-400"
                    }`}
                  />
                </button>

                {/* MORE DROPDOWN */}

                <div
                  className={`absolute top-[55px] right-0 w-72 bg-white rounded-xl shadow-[0_24px_70px_rgba(15,23,42,0.16)] border border-slate-200 p-2 transition-all duration-200 origin-top-right ${
                    moreOpen
                      ? "opacity-100 scale-100 translate-y-0 visible"
                      : "opacity-0 scale-95 -translate-y-2 invisible"
                  }`}
                >
                  {moreMenus.map((item) => (
                    <Link
                      key={item.name}
                      href={item.link}
                      onClick={() =>
                        setMoreOpen(false)
                      }
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 group transition-all duration-200"
                    >
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200">
                        <item.icon size={17} />
                      </div>

                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-slate-700 group-hover:text-indigo-700">
                          {item.name}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          Explore resource
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          )}

          {/* DESKTOP RIGHT SIDE */}

          <div className="hidden lg:flex items-center gap-3">

            {authLoading ? (
              <AuthSkeleton />
            ) : isLoggedIn ? (
              <>
                {/* USER */}

                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-slate-50 transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm ring-2 ring-slate-100">
                    {userInitial}
                  </div>

                  <span className="text-sm font-semibold text-slate-700 max-w-[130px] truncate">
                    {userName}
                  </span>
                </Link>

                <Link href="/my-courses" className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600">Purchased Courses</Link>

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                >
                  <LogOut size={17} />

                  <span className="text-sm font-semibold">
                    Logout
                  </span>
                </button>
              </>
            ) : (
              <Link
                href="/auth/number"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white font-semibold text-sm hover:bg-zinc-800 transition-all duration-300"
              >
                <User size={17} />

                <span>
                  Login / Sign Up
                </span>
              </Link>
            )}

          </div>

          {/* MOBILE HAMBURGER */}

          <button
            onClick={() =>
              setMobileMenuOpen(true)
            }
            className="lg:hidden w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 hover:bg-slate-950 hover:text-white transition-all duration-300"
          >
            <Menu size={24} />
          </button>

        </div>
      </header>

      {/* MOBILE MENU */}

      <div
        className={`fixed inset-0 z-[70] lg:hidden transition-all duration-300 ${
          mobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      >

        {/* BACKDROP */}

        <div
          onClick={() =>
            setMobileMenuOpen(false)
          }
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen
              ? "opacity-100"
              : "opacity-0"
          }`}
        />

        {/* SIDEBAR */}

        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-[0_0_60px_rgba(15,23,42,0.18)] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileMenuOpen
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >

          {/* MOBILE HEADER */}

          <div className="p-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">

            <h3 className="font-bold text-lg text-slate-900">
              Menu
            </h3>

            <button
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm hover:scale-105"
            >
              <X size={20} />
            </button>

          </div>

          {/* CONTENT */}

          <div className="flex-1 overflow-y-auto py-5 px-5 custom-scrollbar">

            {/* MOBILE PROFILE */}

            {authLoading ? (
              <div className="animate-pulse bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-6">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-full bg-slate-200" />

                  <div className="flex-1">
                    <div className="h-4 w-28 rounded bg-slate-200 mb-2" />
                    <div className="h-3 w-20 rounded bg-slate-100" />
                  </div>

                </div>

                <div className="mt-4 h-11 w-full rounded-xl bg-slate-200" />

              </div>
            ) : isLoggedIn ? (
              <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-4 rounded-2xl mb-6 shadow-sm">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-xl shadow-md">
                    {userInitial}
                  </div>

                  <div className="min-w-0">

                    <h4 className="font-bold text-[15px] text-slate-900 truncate">
                      {userName}
                    </h4>

                    <Link
                      href="/profile"
                      onClick={() =>
                        setMobileMenuOpen(false)
                      }
                      className="text-xs text-indigo-600 font-semibold hover:underline"
                    >
                      View Profile
                    </Link>

                  </div>

                </div>

                {/* MOBILE LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-all"
                >
                  <LogOut size={17} />

                  Logout
                </button>

              </div>
            ) : (
              <div className="mb-6">

                <Link
                  href="/auth/number"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="block w-full py-3 text-center rounded-xl bg-slate-950 text-white font-semibold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
                >
                  Login / Sign Up
                </Link>

              </div>
            )}

            {/* MOBILE LINKS */}

            <div className="space-y-1.5">

              {menus.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className={`block px-5 py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-200 ${
                    pathname === item.link
                      ? "text-slate-950"
                      : "text-slate-700 hover:bg-slate-50 hover:translate-x-1"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* MORE */}

              <div className="pt-3 mt-3 border-t border-slate-100">

                <button
                  onClick={() =>
                    setMobileMoreOpen(
                      !mobileMoreOpen
                    )
                  }
                  className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-[15px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  More Resources

                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                      mobileMoreOpen
                        ? "rotate-180 text-indigo-600"
                        : "text-slate-400"
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    mobileMoreOpen
                      ? "max-h-[300px] opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                  }`}
                >

                  <div className="p-2 space-y-1 bg-slate-50/50 rounded-xl mx-2 border border-slate-100">

                    {moreMenus.map(
                      (item) => (
                        <Link
                          key={item.name}
                          href={item.link}
                          onClick={() =>
                            setMobileMenuOpen(
                              false
                            )
                          }
                          className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white hover:shadow-sm transition-all duration-200"
                        >

                          <div className="w-8 h-8 rounded-md bg-white border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm">
                            <item.icon
                              size={16}
                            />
                          </div>

                          <span className="text-sm font-semibold">
                            {item.name}
                          </span>

                        </Link>
                      )
                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

