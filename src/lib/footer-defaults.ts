import type { FooterSettingsData } from "@/actions/adminData";

export function getDefaultFooterSettings(): FooterSettingsData {
  return {
    companyName: "Minaliya",
    logo: "/logo.png",
    description:
      "Pure wooden cold pressed oils, traditionally extracted using Mara Chekku methods in Chennai, Tamil Nadu. Bringing the authentic taste and health of traditional Indian oils to your kitchen.",
    address:
      "Shop No. 3, Kodambakkam Road, West Mambalam, Chennai - 600033",
    phones: ["+91 98765 43210"],
    emails: ["hello@minaliya.com"],
    businessHours: "Mon-Sat: 9:00 AM - 8:00 PM",
    copyright:
      "\u00a9 {year} Minaliya. All rights reserved. Handcrafted in Chennai, Tamil Nadu.",
    newsletter: {
      title: "Stay Fresh with Minaliya",
      description:
        "Get health tips, recipes, and exclusive offers in your inbox.",
      enabled: true,
    },
    quickLinks: [
      { name: "Shop All Oils", href: "/shop" },
      { name: "Subscription", href: "/subscription" },
      { name: "About Minaliya", href: "/about" },
      { name: "Our Process", href: "/about#process" },
      { name: "Health Benefits", href: "/benefits" },
      { name: "Blog", href: "/blog" },
      { name: "Contact Us", href: "/contact" },
    ],
    categories: [
      { name: "Groundnut Oil", href: "/shop/groundnut-oil" },
      { name: "Coconut Oil", href: "/shop/coconut-oil" },
      { name: "Sesame Oil", href: "/shop/sesame-oil" },
      { name: "Mustard Oil", href: "/shop/mustard-oil" },
      { name: "Combo Packs", href: "/shop/combos" },
    ],
    legalLinks: [
      { name: "Shipping Policy", href: "/policies/shipping" },
      { name: "Return & Refund", href: "/policies/returns" },
      { name: "Privacy Policy", href: "/policies/privacy" },
      { name: "Terms of Service", href: "/policies/terms" },
    ],
    socialMedia: {
      facebook: { url: "", enabled: false },
      instagram: { url: "", enabled: false },
      youtube: { url: "", enabled: false },
      whatsapp: { url: "", enabled: false },
    },
    googleMaps: {
      embedUrl: "",
      businessUrl: "",
      lat: "",
      lng: "",
      enabled: false,
    },
    paymentMethods: ["UPI", "Visa", "MC"],
    showFields: {
      description: true,
      address: true,
      phone: true,
      email: true,
      businessHours: true,
      quickLinks: true,
      categories: true,
      legalLinks: true,
      socialMedia: true,
      newsletter: true,
      googleMaps: false,
      paymentMethods: true,
    },
  };
}
