import { FileText, Hand, Server, Bed, Package } from "lucide-react"
import Link from "next/link"

interface CatalogoCardProps {
  catalogo: {
    id: number
    nombre: string
    descripcion: string
    icono: string
    ruta: string
  }
  empresaId: number
  configuracionId?: number
}

export default function CatalogoCard({ catalogo, empresaId, configuracionId }: CatalogoCardProps) {
  // Función para obtener el icono según el nombre
  const getIcon = () => {
    switch (catalogo.icono) {
      case "FileText":
        return <FileText className="h-6 w-6" />
      case "Hand":
        return <Hand className="h-6 w-6" />
      case "Server":
        return <Server className="h-6 w-6" />
      case "Bed":
        return <Bed className="h-6 w-6" />
      case "Package":
        return <Package className="h-6 w-6" />
      default:
        return <FileText className="h-6 w-6" />
    }
  }

  // Construir la URL con los parámetros necesarios
  const buildUrl = () => {
    const params = new URLSearchParams()
    params.append("empresaId", empresaId.toString())

    // Asegurarse de que configuracionId no sea undefined antes de añadirlo
    // Si no hay configuracionId, usar un valor por defecto (1) para pruebas
    const configId = configuracionId || 1
    params.append("configuracionId", configId.toString())

    return `${catalogo.ruta}?${params.toString()}`
  }

  return (
    <Link href={buildUrl()}>
      <div className="bg-white rounded-xl shadow-card border border-gray-100 p-5 transition-all duration-200 hover:shadow-card-hover hover:border-gray-200">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-[#303e65] bg-opacity-10 flex items-center justify-center text-[#303e65]">
            {getIcon()}
          </div>
          <h3 className="ml-4 font-semibold text-lg text-gray-800">{catalogo.nombre}</h3>
        </div>
        <p className="text-gray-600 text-sm">{catalogo.descripcion}</p>
        <p className="text-xs text-gray-500 mt-2">
          Configuración ID: {configuracionId || "No disponible (usando valor por defecto: 1)"}
        </p>
      </div>
    </Link>
  )
}
