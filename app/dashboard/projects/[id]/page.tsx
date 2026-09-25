import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProject } from "../actions";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: p } = await supabase.from("projects").select("*").eq("id", params.id).single();
  if (!p) notFound();
  const input = "w-full rounded-lg border border-theme bg-surface px-3 py-2";
  return <div className="max-w-3xl"><h1 className="mb-6 text-2xl font-semibold">تعديل المشروع</h1>
    <form action={updateProject.bind(null, p.id)} encType="multipart/form-data" className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-1 block text-sm text-muted">الاسم بالعربي</label><input name="name_ar" required defaultValue={p.name_ar} className={input}/></div><div><label className="mb-1 block text-sm text-muted">الاسم بالإنجليزي</label><input name="name_en" defaultValue={p.name_en ?? ""} className={input}/></div></div>
      <div className="grid gap-4 sm:grid-cols-2"><textarea name="description_ar" rows={4} defaultValue={p.description_ar ?? ""} placeholder="الوصف بالعربي" className={input}/><textarea name="description_en" rows={4} defaultValue={p.description_en ?? ""} placeholder="Description" className={input}/></div>
      <div className="grid gap-4 sm:grid-cols-3"><select name="category" defaultValue={p.category} className={input}><option value="video_editing">مونتاج</option><option value="motion_graphics">موشن جرافيك</option><option value="thumbnails">صور مصغرة</option><option value="short_video">فيديو قصير</option><option value="long_video">فيديو طويل</option><option value="other">أخرى</option></select><select name="aspect_ratio" defaultValue={p.aspect_ratio ?? "16:9"} className={input}><option>16:9</option><option>9:16</option><option>1:1</option><option>4:5</option><option>4:3</option></select><input name="software" defaultValue={(p.software ?? []).join(", ")} placeholder="البرامج" className={input}/></div>
      <div className="grid gap-4 sm:grid-cols-2"><input type="file" name="video" accept="video/*" className={input}/><input type="file" name="thumbnail" accept="image/*" className={input}/></div>
      <select name="status" defaultValue={p.status} className={input}><option value="draft">مسودة</option><option value="published">منشور</option></select>
      <button className="w-fit rounded-lg bg-gradient-to-r from-blue to-violet px-6 py-2.5 font-semibold text-white">حفظ التعديلات</button>
    </form></div>;
}
