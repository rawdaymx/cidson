"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Metodo } from "@/types/metodo"

interface NuevoMetodoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (metodo: Omit<Metodo, "id"> | Metodo) => void
  metodo?: Metodo | null
}

export default function NuevoMetodoModal({ isOpen, onClose, onSave, metodo }: NuevoMetodoModalProps) {
  const [descripcion, setDescripcion] = useState("")
  const [error, setError] = useState("")

  // Cargar datos del método si estamos en modo edición
  useEffect(() => {
    if (metodo) {
      setDescripcion(metodo.descripcion)
    } else {
      setDescripcion("")
    }
    setError("")
  }, [metodo, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!descripcion.trim()) {
      setError("La descripción del método es requerida")
      return
    }

    // Si estamos editando, mantener el id, la fecha de registro y el estado original
    if (metodo) {
      onSave({
        id: metodo.id,
        descripcion: descripcion.trim(),
        estado: metodo.estado,
        fechaCreacion: metodo.fechaCreacion,
      })
    } else {
      // Obtener la fecha actual en formato dd/mm/aaaa para nuevos métodos
      const today = new Date()
      const day = String(today.getDate()).padStart(2, "0")
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const year = today.getFullYear()
      const fechaCreacion = `${day}/${month}/${year}`

      onSave({
        descripcion: descripcion.trim(),
        estado: "Activa",
        fechaCreacion,
      })
    }

    // Limpiar formulario
    setDescripcion("")
    setError("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{metodo ? "Editar Método" : "Nuevo Método"}</h2>
          <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                Descripción del Método
              </label>
              <input
                type="text"
                id="descripcion"
                value={descripcion}
                onChange={(e) => {
                  setDescripcion(e.target.value)
                  if (e.target.value.trim()) setError("")
                }}
                className={`w-full p-2 border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#303e65]`}
                placeholder="Ingrese la descripción del método"
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
              {metodo ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
