"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  ChevronRight,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Benefits", href: "#benefits" },
  { name: "Our Process", href: "#process" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  return (
    <>
      <header
        id="navbar"
        className="sticky top-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(219, 86, 86, 0.98)"
            : "rgba(219, 86, 86, 0.98)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid transparent",
          boxShadow: scrolled ? "var(--shadow-soft)" : "none",
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group shrink-0"
              aria-label="Minaliya Home"
            >
              <Image
                src="/logo.png"
                alt="Minaliya Logo"
                width={160}
                height={54}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium transition-colors rounded-full hover:bg-white/10 text-white/90 hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-full transition-colors hover:bg-white/10 text-white/90 hover:text-white"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <Link
                href="/wishlist"
                className="hidden sm:flex p-2.5 rounded-full transition-colors hover:bg-white/10 text-white/90 hover:text-white"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>
              <Link
                href="/account"
                className="hidden sm:flex p-2.5 rounded-full transition-colors hover:bg-white/10 text-white/90 hover:text-white"
                aria-label="Account"
              >
                <User size={20} />
              </Link>
              <button
                className="relative p-2.5 rounded-full transition-colors hover:bg-white/10 text-white/90 hover:text-white"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                <span
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{ background: "white", color: "#8B1C1C" }}
                >
                  0
                </span>
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2.5 rounded-full transition-colors hover:bg-white/10 ml-1 text-white/90 hover:text-white"
                aria-label="Menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </nav>

        {/* Search Bar */}
        {searchOpen && (
          <div
            className="border-t px-4 py-3"
            style={{
              borderColor: "var(--color-stone-200)",
              background: "var(--color-cream-50)",
            }}
          >
            <div className="max-w-2xl mx-auto relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-stone-400)" }}
              />
              <input
                type="search"
                placeholder="Search for cold pressed oils..."
                className="w-full pl-12 pr-4 py-3 rounded-full border text-sm outline-none focus:ring-2"
                style={{
                  background: "white",
                  borderColor: "var(--color-stone-200)",
                  color: "var(--color-stone-800)",
                }}
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] shadow-2xl flex flex-col"
            style={{ background: "var(--color-cream-50)" }}
          >
            <div
              className="flex items-center justify-between p-5 border-b"
              style={{ borderColor: "var(--color-stone-200)" }}
            >
              <span
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Menu
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full hover:bg-stone-100"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-6 py-3.5 text-base font-medium transition-colors hover:bg-stone-100"
                  style={{ color: "var(--color-stone-700)" }}
                >
                  {link.name}
                  <ChevronRight size={16} style={{ color: "var(--color-stone-400)" }} />
                </Link>
              ))}
            </nav>
            <div
              className="p-5 border-t space-y-3"
              style={{ borderColor: "var(--color-stone-200)" }}
            >
              <Link
                href="/account"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-stone-100 text-sm font-medium"
                style={{ color: "var(--color-stone-700)" }}
              >
                <User size={18} /> My Account
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-stone-100 text-sm font-medium"
                style={{ color: "var(--color-stone-700)" }}
              >
                <Heart size={18} /> Wishlist
              </Link>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent w-full justify-center text-sm"
              >
                <Phone size={16} /> WhatsApp Order
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
