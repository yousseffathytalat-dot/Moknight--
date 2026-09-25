"use client";

import { useLang } from "./Providers";
import ProjectModal from "./ProjectModal";
import type { Project } from "./PortfolioGrid";
import { useState } from "react";

export default function LatestWork({ project }: { project: Project | null }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  if (!project) return null;
  const name = lang === "ar" ? project.name_ar : project.name_en ?? project.name_ar;
  return (
    <section className="py-24" id="latest-work">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-blue">{lang === "ar" ? "أحدث مشروع" : "Latest Project"}</p>
            <h2 className="text-3xl font-semibold md:text-4xl">{lang === "ar" ? "آخر أعمالي" : "Latest Work"}</h2>
          </div>
          <a href="/portfolio" className="rounded-xl border border-theme px-4 py-2 text-sm font-semibold hover:bg-surface2">
            {lang === "ar" ? "كل الأعمال" : "All Work"}
          </a>
        </div>
        <button onClick={() => setOpen(true)} className="group w-full overflow-hidden rounded-3xl border border-theme bg-surface text-start shadow-xl transition hover:-translate-y-1">
          <div className="aspect-video overflow-hidden bg-surface2">
            {project.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.thumbnail_url} alt={name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
            ) : project.video_url ? (
              <video src={project.video_url} className="h-full w-full object-contain" muted playsInline preload="metadata" />
            ) : null}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold">{name}</h3>
            {project.description_ar || project.description_en ? (
              <p className="mt-2 line-clamp-2 text-muted">{lang === "ar" ? project.description_ar : project.description_en ?? project.description_ar}</p>
            ) : null}
          </div>
        </button>
      </div>
      {open && <ProjectModal project={project} onClose={() => setOpen(false)} />}
    </section>
  );
}
