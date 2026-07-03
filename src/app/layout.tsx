import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { OrderProvider } from "@/context/OrderContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/cart/CartDrawer";
import LoginModal from "@/components/auth/LoginModal";
import ChatBot from "@/components/common/ChatBot";
import SkipToContent from "@/components/common/SkipToContent";
import JsonLd from "@/components/seo/JsonLd";
const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Minaliya - Pure Wooden Cold Pressed Oils | Mara Chekku Oil Chennai",
    template: "%s | Minaliya Cold Pressed Oils",
  },
  description:
    "Minaliya offers 100% pure wooden cold pressed oils (Mara Chekku). Traditional extraction, chemical-free groundnut oil, coconut oil & sesame oil. Order online from Chennai.",
  keywords: [
    "cold pressed oil Chennai",
    "mara chekku oil",
    "wooden cold pressed oil",
    "pure groundnut oil",
    "cold pressed sesame oil",
    "healthy cooking oil India",
    "natural edible oil",
    "chemical free oil",
    "traditional oil extraction",
    "wood pressed oil Chennai",
    "minaliya oils",
    "cold pressed coconut oil",
    "cold pressed oil online India",
    "wooden pressed groundnut oil",
    "organic cooking oil Tamil Nadu",
  ],
  authors: [{ name: "Minaliya" }],
  creator: "Minaliya",
  publisher: "Minaliya",
  metadataBase: new URL("https://minaliya.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://minaliya.com",
    siteName: "Minaliya",
    title: "Minaliya - Pure Wooden Cold Pressed Oils | Mara Chekku Oil",
    description:
      "100% pure wooden cold pressed oils. Traditional Mara Chekku extraction preserving natural nutrients. Groundnut, Coconut & Sesame oils. Order online.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Minaliya Pure Cold Pressed Oils",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Minaliya - Pure Wooden Cold Pressed Oils",
    description:
      "Traditional Mara Chekku cold pressed oils. 100% chemical-free. Order online.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "geo.region": "IN-TN",
    "geo.placename": "Chennai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gscId = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE;
  const bingId = process.env.NEXT_PUBLIC_BING_VERIFICATION;

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}>
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Google Analytics 4 */}
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}

        {/* Google Search Console verification */}
        {gscId && <meta name="google-site-verification" content={gscId} />}

        {/* Bing Webmaster Tools verification */}
        {bingId && <meta name="msvalidate.01" content={bingId} />}

        {/* Theme color */}
        <meta name="theme-color" content="#1F4F1F" />

        {/* Security headers via meta tags (supplemental to HTTP headers) */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      </head>
      <body className="min-h-screen antialiased">
        <SkipToContent />
        <AuthProvider>
          <OrderProvider>
            <WishlistProvider>
              <CartProvider>
                <JsonLd />
                {children}
                <CartDrawer />
                <LoginModal />
                <ChatBot />
              </CartProvider>
            </WishlistProvider>
          </OrderProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
