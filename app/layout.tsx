import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gmail Alias Generator - Create Unlimited Email Aliases Instantly",
  description:
    "Generate unlimited Gmail aliases instantly to organize, filter, track spam, and protect your inbox. Free email alias generator with advanced features. Create dot aliases (john.smith@gmail.com) and plus aliases (john+tag@gmail.com) in seconds.",
  keywords:
    "Gmail aliases, email generator, Gmail tricks, email organization, spam filter, Gmail dot trick, Gmail plus addressing, free email tool, inbox management",
  authors: [{ name: "Dinitha Fernando" }],
  creator: "Dinitha Fernando",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Gmail Alias Generator - Create Email Aliases Instantly",
    description:
      "Generate unlimited Gmail aliases to organize your inbox and protect your privacy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gmail Alias Generator",
    description: "Create unlimited Gmail aliases instantly",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('gmail-alias-theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                
                if (theme === 'dark' || (theme !== 'light' && systemDark)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
