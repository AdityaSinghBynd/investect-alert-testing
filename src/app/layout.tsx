
import type { Metadata } from "next";
import Providers from "./providers";
// Components
import AppLayout from "@/components/AppLayout";
// Styles
import "@/styles/globals.css";

// Metadata = Title, Description, Favicon
export const metadata: Metadata = {
  title: "Bynd Alerts",
  description: "Bynd fin-tech platform",
  icons: {
    icon: "/ByndLogoFavicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}