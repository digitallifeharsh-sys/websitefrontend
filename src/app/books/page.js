"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = "/backend-api";

export default function Books() {
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);

    const params = new URLSearchParams({
      page: "1",
      limit: "30",
    });

    if (q.trim()) {
      params.set("q", q.trim());
    }

    fetch(`${API}/books?${params.toString()}`)
      .then((response) => response.json())
      .then((result) => {
        setData(Array.isArray(result?.data) ? result.data : []);
      })
      .catch(() => {
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f3ef] px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold tracking-[.2em] text-zinc-500">
          DNS ACADEMY
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Books & Study Material
        </h1>

        <div className="mt-7 flex max-w-xl gap-2">
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search books..."
            className="flex-1 rounded-2xl border border-zinc-300 bg-white px-5 py-3 outline-none"
          />

          <button
            onClick={load}
            className="rounded-2xl bg-black px-5 font-bold text-white"
          >
            Search
          </button>
        </div>

        {loading ? (
          <p className="mt-8">Loading...</p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {data.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="rounded-3xl border border-zinc-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-48 overflow-hidden rounded-2xl bg-zinc-100">
                  {book.coverImageUrl ? (
                    <img
                      src={book.coverImageUrl}
                      alt={book.title || "Book cover"}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <h2 className="mt-4 font-black">{book.title}</h2>

                <p className="mt-1 text-xs text-zinc-500">
                  {book.book?.author || "DNS Academy"}
                </p>

                <b className="mt-4 block">
                  ₹{Number(book.pricing?.total || 0).toLocaleString("en-IN")}
                </b>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
