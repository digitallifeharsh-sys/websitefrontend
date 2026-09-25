export default function Testimonials() {
  const items = [
    ["Student learning", "Clear lessons and structured content made it easier to stay consistent."],
    ["Exam preparation", "Everything needed for revision is kept in one place."],
    ["DNS support", "Simple access to courses, purchases and learning progress."],
  ];

  return (
    <section className="bg-[#f7f8fc] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[.2em] text-indigo-500">
            STUDENT EXPERIENCE
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            Built for focused learning.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map(([title, text]) => (
            <div
              key={title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                ✦
              </div>
              <h3 className="mt-7 font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
