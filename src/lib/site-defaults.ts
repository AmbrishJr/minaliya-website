import type { SiteSettingsData } from "@/actions/adminData";

export function getDefaultSiteSettings(): SiteSettingsData {
  return {
    storeMode: "LIVE",
  };
}
