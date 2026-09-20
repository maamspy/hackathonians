import Image from "next/image";

const VARIANTS = {
  default: {
    light: {
      src: "/assets/logo/svg/default/purple.svg",
      width: 77,
      height: 129,
    },
    dark: {
      src: "/assets/logo/svg/default/white.svg",
      width: 77,
      height: 129,
    },
  },
  nav: {
    light: {
      src: "/assets/logo/svg/default/mini/purple.svg",
      width: 166,
      height: 125,
    },
    dark: {
      src: "/assets/logo/svg/default/mini/white.svg",
      width: 166,
      height: 125,
    },
  },
  oneline: {
    light: {
      src: "/assets/logo/svg/light/oneline.svg",
      width: 572,
      height: 67,
    },
    dark: {
      src: "/assets/logo/svg/dark/oneline.svg",
      width: 572,
      height: 67,
    },
  },
  main: {
    light: {
      src: "/assets/logo/svg/light/main.svg",
      width: 452,
      height: 249,
    },
    dark: {
      src: "/assets/logo/svg/dark/main.svg",
      width: 452,
      height: 249,
    },
  },
};

export default function Logo({
  variant = "main",
  mode = "auto",
  className = "",
  alt = "Logo",
  ...props
}) {
  const config = VARIANTS[variant];

  if (mode !== "auto") {
    return (
      <Image
        {...config[mode]}
        alt={alt}
        className={className}
        {...props}
        unoptimized
      />
    );
  }

  return (
    <>
      <Image
        {...config.light}
        alt={alt}
        className={`${className} dark:hidden`}
        {...props}
        unoptimized
      />
      <Image
        {...config.dark}
        alt={alt}
        className={`${className} hidden dark:block`}
        {...props}
        unoptimized
      />
    </>
  );
}
