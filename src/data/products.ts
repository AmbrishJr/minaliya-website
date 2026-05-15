export interface Product {
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge?: string;
  sizes: string[];
  category: string;
  description: string;
}

export const allProducts: Product[] = [
  {
    name: "Cold Pressed Groundnut Oil",
    slug: "groundnut-oil",
    image: "/products/Groundnut Oil 1 Ltr.jpg",
    price: 349,
    originalPrice: 449,
    rating: 4.9,
    reviews: 234,
    badge: "Bestseller",
    sizes: ["500ml", "1 Ltr"],
    category: "Groundnut",
    description: "Traditional Mara Chekku extracted groundnut oil, rich in Vitamin E and healthy fats.",
  },
  {
    name: "Cold Pressed Coconut Oil",
    slug: "coconut-oil",
    image: "/products/Coconut Oil 1 Ltr.jpg",
    price: 399,
    originalPrice: 499,
    rating: 4.8,
    reviews: 189,
    badge: "Popular",
    sizes: ["500ml", "1 Ltr"],
    category: "Coconut",
    description: "Pure virgin coconut oil for cooking, skin care, and hair care.",
  },
  {
    name: "Cold Pressed Sesame Oil",
    slug: "sesame-oil",
    image: "/products/Sesame Oil 1 Ltr.jpg",
    price: 379,
    originalPrice: 479,
    rating: 4.9,
    reviews: 156,
    sizes: ["500ml", "1 Ltr"],
    category: "Sesame",
    description: "Authentic gingelly oil perfect for South Indian cooking and Ayurvedic wellness.",
  },
  {
    name: "Cold Pressed Groundnut Oil",
    slug: "groundnut-oil-500ml",
    image: "/products/Groundnut Oil 500 ml.jpg",
    price: 199,
    originalPrice: 259,
    rating: 4.8,
    reviews: 312,
    badge: "Value Pack",
    sizes: ["500ml"],
    category: "Groundnut",
    description: "Compact 500ml bottle of our bestselling groundnut oil for smaller households.",
  },
  {
    name: "Cold Pressed Coconut Oil",
    slug: "coconut-oil-500ml",
    image: "/products/Coconut Oil 500 ml.jpg",
    price: 229,
    originalPrice: 299,
    rating: 4.7,
    reviews: 143,
    sizes: ["500ml"],
    category: "Coconut",
    description: "Trial-sized virgin coconut oil. Perfect to experience the Minaliya difference.",
  },
  {
    name: "Cold Pressed Sesame Oil",
    slug: "sesame-oil-500ml",
    image: "/products/Sesame Oil 500 ml.jpg",
    price: 209,
    originalPrice: 269,
    rating: 4.8,
    reviews: 98,
    sizes: ["500ml"],
    category: "Sesame",
    description: "Compact pack of our pure gingelly oil. Great for regular cooking use.",
  },
];
