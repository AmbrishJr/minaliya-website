"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is cold pressed oil?",
    a: "Cold pressed oil is extracted from seeds using a traditional wooden press (Mara Chekku) at temperatures below 50°C. Unlike refined oils that use chemicals and high heat, cold pressing preserves the natural nutrients, flavor, and aroma of the oil. It's the traditional way of oil extraction practiced for centuries in India.",
  },
  {
    q: "Is Mara Chekku oil healthy?",
    a: "Yes! Mara Chekku (wooden cold pressed) oil is one of the healthiest cooking oils available. The low-temperature extraction preserves Vitamin E, Omega-3 & 6 fatty acids, and natural antioxidants. It contains zero trans fats and no chemical residues, making it ideal for heart health, digestion, and overall well-being.",
  },
  {
    q: "What is the difference between refined and cold pressed oil?",
    a: "Refined oil is extracted using chemical solvents (like hexane) at temperatures above 200°C, then bleached and deodorized — destroying most nutrients. Cold pressed oil is mechanically extracted at low temperatures without any chemicals, retaining all natural nutrients, color, aroma, and flavor.",
  },
  {
    q: "Why is wooden pressed oil more expensive than refined oil?",
    a: "Wooden pressed oil yields less oil per batch compared to chemical extraction — typically 30-40% less. The process is slower, more labor-intensive, and uses only premium quality seeds. However, the nutritional value and health benefits you get far outweigh the small price difference.",
  },
  {
    q: "Which is the best oil for Indian cooking?",
    a: "For South Indian cooking, groundnut oil and sesame (gingelly) oil are ideal. Coconut oil works wonderfully for Kerala and Tamil Nadu cuisine. Mustard oil is preferred for North Indian dishes. All of these are available as cold pressed options from Minaliya — choose based on your regional cuisine and taste preference.",
  },
  {
    q: "What is the shelf life of cold pressed oil?",
    a: "Minaliya cold pressed oils have a natural shelf life of 6-8 months from the date of extraction. Since we don't add preservatives, we recommend consuming the oil within this period for the best taste and nutritional value. Always store in a cool, dry place away from direct sunlight.",
  },
  {
    q: "How should I store cold pressed oil?",
    a: "Store cold pressed oil in a cool, dry place away from direct sunlight and heat. Keep the bottle tightly sealed after each use. Avoid storing near stoves or ovens. A kitchen cabinet or pantry is ideal. Unlike refined oils, cold pressed oils have natural sediment — this is completely normal and a sign of purity.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="section-padding"
      style={{ background: "var(--color-cream-50)" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="divider-leaf mx-auto" />
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle mx-auto">
            Everything you need to know about cold pressed oils, our process,
            and why Minaliya is the right choice for your family.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3" role="list">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                background: "white",
                border: `1px solid ${
                  openIndex === i
                    ? "var(--color-forest-200)"
                    : "var(--color-stone-200)"
                }`,
              }}
              role="listitem"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left gap-4"
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span
                  className="text-base font-semibold"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-stone-800)",
                  }}
                >
                  {faq.q}
                </span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  style={{
                    color:
                      openIndex === i
                        ? "var(--color-forest-500)"
                        : "var(--color-stone-400)",
                  }}
                />
              </button>
              <div
                id={`faq-answer-${i}`}
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p
                  className="px-5 pb-5 text-sm leading-relaxed"
                  style={{ color: "var(--color-stone-500)" }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
