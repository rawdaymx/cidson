"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Motivo } from "@/types/motivo"

interface NuevoMotivoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (motivo: Omit<Motivo, "id"> | Motivo) => void
  motivo?: Motivo | null
}

export default function NuevoMotivoModal({ isOpen, onClose, onSave, motivo }: NuevoMotivoModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
  })
  const [errors, setErrors] = useState({
    nombre: "",
  })

  // Cargar datos del motivo si estamos en modo edición
  useEffect(() => {
    if (motivo) {
      setFormData({
        nombre: motivo.nombre,
      })
    } else {
      setFormData({
        nombre: "",
      })
    }
    setErrors({
      nombre: "",
    })
  }, [motivo, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Limpiar error al cambiar el valor
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = (): boolean => {
    let isValid = true
    const newErrors = {
      nombre: "",
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del motivo es requerido"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Si estamos editando, mantener el id, la fecha de registro y el estado original
    if (motivo) {
      onSave({
        id: motivo.id,
        nombre: formData.nombre.trim(),
        estado: motivo.estado,
        fechaCreacion: motivo.fechaCreacion,
      })
    } else {
      // Obtener la fecha actual en formato dd/mm/aaaa para nuevos motivos
      const today = new Date()
      const day = String(today.getDate()).padStart(2, "0")
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const year = today.getFullYear()
      const fechaCreacion = `${day}/${month}/${year}`

      onSave({
        nombre: formData.nombre.trim(),
        estado: "Activa",
        fechaCreacion,
      })
    }

    // Limpiar formulario
    setFormData({
      nombre: "",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{motivo ? "Editar Motivo" : "Nuevo Motivo"}</h2>
          <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre del Motivo
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full p-2 border ${
                  errors.nombre ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#303e65]`}
                placeholder="Ingrese el nombre del motivo"
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
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
              {motivo ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
