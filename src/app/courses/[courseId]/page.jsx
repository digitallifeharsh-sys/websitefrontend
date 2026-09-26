"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API = "/backend-api";

const getImageUrl = (value) => {
  if (!value) return "";

  const raw = String(value).trim();

  if (raw.startsWith("/backend-api/")) return raw;

  const uploadsIndex = raw.indexOf("/uploads/");
  if (uploadsIndex >= 0) {
    return "/backend-api" + raw.slice(uploadsIndex);
  }

  if (raw.startsWith("/home/ubuntu/dns_harsh/public/")) {
    return "/backend-api" + raw.replace("/home/ubuntu/dns_harsh/public", "");
  }

  if (raw.startsWith("/")) return raw;

  return raw;
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API}/courses/${courseId}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Course load failed (${response.status})`);
        }

        const payload = await response.json();

        if (!payload?.success || !payload?.data) {
          throw new Error(payload?.message || "Course not found");
        }

        setCourse(payload.data);
      } catch (err) {
        console.error("Course detail error:", err);
        setError(err.message || "Unable to load course");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) loadCourse();
  }, [courseId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f3ef] px-4 py-28">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8">
          Loading course...
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-[#f4f3ef] px-4 py-28">
        <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-200 bg-white p-8">
          <p className="font-bold text-red-600">{error || "Course not found"}</p>
          <button
            onClick={() => router.push("/courses")}
            className="mt-5 rounded-2xl bg-black px-5 py-3 font-bold text-white"
          >
            Back to Courses
          </button>
        </div>
      </main>
    );
  }

  const imageUrl = getImageUrl(course.imageUrl);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f3ef] px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto w-full max-w-4xl">
        <button
          onClick={() => router.back()}
          className="mb-5 font-bold text-slate-800"
        >
          ← Back
        </button>

        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 sm:aspect-[2/1]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={course.name || "Course"}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : null}
            {!imageUrl && (
              <div className="flex h-full items-center justify-center font-black text-indigo-600">
                DNS
              </div>
            )}
          </div>

          <div className="p-5 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              {course.subject?.name || "DNS Academy"}
            </p>

            <h1 className="mt-3 break-words text-3xl font-black text-slate-900 sm:text-4xl">
              {course.name}
            </h1>

            <p className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-zinc-600 sm:text-base">
              {course.description?.long ||
                course.description?.short ||
                "Structured learning course."}
            </p>

            <div className="mt-7 flex flex-col gap-4 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-3xl font-black text-slate-900">
                ₹{Number(course.price || 0).toLocaleString("en-IN")}
              </span>

              <button
                onClick={() => router.push(`/courses/${courseId}/payment`)}
                className="w-full rounded-2xl bg-black px-6 py-4 font-bold text-white transition hover:bg-indigo-600 sm:w-auto"
              >
                Buy Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
