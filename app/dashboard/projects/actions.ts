"use server";

import { createClient, isOwnerSession } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function assertOwner() {
  if (!(await isOwnerSession())) {
    throw new Error("Not authorized");
  }
}

export async function createProject(formData: FormData) {
  await assertOwner();
  const supabase = createClient();

  const videoFile = formData.get("video") as File | null;
  const thumbFile = formData.get("thumbnail") as File | null;

  let video_url: string | null = null;
  let thumbnail_url: string | null = null;

  if (videoFile && videoFile.size > 0) {
    const path = `${crypto.randomUUID()}-${videoFile.name}`;
    const { error } = await supabase.storage.from("videos").upload(path, videoFile);
    if (error) throw error;
    video_url = supabase.storage.from("videos").getPublicUrl(path).data.publicUrl;
  }

  if (thumbFile && thumbFile.size > 0) {
    const path = `${crypto.randomUUID()}-${thumbFile.name}`;
    const { error } = await supabase.storage.from("thumbnails").upload(path, thumbFile);
    if (error) throw error;
    thumbnail_url = supabase.storage.from("thumbnails").getPublicUrl(path).data.publicUrl;
  }

  const { error } = await supabase.from("projects").insert({
    name_ar: String(formData.get("name_ar") ?? ""),
    name_en: String(formData.get("name_en") ?? "") || null,
    description_ar: String(formData.get("description_ar") ?? "") || null,
    description_en: String(formData.get("description_en") ?? "") || null,
    category: String(formData.get("category") ?? "other"),
    aspect_ratio: String(formData.get("aspect_ratio") ?? "16:9"),
    software: String(formData.get("software") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    status: String(formData.get("status") ?? "draft"),
    video_url,
    thumbnail_url,
  });
  if (error) throw error;

  revalidatePath("/dashboard/projects");
  revalidatePath("/");
  redirect("/dashboard/projects");
}

export async function deleteProject(id: string) {
  await assertOwner();
  const supabase = createClient();
  const { data: existing } = await supabase
    .from("projects")
    .select("video_url, thumbnail_url")
    .eq("id", id)
    .single();
  await supabase.from("projects").delete().eq("id", id);
  const videoPath = pathFromPublicUrl(existing?.video_url, "videos");
  if (videoPath) await supabase.storage.from("videos").remove([videoPath]);
  const thumbPath = pathFromPublicUrl(existing?.thumbnail_url, "thumbnails");
  if (thumbPath) await supabase.storage.from("thumbnails").remove([thumbPath]);
  revalidatePath("/dashboard/projects");
  revalidatePath("/");
}

export async function toggleStatus(id: string, status: "draft" | "published") {
  await assertOwner();
  const supabase = createClient();
  await supabase.from("projects").update({ status }).eq("id", id);
  revalidatePath("/dashboard/projects");
  revalidatePath("/");
}

export async function toggleHidden(id: string, is_hidden: boolean) {
  await assertOwner();
  const supabase = createClient();
  await supabase.from("projects").update({ is_hidden }).eq("id", id);
  revalidatePath("/dashboard/projects");
  revalidatePath("/");
}

function pathFromPublicUrl(publicUrl: string | null | undefined, bucket: string): string | null {
  if (!publicUrl) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  return idx === -1 ? null : publicUrl.slice(idx + marker.length);
}

export async function updateProject(id: string, formData: FormData) {
  await assertOwner();
  const supabase = createClient();
  const videoFile = formData.get("video") as File | null;
  const thumbFile = formData.get("thumbnail") as File | null;

  const { data: existing } = await supabase
    .from("projects")
    .select("video_url, thumbnail_url")
    .eq("id", id)
    .single();

  const patch: any = {
    name_ar: String(formData.get("name_ar") ?? ""),
    name_en: String(formData.get("name_en") ?? "") || null,
    description_ar: String(formData.get("description_ar") ?? "") || null,
    description_en: String(formData.get("description_en") ?? "") || null,
    category: String(formData.get("category") ?? "other"),
    aspect_ratio: String(formData.get("aspect_ratio") ?? "16:9"),
    software: String(formData.get("software") ?? "").split(",").map(s => s.trim()).filter(Boolean),
    status: String(formData.get("status") ?? "draft"),
    updated_at: new Date().toISOString(),
  };
  if (videoFile && videoFile.size > 0) {
    const path = `${crypto.randomUUID()}-${videoFile.name}`;
    const { error } = await supabase.storage.from("videos").upload(path, videoFile);
    if (error) throw error;
    patch.video_url = supabase.storage.from("videos").getPublicUrl(path).data.publicUrl;
    const oldPath = pathFromPublicUrl(existing?.video_url, "videos");
    if (oldPath) await supabase.storage.from("videos").remove([oldPath]);
  }
  if (thumbFile && thumbFile.size > 0) {
    const path = `${crypto.randomUUID()}-${thumbFile.name}`;
    const { error } = await supabase.storage.from("thumbnails").upload(path, thumbFile);
    if (error) throw error;
    patch.thumbnail_url = supabase.storage.from("thumbnails").getPublicUrl(path).data.publicUrl;
    const oldPath = pathFromPublicUrl(existing?.thumbnail_url, "thumbnails");
    if (oldPath) await supabase.storage.from("thumbnails").remove([oldPath]);
  }
  const { error } = await supabase.from("projects").update(patch).eq("id", id);
  if (error) throw error;
  revalidatePath("/dashboard/projects"); revalidatePath("/"); revalidatePath("/portfolio");
  redirect("/dashboard/projects");
}
