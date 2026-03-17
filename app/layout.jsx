import "./../styles/globals.css";
import Providers from "./providers";

export const metadata = {
  title: "flow402x",
  description:
    "Pay-per-second streaming content on Solana. Watch, create, and earn.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white antialiased">
        <Providers>
          <Header />
          <div className="pt-20">{children}</div>
        </Providers>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-black/40 backdrop-blur-md border-b border-neutral-800">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-300 shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
          <span className="font-semibold tracking-tight">flow402x</span>
        </a>
        <div className="flex items-center gap-6 text-sm text-gray-300">
          <a
            href="/browse"
            className="hover:text-white transition"
          >
            Browse
          </a>
          <a
            href="/#agents"
            className="hover:text-white transition"
          >
            Agents
          </a>
          <a
            href="https://github.com/JamieMay2020/flow402/tree/main"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            GitHub
          </a>
          <a
            href="https://x.com/flow402x"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition flex items-center"
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
