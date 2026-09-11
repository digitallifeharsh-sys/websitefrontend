// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import { motion } from "framer-motion";

// const API_URL = "http://localhost:5000/api/v1";

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
//         "Test Series"
//     );
// }

// function getDescription(test) {
//     return (
//         test?.description?.long ||
//         test?.description ||
//         test?.longDescription ||
//         test?.shortDescription ||
//         test?.short_description ||
//         "Exam-oriented test series designed for focused preparation and practice."
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

// function formatPrice(value) {
//     const price = Number(value);

//     if (!Number.isFinite(price) || price <= 0) {
//         return "FREE";
//     }

//     return `₹${price.toLocaleString("en-IN")}`;
// }

// function DetailSkeleton() {
//     return (
//         <main className="min-h-screen bg-slate-50 pt-28 pb-20 px-6">
//             <div className="max-w-7xl mx-auto">

//                 <div className="h-5 w-32 bg-slate-200 rounded animate-pulse mb-8" />

//                 <div className="grid lg:grid-cols-2 gap-12 items-center">

//                     <div className="h-[420px] rounded-3xl bg-slate-200 animate-pulse" />

//                     <div>
//                         <div className="h-7 w-28 bg-slate-200 rounded-full animate-pulse mb-5" />

//                         <div className="h-12 w-full bg-slate-200 rounded-xl animate-pulse mb-4" />

//                         <div className="h-12 w-3/4 bg-slate-200 rounded-xl animate-pulse mb-8" />

//                         <div className="h-5 w-full bg-slate-200 rounded animate-pulse mb-3" />
//                         <div className="h-5 w-5/6 bg-slate-200 rounded animate-pulse mb-3" />
//                         <div className="h-5 w-4/6 bg-slate-200 rounded animate-pulse mb-8" />

//                         <div className="h-14 w-full bg-slate-200 rounded-xl animate-pulse" />
//                     </div>

//                 </div>

//             </div>
//         </main>
//     );
// }

// function StatBox({ value, label, icon }) {
//     return (
//         <div className="rounded-2xl border border-slate-200 bg-white p-5">
//             <div className="text-2xl mb-2">
//                 {icon}
//             </div>

//             <div className="text-2xl font-black text-slate-900">
//                 {value || "—"}
//             </div>

//             <div className="text-sm font-semibold text-slate-400 mt-1">
//                 {label}
//             </div>
//         </div>
//     );
// }

// export default function TestSeriesDetailPage() {

//     const params = useParams();
//     const router = useRouter();

//     const id = params?.id;

//     const [test, setTest] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     useEffect(() => {

//         if (!id) {
//             return;
//         }

//         let cancelled = false;

//         async function loadTest() {

//             try {

//                 setLoading(true);
//                 setError("");

//                 /*
//                  * Detail endpoint
//                  */
//                 const response = await axios.get(
//                     `${API_URL}/test-series/${id}`,
//                     {
//                         headers: {
//                             Accept: "application/json",
//                         },
//                     }
//                 );

//                 if (cancelled) {
//                     return;
//                 }

//                 const payload = response?.data;

//                 if (payload?.success === false) {
//                     throw new Error(
//                         payload?.message ||
//                         "Test Series nahi mili."
//                     );
//                 }

//                 const data =
//                     payload?.data ||
//                     payload?.test ||
//                     payload?.testSeries ||
//                     payload?.item ||
//                     payload;

//                 setTest(data);

//             } catch (err) {

//                 if (cancelled) {
//                     return;
//                 }

//                 console.error(
//                     "Test Series Detail Error:",
//                     err
//                 );

//                 setError(
//                     err?.response?.data?.message ||
//                     err?.message ||
//                     "Test Series details load nahi ho pa rahi."
//                 );

//             } finally {

//                 if (!cancelled) {
//                     setLoading(false);
//                 }

//             }
//         }

//         loadTest();

//         return () => {
//             cancelled = true;
//         };

//     }, [id]);

//     if (loading) {
//         return <DetailSkeleton />;
//     }

//     if (error || !test) {
//         return (
//             <main className="min-h-screen bg-slate-50 pt-28 pb-20 px-6">

//                 <div className="max-w-2xl mx-auto">

//                     <div className="bg-white border border-red-200 rounded-3xl p-10 text-center shadow-sm">

//                         <div className="text-5xl mb-5">
//                             ⚠️
//                         </div>

//                         <h1 className="text-2xl font-black text-slate-900">
//                             Test Series nahi mili
//                         </h1>

//                         <p className="mt-3 text-slate-500">
//                             {error ||
//                                 "Requested Test Series available nahi hai."}
//                         </p>

//                         <button
//                             onClick={() => router.back()}
//                             className="mt-7 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition"
//                         >
//                             ← Go Back
//                         </button>

//                     </div>

//                 </div>

//             </main>
//         );
//     }

//     const name = getTestName(test);
//     const description = getDescription(test);
//     const image = getImage(test);
//     const category = getCategory(test);
//     const difficulty = getDifficulty(test);
//     const questions = getQuestions(test);
//     const duration = getDuration(test);
//     const attempts = getAttempts(test);
//     const price = getPrice(test);

//     const testId = getTestId(test) || id;

//     const isFree =
//         Number(price) <= 0;

//     return (
//         <main className="min-h-screen bg-slate-50 pt-28 pb-20 px-6 relative overflow-hidden">

//             {/* BACKGROUND */}
//             <div className="absolute -top-40 left-1/4 w-[550px] h-[550px] rounded-full bg-indigo-200/30 blur-[130px] pointer-events-none" />

//             <div className="absolute top-[600px] -right-40 w-[500px] h-[500px] rounded-full bg-violet-200/30 blur-[130px] pointer-events-none" />

//             <div className="relative z-10 max-w-7xl mx-auto">

//                 {/* BREADCRUMB */}
//                 <div className="mb-8 flex items-center gap-2 text-sm">

//                     <Link
//                         href="/test-series"
//                         className="font-semibold text-slate-500 hover:text-indigo-600 transition"
//                     >
//                         Test Series
//                     </Link>

//                     <span className="text-slate-300">
//                         /
//                     </span>

//                     <span className="font-semibold text-slate-800 truncate">
//                         {name}
//                     </span>

//                 </div>

//                 {/* HERO */}
//                 <section className="grid lg:grid-cols-2 gap-12 items-center">

//                     {/* IMAGE */}
//                     <motion.div
//                         initial={{
//                             opacity: 0,
//                             x: -30,
//                         }}
//                         animate={{
//                             opacity: 1,
//                             x: 0,
//                         }}
//                         className="relative"
//                     >

//                         <div className="relative h-[360px] md:h-[440px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 shadow-2xl">

//                             {image ? (

//                                 <img
//                                     src={image}
//                                     alt={name}
//                                     className="w-full h-full object-cover"
//                                 />

//                             ) : (

//                                 <div className="w-full h-full flex items-center justify-center">

//                                     <div className="text-center text-white">

//                                         <div className="text-7xl md:text-8xl font-black tracking-tight">
//                                             TEST
//                                         </div>

//                                         <div className="mt-2 text-indigo-100 text-lg font-bold tracking-[0.4em]">
//                                             SERIES
//                                         </div>

//                                         <div className="mt-8 text-5xl">
//                                             🎯
//                                         </div>

//                                     </div>

//                                 </div>

//                             )}

//                             {/* IMAGE OVERLAY */}
//                             <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

//                             <div className="absolute top-5 left-5">

//                                 <span className="inline-flex px-4 py-2 rounded-xl bg-white/95 backdrop-blur text-indigo-700 text-sm font-black shadow-lg">
//                                     {category}
//                                 </span>

//                             </div>

//                         </div>

//                     </motion.div>

//                     {/* CONTENT */}
//                     <motion.div
//                         initial={{
//                             opacity: 0,
//                             x: 30,
//                         }}
//                         animate={{
//                             opacity: 1,
//                             x: 0,
//                         }}
//                     >

//                         <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold">
//                             🎯 {difficulty}
//                         </span>

//                         <h1 className="mt-6 text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.08]">
//                             {name}
//                         </h1>

//                         <p className="mt-6 text-lg text-slate-600 leading-8">
//                             {description}
//                         </p>

//                         {/* PRICE */}
//                         <div className="mt-8 flex items-end gap-4">

//                             <div className="text-4xl font-black text-slate-900">
//                                 {formatPrice(price)}
//                             </div>

//                             {isFree && (
//                                 <span className="mb-1 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-black">
//                                     FREE TEST
//                                 </span>
//                             )}

//                         </div>

//                         {/* CTA */}
//                         <div className="mt-7">

//                             <Link
//                                 href={`/test-series/${testId}/start`}
//                                 className="block"
//                             >

//                                 <div className="w-full py-4 rounded-2xl bg-indigo-600 text-white text-center font-black text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
//                                     {isFree
//                                         ? "Start Test"
//                                         : "Buy & Start Test"}
//                                 </div>

//                             </Link>

//                         </div>

//                         <p className="mt-4 text-center text-xs text-slate-400">
//                             Secure access • Exam-focused practice
//                         </p>

//                     </motion.div>

//                 </section>

//                 {/* STATS */}
//                 <section className="mt-16">

//                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

//                         <StatBox
//                             icon="📝"
//                             value={questions}
//                             label="Questions"
//                         />

//                         <StatBox
//                             icon="⏱️"
//                             value={
//                                 duration
//                                     ? `${duration} min`
//                                     : null
//                             }
//                             label="Test Duration"
//                         />

//                         <StatBox
//                             icon="🎯"
//                             value={difficulty}
//                             label="Difficulty"
//                         />

//                         <StatBox
//                             icon="👥"
//                             value={attempts}
//                             label="Total Attempts"
//                         />

//                     </div>

//                 </section>

//                 {/* DETAILS */}
//                 <section className="mt-16 grid lg:grid-cols-3 gap-8">

//                     {/* WHAT YOU GET */}
//                     <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-7 md:p-9">

//                         <div className="flex items-center gap-3 mb-7">

//                             <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">
//                                 ✨
//                             </div>

//                             <div>
//                                 <h2 className="text-2xl font-black text-slate-900">
//                                     What You Get
//                                 </h2>

//                                 <p className="text-sm text-slate-500 mt-1">
//                                     Everything you need for better practice
//                                 </p>
//                             </div>

//                         </div>

//                         <div className="grid md:grid-cols-2 gap-4">

//                             <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

//                                 <div className="text-2xl mb-3">
//                                     📝
//                                 </div>

//                                 <h3 className="font-extrabold text-slate-900">
//                                     Exam-Oriented Questions
//                                 </h3>

//                                 <p className="mt-2 text-sm text-slate-500 leading-6">
//                                     Questions designed around the exam
//                                     pattern and preparation requirements.
//                                 </p>

//                             </div>

//                             <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

//                                 <div className="text-2xl mb-3">
//                                     📊
//                                 </div>

//                                 <h3 className="font-extrabold text-slate-900">
//                                     Performance Analysis
//                                 </h3>

//                                 <p className="mt-2 text-sm text-slate-500 leading-6">
//                                     Review your performance and identify
//                                     areas that need more practice.
//                                 </p>

//                             </div>

//                             <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

//                                 <div className="text-2xl mb-3">
//                                     🎯
//                                 </div>

//                                 <h3 className="font-extrabold text-slate-900">
//                                     Exam Practice
//                                 </h3>

//                                 <p className="mt-2 text-sm text-slate-500 leading-6">
//                                     Practice in a focused test environment
//                                     before your actual examination.
//                                 </p>

//                             </div>

//                             <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

//                                 <div className="text-2xl mb-3">
//                                     ⚡
//                                 </div>

//                                 <h3 className="font-extrabold text-slate-900">
//                                     Instant Results
//                                 </h3>

//                                 <p className="mt-2 text-sm text-slate-500 leading-6">
//                                     Get your result after completing the
//                                     test and understand your performance.
//                                 </p>

//                             </div>

//                         </div>

//                     </div>

//                     {/* QUICK INFO */}
//                     <aside className="bg-slate-900 rounded-3xl p-7 md:p-8 text-white h-fit">

//                         <p className="text-indigo-300 text-sm font-bold uppercase tracking-wider">
//                             Test Information
//                         </p>

//                         <h2 className="mt-3 text-2xl font-black">
//                             Prepare. Practice. Improve.
//                         </h2>

//                         <div className="mt-8 space-y-5">

//                             <div className="flex justify-between gap-4 pb-5 border-b border-white/10">

//                                 <span className="text-slate-400">
//                                     Exam
//                                 </span>

//                                 <span className="font-bold text-right">
//                                     {category}
//                                 </span>

//                             </div>

//                             <div className="flex justify-between gap-4 pb-5 border-b border-white/10">

//                                 <span className="text-slate-400">
//                                     Questions
//                                 </span>

//                                 <span className="font-bold">
//                                     {questions || "—"}
//                                 </span>

//                             </div>

//                             <div className="flex justify-between gap-4 pb-5 border-b border-white/10">

//                                 <span className="text-slate-400">
//                                     Duration
//                                 </span>

//                                 <span className="font-bold">
//                                     {duration
//                                         ? `${duration} min`
//                                         : "—"}
//                                 </span>

//                             </div>

//                             <div className="flex justify-between gap-4">

//                                 <span className="text-slate-400">
//                                     Price
//                                 </span>

//                                 <span className="font-bold text-indigo-300">
//                                     {formatPrice(price)}
//                                 </span>

//                             </div>

//                         </div>

//                         <Link
//                             href={`/test-series/${testId}/start`}
//                             className="mt-8 block"
//                         >

//                             <div className="w-full py-3.5 rounded-xl bg-white text-slate-900 text-center font-black hover:bg-indigo-50 transition">
//                                 {isFree
//                                     ? "Start Test"
//                                     : "Continue"}
//                             </div>

//                         </Link>

//                     </aside>

//                 </section>

//                 {/* BOTTOM CTA */}
//                 <section className="mt-16 rounded-[2rem] bg-gradient-to-r from-indigo-600 to-violet-700 p-8 md:p-12 text-white overflow-hidden relative">

//                     <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

//                     <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">

//                         <div>

//                             <p className="text-indigo-200 font-bold text-sm uppercase tracking-wider">
//                                 Ready to practice?
//                             </p>

//                             <h2 className="mt-2 text-3xl md:text-4xl font-black">
//                                 Start your preparation today.
//                             </h2>

//                             <p className="mt-3 text-indigo-100 max-w-xl">
//                                 Attempt the test and find out where you
//                                 stand before the real examination.
//                             </p>

//                         </div>

//                         <Link
//                             href={`/test-series/${testId}/start`}
//                             className="shrink-0"
//                         >

//                             <div className="px-8 py-4 rounded-xl bg-white text-indigo-700 font-black text-center hover:bg-indigo-50 transition shadow-xl">
//                                 {isFree
//                                     ? "Start Test →"
//                                     : "Buy & Start →"}
//                             </div>

//                         </Link>

//                     </div>

//                 </section>

//             </div>

//         </main>
//     );
// }