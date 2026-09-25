"use client";

import { useEffect, useRef } from "react";
import type { Project } from "./PortfolioGrid";
import { useLang } from "./Providers";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const { lang } = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollY = useRef(0);

  useEffect(() => {
    scrollY.current = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY.current}px`;
    document.body.style.width = "100%";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY.current);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const name = lang === "ar" ? project.name_ar : project.name_en ?? project.name_ar;
  const description = lang === "ar" ? project.description_ar : project.description_en;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-theme bg-surface">
        <div className="flex items-center justify-between border-b border-theme px-5 py-3">
          <h3 className="font-medium">{name}</h3>
          <button onClick={onClose} aria-label="close" className="text-xl text-muted hover:text-text">
            ×
          </button>
        </div>
        <div className="aspect-video w-full bg-black">
          {project.video_url ? (
            <video
              ref={videoRef}
              src={project.video_url}
              poster={project.thumbnail_url ?? undefined}
              className="h-full w-full object-contain"
              controls
              playsInline
              autoPlay
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">
              {lang === "ar" ? "لا يوجد فيديو" : "No video"}
            </div>
          )}
        </div>
        {description && <p className="p-5 leading-7 text-muted">{description}</p>}
      </div>
    </div>
  );
}
