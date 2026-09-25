"use client";

import { useLang } from "./Providers";

export default function ToolsSection({ tools }: { tools: { id: string; name: string }[] }) {
  const { lang } = useLang();
  if (!tools.length) return null;
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold text-violet">{lang === "ar" ? "أدواتي" : "My Tools"}</p>
          <h2 className="text-3xl font-semibold md:text-4xl">{lang === "ar" ? "البرامج التي أستخدمها" : "Software I Use"}</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {tools.map((tool) => <div key={tool.id} className="rounded-2xl border border-theme bg-surface px-5 py-4 font-medium transition hover:-translate-y-1 hover:bg-surface2">{tool.name}</div>)}
        </div>
      </div>
    </section>
  );
}
