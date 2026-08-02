import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { getContactSettings } from "@/lib/contact-data";
import type { ContactCardIcon } from "@/actions/adminData";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getContactSettings();
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: "/contact" },
    openGraph: {
      title: s.metaTitle,
      description: s.metaDescription,
      url: "https://minaliya.com/contact",
      images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: s.metaTitle }],
    },
  };
}

const cardIcons: Record<ContactCardIcon, React.ReactNode> = {
  map: <MapPin size={22} />,
  phone: <Phone size={22} />,
  mail: <Mail size={22} />,
  clock: <Clock size={22} />,
};

export default async function ContactPage() {
  const s = await getContactSettings();

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main id="main-content">
        {/* ─── Hero ─── */}
        <section
          className="relative overflow-hidden py-20 sm:py-28"
          style={{
            background:
              "linear-gradient(135deg, var(--color-cream-100) 0%, var(--color-amber-50) 50%, var(--color-cream-200) 100%)",
          }}
        >
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
            style={{ background: "var(--color-amber-300)", filter: "blur(80px)" }}
            aria-hidden="true"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="divider-leaf mx-auto mb-6" />
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-stone-900)",
              }}
            >
              {s.heroTitle} <span className="italic font-normal">{s.heroHighlight}</span>
            </h1>
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--color-stone-500)" }}
            >
              {s.heroSubtitle}
            </p>
          </div>
        </section>

        {/* ─── Contact Content ─── */}
        <section className="section-padding" style={{ background: "var(--color-cream-50)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
              {/* Left: Contact Info */}
              <div className="space-y-6">
                {/* Contact Cards */}
                {s.showFields.cards &&
                  s.cards.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-5 rounded-2xl transition-all duration-300 hover:shadow-md"
                      style={{
                        background: "white",
                        border: "1px solid var(--color-stone-200)",
                      }}
                    >
                      <div
                        className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background: "var(--color-forest-50)",
                          color: "var(--color-forest-500)",
                        }}
                      >
                        {cardIcons[item.icon] ?? <MapPin size={22} />}
                      </div>
                      <div>
                        <h3
                          className="text-sm font-semibold mb-1"
                          style={{ color: "var(--color-stone-800)" }}
                        >
                          {item.title}
                        </h3>
                        {item.lines.map((line, j) =>
                          item.href ? (
                            <a
                              key={j}
                              href={item.href}
                              className="block text-sm hover:underline"
                              style={{ color: "var(--color-stone-500)" }}
                            >
                              {line}
                            </a>
                          ) : (
                            <p
                              key={j}
                              className="text-sm"
                              style={{ color: "var(--color-stone-500)" }}
                            >
                              {line}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  ))}

                {/* WhatsApp Quick CTA */}
                {s.showFields.whatsapp && s.whatsapp.enabled && s.whatsapp.number && (
                  <a
                    href={`https://wa.me/${s.whatsapp.number}?text=${encodeURIComponent(
                      s.whatsapp.message
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-full font-semibold text-base transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: "#25D366", color: "white" }}
                  >
                    <MessageCircle size={20} />
                    {s.whatsapp.label || "Chat on WhatsApp"}
                  </a>
                )}

                {/* Live Google Map Embed */}
                {s.showFields.map && s.mapEmbedUrl && (
                  <div
                    className="rounded-2xl overflow-hidden h-72 sm:h-64 shadow-soft transition-all duration-300 hover:shadow-md"
                    style={{
                      border: "1px solid var(--color-stone-200)",
                    }}
                  >
                    <iframe
                      src={s.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Minaliya Location"
                    ></iframe>
                  </div>
                )}
              </div>

              {/* Right: Contact Form */}
              {s.showFields.form && (
                <div className="lg:col-span-2">
                  <div
                    className="p-8 sm:p-10 rounded-2xl"
                    style={{
                      background: "white",
                      border: "1px solid var(--color-stone-200)",
                      boxShadow: "var(--shadow-card)",
                    }}
                  >
                    <h2
                      className="text-2xl font-bold mb-2"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-stone-800)",
                      }}
                    >
                      {s.form.title}
                    </h2>
                    <p
                      className="text-sm mb-8"
                      style={{ color: "var(--color-stone-400)" }}
                    >
                      {s.form.subtitle}
                    </p>
                    <ContactForm subjects={s.subjects} buttonLabel={s.form.buttonLabel} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
