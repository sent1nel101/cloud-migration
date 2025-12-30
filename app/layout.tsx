'use client';

import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import "./globals.css";

// Note: Metadata doesn't work in 'use client' components
// Consider moving to a separate server component wrapper if needed
// export const metadata: Metadata = {
//   title: "Career AI Migration",
//   description: "Migrate your career into AI-resilient roles",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return (
    <html lang="en" data-theme="dark">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
