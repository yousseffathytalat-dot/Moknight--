"use client";

import { useLang } from "./Providers";
import { t } from "@/lib/i18n";

type SocialLink = { id: string; platform: string; label: string | null; value: string };
const hrefFor = (platform: string, value: string) => platform === "email" ? `mailto:${value}` : platform === "phone" ? `tel:${value.replace(/\s+/g, "")}` : value;

export default function ContactSection({ content, socialLinks }: { content: any; socialLinks: SocialLink[] }) {
  const { lang } = useLang();
  const text = lang === "ar" ? content?.contact_text?.ar : content?.contact_text?.en;
  if (!text && !socialLinks.length) return null;
  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl border border-theme bg-gradient-to-br from-surface to-surface2 p-7 md:p-10">
          <h2 className="mb-3 text-3xl font-semibold md:text-4xl">{t("contact_title", lang)}</h2>
          {text ? <p className="max-w-2xl whitespace-pre-line leading-8 text-muted">{text}</p> : null}
          {socialLinks.length ? <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{socialLinks.map((s) => <a key={s.id} href={hrefFor(s.platform, s.value)} target={s.platform === "phone" || s.platform === "email" ? undefined : "_blank"} rel="noreferrer" className="rounded-2xl border border-theme bg-bg/40 px-4 py-4 transition hover:-translate-y-1 hover:bg-bg/70"><span className="block text-xs text-muted">{s.label ?? s.platform}</span><span className="mt-1 block truncate font-medium">{s.value}</span></a>)}</div> : null}
        </div>
      </div>
    </section>
  );
}
