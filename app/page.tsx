import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LatestWork from "@/components/LatestWork";
import AboutSection from "@/components/AboutSection";
import ToolsSection from "@/components/ToolsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = createClient();
  const [{ data: latest }, { data: settings }, { data: social }, { data: tools }] = await Promise.all([
    supabase.from("projects").select("*").eq("status", "published").eq("is_hidden", false).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("site_settings_public").select("published").single(),
    supabase.from("social_links").select("*").eq("is_public", true).order("sort_order"),
    supabase.from("software_options").select("id, name").order("sort_order"),
  ]);
  const published = (settings?.published as Record<string, any>) ?? {};
  return <>
    <Navbar />
    <Hero videoUrl={published.hero_video_url ?? null} posterUrl={published.hero_poster_url ?? null} autoplay={published.hero_autoplay ?? true} loop={published.hero_loop ?? true} title={published.hero_title ?? null} subtitle={published.hero_subtitle ?? null} />
    <LatestWork project={latest ?? null} />
    <AboutSection content={published} />
    <ToolsSection tools={tools ?? []} />
    <ContactSection content={published} socialLinks={social ?? []} />
    <Footer />
  </>;
}
