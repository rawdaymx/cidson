"use client"

import { useRouter } from "next/navigation"
import { FileText, Hand, Server, Bed } from "lucide-react"

interface Catalogo {
  id: number
  nombre: string
  descripcion: string
  icono: string
  ruta: string
}

interface CatalogoCardProps {
  catalogo: Catalogo
  empresaId: number
}

export default function CatalogoCard({ catalogo, empresaId }: CatalogoCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(catalogo.ruta)
  }

  const renderIcon = () => {
    switch (catalogo.icono) {
      case "FileText":
        return <FileText className="h-8 w-8 text-[#303e65]" />
      case "Hand":
        return <Hand className="h-8 w-8 text-[#303e65]" />
      case "Server":
        return <Server className="h-8 w-8 text-[#303e65]" />
      case "Bed":
        return <Bed className="h-8 w-8 text-[#303e65]" />
      default:
        return <FileText className="h-8 w-8 text-[#303e65]" />
    }
  }

  return (
    <div
      className="bg-white rounded-xl shadow-card border border-gray-100 p-6 transition-all duration-200 hover:shadow-card-hover cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center mb-4">
        <div className="bg-[#f4f6fb] p-3 rounded-lg mr-4">{renderIcon()}</div>
        <h3 className="font-semibold text-lg text-gray-800">{catalogo.nombre}</h3>
      </div>
      <p className="text-sm text-gray-600">{catalogo.descripcion}</p>
    </div>
  )
}
