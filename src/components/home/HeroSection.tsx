"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

/* ═══════════════════════════════════════════
   SLIDE DATA
   ═══════════════════════════════════════════ */

interface Slide {
  id: string;
  label: string;
  headlineParts: { text: string; style: "display" | "serif-italic" | "sans" }[];
  subtitle: string;
  image: string;
  imageAlt: string;
  accentColor: string;
  badge: string;
  /* Background color palette per slide */
  bg: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const slides: Slide[] = [
  {
    id: "groundnut",
    label: "Tradition Crafted Since Generations",
    headlineParts: [
      { text: "Pure Wooden", style: "sans" },
      { text: "Cold Pressed", style: "serif-italic" },
      { text: "Oils For Modern", style: "sans" },
      { text: "Healthy Living", style: "display" },
    ],
    subtitle:
      "Traditionally extracted using authentic Mara Chekku methods to preserve natural aroma, nutrients, and purity — the way it was meant to be.",
    image: "/products/Groundnut_Oil_1_Ltr-removebg-preview.png",
    imageAlt:
      "Minaliya Pure Cold Pressed Groundnut Oil — Mara Chekku Wood Pressed",
    accentColor: "#C47700",
    badge: "Bestseller · Groundnut Oil",
    bg: {
      primary: "#FFF3D0",
      secondary: "#FFEAB0",
      accent: "#FFE08F",
    },
  },
  {
    id: "sesame",
    label: "The Heart of Tamil Cuisine",
    headlineParts: [
      { text: "Ancient Wisdom", style: "display" },
      { text: "in Every", style: "sans" },
      { text: "Golden Drop", style: "serif-italic" },
      { text: "of Sesame", style: "sans" },
    ],
    subtitle:
      "Gingelly oil extracted the traditional way — rich in antioxidants, perfect for authentic South Indian cooking and Ayurvedic wellness.",
    image: "/products/Sesame_Oil_1_Ltr-removebg-preview.png",
    imageAlt:
      "Minaliya Pure Cold Pressed Sesame Gingelly Oil — Traditional Extraction",
    accentColor: "#C4612A",
    badge: "Heritage · Sesame Oil",
    bg: {
      primary: "#FFE6D6",
      secondary: "#FFC9A8",
      accent: "#FFDDA3",
    },
  },
  {
    id: "coconut",
    label: "Nature's Purest Gift",
    headlineParts: [
      { text: "Virgin", style: "serif-italic" },
      { text: "Cold Pressed", style: "sans" },
      { text: "Coconut Oil", style: "display" },
      { text: "Unrefined Purity", style: "sans" },
    ],
    subtitle:
      "From fresh Kerala coconuts to your kitchen — our wood-pressed coconut oil retains every natural nutrient for cooking, skin, and hair care.",
    image: "/products/Coconut_Oil_1_Ltr-removebg-preview.png",
    imageAlt:
      "Minaliya Pure Cold Pressed Coconut Oil — Chemical Free Virgin Oil",
    accentColor: "#2D6A2D",
    badge: "Premium · Coconut Oil",
    bg: {
      primary: "#D4E8D4",
      secondary: "#E8F0E0",
      accent: "#F0F7F0",
    },
  },
];

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

const SLIDE_DURATION = 6500;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slide = slides[current];

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(idx);
        setIsTransitioning(false);
      }, 600);
    },
    [isTransitioning]
  );

  useEffect(() => {
    timerRef.current = setTimeout(
      () => goTo((current + 1) % slides.length),
      SLIDE_DURATION
    );
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, goTo]);

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden h-screen"
      aria-label="Hero product showcase"
    >
      {/* ─── COLOR-MORPHING BACKGROUND ───
          Three blobs that smoothly transition colors per slide.
          CSS transition handles the color animation. */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {/* Base fill — smooth transition */}
        <div
          className="absolute inset-0 transition-colors duration-[1200ms] ease-in-out"
          style={{ backgroundColor: slide.bg.accent }}
        />

        {/* Large blob — top right */}
        <div
          className="absolute rounded-full transition-all duration-[1200ms] ease-in-out"
          style={{
            width: "70vw",
            height: "70vw",
            maxWidth: 900,
            maxHeight: 900,
            top: "-15%",
            right: "-10%",
            background: `radial-gradient(circle, ${slide.bg.primary} 0%, ${slide.bg.secondary}80 50%, transparent 70%)`,
          }}
        />

        {/* Smaller blob — bottom left */}
        <div
          className="absolute rounded-full transition-all duration-[1200ms] ease-in-out"
          style={{
            width: "50vw",
            height: "50vw",
            maxWidth: 650,
            maxHeight: 650,
            bottom: "-10%",
            left: "-8%",
            background: `radial-gradient(circle, ${slide.bg.secondary} 0%, ${slide.bg.primary}60 50%, transparent 70%)`,
          }}
        />

        {/* Center wash */}
        <div
          className="absolute rounded-full transition-all duration-[1200ms] ease-in-out"
          style={{
            width: "40vw",
            height: "40vw",
            maxWidth: 500,
            maxHeight: 500,
            top: "30%",
            left: "35%",
            background: `radial-gradient(circle, ${slide.bg.accent}90 0%, transparent 70%)`,
          }}
        />

        {/* Subtle background text for filling */}
        <div
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden"
          style={{
            opacity: 0.05

          }}
        >
          <span className="text-[21vw] font-bold tracking-tighter leading-none" style={{ fontFamily: "var(--font-display)" }}>
            MINALIYA
          </span>
        </div>

        {/* Floating Organic Drops to fill space */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full hero-animate-float"
              style={{
                width: 15 + i * 10,
                height: 15 + i * 10,
                background: `radial-gradient(circle, ${slide.accentColor}40 0%, transparent 70%)`,
                top: `${15 + i * 15}%`,
                left: `${(i * 20 + 10) % 90}%`,
                animationDelay: `${i * 0.8}s`,
                filter: "blur(2px)",
              }}
            />
          ))}
        </div>

        {/* Subtle grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "150px",
          }}
        />
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-screen flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 items-center pt-20 lg:pt-0">
          {/* ─── LEFT: TYPOGRAPHY ─── */}
          <div className="lg:col-span-7 xl:col-span-6 relative z-20 order-2 lg:order-1 text-center lg:text-left">
            <div
              className={`space-y-5 sm:space-y-6 lg:space-y-8 transition-all duration-700 ease-out ${isTransitioning
                ? "opacity-0 translate-y-6"
                : "opacity-100 translate-y-0"
                }`}
            >
              {/* Luxury label */}
              <div
                className={mounted ? "hero-reveal-left" : "opacity-0"}
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <div
                    className="h-px w-10 hero-line-expand"
                    style={{
                      background: slide.accentColor,
                      animationDelay: "0.3s",
                    }}
                  />
                  <span
                    className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em]"
                    style={{
                      color: "var(--color-stone-500)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {slide.label}
                  </span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="leading-[1.05] tracking-tight">
                {slide.headlineParts.map((part, i) => (
                  <span
                    key={`${slide.id}-${i}`}
                    className={`block overflow-hidden ${mounted ? "hero-reveal-up" : "opacity-0"
                      }`}
                    style={{ animationDelay: `${0.3 + i * 0.12}s` }}
                  >
                    <span
                      className={`inline-block ${part.style === "display"
                        ? "text-[clamp(2.5rem,6vw,5.5rem)] font-light"
                        : part.style === "serif-italic"
                          ? "text-[clamp(2.5rem,6vw,5.5rem)] font-normal italic"
                          : "text-[clamp(1.8rem,4vw,3.2rem)] font-semibold"
                        }`}
                      style={{
                        fontFamily:
                          part.style === "display"
                            ? "var(--font-display)"
                            : part.style === "serif-italic"
                              ? "var(--font-display)"
                              : "var(--font-body)",
                        color:
                          part.style === "display"
                            ? "var(--color-stone-900)"
                            : part.style === "serif-italic"
                              ? "var(--color-forest-700)"
                              : "var(--color-stone-700)",
                        lineHeight: part.style === "sans" ? "1.3" : "1.05",
                      }}
                    >
                      {part.text}
                    </span>
                  </span>
                ))}
              </h1>

              {/* Accent line */}
              <div
                className={mounted ? "hero-line-expand" : "opacity-0"}
                style={{ animationDelay: "0.8s" }}
              >
                <div
                  className="h-[2px] w-20 transition-colors duration-[1200ms]"
                  style={{
                    background: `linear-gradient(90deg, ${slide.accentColor}, transparent)`,
                  }}
                />
              </div>

              {/* Subtitle */}
              <p
                className={`text-base sm:text-lg max-w-lg leading-[1.8] ${mounted ? "hero-reveal-up" : "opacity-0"
                  }`}
                style={{
                  color: "var(--color-stone-500)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 400,
                  animationDelay: "0.7s",
                }}
              >
                {slide.subtitle}
              </p>

              {/* CTAs */}
              <div
                className={`flex flex-wrap gap-3 sm:gap-4 pt-2 justify-center lg:justify-start ${mounted ? "hero-reveal-up" : "opacity-0"
                  }`}
                style={{ animationDelay: "0.9s" }}
              >
                <a
                  href="/shop"
                  className="group inline-flex items-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full font-semibold text-sm sm:text-[15px] transition-all duration-500 hover:-translate-y-0.5"
                  style={{
                    background: "var(--color-stone-900)",
                    color: "var(--color-cream-50)",
                    fontFamily: "var(--font-body)",
                    letterSpacing: "0.02em",
                    boxShadow: "0 4px 24px rgba(26, 25, 23, 0.15)",
                  }}
                >
                  Explore Collection
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-500 group-hover:translate-x-1"
                  />
                </a>
                <a
                  href="#process"
                  className="inline-flex items-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full font-medium text-sm sm:text-[15px] transition-all duration-500 hover:-translate-y-0.5"
                  style={{
                    color: "var(--color-stone-700)",
                    fontFamily: "var(--font-body)",
                    letterSpacing: "0.02em",
                    border: "1.5px solid var(--color-stone-300)",
                    background: "rgba(255, 255, 255, 0.35)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  Discover The Process
                </a>
              </div>

              {/* Trust stats */}
              <div
                className={`flex items-center gap-4 sm:gap-6 pt-4 sm:pt-6 justify-center lg:justify-start ${mounted ? "hero-reveal-up" : "opacity-0"
                  }`}
                style={{ animationDelay: "1.1s" }}
              >
                {[
                  { value: "10,000+", label: "Families" },
                  { value: "100%", label: "Chemical Free" },
                  { value: "4.9", label: "Rating" },
                ].map((s) => (
                  <div key={s.label} className="flex items-baseline gap-1.5">
                    <span
                      className="text-lg font-bold"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--color-stone-800)",
                      }}
                    >
                      {s.value}
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-wider font-medium"
                      style={{ color: "var(--color-stone-400)" }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: CINEMATIC PRODUCT SHOWCASE ─── */}
          <div className="lg:col-span-5 xl:col-span-6 relative flex items-center justify-center order-1 lg:order-2">
            {/* Spotlight gradient behind product */}
            <div
              className="absolute z-0 rounded-full transition-all duration-[1200ms] ease-in-out lg:-translate-x-16 lg:-translate-y-12"
              style={{
                width: "min(85vw, 700px)",
                height: "min(85vw, 700px)",
                background: `radial-gradient(circle, ${slide.bg.primary}99 0%, ${slide.bg.secondary}50 45%, transparent 70%)`,
              }}
              aria-hidden="true"
            />

            {/* Decorative arc */}
            <div
              className="absolute z-0 rounded-full transition-all duration-[1200ms] hidden sm:block lg:-translate-x-16 lg:-translate-y-12"
              style={{
                width: "min(70vw, 540px)",
                height: "min(70vw, 540px)",
                border: `1.5px dashed ${slide.accentColor}25`,
                animation: "spin 60s linear infinite",
              }}
              aria-hidden="true"
            />

            <div
              className={`relative z-10 transition-all duration-700 ease-out lg:-translate-x-16 lg:-translate-y-12 ${isTransitioning
                ? "opacity-0 scale-[0.88] translate-y-6"
                : "opacity-100 scale-100 translate-y-0"
                } ${mounted ? "hero-scale-in" : "opacity-0"}`}
              style={{ animationDelay: "0.5s" }}
            >
              {/* ── Product bottle — MASSIVE ── */}
              <div className="w-[380px] sm:w-[450px] md:w-[500px] lg:w-[550px] xl:w-[650px] hero-animate-float relative">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  width={600}
                  height={900}
                  className="w-full h-auto object-contain relative z-10"
                  priority
                  quality={90}
                  style={{
                    filter: "drop-shadow(0 20px 40px rgba(45, 43, 39, 0.15))",
                  }}
                />

                {/* Reflection beneath bottle */}
                <div
                  className="absolute bottom-[-8%] left-[5%] right-[5%] h-[30%] z-0 overflow-hidden"
                  style={{
                    transform: "scaleY(-1) scaleX(0.92)",
                    opacity: 0.12,
                    maskImage:
                      "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 80%)",
                    WebkitMaskImage:
                      "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 80%)",
                  }}
                  aria-hidden="true"
                >
                  <Image
                    src={slide.image}
                    alt=""
                    width={600}
                    height={900}
                    className="w-full h-auto object-contain"
                    quality={50}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* ── Side badge — positioned right ── */}
              <div
                className="absolute -right-2 sm:-right-6 lg:-right-8 top-[28%] hero-animate-float-slow hidden sm:block"
                style={{ animationDelay: "1.2s" }}
              >
                <div
                  className="px-4 py-3 rounded-2xl text-center"
                  style={{
                    background: "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    boxShadow: "0 8px 32px rgba(45, 43, 39, 0.08)",
                  }}
                >
                  <div
                    className="text-[10px] font-semibold uppercase tracking-[0.15em]"
                    style={{ color: "var(--color-stone-500)" }}
                  >
                    Mara Chekku
                  </div>
                  <div
                    className="text-[22px] font-bold mt-0.5 leading-none"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--color-stone-800)",
                    }}
                  >
                    100%
                  </div>
                  <div
                    className="text-[9px] uppercase tracking-widest font-medium"
                    style={{ color: "var(--color-stone-400)" }}
                  >
                    Pure &amp; Natural
                  </div>
                </div>
              </div>

              {/* ── Bottom badge ── */}
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 hero-animate-float-slow hidden sm:block"
                style={{ animationDelay: "1s" }}
              >
                <div
                  className="px-6 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap"
                  style={{
                    background: "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    color: "var(--color-stone-600)",
                    boxShadow: "0 8px 32px rgba(45, 43, 39, 0.08)",
                  }}
                >
                  {slide.badge}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM CONTROLS ─── */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-6 sm:pb-10">
          <div className="flex items-center justify-between">
            {/* Slide indicators */}
            <div className="flex items-center gap-5">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  className="group flex items-center gap-3"
                  aria-label={`Go to slide ${i + 1}: ${s.badge}`}
                  aria-current={i === current ? "true" : undefined}
                >
                  <div
                    className="relative overflow-hidden rounded-full transition-all duration-500"
                    style={{
                      width: i === current ? 48 : 24,
                      height: 3,
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-full transition-colors duration-500"
                      style={{
                        background:
                          i === current
                            ? "var(--color-stone-300)"
                            : "var(--color-stone-200)",
                      }}
                    />
                    {i === current && (
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: "var(--color-stone-800)",
                          transformOrigin: "left",
                          animation: `hero-progress ${SLIDE_DURATION}ms linear forwards`,
                        }}
                      />
                    )}
                  </div>
                  <span
                    className="text-[10px] font-medium uppercase tracking-wider hidden sm:inline transition-colors"
                    style={{
                      color:
                        i === current
                          ? "var(--color-stone-700)"
                          : "var(--color-stone-400)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  border: "1px solid var(--color-stone-300)",
                  color: "var(--color-stone-600)",
                  background: "rgba(255, 255, 255, 0.45)",
                  backdropFilter: "blur(8px)",
                }}
                aria-label="Previous slide"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  border: "1px solid var(--color-stone-300)",
                  color: "var(--color-stone-600)",
                  background: "rgba(255, 255, 255, 0.45)",
                  backdropFilter: "blur(8px)",
                }}
                aria-label="Next slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}
