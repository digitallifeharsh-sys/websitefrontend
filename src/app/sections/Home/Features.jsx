import { Award, BookOpenCheck, ShieldCheck, Users } from "lucide-react";

export default function Features(){
 const items=[
  {icon:Users,title:"Personal Guidance",text:"Clear guidance and support when you need it."},
  {icon:BookOpenCheck,title:"Exam Focused",text:"Courses and material built around practical exam preparation."},
  {icon:ShieldCheck,title:"Secure Learning",text:"Purchased content stays behind your account."},
  {icon:Award,title:"Learn With Confidence",text:"Simple lessons, practice and structured progress."},
 ];
 return <section className="bg-[#f4f3ef] py-24"><div className="max-w-6xl mx-auto px-6"><div className="max-w-2xl"><p className="text-xs font-bold tracking-[.2em] text-zinc-500">DNS ACADEMY</p><h2 className="mt-3 text-4xl lg:text-5xl font-black tracking-tight">Why students choose DNS</h2><p className="mt-4 text-zinc-500">Everything you need to keep learning in one place.</p></div><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">{items.map(({icon:Icon,title,text})=><div key={title} className="relative rounded-3xl bg-white border border-zinc-200 p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl transition"><div className="absolute -top-3 right-5 w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center rotate-3"><Icon size={21}/></div><h3 className="font-black text-lg mt-6">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-500">{text}</p></div>)}</div></div></section>
}