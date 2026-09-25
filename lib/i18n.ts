export type Lang = "ar" | "en";

export const dict = {
  nav_home: { ar: "الرئيسية", en: "Home" },
  nav_portfolio: { ar: "الأعمال", en: "Portfolio" },
  nav_about: { ar: "من أنا", en: "About" },
  nav_contact: { ar: "تواصل", en: "Contact" },
  role: { ar: "مونتير وصانع موشن جرافيك", en: "Video Editor & Motion Designer" },
  cta_work: { ar: "مشاهدة أعمالي", en: "View My Work" },
  cta_contact: { ar: "تواصل معي", en: "Get In Touch" },
  pf_title: { ar: "الأعمال", en: "Portfolio" },
  empty_title: { ar: "لا توجد أعمال منشورة بعد", en: "No projects published yet" },
  empty_sub: {
    ar: "سيتم عرض المشاريع هنا فور إضافتها من لوحة التحكم.",
    en: "Projects will appear here once added from the dashboard.",
  },
  about_title: { ar: "من أنا", en: "About" },
  contact_title: { ar: "تواصل معي", en: "Get In Touch" },
  dashboard_overview: { ar: "نظرة عامة", en: "Overview" },
  dashboard_projects: { ar: "المشاريع", en: "Projects" },
  dashboard_add_project: { ar: "إضافة مشروع", en: "Add Project" },
  dashboard_settings: { ar: "الإعدادات", en: "Site Settings" },
  publish: { ar: "نشر التغييرات", en: "Publish Changes" },
  save_draft: { ar: "حفظ كمسودة", en: "Save as Draft" },
} as const;

export function t(key: keyof typeof dict, lang: Lang): string {
  return dict[key][lang];
}
