"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getChecklists } from "@/services/checklist-service"
import type { ChecklistItem, ChecklistFilter } from "@/types/checklist"
import Link from "next/link"
import { MoreVertical, Filter, Plus, Trash2, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ChecklistsModule() {
  const [checklists, setChecklists] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [filters, setFilters] = useState<ChecklistFilter>({})
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const itemsPerPage = 12
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  useEffect(() => {
    loadChecklists()
  }, [currentPage, filters])

  const loadChecklists = async () => {
    setLoading(true)
    try {
      const result = await getChecklists(currentPage, itemsPerPage, filters)
      setChecklists(result.data)
      setTotalItems(result.total)
    } catch (error) {
      console.error("Error al cargar los checklists:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)

    // Actualizar filtros activos para mostrar las etiquetas
    const activeFiltersList = []
    if (newFilters.estado) activeFiltersList.push("1")
    if (newFilters.actividad) activeFiltersList.push("2")
    setActiveFilters(activeFiltersList)

    setCurrentPage(1) // Resetear a la primera página al filtrar
  }

  const clearFilter = (filterIndex: string) => {
    const newActiveFilters = activeFilters.filter((f) => f !== filterIndex)
    setActiveFilters(newActiveFilters)

    const newFilters = { ...filters }
    if (filterIndex === "1") delete newFilters.estado
    if (filterIndex === "2") delete newFilters.actividad

    setFilters(newFilters)
  }

  const clearAllFilters = () => {
    setFilters({})
    setActiveFilters([])
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-2">Checklist</h1>
        <p className="text-gray-600 mb-6">
          Administra y crea nuevos checklists para revisar el trabajo realizado por CIDSON.
        </p>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-yellow-400 mr-2">{totalItems}</span>
            <span className="text-gray-500 uppercase text-sm">Registros</span>
          </div>

          <div className="flex gap-2">
            {activeFilters.includes("1") && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 px-3 py-1 border-green-500"
                onClick={() => clearFilter("1")}
              >
                Filtro 1<span className="cursor-pointer">×</span>
              </Badge>
            )}

            {activeFilters.includes("2") && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 px-3 py-1 border-green-500"
                onClick={() => clearFilter("2")}
              >
                Filtro 2<span className="cursor-pointer">×</span>
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter size={16} />
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => handleFilterChange("estado", "activo")}>
                  Estado: Activo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("estado", "inactivo")}>
                  Estado: Inactivo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("actividad", "Piso")}>
                  Actividad: Piso
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={clearAllFilters} className="gap-2">
              Limpiar
            </Button>

            <Link href="/checklist/nuevo">
              <Button className="bg-[#303e65] hover:bg-[#253252] gap-2">
                <Plus size={16} />
                Nuevo Checklist
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Cargando checklists...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {checklists.map((checklist) => (
                <div key={checklist.id} className="bg-white rounded-md shadow-sm border p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium">{checklist.nombre}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/checklist/editar/${checklist.id}`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-gray-500">Actividad</div>
                    <div>{checklist.actividad}</div>

                    <div className="text-gray-500">Áreas asociadas</div>
                    <div>{checklist.areasAsociadas.join(", ")}</div>

                    <div className="text-gray-500">Materiales asociadas</div>
                    <div>{checklist.materialesAsociados.join(", ")}</div>

                    <div className="text-gray-500">Estado</div>
                    <div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-300">
                        Estado
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="text-[#303e65]"
                >
                  « Primera
                </Button>
                <Button
                  variant="outline"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-[#303e65]"
                >
                  ‹ Anterior
                </Button>

                <Button
                  variant={currentPage === 1 ? "default" : "outline"}
                  className={currentPage === 1 ? "bg-[#303e65]" : ""}
                >
                  1
                </Button>

                {totalPages > 1 && (
                  <Button
                    variant={currentPage === 2 ? "default" : "outline"}
                    onClick={() => goToPage(2)}
                    className={currentPage === 2 ? "bg-[#303e65]" : ""}
                  >
                    2
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="text-[#303e65]"
                >
                  Siguiente ›
                </Button>
                <Button
                  variant="outline"
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="text-[#303e65]"
                >
                  Última »
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
