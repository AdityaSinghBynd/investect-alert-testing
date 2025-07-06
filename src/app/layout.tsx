import type { Metadata } from "next";
import "@/styles/globals.css";
import NavigationWrapper from "@/components/NavigationWrapper";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Bynd Alerts",
  description: "Bynd fin-tech platform",
  icons: {
    icon: "/ByndLogoFavicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavigationWrapper>
            {children}
          </NavigationWrapper>
          <ToastContainer
            position="bottom-right"
            autoClose={2000}
            hideProgressBar={true}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Providers>
      </body>
    </html>
  );
}