import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import RootLayoutClient from "./RootLayoutClient"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CIDSON - Gestión de Empresas",
  description: "Clean Industrial And Domestic Solutions",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}
