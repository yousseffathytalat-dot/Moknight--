"use client";

import { useRef, useState } from "react";
import { useLang } from "./Providers";
import { t } from "@/lib/i18n";

export default function Hero({
  videoUrl,
  posterUrl,
  title,
  subtitle,
  autoplay = true,
  loop = true,
}: {
  videoUrl?: string | null;
  posterUrl?: string | null;
  title?: string | null;
  subtitle?: string | null;
  autoplay?: boolean;
  loop?: boolean;
}) {
  const { lang } = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(autoplay);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  return (
    <section id="home" className="relative overflow-hidden pb-28 pt-40 text-center">
      <div
        className="pointer-events-none absolute -top-44 -start-28 h-[520px] w-[520px] rounded-full motion-safe:animate-[float1_14s_ease-in-out_infinite]"
        style={{ background: "rgba(62,107,255,.30)", filter: "blur(70px)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-52 -end-36 h-[460px] w-[460px] rounded-full motion-safe:animate-[float2_16s_ease-in-out_infinite]"
        style={{ background: "rgba(139,92,246,.26)", filter: "blur(70px)" }}
      />
      <div className="relative mx-auto max-w-3xl px-6">
        {title ? <h1 className="font-display text-5xl font-bold md:text-7xl">
          <span className="bg-gradient-to-r from-text via-blue to-violet bg-clip-text text-transparent">{title}</span>
        </h1> : null}
        {subtitle ? <p className="mx-auto mt-5 max-w-lg leading-8 text-muted">{subtitle}</p> : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
          <a
            href="#portfolio"
            className="rounded-xl bg-gradient-to-r from-blue to-violet px-6 py-3.5 font-semibold text-white"
          >
            {t("cta_work", lang)}
          </a>
          <a href="#contact" className="rounded-xl border border-theme px-6 py-3.5 font-semibold">
            {t("cta_contact", lang)}
          </a>
        </div>

        <div className="relative mx-auto mt-14 aspect-video max-w-3xl overflow-hidden rounded-2xl border border-theme bg-surface">
          {videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={videoUrl}
                poster={posterUrl ?? undefined}
                className="h-full w-full object-contain"
                autoPlay={autoplay}
                muted
                loop={loop}
                playsInline
                preload="metadata"
              />
              <div className="absolute bottom-3 flex w-full justify-center gap-2">
                <button
                  onClick={togglePlay}
                  className="rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur"
                >
                  {playing ? "⏸" : "▶"}
                </button>
                <button
                  onClick={toggleMute}
                  className="rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur"
                >
                  {muted ? "🔇" : "🔊"}
                </button>
              </div>
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-5 text-muted">
              <span className="text-3xl">▶</span>
              <span className="text-sm">
                {lang === "ar"
                  ? "سيتم عرض فيديو تعريفي هنا بعد إضافته من لوحة التحكم"
                  : "A showreel will appear here once added from the dashboard"}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
