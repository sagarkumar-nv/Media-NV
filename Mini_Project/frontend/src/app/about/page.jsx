export default function About() {
  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-b from-black to-gray-900"
    >
      <h2 className="text-4xl font-bold text-center mb-12">
        Why Choose LearnHub?
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
        {[
          {
            title: "Live Learning",
            desc: "Attend live classes with real-time interaction.",
          },
          {
            title: "Smart Dashboard",
            desc: "Track your learning progress with analytics.",
          },
          {
            title: "Certified Courses",
            desc: "Earn certificates recognized by industry.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-gray-900 p-8 rounded-2xl border border-green-600 hover:shadow-[0_0_20px_#22c55e] transition"
          >
            <h3 className="text-2xl font-semibold mb-3 text-green-400">
              {item.title}
            </h3>
            <p className="text-gray-300">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
