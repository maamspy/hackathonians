"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/logo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/upcoming", label: "Upcoming" },
  { href: "/projects", label: "Projects" },
];

function isActive(pathname, href) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
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

  const solid = !onHome || scrolled;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        aria-hidden
        className={`absolute inset-0 border-b transition-opacity duration-300 ${
          solid
            ? "border-border bg-background/95 opacity-100"
            : "border-transparent opacity-0"
        }`}
      />
      <nav className="relative container mx-auto flex h-16 items-center justify-between px-3">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <Logo variant="nav" className="h-6 w-auto sm:h-7" />
          <span
            className={`font-display text-lg font-bold uppercase tracking-tight transition-colors duration-300 ${
              solid ? "text-foreground" : "text-brand-white"
            }`}
          >
            Hackathonians
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`block px-4 py-2 text-sm font-bold uppercase tracking-tight transition hover:text-brand-blue ${
                  isActive(pathname, href)
                    ? "text-brand-blue"
                    : solid
                      ? "text-foreground"
                      : "text-brand-white"
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
          className={`flex h-10 w-10 flex-col items-center justify-center gap-1.5 transition-colors duration-300 md:hidden ${
            solid ? "text-foreground" : "text-brand-white"
          }`}
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

      {open && (
        <ul
          id="mobile-nav"
          className="border-t border-border bg-background md:hidden"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 text-sm font-bold uppercase tracking-tight transition hover:text-brand-blue ${
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
      )}
    </header>
  );
}
