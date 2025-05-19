"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Material } from "@/types/material"

interface NuevoMaterialModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (material: Omit<Material, "id"> | Material) => void
  material?: Material | null
}

export default function NuevoMaterialModal({ isOpen, onClose, onSave, material }: NuevoMaterialModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
  })
  const [errors, setErrors] = useState({
    nombre: "",
  })

  // Cargar datos del material si estamos en modo edición
  useEffect(() => {
    if (material) {
      setFormData({
        nombre: material.nombre,
      })
    } else {
      setFormData({
        nombre: "",
      })
    }
    setErrors({
      nombre: "",
    })
  }, [material, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      newErrors.nombre = "El nombre del material es requerido"
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

    try {
      // Si estamos editando, mantener el id, la fecha de registro y el estado original
      if (material) {
        onSave({
          id: material.id,
          nombre: formData.nombre.trim(),
          estado: material.estado,
          fecha_creacion: material.fechaCreacion,
        })
      } else {
        // Para nuevos materiales, usamos la fecha actual
        const fechaActual = new Date().toISOString().split("T")[0]

        onSave({
          nombre: formData.nombre.trim(),
          estado: true,
          fecha_creacion: fechaActual,
        })
      }

      // Limpiar formulario
      setFormData({
        nombre: "",
      })
    } catch (error) {
      // Actualizar el mensaje de error en caso de que se implemente la validación en el modal también
      setErrors({
        nombre: "El nombre del material ya existe. Por favor, utilice otro nombre.",
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{material ? "Editar Material" : "Nuevo Material"}</h2>
          <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre del Material
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
                placeholder="Ingrese el nombre del material"
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
              {material ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
