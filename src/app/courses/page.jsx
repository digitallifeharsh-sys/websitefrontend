"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = "/backend-api";

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
        const response = await fetch(`${API}/courses`, { cache: "no-store" });
        if (!response.ok) throw new Error(`Courses load failed (${response.status})`);
        const payload = await response.json();
        setCourses(Array.isArray(payload?.data) ? payload.data : []);
      } catch (err) {
        console.error("Courses Error:", err);
        setCourses([]);
        setError("Courses load nahi ho pa rahe. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const filtered = courses.filter((course) =>
    String(course.name || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#f4f6fb] px-5 py-28">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-2 text-sm font-bold text-indigo-600">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            DNS ACADEMY
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            Courses
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-500">
            Explore structured courses and start learning at your own pace.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-10">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none text-slate-800 shadow-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
          />
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-80 rounded-3xl bg-white border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="max-w-xl mx-auto rounded-3xl bg-white border border-slate-200 p-12 text-center shadow-sm">
            <h2 className="text-xl font-black text-slate-900">No courses found</h2>
            <p className="mt-2 text-slate-500">Try another search or check again after the catalog is updated.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <button
                key={course.id}
                onClick={() => router.push(`/courses/${course.id}`)}
                className="group text-left rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(79,70,229,.12)] hover:-translate-y-1 transition-all"
              >
                <div className="h-44 bg-indigo-50 overflow-hidden">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.name || "Course"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="w-16 h-16 rounded-2xl bg-white border border-indigo-100 text-indigo-600 flex items-center justify-center font-black shadow-sm">
                        DNS
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-xs font-bold tracking-wider text-indigo-500 uppercase">
                    DNS Academy
                  </div>
                  <h2 className="mt-2 text-xl font-black text-slate-900 line-clamp-2">
                    {course.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                    {course.subject?.name || "Structured learning course"}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900">
                      ₹{Number(course.price || 0).toLocaleString("en-IN")}
                    </span>
                    <span className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-bold group-hover:bg-indigo-700">
                      View →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
