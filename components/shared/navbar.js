"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/custom";
import { NAV_LINKS } from "./links";

const BAR_FADE = "duration-300 ease-out";

function isActive(pathname, href) {
  return href === "/"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overHero = onHome && !scrolled;
  const solid = !overHero;
  const navText = overHero ? "text-brand-white" : "text-foreground";

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        aria-hidden
        className={`absolute inset-0 border-b transition-[background-color,border-color] ${BAR_FADE} ${
          solid
            ? "border-border bg-background/95"
            : "border-transparent bg-transparent"
        }`}
      />
      <nav className="relative container mx-auto flex h-16 items-center justify-between gap-4 px-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <Logo
            variant="nav"
            mode={overHero ? "dark" : "auto"}
            className="h-6 w-auto shrink-0 sm:h-7"
          />
          <span
            className={`truncate font-display text-lg font-bold uppercase tracking-tight transition-colors ${BAR_FADE} ${navText}`}
          >
            Hackathonians
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`block whitespace-nowrap px-4 py-2 text-sm font-bold uppercase tracking-tight transition-colors ${BAR_FADE} hover:text-brand-blue ${
                  isActive(pathname, href) ? "text-brand-blue" : navText
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 transition-colors ${BAR_FADE} ${navText} md:hidden`}
        >
          <span
            className={`h-0.5 w-6 bg-current transition ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-current transition ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-current transition ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      <div
        id="mobile-nav"
        aria-hidden={!open}
        className={`relative grid transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="flex flex-col border-t border-border bg-background px-3 pb-4 pt-2">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-11 items-center rounded-sm px-4 text-sm font-bold uppercase tracking-tight transition hover:bg-foreground/5 hover:text-brand-blue ${
                    isActive(pathname, href)
                      ? "bg-brand-blue/10 text-brand-blue"
                      : "text-foreground"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
