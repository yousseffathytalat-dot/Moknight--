"use client";

import { useMemo, useState } from "react";
import { useLang } from "./Providers";
import { t } from "@/lib/i18n";
import ProjectModal from "./ProjectModal";

export type Project = {
  id: string;
  name_ar: string;
  name_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  category: string;
  aspect_ratio: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
};

export type Category = { key: string; label_ar: string; label_en: string };

export default function PortfolioGrid({
  projects,
  categories,
}: {
  projects: Project[];
  categories: Category[];
}) {
  const { lang } = useLang();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const [openProject, setOpenProject] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const name = lang === "ar" ? p.name_ar : p.name_en ?? p.name_ar;
      const matchesCat = activeCat === "all" || p.category === activeCat;
      const matchesQuery = name.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [projects, query, activeCat, lang]);

  return (
    <section id="portfolio" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-11 max-w-lg text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">{t("pf_title", lang)}</h2>
        </div>

        <div className="mx-auto mb-9 max-w-md rounded-xl border border-theme bg-surface px-4 py-2.5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "ar" ? "ابحث في الأعمال..." : "Search projects..."}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>

        <div className="mb-9 flex flex-wrap justify-center gap-2.5">
          <button
            onClick={() => setActiveCat("all")}
            className={`rounded-full border px-4 py-2 text-sm ${
              activeCat === "all" ? "border-blue text-text" : "border-theme text-muted"
            }`}
          >
            {lang === "ar" ? "الكل" : "All"}
          </button>
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCat(c.key)}
              className={`rounded-full border px-4 py-2 text-sm ${
                activeCat === c.key ? "border-blue text-text" : "border-theme text-muted"
              }`}
            >
              {lang === "ar" ? c.label_ar : c.label_en}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-theme bg-surface p-20 text-center">
            <div className="mb-4 text-4xl opacity-50">▦</div>
            <h3 className="mb-2 text-xl font-semibold">{t("empty_title", lang)}</h3>
            <p className="mx-auto max-w-sm text-muted">{t("empty_sub", lang)}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setOpenProject(p)}
                className="group overflow-hidden rounded-2xl border border-theme bg-surface text-start"
              >
                <div className="aspect-video w-full overflow-hidden bg-surface2">
                  {p.thumbnail_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.thumbnail_url}
                      alt={lang === "ar" ? p.name_ar : p.name_en ?? p.name_ar}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-medium">{lang === "ar" ? p.name_ar : p.name_en ?? p.name_ar}</h4>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {openProject && <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />}
    </section>
  );
}
