import Link from "next/link";
import { ArrowRight, Droplets, FlaskConical, Flame, Leaf } from "lucide-react";

const comparisons = [
  {
    feature: "Extraction Temperature",
    coldPressed: "Below 50°C",
    refined: "Above 200°C",
  },
  {
    feature: "Nutrients",
    coldPressed: "Fully Retained",
    refined: "Mostly Destroyed",
  },
  {
    feature: "Chemicals Used",
    coldPressed: "Zero",
    refined: "Hexane & Others",
  },
  {
    feature: "Natural Aroma",
    coldPressed: "Rich & Authentic",
    refined: "Deodorized",
  },
  {
    feature: "Shelf Life",
    coldPressed: "6-8 Months Natural",
    refined: "12+ Months (Preservatives)",
  },
  {
    feature: "Health Impact",
    coldPressed: "Heart Healthy",
    refined: "Trans Fats Risk",
  },
];

const benefits = [
  {
    icon: <Droplets size={28} />,
    title: "Nutrient Retention",
    text: "Cold pressing at low temperatures preserves vital Vitamin E, Omega-3, and natural antioxidants that industrial refining completely destroys.",
  },
  {
    icon: <Leaf size={28} />,
    title: "No Chemical Processing",
    text: "Unlike refined oils that rely on hexane solvent extraction, our oils are purely mechanically pressed from sun-dried seeds.",
  },
  {
    icon: <Flame size={28} />,
    title: "High Smoke Point Safety",
    text: "Traditional wood pressing maintains the oil's natural structural stability, making it perfectly safe and ideal for high-heat Indian cooking.",
  },
  {
    icon: <FlaskConical size={28} />,
    title: "Better for Digestion",
    text: "The intact natural enzymes and fatty acids in our cold-pressed oils actively aid digestion and improve daily nutrient absorption.",
  },
];

export default function WhyColdPressed() {
  return (
    <section
      id="why-cold-pressed"
      className="section-padding"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="divider-leaf mx-auto" />
          <h2 className="section-title">
            Why Cold Pressed Oils Matter
          </h2>
          <p className="section-subtitle mx-auto">
            Understand the real difference between refined and cold pressed
            oils — and why your family deserves better.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div
              className="rounded-2xl overflow-hidden shadow-sm min-w-[380px] sm:min-w-0"
              style={{ border: "1px solid var(--color-stone-200)" }}
            >
              {/* Table Header */}
              <div
                className="grid grid-cols-3 text-xs sm:text-sm font-semibold"
                style={{ background: "var(--color-forest-600)", color: "white" }}
              >
                <div className="px-3 sm:px-5 py-3 sm:py-4">Feature</div>
                <div className="px-3 sm:px-5 py-3 sm:py-4 text-center">Cold Pressed ✅</div>
                <div className="px-3 sm:px-5 py-3 sm:py-4 text-center">Refined Oil ❌</div>
              </div>
              {/* Rows */}
              {comparisons.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 text-xs sm:text-sm border-b last:border-b-0"
                  style={{
                    borderColor: "var(--color-stone-100)",
                    background: i % 2 === 0 ? "white" : "var(--color-cream-50)",
                  }}
                >
                  <div
                    className="px-3 sm:px-5 py-3 sm:py-4 font-medium"
                    style={{ color: "var(--color-stone-700)" }}
                  >
                    {row.feature}
                  </div>
                  <div
                    className="px-3 sm:px-5 py-3 sm:py-4 text-center font-medium"
                    style={{ color: "var(--color-forest-600)" }}
                  >
                    {row.coldPressed}
                  </div>
                  <div
                    className="px-3 sm:px-5 py-3 sm:py-4 text-center"
                    style={{ color: "var(--color-stone-400)" }}
                  >
                    {row.refined}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {benefits.map((item, i) => (
            <div
              key={i}
              className="group flex flex-col h-full p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              style={{
                background: "white",
                border: "1px solid var(--color-stone-200)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
              }}
            >
              {/* Subtle gradient hover background */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, var(--color-forest-50) 0%, transparent 100%)"
                }}
              />
              
              <div
                className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 shadow-sm"
                style={{
                  background: "white",
                  border: "1px solid var(--color-forest-100)",
                  color: "var(--color-forest-600)",
                }}
              >
                {item.icon}
              </div>
              
              <div className="flex-1 flex flex-col relative z-10">
                <h3
                  className="text-xl font-bold mb-3 tracking-tight leading-snug"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-stone-900)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-[1.7] font-medium"
                  style={{ color: "var(--color-stone-600)" }}
                >
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link href="/shop" className="btn-primary">
            Choose Your Pure Oil
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
