"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Empresa } from "@/types/empresa"
import { EmpresaService } from "@/services/empresa-service"

export default function DetalleEmpresaPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)

  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (isNaN(id)) {
          setError("ID de empresa inválido")
          setIsLoading(false)
          return
        }

        const empresaData = await EmpresaService.getById(id)

        if (empresaData) {
          setEmpresa(empresaData)
        } else {
          setError("Empresa no encontrada")
        }
      } catch (error) {
        console.error("Error al cargar la empresa:", error)
        setError("Error al cargar los datos de la empresa. Por favor, intente nuevamente.")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchEmpresa()
    }
  }, [id, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f6fb]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#303e65] border-t-[#f5d433] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f6fb]">
        <div className="text-center">
          <p className="text-xl text-gray-700">{error}</p>
          <Link href="/empresas" className="mt-4 inline-block text-[#303e65] hover:underline">
            Volver al listado
          </Link>
        </div>
      </div>
    )
  }

  if (!empresa) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f6fb]">
        <div className="text-center">
          <p className="text-xl text-gray-700">Empresa no encontrada</p>
          <Link href="/empresas" className="mt-4 inline-block text-[#303e65] hover:underline">
            Volver al listado
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f4f6fb] min-h-screen">
      <div className="pl-8 pr-6 py-6 max-w-[1200px]">
        <Link href="/empresas" className="inline-flex items-center text-[#303e65] mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Regresar
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Ver detalles</h1>
        <p className="text-gray-600 mb-8">Ver lo detalles de la empresa.</p>

        <div className="bg-white rounded-xl p-8 shadow-sm max-w-[800px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-normal text-gray-500 mb-1">Nombre De La Empresa</h3>
              <p className="text-lg font-medium text-gray-800">{empresa.nombre}</p>
            </div>

            <div>
              <h3 className="text-sm font-normal text-gray-500 mb-1">Razón Social</h3>
              <p className="text-lg font-medium text-gray-800">{empresa.razonSocial}</p>
            </div>

            <div>
              <h3 className="text-sm font-normal text-gray-500 mb-1">Fecha De Registro</h3>
              <p className="text-lg font-medium text-gray-800">{empresa.fechaRegistro}</p>
            </div>

            <div>
              <h3 className="text-sm font-normal text-gray-500 mb-1">Estado</h3>
              <p className="text-lg font-medium text-gray-800">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${
                    empresa.estado === "Activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {empresa.estado}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
