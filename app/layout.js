import { Josefin_Sans } from "next/font/google";
import { Footer, Navbar } from "@/components/shared";
import Providers from "@/providers/main";
import "./globals.css";

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Hackathonians",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${josefin.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
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
