"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API = "/backend-api";

export default function Chapter() {
  const { courseId, chapterId } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push("/auth/number");
      return;
    }

    fetch(`${API}/my-courses/${courseId}/chapters/${chapterId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || "Unable to load chapter");
        }
        return payload;
      })
      .then((payload) => setData(payload.data))
      .catch((error) => setError(error.message));
  }, [courseId, chapterId, router]);

  if (error) {
    return <main className="min-h-screen px-4 py-28">{error}</main>;
  }

  if (!data) {
    return <main className="min-h-screen px-4 py-28">Loading...</main>;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f3ef] px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <button onClick={() => router.back()} className="mb-5 font-bold">
          ← Back
        </button>

        <h1 className="break-words text-3xl font-black">
          {data.chapter?.name}
        </h1>

        <div className="mt-7 space-y-6">
          {(data.videos || []).map((video) => (
            <Video key={video.id} video={video} />
          ))}
        </div>
      </div>
    </main>
  );
}

function Video({ video }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="p-2 sm:p-3">
        <h2 className="break-words font-black">{video.title}</h2>
        {video.description && (
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            {video.description}
          </p>
        )}
      </div>

      <div className="aspect-video overflow-hidden rounded-2xl bg-black">
        {video.videoUrl ? (
          <video
            controls
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            disableRemotePlayback
            playsInline
            className="h-full w-full"
            src={video.videoUrl}
            onContextMenu={(event) => event.preventDefault()}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-white/70">
            Video is not available right now.
          </div>
        )}
      </div>

      <div className="px-2 pb-2 pt-3 text-xs text-zinc-400 sm:px-3">
        Protected course content • Access available only to enrolled users
      </div>
    </article>
  );
}
