"use client"

import { MoreVertical, Pencil, Eye, X, List } from "lucide-react"
import type { Empresa } from "@/types/empresa"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EmpresaService } from "@/services/empresa-service"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"

interface EmpresaCardProps {
  empresa: Empresa
  onDeactivate?: (empresa: Empresa) => void
  onStatusChange?: (empresa: Empresa) => void
}

export default function EmpresaCard({ empresa, onStatusChange }: EmpresaCardProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Cerrar el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleEdit = () => {
    router.push(`/empresas/editar/${empresa.id}`)
    setIsMenuOpen(false)
  }

  const handleViewDetail = () => {
    router.push(`/empresas/detalle/${empresa.id}`)
    setIsMenuOpen(false)
  }

  const handleViewCatalogos = () => {
    router.push(`/empresas/catalogos/${empresa.id}`)
    setIsMenuOpen(false)
  }

  const handleToggleActiveClick = () => {
    setShowConfirmModal(true)
    setIsMenuOpen(false)
  }

  const handleToggleActive = async () => {
    try {
      setIsLoading(true)
      const updatedEmpresa = await EmpresaService.toggleActive(empresa.id)

      if (updatedEmpresa) {
        // Notificar al componente padre sobre el cambio
        onStatusChange?.(updatedEmpresa)
      }
    } catch (error) {
      console.error(`Error al cambiar estado de empresa:`, error)
      alert(`No se pudo cambiar el estado de la empresa. Por favor, intente nuevamente.`)
    } finally {
      setIsLoading(false)
      setShowConfirmModal(false)
    }
  }

  const isActive = empresa.estado === "Activo"
  const actionText = isActive ? "inactivar" : "activar"
  const confirmButtonClass = isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"

  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-100 p-5 transition-all duration-200 hover:shadow-card-hover">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg text-gray-800">{empresa.nombre}</h3>
        <div className="relative">
          <button
            ref={buttonRef}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Opciones"
            disabled={isLoading}
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 overflow-hidden"
              style={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
            >
              <button
                className="w-full px-4 py-3 text-left flex items-center hover:bg-gray-50 border-b border-gray-100"
                onClick={handleEdit}
                disabled={isLoading}
              >
                <Pencil className="mr-3 h-5 w-5 text-[#303e65]" />
                <span className="text-gray-700">Editar</span>
              </button>

              <button
                className="w-full px-4 py-3 text-left flex items-center hover:bg-gray-50 border-b border-gray-100"
                onClick={handleViewDetail}
                disabled={isLoading}
              >
                <Eye className="mr-3 h-5 w-5 text-[#303e65]" />
                <span className="text-gray-700">Ver detalle</span>
              </button>

              <button
                className="w-full px-4 py-3 text-left flex items-center hover:bg-gray-50 border-b border-gray-100"
                onClick={handleViewCatalogos}
                disabled={isLoading}
              >
                <List className="mr-3 h-5 w-5 text-[#303e65]" />
                <span className="text-gray-700">Ver catálogos</span>
              </button>

              <button
                className="w-full px-4 py-3 text-left flex items-center hover:bg-gray-50"
                onClick={handleToggleActiveClick}
                disabled={isLoading}
              >
                <X className="mr-3 h-5 w-5 text-[#303e65]" />
                <span className="text-gray-700">
                  {isLoading ? "Procesando..." : isActive ? "Inactivar" : "Activar"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Razón Social</p>
          <p className="text-sm text-gray-700 font-medium">{empresa.razonSocial}</p>
        </div>

        <div className="flex justify-between items-end pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Fecha de registro</p>
            <p className="text-sm text-gray-700">{empresa.fecha_creacion || empresa.fechaRegistro}</p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Estado</p>
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {empresa.estado}
            </span>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleToggleActive}
        title={`${isActive ? "Inactivar" : "Activar"} empresa`}
        message={
          <div>
            <p>
              ¿Está seguro que desea {actionText} la empresa <span className="font-semibold">"{empresa.nombre}"</span>?
            </p>
            {isActive && (
              <p className="mt-2 text-red-600">Esta acción puede afectar a los registros asociados a esta empresa.</p>
            )}
          </div>
        }
        confirmText={isActive ? "Inactivar" : "Activar"}
        confirmButtonClass={confirmButtonClass}
      />
    </div>
  )
}
