"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";

type Theme = "dark" | "light";

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "ar",
  setLang: () => {},
});
const ThemeCtx = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: "dark",
  setTheme: () => {},
});

export const useLang = () => useContext(LangCtx);
export const useTheme = () => useContext(ThemeCtx);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const savedLang = (localStorage.getItem("moknight_lang") as Lang) || "ar";
    const savedTheme = (localStorage.getItem("moknight_theme") as Theme) || "dark";
    setLangState(savedLang);
    setThemeState(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("moknight_lang", l);
  };
  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("moknight_theme", t);
  };

  return (
    <LangCtx.Provider value={{ lang, setLang }}>
      <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>
    </LangCtx.Provider>
  );
}
