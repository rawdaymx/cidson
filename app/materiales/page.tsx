"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import MaterialesModule from "@/components/materiales/materiales-module"

export default function MaterialesPage() {
  const searchParams = useSearchParams()
  const empresaId = searchParams.get("empresaId")

  // URL de regreso a los catálogos de la empresa
  const backUrl = empresaId ? `/empresas/catalogos/${empresaId}` : "/empresas" // Si no hay empresaId, regresar a la lista de empresas

  return (
    <div className="bg-[#f4f6fb] min-h-screen">
      <div className="pl-8 pr-6 py-6 max-w-[1200px]">
        <Link href={backUrl} className="inline-flex items-center text-[#303e65] mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Regresar
        </Link>

        <MaterialesModule />
      </div>
    </div>
  )
}
