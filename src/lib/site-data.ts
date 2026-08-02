import prisma from "@/lib/prisma";
import { getDefaultSiteSettings } from "@/lib/site-defaults";
import type { SiteSettingsData } from "@/actions/adminData";

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const existing = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  if (!existing) {
    return getDefaultSiteSettings();
  }

  return existing.data as SiteSettingsData;
}
