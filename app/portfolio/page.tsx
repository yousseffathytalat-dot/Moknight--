import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import PortfolioGrid from "@/components/PortfolioGrid";
import Footer from "@/components/Footer";

export const revalidate = 0;
export default async function PortfolioPage() {
  const supabase = createClient();
  const [{ data: projects }, { data: categories }] = await Promise.all([
    supabase.from("projects").select("*").eq("status", "published").eq("is_hidden", false).order("created_at", { ascending: false }),
    supabase.from("categories").select("key, label_ar, label_en").order("sort_order"),
  ]);
  return <><Navbar /><main className="pt-28"><PortfolioGrid projects={projects ?? []} categories={categories ?? []} /></main><Footer /></>;
}
