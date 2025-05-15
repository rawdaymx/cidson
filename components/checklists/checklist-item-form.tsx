"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"

interface ChecklistItemElement {
  id: string
  descripcion: string
  obligatorio: boolean
}

interface ChecklistItemFormProps {
  initialItems?: ChecklistItemElement[]
  onSave: (items: ChecklistItemElement[]) => void
  onCancel: () => void
}

export default function ChecklistItemForm({ initialItems = [], onSave, onCancel }: ChecklistItemFormProps) {
  const [items, setItems] = useState<ChecklistItemElement[]>(
    initialItems.length > 0 ? initialItems : [{ id: `item-${Date.now()}`, descripcion: "", obligatorio: true }],
  )

  const addItem = () => {
    setItems([...items, { id: `item-${Date.now()}`, descripcion: "", obligatorio: true }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof ChecklistItemElement, value: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(items)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Elementos del checklist</h3>
        <Button type="button" onClick={addItem} variant="outline" className="flex items-center gap-2">
          <Plus size={16} />
          Agregar elemento
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-gray-500">No hay elementos en este checklist.</p>
          <Button type="button" onClick={addItem} className="mt-2 bg-[#303e65] hover:bg-[#253252]">
            Agregar el primer elemento
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="border rounded-md p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Elemento {index + 1}</h4>
                <Button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor={`descripcion-${item.id}`}>Descripción</Label>
                  <Input
                    id={`descripcion-${item.id}`}
                    value={item.descripcion}
                    onChange={(e) => updateItem(item.id, "descripcion", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`obligatorio-${item.id}`}
                    checked={item.obligatorio}
                    onChange={(e) => updateItem(item.id, "obligatorio", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#303e65] focus:ring-[#303e65]"
                  />
                  <Label htmlFor={`obligatorio-${item.id}`} className="ml-2 text-sm">
                    Obligatorio
                  </Label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-[#303e65] hover:bg-[#253252]">
          Guardar elementos
        </Button>
      </div>
    </form>
  )
}
