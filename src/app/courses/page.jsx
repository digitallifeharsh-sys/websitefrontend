"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Search, Sparkles } from "lucide-react";
import { apiJson } from "../lib/api";
import { CardSkeleton } from "../components/PageSkeleton";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await apiJson("/api/v1/courses");
        const list = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.courses)
            ? data.courses
            : Array.isArray(data)
              ? data
              : [];
        setCourses(list);
      } catch (err) {
        setError(err.message || "Courses load nahi ho paaye.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const filtered = courses.filter((course) => {
    const text = [
      course?.name,
      course?.slug,
      course?.subject?.name,
      course?.description?.short,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(query.trim().toLowerCase());
  });

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-600">
            <Sparkles size={14} />
            DNS Courses
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-slate-950">
            Learn once. <span className="text-indigo-600">Keep learning.</span>
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Course website par purchase karo. Purchase ke baad course aapke
            My Courses me unlock hoga; videos DNS App par dekhe jaayenge.
          </p>
        </div>

        <div className="mb-10 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-4 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </div>
          <Link
            href="/my-courses"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 font-bold text-white hover:bg-indigo-600 transition"
          >
            My Courses <ArrowRight size={17} />
          </Link>
        </div>

        {loading && <CardSkeleton count={6} />}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
            <p className="font-bold">Courses load nahi ho paaye.</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
            <BookOpen className="mx-auto text-slate-400" size={42} />
            <h2 className="mt-4 text-xl font-bold text-slate-900">No courses found</h2>
            <p className="mt-2 text-slate-500">Search change karke dobara try karein.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <article
                key={course.id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:shadow-2xl transition-all"
              >
                <div className="relative h-56 bg-gradient-to-br from-indigo-600 to-violet-700 overflow-hidden">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-white">
                      <BookOpen size={58} strokeWidth={1.5} />
                    </div>
                  )}
                  <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800">
                    {course.subject?.name || "Course"}
                  </span>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-extrabold text-slate-950 line-clamp-2">
                    {course.name}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">
                    {course.description?.short || course.description?.long || "Complete learning course."}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Course fee</p>
                      <p className="text-2xl font-black text-slate-950">
                        ₹{Number(course.price || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <Link
                      href={`/courses/${course.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition"
                    >
                      View Course <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
