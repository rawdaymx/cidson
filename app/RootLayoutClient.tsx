"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { DebugInfo } from "@/components/debug-info" // Importar el componente DebugInfo

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)
  const [isAuthRoute, setIsAuthRoute] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Verificar si la ruta actual es una ruta de autenticación
    setIsAuthRoute(
      pathname?.startsWith("/(auth)") ||
        pathname === "/login" ||
        pathname === "/recuperar-contrasena" ||
        pathname?.startsWith("/reset-password"),
    )
  }, [pathname])

  // Si no estamos en el cliente, renderizamos un esqueleto básico
  if (!isClient) {
    return (
      <div className="flex h-screen">
        <div className="w-[80px] bg-white"></div>
        <div className="flex flex-col flex-1">
          <div className="h-[56px] bg-[#303e65]"></div>
          <div className="flex-1 bg-gray-50"></div>
        </div>
      </div>
    )
  }

  // Si es una ruta de autenticación, no mostrar el sidebar ni el header
  if (isAuthRoute) {
    return (
      <>
        {children}
        <DebugInfo /> {/* Añadir DebugInfo en rutas de autenticación */}
      </>
    )
  }

  // Para todas las demás rutas, mostrar el layout completo con sidebar y header
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
        <DebugInfo /> {/* Añadir DebugInfo en rutas autenticadas */}
      </div>
    </div>
  )
}
