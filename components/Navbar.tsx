"use client";

import { useState } from "react";
import { useLang, useTheme } from "./Providers";
import { t } from "@/lib/i18n";

export default function Navbar() {
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/", key: "nav_home" as const },
    { href: "/portfolio", key: "nav_portfolio" as const },
    { href: "/#about", key: "nav_about" as const },
    { href: "/#contact", key: "nav_contact" as const },
  ];
  return <nav className="fixed inset-x-0 top-0 z-50 border-b border-theme backdrop-blur-md" style={{ paddingTop: "env(safe-area-inset-top, 0px)", background: "rgb(var(--bg) / .78)" }}>
    <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 md:px-6">
      <a href="/" className="font-display text-xl font-bold">MoKnight</a>
      <ul className="hidden gap-7 text-sm text-muted md:flex">{links.map(l => <li key={l.key}><a href={l.href} className="transition hover:text-text">{t(l.key, lang)}</a></li>)}</ul>
      <div className="flex items-center gap-2">
        <button className="rounded-full border border-theme bg-surface px-3 py-2 text-sm" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>{lang === "ar" ? "EN" : "AR"}</button>
        <button className="rounded-full border border-theme bg-surface px-3 py-2 text-sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="toggle theme">{theme === "dark" ? "☾" : "☀"}</button>
        <button className="rounded-lg border border-theme bg-surface px-2 py-2 md:hidden" onClick={() => setOpen(!open)} aria-label="menu">☰</button>
      </div>
    </div>
    {open && <div className="flex flex-col border-t border-theme bg-bg px-5 md:hidden">{links.map(l => <a key={l.key} href={l.href} onClick={() => setOpen(false)} className="border-t border-theme py-3">{t(l.key, lang)}</a>)}</div>}
  </nav>;
}
