"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API = "/backend-api";

const getImageUrl = (value) => {
  if (!value) return "";

  const raw = String(value).trim();
  const uploadsIndex = raw.indexOf("/uploads/");

  if (raw.startsWith("/backend-api/")) return raw;
  if (uploadsIndex >= 0) return "/backend-api" + raw.slice(uploadsIndex);
  if (raw.startsWith("/")) return raw;

  return raw;
};

export default function MyCourse() {
  const { courseId } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push("/auth/number");
      return;
    }

    fetch(`${API}/my-courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data?.success) {
          throw new Error(data?.message || "Unable to load course");
        }
        return data;
      })
      .then((data) => setCourse(data.data))
      .catch((error) => setError(error.message));
  }, [courseId, router]);

  if (error) {
    return <main className="min-h-screen px-4 py-28">{error}</main>;
  }

  if (!course) {
    return <main className="min-h-screen px-4 py-28">Loading...</main>;
  }

  const imageUrl = getImageUrl(course.imageUrl);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f3ef] px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <button onClick={() => router.back()} className="mb-5 font-bold">
          ← Back
        </button>

        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          {imageUrl && (
            <div className="aspect-[16/7] w-full overflow-hidden bg-zinc-100">
              <img
                src={imageUrl}
                alt={course.name || "Course"}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-5 sm:p-8">
            <h1 className="text-3xl font-black sm:text-4xl">{course.name}</h1>
            <p className="mt-2 text-zinc-500">Your chapters</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {(course.chapters || []).map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() =>
                    router.push(
                      `/my-courses/${courseId}/chapter/${chapter.id}`
                    )
                  }
                  className="rounded-2xl border border-zinc-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <b>{chapter.name}</b>
                  <p className="mt-2 text-sm text-zinc-500">
                    Open chapter →
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
