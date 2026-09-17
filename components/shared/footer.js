import Link from "next/link";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import Logo from "@/components/logo";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/upcoming", label: "Upcoming" },
  { href: "/projects", label: "Projects" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="container mx-auto flex flex-col gap-8 px-3 py-10 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex">
            <Logo variant="oneline" className="h-8 w-auto" />
          </Link>
          <p className="mt-3 text-foreground/70">
            Cool teenagers gathered, hacked and built amazing web projects
            together!
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-bold uppercase tracking-tight text-foreground">
            Pages
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {FOOTER_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-block text-foreground/70 transition hover:text-brand-blue"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase tracking-tight text-foreground">
            Theme
          </h2>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
