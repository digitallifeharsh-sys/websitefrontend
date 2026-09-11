// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { motion } from "framer-motion";

// const API_URL = "http://localhost:5000/api/v1";

// function TestCardSkeleton() {
//     return (
//         <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//             <div className="h-48 bg-slate-100 animate-pulse" />

//             <div className="p-6">
//                 <div className="h-5 w-24 rounded-full bg-slate-100 animate-pulse mb-4" />
//                 <div className="h-6 w-full rounded bg-slate-100 animate-pulse mb-2" />
//                 <div className="h-6 w-3/4 rounded bg-slate-100 animate-pulse mb-5" />

//                 <div className="h-3 w-full rounded bg-slate-100 animate-pulse mb-2" />
//                 <div className="h-3 w-5/6 rounded bg-slate-100 animate-pulse" />

//                 <div className="grid grid-cols-3 gap-2 mt-6">
//                     <div className="h-14 rounded-xl bg-slate-100 animate-pulse" />
//                     <div className="h-14 rounded-xl bg-slate-100 animate-pulse" />
//                     <div className="h-14 rounded-xl bg-slate-100 animate-pulse" />
//                 </div>

//                 <div className="h-12 rounded-xl bg-slate-100 animate-pulse mt-6" />
//             </div>
//         </div>
//     );
// }

// function LoadingState() {
//     return (
//         <main className="min-h-screen bg-slate-50 pt-28 pb-20 px-6">
//             <div className="max-w-7xl mx-auto">

//                 <div className="text-center mb-14">
//                     <div className="h-7 w-32 bg-slate-100 rounded-full mx-auto mb-5 animate-pulse" />
//                     <div className="h-12 w-80 bg-slate-100 rounded-xl mx-auto animate-pulse" />
//                     <div className="h-5 w-2/3 max-w-2xl bg-slate-100 rounded mx-auto mt-5 animate-pulse" />
//                 </div>

//                 <div className="max-w-4xl mx-auto mb-10">
//                     <div className="h-16 rounded-2xl bg-white border border-slate-200 animate-pulse" />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {Array.from({ length: 6 }).map((_, index) => (
//                         <TestCardSkeleton key={index} />
//                     ))}
//                 </div>

//             </div>
//         </main>
//     );
// }

// function getTestId(test) {
//     return (
//         test?.id ||
//         test?._id ||
//         test?.testSeriesId ||
//         test?.test_series_id
//     );
// }

// function getTestName(test) {
//     return (
//         test?.name ||
//         test?.title ||
//         test?.testName ||
//         test?.test_name ||
//         "Mock Test"
//     );
// }

// function getDescription(test) {
//     return (
//         test?.description?.short ||
//         test?.description ||
//         test?.shortDescription ||
//         test?.short_description ||
//         "Exam-oriented mock test series for focused preparation and practice."
//     );
// }

// function getImage(test) {
//     return (
//         test?.imageUrl ||
//         test?.image ||
//         test?.thumbnail ||
//         test?.thumbnailUrl ||
//         test?.coverImage ||
//         test?.cover_image ||
//         null
//     );
// }

// function getCategory(test) {
//     return (
//         test?.category ||
//         test?.exam ||
//         test?.examType ||
//         test?.exam_type ||
//         test?.preview?.examTags?.[0] ||
//         "General"
//     );
// }

// function getDifficulty(test) {
//     return (
//         test?.difficulty ||
//         test?.level ||
//         test?.preview?.difficulty ||
//         "All Levels"
//     );
// }

// function getQuestions(test) {
//     return (
//         test?.totalQuestions ??
//         test?.questionsCount ??
//         test?.questionCount ??
//         test?.total_questions ??
//         test?.question_count ??
//         test?.preview?.questionCount ??
//         0
//     );
// }

// function getDuration(test) {
//     return (
//         test?.durationMinutes ??
//         test?.duration ??
//         test?.timeLimit ??
//         test?.time_limit ??
//         test?.preview?.durationMinutes ??
//         0
//     );
// }

// function getAttempts(test) {
//     return (
//         test?.attempts ??
//         test?.attemptCount ??
//         test?.totalAttempts ??
//         test?.attempt_count ??
//         test?.preview?.attempts ??
//         0
//     );
// }

// function getPrice(test) {
//     return (
//         test?.pricing?.breakdown?.total ??
//         test?.pricing?.total ??
//         test?.pricing?.basePrice ??
//         test?.price ??
//         test?.amount ??
//         0
//     );
// }

// function getStatus(test) {
//     return String(
//         test?.status ||
//         test?.state ||
//         "PUBLISHED"
//     ).toUpperCase();
// }

// function formatPrice(value) {
//     const price = Number(value);

//     if (!Number.isFinite(price) || price <= 0) {
//         return "FREE";
//     }

//     return `₹${price.toLocaleString("en-IN")}`;
// }

// export default function TestSeriesPage() {

//     const [tests, setTests] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const [search, setSearch] = useState("");
//     const [activeCategory, setActiveCategory] = useState("All");
//     const [activeDifficulty, setActiveDifficulty] = useState("All");

//     const loadTests = async () => {

//         try {
//             setLoading(true);
//             setError("");

//             const params = new URLSearchParams();

//             params.set("page", "1");
//             params.set("limit", "12");

//             if (search.trim()) {
//                 params.set("q", search.trim());
//             }

//             if (activeCategory !== "All") {
//                 params.set("category", activeCategory);
//             }

//             if (activeDifficulty !== "All") {
//                 params.set("difficulty", activeDifficulty);
//             }

//             const response = await axios.get(
//                 `${API_URL}/test-series?${params.toString()}`,
//                 {
//                     headers: {
//                         Accept: "application/json",
//                     },
//                 }
//             );

//             const payload = response?.data;

//             if (payload?.success === false) {
//                 throw new Error(
//                     payload?.message ||
//                     "Unable to load Test Series."
//                 );
//             }

//             const data =
//                 payload?.data ||
//                 payload?.tests ||
//                 payload?.testSeries ||
//                 payload?.items ||
//                 [];

//             if (Array.isArray(data)) {
//                 setTests(data);
//             } else {
//                 setTests([]);
//             }

//         } catch (err) {

//             console.error(
//                 "Test Series API Error:",
//                 err
//             );

//             setError(
//                 err?.response?.data?.message ||
//                 err?.message ||
//                 "Test Series load nahi ho pa rahi."
//             );

//             setTests([]);

//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         loadTests();
//     }, []);

//     const categories = useMemo(() => {

//         const values = tests
//             .map((test) => getCategory(test))
//             .filter(Boolean);

//         return [
//             "All",
//             ...Array.from(new Set(values)),
//         ];

//     }, [tests]);

//     const difficulties = useMemo(() => {

//         const values = tests
//             .map((test) => getDifficulty(test))
//             .filter(Boolean);

//         return [
//             "All",
//             ...Array.from(new Set(values)),
//         ];

//     }, [tests]);

//     const handleSearch = async (event) => {
//         event.preventDefault();
//         await loadTests();
//     };

//     const handleCategory = async (category) => {
//         setActiveCategory(category);

//         setTimeout(() => {
//             loadTests();
//         }, 0);
//     };

//     const handleDifficulty = async (difficulty) => {
//         setActiveDifficulty(difficulty);

//         setTimeout(() => {
//             loadTests();
//         }, 0);
//     };

//     if (loading) {
//         return <LoadingState />;
//     }

//     return (
//         <main className="min-h-screen bg-slate-50 pt-28 pb-20 px-6 relative overflow-hidden">

//             {/* Background decoration */}
//             <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-200/30 blur-[120px] pointer-events-none" />

//             <div className="absolute top-[500px] -right-40 w-[500px] h-[500px] rounded-full bg-violet-200/30 blur-[120px] pointer-events-none" />

//             <div className="relative z-10 max-w-7xl mx-auto">

//                 {/* HERO */}
//                 <section className="text-center mb-12">

//                     <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-indigo-600 text-sm font-bold shadow-sm">
//                         🎯 Exam Preparation
//                     </span>

//                     <h1 className="mt-6 text-4xl md:text-6xl font-black tracking-tight text-slate-900">
//                         Test{" "}
//                         <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
//                             Series
//                         </span>
//                     </h1>

//                     <p className="mt-5 max-w-2xl mx-auto text-lg text-slate-600 leading-8">
//                         Practice with exam-focused mock tests,
//                         improve your accuracy and understand your
//                         performance better.
//                     </p>

//                 </section>

//                 {/* SEARCH */}
//                 <section className="max-w-4xl mx-auto mb-10">

//                     <form
//                         onSubmit={handleSearch}
//                         className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex flex-col md:flex-row gap-2"
//                     >

//                         <div className="flex-1 flex items-center px-4">

//                             <span className="text-slate-400 text-xl mr-3">
//                                 🔍
//                             </span>

//                             <input
//                                 type="text"
//                                 value={search}
//                                 onChange={(event) =>
//                                     setSearch(
//                                         event.target.value
//                                     )
//                                 }
//                                 placeholder="Search test series, exams..."
//                                 className="w-full h-12 outline-none text-slate-800 placeholder:text-slate-400 bg-transparent"
//                             />

//                         </div>

//                         <button
//                             type="submit"
//                             className="h-12 px-8 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
//                         >
//                             Search
//                         </button>

//                     </form>

//                 </section>

//                 {/* FILTERS */}
//                 <section className="mb-10">

//                     <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">

//                         {/* CATEGORY */}
//                         <div className="flex-1">

//                             <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
//                                 Exam Category
//                             </p>

//                             <div className="flex flex-wrap gap-2">

//                                 {categories.map((category) => (

//                                     <button
//                                         key={category}
//                                         onClick={() =>
//                                             handleCategory(category)
//                                         }
//                                         className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
//                                             activeCategory === category
//                                                 ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
//                                                 : "bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-600"
//                                         }`}
//                                     >
//                                         {category}
//                                     </button>

//                                 ))}

//                             </div>

//                         </div>

//                         {/* DIFFICULTY */}
//                         <div>

//                             <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
//                                 Difficulty
//                             </p>

//                             <div className="flex flex-wrap gap-2">

//                                 {difficulties.map((difficulty) => (

//                                     <button
//                                         key={difficulty}
//                                         onClick={() =>
//                                             handleDifficulty(
//                                                 difficulty
//                                             )
//                                         }
//                                         className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
//                                             activeDifficulty === difficulty
//                                                 ? "bg-slate-900 text-white border-slate-900"
//                                                 : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
//                                         }`}
//                                     >
//                                         {difficulty}
//                                     </button>

//                                 ))}

//                             </div>

//                         </div>

//                     </div>

//                 </section>

//                 {/* ERROR */}
//                 {error && (

//                     <div className="max-w-2xl mx-auto mb-10 bg-red-50 border border-red-200 rounded-2xl p-6 text-center">

//                         <div className="text-3xl mb-3">
//                             ⚠️
//                         </div>

//                         <h2 className="font-bold text-red-700">
//                             Test Series load nahi ho pa rahi
//                         </h2>

//                         <p className="text-sm text-red-600 mt-2">
//                             {error}
//                         </p>

//                         <button
//                             onClick={loadTests}
//                             className="mt-5 px-6 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition"
//                         >
//                             Try Again
//                         </button>

//                     </div>

//                 )}

//                 {/* EMPTY */}
//                 {!error && tests.length === 0 && (

//                     <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">

//                         <div className="text-6xl mb-5">
//                             📝
//                         </div>

//                         <h2 className="text-2xl font-bold text-slate-900">
//                             No Test Series Found
//                         </h2>

//                         <p className="mt-3 text-slate-500 max-w-md mx-auto">
//                             Abhi koi published test series available
//                             nahi hai. Search ya filters change karke
//                             dobara try karein.
//                         </p>

//                     </div>

//                 )}

//                 {/* TEST SERIES GRID */}
//                 {tests.length > 0 && (

//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

//                         {tests.map((test, index) => {

//                             const id = getTestId(test);
//                             const name = getTestName(test);
//                             const description = getDescription(test);
//                             const image = getImage(test);
//                             const category = getCategory(test);
//                             const difficulty = getDifficulty(test);
//                             const questions = getQuestions(test);
//                             const duration = getDuration(test);
//                             const attempts = getAttempts(test);
//                             const price = getPrice(test);
//                             const status = getStatus(test);

//                             const isPublished =
//                                 status === "PUBLISHED";

//                             return (
//                                 <motion.article
//                                     key={id || index}
//                                     initial={{
//                                         opacity: 0,
//                                         y: 20,
//                                     }}
//                                     animate={{
//                                         opacity: 1,
//                                         y: 0,
//                                     }}
//                                     transition={{
//                                         delay: index * 0.05,
//                                     }}
//                                     whileHover={{
//                                         y: -6,
//                                     }}
//                                     className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col"
//                                 >

//                                     {/* CARD IMAGE */}
//                                     <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700">

//                                         {image ? (

//                                             <img
//                                                 src={image}
//                                                 alt={name}
//                                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                                                 onError={(event) => {
//                                                     event.currentTarget.style.display =
//                                                         "none";
//                                                 }}
//                                             />

//                                         ) : (

//                                             <div className="w-full h-full flex items-center justify-center">

//                                                 <div className="text-center text-white">

//                                                     <div className="text-5xl font-black tracking-tight">
//                                                         TEST
//                                                     </div>

//                                                     <div className="text-indigo-100 text-sm font-bold tracking-[0.3em] mt-1">
//                                                         SERIES
//                                                     </div>

//                                                 </div>

//                                             </div>

//                                         )}

//                                         {/* CATEGORY */}
//                                         <div className="absolute top-4 left-4">

//                                             <span className="inline-flex px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur text-indigo-700 text-xs font-bold shadow-sm">
//                                                 {category}
//                                             </span>

//                                         </div>

//                                         {/* STATUS */}
//                                         {!isPublished && (

//                                             <div className="absolute top-4 right-4">

//                                                 <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold shadow-sm">
//                                                     {status.replaceAll(
//                                                         "_",
//                                                         " "
//                                                     )}
//                                                 </span>

//                                             </div>

//                                         )}

//                                     </div>

//                                     {/* CARD CONTENT */}
//                                     <div className="p-6 flex flex-col flex-1">

//                                         <div className="flex items-start justify-between gap-4">

//                                             <h2 className="text-xl font-extrabold text-slate-900 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
//                                                 {name}
//                                             </h2>

//                                             <span className="shrink-0 text-lg font-black text-slate-900">
//                                                 {formatPrice(price)}
//                                             </span>

//                                         </div>

//                                         <p className="mt-3 text-sm text-slate-500 leading-6 line-clamp-3">
//                                             {description}
//                                         </p>

//                                         {/* DIFFICULTY */}
//                                         <div className="mt-4">

//                                             <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
//                                                 ⚡ {difficulty}
//                                             </span>

//                                         </div>

//                                         {/* STATS */}
//                                         <div className="grid grid-cols-3 gap-2 mt-6">

//                                             <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">

//                                                 <div className="text-lg font-black text-slate-900">
//                                                     {questions || "—"}
//                                                 </div>

//                                                 <div className="text-[11px] font-semibold text-slate-400 mt-1">
//                                                     Questions
//                                                 </div>

//                                             </div>

//                                             <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">

//                                                 <div className="text-lg font-black text-slate-900">
//                                                     {duration
//                                                         ? `${duration}m`
//                                                         : "—"}
//                                                 </div>

//                                                 <div className="text-[11px] font-semibold text-slate-400 mt-1">
//                                                     Duration
//                                                 </div>

//                                             </div>

//                                             <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">

//                                                 <div className="text-lg font-black text-slate-900">
//                                                     {attempts || "—"}
//                                                 </div>

//                                                 <div className="text-[11px] font-semibold text-slate-400 mt-1">
//                                                     Attempts
//                                                 </div>

//                                             </div>

//                                         </div>

//                                         {/* CTA */}
//                                       <Link
//     href={`/test-series/${getTestId(test)}`}
//     className="mt-6 block"
// >
//     <div className="w-full py-3.5 rounded-xl text-center font-bold bg-slate-50 border border-slate-200 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
//         View Test Series
//     </div>
// </Link>

//                                     </div>

//                                 </motion.article>
//                             );
//                         })}

//                     </div>

//                 )}

//             </div>

//         </main>
//     );
// }