import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WishlistClient from "./WishlistClient";

export const metadata: Metadata = {
  title: "Your Wishlist",
  description: "View and manage your saved Minaliya products.",
  alternates: { canonical: "/wishlist" },
};

export default function WishlistPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main id="main-content" className="flex-1 flex flex-col">
        <WishlistClient />
      </main>

      <Footer />
    </>
  );
}
