const COLORS = {
  blue: "bg-brand-blue",
  purple: "bg-brand-purple",
  yellow: "bg-brand-yellow",
};

export default function Button({ color = "blue", href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full cursor-pointer px-5 py-3 text-base font-bold text-brand-white md:w-auto md:px-6 md:text-lg ${
        color === "yellow" ? "text-brand-black" : ""
      } ${COLORS[color]}`}
    >
      {children}
    </a>
  );
}
