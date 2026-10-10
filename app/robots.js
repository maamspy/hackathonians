import { absoluteUrl } from "@/lib/seo";

const AI_AND_SEARCH_AGENTS = [
  "Googlebot",
  "Googlebot-Image",
  "Googlebot-News",
  "Bingbot",
  "DuckDuckBot",
  "YandexBot",
  "Bravebot",

  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",

  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",

  "PerplexityBot",
  "Perplexity-User",

  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "Amazonbot-Shopper",
  "meta-externalagent",

  "MistralAI-User",
  "YouBot",
  "cohere-ai",
  "cohere-training-data-crawler",
  "CCBot",
  "Bytespider",
  "Diffbot",
  "FacebookBot",
];

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      ...AI_AND_SEARCH_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: process.env.NEXT_PUBLIC_SITE_URL,
  };
}
