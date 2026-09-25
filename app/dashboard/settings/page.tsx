import { createClient } from "@/lib/supabase/server";
import { saveDraft, saveContact, addTool, deleteTool, publishChanges, resetToPublished } from "./actions";

const input = "w-full rounded-lg border border-theme bg-surface2 px-3 py-2 outline-none";
export default async function SettingsPage() {
  const supabase = createClient();
  const [{ data }, { data: tools }, { data: socials }] = await Promise.all([
    supabase.from("site_settings").select("draft, published").eq("id", 1).single(),
    supabase.from("software_options").select("id,name").order("sort_order"),
    supabase.from("social_links").select("id,platform,label,value,is_public").order("sort_order"),
  ]);
  const draft = (data?.draft as any) ?? {};
  const socialValue = (p: string) => socials?.find(s => s.platform === p)?.value ?? "";
  return <div className="mx-auto max-w-4xl">
    <h1 className="mb-2 text-2xl font-semibold">إعدادات الموقع</h1>
    <p className="mb-6 text-sm text-muted">عدّل بياناتك من هنا. الحقول الفارغة لا تظهر للزوار، ولا يوجد محتوى تجريبي.</p>

    <form action={saveDraft} encType="multipart/form-data" className="flex flex-col gap-5">
      <fieldset className="rounded-2xl border border-theme bg-surface p-5"><legend className="px-2 font-medium">من أنا</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1 block text-sm text-muted">الاسم</label><input name="name" defaultValue={draft.name} className={input}/></div>
          <div><label className="mb-1 block text-sm text-muted">التخصص</label><input name="specialization" defaultValue={draft.specialization} className={input}/></div>
          <div><label className="mb-1 block text-sm text-muted">سنوات الخبرة</label><input name="experience" defaultValue={draft.stats?.experience} className={input}/></div>
          <div><label className="mb-1 block text-sm text-muted">عدد المشاريع</label><input name="projects" defaultValue={draft.stats?.projects} className={input}/></div>
          <div className="sm:col-span-2"><label className="mb-1 block text-sm text-muted">صورة شخصية / Logo</label><input type="file" name="photo" accept="image/*" className={input}/></div>
        </div>
        <label className="mb-1 mt-4 block text-sm text-muted">الوصف بالعربي</label><textarea name="about_ar" rows={4} defaultValue={draft.about_text?.ar} className={input}/>
        <label className="mb-1 mt-3 block text-sm text-muted">About in English</label><textarea name="about_en" rows={4} defaultValue={draft.about_text?.en} className={input}/>
      </fieldset>

      <fieldset className="rounded-2xl border border-theme bg-surface p-5"><legend className="px-2 font-medium">واجهة الموقع</legend>
        <label className="mb-1 block text-sm text-muted">العنوان الرئيسي</label><input name="hero_title" defaultValue={draft.hero_title} className={input}/>
        <label className="mb-1 mt-3 block text-sm text-muted">الوصف المختصر</label><textarea name="hero_subtitle" rows={3} defaultValue={draft.hero_subtitle} className={input}/>
        <div className="mt-4 grid gap-4 sm:grid-cols-2"><div><label className="mb-1 block text-sm text-muted">رابط فيديو الـHero</label><input name="hero_video_url" defaultValue={draft.hero_video_url} className={input}/></div><div><label className="mb-1 block text-sm text-muted">رابط الصورة الخلفية</label><input name="hero_poster_url" defaultValue={draft.hero_poster_url} className={input}/></div></div>
        <div className="mt-4 flex gap-5 text-sm"><label><input type="checkbox" name="hero_autoplay" defaultChecked={draft.hero_autoplay ?? true}/> تشغيل تلقائي</label><label><input type="checkbox" name="hero_loop" defaultChecked={draft.hero_loop ?? true}/> تكرار</label></div>
      </fieldset>

      <fieldset className="rounded-2xl border border-theme bg-surface p-5"><legend className="px-2 font-medium">تواصل معي</legend>
        <label className="mb-1 block text-sm text-muted">النص بالعربي</label><textarea name="contact_ar" rows={3} defaultValue={draft.contact_text?.ar} className={input}/>
        <label className="mb-1 mt-3 block text-sm text-muted">Text in English</label><textarea name="contact_en" rows={3} defaultValue={draft.contact_text?.en} className={input}/>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[["phone","رقم الهاتف"],["email","البريد الإلكتروني"],["youtube","رابط YouTube"],["instagram","رابط Instagram"]].map(([name,label]) => <div key={name}><label className="mb-1 block text-sm text-muted">{label}</label><input name={name} defaultValue={socialValue(name)} className={input}/></div>)}
        </div>
        <button type="submit" className="mt-5 rounded-lg border border-theme px-5 py-2.5 text-sm font-semibold">حفظ البيانات كمسودة</button>
      </fieldset>
    </form>

    <fieldset className="mt-5 rounded-2xl border border-theme bg-surface p-5"><legend className="px-2 font-medium">البرامج</legend>
      <div className="mb-4 flex flex-wrap gap-2">{(tools ?? []).map(tool => <div key={tool.id} className="flex items-center gap-2 rounded-full border border-theme bg-surface2 px-3 py-2 text-sm"><span>{tool.name}</span><form action={deleteTool.bind(null, tool.id)}><button className="text-red-400">×</button></form></div>)}</div>
      <form action={addTool} className="flex gap-2"><input name="name" placeholder="مثال: DaVinci Resolve" className={input}/><button className="shrink-0 rounded-lg bg-gradient-to-r from-blue to-violet px-4 py-2 font-semibold text-white">إضافة</button></form>
    </fieldset>

    <div className="mt-6 flex flex-wrap gap-3"><form action={publishChanges}><button className="rounded-lg bg-gradient-to-r from-blue to-violet px-5 py-2.5 text-sm font-semibold text-white">نشر التغييرات</button></form><form action={resetToPublished}><button className="rounded-lg border border-theme px-5 py-2.5 text-sm text-muted">استعادة آخر نسخة منشورة</button></form></div>
  </div>;
}
