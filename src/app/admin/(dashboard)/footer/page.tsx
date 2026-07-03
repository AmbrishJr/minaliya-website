import { getFooterSettings } from "@/lib/footer-data";
import FooterCMSClient from "@/components/admin/FooterCMSClient";

export const revalidate = 0;

export default async function AdminFooterPage() {
  const settings = await getFooterSettings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "var(--font-heading)" }}>
            Footer Settings
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Manage all footer content — navigation links, contact info, social media, map, and more.
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
        <FooterCMSClient settings={settings} />
      </div>
    </div>
  );
}
