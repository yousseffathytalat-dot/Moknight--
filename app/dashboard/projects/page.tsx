import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteProject, toggleStatus, toggleHidden } from "./actions";

export default async function ProjectsPage() {
  const supabase = createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">المشاريع</h1>
        <Link
          href="/dashboard/projects/new"
          className="rounded-lg bg-gradient-to-r from-blue to-violet px-4 py-2 text-sm font-semibold text-white"
        >
          + إضافة مشروع
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-theme bg-surface p-16 text-center text-muted">
          لا توجد مشاريع بعد. ابدأ بإضافة أول مشروع.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-theme">
          <table className="w-full text-sm">
            <thead className="bg-surface2 text-start text-muted">
              <tr>
                <th className="p-3 text-start">الاسم</th>
                <th className="p-3 text-start">التصنيف</th>
                <th className="p-3 text-start">الحالة</th>
                <th className="p-3 text-start">مخفي</th>
                <th className="p-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-t border-theme bg-surface">
                  <td className="p-3">{p.name_ar}</td>
                  <td className="p-3 text-muted">{p.category}</td>
                  <td className="p-3">
                    <Link href={`/dashboard/projects/${p.id}`} className="me-3 text-blue">تعديل</Link>
                    <form
                      action={async () => {
                        "use server";
                        await toggleStatus(p.id, p.status === "published" ? "draft" : "published");
                      }}
                    >
                      <button className="rounded-full border border-theme px-3 py-1 text-xs">
                        {p.status === "published" ? "منشور" : "مسودة"}
                      </button>
                    </form>
                  </td>
                  <td className="p-3">
                    <Link href={`/dashboard/projects/${p.id}`} className="me-3 text-blue">تعديل</Link>
                    <form
                      action={async () => {
                        "use server";
                        await toggleHidden(p.id, !p.is_hidden);
                      }}
                    >
                      <button className="rounded-full border border-theme px-3 py-1 text-xs">
                        {p.is_hidden ? "مخفي" : "ظاهر"}
                      </button>
                    </form>
                  </td>
                  <td className="p-3">
                    <Link href={`/dashboard/projects/${p.id}`} className="me-3 text-blue">تعديل</Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteProject(p.id);
                      }}
                    >
                      <button className="text-xs text-red-400">حذف</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
