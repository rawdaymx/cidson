"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Empresa } from "@/types/empresa"
import { EmpresaService } from "@/services/empresa-service"
import CatalogoCard from "@/components/empresas/catalogo-card"

export default function CatalogosEmpresaPage() {
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

  const catalogos = [
    {
      id: 1,
      nombre: "Actividades",
      descripcion: "Gestión de actividades asociadas a la empresa",
      icono: "FileText",
      ruta: `/actividades?empresaId=${id}`,
    },
    {
      id: 2,
      nombre: "Motivos",
      descripcion: "Gestión de motivos asociados a la empresa",
      icono: "FileText",
      ruta: `/motivos?empresaId=${id}`,
    },
    {
      id: 3,
      nombre: "Métodos",
      descripcion: "Gestión de métodos asociados a la empresa",
      icono: "Hand",
      ruta: `/metodos?empresaId=${id}`,
    },
    {
      id: 4,
      nombre: "Áreas",
      descripcion: "Gestión de áreas asociadas a la empresa",
      icono: "Server",
      ruta: `/areas?empresaId=${id}`,
    },
    {
      id: 5,
      nombre: "Zonas",
      descripcion: "Gestión de zonas asociadas a la empresa",
      icono: "Bed",
      ruta: `/zona?empresaId=${id}`,
    },
  ]

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

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Catálogos de {empresa.nombre}</h1>
        <p className="text-gray-600 mb-8">Seleccione un catálogo para gestionar.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogos.map((catalogo) => (
            <CatalogoCard key={catalogo.id} catalogo={catalogo} empresaId={id} />
          ))}
        </div>
      </div>
    </div>
  )
}
