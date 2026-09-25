"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, LogOut, Phone, UserRound } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("authUser");

    if (!raw) {
      router.push("/auth/number");
      return;
    }

    try {
      setUser(JSON.parse(raw));
    } catch {
      router.push("/auth/number");
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authUser");
    window.dispatchEvent(new Event("auth-change"));
    router.push("/auth/number");
  };

  if (!user) {
    return <main className="min-h-screen bg-[#f4f3ef] px-5 py-28">Loading...</main>;
  }

  const name =
    user.name ||
    user.fullName ||
    user.username ||
    user.firstName ||
    "User";

  const phone = user.phone || user.mobile || user.phoneNumber || "";

  return (
    <main className="min-h-screen bg-[#f4f3ef] px-5 py-28">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-3xl bg-white border border-zinc-200 shadow-sm">
          <div className="bg-black px-7 py-8 text-white">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-3xl font-black text-black shadow-lg">
                  {name[0]?.toUpperCase() || "U"}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-zinc-400">
                    DNS Account
                  </p>
                  <h1 className="mt-1 text-3xl font-black">{name}</h1>
                  {phone && (
                    <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                      <Phone size={15} />
                      {phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">
                <p className="text-zinc-400">Account</p>
                <p className="font-bold">Active</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-zinc-400">
              Account actions
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => router.push("/my-courses")}
                className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
              >
                <BookOpen className="text-indigo-600" size={22} />
                <h2 className="mt-4 font-black text-lg">Purchased Courses</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Open the courses you have purchased.
                </p>
                <span className="mt-4 inline-block text-sm font-bold text-indigo-600">
                  View Courses →
                </span>
              </button>

              <button
                onClick={logout}
                className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
              >
                <LogOut className="text-red-600" size={22} />
                <h2 className="mt-4 font-black text-lg">Logout</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Sign out from this account.
                </p>
                <span className="mt-4 inline-block text-sm font-bold text-red-600">
                  Logout →
                </span>
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex items-start gap-3">
                <UserRound className="mt-0.5 text-zinc-500" size={20} />
                <div>
                  <h3 className="font-bold">Your account details</h3>
                  <p className="mt-1 text-sm leading-6 text-zinc-500">
                    Your login account is used for course purchases and protected learning access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
