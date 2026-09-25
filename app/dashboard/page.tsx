import { createClient } from "@/lib/supabase/server";

export default async function DashboardOverview() {
  const supabase = createClient();
  const { count: total } = await supabase.from("projects").select("*", { count: "exact", head: true });
  const { count: published } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");
  const { count: drafts } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("status", "draft");

  const stats = [
    { label: "إجمالي المشاريع", value: total ?? 0 },
    { label: "منشورة", value: published ?? 0 },
    { label: "مسودات", value: drafts ?? 0 },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">نظرة عامة</h1>
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-theme bg-surface p-6">
            <div className="mb-1 text-3xl font-bold">{s.value}</div>
            <div className="text-sm text-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
