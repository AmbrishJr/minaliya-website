"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Truck, CreditCard, Phone, X, Plus, Trash2 } from "lucide-react";
import { updateHeaderSettings } from "@/actions/adminData";
import { getDefaultHeaderSettings } from "@/lib/header-defaults";
import type { HeaderSettingsData } from "@/actions/adminData";

interface Props {
  settings: HeaderSettingsData;
}

export default function HeaderSettingsClient({ settings: initialSettings }: Props) {
  const router = useRouter();
  const [settings, setSettings] = useState<HeaderSettingsData>(structuredClone(initialSettings));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    if (!settings.announcement1.text.trim() && settings.announcement1.enabled) {
      setError("Announcement 1 text is required when enabled.");
      setSaving(false);
      return;
    }
    if (!settings.announcement2.text.trim() && settings.announcement2.enabled) {
      setError("Announcement 2 text is required when enabled.");
      setSaving(false);
      return;
    }
    if ((!settings.announcement3.label.trim() || !settings.announcement3.phone.trim()) && settings.announcement3.enabled) {
      setError("WhatsApp label and phone are required when enabled.");
      setSaving(false);
      return;
    }
    if (!settings.announcement4.text.trim() && settings.announcement4.enabled) {
      setError("Announcement 4 text is required when enabled.");
      setSaving(false);
      return;
    }

    const res = await updateHeaderSettings(settings);
    if (res.success) {
      setSuccess("Header settings saved successfully!");
      router.refresh();
    } else {
      setError(res.error);
    }
    setSaving(false);
  }

  function handleReset() {
    if (!confirm("Reset all header settings to defaults? This cannot be undone.")) return;
    setSettings(getDefaultHeaderSettings());
  }

  const iconOptions = [
    { value: "none", label: "No Icon" },
    { value: "truck", label: "Truck" },
    { value: "credit-card", label: "Credit Card" },
    { value: "phone", label: "Phone" },
  ];

  const iconMap: Record<string, React.ReactNode> = {
    truck: <Truck size={14} />,
    "credit-card": <CreditCard size={14} />,
    phone: <Phone size={14} />,
  };

  return (
    <div>
      <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
        {/* ─── ANNOUNCEMENT 1 ──────────────────────────────── */}
        <Section title="Announcement 1">
          <PreviewBadge icon={<Truck size={14} />} text={settings.announcement1.text} enabled={settings.announcement1.enabled} />
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Text</label>
              <input
                type="text"
                value={settings.announcement1.text}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    announcement1: { ...prev.announcement1, text: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--color-stone-200)" }}
                placeholder="Free Shipping on Orders Above ₹499"
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Icon</label>
                <select
                  value={settings.announcement1.icon}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      announcement1: { ...prev.announcement1, icon: e.target.value },
                    }))
                  }
                  className="px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--color-stone-200)" }}
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="ann1-enabled"
                  checked={settings.announcement1.enabled}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      announcement1: { ...prev.announcement1, enabled: e.target.checked },
                    }))
                  }
                  className="rounded"
                />
                <label htmlFor="ann1-enabled" className="text-xs font-semibold text-stone-600">
                  Enabled
                </label>
              </div>
            </div>
          </div>
        </Section>

        {/* ─── ANNOUNCEMENT 2 ──────────────────────────────── */}
        <Section title="Announcement 2">
          <PreviewBadge icon={<CreditCard size={14} />} text={settings.announcement2.text} enabled={settings.announcement2.enabled} />
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Text</label>
              <input
                type="text"
                value={settings.announcement2.text}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    announcement2: { ...prev.announcement2, text: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--color-stone-200)" }}
                placeholder="Free Shipping in TN, KL, KA, TG, AP"
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Icon</label>
                <select
                  value={settings.announcement2.icon}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      announcement2: { ...prev.announcement2, icon: e.target.value },
                    }))
                  }
                  className="px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--color-stone-200)" }}
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="ann2-enabled"
                  checked={settings.announcement2.enabled}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      announcement2: { ...prev.announcement2, enabled: e.target.checked },
                    }))
                  }
                  className="rounded"
                />
                <label htmlFor="ann2-enabled" className="text-xs font-semibold text-stone-600">
                  Enabled
                </label>
              </div>
            </div>
          </div>
        </Section>

        {/* ─── WHATSAPP ANNOUNCEMENT ──────────────────────── */}
        <Section title="WhatsApp Announcement">
          <PreviewBadge icon={<Phone size={14} />} text={`${settings.announcement3.label} ${settings.announcement3.phone}`} enabled={settings.announcement3.enabled} />
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Label</label>
              <input
                type="text"
                value={settings.announcement3.label}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    announcement3: { ...prev.announcement3, label: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--color-stone-200)" }}
                placeholder="WhatsApp Order:"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Phone Number</label>
              <input
                type="text"
                value={settings.announcement3.phone}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    announcement3: { ...prev.announcement3, phone: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--color-stone-200)" }}
                placeholder="+91 98765 43210"
              />
              <p className="text-[10px] text-stone-400 mt-1">
                This number will be used as a clickable WhatsApp link (wa.me).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ann3-enabled"
                checked={settings.announcement3.enabled}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    announcement3: { ...prev.announcement3, enabled: e.target.checked },
                  }))
                }
                className="rounded"
              />
              <label htmlFor="ann3-enabled" className="text-xs font-semibold text-stone-600">
                Enabled
              </label>
            </div>
          </div>
        </Section>

        {/* ─── ANNOUNCEMENT 4 ──────────────────────────────── */}
        <Section title="Announcement 4">
          <PreviewBadge text={settings.announcement4.text} enabled={settings.announcement4.enabled} />
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Text</label>
              <input
                type="text"
                value={settings.announcement4.text}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    announcement4: { ...prev.announcement4, text: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--color-stone-200)" }}
                placeholder="100% Pure Wooden Cold Pressed Oils"
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Icon</label>
                <select
                  value={settings.announcement4.icon}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      announcement4: { ...prev.announcement4, icon: e.target.value },
                    }))
                  }
                  className="px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--color-stone-200)" }}
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="ann4-enabled"
                  checked={settings.announcement4.enabled}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      announcement4: { ...prev.announcement4, enabled: e.target.checked },
                    }))
                  }
                  className="rounded"
                />
                <label htmlFor="ann4-enabled" className="text-xs font-semibold text-stone-600">
                  Enabled
                </label>
              </div>
            </div>
          </div>
        </Section>

        {/* ─── EXTRA ANNOUNCEMENTS ──────────────────────────── */}
        <Section title="Extra Announcements">
          <p className="text-xs text-stone-500 mb-3">
            Add additional scrolling announcements beyond the default four.
          </p>
          {(settings.extraAnnouncements || []).map((ann, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border mb-3"
              style={{ borderColor: "var(--color-stone-200)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-stone-600">
                  Extra #{i + 1}
                </span>
                <button
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      extraAnnouncements: (prev.extraAnnouncements || []).filter((_, j) => j !== i),
                    }))
                  }
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <PreviewBadge
                icon={ann.icon !== "none" ? iconMap[ann.icon] : undefined}
                text={ann.text}
                enabled={ann.enabled}
              />
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Text</label>
                  <input
                    type="text"
                    value={ann.text}
                    onChange={(e) =>
                      setSettings((prev) => {
                        const list = prev.extraAnnouncements || [];
                        const extra = [...list];
                        extra[i] = { ...extra[i], text: e.target.value };
                        return { ...prev, extraAnnouncements: extra };
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: "var(--color-stone-200)" }}
                    placeholder="Announcement text"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Icon</label>
                    <select
                      value={ann.icon}
                      onChange={(e) =>
                        setSettings((prev) => {
                          const list = prev.extraAnnouncements || [];
                          const extra = [...list];
                          extra[i] = { ...extra[i], icon: e.target.value };
                          return { ...prev, extraAnnouncements: extra };
                        })
                      }
                      className="px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: "var(--color-stone-200)" }}
                    >
                      {iconOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id={`extra-enabled-${i}`}
                      checked={ann.enabled}
                      onChange={(e) =>
                        setSettings((prev) => {
                          const list = prev.extraAnnouncements || [];
                          const extra = [...list];
                          extra[i] = { ...extra[i], enabled: e.target.checked };
                          return { ...prev, extraAnnouncements: extra };
                        })
                      }
                      className="rounded"
                    />
                    <label htmlFor={`extra-enabled-${i}`} className="text-xs font-semibold text-stone-600">
                      Enabled
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                extraAnnouncements: [...(prev.extraAnnouncements || []), { text: "", icon: "none", enabled: true }],
              }))
            }
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-600 hover:text-forest-700"
          >
            <Plus size={14} />
            Add Extra Announcement
          </button>
        </Section>

        {/* ─── ERROR / SUCCESS ────────────────────────────── */}
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

      {/* ─── ACTIONS ──────────────────────────────────────── */}
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
            <><Save size={14} /> Save Settings</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-stone-700 mb-3">{title}</h4>
      {children}
    </div>
  );
}

function PreviewBadge({ icon, text, enabled }: { icon?: React.ReactNode; text: string; enabled: boolean }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium tracking-wide uppercase mb-3"
      style={{
        background: enabled ? "var(--color-forest-50)" : "var(--color-stone-100)",
        color: enabled ? "var(--color-forest-700)" : "var(--color-stone-400)",
        border: "1px solid",
        borderColor: enabled ? "var(--color-forest-200)" : "var(--color-stone-200)",
      }}
    >
      {icon}
      {text || "(empty)"}
      {!enabled && <X size={10} className="ml-1" />}
    </div>
  );
}
