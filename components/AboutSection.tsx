"use client";

import { useLang } from "./Providers";
import { t } from "@/lib/i18n";

export default function AboutSection({ content }: { content: any }) {
  const { lang } = useLang();
  const text = lang === "ar" ? content?.about_text?.ar : content?.about_text?.en;
  const stats = content?.stats ?? {};
  if (!text && !content?.name && !content?.specialization && !content?.photo_url && !stats.experience && !stats.projects) return null;
  const items = [
    [lang === "ar" ? "سنوات الخبرة" : "Years", stats.experience],
    [lang === "ar" ? "المشاريع" : "Projects", stats.projects],
  ].filter((x) => x[1]);
  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-blue">{lang === "ar" ? "تعرف عليّ" : "Get to know me"}</p>
          <h2 className="text-3xl font-semibold md:text-4xl">{t("about_title", lang)}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          {content?.photo_url ? <div className="overflow-hidden rounded-3xl border border-theme bg-surface aspect-square"><img src={content.photo_url} alt={content.name ?? ""} className="h-full w-full object-cover" /></div> : null}
          <div className="rounded-3xl border border-theme bg-surface p-7 md:p-10">
            {content?.name ? <h3 className="text-2xl font-semibold">{content.name}</h3> : null}
            {content?.specialization ? <p className="mt-2 font-medium text-blue">{content.specialization}</p> : null}
            {text ? <p className="mt-5 whitespace-pre-line leading-8 text-muted">{text}</p> : null}
            {items.length ? <div className="mt-7 flex flex-wrap gap-3">{items.map(([label, value]) => <div key={String(label)} className="rounded-xl bg-surface2 px-4 py-3"><b className="block text-xl">{String(value)}</b><span className="text-xs text-muted">{String(label)}</span></div>)}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
