import Image from "next/image";
import Button from "@/components/button";

export default function Home() {
  return (
    <div className="relative -mt-16 h-dvh w-full overflow-hidden bg-brand-black">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/assets/images/bg.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div aria-hidden className="absolute inset-0 bg-brand-black/70" />
      <main className="relative mx-auto flex h-full w-full max-w-220 flex-col items-center px-3 text-center text-brand-white">
        <div aria-hidden className="max-h-[50dvh] flex-1" />
        <div className="flex w-full flex-col items-center">
          <Image
            src="/assets/logo.jpeg"
            alt="Hackathonians logo"
            width={224}
            height={224}
            priority
            className="mb-3 h-20 w-20 object-contain sm:h-24 sm:w-24 md:h-28 md:w-28"
          />
          <h1 className="font-display text-[clamp(1.75rem,5.5vw,3.75rem)] font-bold leading-tight tracking-tight">
            Cool teenagers gathered, hacked and built amazing web projects
            together!
          </h1>
          <div className="mt-3 flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <Button color="blue" href="/projects">
              BROWSE OUR PROJECTS
            </Button>
            <Button color="purple" href="/upcoming" target="_self">
              EXPLORE MORE
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
