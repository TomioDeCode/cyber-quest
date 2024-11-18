import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/core/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { SessionsProvider } from "@/components/core/SessionProvider";
import { SidebarProvider } from "@/components/ui/sidebar";

const fontPoppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Cyber Quest",
  description: "Created By TomioDeCode",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontPoppins.variable} antialiased`}>
        <SidebarProvider>
          <SessionsProvider>
            <ThemeProvider defaultTheme="system" attribute="class">
              <main className="min-h-screen w-full">
                {children}
                <Toaster />
              </main>
            </ThemeProvider>
          </SessionsProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
