import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/layout/Cursor";
import { MobileCta } from "@/components/layout/MobileCta";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display-face", display: "swap", axes: ["opsz", "wdth"] });
const text = Instrument_Sans({ subsets: ["latin"], variable: "--font-text", display: "swap", axes: ["wdth"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "DLK Agência Digital | Sites que destacam o seu negócio", template: "%s | DLK Agência Digital" },
  description: site.description,
  applicationName: "DLK",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "DLK Agência Digital",
    title: "DLK Agência Digital | Seu negócio merece mais que um site",
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "DLK Agência Digital" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#13213C", colorScheme: "dark", viewportFit: "cover" };

/** Decide, antes da primeira pintura, se a abertura toca (só na 1ª visita da sessão e sem movimento reduzido). */
const introScript = `(function(){var d=document.documentElement;d.classList.add('js');var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;if(!rm)d.classList.add('js-motion');try{if(rm||sessionStorage.getItem('dlk:intro')){d.classList.add('intro-skip');return}sessionStorage.setItem('dlk:intro','1')}catch(e){}setTimeout(function(){d.classList.add('intro-done')},1600)})();`;

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.legalName,
  alternateName: "DLK",
  url: site.url,
  logo: `${site.url}/icon.svg`,
  image: `${site.url}/og.jpg`,
  description: site.description,
  areaServed: { "@type": "Country", name: "Brasil" },
  knowsLanguage: "pt-BR",
  ...(site.contact.email ? { email: site.contact.email } : {}),
  ...(site.contact.whatsapp ? { telephone: `+${site.contact.whatsapp}` } : {}),
  sameAs: Object.values(site.social).filter(Boolean),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body>
        <a href="#conteudo" className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-dot px-5 py-3 font-medium text-void focus:translate-y-0">
          Pular para o conteúdo
        </a>
        {/* Abertura: logo se monta e a cortina sobe (CSS puro, ~1,5 s, só na 1ª visita) */}
        <div id="intro" aria-hidden>
          <div className="intro-mark">
            <Logo title={null} />
          </div>
          <span className="intro-bar" />
        </div>
        <SmoothScroll>
          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
          <MobileCta />
        </SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
