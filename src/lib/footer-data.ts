import prisma from "@/lib/prisma";
import { getDefaultFooterSettings } from "@/lib/footer-defaults";
import type { FooterSettingsData } from "@/actions/adminData";

export async function getFooterSettings(): Promise<FooterSettingsData> {
  const existing = await prisma.footerSettings.findUnique({
    where: { id: "default" },
  });

  if (!existing) {
    return getDefaultFooterSettings();
  }

  return existing.data as FooterSettingsData;
}
