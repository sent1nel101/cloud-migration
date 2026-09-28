import type { Metadata } from "next"
import { ClientLayout } from "./client-layout" // We will create this next
import "./globals.css"

export const metadata: Metadata = {
  title: "FutureMap | Personalized Roadmaps for Any Career Change",
  description:
    "Map your next career move. Get a personalized, step-by-step roadmap for changing careers in any field, from healthcare and the trades to business, education, and tech.",
  keywords: [
    "Career Change",
    "Career Roadmap",
    "Career Planning",
    "Career Transition",
    "Future of Work",
  ],
  authors: [{ name: "Dare C. McDaniel" }],
  openGraph: {
    title: "FutureMap | Career Roadmaps for Any Field",
    description:
      "A personalized, step-by-step roadmap for your next career move, in any industry.",
    url: "https://futuremap.darecmcdaniel.info",
    siteName: "FutureMap",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureMap | Career Roadmaps for Any Field",
    description: "Map your next career move, in any industry.",
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
