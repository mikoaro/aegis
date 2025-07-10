import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AegisProvider } from "@/contexts/aegis-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Aegis - AI-Powered Fraud Detection",
  description: "Real-time, agentic fraud remediation platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AegisProvider>
            {children}
            <Toaster />
          </AegisProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
