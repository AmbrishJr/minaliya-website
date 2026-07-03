import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
} from "lucide-react";
import { getFooterSettings } from "@/lib/footer-data";
import FooterNewsletter from "./FooterNewsletter";
import type { FooterSettingsData } from "@/actions/adminData";

const socialIcons: Record<string, React.ReactNode> = {
  facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  instagram: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  youtube: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  whatsapp: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
};

export default async function Footer() {
  const s: FooterSettingsData = await getFooterSettings();
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--color-stone-900)",
        color: "var(--color-stone-300)",
      }}
    >
      {/* Newsletter Strip */}
      {s.showFields.newsletter && s.newsletter.enabled && (
        <div
          style={{
            background:
              "linear-gradient(90deg, var(--color-amber-500), var(--color-terra-400))",
          }}
        >
          <FooterNewsletter
            title={s.newsletter.title}
            description={s.newsletter.description}
          />
        </div>
      )}

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            {s.logo && (
              <div className="flex items-center">
                <Image
                  src={s.logo}
                  alt={`${s.companyName} Logo`}
                  width={64}
                  height={64}
                  className="h-16 w-auto object-contain"
                />
              </div>
            )}
            {s.showFields.description && (
              <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--color-stone-400)" }}>
                {s.description}
              </p>
            )}
            <div className="space-y-3 text-sm" style={{ color: "var(--color-stone-400)" }}>
              {s.showFields.address && s.address && (
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="shrink-0 mt-0.5" />
                  <span>{s.address}</span>
                </div>
              )}
              {s.showFields.phone && s.phones.map((phone, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Phone size={16} className="shrink-0" />
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-white transition-colors">
                    {phone}
                  </a>
                </div>
              ))}
              {s.showFields.email && s.emails.map((email, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Mail size={16} className="shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                    {email}
                  </a>
                </div>
              ))}
              {s.showFields.businessHours && s.businessHours && (
                <div className="flex items-center gap-2.5">
                  <Clock size={16} className="shrink-0" />
                  <span>{s.businessHours}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          {s.showFields.quickLinks && s.quickLinks.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {s.quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors flex items-center gap-1.5 group"
                      style={{ color: "var(--color-stone-400)" }}
                    >
                      <ArrowRight
                        size={12}
                        className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Categories */}
          {s.showFields.categories && s.categories.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
                Our Oils
              </h4>
              <ul className="space-y-3">
                {s.categories.map((cat) => (
                  <li key={cat.name}>
                    <Link
                      href={cat.href}
                      className="text-sm hover:text-white transition-colors flex items-center gap-1.5 group"
                      style={{ color: "var(--color-stone-400)" }}
                    >
                      <ArrowRight
                        size={12}
                        className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      />
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Policies + Social + Payments */}
          <div>
            {s.showFields.legalLinks && s.legalLinks.length > 0 && (
              <>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
                  Policies
                </h4>
                <ul className="space-y-3">
                  {s.legalLinks.map((p) => (
                    <li key={p.name}>
                      <Link
                        href={p.href}
                        className="text-sm hover:text-white transition-colors flex items-center gap-1.5 group"
                        style={{ color: "var(--color-stone-400)" }}
                      >
                        <ArrowRight
                          size={12}
                          className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                        />
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Social Media */}
            {s.showFields.socialMedia && (
              <div className={s.showFields.legalLinks && s.legalLinks.length > 0 ? "mt-8" : ""}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
                  Follow Us
                </h4>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(s.socialMedia).map(([key, sp]) =>
                    sp.enabled && sp.url ? (
                      <a
                        key={key}
                        href={sp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full transition-all hover:scale-110"
                        style={{
                          background: "rgba(255, 255, 255, 0.08)",
                          color: "var(--color-stone-400)",
                        }}
                        aria-label={key}
                      >
                        {socialIcons[key]}
                      </a>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* Payment Methods */}
            {s.showFields.paymentMethods && s.paymentMethods.length > 0 && (
              <div className="mt-8">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
                  We Accept
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {s.paymentMethods.map((m) => (
                    <span
                      key={m}
                      className="px-3 py-1.5 rounded-md text-[10px] font-bold"
                      style={{
                        background: "rgba(255, 255, 255, 0.08)",
                        color: "var(--color-stone-400)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Google Maps */}
        {s.showFields.googleMaps && s.googleMaps.enabled && s.googleMaps.embedUrl && (
          <div className="mt-12">
            <div className="w-full rounded-xl overflow-hidden" style={{ maxHeight: 300 }}>
              <iframe
                src={s.googleMaps.embedUrl}
                width="100%"
                height="250"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Minaliya Location"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ color: "var(--color-stone-500)" }}>
            <p>
              {s.copyright.replace("{year}", String(year))}
            </p>
            <p className="flex items-center gap-1.5">
              Made with <span className="text-red-400">♥</span> for healthier
              Indian kitchens
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
