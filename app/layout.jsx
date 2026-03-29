import "./../styles/globals.css";
import Providers from "./providers";
import VantaBackground from "./components/VantaBackground";

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
      <body className="relative min-h-screen overflow-x-hidden bg-black text-white antialiased">
        <VantaBackground />
        <div className="relative z-10">
          <Providers>
            <Header />
            <div className="pt-20">{children}</div>
          </Providers>
        </div>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-xl border-b border-neutral-700/40">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <img src="/flowpfp.png" alt="flow402" className="w-6 h-6 rounded" />
          <span className="font-semibold tracking-tight">flow402</span>
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
