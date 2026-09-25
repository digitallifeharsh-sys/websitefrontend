"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API = "/backend-api";

const getImageUrl = (value) => {
  if (!value) return "";

  const raw = String(value);

  if (raw.startsWith("/home/ubuntu/dns_harsh/public/uploads/")) {
    return "/backend-api" + raw.replace("/home/ubuntu/dns_harsh/public", "");
  }

  if (raw.startsWith("/uploads/")) {
    return "/backend-api" + raw;
  }

  if (raw.startsWith("http://15.252.146.207:5000/uploads/")) {
    return raw.replace("http://15.252.146.207:5000", "/backend-api");
  }

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
      <main className="min-h-screen bg-[#f4f3ef] px-5 py-28">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8">
          Loading course...
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-[#f4f3ef] px-5 py-28">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white border border-zinc-200 p-8">
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
    <main className="min-h-screen bg-[#f4f3ef] px-5 py-28">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.back()}
          className="mb-6 font-bold text-slate-800"
        >
          ← Back
        </button>

        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="h-64 overflow-hidden rounded-2xl bg-zinc-100">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={course.name || "Course"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-black text-indigo-600">
                DNS
              </div>
            )}
          </div>

          <h1 className="mt-6 text-4xl font-black">{course.name}</h1>
          <p className="mt-2 text-zinc-500">
            {course.description?.long || course.description?.short}
          </p>

          <div className="mt-7 flex items-center justify-between gap-4">
            <span className="text-3xl font-black">
              ₹{Number(course.price || 0).toLocaleString("en-IN")}
            </span>

            <button
              onClick={() => router.push(`/courses/${courseId}/payment`)}
              className="rounded-2xl bg-black px-6 py-4 font-bold text-white"
            >
              Buy Course
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
