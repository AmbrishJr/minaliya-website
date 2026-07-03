import { type ReactNode } from "react";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p";

interface ProductNameProps {
  children: ReactNode;
  as?: HeadingTag;
  variant?: "detail" | "card" | "compact";
  className?: string;
}

const variantStyles: Record<string, string> = {
  detail: "text-3xl sm:text-4xl font-bold",
  card: "text-sm font-semibold line-clamp-2",
  compact: "text-sm font-semibold",
};

const variantColors: Record<string, string> = {
  detail: "var(--color-stone-900)",
  card: "var(--color-stone-800)",
  compact: "var(--color-stone-800)",
};

export function ProductName({
  children,
  as: Tag = "span",
  variant = "card",
  className = "",
}: ProductNameProps) {
  return (
    <Tag
      className={`leading-tight ${variantStyles[variant]} ${className}`}
      style={{
        fontFamily: "var(--font-body)",
        color: variantColors[variant],
      }}
    >
      {children}
    </Tag>
  );
}
