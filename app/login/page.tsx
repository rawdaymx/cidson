"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { AuthService } from "@/services/auth-service"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  // Obtener la URL de callback si existe
  const callbackUrl = searchParams.get("callbackUrl") || "/empresas"

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      router.push("/empresas")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validaciones básicas del lado del cliente
      if (!email.trim()) {
        setError("Por favor, ingresa tu correo electrónico.")
        setIsLoading(false)
        return
      }

      if (!password) {
        setError("Por favor, ingresa tu contraseña.")
        setIsLoading(false)
        return
      }

      const response = await AuthService.login(email, password)

      if (response.success) {
        // Redirección a la URL de callback o a empresas por defecto
        router.push(callbackUrl)
      } else {
        setError("Credenciales inválidas. Por favor, verifica tu correo y contraseña.")
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error)
      setError("Credenciales inválidas. Por favor, verifica tu correo y contraseña.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Lado izquierdo - Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col items-center">
            <Image src="/images/logo.png" alt="CIDSON Logo" width={300} height={100} priority className="mb-8" />
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-800">Iniciar sesión</h1>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="sr-only">
                  Correo
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Correo"
                  className="bg-gray-50 border-gray-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <div className="flex justify-end">
                  <Link href="/recuperar-contrasena" className="text-sm text-[#2D4876] hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Label htmlFor="password" className="sr-only">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Contraseña"
                  className="bg-gray-50 border-gray-200 mt-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 bg-[#FFCB05] hover:bg-[#e6b700] text-black font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFCB05]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2">Iniciando sesión</span>
                  <div className="h-4 w-4 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Lado derecho - Solo imagen */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image src="/images/background.jpeg" alt="CIDSON Background" fill style={{ objectFit: "cover" }} priority />
      </div>
    </div>
  )
}
