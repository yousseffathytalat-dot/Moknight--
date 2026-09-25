"use client";

import { useLang } from "./Providers";

export default function Footer() {
  const { lang } = useLang();
  return (
    <footer className="border-t border-theme py-9 text-center text-sm text-muted">
      <div className="mx-auto max-w-6xl px-6">
        <div>© {new Date().getFullYear()} MoKnight. {lang === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}</div>
      </div>
    </footer>
  );
}
