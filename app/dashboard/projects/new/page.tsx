import { createProject } from "../actions";

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">إضافة مشروع</h1>
      <form action={createProject} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-muted">اسم المشروع (عربي)</label>
            <input name="name_ar" required className="w-full rounded-lg border border-theme bg-surface px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Project name (English)</label>
            <input name="name_en" className="w-full rounded-lg border border-theme bg-surface px-3 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-muted">الوصف (عربي)</label>
            <textarea name="description_ar" rows={3} className="w-full rounded-lg border border-theme bg-surface px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Description (English)</label>
            <textarea name="description_en" rows={3} className="w-full rounded-lg border border-theme bg-surface px-3 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm text-muted">التصنيف</label>
            <select name="category" className="w-full rounded-lg border border-theme bg-surface px-3 py-2">
              <option value="video_editing">مونتاج</option>
              <option value="motion_graphics">موشن جرافيك</option>
              <option value="thumbnails">صور مصغرة</option>
              <option value="short_video">فيديو قصير</option>
              <option value="long_video">فيديو طويل</option>
              <option value="other">أخرى</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">نسبة العرض</label>
            <select name="aspect_ratio" className="w-full rounded-lg border border-theme bg-surface px-3 py-2">
              <option>16:9</option>
              <option>9:16</option>
              <option>1:1</option>
              <option>4:5</option>
              <option>4:3</option>
              <option>Custom</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">البرامج (مفصولة بفواصل)</label>
            <input name="software" placeholder="After Effects, Premiere Pro" className="w-full rounded-lg border border-theme bg-surface px-3 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-muted">ملف الفيديو</label>
            <input type="file" name="video" accept="video/*" className="w-full rounded-lg border border-theme bg-surface px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">صورة مصغرة</label>
            <input type="file" name="thumbnail" accept="image/*" className="w-full rounded-lg border border-theme bg-surface px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">الحالة</label>
          <select name="status" className="w-full rounded-lg border border-theme bg-surface px-3 py-2">
            <option value="draft">مسودة</option>
            <option value="published">منشور</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-2 w-fit rounded-lg bg-gradient-to-r from-blue to-violet px-6 py-2.5 font-semibold text-white"
        >
          حفظ المشروع
        </button>
      </form>
    </div>
  );
}
