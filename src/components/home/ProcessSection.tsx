import { Wheat, Cog, Filter, Package, Truck } from "lucide-react";

const steps = [
  {
    icon: <Wheat size={28} />,
    step: "01",
    title: "Seed Selection",
    desc: "Premium quality seeds sourced directly from trusted Indian farms. Every batch is hand-inspected for freshness and purity.",
    color: "var(--color-amber-500)",
    bg: "var(--color-amber-50)",
  },
  {
    icon: <Cog size={28} />,
    step: "02",
    title: "Wooden Press Extraction",
    desc: "Seeds are slowly crushed in traditional Mara Chekku (wooden press) at temperatures below 50°C, preserving all natural nutrients.",
    color: "var(--color-forest-500)",
    bg: "var(--color-forest-50)",
  },
  {
    icon: <Filter size={28} />,
    step: "03",
    title: "Natural Filtration",
    desc: "The extracted oil is naturally filtered without any chemical processing — no bleaching, no deodorizing, no refining.",
    color: "var(--color-terra-400)",
    bg: "var(--color-terra-50)",
  },
  {
    icon: <Package size={28} />,
    step: "04",
    title: "Fresh Bottling",
    desc: "Filtered oil is bottled fresh in food-grade containers to lock in the natural aroma, flavor, and nutritional value.",
    color: "var(--color-wood-500)",
    bg: "var(--color-wood-50)",
  },
  {
    icon: <Truck size={28} />,
    step: "05",
    title: "Delivered to Home",
    desc: "Carefully packaged and delivered to your doorstep across India. From our press to your kitchen — fresh and pure.",
    color: "var(--color-forest-600)",
    bg: "var(--color-forest-50)",
  },
];

export default function ProcessSection() {
  return (
    <section
      id="process"
      className="section-padding relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--color-cream-100) 0%, var(--color-cream-50) 100%)",
      }}
    >
      {/* Background Decoration */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
        style={{ background: "var(--color-forest-300)", filter: "blur(120px)" }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="divider-leaf mx-auto" />
          <h2 className="section-title">Our Traditional Process</h2>
          <p className="section-subtitle mx-auto">
            From seed to bottle — a time-honored process that has been trusted
            for generations across Tamil Nadu.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: "var(--color-stone-200)" }}
          />

          <div className="space-y-8 md:space-y-0">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={i} className="relative md:grid md:grid-cols-2 md:gap-8 md:py-8">
                  {/* Dot on timeline */}
                  <div
                    className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full items-center justify-center font-bold text-sm"
                    style={{
                      background: step.color,
                      color: "white",
                      boxShadow: `0 0 0 6px var(--color-cream-100), 0 0 0 8px ${step.color}30`,
                    }}
                  >
                    {step.step}
                  </div>

                  {/* Card */}
                  <div
                    className={`${
                      isLeft ? "md:col-start-1 md:text-right" : "md:col-start-2"
                    } p-6 rounded-2xl transition-all duration-300 hover:shadow-md`}
                    style={{
                      background: "white",
                      border: "1px solid var(--color-stone-200)",
                    }}
                  >
                    <div
                      className={`flex items-start gap-4 ${
                        isLeft ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: step.bg, color: step.color }}
                      >
                        {step.icon}
                      </div>
                      <div>
                        <span
                          className="text-xs font-bold uppercase tracking-wider block mb-1"
                          style={{ color: step.color }}
                        >
                          Step {step.step}
                        </span>
                        <h3
                          className="text-lg font-semibold mb-2"
                          style={{
                            fontFamily: "var(--font-heading)",
                            color: "var(--color-stone-800)",
                          }}
                        >
                          {step.title}
                        </h3>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--color-stone-500)" }}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Empty column for alternating layout */}
                  {isLeft ? (
                    <div className="hidden md:block" />
                  ) : (
                    <div className="hidden md:block md:col-start-1 md:row-start-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
