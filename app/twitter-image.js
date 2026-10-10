import { OG_SIZE, renderSiteOgImage } from "@/lib/og";

export const alt =
  "Hackathonians | A teenage hackathon team from Dhaka, Bangladesh";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderSiteOgImage();
}
