'use client';

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
