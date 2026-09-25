"use server";

import { createClient, isOwnerSession } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function assertOwner() { if (!(await isOwnerSession())) throw new Error("Not authorized"); }

export async function saveDraft(formData: FormData) {
  await assertOwner();
  const supabase = createClient();
  const current = await supabase.from("site_settings").select("draft").eq("id", 1).single();
  const old = (current.data?.draft as any) ?? {};
  const photo = formData.get("photo") as File | null;
  let photo_url = old.photo_url ?? "";
  if (photo && photo.size > 0) {
    const path = `profile-${crypto.randomUUID()}-${photo.name}`;
    const { error } = await supabase.storage.from("thumbnails").upload(path, photo, { upsert: true });
    if (error) throw error;
    const oldMarker = "/storage/v1/object/public/thumbnails/";
    const oldIdx = (old.photo_url ?? "").indexOf(oldMarker);
    if (oldIdx !== -1) {
      const oldPath = old.photo_url.slice(oldIdx + oldMarker.length);
      await supabase.storage.from("thumbnails").remove([oldPath]);
    }
    photo_url = supabase.storage.from("thumbnails").getPublicUrl(path).data.publicUrl;
  }
  const draft = {
    ...old,
    name: String(formData.get("name") ?? "").trim(),
    specialization: String(formData.get("specialization") ?? "").trim(),
    photo_url,
    about_text: { ar: String(formData.get("about_ar") ?? ""), en: String(formData.get("about_en") ?? "") },
    contact_text: { ar: String(formData.get("contact_ar") ?? ""), en: String(formData.get("contact_en") ?? "") },
    stats: { experience: String(formData.get("experience") ?? "").trim(), projects: String(formData.get("projects") ?? "").trim() },
    hero_title: String(formData.get("hero_title") ?? "").trim(),
    hero_subtitle: String(formData.get("hero_subtitle") ?? "").trim(),
    hero_video_url: String(formData.get("hero_video_url") ?? "").trim(),
    hero_poster_url: String(formData.get("hero_poster_url") ?? "").trim(),
    hero_autoplay: formData.get("hero_autoplay") === "on",
    hero_loop: formData.get("hero_loop") === "on",
  };
  const { error } = await supabase.from("site_settings").update({ draft, updated_at: new Date().toISOString() }).eq("id", 1);
  if (error) throw error;
  const socials = [
    ["phone", "رقم الهاتف", String(formData.get("phone") ?? "").trim(), 1],
    ["email", "البريد الإلكتروني", String(formData.get("email") ?? "").trim(), 2],
    ["youtube", "YouTube", String(formData.get("youtube") ?? "").trim(), 3],
    ["instagram", "Instagram", String(formData.get("instagram") ?? "").trim(), 4],
  ];
  for (const [platform, label, value, sort_order] of socials) {
    const existing = await supabase.from("social_links").select("id").eq("platform", platform).maybeSingle();
    if (existing.data?.id) await supabase.from("social_links").update({ label, value, is_public: Boolean(value), sort_order }).eq("id", existing.data.id);
    else if (value) await supabase.from("social_links").insert({ platform, label, value, is_public: true, sort_order });
  }
  revalidatePath("/dashboard/settings");
}

export async function saveContact(formData: FormData) {
  await assertOwner();
  const supabase = createClient();
  const fields = [
    ["phone", "رقم الهاتف", String(formData.get("phone") ?? "").trim()],
    ["email", "البريد الإلكتروني", String(formData.get("email") ?? "").trim()],
    ["youtube", "YouTube", String(formData.get("youtube") ?? "").trim()],
    ["instagram", "Instagram", String(formData.get("instagram") ?? "").trim()],
  ];
  for (let i = 0; i < fields.length; i++) {
    const [platform, label, value] = fields[i];
    const existing = await supabase.from("social_links").select("id").eq("platform", platform).maybeSingle();
    if (existing.data?.id) {
      await supabase.from("social_links").update({ label, value, is_public: Boolean(value), sort_order: i + 1 }).eq("id", existing.data.id);
    } else if (value) {
      await supabase.from("social_links").insert({ platform, label, value, is_public: true, sort_order: i + 1 });
    }
  }
  revalidatePath("/"); revalidatePath("/dashboard/settings");
}

export async function addTool(formData: FormData) {
  await assertOwner();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const supabase = createClient();
  await supabase.from("software_options").insert({ name, sort_order: 99 });
  revalidatePath("/"); revalidatePath("/dashboard/settings");
}

export async function deleteTool(id: string) {
  await assertOwner();
  const supabase = createClient();
  await supabase.from("software_options").delete().eq("id", id);
  revalidatePath("/"); revalidatePath("/dashboard/settings");
}

export async function publishChanges() {
  await assertOwner();
  const supabase = createClient();
  const { data } = await supabase.from("site_settings").select("draft").eq("id", 1).single();
  await supabase.from("site_settings").update({ published: data?.draft ?? {}, updated_at: new Date().toISOString() }).eq("id", 1);
  revalidatePath("/"); revalidatePath("/dashboard/settings");
}

export async function resetToPublished() {
  await assertOwner();
  const supabase = createClient();
  const { data } = await supabase.from("site_settings").select("published").eq("id", 1).single();
  await supabase.from("site_settings").update({ draft: data?.published ?? {}, updated_at: new Date().toISOString() }).eq("id", 1);
  revalidatePath("/dashboard/settings");
}
