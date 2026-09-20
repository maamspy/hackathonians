"use client";

import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Analytics />
    </ThemeProvider>
  );
}
