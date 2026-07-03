import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const HERO_SLIDES = [
  {
    label: "Tradition Crafted Since Generations",
    headline: [
      { text: "Pure Wooden", style: "sans" },
      { text: "Cold Pressed", style: "serif-italic" },
      { text: "Oils For Modern", style: "sans" },
      { text: "Healthy Living", style: "display" },
    ],
    subtitle:
      "Traditionally extracted using authentic Mara Chekku methods to preserve natural aroma, nutrients, and purity — the way it was meant to be.",
    image: "/products/groundnut-bg-removed.png",
    imageAlt: "Minaliya Pure Cold Pressed Groundnut Oil — Mara Chekku Wood Pressed",
    accentColor: "#C47700",
    badge: "Bestseller · Groundnut Oil",
    bgPrimary: "#FFFFFF",
    bgSecondary: "#F9F9F9",
    bgAccent: "#FFFFFF",
    sortOrder: 0,
    isActive: true,
  },
  {
    label: "The Heart of Tamil Cuisine",
    headline: [
      { text: "Ancient Wisdom", style: "display" },
      { text: "in Every", style: "sans" },
      { text: "Golden Drop", style: "serif-italic" },
      { text: "of Sesame", style: "sans" },
    ],
    subtitle:
      "Gingelly oil extracted the traditional way — rich in antioxidants, perfect for authentic South Indian cooking and Ayurvedic wellness.",
    image: "/products/sesame-bg-removed.png",
    imageAlt: "Minaliya Pure Cold Pressed Sesame Gingelly Oil — Traditional Extraction",
    accentColor: "#C4612A",
    badge: "Heritage · Sesame Oil",
    bgPrimary: "#FFFFFF",
    bgSecondary: "#F9F9F9",
    bgAccent: "#FFFFFF",
    sortOrder: 1,
    isActive: true,
  },
  {
    label: "Nature's Purest Gift",
    headline: [
      { text: "Virgin", style: "serif-italic" },
      { text: "Cold Pressed", style: "sans" },
      { text: "Coconut Oil", style: "display" },
      { text: "Unrefined Purity", style: "sans" },
    ],
    subtitle:
      "From fresh Kerala coconuts to your kitchen — our wood-pressed coconut oil retains every natural nutrient for cooking, skin, and hair care.",
    image: "/products/coconut-bg-removed.png",
    imageAlt: "Minaliya Pure Cold Pressed Coconut Oil — Chemical Free Virgin Oil",
    accentColor: "#2D6A2D",
    badge: "Premium · Coconut Oil",
    bgPrimary: "#FFFFFF",
    bgSecondary: "#F9F9F9",
    bgAccent: "#FFFFFF",
    sortOrder: 2,
    isActive: true,
  },
];

async function seed() {
  console.log("Seeding hero slides...");

  await prisma.heroSlide.deleteMany();
  await prisma.heroSlide.createMany({ data: HERO_SLIDES });

  console.log("Hero slides seeded successfully!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
