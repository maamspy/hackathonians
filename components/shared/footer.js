import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/upcoming", label: "Upcoming" },
  { href: "/projects", label: "Projects" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-white/10 bg-brand-black">
      <div className="container mx-auto flex flex-col gap-8 px-3 py-10 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/logo.jpeg"
              alt="Hackathonians logo"
              width={40}
              height={40}
              className="h-9 w-9 object-contain"
            />
            <span className="font-display text-lg font-bold uppercase tracking-tight text-brand-white">
              Hackathonians
            </span>
          </Link>
          <p className="mt-3 text-brand-white/70">
            Cool teenagers gathered, hacked and built amazing web projects
            together!
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-bold uppercase tracking-tight text-brand-white">
            Pages
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {FOOTER_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-block text-brand-white/70 transition hover:text-brand-blue"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
