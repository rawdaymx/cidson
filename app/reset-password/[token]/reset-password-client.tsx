"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ResetPasswordClientProps {
  token: string
}

export default function ResetPasswordClient({ token }: ResetPasswordClientProps) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    general: "",
  })
  const [isSuccess, setIsSuccess] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(true)

  // Verificar validez del token (simulado)
  useEffect(() => {
    // En un caso real, aquí verificarías el token con el backend
    if (token && token.length < 5) {
      setIsTokenValid(false)
    }
  }, [token])

  const validatePassword = (password: string): boolean => {
    // Al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    return regex.test(password)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Limpiar errores al escribir
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar formulario
    let isValid = true
    const newErrors = {
      password: "",
      confirmPassword: "",
      general: "",
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = "La contraseña no cumple con los requisitos"
      isValid = false
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
      isValid = false
    }

    if (!isValid) {
      setErrors(newErrors)
      return
    }

    // Procesar el cambio de contraseña
    setIsLoading(true)

    // Simulación de llamada a API
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    }, 1500)
  }

  if (!isTokenValid) {
    return (
      <div className="flex h-screen">
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16">
          <div className="max-w-md w-full space-y-8">
            <div className="flex flex-col items-center">
              <Image src="/images/logo.png" alt="CIDSON Logo" width={300} height={100} priority className="mb-8" />
            </div>

            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
              <p className="font-medium">Enlace inválido o expirado</p>
              <p className="mt-2">
                El enlace para restablecer tu contraseña es inválido o ha expirado. Por favor, solicita un nuevo enlace
                de recuperación.
              </p>
            </div>

            <button
              onClick={() => router.push("/recuperar-contrasena")}
              className="w-full py-3 bg-[#FFCB05] hover:bg-[#e6b700] text-black font-medium rounded-md transition-colors"
            >
              Solicitar nuevo enlace
            </button>
          </div>
        </div>

        {/* Lado derecho - Solo imagen */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <Image src="/images/background.jpeg" alt="CIDSON Background" fill style={{ objectFit: "cover" }} priority />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Lado izquierdo - Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col items-center">
            <div className="text-center mb-4">
              <span className="text-4xl font-bold">
                <span className="text-yellow-400">C</span>
                <span className="text-[#303e65]">IDSON</span>
              </span>
              <p className="text-xs text-gray-500 mt-1">Clean Industrial And Domestic Solutions</p>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">Cambio de contraseña</h1>

            <div className="text-gray-500 text-sm">
              <p className="font-medium">Tu contraseña tendrá que contar con:</p>
              <p className="mt-1">
                8 o más caracteres, 1 mayúscula y 1 minúscula, 1 número, 1 carácter especial (e.g !@#$%&*(_) y sin
                espaciados.
              </p>
            </div>
          </div>

          {isSuccess ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
              <p className="font-medium">¡Contraseña actualizada!</p>
              <p className="mt-2">
                Tu contraseña ha sido actualizada correctamente. Serás redirigido a la página de inicio de sesión.
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nueva contraseña"
                    className="bg-gray-50 border-gray-200 pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              <div>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmar nueva contraseña"
                    className="bg-gray-50 border-gray-200 pr-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
                  {errors.general}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#FFCB05] hover:bg-[#e6b700] text-black font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFCB05] flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Procesando</span>
                    <div className="h-4 w-4 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
                  </>
                ) : (
                  "Aceptar"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Lado derecho - Solo imagen */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image src="/images/background.jpeg" alt="CIDSON Background" fill style={{ objectFit: "cover" }} priority />
      </div>
    </div>
  )
}
