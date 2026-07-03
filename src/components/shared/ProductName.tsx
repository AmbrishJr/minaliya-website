import { type ReactNode } from "react";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p";

interface ProductNameProps {
  children: ReactNode;
  as?: HeadingTag;
  variant?: "detail" | "card" | "compact";
  className?: string;
  splitOnMobile?: boolean;
}

const variantStyles: Record<string, string> = {
  detail: "text-3xl sm:text-4xl font-bold",
  card: "text-sm font-semibold",
  compact: "text-sm font-semibold",
};

const variantColors: Record<string, string> = {
  detail: "var(--color-stone-900)",
  card: "var(--color-stone-800)",
  compact: "var(--color-stone-800)",
};

function splitName(name: string): [string, string, string] {
  const idx = name.indexOf("Cold Pressed ");
  if (idx !== -1) {
    return [name.slice(0, idx).trim(), "Cold Pressed", name.slice(idx + 13).trim()];
  }
  return [name, "", ""];
}

export function ProductName({
  children,
  as: Tag = "span",
  variant = "card",
  className = "",
  splitOnMobile,
}: ProductNameProps) {
  const content = splitOnMobile && typeof children === "string"
    ? (() => {
        const [part1, part2, part3] = splitName(children);
        if (!part2) return <>{children}</>;
        return (
          <>
            <span className="md:hidden">
              <span className="block">{part1}</span>
              <span className="block">{part2}</span>
              <span className="block">{part3}</span>
            </span>
            <span className="hidden md:inline">{children}</span>
          </>
        );
      })()
    : children;

  const lineClamp = splitOnMobile ? "" : variant === "card" ? "line-clamp-2" : "";

  return (
    <Tag
      className={`leading-tight ${variantStyles[variant]} ${lineClamp} ${className}`}
      style={{
        fontFamily: "var(--font-body)",
        color: variantColors[variant],
      }}
    >
      {content}
    </Tag>
  );
}
