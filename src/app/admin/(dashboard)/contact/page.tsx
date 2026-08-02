import { getContactSettings } from "@/lib/contact-data";
import ContactCMSClient from "@/components/admin/ContactCMSClient";

export const revalidate = 0;

export default async function AdminContactPage() {
  const settings = await getContactSettings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "var(--font-heading)" }}>
            Contact Page Settings
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Manage all contact page content — hero text, contact cards, WhatsApp, map, and form.
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "white",
          borderColor: "var(--color-forest-200)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <ContactCMSClient settings={settings} />
      </div>
    </div>
  );
}
