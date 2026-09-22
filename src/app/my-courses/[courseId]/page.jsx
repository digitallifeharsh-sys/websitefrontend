"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, PlayCircle, Smartphone } from "lucide-react";
import { apiJson } from "../../lib/api";
import { DetailSkeleton } from "../../components/PageSkeleton";

export default function MyCourseDetailPage() {
  const params = useParams();
  const courseId = params?.courseId;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await apiJson(`/api/v1/my-courses/${courseId}`, { auth: true });
        setCourse(data?.data || data?.course || data);
      } catch (err) {
        setError(err.message || "Course load nahi ho paaya.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [courseId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6"><DetailSkeleton /></div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/my-courses" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600">
            <ArrowLeft size={17} /> My Courses
          </Link>
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Link href="/my-courses" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600">
          <ArrowLeft size={17} /> My Courses
        </Link>

        <div className="mt-6 rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-indigo-600 to-violet-700 p-7 sm:p-10 text-white shadow-2xl shadow-indigo-200/50">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-7">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-3 py-1.5 text-xs font-bold">
                <CheckCircle2 size={14} /> Purchased & Unlocked
              </span>
              <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight">
                {course?.name || "My Course"}
              </h1>
              <p className="mt-3 max-w-2xl text-indigo-100 leading-7">
                {course?.description?.long || course?.description?.short || "Your course is unlocked."}
              </p>
            </div>

            <div className="shrink-0 rounded-2xl bg-white/10 border border-white/20 px-5 py-4">
              <div className="flex items-center gap-3">
                <Smartphone size={24} />
                <div>
                  <p className="font-extrabold">Watch in DNS App</p>
                  <p className="text-xs text-indigo-100">Videos website par stream nahi honge.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Course structure</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">Chapters</h2>
            </div>
            <span className="text-sm font-semibold text-slate-500">
              {course?.chapters?.length || 0} chapters
            </span>
          </div>

          {Array.isArray(course?.chapters) && course.chapters.length > 0 ? (
            <div className="space-y-3">
              {course.chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-slate-900 truncate">{chapter.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Videos available inside DNS App
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-500">
                    <PlayCircle size={15} /> App
                    <ChevronRight size={14} />
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
              <PlayCircle className="mx-auto text-slate-300" size={46} />
              <h3 className="mt-4 font-black text-slate-900">Content is being prepared</h3>
              <p className="mt-2 text-sm text-slate-500">Your purchased access is active.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
