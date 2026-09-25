import { Award, BookOpenCheck, ShieldCheck, Users } from "lucide-react";

export default function Features() {
  const items = [
    {
      icon: Users,
      title: "Personal Guidance",
      text: "Clear guidance and support when you need it.",
    },
    {
      icon: BookOpenCheck,
      title: "Exam Focused",
      text: "Courses and material built around practical exam preparation.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Learning",
      text: "Purchased content stays behind your account.",
    },
    {
      icon: Award,
      title: "Learn With Confidence",
      text: "Simple lessons, practice and structured progress.",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[.2em] text-indigo-500">
            DNS ACADEMY
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 lg:text-5xl">
            Why students choose DNS
          </h2>
          <p className="mt-4 text-slate-500">
            Everything you need to keep learning in one place.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,.04)] transition hover:-translate-y-1 hover:border-indigo-100 hover:shadow-[0_18px_45px_rgba(79,70,229,.10)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                <Icon size={21} />
              </div>
              <h3 className="mt-6 text-lg font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
