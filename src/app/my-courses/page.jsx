"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = "/backend-api";

const getImageUrl = (value) => {
  if (!value) return "";
  const raw = String(value);

  if (raw.startsWith("/home/ubuntu/dns_harsh/public/uploads/")) {
    return "/backend-api" + raw.replace("/home/ubuntu/dns_harsh/public", "");
  }

  if (raw.startsWith("/uploads/")) return "/backend-api" + raw;

  if (raw.startsWith("http://15.252.146.207:5000/uploads/")) {
    return raw.replace("http://15.252.146.207:5000", "/backend-api");
  }

  return raw;
};

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [affairs, setAffairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push("/auth/number");
      return;
    }

    const load = async () => {
      try {
        const [coursesResponse, purchasesResponse] = await Promise.all([
          fetch(`${API}/my-courses`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetch(`${API}/payments/purchases`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
        ]);

        const [coursesPayload, purchasesPayload] = await Promise.all([
          coursesResponse.json(),
          purchasesResponse.json(),
        ]);

        setCourses(Array.isArray(coursesPayload?.data) ? coursesPayload.data : []);

        setAffairs(
          Array.isArray(purchasesPayload?.data)
            ? purchasesPayload.data.filter(
                (item) =>
                  item.status === "PAID" &&
                  ((item.item?.type || "").toUpperCase().includes("CURRENT") ||
                    item.currentAffairsId ||
                    item.current_affairs_id)
              )
            : []
        );
      } catch (error) {
        console.error("Purchased courses error:", error);
        setCourses([]);
        setAffairs([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#f4f3ef] px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold tracking-[.2em] text-zinc-500">DNS ACADEMY</p>
        <h1 className="mt-2 text-4xl font-black">Purchased Courses</h1>
        <p className="mt-2 text-zinc-500">
          Courses you have purchased and can access from your account.
        </p>

        {loading ? (
          <p className="mt-8">Loading...</p>
        ) : (
          <>
            <section className="mt-10">
              <h2 className="text-xl font-black">Courses</h2>

              {courses.length === 0 ? (
                <p className="mt-4 text-sm text-zinc-500">
                  No course purchased yet.
                </p>
              ) : (
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => router.push(`/my-courses/${course.id}`)}
                      className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="h-40 bg-zinc-100">
                        {course.imageUrl ? (
                          <img
                            src={getImageUrl(course.imageUrl)}
                            alt={course.name || "Course"}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center font-black text-indigo-600">
                            DNS
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-black">{course.name}</h3>
                        <p className="mt-1 text-sm text-zinc-500">
                          {course.subject || "DNS Academy Course"}
                        </p>
                        <span className="mt-5 inline-block rounded-xl bg-black px-4 py-2 text-sm font-bold text-white">
                          Open Course →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-12">
              <h2 className="text-xl font-black">Purchased Current Affairs</h2>

              {affairs.length === 0 ? (
                <p className="mt-4 text-sm text-zinc-500">
                  No Current Affairs purchase yet.
                </p>
              ) : (
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {affairs.map((purchase, index) => {
                    const item = purchase.item || {};
                    const id =
                      item.id ||
                      purchase.currentAffairsId ||
                      purchase.current_affairs_id;

                    return (
                      <button
                        key={purchase.id || id || index}
                        onClick={() => router.push(`/current-affairs/${id}`)}
                        className="rounded-3xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                      >
                        <p className="text-xs font-bold tracking-[.15em] text-zinc-500">
                          CURRENT AFFAIRS
                        </p>
                        <h3 className="mt-2 text-lg font-black">
                          {item.name || purchase.name || "Current Affairs Pack"}
                        </h3>
                        <p className="mt-2 text-sm text-green-600">
                          Purchased • Access available
                        </p>
                        <span className="mt-5 inline-block rounded-xl bg-black px-4 py-2 text-sm font-bold text-white">
                          Open →
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
