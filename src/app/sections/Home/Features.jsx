export default function Features() {
  const features = [
    { title: "Expert Faculty", desc: "Learn from top educators with years of industry experience." },
    { title: "Live Classes", desc: "Interactive live sessions to clear your doubts in real-time." },
    { title: "Mock Tests", desc: "Practice with our exhaustive test series based on latest patterns." },
    { title: "Study Material", desc: "Get access to premium PDF notes and previous year papers." }
  ];

  return (
    <section className="w-full bg-[#f4f4f0] py-20 border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-black mb-4">
            Why Choose <span className="bg-indigo-600 text-white px-2 leading-snug border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">DNS?</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div 
              key={index} 
              className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              <div className="w-10 h-10 bg-indigo-600 border-2 border-black mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
              <h3 className="text-lg font-black text-black mb-2">{item.title}</h3>
              <p className="text-black font-semibold text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}