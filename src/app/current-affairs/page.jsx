"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api/v1";

export default function CurrentAffairsPage() {
    const router = useRouter();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const loadCourses = async (search = query, currentPage = page) => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams({
                page: String(currentPage),
                limit: "12",
            });

            if (search.trim()) {
                params.set("q", search.trim());
            }

            const response = await fetch(
                `${API_URL}/current-affairs?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                    cache: "no-store",
                }
            );

            const payload = await response.json();

            if (!response.ok || !payload?.success) {
                throw new Error(
                    payload?.message ||
                    `Current Affairs load failed (${response.status})`
                );
            }

            setCourses(Array.isArray(payload.data) ? payload.data : []);
            setPagination(payload.pagination || null);
        } catch (err) {
            console.error("Current Affairs Error:", err);
            setCourses([]);
            setError(err.message || "Current Affairs load nahi ho pa raha.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses("", 1);
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        setPage(1);
        loadCourses(query, 1);
    };

    const clearSearch = () => {
        setQuery("");
        setPage(1);
        loadCourses("", 1);
    };

    const openCourse = (course) => {
        const detailEndpoint = course?.detailEndpoint || "";
        const match = detailEndpoint.match(/\/current-affairs\/(\d+)$/);
        const id = course?.id || (match ? match[1] : null);

        if (!id) {
            console.error("Current Affairs ID missing:", course);
            return;
        }

        router.push(`/current-affairs/${id}`);
    };

    const formatMoney = (course) => {
        const amount =
            course?.pricing?.breakdown?.total ??
            course?.pricing?.basePrice ??
            0;

        if (course?.purchase?.type === "FREE" || Number(amount) <= 0) {
            return "FREE";
        }
        return `₹${Number(amount).toFixed(2)}`;
    };

    return (
        <main className="min-h-screen bg-gray-50 pt-28 pb-24 px-4 sm:px-6 font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* HEADER */}
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold tracking-wide mb-4">
                        Daily Updates & Analysis
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Current Affairs <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Portal</span>
                    </h1>
                    <p className="text-lg text-gray-500">
                        Stay ahead in your exams with comprehensive daily news, monthly magazines, and revision modules.
                    </p>
                </div>

                {/* SEARCH FORM */}
                <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16">
                    <div className="flex items-center bg-white rounded-2xl p-2 border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                        <div className="pl-4 pr-2 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by topic, month, or exam..."
                            className="flex-1 w-full px-2 py-3 outline-none text-gray-700 bg-transparent placeholder-gray-400 text-base"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="p-2 text-gray-400 hover:text-gray-600 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        <button
                            type="submit"
                            className="ml-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* ERROR STATE */}
                {error && (
                    <div className="max-w-2xl mx-auto mb-10 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Failed to load</h3>
                                <div className="mt-2 text-sm text-red-700"><p>{error}</p></div>
                                <button
                                    onClick={() => loadCourses(query, page)}
                                    className="mt-3 text-sm font-medium text-red-800 hover:text-red-900 underline"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENT AREA */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse">
                                <div className="h-48 bg-gray-200" />
                                <div className="p-6">
                                    <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4" />
                                    <div className="h-4 bg-gray-200 rounded-md w-full mb-2" />
                                    <div className="h-4 bg-gray-200 rounded-md w-5/6 mb-6" />
                                    <div className="flex justify-between items-center mt-6">
                                        <div className="h-6 bg-gray-200 rounded-md w-1/4" />
                                        <div className="h-10 bg-gray-200 rounded-xl w-1/3" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="max-w-xl mx-auto bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                        <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-500 mb-6">We couldn't find any current affairs matching your search criteria.</p>
                        <button
                            onClick={clearSearch}
                            className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition"
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map((course) => {
                                const preview = course.preview || {};
                                const highlights = Array.isArray(preview.highlights) ? preview.highlights : [];
                                const exams = Array.isArray(preview.examTags) ? preview.examTags : [];
                                const languages = Array.isArray(preview.languages) ? preview.languages : [];

                                return (
                                    <article
                                        key={course.id}
                                        className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        {/* IMAGE SECTION */}
                                        <div className="relative h-48 w-full bg-blue-50 overflow-hidden">
                                            {course.imageUrl ? (
                                                <img
                                                    src={course.imageUrl}
                                                    alt={course.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
                                                    <span className="text-4xl font-bold text-white">CA</span>
                                                    <span className="text-blue-100 text-sm mt-1">Current Affairs</span>
                                                </div>
                                            )}
                                            
                                            <div className="absolute top-3 right-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-xs font-bold text-gray-700 shadow-sm">
                                                {String(course.status || "AVAILABLE").replaceAll("_", " ")}
                                            </div>
                                        </div>

                                        {/* CARD CONTENT */}
                                        <div className="flex flex-col flex-1 p-6">
                                            {/* EXAM TAGS */}
                                            {exams.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {exams.slice(0, 3).map((exam) => (
                                                        <span key={exam} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold border border-blue-100">
                                                            {exam}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                                                {course.name}
                                            </h2>

                                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                                {course.description?.short || course.description?.long || "Comprehensive current affairs module for your exam preparation."}
                                            </p>

                                            {/* HIGHLIGHTS */}
                                            {highlights.length > 0 && (
                                                <div className="space-y-2 mb-6">
                                                    {highlights.slice(0, 2).map((item) => (
                                                        <div key={item} className="flex items-start text-sm text-gray-600">
                                                            <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <span className="line-clamp-1">{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex-1" />

                                            {/* FOOTER INFO */}
                                            <div className="pt-4 border-t border-gray-100">
                                                <div className="flex justify-between items-center text-xs text-gray-500 mb-4 font-medium">
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                                        </svg>
                                                        {languages.length ? languages.join(", ") : "English"}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {preview.updateFrequency || "Daily"}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    <div>
                                                        <div className="text-2xl font-black text-gray-900">
                                                            {formatMoney(course)}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => openCourse(course)}
                                                        className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-colors duration-300"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {/* PAGINATION */}
                        {pagination && Number(pagination.totalPages) > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-4">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => {
                                        const next = page - 1;
                                        setPage(next);
                                        loadCourses(query, next);
                                    }}
                                    className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition"
                                >
                                    Previous
                                </button>
                                <span className="text-sm font-medium text-gray-500">
                                    Page <strong className="text-gray-900">{pagination.page || page}</strong> of {pagination.totalPages}
                                </span>
                                <button
                                    disabled={page >= Number(pagination.totalPages)}
                                    onClick={() => {
                                        const next = page + 1;
                                        setPage(next);
                                        loadCourses(query, next);
                                    }}
                                    className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}