import prisma from "@/lib/prisma";
import { getDefaultHeaderSettings } from "@/lib/header-defaults";
import type { HeaderSettingsData } from "@/actions/adminData";

export async function getHeaderSettings(): Promise<HeaderSettingsData> {
  const existing = await prisma.headerSettings.findUnique({
    where: { id: "default" },
  });

  if (!existing) {
    return getDefaultHeaderSettings();
  }

  return existing.data as HeaderSettingsData;
}
