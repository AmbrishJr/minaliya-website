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
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4651.377481697591!2d80.21720617575617!3d13.028402013629016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267bd843cc565%3A0xc6643dfa200839ed!2sMinaliya%20Wooden%20Cold%20Pressed%20Oils%20-%20Best%20Marachekku%20Oil%20Manufacturer%20in%20Chennai!5e1!3m2!1sen!2sin!4v1785736652587!5m2!1sen!2sin",
      businessUrl: "",
      lat: "",
      lng: "",
      enabled: true,
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
      googleMaps: true,
      paymentMethods: true,
    },
  };
}
