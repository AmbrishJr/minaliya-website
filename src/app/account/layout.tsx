import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description:
    "Manage your Minaliya account — view orders, update profile, and track subscriptions.",
  robots: { index: false, follow: false },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
