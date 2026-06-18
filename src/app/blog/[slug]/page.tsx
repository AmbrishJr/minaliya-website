import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Clock, ArrowLeft } from "lucide-react";

const posts = [
  {
    slug: "benefits-cold-pressed-groundnut-oil",
    title: "5 Amazing Benefits of Cold Pressed Groundnut Oil",
    category: "Health & Nutrition",
    readTime: "5 min read",
    date: "April 28, 2026",
    content: [
      { type: "lead", text: "Cold pressed groundnut oil, also known as kadalai ennai, has been a staple in South Indian kitchens for centuries. Unlike refined oils, it retains the natural goodness of groundnuts, making it a superior choice for your family's health." },
      { type: "h2", text: "1. Rich in Vitamin E" },
      { type: "p", text: "Cold pressed groundnut oil is naturally rich in Vitamin E, a powerful antioxidant that helps protect your cells from damage caused by free radicals. A single tablespoon provides a significant portion of your daily Vitamin E requirement." },
      { type: "h2", text: "2. Heart-Healthy Fats" },
      { type: "p", text: "This oil contains a balanced ratio of monounsaturated and polyunsaturated fats, including oleic acid, which is known to support heart health by maintaining healthy cholesterol levels." },
      { type: "h2", text: "3. High Smoke Point" },
      { type: "p", text: "With a smoke point of around 232°C, groundnut oil is excellent for deep frying, sautéing, and stir-frying. It remains stable at high temperatures without breaking down into harmful compounds." },
      { type: "h2", text: "4. Natural Flavor Enhancer" },
      { type: "p", text: "Unlike refined oils that are flavorless, cold pressed groundnut oil adds a mild, nutty flavor to dishes. It elevates the taste of curries, stir-fries, and even salad dressings." },
      { type: "h2", text: "5. Chemical-Free Processing" },
      { type: "p", text: "The Mara Chekku method ensures no chemical solvents like hexane are used in extraction. What you get is 100% pure oil with no additives, preservatives, or bleaching agents." },
    ],
  },
  {
    slug: "refined-vs-cold-pressed-oil",
    title: "Refined Oil vs Cold Pressed Oil: The Complete Guide",
    category: "Education",
    readTime: "7 min read",
    date: "April 20, 2026",
    content: [
      { type: "lead", text: "Walking through the cooking oil aisle can be overwhelming. With dozens of options claiming to be 'healthy,' how do you separate marketing from truth? Let's break down the real differences between refined and cold pressed oils." },
      { type: "h2", text: "What is Refined Oil?" },
      { type: "p", text: "Refined oils undergo extensive processing including heating to high temperatures (often above 200°C), bleaching, deodorizing, and chemical solvent extraction. This process maximizes yield and extends shelf life but strips away natural nutrients, vitamins, and antioxidants." },
      { type: "h2", text: "What is Cold Pressed Oil?" },
      { type: "p", text: "Cold pressed oils are extracted by crushing seeds or nuts at low temperatures (below 50°C) using traditional wooden presses. No chemicals are involved, and the oil retains its natural flavor, aroma, and nutritional profile." },
      { type: "h2", text: "Key Differences" },
      { type: "ul", items: ["Refined oils use chemical solvents (hexane); cold pressed uses mechanical pressing", "Refined oils are heated above 200°C; cold pressed stays below 50°C", "Refined oils lose most vitamins and antioxidants; cold pressed retains them", "Refined oils have neutral flavor; cold pressed has authentic seed flavor", "Cold pressed oils are richer in Vitamin E, phospholipids, and lecithin"] },
      { type: "h2", text: "Which One Should You Choose?" },
      { type: "p", text: "For everyday cooking where you want nutrition, flavor, and purity, cold pressed oils are the clear winner. They cost slightly more but deliver significantly more health benefits. Your family deserves the authentic taste and nutrition of traditionally extracted oils." },
    ],
  },
  {
    slug: "mara-chekku-oil-extraction",
    title: "The Ancient Art of Mara Chekku Oil Extraction",
    category: "Tradition",
    readTime: "4 min read",
    date: "April 12, 2026",
    content: [
      { type: "lead", text: "For centuries, the rhythmic sound of the wooden press, or Mara Chekku, echoed through the villages of Tamil Nadu. It wasn't just a method of oil extraction; it was a revered tradition that ensured the purity and vitality of the oil were preserved." },
      { type: "h2", text: "What is Mara Chekku?" },
      { type: "p", text: "Mara Chekku translates directly to 'wooden press' in Tamil. Traditionally, a large pestle made of Vaagai wood (Albizia lebbeck) is rotated within a wooden mortar. This slow, steady rotation crushes seeds or nuts to extract oil." },
      { type: "blockquote", text: "The Vaagai tree is known for its medicinal properties. More importantly, it absorbs heat, ensuring that the oil temperature never exceeds 50°C during extraction." },
      { type: "h2", text: "The Problem with Modern Refining" },
      { type: "p", text: "Modern refined oils prioritize yield and shelf life over nutrition. Seeds are subjected to extreme heat (often above 200°C) and chemical solvents like hexane. This process strips the oil of its natural vitamins, antioxidants, and authentic flavor." },
      { type: "h2", text: "Why Cold Pressed is Better" },
      { type: "ul", items: ["Nutrient Retention: Vitamins like E and essential fatty acids remain intact", "Natural Flavor and Aroma: The oil smells and tastes like the seed it came from", "Chemical-Free: No bleaching, deodorizing, or harsh solvents are used"] },
      { type: "cta", text: "At Minaliya, we are committed to keeping this tradition alive. Our oils are purely extracted using the Mara Chekku method, delivering the authentic taste and health benefits your family deserves." },
    ],
  },
  {
    slug: "sesame-oil-ayurveda-benefits",
    title: "Why Sesame Oil is Called Liquid Gold in Ayurveda",
    category: "Ayurveda",
    readTime: "6 min read",
    date: "March 30, 2026",
    content: [
      { type: "lead", text: "In Ayurveda, sesame oil or 'Nallennai' holds a place of supreme importance. Revered as 'Sneha' (the essence of love and nourishment), it has been used for thousands of years in therapeutic practices, daily rituals, and cooking." },
      { type: "h2", text: "Oil Pulling (Gandusha)" },
      { type: "p", text: "Swishing sesame oil in your mouth for 15-20 minutes each morning is an ancient Ayurvedic practice known as Gandusha. It helps remove toxins, strengthens gums, whitens teeth, and improves oral health significantly." },
      { type: "h2", text: "Abhyanga (Self-Massage)" },
      { type: "p", text: "Warm sesame oil massage before bathing is a cornerstone of Ayurvedic daily routine. It nourishes the skin, improves circulation, calms the nervous system, and promotes restful sleep. The oil's natural anti-inflammatory properties soothe joint pain." },
      { type: "h2", text: "Cooking Benefits" },
      { type: "p", text: "Sesame oil is rich in antioxidants like sesamol and sesamin, which are highly stable and prevent oxidation. It adds a distinctive nutty flavor to South Indian dishes like sambar, rasam, and poriyal." },
      { type: "h2", text: "Nutritional Profile" },
      { type: "p", text: "Sesame oil is packed with Vitamin E, Vitamin K, copper, magnesium, calcium, and healthy omega-6 fatty acids. It supports bone health, reduces inflammation, and promotes healthy skin and hair." },
    ],
  },
  {
    slug: "coconut-oil-hair-skin-guide",
    title: "Coconut Oil for Hair & Skin: A Complete Guide",
    category: "Beauty & Wellness",
    readTime: "5 min read",
    date: "March 22, 2026",
    content: [
      { type: "lead", text: "Virgin cold pressed coconut oil is perhaps nature's most versatile beauty product. From nourishing dry hair to moisturizing skin naturally, here's your complete guide to using coconut oil for beauty and wellness." },
      { type: "h2", text: "For Hair Care" },
      { type: "p", text: "Coconut oil is one of the few oils that can penetrate the hair shaft, providing deep nourishment from within. Apply warm coconut oil to your scalp and hair, leave for 30 minutes or overnight, then wash with a mild shampoo." },
      { type: "ul", items: ["Reduces protein loss from hair", "Treats dandruff and dry scalp", "Promotes hair growth and strength", "Adds natural shine and softness"] },
      { type: "h2", text: "For Skin Care" },
      { type: "p", text: "Coconut oil makes an excellent natural moisturizer. Its medium-chain fatty acids help maintain your skin's natural moisture barrier. Use it as a body moisturizer, makeup remover, or lip balm." },
      { type: "h2", text: "For Oil Pulling" },
      { type: "p", text: "Coconut oil pulling is an effective way to improve oral hygiene. Swish a tablespoon in your mouth for 15-20 minutes daily to reduce harmful bacteria, whiten teeth, and freshen breath." },
      { type: "h2", text: "Choosing the Right Coconut Oil" },
      { type: "p", text: "For beauty purposes, always choose virgin cold pressed coconut oil. Unlike refined coconut oil, it retains all the natural compounds that provide beauty and health benefits." },
    ],
  },
  {
    slug: "south-indian-recipes-cold-pressed-oil",
    title: "10 South Indian Recipes That Taste Better with Cold Pressed Oil",
    category: "Recipes",
    readTime: "8 min read",
    date: "March 14, 2026",
    content: [
      { type: "lead", text: "The secret to authentic South Indian cooking lies not just in the technique but in the ingredients — especially the oil. Here are 10 classic recipes where cold pressed oil makes a noticeable difference in taste and nutrition." },
      { type: "h2", text: "1. Crispy Dosa with Groundnut Oil" },
      { type: "p", text: "Using cold pressed groundnut oil to grease the tawa gives dosas an unmatched crispiness and a subtle nutty aroma that refined oil simply cannot replicate." },
      { type: "h2", text: "2. Sambar with Sesame Oil" },
      { type: "p", text: "A final tempering of cold pressed sesame oil (nallennai) with mustard seeds, curry leaves, and red chilies elevates sambar to its authentic taste." },
      { type: "h2", text: "3. Coconut Oil Fish Curry" },
      { type: "p", text: "The rich aroma of cold pressed coconut oil is essential for the traditional Kerala-style fish curry. It adds depth and a subtle sweetness that balances the tanginess." },
      { type: "h2", text: "4. Groundnut Oil Chakli" },
      { type: "p", text: "The high smoke point of groundnut oil makes it perfect for deep frying. Chakli (murukku) fried in cold pressed groundnut oil is crispier and stays fresh longer." },
      { type: "h2", text: "5. Sesame Oil Poriyal" },
      { type: "p", text: "Stir-fried vegetables tempered with sesame oil bring out the natural flavors of the vegetables. The oil adds a distinct nutty finish to the dish." },
      { type: "h2", text: "6. Coconut Oil Payasam" },
      { type: "p", text: "A drizzle of cold pressed coconut oil over warm payasam enhances its aroma and adds a rich, velvety texture." },
      { type: "h2", text: "7. Groundnut Oil Vada" },
      { type: "p", text: "Medu vada fried in cold pressed groundnut oil achieves a beautiful golden-brown color and a light, crispy texture." },
      { type: "h2", text: "8. Sesame Oil Lemon Rice" },
      { type: "p", text: "The tempering for lemon rice is traditionally done with sesame oil, giving the dish its characteristic flavor." },
      { type: "h2", text: "9. Coconut Oil Thengai Sadam" },
      { type: "p", text: "Coconut rice (thengai sadam) made with cold pressed coconut oil has an authentic, rich flavor that transports you straight to Tamil Nadu." },
      { type: "h2", text: "10. Groundnut Oil Bajji" },
      { type: "p", text: "Deep-fried bajjis (pakoras) reach perfection when fried in groundnut oil — crispy outside, soft inside, and never greasy." },
    ],
  },
];

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.content.find((c) => c.type === "lead")?.text?.slice(0, 160) || "",
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main id="main-content">
        <article className="py-12 sm:py-20" style={{ background: "var(--color-cream-50)" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold mb-8 hover:underline"
              style={{ color: "var(--color-stone-500)" }}
            >
              <ArrowLeft size={16} />
              Back to Journal
            </Link>

            <header className="space-y-6 mb-12">
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "var(--color-forest-100)",
                    color: "var(--color-forest-700)",
                  }}
                >
                  {post.category}
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--color-stone-400)" }}>
                  {post.date}
                </span>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-stone-900)",
                }}
              >
                {post.title}
              </h1>

              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--color-stone-500)" }}>
                <Clock size={16} />
                <span>{post.readTime}</span>
              </div>
            </header>

            <div
              className="w-full aspect-[21/9] rounded-2xl mb-12"
              style={{
                background: "linear-gradient(135deg, var(--color-wood-100) 0%, var(--color-cream-200) 100%)",
                border: "1px solid var(--color-stone-200)"
              }}
            />

            <div className="prose prose-lg prose-stone max-w-none space-y-6">
              {post.content.map((block, i) => {
                switch (block.type) {
                  case "lead":
                    return (
                      <p key={i} className="lead text-xl leading-relaxed" style={{ color: "var(--color-stone-600)" }}>
                        {block.text}
                      </p>
                    );
                  case "h2":
                    return (
                      <h2 key={i} className="text-2xl font-bold mt-10 mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-800)" }}>
                        {block.text}
                      </h2>
                    );
                  case "p":
                    return (
                      <p key={i} className="leading-relaxed" style={{ color: "var(--color-stone-600)" }}>
                        {block.text}
                      </p>
                    );
                  case "blockquote":
                    return (
                      <div key={i} className="p-6 my-8 rounded-2xl" style={{ background: "var(--color-cream-100)", border: "1px solid var(--color-stone-200)" }}>
                        <p className="text-sm leading-relaxed font-medium italic" style={{ color: "var(--color-stone-600)" }}>
                          {block.text}
                        </p>
                      </div>
                    );
                  case "ul":
                    return (
                      <ul key={i} className="list-disc pl-6 space-y-2 leading-relaxed" style={{ color: "var(--color-stone-600)" }}>
                        {block.items?.map((item: string, j: number) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    );
                  case "cta":
                    return (
                      <p key={i} className="mt-8 leading-relaxed font-medium italic" style={{ color: "var(--color-stone-500)" }}>
                        {block.text}
                      </p>
                    );
                  default:
                    return null;
                }
              })}
            </div>

            <div className="mt-16 pt-8 border-t flex items-center gap-4" style={{ borderColor: "var(--color-stone-200)" }}>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                style={{
                  background: "var(--color-forest-100)",
                  color: "var(--color-forest-700)",
                }}
              >
                M
              </div>
              <div>
                <div className="font-semibold" style={{ color: "var(--color-stone-800)" }}>The Minaliya Team</div>
                <div className="text-sm" style={{ color: "var(--color-stone-500)" }}>Passionate about traditional wellness and pure foods.</div>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
