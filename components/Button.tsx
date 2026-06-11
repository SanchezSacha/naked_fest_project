"use client";

import Link from "next/link";
import { type ReactNode } from "react";

type ButtonColor = "lime" | "pink" | "cyan" | "violet" | "white";
type ButtonVariant = "solid" | "solid-dark" | "outline" | "outline-inverse" | "ghost" | "subtle" | "filled";
type ButtonSize = "sm" | "md" | "lg";

type BaseProps = {
  children: ReactNode;
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  title?: string;
};

type ButtonProps = BaseProps &
  (
    | { as?: "button"; onClick?: () => void; type?: "button" | "submit" }
    | { as: "link"; href: string; onClick?: () => void }
  );

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-[10px] tracking-[0.15em]",
  md: "px-6 py-3 text-xs tracking-[0.25em]",
  lg: "px-10 py-4 text-xs tracking-[0.3em]",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg font-condensed font-bold uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

/* ── Mappings statiques pour Tailwind v4 ── */
const solidMap: Record<ButtonColor, string> = {
  lime:   "bg-lime text-dark border border-lime hover:bg-dark hover:text-lime hover:shadow-[0_0_18px_rgba(200,255,0,0.25)]",
  pink:   "bg-pink text-dark border border-pink hover:bg-dark hover:text-pink hover:shadow-[0_0_18px_rgba(255,45,155,0.25)]",
  cyan:   "bg-cyan text-dark border border-cyan hover:bg-dark hover:text-cyan hover:shadow-[0_0_18px_rgba(0,245,255,0.25)]",
  violet: "bg-violet text-dark border border-violet hover:bg-dark hover:text-violet hover:shadow-[0_0_18px_rgba(191,95,255,0.25)]",
  white:  "bg-white text-dark border border-white hover:bg-dark hover:text-white hover:shadow-[0_0_18px_rgba(255,255,255,0.12)]",
};

const solidDarkMap: Record<ButtonColor, string> = {
  lime:   "bg-lime text-dark border border-lime hover:bg-dark hover:text-lime hover:shadow-[0_0_18px_rgba(200,255,0,0.25)]",
  pink:   "bg-pink text-dark border border-pink hover:bg-dark hover:text-pink hover:shadow-[0_0_18px_rgba(255,45,155,0.25)]",
  cyan:   "bg-cyan text-dark border border-cyan hover:bg-dark hover:text-cyan hover:shadow-[0_0_18px_rgba(0,245,255,0.25)]",
  violet: "bg-violet text-dark border border-violet hover:bg-dark hover:text-violet hover:shadow-[0_0_18px_rgba(191,95,255,0.25)]",
  white:  "bg-white text-dark border border-white hover:bg-dark hover:text-white hover:shadow-[0_0_18px_rgba(255,255,255,0.12)]",
};

const outlineMap: Record<ButtonColor, string> = {
  lime:   "bg-transparent text-lime border border-lime hover:bg-lime/10",
  pink:   "bg-transparent text-pink border border-pink hover:bg-pink/10",
  cyan:   "bg-transparent text-cyan border border-cyan hover:bg-cyan/10",
  violet: "bg-transparent text-violet border border-violet hover:bg-violet/10",
  white:  "bg-transparent text-white border border-white/30 hover:border-white hover:text-white",
};

const outlineInverseMap: Record<ButtonColor, string> = {
  lime:   "bg-transparent text-lime border border-lime hover:bg-lime/20",
  pink:   "bg-transparent text-pink border border-pink hover:bg-pink/20",
  cyan:   "bg-transparent text-cyan border border-cyan hover:bg-cyan/20",
  violet: "bg-transparent text-violet border border-violet hover:bg-violet/20",
  white:  "bg-transparent text-white border border-white/30 hover:bg-white/20 hover:border-white",
};

const ghostMap: Record<ButtonColor, string> = {
  lime:   "bg-transparent text-lime hover:bg-lime/10 border border-transparent",
  pink:   "bg-transparent text-pink hover:bg-pink/10 border border-transparent",
  cyan:   "bg-transparent text-cyan hover:bg-cyan/10 border border-transparent",
  violet: "bg-transparent text-violet hover:bg-violet/10 border border-transparent",
  white:  "bg-transparent text-white/70 hover:text-white hover:bg-white/5 border border-transparent",
};

const subtleMap: Record<ButtonColor, string> = {
  lime:   "bg-lime/10 text-lime border border-lime hover:bg-lime/20",
  pink:   "bg-pink/10 text-pink border border-pink hover:bg-pink/20",
  cyan:   "bg-cyan/10 text-cyan border border-cyan hover:bg-cyan/20",
  violet: "bg-violet/10 text-violet border border-violet hover:bg-violet/20",
  white:  "bg-white/[0.03] text-white border border-white/20 hover:border-white/40 hover:bg-white/[0.06]",
};

const filledMap: Record<ButtonColor, string> = {
  lime:   "bg-lime text-dark border border-lime hover:bg-dark hover:text-white hover:shadow-[0_0_18px_rgba(200,255,0,0.25)]",
  pink:   "bg-pink text-dark border border-pink hover:bg-dark hover:text-white hover:shadow-[0_0_18px_rgba(255,45,155,0.25)]",
  cyan:   "bg-cyan text-dark border border-cyan hover:bg-dark hover:text-white hover:shadow-[0_0_18px_rgba(0,245,255,0.25)]",
  violet: "bg-violet text-dark border border-violet hover:bg-dark hover:text-white hover:shadow-[0_0_18px_rgba(191,95,255,0.25)]",
  white:  "bg-white text-dark border border-white hover:bg-dark hover:text-white hover:shadow-[0_0_18px_rgba(255,255,255,0.12)]",
};

function variantClasses(variant: ButtonVariant, color: ButtonColor): string {
  switch (variant) {
    case "solid":         return solidMap[color];
    case "solid-dark":    return solidDarkMap[color];
    case "outline":       return outlineMap[color];
    case "outline-inverse": return outlineInverseMap[color];
    case "ghost":         return ghostMap[color];
    case "subtle":        return subtleMap[color];
    case "filled":        return filledMap[color];
    default:              return "";
  }
}

export default function Button({
  children,
  color = "lime",
  variant = "solid",
  size = "md",
  className = "",
  disabled,
  title,
  ...rest
}: ButtonProps) {
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses(variant, color)} ${className}`;

  if ("as" in rest && rest.as === "link") {
    return (
      <Link href={rest.href} className={classes} title={title} onClick={rest.onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={(rest as { type?: "button" | "submit" }).type ?? "button"}
      onClick={(rest as { onClick?: () => void }).onClick}
      disabled={disabled}
      className={classes}
      title={title}
    >
      {children}
    </button>
  );
}
