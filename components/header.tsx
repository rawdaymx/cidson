"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/services/auth-service"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"

export default function Header() {
  const router = useRouter()
  const [username, setUsername] = useState<string>("Usuario")
  const [userEmail, setUserEmail] = useState<string>("")

  // Obtener el entorno actual
  const env = process.env.NEXT_PUBLIC_ENV || "development"
  const showEnvBadge = env !== "production"

  useEffect(() => {
    // Aquí podrías obtener el nombre de usuario desde el token o de una API
    setUsername("Elena Cruz")
    setUserEmail("ElenaCruz@cidson.com.mx")
  }, [])

  const handleLogout = () => {
    AuthService.logout()
    router.push("/login")
  }

  return (
    <header className="bg-[#303e65] text-white h-16 flex items-center justify-between px-4 shadow-md">
      <div className="flex items-center">
        {/* Mostrar badge del entorno (excepto en producción) */}
        {showEnvBadge && (
          <span
            className={`px-2 py-1 text-xs rounded-full ${env === "development" ? "bg-green-600" : "bg-yellow-600"}`}
          >
            {env === "development" ? "Desarrollo" : "Pruebas"}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex flex-col items-end mr-2">
          <span className="text-sm font-medium">{username}</span>
          <span className="text-xs text-gray-300">{userEmail}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-10 w-10 cursor-pointer border-2 border-white/20">
              <AvatarImage src="/abstract-profile.png" alt={username} />
              <AvatarFallback className="bg-amber-500 text-[#303e65]">
                {username
                  .split(" ")
                  .map((name) => name[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
