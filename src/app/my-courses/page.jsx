"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, LockKeyhole, Smartphone } from "lucide-react";
import { apiJson } from "../lib/api";
import { CardSkeleton } from "../components/PageSkeleton";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await apiJson("/api/v1/my-courses", { auth: true });
        const list = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.courses)
            ? data.courses
            : [];
        setCourses(list);
      } catch (err) {
        setError(
          err.status === 401
            ? "Please login to view your courses."
            : err.message || "My Courses load nahi ho paaye."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-10">
          <span className="inline-flex rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-600">
            Your Learning
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-slate-950">
            My Courses
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Purchased courses yahan milenge. Videos website par nahi, DNS App par
            securely watch kiye jaayenge.
          </p>
        </div>

        {loading && <CardSkeleton count={3} />}

        {!loading && error && (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <p className="font-extrabold text-amber-900">{error}</p>
            <Link
              href="/auth/number"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
            >
              Login / Sign Up <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
            <BookOpen className="mx-auto text-slate-400" size={48} />
            <h2 className="mt-4 text-2xl font-black text-slate-950">No purchased courses yet</h2>
            <p className="mt-2 text-slate-500">Courses page se apna first course purchase karein.</p>
            <Link
              href="/courses"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-bold text-white hover:bg-indigo-700"
            >
              Explore Courses <ArrowRight size={17} />
            </Link>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <article
                key={course.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-48 bg-gradient-to-br from-indigo-600 to-violet-700">
                  {course.imageUrl ? (
                    <img src={course.imageUrl} alt={course.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <BookOpen size={60} className="text-white/80" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-black text-slate-950 line-clamp-2">
                    {course.name || course.courseName || course.title || "Purchased Course"}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {course.description?.short || "Your purchased course is unlocked."}
                  </p>

                  <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                    <div className="flex items-center gap-3">
                      <Smartphone size={22} className="text-indigo-600" />
                      <div>
                        <p className="text-sm font-extrabold text-slate-900">Videos are in the DNS App</p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Website sirf purchase aur course ownership ke liye hai.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Course Info
                    </Link>
                    <span className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-500">
                      <LockKeyhole size={15} /> App Access
                    </span>
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
