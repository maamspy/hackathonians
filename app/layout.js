import { Josefin_Sans } from "next/font/google";
import { Footer, JsonLd, Navbar } from "@/components/shared";
import Providers from "@/providers/main";
import { graphLd, organizationLd, siteConfig, websiteLd } from "@/lib/seo";
import "./globals.css";

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${siteConfig.name} | Teenage Hackathon Team from Dhaka, Bangladesh`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: "technology",
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: `${siteConfig.name} | Teenage Hackathon Team from Dhaka, Bangladesh`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Teenage Hackathon Team from Dhaka, Bangladesh`,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${josefin.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col overflow-x-clip">
        <JsonLd data={graphLd([organizationLd(), websiteLd()])} />
        <Providers>
          <Navbar />
          <div className="container mx-auto flex flex-1 flex-col px-3">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
