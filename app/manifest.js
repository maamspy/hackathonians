export default function manifest() {
  return {
    name: "Hackathonians",
    short_name: "Hackathonians",
    description:
      "A teenage hackathon team from Dhaka, Bangladesh shipping open-source projects and mentoring the next generation of teen developers.",
    start_url: "/",
    display: "standalone",
    background_color: "#040402",
    theme_color: "#040402",
    icons: [
      {
        src: "/assets/logo/svg/light/square.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
