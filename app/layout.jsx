import "./../styles/globals.css";
import Providers from "./providers";
import VantaBackground from "./components/VantaBackground";
import Header from "./components/Header";

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
