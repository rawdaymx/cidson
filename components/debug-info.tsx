"use client"

import { useState } from "react"
import { API } from "@/config/api-config"
import { Button } from "@/components/ui/button"

export function DebugInfo() {
  const [showInfo, setShowInfo] = useState(false)

  // Solo mostrar en desarrollo y pruebas
  const env = process.env.NEXT_PUBLIC_ENV || "development"
  if (env === "production") return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowInfo(!showInfo)}
        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
      >
        {showInfo ? "Ocultar info" : "Mostrar info"}
      </Button>

      {showInfo && (
        <div className="mt-2 p-4 bg-white border rounded shadow-lg max-w-md">
          <h3 className="font-bold mb-2">Información de depuración</h3>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-semibold">Entorno:</span> {env}
            </p>
            <p>
              <span className="font-semibold">API Base URL:</span> {API.BASE_URL}
            </p>
            <p>
              <span className="font-semibold">Login URL:</span> {`${API.BASE_URL}${API.ENDPOINTS.LOGIN}`}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Esta información solo es visible en entornos de desarrollo y pruebas.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
