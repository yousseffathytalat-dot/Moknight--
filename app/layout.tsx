import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "MoKnight",
  description: "Video Editor & Motion Graphics Designer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var l=localStorage.getItem("moknight_lang")||"ar";
              var t=localStorage.getItem("moknight_theme")||"dark";
              document.documentElement.lang=l;
              document.documentElement.dir=l==="ar"?"rtl":"ltr";
              document.documentElement.classList.toggle("light",t==="light");
            }catch(e){}})();`,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
