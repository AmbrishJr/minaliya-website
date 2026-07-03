"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from "react";
import { useAuth } from "./AuthContext";

export interface CartItem {
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number, openCart?: boolean) => void;
  removeItem: (slug: string, size: string) => void;
  updateQuantity: (slug: string, size: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = "minaliya-cart-guest";

/** Build a user-specific localStorage key */
function getUserCartKey(mobile: string): string {
  return `minaliya-cart-${mobile}`;
}

/** Load cart items from localStorage for a specific key */
function loadCartFromKey(key: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Save cart items to localStorage under a specific key */
function saveCartToKey(key: string, items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => { if (typeof window === "undefined") return []; return loadCartFromKey(GUEST_CART_KEY); });
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Track the active user mobile to detect login/logout transitions
  const prevUserMobileRef = useRef<string | null>(null);

  // Derive the active storage key based on user session
  const activeKeyRef = useRef<string>(GUEST_CART_KEY);

  // 1. Initial Load: load the guest cart on mount (before we know who the user is)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // 2. React to Session Transitions (Login / Logout / Switch User)
  useEffect(() => {
    if (!mounted) return;

    const currentMobile = user?.mobile || null;
    const prevMobile = prevUserMobileRef.current;

    // Only act on actual transitions
    if (currentMobile === prevMobile) return;

    if (currentMobile) {
      // ─── LOGIN ───
      // 1. Snapshot current guest cart before we switch
      const guestItems = prevMobile === null ? items : [];

      // 2. Determine the user's key and load their personal cart from DB
      const userKey = getUserCartKey(currentMobile);
      activeKeyRef.current = userKey;
      const dbItems: CartItem[] = user?.cart || [];

      // 3. Merge: DB cart is the base, guest items get added on top
      const merged: CartItem[] = [...dbItems];
      for (const guestItem of guestItems) {
        const idx = merged.findIndex(
          (i) => i.slug === guestItem.slug && i.size === guestItem.size
        );
        if (idx > -1) {
          merged[idx] = { ...merged[idx], quantity: Math.max(merged[idx].quantity, guestItem.quantity) };
        } else {
          merged.push(guestItem);
        }
      }

      // 4. Save merged cart to user's personal key and sync to DB
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(merged);
      saveCartToKey(userKey, merged);
      updateUser({ cart: merged });

      // 5. Clear guest cart so the next user doesn't inherit it
      saveCartToKey(GUEST_CART_KEY, []);

    } else {
      // ─── LOGOUT ───
      // Save the current user's cart to their personal key before switching
      if (prevMobile) {
        const prevUserKey = getUserCartKey(prevMobile);
        saveCartToKey(prevUserKey, items);
      }

      // Switch to guest cart
      activeKeyRef.current = GUEST_CART_KEY;
      const guestItems = loadCartFromKey(GUEST_CART_KEY);
      setItems(guestItems);
    }

    prevUserMobileRef.current = currentMobile;
  }, [user, mounted]);

  // 3. Persist cart to the active localStorage key on every mutation
  useEffect(() => {
    if (mounted) {
      saveCartToKey(activeKeyRef.current, items);
    }
  }, [items, mounted]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Centralized mutation helper: updates state, localStorage, and syncs to DB
  const updateCartStateAndDb = useCallback((updater: (prev: CartItem[]) => CartItem[]) => {
    let nextItems: CartItem[] = [];
    setItems((prev) => {
      nextItems = updater(prev);
      saveCartToKey(activeKeyRef.current, nextItems);
      return nextItems;
    });
    // Sync to DB outside the state updater to avoid "setState during render" warnings
    // Use setTimeout(0) to defer until after the current render cycle completes
    if (user) {
      setTimeout(() => updateUser({ cart: nextItems }), 0);
    }
  }, [user, updateUser]);

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity">, quantity = 1, openCartDrawer = true) => {
      updateCartStateAndDb((prev) => {
        const existing = prev.find(
          (i) => i.slug === newItem.slug && i.size === newItem.size
        );
        if (existing) {
          return prev.map((i) =>
            i.slug === newItem.slug && i.size === newItem.size
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { ...newItem, quantity }];
      });
      if (openCartDrawer) setIsOpen(true);
    },
    [updateCartStateAndDb]
  );

  const removeItem = useCallback((slug: string, size: string) => {
    updateCartStateAndDb((prev) => prev.filter((i) => !(i.slug === slug && i.size === size)));
  }, [updateCartStateAndDb]);

  const updateQuantity = useCallback(
    (slug: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(slug, size);
        return;
      }
      updateCartStateAndDb((prev) =>
        prev.map((i) =>
          i.slug === slug && i.size === size ? { ...i, quantity } : i
        )
      );
    },
    [removeItem, updateCartStateAndDb]
  );

  const clearCart = useCallback(() => {
    updateCartStateAndDb(() => []);
  }, [updateCartStateAndDb]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((o) => !o), []);

  const totalItems = Array.isArray(items) ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;
  const totalPrice = Array.isArray(items) ? items.reduce((sum, i) => sum + i.price * i.quantity, 0) : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
