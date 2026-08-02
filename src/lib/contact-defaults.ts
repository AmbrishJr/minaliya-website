import type { ContactSettingsData } from "@/actions/adminData";

export function getDefaultContactSettings(): ContactSettingsData {
  return {
    metaTitle: "Contact Us",
    metaDescription:
      "Get in touch with Minaliya for orders, queries, or feedback. WhatsApp, call, or email us. Based in Chennai, Tamil Nadu.",
    heroTitle: "Get in",
    heroHighlight: "Touch",
    heroSubtitle:
      "Have a question about our oils, need help with an order, or want to place a bulk enquiry? We'd love to hear from you.",
    cards: [
      {
        icon: "map",
        title: "Visit Us",
        lines: [
          "Shop No. 3, Kodambakkam Road, West Mambalam,",
          "Chennai, Tamil Nadu - 600033",
        ],
        href: "",
      },
      {
        icon: "phone",
        title: "Call Us",
        lines: ["+91 98765 43210"],
        href: "tel:+919876543210",
      },
      {
        icon: "mail",
        title: "Email Us",
        lines: ["hello@minaliya.com"],
        href: "mailto:hello@minaliya.com",
      },
      {
        icon: "clock",
        title: "Working Hours",
        lines: ["Mon\u2013Sat: 9:00 AM \u2013 8:00 PM", "Sunday: Closed"],
        href: "",
      },
    ],
    whatsapp: {
      label: "Chat on WhatsApp",
      number: "919876543210",
      message: "Hi Minaliya! I have a query.",
      enabled: true,
    },
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.9942630650953!2d80.21720617596043!3d13.028396790938479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267bd843cc565%3A0xc6643dfa200839ed!2sMinaliya%20Wooden%20Cold%20Pressed%20Oils%20-%20Best%20Marachekku%20Oil%20Manufacturer%20in%20Chennai!5e0!3m2!1sen!2sin!4v1716142055610!5m2!1sen!2sin",
    form: {
      title: "Send Us a Message",
      subtitle: "Fill out the form and we'll get back to you within 24 hours.",
      buttonLabel: "Send Message",
    },
    subjects: [
      "General Enquiry",
      "Order Related",
      "Bulk Order / Wholesale",
      "Product Feedback",
      "Shipping Query",
      "Other",
    ],
    showFields: {
      cards: true,
      whatsapp: true,
      map: true,
      form: true,
    },
  };
}
