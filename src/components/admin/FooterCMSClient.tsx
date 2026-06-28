"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Save,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  Globe,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { updateFooterSettings } from "@/actions/adminData";
import { getDefaultFooterSettings } from "@/lib/footer-defaults";
import type { FooterSettingsData, FooterLink, SocialPlatform } from "@/actions/adminData";

interface Props {
  settings: FooterSettingsData;
}

type SectionKey = keyof FooterSettingsData["showFields"];

const socialLabels: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
};

export default function FooterCMSClient({ settings: initialSettings }: Props) {
  const router = useRouter();
  const [settings, setSettings] = useState<FooterSettingsData>(structuredClone(initialSettings));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("brand");
  const [showPreview, setShowPreview] = useState(false);

  function updateField<K extends keyof FooterSettingsData>(key: K, value: FooterSettingsData[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function updateNested<K extends keyof FooterSettingsData>(parent: K, subKey: string, value: unknown) {
    setSettings((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent] as Record<string, unknown>), [subKey]: value },
    }));
  }

  function updateShowField(key: SectionKey, value: boolean) {
    setSettings((prev) => ({
      ...prev,
      showFields: { ...prev.showFields, [key]: value },
    }));
  }

  function addLink(section: "quickLinks" | "categories" | "legalLinks") {
    setSettings((prev) => ({
      ...prev,
      [section]: [...prev[section], { name: "", href: "" }],
    }));
  }

  function updateLink(section: "quickLinks" | "categories" | "legalLinks", index: number, field: keyof FooterLink, value: string) {
    setSettings((prev) => {
      const links = [...prev[section]];
      links[index] = { ...links[index], [field]: value };
      return { ...prev, [section]: links };
    });
  }

  function removeLink(section: "quickLinks" | "categories" | "legalLinks", index: number) {
    setSettings((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  }

  function addPhone() {
    setSettings((prev) => ({ ...prev, phones: [...prev.phones, ""] }));
  }

  function updatePhone(index: number, value: string) {
    setSettings((prev) => {
      const phones = [...prev.phones];
      phones[index] = value;
      return { ...prev, phones };
    });
  }

  function removePhone(index: number) {
    setSettings((prev) => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== index),
    }));
  }

  function addEmail() {
    setSettings((prev) => ({ ...prev, emails: [...prev.emails, ""] }));
  }

  function updateEmail(index: number, value: string) {
    setSettings((prev) => {
      const emails = [...prev.emails];
      emails[index] = value;
      return { ...prev, emails };
    });
  }

  function removeEmail(index: number) {
    setSettings((prev) => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index),
    }));
  }

  function updateSocial(platform: string, field: keyof SocialPlatform, value: string | boolean) {
    setSettings((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: { ...prev.socialMedia[platform as keyof typeof prev.socialMedia], [field]: value },
      },
    }));
  }

  function addPaymentMethod() {
    setSettings((prev) => ({ ...prev, paymentMethods: [...prev.paymentMethods, ""] }));
  }

  function updatePaymentMethod(index: number, value: string) {
    setSettings((prev) => {
      const methods = [...prev.paymentMethods];
      methods[index] = value;
      return { ...prev, paymentMethods: methods };
    });
  }

  function removePaymentMethod(index: number) {
    setSettings((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((_, i) => i !== index),
    }));
  }

  function validateUrl(url: string): boolean {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function validateEmail(email: string): boolean {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    if (!settings.companyName.trim()) {
      setError("Company name is required.");
      setSaving(false);
      return;
    }

    for (const email of settings.emails) {
      if (email && !validateEmail(email)) {
        setError(`Invalid email: ${email}`);
        setSaving(false);
        return;
      }
    }

    for (const platform of Object.keys(settings.socialMedia)) {
      const sp = settings.socialMedia[platform as keyof typeof settings.socialMedia];
      if (sp.enabled && sp.url && !validateUrl(sp.url)) {
        setError(`Invalid URL for ${socialLabels[platform]}: ${sp.url}`);
        setSaving(false);
        return;
      }
    }

    if (settings.googleMaps.embedUrl && !validateUrl(settings.googleMaps.embedUrl)) {
      setError("Invalid Google Maps embed URL.");
      setSaving(false);
      return;
    }

    if (settings.googleMaps.businessUrl && !validateUrl(settings.googleMaps.businessUrl)) {
      setError("Invalid Google Business Profile URL.");
      setSaving(false);
      return;
    }

    const res = await updateFooterSettings(settings);
    if (res.success) {
      setSuccess("Footer settings saved successfully!");
      router.refresh();
    } else {
      setError(res.error);
    }
    setSaving(false);
  }

  function handleReset() {
    if (!confirm("Reset all footer settings to defaults? This cannot be undone.")) return;
    setSettings(getDefaultFooterSettings());
  }

  const tabs = [
    { id: "brand", label: "Brand" },
    { id: "contact", label: "Contact" },
    { id: "links", label: "Links" },
    { id: "social", label: "Social" },
    { id: "map", label: "Map" },
    { id: "newsletter", label: "Newsletter" },
    { id: "payment", label: "Payments" },
    { id: "visibility", label: "Visibility" },
  ];

  // ─── INLINE PREVIEW ────────────────────────────────────

  function renderPreview() {
    const s = settings;
    const year = new Date().getFullYear();

    return (
      <div className="border rounded-xl overflow-hidden" style={{ borderColor: "var(--color-stone-200)" }}>
        <div className="bg-stone-900 text-stone-300 p-6 text-xs leading-relaxed">
          {/* Newsletter preview */}
          {s.showFields.newsletter && s.newsletter.enabled && (
            <div
              className="p-4 rounded-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                background: "linear-gradient(90deg, var(--color-amber-500), var(--color-terra-400))",
              }}
            >
              <div className="text-center sm:text-left">
                <p className="text-sm font-bold text-white">{s.newsletter.title}</p>
                <p className="text-[11px] text-white/80 mt-0.5">{s.newsletter.description}</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-3 py-2 rounded-full text-[11px] outline-none w-48"
                  style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}
                  readOnly
                />
                <button className="px-4 py-2 rounded-full text-[11px] font-semibold bg-white" style={{ color: "var(--color-amber-600)" }}>
                  Subscribe
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Brand */}
            <div className="lg:col-span-2 space-y-3">
              {s.logo && (
                <div className="flex items-center">
                  <Image src={s.logo} alt="Logo" width={40} height={40} className="h-10 w-auto object-contain" />
                </div>
              )}
              {s.showFields.description && (
                <p className="text-[11px] leading-relaxed max-w-xs" style={{ color: "var(--color-stone-400)" }}>
                  {s.description}
                </p>
              )}
              <div className="space-y-2 text-[11px]" style={{ color: "var(--color-stone-400)" }}>
                {s.showFields.address && s.address && (
                  <div className="flex items-start gap-2">
                    <MapPin size={12} className="shrink-0 mt-0.5" />
                    <span>{s.address}</span>
                  </div>
                )}
                {s.showFields.phone && s.phones.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Phone size={12} className="shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
                {s.showFields.email && s.emails.map((e, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Mail size={12} className="shrink-0" />
                    <span>{e}</span>
                  </div>
                ))}
                {s.showFields.businessHours && s.businessHours && (
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="shrink-0" />
                    <span>{s.businessHours}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            {s.showFields.quickLinks && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white mb-3">Quick Links</p>
                <ul className="space-y-2">
                  {s.quickLinks.map((link, i) => (
                    <li key={i} className="text-[11px]" style={{ color: "var(--color-stone-400)" }}>
                      {link.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Categories */}
            {s.showFields.categories && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white mb-3">Our Oils</p>
                <ul className="space-y-2">
                  {s.categories.map((cat, i) => (
                    <li key={i} className="text-[11px]" style={{ color: "var(--color-stone-400)" }}>
                      {cat.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Legal + Social + Payments */}
            <div>
              {s.showFields.legalLinks && (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-white mb-3">Policies</p>
                  <ul className="space-y-2 mb-4">
                    {s.legalLinks.map((l, i) => (
                      <li key={i} className="text-[11px]" style={{ color: "var(--color-stone-400)" }}>
                        {l.name}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {s.showFields.socialMedia && (
                <div className="flex gap-2 mb-4">
                  {Object.entries(s.socialMedia).map(([key, sp]) =>
                    sp.enabled ? (
                      <div key={key} className="w-6 h-6 rounded-full bg-stone-700 flex items-center justify-center">
                        <Globe size={12} />
                      </div>
                    ) : null
                  )}
                </div>
              )}
              {s.showFields.paymentMethods && s.paymentMethods.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white mb-2">We Accept</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {s.paymentMethods.map((m, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded text-[9px] font-bold"
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          color: "var(--color-stone-400)",
                          border: "1px solid rgba(255,255,255,0.08)",
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

          {/* Map */}
          {s.showFields.googleMaps && s.googleMaps.enabled && s.googleMaps.embedUrl && (
            <div className="mt-4 rounded-lg overflow-hidden h-32 bg-stone-800 flex items-center justify-center text-stone-500 text-[11px]">
              Google Maps Placeholder
            </div>
          )}

          {/* Bottom bar */}
          <div className="mt-6 pt-4 text-[10px]" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", color: "var(--color-stone-500)" }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>{s.copyright.replace("{year}", String(year))}</p>
              <p className="flex items-center gap-1">Made with <span className="text-red-400">♥</span> for healthier Indian kitchens</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── RENDER ────────────────────────────────────────────

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 p-4 border-b" style={{ borderColor: "var(--color-stone-200)" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: activeTab === tab.id ? "var(--color-forest-600)" : "var(--color-stone-100)",
              color: activeTab === tab.id ? "white" : "var(--color-stone-600)",
            }}
          >
            {tab.label}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: showPreview ? "var(--color-amber-500)" : "var(--color-stone-100)",
            color: showPreview ? "white" : "var(--color-stone-600)",
          }}
        >
          {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
          {showPreview ? "Hide Preview" : "Live Preview"}
        </button>
      </div>

      {showPreview && (
        <div className="p-4 border-b" style={{ borderColor: "var(--color-stone-200)", background: "var(--color-cream-50)" }}>
          <h4 className="text-xs font-semibold text-stone-700 mb-3">Live Preview</h4>
          {renderPreview()}
        </div>
      )}

      {/* Tab Content */}
      <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        {/* ─── BRAND ────────────────────────────────────── */}
        {activeTab === "brand" && (
          <>
            <Section title="Company Name">
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--color-stone-200)" }}
              />
            </Section>

            <Section title="Logo URL">
              <input
                type="text"
                value={settings.logo}
                onChange={(e) => updateField("logo", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--color-stone-200)" }}
                placeholder="/logo.png"
              />
              {settings.logo && (
                <div className="mt-2 relative w-16 h-16 rounded-lg overflow-hidden border" style={{ borderColor: "var(--color-stone-200)" }}>
                  <Image src={settings.logo} alt="Logo preview" fill className="object-contain" sizes="64px" />
                </div>
              )}
            </Section>

            <Section title="Description">
              <textarea
                value={settings.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                style={{ borderColor: "var(--color-stone-200)" }}
                rows={3}
              />
            </Section>

            <Section title="Copyright Text">
              <input
                type="text"
                value={settings.copyright}
                onChange={(e) => updateField("copyright", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--color-stone-200)" }}
                placeholder={'© {year} Minaliya. All rights reserved.'}
              />
              <p className="text-[10px] text-stone-400 mt-1">Use {'{year}'} to dynamically insert the current year.</p>
            </Section>
          </>
        )}

        {/* ─── CONTACT ──────────────────────────────────── */}
        {activeTab === "contact" && (
          <>
            <Section title="Business Address">
              <textarea
                value={settings.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                style={{ borderColor: "var(--color-stone-200)" }}
                rows={2}
              />
            </Section>

            <Section title="Phone Numbers">
              {settings.phones.map((phone, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => updatePhone(i, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: "var(--color-stone-200)" }}
                    placeholder="+91 98765 43210"
                  />
                  <button onClick={() => removePhone(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button onClick={addPhone} className="text-xs font-semibold text-forest-600 hover:text-forest-700">
                + Add Phone
              </button>
            </Section>

            <Section title="Email Addresses">
              {settings.emails.map((email, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(i, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: "var(--color-stone-200)" }}
                    placeholder="hello@minaliya.com"
                  />
                  <button onClick={() => removeEmail(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button onClick={addEmail} className="text-xs font-semibold text-forest-600 hover:text-forest-700">
                + Add Email
              </button>
            </Section>

            <Section title="Business Hours">
              <input
                type="text"
                value={settings.businessHours}
                onChange={(e) => updateField("businessHours", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--color-stone-200)" }}
                placeholder="Mon-Sat: 9:00 AM - 8:00 PM"
              />
            </Section>
          </>
        )}

        {/* ─── LINKS ────────────────────────────────────── */}
        {activeTab === "links" && (
          <>
            <Section title="Quick Links">
              {settings.quickLinks.map((link, i) => (
                <LinkRow
                  key={i}
                  link={link}
                  onChange={(field, value) => updateLink("quickLinks", i, field, value)}
                  onRemove={() => removeLink("quickLinks", i)}
                />
              ))}
              <button onClick={() => addLink("quickLinks")} className="text-xs font-semibold text-forest-600 hover:text-forest-700">
                + Add Quick Link
              </button>
            </Section>

            <Section title="Product Category Links">
              {settings.categories.map((cat, i) => (
                <LinkRow
                  key={i}
                  link={cat}
                  onChange={(field, value) => updateLink("categories", i, field, value)}
                  onRemove={() => removeLink("categories", i)}
                />
              ))}
              <button onClick={() => addLink("categories")} className="text-xs font-semibold text-forest-600 hover:text-forest-700">
                + Add Category
              </button>
            </Section>

            <Section title="Legal / Policy Links">
              {settings.legalLinks.map((link, i) => (
                <LinkRow
                  key={i}
                  link={link}
                  onChange={(field, value) => updateLink("legalLinks", i, field, value)}
                  onRemove={() => removeLink("legalLinks", i)}
                />
              ))}
              <button onClick={() => addLink("legalLinks")} className="text-xs font-semibold text-forest-600 hover:text-forest-700">
                + Add Legal Link
              </button>
            </Section>
          </>
        )}

        {/* ─── SOCIAL MEDIA ─────────────────────────────── */}
        {activeTab === "social" && (
          <Section title="Social Media Platforms">
            <p className="text-xs text-stone-500 mb-4">
              Enable platforms and enter their URLs. Only platforms with valid URLs will be displayed on the website.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(socialLabels).map(([key, label]) => {
                const sp = settings.socialMedia[key as keyof typeof settings.socialMedia];
                return (
                  <div
                    key={key}
                    className="p-4 rounded-xl border"
                    style={{
                      borderColor: "var(--color-stone-200)",
                      opacity: sp.enabled ? 1 : 0.5,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-stone-700">{label}</label>
                      <label className="flex items-center gap-1.5 text-[10px] text-stone-500">
                        <input
                          type="checkbox"
                          checked={sp.enabled}
                          onChange={(e) => updateSocial(key, "enabled", e.target.checked)}
                          className="rounded"
                        />
                        Show
                      </label>
                    </div>
                    <input
                      type="url"
                      value={sp.url}
                      onChange={(e) => updateSocial(key, "url", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-xs"
                      style={{ borderColor: "var(--color-stone-200)" }}
                      placeholder={`https://${key}.com/...`}
                    />
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* ─── GOOGLE MAPS ──────────────────────────────── */}
        {activeTab === "map" && (
          <Section title="Google Maps Integration">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="map-enabled"
                  checked={settings.googleMaps.enabled}
                  onChange={(e) => updateNested("googleMaps", "enabled", e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="map-enabled" className="text-xs font-semibold text-stone-600">
                  Enable Google Maps in Footer
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Google Maps Embed URL</label>
                <input
                  type="url"
                  value={settings.googleMaps.embedUrl}
                  onChange={(e) => updateNested("googleMaps", "embedUrl", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--color-stone-200)" }}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
                <p className="text-[10px] text-stone-400 mt-1">
                  Get this from Google Maps → Share → Embed a map → Copy HTML &apos;src&apos; URL.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Google Business Profile URL</label>
                <input
                  type="url"
                  value={settings.googleMaps.businessUrl}
                  onChange={(e) => updateNested("googleMaps", "businessUrl", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--color-stone-200)" }}
                  placeholder="https://g.page/r/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Latitude (optional)</label>
                  <input
                    type="text"
                    value={settings.googleMaps.lat}
                    onChange={(e) => updateNested("googleMaps", "lat", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: "var(--color-stone-200)" }}
                    placeholder="13.0358"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Longitude (optional)</label>
                  <input
                    type="text"
                    value={settings.googleMaps.lng}
                    onChange={(e) => updateNested("googleMaps", "lng", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: "var(--color-stone-200)" }}
                    placeholder="80.2300"
                  />
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* ─── NEWSLETTER ────────────────────────────────── */}
        {activeTab === "newsletter" && (
          <Section title="Newsletter Section">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="newsletter-enabled"
                  checked={settings.newsletter.enabled}
                  onChange={(e) => updateNested("newsletter", "enabled", e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="newsletter-enabled" className="text-xs font-semibold text-stone-600">
                  Enable Newsletter Section in Footer
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Title</label>
                <input
                  type="text"
                  value={settings.newsletter.title}
                  onChange={(e) => updateNested("newsletter", "title", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--color-stone-200)" }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Description</label>
                <textarea
                  value={settings.newsletter.description}
                  onChange={(e) => updateNested("newsletter", "description", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                  style={{ borderColor: "var(--color-stone-200)" }}
                  rows={2}
                />
              </div>
            </div>
          </Section>
        )}

        {/* ─── PAYMENT METHODS ──────────────────────────── */}
        {activeTab === "payment" && (
          <Section title="Payment Methods">
            {settings.paymentMethods.map((method, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={method}
                  onChange={(e) => updatePaymentMethod(i, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--color-stone-200)" }}
                  placeholder="UPI"
                />
                <button onClick={() => removePaymentMethod(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button onClick={addPaymentMethod} className="text-xs font-semibold text-forest-600 hover:text-forest-700">
              + Add Payment Method
            </button>
          </Section>
        )}

        {/* ─── VISIBILITY ───────────────────────────────── */}
        {activeTab === "visibility" && (
          <Section title="Show / Hide Footer Sections">
            <p className="text-xs text-stone-500 mb-4">Toggle which sections are visible in the footer.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(
                [
                  ["description", "Description"],
                  ["address", "Address"],
                  ["phone", "Phone Numbers"],
                  ["email", "Email Addresses"],
                  ["businessHours", "Business Hours"],
                  ["quickLinks", "Quick Links"],
                  ["categories", "Product Categories"],
                  ["legalLinks", "Legal Links"],
                  ["socialMedia", "Social Media"],
                  ["newsletter", "Newsletter"],
                  ["googleMaps", "Google Maps"],
                  ["paymentMethods", "Payment Methods"],
                ] as [SectionKey, string][]
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all hover:bg-stone-50"
                  style={{
                    borderColor: "var(--color-stone-200)",
                    opacity: settings.showFields[key] ? 1 : 0.5,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={settings.showFields[key]}
                    onChange={(e) => updateShowField(key, e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-xs font-medium text-stone-700">{label}</span>
                </label>
              ))}
            </div>
          </Section>
        )}

        {/* ─── ERROR / SUCCESS ──────────────────────────── */}
        {error && (
          <div
            className="px-4 py-2 rounded-lg text-xs font-semibold"
            style={{ background: "var(--color-terra-50)", color: "var(--color-terra-600)" }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className="px-4 py-2 rounded-lg text-xs font-semibold"
            style={{ background: "var(--color-forest-50)", color: "var(--color-forest-700)" }}
          >
            {success}
          </div>
        )}
      </div>

      {/* ─── FOOTER ACTIONS ─────────────────────────────── */}
      <div
        className="flex items-center justify-between gap-3 p-4 border-t"
        style={{ borderColor: "var(--color-stone-200)", background: "var(--color-cream-50)" }}
      >
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all"
          style={{ borderColor: "var(--color-terra-200)", color: "var(--color-terra-600)" }}
        >
          Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 rounded-xl text-xs font-semibold text-white transition-all disabled:opacity-50 inline-flex items-center gap-2"
          style={{ background: "var(--color-forest-600)" }}
          onMouseEnter={(e) => {
            if (!saving) e.currentTarget.style.background = "var(--color-forest-700)";
          }}
          onMouseLeave={(e) => {
            if (!saving) e.currentTarget.style.background = "var(--color-forest-600)";
          }}
        >
          {saving ? (
            <><Loader2 size={14} className="animate-spin" /> Saving...</>
          ) : (
            <><Save size={14} /> Save All Settings</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ──────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-stone-700 mb-3">{title}</h4>
      {children}
    </div>
  );
}

function LinkRow({
  link,
  onChange,
  onRemove,
}: {
  link: FooterLink;
  onChange: (field: "name" | "href", value: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <input
        type="text"
        value={link.name}
        onChange={(e) => onChange("name", e.target.value)}
        className="flex-1 px-3 py-2 rounded-lg border text-sm"
        style={{ borderColor: "var(--color-stone-200)" }}
        placeholder="Link name"
      />
      <input
        type="text"
        value={link.href}
        onChange={(e) => onChange("href", e.target.value)}
        className="flex-[2] px-3 py-2 rounded-lg border text-sm"
        style={{ borderColor: "var(--color-stone-200)" }}
        placeholder="/path"
      />
      <button onClick={onRemove} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 shrink-0">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
