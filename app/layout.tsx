// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import FeedbackWidget from "@/components/FeedbackWidget";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Demo App",
  description: "Playing around with components and concepts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <FeedbackWidget 
          apiKey="sq_8P5FP7MVBWQJ1QZ651DRFZEF719WUSI3"
          projectId="your-project-slug"
          baseUrl="http://localhost:3001"  // Your main project's URL
        />
      </body>
    </html>
  );
}