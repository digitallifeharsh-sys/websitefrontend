"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const API = "/backend-api";

const boards = [
  ["NIOS", "/boards/nios.jpeg"],
  ["CBSE", "/boards/cbse.jpeg"],
  ["ICSE", "/boards/icse.jpeg"],
  ["BOSSE", "/boards/bosse.jpeg"],
];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadCourses = async () => {
      try {
        const response = await fetch(`${API}/courses`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Courses load failed: ${response.status}`);
        }

        const payload = await response.json();

        if (active) {
          setCourses(Array.isArray(payload?.data) ? payload.data : []);
        }
      } catch (error) {
        console.error("Home courses error:", error);
        if (active) setCourses([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCourses();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#f7f8fc] py-20 lg:py-24">
      <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-indigo-200/40 blur-[120px]" />
      <div className="absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-violet-200/40 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            Learn • Practice • Progress
          </div>

          <h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Courses
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Structured courses, exam preparation and learning support designed
            for your academic journey.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,.05)] hover:border-indigo-100 hover:shadow-[0_22px_55px_rgba(79,70,229,.12)]"
              >
                <div className="h-48 overflow-hidden bg-indigo-50">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.name || "Course"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-50">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-indigo-100 bg-white text-xl font-black text-indigo-600 shadow-sm">
                        DNS
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <span className="text-xs font-bold uppercase tracking-[.16em] text-indigo-600">
                    DNS Academy
                  </span>

                  <h3 className="mt-2 line-clamp-2 text-xl font-black text-slate-950">
                    {course.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {course.subject?.name || course.description?.short || "Structured learning course"}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <span className="text-xl font-black text-slate-950">
                      ₹{Number(course.price || 0).toLocaleString("en-IN")}
                    </span>

                    <Link
                      href={`/courses/${course.id}`}
                      className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                    >
                      View Course →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-black text-slate-900">
              Courses are being updated
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Please check the Courses page again shortly.
            </p>
            <Link
              href="/courses"
              className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
            >
              Open Courses →
            </Link>
          </div>
        )}

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          {boards.map(([name, logo]) => (
            <div
              key={name}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm"
            >
              <img src={logo} alt="" className="h-7 w-7 object-contain" />
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
