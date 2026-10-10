import { promises as fs } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { OG_SIZE } from "./seo";
import { formatDate } from "./blog";

export { OG_SIZE };

const COLORS = {
  black: "#040402",
  blue: "#02b1ea",
  white: "#fefefe",
  yellow: "#f8b818",
};

const assetCache = new Map();

const LOGO_SRC = "/assets/logo/svg/dark/oneline.svg";

const LOGO_WIDTH = 250;
const LOGO_HEIGHT = Math.round(LOGO_WIDTH * (66.74 / 572.11));

async function loadAsset(src) {
  if (!src) return null;
  if (assetCache.has(src)) return assetCache.get(src);

  const file = path.join(process.cwd(), "public", src.replace(/^\/+/, ""));
  const ext = path.extname(file).slice(1).toLowerCase() || "png";
  const mime = ext === "jpg" ? "jpeg" : ext === "svg" ? "svg+xml" : ext;
  const buffer = await fs.readFile(file);
  const dataUri = `data:image/${mime};base64,${buffer.toString("base64")}`;

  assetCache.set(src, dataUri);
  return dataUri;
}

export async function renderOgImage(post) {
  const [banner, logo] = await Promise.all([
    loadAsset(post?.banner).catch(() => null),
    loadAsset(LOGO_SRC).catch(() => null),
  ]);
  const title = post?.title ?? "Hackathonians";

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.black,
      }}
    >
      {banner && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={banner}
          alt=""
          width={OG_SIZE.width}
          height={OG_SIZE.height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 14,
          width: banner ? 600 : "100%",
          padding: banner ? "40px 44px" : "56px",
          ...(banner && {
            backgroundImage:
              "linear-gradient(to left, rgba(4,4,2,0.95) 0%, rgba(4,4,2,0.92) 62%, rgba(4,4,2,0) 100%)",
          }),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt=""
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT }}
            />
          )}
          <span
            style={{
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: 2,
              color: COLORS.yellow,
            }}
          >
            / BLOG
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: banner ? 40 : 58,
            fontWeight: 700,
            lineHeight: 1.18,
            letterSpacing: -0.5,
            color: COLORS.white,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {post?.date && (
            <span style={{ fontSize: 21, color: COLORS.white }}>
              {formatDate(post.date)}
            </span>
          )}
        </div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      headers: { "Cache-Control": "public, max-age=0, s-maxage=31536000" },
    },
  );
}

export async function renderSiteOgImage() {
  const logo = await loadAsset(LOGO_SRC).catch(() => null);

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: "72px 80px",
        backgroundColor: COLORS.black,
        color: COLORS.white,
        fontFamily: "sans-serif",
      }}
    >
      {logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt=""
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT }}
        />
      )}

      <div
        style={{
          display: "flex",
          marginTop: 36,
          fontSize: 62,
          fontWeight: 700,
          lineHeight: 1.16,
          letterSpacing: -1,
          color: COLORS.white,
        }}
      >
        Cool teenagers gathered, hacked and built amazing web projects together!
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 28,
          fontSize: 26,
          color: COLORS.yellow,
        }}
      >
        Dhaka, Bangladesh | Hackathons, projects &amp; write-ups
      </div>
    </div>,
    {
      ...OG_SIZE,
      headers: { "Cache-Control": "public, max-age=0, s-maxage=31536000" },
    },
  );
}
