import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/components/shop/ProductDetail";

/* ═══════════════════════════════════════════
   PRODUCT DATA
   ═══════════════════════════════════════════ */

interface ProductData {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  images: string[];
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge?: string;
  sizes: { label: string; price: number; originalPrice: number }[];
  category: string;
  benefits: string[];
  specifications: { label: string; value: string }[];
  usage: string[];
}

const products: Record<string, ProductData> = {
  "groundnut-oil": {
    name: "Cold Pressed Groundnut Oil",
    slug: "groundnut-oil",
    tagline: "The Heart of South Indian Cooking",
    description:
      "Our cold pressed groundnut oil is extracted using the traditional Mara Chekku method — a wooden press that slowly crushes premium groundnuts at temperatures below 50°C. This preserves the natural aroma, flavor, and all essential nutrients that refined oils destroy. Rich in Vitamin E, monounsaturated fats, and natural antioxidants, this oil is the healthiest choice for everyday Indian cooking.\n\nEvery bottle of Minaliya Groundnut Oil carries the authentic taste that South Indian families have cherished for generations. From crispy dosas to aromatic biryanis, from traditional sweets to daily tempering — experience the difference that pure, chemical-free oil makes.",
    images: [
      "/products/Groundnut Oil 1 Ltr.jpg",
      "/products/Groundnut Oil 500 ml.jpg",
      "/products/Groundnut_Oil_1_Ltr-removebg-preview.png",
    ],
    price: 349,
    originalPrice: 449,
    rating: 4.9,
    reviews: 234,
    badge: "Bestseller",
    sizes: [
      { label: "500ml", price: 199, originalPrice: 259 },
      { label: "1 Ltr", price: 349, originalPrice: 449 },
    ],
    category: "Groundnut",
    benefits: [
      "Rich in Vitamin E and natural antioxidants",
      "High in heart-healthy monounsaturated fats",
      "Contains zero trans fats and no cholesterol",
      "Boosts immunity and improves digestion",
      "Ideal smoking point for Indian cooking methods",
      "100% chemical-free — no hexane, no bleaching",
    ],
    specifications: [
      { label: "Oil Type", value: "Cold Pressed Groundnut Oil" },
      { label: "Extraction", value: "Mara Chekku (Wooden Press)" },
      { label: "Temperature", value: "Below 50°C" },
      { label: "Shelf Life", value: "6-8 Months" },
      { label: "Storage", value: "Cool, dry place away from sunlight" },
      { label: "Origin", value: "Tamil Nadu, India" },
      { label: "Certifications", value: "FSSAI Approved" },
      { label: "Packaging", value: "Food-grade PET Bottle" },
    ],
    usage: [
      "Everyday cooking and deep frying",
      "Traditional South Indian dishes — dosa, sambar, rasam",
      "Seasoning and tempering (tadka)",
      "Baking and sweets preparation",
      "Salad dressings and marinades",
    ],
  },
  "coconut-oil": {
    name: "Cold Pressed Coconut Oil",
    slug: "coconut-oil",
    tagline: "Nature's Purest Gift",
    description:
      "Our virgin cold pressed coconut oil is made from fresh Kerala coconuts, extracted using traditional wooden press methods. Unlike refined coconut oil that undergoes chemical processing, our oil retains the natural fragrance, taste, and complete nutritional profile of fresh coconuts.\n\nThis multipurpose oil is perfect for South Indian and Kerala cooking, offering a subtle coconut aroma that enhances every dish. Beyond the kitchen, it's a natural moisturizer for skin, a nourishing hair oil, and has been used in Ayurvedic practices for centuries. Pure, versatile, and entirely chemical-free.",
    images: [
      "/products/Coconut Oil 1 Ltr.jpg",
      "/products/Coconut Oil 500 ml.jpg",
      "/products/Coconut_Oil_1_Ltr-removebg-preview.png",
    ],
    price: 399,
    originalPrice: 499,
    rating: 4.8,
    reviews: 189,
    badge: "Popular",
    sizes: [
      { label: "500ml", price: 229, originalPrice: 299 },
      { label: "1 Ltr", price: 399, originalPrice: 499 },
    ],
    category: "Coconut",
    benefits: [
      "Rich in lauric acid — boosts immunity naturally",
      "Contains medium-chain triglycerides (MCTs) for energy",
      "Excellent natural moisturizer for skin and hair",
      "Supports healthy metabolism and weight management",
      "Anti-bacterial and anti-fungal properties",
      "100% virgin, unrefined, and chemical-free",
    ],
    specifications: [
      { label: "Oil Type", value: "Virgin Cold Pressed Coconut Oil" },
      { label: "Extraction", value: "Wooden Press (Cold Process)" },
      { label: "Temperature", value: "Below 50°C" },
      { label: "Shelf Life", value: "6-8 Months" },
      { label: "Storage", value: "Cool, dry place (solidifies below 25°C — normal)" },
      { label: "Origin", value: "Kerala & Tamil Nadu, India" },
      { label: "Certifications", value: "FSSAI Approved" },
      { label: "Packaging", value: "Food-grade PET Bottle" },
    ],
    usage: [
      "Kerala and South Indian cooking",
      "Hair oiling and scalp massage",
      "Natural skin moisturizer",
      "Oil pulling for oral health",
      "Baking as a butter substitute",
    ],
  },
  "sesame-oil": {
    name: "Cold Pressed Sesame Oil",
    slug: "sesame-oil",
    tagline: "The Heart of Tamil Cuisine",
    description:
      "Our cold pressed sesame oil (Nallennai / Gingelly oil) is a cornerstone of South Indian cooking and Ayurvedic tradition. Extracted from premium sesame seeds using a traditional wooden press, this oil carries the rich, nutty aroma that has defined Tamil cuisine for centuries.\n\nSesame oil is one of the most nutrient-dense cooking oils — packed with sesamol and sesamin, powerful antioxidants unique to sesame. It's revered in Ayurveda for its warming properties and is used extensively in traditional medicine, massage therapy, and daily cooking across South India.",
    images: [
      "/products/Sesame Oil 1 Ltr.jpg",
      "/products/Sesame Oil 500 ml.jpg",
      "/products/Sesame_Oil_1_Ltr-removebg-preview.png",
    ],
    price: 379,
    originalPrice: 479,
    rating: 4.9,
    reviews: 156,
    sizes: [
      { label: "500ml", price: 209, originalPrice: 269 },
      { label: "1 Ltr", price: 379, originalPrice: 479 },
    ],
    category: "Sesame",
    benefits: [
      "Rich in sesamol and sesamin — powerful antioxidants",
      "Supports bone health with natural calcium and zinc",
      "Anti-inflammatory properties for joint health",
      "Promotes heart health and lowers blood pressure",
      "Used in Ayurvedic oil massage (Abhyanga) for centuries",
      "100% pure — no blending, no chemical processing",
    ],
    specifications: [
      { label: "Oil Type", value: "Cold Pressed Sesame Oil (Gingelly)" },
      { label: "Extraction", value: "Mara Chekku (Wooden Press)" },
      { label: "Temperature", value: "Below 50°C" },
      { label: "Shelf Life", value: "6-8 Months" },
      { label: "Storage", value: "Cool, dry place away from sunlight" },
      { label: "Origin", value: "Tamil Nadu, India" },
      { label: "Certifications", value: "FSSAI Approved" },
      { label: "Packaging", value: "Food-grade PET Bottle" },
    ],
    usage: [
      "Traditional South Indian cooking and tempering",
      "Gingelly oil for Tamil festival dishes",
      "Ayurvedic body massage and oil pulling",
      "Salad dressings and cold preparations",
      "Baby massage oil (traditional practice)",
    ],
  },
};

/* Duplicate entries for 500ml variants — redirect to parent */
const slugRedirects: Record<string, string> = {
  "groundnut-oil-500ml": "groundnut-oil",
  "coconut-oil-500ml": "coconut-oil",
  "sesame-oil-500ml": "sesame-oil",
};

export function generateStaticParams() {
  return [
    ...Object.keys(products).map((slug) => ({ slug })),
    ...Object.keys(slugRedirects).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSlug = slugRedirects[slug] || slug;
  const product = products[resolvedSlug];

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} | Minaliya`,
      description: product.tagline,
      url: `https://minaliya.com/shop/${product.slug}`,
      images: [{ url: product.images[0], width: 600, height: 800 }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resolvedSlug = slugRedirects[slug] || slug;
  const product = products[resolvedSlug];

  if (!product) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <main className="section-padding text-center">
          <h1 className="section-title">Product Not Found</h1>
          <p className="section-subtitle mx-auto mt-4">
            Sorry, we couldn&apos;t find the product you&apos;re looking for.
          </p>
          <a href="/shop" className="btn-primary mt-8 inline-flex">
            Back to Shop
          </a>
        </main>
        <Footer />
      </>
    );
  }

  /* Related products */
  const related = Object.values(products).filter((p) => p.slug !== product.slug);

  /* JSON-LD */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: `https://minaliya.com${product.images[0]}`,
    description: product.description.slice(0, 200),
    brand: { "@type": "Brand", name: "Minaliya" },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: Math.min(...product.sizes.map((s) => s.price)),
      highPrice: Math.max(...product.sizes.map((s) => s.price)),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(product.rating),
      reviewCount: String(product.reviews),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnnouncementBar />
      <Navbar />
      <main id="main-content">
        <ProductDetail product={product} related={related} />
      </main>
      <Footer />
    </>
  );
}
