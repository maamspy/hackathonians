export const OG_SIZE = { width: 1200, height: 630 };

export function absoluteUrl(path = "/") {
  const base = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  return new URL(
    String(path ?? "/").replace(/^\/+/, ""),
    `${base}/`,
  ).toString();
}

export const siteConfig = {
  name: "Hackathonians",
  legalName: "Team Hackathonians",
  tagline:
    "Cool teenagers gathered, hacked and built amazing web projects together!",
  description:
    "Hackathonians is a teenage hackathon team from Dhaka, Bangladesh. We join hackathons across Bangladesh, ship open-source projects, publish build write-ups and mentor the next generation of teen developers.",
  locale: "en_GB",
  language: "en-GB",
  address: {
    locality: "Dhaka",
    country: "BD",
  },
  keywords: [
    "Hackathonians",
    "hackathon Dhaka",
    "Bangladesh hackathon team",
    "teenage hackers Bangladesh",
    "student hackathon team",
    "hackathon winners Bangladesh",
    "open source Bangladesh",
    "hackday Dhaka",
    "MLH hackathon",
    "junior developer community Bangladesh",
    "build in public Bangladesh",
    "Dhaka tech community",
  ],
};

export const ORGANIZATION_ID = () => absoluteUrl("/#organization");
export const WEBSITE_ID = () => absoluteUrl("/#website");

export function organizationLd() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID(),
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    foundingDate: "2025",
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.locality,
      addressCountry: siteConfig.address.country,
    },
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/assets/logo/svg/light/square.svg"),
    },
    knowsAbout: [
      "Open source software",
      "Artificial intelligence",
      "Machine learning",
      "Web development",
      "Data engineering",
      "Competitive programming",
    ],
  };
}

export function websiteLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID(),
    url: absoluteUrl("/"),
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: { "@id": ORGANIZATION_ID() },
  };
}

export function webPageLd({ path, title, description, breadcrumb }) {
  return {
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    isPartOf: { "@id": WEBSITE_ID() },
    about: { "@id": ORGANIZATION_ID() },
    inLanguage: siteConfig.language,
    ...(breadcrumb ? { breadcrumb } : {}),
  };
}

export function breadcrumbLd(trail) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function personLd({
  name,
  path,
  description,
  image,
  jobTitle,
  worksFor,
  memberOf,
  knowsAbout = [],
  sameAs = [],
}) {
  const url = path ? absoluteUrl(path) : undefined;

  return {
    "@type": "Person",
    "@id": url ? `${url}#person` : undefined,
    name,
    description,
    url,
    image,
    jobTitle,
    ...(worksFor
      ? {
          worksFor: {
            "@type": "Organization",
            name: worksFor.name,
            ...(worksFor.url ? { url: worksFor.url } : {}),
          },
        }
      : {}),
    ...(memberOf ? { memberOf } : {}),
    ...(knowsAbout.length > 0 ? { knowsAbout } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function itemListLd(name, items) {
  return {
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function creativeWorkLd(project) {
  return {
    "@type": "CreativeWork",
    "@id": `${absoluteUrl("/projects")}#${project.id}`,
    name: project.name,
    description: project.description ?? project.tagline,
    url: project.links?.demo ?? absoluteUrl("/projects"),
    ...(project.tags?.length ? { keywords: project.tags.join(", ") } : {}),
    creator: { "@id": ORGANIZATION_ID() },
    ...(project.event?.name
      ? {
          isPartOf: {
            "@type": "Event",
            name: project.event.name,
            ...(project.event.date ? { startDate: project.event.date } : {}),
          },
        }
      : {}),
  };
}

export function eventLd(event) {
  return {
    "@type": "Event",
    "@id": `${absoluteUrl("/previous")}#${event.id}`,
    name: event.name,
    url: event.url ?? absoluteUrl("/previous"),
    startDate: event.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: [
      `${event.name}, hosted by ${event.host}`,
      event.poweredBy ? `powered by ${event.poweredBy}` : null,
      event.festivalName ? `part of ${event.festivalName}` : null,
    ]
      .filter(Boolean)
      .join(", "),
    location: event.venue?.name
      ? {
          "@type": "Place",
          name: event.venue.name,
          address: {
            "@type": "PostalAddress",
            addressLocality: siteConfig.address.locality,
            addressCountry: siteConfig.address.country,
          },
        }
      : undefined,
    organizer: {
      "@type": "Organization",
      name: event.host,
      url: absoluteUrl("/"),
    },
  };
}

export function blogPostingLd(post, { author, image } = {}) {
  const url = absoluteUrl(`/blogs/${post.slug}`);

  return {
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    url,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.modifiedDate ?? post.date,
    inLanguage: siteConfig.language,
    ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
    ...(image ? { image } : {}),
    ...(post.readingTime ? { timeRequired: `PT${post.readingTime}M` } : {}),
    author: author?.name
      ? {
          "@type": "Person",
          name: author.name,
          ...(author.url ? { url: author.url } : {}),
          ...(author.username
            ? { sameAs: [`https://github.com/${author.username}`] }
            : {}),
        }
      : { "@id": ORGANIZATION_ID() },
    publisher: { "@id": ORGANIZATION_ID() },
  };
}

export function graphLd(nodes) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}

export function pageMetadata({
  title,
  description,
  path,
  ogType = "website",
  publishedTime,
  modifiedTime,
  authors,
  tags,
  images,
  twitterImages,
}) {
  const url = absoluteUrl(path);
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;

  return {
    title,
    description,
    keywords: tags,
    alternates: { canonical: url },
    openGraph: {
      type: ogType,
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors ? { authors } : {}),
      ...(tags ? { tags } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...((twitterImages ?? images) ? { images: twitterImages ?? images } : {}),
    },
  };
}
