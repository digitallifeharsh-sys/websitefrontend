"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = "/backend-api";

export default function TestSeries() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({ page: "1", limit: "30" });
      if (query.trim()) params.set("q", query.trim());

      const response = await fetch(`${API}/test-series?${params}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Test series load failed (${response.status})`);

      const payload = await response.json();
      setData(Array.isArray(payload?.data) ? payload.data : []);
    } catch (err) {
      console.error("Test Series Error:", err);
      setData([]);
      setError("Test series load nahi ho rahi. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f6fb] px-5 py-28">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-2 text-sm font-bold text-indigo-600">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            PRACTICE
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-black text-slate-900">Test Series</h1>
          <p className="mt-3 text-base text-slate-500">Practice tests and mock exams from your DNS catalog.</p>
        </div>

        <div className="max-w-2xl mx-auto mb-10 flex gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && load()}
            placeholder="Search tests..."
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
          />
          <button onClick={load} className="rounded-2xl bg-indigo-600 text-white px-6 font-bold hover:bg-indigo-700">
            Search
          </button>
        </div>

        {error && <div className="max-w-2xl mx-auto mb-8 rounded-2xl bg-red-50 border border-red-100 px-5 py-4 text-sm font-semibold text-red-700">{error}</div>}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((item)=><div key={item} className="h-80 rounded-3xl bg-white border border-slate-200 animate-pulse"/>)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
              <Link key={item.id} href={`/test-series/${item.id}`} className="group rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(79,70,229,.12)] hover:-translate-y-1 transition-all">
                <div className="h-40 bg-indigo-50 overflow-hidden">
                  {item.coverImageUrl ? <img src={item.coverImageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/> : <div className="h-full flex items-center justify-center"><span className="w-16 h-16 rounded-2xl bg-white text-indigo-600 flex items-center justify-center font-black border border-indigo-100">TEST</span></div>}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-black text-slate-900 line-clamp-2">{item.title}</h2>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">{item.description?.short || "Practice and revise with structured tests."}</p>
                  <div className="grid grid-cols-3 gap-2 mt-5 text-xs font-bold text-slate-600">
                    <span className="bg-slate-50 border border-slate-100 rounded-xl p-2">{item.testSeries?.totalQuestions || 0} Q</span>
                    <span className="bg-slate-50 border border-slate-100 rounded-xl p-2">{item.testSeries?.durationMinutes || 0} min</span>
                    <span className="bg-slate-50 border border-slate-100 rounded-xl p-2">₹{Number(item.pricing?.total || 0).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
