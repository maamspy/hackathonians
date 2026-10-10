import Image from "next/image";
import { Button, Logo } from "@/components/custom";
import { JsonLd } from "@/components/shared";
import { getAllPosts } from "@/lib/blog";
import {
  absoluteUrl,
  breadcrumbLd,
  graphLd,
  itemListLd,
  siteConfig,
  webPageLd,
} from "@/lib/seo";

export default function Home() {
  const posts = getAllPosts().slice(0, 5);

  const jsonLd = graphLd([
    webPageLd({
      path: "/",
      title: `${siteConfig.name} | Teenage Hackathon Team from Dhaka, Bangladesh`,
      description: siteConfig.description,
      breadcrumb: breadcrumbLd([{ name: "Home", path: "/" }]),
    }),
    itemListLd(
      "Latest posts",
      posts.map((post) => ({
        name: post.title,
        url: absoluteUrl(`/blogs/${post.slug}`),
      })),
    ),
  ]);

  return (
    <div className="relative -mt-16 ml-[calc(50%-50dvw)] h-dvh w-dvw overflow-hidden bg-brand-black">
      <JsonLd data={jsonLd} />
      <Image
        src="/assets/images/bg.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-brand-black/70" />
      <main className="relative mx-auto flex h-full w-full max-w-220 flex-col items-center px-3 text-center text-brand-white">
        <div aria-hidden className="max-h-[50dvh] flex-1" />
        <div className="flex w-full flex-col items-center">
          <Logo
            variant="main"
            mode="dark"
            priority
            className="mb-3 h-20 w-auto sm:h-24 md:h-28"
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
