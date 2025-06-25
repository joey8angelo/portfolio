import type { Metadata } from "next";
import { Martian_Mono } from "next/font/google";
import "./globals.css";

const martianMono = Martian_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Joseph D'Angelo",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${martianMono.className} antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
