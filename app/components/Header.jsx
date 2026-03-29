"use client";

import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/agents", label: "Agents" },
  { href: "/publish", label: "Publish" },
  { href: "/docs", label: "Docs" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-xl border-b border-neutral-700/40">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <img src="/flowpfp.png" alt="flow402" className="w-6 h-6 rounded" />
          <span className="font-semibold tracking-tight">flow402</span>
        </a>
        <div className="flex items-center gap-6 text-sm">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`transition ${
                pathname === href || pathname.startsWith(href + "/")
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {label}
            </a>
          ))}
          <a
            href="https://github.com/JamieMay2020/flow402/tree/main"
            target="_blank"
            rel="noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            GitHub
          </a>
          <a
            href="https://x.com/flow402"
            target="_blank"
            rel="noreferrer"
            className="text-gray-400 hover:text-white transition flex items-center"
            aria-label="X"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 1227"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M714 556 1160 0h-106L667 482 392 0H0l464 803-464 553h106l409-486 293 486h392L714 556ZM575 713l-47-78L161 80h181l262 438 47 78 382 636H852L575 713Z" />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  );
}
