import { db } from "@/data";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "An article from the Hackathonians blog";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  return renderOgImage(db.posts.findById(slug));
}
