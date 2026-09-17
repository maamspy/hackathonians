"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        solid
          ? "border-b border-[rgba(254,254,254,0.1)] bg-[rgba(4,4,2,0.95)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-3">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/assets/logo.jpeg"
            alt="Hackathonians logo"
            width={40}
            height={40}
            className="h-8 w-8 object-contain sm:h-9 sm:w-9"
          />
          <span className="font-display text-lg font-bold uppercase tracking-tight text-brand-white">
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
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-0.5 w-6 bg-brand-white transition ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-brand-white transition ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-brand-white transition ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {open && (
        <ul
          id="mobile-nav"
          className="border-t border-brand-white/10 bg-brand-black md:hidden"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 text-sm font-bold uppercase tracking-tight transition hover:text-brand-blue ${
                  isActive(pathname, href)
                    ? "bg-brand-blue/10 text-brand-blue"
                    : "text-brand-white"
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
