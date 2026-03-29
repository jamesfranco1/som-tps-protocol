import { Outfit } from "next/font/google";
import "./../styles/globals.css";
import Providers from "./providers";
import VantaBackground from "./components/VantaBackground";
import Header from "./components/Header";
import Footer from "./components/Footer";

const outfit = Outfit({ subsets: ["latin"] });

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
      <body className={`${outfit.className} relative min-h-screen overflow-x-hidden bg-black text-white antialiased`}>
        <VantaBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Providers>
            <Header />
            <div className="pt-20 flex-1">{children}</div>
            <Footer />
          </Providers>
        </div>
      </body>
    </html>
  );
}
