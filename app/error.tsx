"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="max-w-md">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">Algo salió mal</h2>
        <p className="mb-2 text-gray-600">Ha ocurrido un error inesperado.</p>
        <p className="mb-6 text-sm text-gray-500">Error: {error.message}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => reset()}
            className="rounded-md bg-[#303e65] px-4 py-2 text-sm font-medium text-white hover:bg-[#253050]"
          >
            Intentar de nuevo
          </button>
          <Link href="/empresas" passHref>
            <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Volver a la página principal
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
