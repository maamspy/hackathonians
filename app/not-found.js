import Image from "next/image";
import Button from "@/components/button";

export default function NotFound() {
  return (
    <div className="relative min-h-dvh w-screen overflow-hidden bg-background">
      <main className="relative mx-auto flex min-h-dvh w-full max-w-220 flex-col items-center justify-center px-3 text-center text-brand-white">
        <Image
          src="/assets/logo.jpeg"
          alt="Hackathonians logo"
          width={224}
          height={224}
          priority
          className="mb-3 h-20 w-20 object-contain sm:h-24 sm:w-24 md:h-28 md:w-28"
        />
        <p className="font-display text-[clamp(6rem,24vw,14rem)] font-bold leading-none tracking-tight text-brand-blue">
          404
        </p>
        <h1 className="font-display text-[clamp(1.75rem,5.5vw,3.75rem)] font-bold leading-tight tracking-tight">
          Page not found
        </h1>
        <p className="mt-2 max-w-xl text-brand-white/70">
          This page got hacked away. The URL may be mistyped or the page may
          have moved.
        </p>
        <div className="mt-6">
          <Button color="purple" href="/" target="_self">
            GO BACK HOME
          </Button>
        </div>
      </main>
    </div>
  );
}
