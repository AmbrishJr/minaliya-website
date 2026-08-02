import prisma from "@/lib/prisma";
import { getDefaultContactSettings } from "@/lib/contact-defaults";
import type { ContactSettingsData } from "@/actions/adminData";

export async function getContactSettings(): Promise<ContactSettingsData> {
  const existing = await prisma.contactSettings.findUnique({
    where: { id: "default" },
  });

  if (!existing) {
    return getDefaultContactSettings();
  }

  return existing.data as ContactSettingsData;
}
