"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Zona } from "@/types/zona"

interface NuevaZonaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (zona: Omit<Zona, "id"> | Zona) => void
  zona?: Zona | null
}

export default function NuevaZonaModal({ isOpen, onClose, onSave, zona }: NuevaZonaModalProps) {
  const [nombre, setNombre] = useState("")
  const [error, setError] = useState("")

  // Cargar datos de la zona si estamos en modo edición
  useEffect(() => {
    if (zona) {
      setNombre(zona.nombre)
    } else {
      setNombre("")
    }
    setError("")
  }, [zona, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre.trim()) {
      setError("El nombre de la zona es requerido")
      return
    }

    // Si estamos editando, mantener el id, la fecha de registro y el estado original
    if (zona) {
      onSave({
        id: zona.id,
        nombre: nombre.trim(),
        estado: zona.estado,
        fechaCreacion: zona.fechaCreacion,
      })
    } else {
      // Obtener la fecha actual en formato dd/mm/aaaa para nuevas zonas
      const today = new Date()
      const day = String(today.getDate()).padStart(2, "0")
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const year = today.getFullYear()
      const fechaCreacion = `${day}/${month}/${year}`

      onSave({
        nombre: nombre.trim(),
        estado: "Activa",
        fechaCreacion,
      })
    }

    // Limpiar formulario
    setNombre("")
    setError("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{zona ? "Editar Zona" : "Nueva Zona"}</h2>
          <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre de la Zona
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value)
                  if (e.target.value.trim()) setError("")
                }}
                className={`w-full p-2 border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#303e65]`}
                placeholder="Ingrese el nombre de la zona"
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-cidson-blue text-white rounded-md hover:bg-cidson-blue-light">
              {zona ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
