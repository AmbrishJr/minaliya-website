import { getHeaderSettings } from "@/lib/header-data";
import HeaderSettingsClient from "@/components/admin/HeaderSettingsClient";

export const revalidate = 0;

export default async function AdminHeaderSettingsPage() {
  const settings = await getHeaderSettings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "var(--font-heading)" }}>
            Header Settings
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Manage the top announcement bar content — text, phone number, and visibility toggles.
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
        <HeaderSettingsClient settings={settings} />
      </div>
    </div>
  );
}
