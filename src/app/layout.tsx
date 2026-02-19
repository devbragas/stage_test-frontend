import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../shared/components/theme-provider";
import { QueryProvider } from "../shared/components/query-provider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
});

const rubik = Rubik({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stage Flow",
  description: "Organizational Process Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${rubik.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children} <Toaster position="top-right" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
