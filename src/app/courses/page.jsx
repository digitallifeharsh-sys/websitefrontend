"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = "/backend-api";

const getImageUrl = (value) => {
  if (!value) return "";

  const raw = String(value).trim();

  if (!raw) return "";

  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://")
  ) {
    return raw;
  }

  if (raw.startsWith("/backend-api/")) {
    return raw;
  }

  const uploadsIndex = raw.indexOf("/uploads/");

  if (uploadsIndex >= 0) {
    return API + raw.slice(uploadsIndex);
  }

  if (
    raw.startsWith("/home/ubuntu/dns_harsh/public/")
  ) {
    return (
      API +
      raw.replace(
        "/home/ubuntu/dns_harsh/public",
        ""
      )
    );
  }

  if (raw.startsWith("/")) {
    return raw;
  }

  return raw;
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API}/courses`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(
            `Courses load failed (${response.status})`
          );
        }

        const payload = await response.json();

        setCourses(
          Array.isArray(payload?.data)
            ? payload.data
            : []
        );
      } catch (err) {
        console.error("Courses Error:", err);
        setCourses([]);
        setError(
          "Courses load nahi ho pa rahe. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const filtered = courses.filter((course) =>
    String(course.name || "")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#f4f6fb] px-5 py-28">
      <div className="mx-auto max-w-7xl">

        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            DNS ACADEMY
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Courses
          </h1>

          <p className="mt-3 text-base text-slate-500 sm:text-lg">
            Explore structured courses and start learning at your own pace.
          </p>
        </div>

        <div className="mx-auto mb-10 max-w-2xl">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-800 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
          />
        </div>

        {error && (
          <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-[430px] animate-pulse rounded-3xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-black text-slate-900">
              No courses found
            </h2>
            <p className="mt-2 text-slate-500">
              Try another search or check again after the catalog is updated.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => {
              const imageUrl = getImageUrl(course.imageUrl);

              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => router.push(`/courses/${course.id}`)}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(79,70,229,.12)]"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-indigo-50">
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={course.name || "DNS Academy Course"}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";

                          const fallback =
                            event.currentTarget.parentElement?.querySelector(
                              "[data-image-fallback]"
                            );

                          if (fallback) {
                            fallback.classList.remove("hidden");
                          }
                        }}
                      />
                    )}

                    <div
                      data-image-fallback
                      className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 ${imageUrl ? "hidden" : ""}`}
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-100 bg-white font-black text-indigo-600 shadow-sm">
                        DNS
                      </div>
                    </div>

                    {course.subject?.name && (
                      <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm backdrop-blur">
                        {course.subject.name}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                      DNS Academy
                    </div>

                    <h2 className="mt-2 line-clamp-2 text-xl font-black text-slate-900">
                      {course.name}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                      {course.subject?.name || "Structured learning course"}
                    </p>

                    {course.offer?.active && (
                      <div className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        {course.offer.type === "PERCENT"
                          ? `${course.offer.value}% OFF`
                          : `₹${Number(course.offer.value || 0).toLocaleString("en-IN")} OFF`}
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-lg font-black text-slate-900">
                        ₹{Number(course.price || 0).toLocaleString("en-IN")}
                      </span>

                      <span className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-colors group-hover:bg-indigo-700">
                        View →
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
