import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PlanProvider } from "@/components/PlanProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: { default: "Streamax — Movies & series, anytime", template: "%s · Streamax" },
  description:
    "Stream movies and series anytime, anywhere. Watch free with ads, or go ad-free with Standard or Premium.",
};

export const viewport: Viewport = { themeColor: "#07060d" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="font-sans antialiased">
        <PlanProvider>
          <Header />
          <main className="pb-16">{children}</main>
          <Footer />
        </PlanProvider>
      </body>
    </html>
  );
}
