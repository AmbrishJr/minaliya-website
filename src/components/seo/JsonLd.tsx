export default function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Minaliya",
    url: "https://minaliya.com",
    logo: "https://minaliya.com/logo.png",
    description:
      "Pure wooden cold pressed oils. Traditional Mara Chekku extraction in Chennai, Tamil Nadu.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chennai",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
      postalCode: "600001",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-98765-43210",
      contactType: "customer service",
      availableLanguage: ["English", "Tamil"],
    },
    sameAs: [
      "https://www.instagram.com/minaliya",
      "https://www.facebook.com/minaliya",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Minaliya",
    url: "https://minaliya.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://minaliya.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const productSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Cold Pressed Groundnut Oil",
      image: "https://minaliya.com/logo.png", // TODO: Update to primary Cloudinary product URL once populated
      description:
        "100% pure wooden cold pressed groundnut oil. Traditional Mara Chekku extraction preserves natural nutrients and authentic aroma.",
      brand: { "@type": "Brand", name: "Minaliya" },
      offers: {
        "@type": "Offer",
        price: "349",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: "Minaliya" },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "234",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Cold Pressed Coconut Oil",
      image: "https://minaliya.com/logo.png", // TODO: Update to primary Cloudinary product URL once populated
      description:
        "Pure wooden cold pressed coconut oil. Chemical-free extraction for cooking and hair care.",
      brand: { "@type": "Brand", name: "Minaliya" },
      offers: {
        "@type": "Offer",
        price: "399",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "189",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Cold Pressed Sesame Oil",
      image: "https://minaliya.com/logo.png", // TODO: Update to primary Cloudinary product URL once populated
      description:
        "Traditional cold pressed sesame (gingelly) oil. Rich in antioxidants and natural nutrients.",
      brand: { "@type": "Brand", name: "Minaliya" },
      offers: {
        "@type": "Offer",
        price: "379",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "156",
      },
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is cold pressed oil?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cold pressed oil is extracted from seeds using a traditional wooden press (Mara Chekku) at temperatures below 50°C. It preserves natural nutrients, flavor, and aroma without chemicals.",
        },
      },
      {
        "@type": "Question",
        name: "Is Mara Chekku oil healthy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Mara Chekku oil preserves Vitamin E, Omega-3 & 6 fatty acids, and natural antioxidants. It contains zero trans fats and no chemical residues.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between refined and cold pressed oil?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Refined oil uses chemical solvents at high temperatures, destroying nutrients. Cold pressed oil is mechanically extracted at low temperatures, retaining all natural nutrients and flavor.",
        },
      },
      {
        "@type": "Question",
        name: "Why is wooden pressed oil more expensive?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Wooden pressed oil yields 30-40% less oil per batch. The process is slower, more labor-intensive, and uses premium seeds, but delivers far superior nutrition and taste.",
        },
      },
      {
        "@type": "Question",
        name: "Which is the best oil for Indian cooking?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Groundnut and sesame oils are ideal for South Indian cooking. Coconut oil is perfect for Kerala and Tamil Nadu cuisine. Mustard oil is preferred for North Indian dishes.",
        },
      },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Minaliya Cold Pressed Oils",
    image: "https://minaliya.com/logo.png",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chennai",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    telephone: "+91-98765-43210",
    openingHours: "Mo-Sa 09:00-20:00",
    priceRange: "₹₹",
    servesCuisine: "Indian",
    areaServed: "India",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {productSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </>
  );
}
