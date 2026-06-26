import {
  Droplets,
  Heart,
  Sparkles,
  Shield,
  Cookie,
} from "lucide-react";

const benefits = [
  {
    icon: <Droplets size={32} />,
    title: "Pure & Authentic Aroma",
    desc: "Experience the unadulterated fragrance of traditional wood-pressed oils. No deodorizers, no artificial scents—just nature's true essence.",
    stat: "100%",
    statLabel: "Natural",
  },
  {
    icon: <Heart size={32} />,
    title: "Maximum Nutrition",
    desc: "Our low-temperature extraction preserves vital nutrients, Omega-3 fatty acids, and powerful antioxidants for your family's well-being.",
    stat: "Zero",
    statLabel: "Heat Applied",
  },
  {
    icon: <Shield size={32} />,
    title: "Heart-Healthy Fats",
    desc: "Rich in essential monounsaturated and polyunsaturated fats, supporting healthy cholesterol levels and optimal cardiovascular health.",
    stat: "0%",
    statLabel: "Trans Fats",
  },
  {
    icon: <Sparkles size={32} />,
    title: "Chemical-Free",
    desc: "We never use hexane, bleaching agents, or synthetic preservatives. From seed to bottle, our process remains entirely mechanical.",
    stat: "0%",
    statLabel: "Chemicals",
  },
  {
    icon: <Cookie size={32} />,
    title: "Unmatched Taste",
    desc: "Elevate your everyday cooking. Our oils bring a rich, nutty flavor that enhances the authentic taste of your favorite dishes.",
    stat: "100%",
    statLabel: "Flavor",
  },
];

export default function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="section-padding relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--color-forest-700) 0%, var(--color-forest-800) 100%)",
      }}
    >
      {/* Decorative bg elements */}
      <div
        className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full opacity-10 translate-x-1/3 -translate-y-1/3"
        style={{ background: "radial-gradient(circle, var(--color-amber-400), transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full opacity-5 -translate-x-1/3 translate-y-1/3"
        style={{ background: "radial-gradient(circle, var(--color-forest-300), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div
            className="w-12 h-1 rounded-full mx-auto"
            style={{
              background:
                "linear-gradient(90deg, var(--color-amber-400), var(--color-amber-300))",
            }}
          />
          <h2
            className="section-title"
            style={{ color: "var(--color-cream-100)" }}
          >
            Benefits of Minaliya Oils
          </h2>
          <p
            className="section-subtitle mx-auto"
            style={{ color: "var(--color-forest-200)" }}
          >
            Every bottle is a promise of purity, taste, and nutrition — crafted
            the traditional way.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 overflow-x-auto pb-8 pt-4 sm:pb-0 sm:pt-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory hide-scrollbar">
          {benefits.map((item, i) => (
            <div
              key={i}
              className="group flex flex-col items-center text-center p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 shrink-0 w-[280px] sm:w-auto snap-center h-full relative overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Subtle hover gradient background */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 50% 0%, var(--color-amber-400), transparent 70%)"
                }}
              />
              
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 shadow-inner"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "var(--color-amber-400)",
                }}
              >
                {item.icon}
              </div>
              
              <div className="flex-1 flex flex-col items-center">
                <div className="flex flex-col items-center mb-5">
                  <div
                    className="text-3xl font-bold mb-1 tracking-tight"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-amber-400)",
                    }}
                  >
                    {item.stat}
                  </div>
                  <div
                    className="text-[10px] uppercase tracking-[0.2em] font-bold"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {item.statLabel}
                  </div>
                </div>
                
                <h3
                  className="text-xl font-bold mb-3 tracking-tight leading-snug"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "white",
                  }}
                >
                  {item.title}
                </h3>
                
                <p
                  className="text-sm leading-relaxed font-medium"
                  style={{ color: "rgba(255, 255, 255, 0.85)" }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
