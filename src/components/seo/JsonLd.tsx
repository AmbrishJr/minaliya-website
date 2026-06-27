interface JsonLdProps {
  breadcrumbs?: { name: string; url: string }[];
  blogPosting?: {
    title: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified?: string;
    author: string;
    url: string;
  };
  product?: {
    name: string;
    description: string;
    image: string;
    price: string;
    priceCurrency?: string;
    url: string;
    sku?: string;
    brand?: string;
    ratingValue?: string;
    reviewCount?: string;
  };
  service?: {
    name: string;
    description: string;
    provider: string;
    areaServed?: string;
  };
  webpage?: {
    name: string;
    description: string;
    url: string;
  };
}

export default function JsonLd(props?: JsonLdProps) {
  const schemas = [];

  // ── Organization ───────────────────────────────────
  schemas.push({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://minaliya.com/#organization",
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
  });

  // ── WebSite ─────────────────────────────────────────
  schemas.push({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://minaliya.com/#website",
    name: "Minaliya",
    url: "https://minaliya.com",
    publisher: { "@id": "https://minaliya.com/#organization" },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://minaliya.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  });

  // ── LocalBusiness ───────────────────────────────────
  schemas.push({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://minaliya.com/#localbusiness",
    name: "Minaliya Cold Pressed Oils",
    image: "https://minaliya.com/logo.png",
    url: "https://minaliya.com",
    telephone: "+91-98765-43210",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chennai",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    openingHours: "Mo-Sa 09:00-20:00",
    priceRange: "₹₹",
    servesCuisine: "Indian",
    areaServed: "India",
    parentOrganization: { "@id": "https://minaliya.com/#organization" },
  });

  // ── WebPage ─────────────────────────────────────────
  if (props?.webpage) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": props.webpage.url,
      name: props.webpage.name,
      description: props.webpage.description,
      url: props.webpage.url,
      isPartOf: { "@id": "https://minaliya.com/#website" },
    });
  }

  // ── BreadcrumbList ──────────────────────────────────
  if (props?.breadcrumbs?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: props.breadcrumbs.map((crumb, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    });
  }

  // ── Product ─────────────────────────────────────────
  if (props?.product) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": props.product.url,
      name: props.product.name,
      image: props.product.image,
      description: props.product.description,
      url: props.product.url,
      sku: props.product.sku,
      brand: { "@type": "Brand", name: props.product.brand || "Minaliya" },
      offers: {
        "@type": "Offer",
        price: props.product.price,
        priceCurrency: props.product.priceCurrency || "INR",
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: "Minaliya" },
      },
      ...(props.product.ratingValue
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: props.product.ratingValue,
              reviewCount: props.product.reviewCount || "0",
            },
          }
        : {}),
    });
  }

  // ── BlogPosting ─────────────────────────────────────
  if (props?.blogPosting) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": props.blogPosting.url,
      headline: props.blogPosting.title,
      description: props.blogPosting.description,
      image: props.blogPosting.image,
      datePublished: props.blogPosting.datePublished,
      dateModified: props.blogPosting.dateModified || props.blogPosting.datePublished,
      author: {
        "@type": "Person",
        name: props.blogPosting.author,
      },
      publisher: { "@id": "https://minaliya.com/#organization" },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": props.blogPosting.url,
      },
    });
  }

  // ── Service ─────────────────────────────────────────
  if (props?.service) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: props.service.name,
      description: props.service.description,
      provider: { "@type": "Organization", name: props.service.provider },
      areaServed: props.service.areaServed || "IN",
    });
  }

  // ── FAQ ─────────────────────────────────────────────
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://minaliya.com/#faq",
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
          text: "Groundnut and sesame oils are ideal for South Indian cooking. Coconut oil is perfect for Kerala and Tamil Nadu cuisine.",
        },
      },
    ],
  };
  schemas.push(faqSchema);

  // ── Product schemas for homepage ────────────────────
  const productSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Cold Pressed Groundnut Oil",
      image: "https://minaliya.com/logo.png",
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
      image: "https://minaliya.com/logo.png",
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
      image: "https://minaliya.com/logo.png",
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
  productSchemas.forEach((s) => schemas.push(s));

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
