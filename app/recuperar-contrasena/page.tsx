"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular envío de correo
    setTimeout(() => {
      setIsLoading(false)
      setEmailSent(true)
    }, 1500)
  }

  const handleResend = () => {
    setIsLoading(true)

    // Simular reenvío
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex h-screen">
      {/* Lado izquierdo - Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16">
        <Link href="/login" className="flex items-center text-[#303e65] mb-12 hover:underline w-fit">
          <svg
            width="20"
            height="20"
            viewBox="0 0 31 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M3 15.5C3 22.4052 8.59476 28 15.5 28C22.4052 28 28 22.4052 28 15.5C28 8.59476 22.4052 3 15.5 3C8.59476 3 3 8.59476 3 15.5ZM25.5806 15.5C25.5806 21.0696 21.0696 25.5806 15.5 25.5806C9.93044 25.5806 5.41935 21.0696 5.41935 15.5C5.41935 9.93044 9.93044 5.41935 15.5 5.41935C21.0696 5.41935 25.5806 9.93044 25.5806 15.5ZM21.9516 14.4919V16.5081C21.9516 16.8407 21.6794 17.1129 21.3468 17.1129H15.5V20.4899C15.5 21.0292 14.8498 21.2964 14.4667 20.9183L9.47681 15.9284C9.23992 15.6915 9.23992 15.3085 9.47681 15.0716L14.4667 10.0817C14.8498 9.69859 15.5 9.97077 15.5 10.5101V13.8871H21.3468C21.6794 13.8871 21.9516 14.1593 21.9516 14.4919Z"
              fill="#3A4B78"
            />
          </svg>
          Regresar
        </Link>

        <div className="max-w-md mx-auto w-full space-y-8">
          <div className="flex flex-col items-center">
            <Image src="/images/logo.png" alt="CIDSON Logo" width={300} height={100} priority className="mb-8" />
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">Recuperación de contraseña</h1>
            <p className="text-gray-500">
              Ingresa tu email para que te enviemos un enlace para restablecer tu contraseña.
            </p>
          </div>

          {emailSent ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
              Hemos enviado un enlace de recuperación a tu correo electrónico. Por favor revisa tu bandeja de entrada.
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="correo@ejemplo.com"
                  className="bg-gray-50 border-gray-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FFCB05] hover:bg-[#e6b700] text-black font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFCB05] flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Enviando</span>
                    <div className="h-4 w-4 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
                  </>
                ) : (
                  "Enviar"
                )}
              </button>
            </form>
          )}

          <div className="text-center pt-4">
            <p className="text-gray-600">
              ¿No te ha llegado el enlace?{" "}
              <button
                onClick={handleResend}
                className="text-blue-500 hover:underline"
                disabled={isLoading || !emailSent}
              >
                Reenvíalo.
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Lado derecho - Solo imagen */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image src="/images/background.jpeg" alt="CIDSON Background" fill style={{ objectFit: "cover" }} priority />
      </div>
    </div>
  )
}
