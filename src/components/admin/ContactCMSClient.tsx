"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
} from "lucide-react";
import { updateContactSettings } from "@/actions/adminData";
import { getDefaultContactSettings } from "@/lib/contact-defaults";
import type { ContactSettingsData, ContactCard, ContactCardIcon } from "@/actions/adminData";

interface Props {
  settings: ContactSettingsData;
}

const iconOptions: { value: ContactCardIcon; label: string; Icon: typeof MapPin }[] = [
  { value: "map", label: "Map Pin", Icon: MapPin },
  { value: "phone", label: "Phone", Icon: Phone },
  { value: "mail", label: "Mail", Icon: Mail },
  { value: "clock", label: "Clock", Icon: Clock },
];

export default function ContactCMSClient({ settings: initialSettings }: Props) {
  const router = useRouter();
  const [settings, setSettings] = useState<ContactSettingsData>(structuredClone(initialSettings));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("hero");
  const [showPreview, setShowPreview] = useState(false);

  function updateField<K extends keyof ContactSettingsData>(key: K, value: ContactSettingsData[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function updateNested<K extends keyof ContactSettingsData>(parent: K, subKey: string, value: unknown) {
    setSettings((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent] as Record<string, unknown>), [subKey]: value },
    }));
  }

  function addCard() {
    setSettings((prev) => ({
      ...prev,
      cards: [...prev.cards, { icon: "map", title: "", lines: [""], href: "" }],
    }));
  }

  function updateCard(index: number, field: keyof ContactCard, value: string | ContactCardIcon) {
    setSettings((prev) => {
      const cards = [...prev.cards];
      cards[index] = { ...cards[index], [field]: value };
      return { ...prev, cards };
    });
  }

  function addCardLine(index: number) {
    setSettings((prev) => {
      const cards = [...prev.cards];
      cards[index] = { ...cards[index], lines: [...cards[index].lines, ""] };
      return { ...prev, cards };
    });
  }

  function updateCardLine(cardIndex: number, lineIndex: number, value: string) {
    setSettings((prev) => {
      const cards = [...prev.cards];
      const lines = [...cards[cardIndex].lines];
      lines[lineIndex] = value;
      cards[cardIndex] = { ...cards[cardIndex], lines };
      return { ...prev, cards };
    });
  }

  function removeCardLine(cardIndex: number, lineIndex: number) {
    setSettings((prev) => {
      const cards = [...prev.cards];
      cards[cardIndex] = {
        ...cards[cardIndex],
        lines: cards[cardIndex].lines.filter((_, i) => i !== lineIndex),
      };
      return { ...prev, cards };
    });
  }

  function removeCard(index: number) {
    setSettings((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index),
    }));
  }

  function addSubject() {
    setSettings((prev) => ({ ...prev, subjects: [...prev.subjects, ""] }));
  }

  function updateSubject(index: number, value: string) {
    setSettings((prev) => {
      const subjects = [...prev.subjects];
      subjects[index] = value;
      return { ...prev, subjects };
    });
  }

  function removeSubject(index: number) {
    setSettings((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
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

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    if (!settings.metaTitle.trim()) {
      setError("Page title (SEO) is required.");
      setSaving(false);
      return;
    }

    if (settings.whatsapp.enabled) {
      const digits = settings.whatsapp.number.replace(/\D/g, "");
      if (!digits) {
        setError("WhatsApp number is required when WhatsApp is enabled.");
        setSaving(false);
        return;
      }
    }

    if (settings.mapEmbedUrl && !validateUrl(settings.mapEmbedUrl)) {
      setError("Invalid Google Maps embed URL.");
      setSaving(false);
      return;
    }

    const res = await updateContactSettings(settings);
    if (res.success) {
      setSuccess("Contact page settings saved successfully!");
      router.refresh();
    } else {
      setError(res.error);
    }
    setSaving(false);
  }

  function handleReset() {
    if (!confirm("Reset all contact page settings to defaults? This cannot be undone.")) return;
    setSettings(getDefaultContactSettings());
  }

  const tabs = [
    { id: "hero", label: "Hero & SEO" },
    { id: "cards", label: "Contact Cards" },
    { id: "whatsapp", label: "WhatsApp & Map" },
    { id: "form", label: "Form & Subjects" },
  ];

  // ─── INLINE PREVIEW ────────────────────────────────────

  function renderPreview() {
    const s = settings;
    return (
      <div className="border rounded-xl overflow-hidden" style={{ borderColor: "var(--color-stone-200)" }}>
        {/* Hero preview */}
        <div className="p-6 text-center" style={{ background: "linear-gradient(135deg, var(--color-cream-100) 0%, var(--color-amber-50) 50%, var(--color-cream-200) 100%)" }}>
          <p className="text-base font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-stone-900)" }}>
            {s.heroTitle} <em className="font-normal">{s.heroHighlight}</em>
          </p>
          <p className="text-[11px] mt-2 max-w-sm mx-auto" style={{ color: "var(--color-stone-500)" }}>
            {s.heroSubtitle}
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5" style={{ background: "var(--color-cream-50)" }}>
          {/* Left: cards + whatsapp + map */}
          <div className="space-y-3">
            {s.showFields.cards &&
              s.cards.map((card, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-white" style={{ border: "1px solid var(--color-stone-200)" }}>
                  <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--color-forest-50)", color: "var(--color-forest-500)" }}>
                    {card.icon === "phone" && <Phone size={14} />}
                    {card.icon === "mail" && <Mail size={14} />}
                    {card.icon === "clock" && <Clock size={14} />}
                    {card.icon === "map" && <MapPin size={14} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold" style={{ color: "var(--color-stone-800)" }}>{card.title}</p>
                    {card.lines.map((line, j) => (
                      <p key={j} className="text-[10px] leading-relaxed" style={{ color: "var(--color-stone-500)" }}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            {s.showFields.whatsapp && s.whatsapp.enabled && (
              <div className="flex items-center justify-center gap-2 py-3 rounded-full text-[11px] font-semibold" style={{ background: "#25D366", color: "white" }}>
                <MessageCircle size={14} />
                {s.whatsapp.label || "Chat on WhatsApp"}
              </div>
            )}
            {s.showFields.map && s.mapEmbedUrl && (
              <div className="h-24 rounded-xl bg-forest-700 flex items-center justify-center text-cream-300 text-[11px]">
                Google Maps Embed
              </div>
            )}
          </div>

          {/* Right: form placeholder */}
          {s.showFields.form && (
            <div className="p-4 rounded-xl bg-white" style={{ border: "1px solid var(--color-stone-200)" }}>
              <p className="text-xs font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-800)" }}>
                {s.form.title}
              </p>
              <p className="text-[10px] mb-3" style={{ color: "var(--color-stone-400)" }}>{s.form.subtitle}</p>
              {["name", "phone", "email", "subject"].map((field) => (
                <div key={field} className="h-7 rounded-md mb-2" style={{ background: "var(--color-cream-50)", border: "1.5px solid var(--color-stone-200)" }} />
              ))}
              <div className="h-14 rounded-md mb-3" style={{ background: "var(--color-cream-50)", border: "1.5px solid var(--color-stone-200)" }} />
              <div className="h-7 w-28 rounded-full flex items-center justify-center text-[10px] font-semibold text-white" style={{ background: "var(--color-forest-600)" }}>
                {s.form.buttonLabel || "Send Message"}
              </div>
            </div>
          )}
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
        {/* ─── HERO & SEO ────────────────────────────────── */}
        {activeTab === "hero" && (
          <>
            <Section title="SEO Page Title">
              <input
                type="text"
                value={settings.metaTitle}
                onChange={(e) => updateField("metaTitle", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--color-stone-200)" }}
              />
            </Section>

            <Section title="SEO Meta Description">
              <textarea
                value={settings.metaDescription}
                onChange={(e) => updateField("metaDescription", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                style={{ borderColor: "var(--color-stone-200)" }}
                rows={3}
              />
            </Section>

            <Section title="Hero Title">
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) => updateField("heroTitle", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--color-stone-200)" }}
                placeholder="Get in"
              />
            </Section>

            <Section title="Hero Highlight (italic word)">
              <input
                type="text"
                value={settings.heroHighlight}
                onChange={(e) => updateField("heroHighlight", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--color-stone-200)" }}
                placeholder="Touch"
              />
            </Section>

            <Section title="Hero Subtitle">
              <textarea
                value={settings.heroSubtitle}
                onChange={(e) => updateField("heroSubtitle", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                style={{ borderColor: "var(--color-stone-200)" }}
                rows={3}
              />
            </Section>
          </>
        )}

        {/* ─── CONTACT CARDS ─────────────────────────────── */}
        {activeTab === "cards" && (
          <Section title="Contact Information Cards">
            <p className="text-xs text-stone-500 mb-4">
              These cards appear on the left side of the contact page (Visit Us, Call Us, Email Us, etc.).
            </p>
            {settings.cards.map((card, i) => (
              <div key={i} className="p-4 rounded-xl border mb-4" style={{ borderColor: "var(--color-stone-200)" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-stone-700">Card {i + 1}</span>
                  <button onClick={() => removeCard(i)} className="p-2 rounded-lg hover:bg-red-50 text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-500 mb-1">Icon</label>
                    <select
                      value={card.icon}
                      onChange={(e) => updateCard(i, "icon", e.target.value as ContactCardIcon)}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: "var(--color-stone-200)" }}
                    >
                      {iconOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-500 mb-1">Title</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => updateCard(i, "title", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: "var(--color-stone-200)" }}
                      placeholder="Visit Us"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-[10px] font-semibold text-stone-500 mb-1">Lines</label>
                  {card.lines.map((line, j) => (
                    <div key={j} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={line}
                        onChange={(e) => updateCardLine(i, j, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border text-sm"
                        style={{ borderColor: "var(--color-stone-200)" }}
                        placeholder="Line text"
                      />
                      <button onClick={() => removeCardLine(i, j)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addCardLine(i)} className="text-xs font-semibold text-forest-600 hover:text-forest-700">
                    + Add Line
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-stone-500 mb-1">
                    Link (optional — tel:, mailto:, https://)
                  </label>
                  <input
                    type="text"
                    value={card.href}
                    onChange={(e) => updateCard(i, "href", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: "var(--color-stone-200)" }}
                    placeholder="tel:+919876543210"
                  />
                </div>
              </div>
            ))}
            <button onClick={addCard} className="text-xs font-semibold text-forest-600 hover:text-forest-700">
              + Add Contact Card
            </button>
          </Section>
        )}

        {/* ─── WHATSAPP & MAP ────────────────────────────── */}
        {activeTab === "whatsapp" && (
          <>
            <Section title="WhatsApp Quick CTA">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="whatsapp-enabled"
                    checked={settings.whatsapp.enabled}
                    onChange={(e) => updateNested("whatsapp", "enabled", e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="whatsapp-enabled" className="text-xs font-semibold text-stone-600">
                    Show WhatsApp button on Contact Page
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Button Label</label>
                  <input
                    type="text"
                    value={settings.whatsapp.label}
                    onChange={(e) => updateNested("whatsapp", "label", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: "var(--color-stone-200)" }}
                    placeholder="Chat on WhatsApp"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">WhatsApp Number (with country code, no +)</label>
                  <input
                    type="text"
                    value={settings.whatsapp.number}
                    onChange={(e) => updateNested("whatsapp", "number", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: "var(--color-stone-200)" }}
                    placeholder="919876543210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Prefilled Message</label>
                  <input
                    type="text"
                    value={settings.whatsapp.message}
                    onChange={(e) => updateNested("whatsapp", "message", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: "var(--color-stone-200)" }}
                    placeholder="Hi Minaliya! I have a query."
                  />
                </div>
              </div>
            </Section>

            <Section title="Google Maps Embed URL">
              <input
                type="url"
                value={settings.mapEmbedUrl}
                onChange={(e) => updateField("mapEmbedUrl", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--color-stone-200)" }}
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <p className="text-[10px] text-stone-400 mt-1">
                Get this from Google Maps → Share → Embed a map → Copy HTML &apos;src&apos; URL.
              </p>
            </Section>
          </>
        )}

        {/* ─── FORM & SUBJECTS ───────────────────────────── */}
        {activeTab === "form" && (
          <>
            <Section title="Form Heading">
              <input
                type="text"
                value={settings.form.title}
                onChange={(e) => updateNested("form", "title", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--color-stone-200)" }}
                placeholder="Send Us a Message"
              />
            </Section>

            <Section title="Form Subtitle">
              <input
                type="text"
                value={settings.form.subtitle}
                onChange={(e) => updateNested("form", "subtitle", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--color-stone-200)" }}
                placeholder="Fill out the form and we'll get back to you within 24 hours."
              />
            </Section>

            <Section title="Submit Button Label">
              <input
                type="text"
                value={settings.form.buttonLabel}
                onChange={(e) => updateNested("form", "buttonLabel", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--color-stone-200)" }}
                placeholder="Send Message"
              />
            </Section>

            <Section title="Form Subject Options">
              {settings.subjects.map((subject, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => updateSubject(i, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: "var(--color-stone-200)" }}
                    placeholder="General Enquiry"
                  />
                  <button onClick={() => removeSubject(i)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button onClick={addSubject} className="text-xs font-semibold text-forest-600 hover:text-forest-700">
                + Add Subject
              </button>
            </Section>

            <Section title="Show / Hide Contact Page Sections">
              <p className="text-xs text-stone-500 mb-4">Toggle which sections are visible on the contact page.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    ["cards", "Contact Cards"],
                    ["whatsapp", "WhatsApp Button"],
                    ["map", "Google Map"],
                    ["form", "Contact Form"],
                  ] as [keyof ContactSettingsData["showFields"], string][]
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
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          showFields: { ...prev.showFields, [key]: e.target.checked },
                        }))
                      }
                      className="rounded"
                    />
                    <span className="text-xs font-medium text-stone-700">{label}</span>
                  </label>
                ))}
              </div>
            </Section>
          </>
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
