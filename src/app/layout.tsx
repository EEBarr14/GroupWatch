import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GroupWatch",
  description: "Keep track of what you are watching and share it with friends.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
