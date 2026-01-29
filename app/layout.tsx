import type { Metadata } from "next";
import { Space_Grotesk, Outfit } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gmail Alias // GEN",
  description:
    "Organize. Filter. Protect. The next-gen Gmail alias generator.",
  keywords:
    "Gmail aliases, email generator, privacy, security, email organization",
  authors: [{ name: "Dinitha Fernando" }],
  creator: "Dinitha Fernando",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
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
        className={`${spaceGrotesk.variable} ${outfit.variable} antialiased font-sans bg-background text-foreground tracking-wide`}
      >
        {children}
      </body>
    </html>
  );
}
