import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function signOut() {
  "use server";
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg" dir="rtl">
      <aside className="w-60 shrink-0 border-e border-theme bg-surface p-5">
        <div className="mb-8 font-display text-lg font-bold">MoKnight <span className="text-xs text-muted">لوحة التحكم</span></div>
        <nav className="flex flex-col gap-1 text-sm">
          <Link href="/dashboard" className="rounded-lg px-3 py-2.5 hover:bg-surface2">نظرة عامة</Link>
          <Link href="/dashboard/projects" className="rounded-lg px-3 py-2.5 hover:bg-surface2">المشاريع</Link>
          <Link href="/dashboard/projects/new" className="rounded-lg px-3 py-2.5 hover:bg-surface2">إضافة مشروع</Link>
          <Link href="/dashboard/settings" className="rounded-lg px-3 py-2.5 hover:bg-surface2">إعدادات الموقع</Link>
          <Link href="/" className="rounded-lg px-3 py-2.5 hover:bg-surface2">↩ العودة للموقع</Link>
        </nav>
        <form action={signOut} className="mt-8">
          <button className="w-full rounded-lg border border-theme px-3 py-2.5 text-sm text-muted">
            تسجيل الخروج
          </button>
        </form>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
