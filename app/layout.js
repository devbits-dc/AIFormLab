import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./_components/ThemeProvider";
import { Navbar } from "./_components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Formify",
  description: "Formify is a platform for creating and managing forms.",
  icons: {
    icon: "/logo-icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="light">
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster richColors />
            <Navbar />
            <main className="pt-16">{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
