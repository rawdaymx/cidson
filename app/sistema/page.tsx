"use client"

import { useState } from "react"
import Link from "next/link"
import { API } from "@/config/api-config"
import { Button } from "@/components/ui/button"

export default function SistemaPage() {
  const [buildInfo, setBuildInfo] = useState({
    date: new Date().toLocaleString(),
    version: "1.0.0",
  })

  const env = process.env.NEXT_PUBLIC_ENV || "development"
  const envName = {
    development: "Desarrollo",
    test: "Pruebas",
    production: "Producción",
  }[env]

  const envColor = {
    development: "bg-green-100 text-green-800 border-green-200",
    test: "bg-yellow-100 text-yellow-800 border-yellow-200",
    production: "bg-blue-100 text-blue-800 border-blue-200",
  }[env]

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Información del Sistema</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Entorno</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-medium w-32">Entorno actual:</span>
              <span className={`px-3 py-1 rounded-full text-sm ${envColor}`}>{envName}</span>
            </div>
            <div className="flex items-start">
              <span className="font-medium w-32">API URL:</span>
              <span className="text-gray-600 break-all">{API.BASE_URL}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Versión</h2>
          <div className="space-y-3">
            <div className="flex">
              <span className="font-medium w-32">Versión:</span>
              <span className="text-gray-600">{buildInfo.version}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32">Fecha de build:</span>
              <span className="text-gray-600">{buildInfo.date}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/empresas">
          <Button variant="outline">Volver al Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
