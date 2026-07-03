import type { HeaderSettingsData } from "@/actions/adminData";

export function getDefaultHeaderSettings(): HeaderSettingsData {
  return {
    announcement1: {
      text: "Free Shipping on Orders Above \u20B9499",
      icon: "truck",
      enabled: true,
    },
    announcement2: {
      text: "Free Shipping in TN, KL, KA, TG, AP",
      icon: "credit-card",
      enabled: true,
    },
    announcement3: {
      label: "WhatsApp Order:",
      phone: "+91 98765 43210",
      enabled: true,
    },
    announcement4: {
      text: "100% Pure Wooden Cold Pressed Oils",
      icon: "none",
      enabled: true,
    },
    extraAnnouncements: [],
  };
}
