import "./../styles/globals.css";
import Providers from "./providers";
import Link from "next/link";

export const metadata = {
  title: "flow402",
  description:
    "Pay-per-second streaming content on Solana. Watch, create, and earn.",
  icons: {
    icon: "/flowpfp.png",
    apple: "/flowpfp.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-mesh opacity-90" />
            <div className="absolute inset-0 bg-grid opacity-[0.05] [background-size:72px_72px]" />
            <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/[0.04] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <Header />
          <div className="page-shell pt-24">{children}</div>
        </Providers>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 px-4 pt-4 sm:px-6">
      <nav className="nav-shell mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <img src="/flowpfp.png" alt="flow402" className="h-8 w-8 rounded-xl border border-white/10 object-cover" />
          <div>
            <span className="block font-semibold tracking-tight text-white">flow402</span>
            <span className="hidden text-[11px] uppercase tracking-[0.24em] text-white/40 sm:block">
              streaming finance
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-5 text-sm text-gray-300">
          <Link href="/browse" className="hover:text-white transition">
            Browse
          </Link>
          <Link href="/agents" className="hover:text-white transition">
            Agents
          </Link>
          <Link href="/docs" className="hover:text-white transition">
            Docs
          </Link>
          <a
            href="https://github.com/JamieMay2020/flow402/tree/main"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            GitHub
          </a>
          <a
            href="https://x.com/flow402"
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
