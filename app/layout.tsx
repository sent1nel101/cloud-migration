import type { Metadata } from "next"
import { ClientLayout } from "./client-layout" // We will create this next
import "./globals.css"

export const metadata: Metadata = {
  title: "FutureMap | AI Career Migration & Resilience",
  description:
    "Navigate the AI revolution. Map your path to AI-resilient roles and future-proof your career with FutureMap.",
  keywords: [
    "AI Career",
    "Career Migration",
    "AI Resilience",
    "Future of Work",
  ],
  authors: [{ name: "Dare C. McDaniel" }],
  openGraph: {
    title: "FutureMap | AI Career Migration",
    description:
      "Navigate the AI revolution and map your path to resilient roles.",
    url: "https://futuremap.darecmcdaniel.info",
    siteName: "FutureMap",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureMap | AI Career Migration",
    description: "Migrate your career into AI-resilient roles.",
  },
  icons: {
    icon: "/favicon.ico", // Ensure you have a favicon in your /public folder
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
