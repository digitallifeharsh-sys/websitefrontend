export default function Testimonials() {
  const items = [
    [
      "Student learning",
      "Clear lessons and structured content made it easier to stay consistent.",
    ],
    [
      "Exam preparation",
      "Everything needed for revision is kept in one place.",
    ],
    [
      "DNS support",
      "Simple access to courses, purchases and learning progress.",
    ],
  ];

  return (
    <section className="bg-[#f4f3ef] py-24">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-xs font-bold tracking-[.2em] text-zinc-500">
          STUDENT EXPERIENCE
        </p>
        <h2 className="mt-3 text-4xl font-black">
          Built for focused learning.
        </h2>

        <div className="grid md:grid-cols-3 gap-4 mt-10">
          {items.map(([title, text]) => (
            <div
              key={title}
              className="rounded-3xl bg-white border border-zinc-200 p-6"
            >
              <div className="text-2xl">✦</div>
              <h3 className="mt-8 font-black">{title}</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-6">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
