import "~/styles/globals.css";
import Header from "./_components/layout/header";
import { GeistSans } from "geist/font/sans";
// Supports weights 100-900
import '@fontsource-variable/montserrat';
import Navbar from "./_components/layout/navbar";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "sonner";

export const metadata = {
  title: "based bets",
  description: "Generated by lyghtcode and shadow",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const BackgroundSVG = () => (
  <svg
    className="fixed inset-0 h-full w-full"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
  >
    <rect width="100%" height="100%" fill="#121212" />
    <path
      fill="#1A237E"
      fillOpacity="0.3"
      d="M0,160L0,320L1440,320L1440,160C1320,200,1200,240,1080,240C960,240,840,200,720,200C600,200,480,240,360,240C240,240,120,200,60,180L0,160Z"
    />
    <path
      fill="#D50000"
      fillOpacity="0.3"
      d="M0,160C60,180,120,200,240,200C360,200,480,160,600,160C720,160,840,200,960,200C1080,200,1200,160,1320,140L1440,120L1440,160C1320,200,1200,240,1080,240C960,240,840,200,720,200C600,200,480,240,360,240C240,240,120,200,60,180L0,160Z"
    />
  </svg>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative bg-black min-h-screen">
        <BackgroundSVG />
        <ThirdwebProvider>
          <div className="px-5 md:px-16 relative z-10">
            <Header />
            <div className="mt-3">{children}</div>
          </div>

          <Toaster richColors position="top-center" />
          
        </ThirdwebProvider>
        <div className="fixed bottom-0 left-0 right-0 w-full z-20">
          <Navbar />
        </div>
      </body>
    </html>
  );
}
