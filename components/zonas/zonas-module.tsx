"use client"

import { useState, useEffect, type FormEvent } from "react"
import { Filter, Plus, Search } from "lucide-react"
import type { Zona } from "@/types/zona"
import { ZonaService } from "@/services/zona-service"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function ZonasModule() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const empresaId = searchParams.get("empresaId") || "9" // Valor por defecto para pruebas
  const [filtros, setFiltros] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchQuery, setSearchQuery] = useState("") // Término de búsqueda actual aplicado
  const [zonas, setZonas] = useState<Zona[]>([])
  const [filteredZonas, setFilteredZonas] = useState<Zona[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const itemsPerPage = 10

  // Cargar zonas
  useEffect(() => {
    const fetchZonas = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Preparar filtros para la API
        const apiFilters: { nombre?: string; estado?: number } = {}

        // Si hay término de búsqueda, añadirlo al filtro
        if (searchQuery) {
          apiFilters.nombre = searchQuery
        }

        // Mapear filtros de UI a valores de API
        if (filtros.includes("1") && !filtros.includes("2")) {
          apiFilters.estado = 1 // Solo Activas
        } else if (!filtros.includes("1") && filtros.includes("2")) {
          apiFilters.estado = 0 // Solo Inactivas
        }
        // Si ambos filtros están seleccionados o ninguno está seleccionado,
        // no incluimos el parámetro estado en la solicitud

        console.log("Obteniendo zonas para configuración:", empresaId, "con filtros:", apiFilters)
        const { zonas: zonasData, pagination } = await ZonaService.getAll(
          empresaId ? Number(empresaId) : undefined,
          currentPage,
          apiFilters,
        )

        setZonas(zonasData)
        setFilteredZonas(zonasData)

        // Actualizar información de paginación si está disponible
        if (pagination) {
          setCurrentPage(pagination.currentPage)
          setTotalPages(pagination.totalPages)
        }
      } catch (error) {
        console.error("Error al cargar zonas:", error)
        setError("Ocurrió un error al cargar las zonas. Se muestran datos de ejemplo.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchZonas()
  }, [empresaId, currentPage, searchQuery, filtros])

  // Este efecto solo se usa para mantener filteredZonas sincronizado con zonas
  useEffect(() => {
    setFilteredZonas(zonas)
  }, [zonas])

  const toggleFiltro = (filtro: string) => {
    setCurrentPage(1) // Resetear a la primera página al cambiar filtros
    if (filtros.includes(filtro)) {
      setFiltros(filtros.filter((f) => f !== filtro))
    } else {
      // Permitir seleccionar ambos filtros simultáneamente
      setFiltros([...filtros, filtro])
    }
  }

  const limpiarFiltros = () => {
    setFiltros([])
    setSearchTerm("")
    setSearchQuery("")
    setCurrentPage(1)
  }

  const handleSubmitSearch = (e: FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchTerm)
    setCurrentPage(1)
  }

  const handleToggleEstado = async (id: number) => {
    try {
      await ZonaService.toggleEstado(id)
      // Recargar datos después de cambiar el estado
      const { zonas: updatedZonas } = await ZonaService.getAll(empresaId ? Number(empresaId) : undefined, currentPage)
      setZonas(updatedZonas)
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      alert("Error al cambiar el estado de la zona")
    }
  }

  const handleEditZona = (id: number) => {
    router.push(`/zona/editar/${id}`)
  }

  // Paginación
  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f6fb]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#303e65] border-t-[#f5d433] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-[1600px] mx-auto">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Zonas</h1>
        <p className="text-sm sm:text-base text-gray-600">Administra las zonas con las que trabaja CIDSON.</p>
        {error && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-card p-3 sm:p-4 md:p-5 mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Contador de registros */}
          <div className="flex items-center mb-3 lg:mb-0">
            <span className="text-xl sm:text-2xl font-bold text-[#f5d538] mr-2">{filteredZonas.length}</span>
            <span className="text-sm sm:text-base text-gray-600 font-medium">REGISTROS</span>
          </div>

          {/* Barra de búsqueda, filtros y botón nueva zona */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            {/* Primer grupo: Búsqueda y filtros */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <form onSubmit={handleSubmitSearch} className="relative w-full sm:w-56">
                <input
                  type="text"
                  placeholder="Buscar zona..."
                  className="pl-9 bg-gray-50 border border-gray-200 rounded-md w-full p-2 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <button type="submit" className="sr-only">
                  Buscar
                </button>
              </form>

              <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-2">
                <button
                  className={`px-3 py-2 text-sm rounded-md border border-[#00b276] text-[#00b276] ${
                    filtros.includes("1") ? "bg-green-50" : ""
                  }`}
                  onClick={() => toggleFiltro("1")}
                >
                  Activas {filtros.includes("1") && <span className="ml-1">✓</span>}
                </button>

                <button
                  className={`px-3 py-2 text-sm rounded-md border border-[#00b276] text-[#00b276] ${
                    filtros.includes("2") ? "bg-green-50" : ""
                  }`}
                  onClick={() => toggleFiltro("2")}
                >
                  Inactivas {filtros.includes("2") && <span className="ml-1">✓</span>}
                </button>

                <button
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 flex items-center"
                  onClick={limpiarFiltros}
                  disabled={filtros.length === 0 && !searchTerm && !searchQuery}
                >
                  <Filter className="mr-1 h-4 w-4" /> Limpiar
                </button>
              </div>
            </div>

            {/* Filtros solo para móvil */}
            <div className="flex sm:hidden flex-wrap items-center gap-2 w-full">
              <button
                className={`flex-1 px-3 py-2 text-sm rounded-md border border-[#00b276] text-[#00b276] ${
                  filtros.includes("1") ? "bg-green-50" : ""
                }`}
                onClick={() => toggleFiltro("1")}
              >
                Activas {filtros.includes("1") && <span className="ml-1">✓</span>}
              </button>

              <button
                className={`flex-1 px-3 py-2 text-sm rounded-md border border-[#00b276] text-[#00b276] ${
                  filtros.includes("2") ? "bg-green-50" : ""
                }`}
                onClick={() => toggleFiltro("2")}
              >
                Inactivas {filtros.includes("2") && <span className="ml-1">✓</span>}
              </button>

              <button
                className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 flex items-center justify-center"
                onClick={limpiarFiltros}
                disabled={filtros.length === 0 && !searchTerm && !searchQuery}
              >
                <Filter className="mr-1 h-4 w-4" /> Limpiar
              </button>
            </div>

            {/* Botón de Nueva Zona */}
            <Link
              href="/zona/nueva"
              className="px-4 py-2 text-sm rounded-md bg-[#303e65] text-white flex items-center justify-center sm:justify-start w-full sm:w-auto sm:ml-auto"
            >
              <Plus className="mr-1 h-4 w-4" /> Nueva Zona
            </Link>
          </div>
        </div>
      </div>

      {/* Tabla de zonas */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f4f6fb]">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Nombre</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Estado</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredZonas.map((zona) => (
                <tr key={zona.id} className="border-t border-gray-100">
                  <td className="py-3 px-4 text-gray-800">{zona.nombre}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          zona.estado === "Activa" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {zona.estado}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-4">
                      {/* Botón de editar con SVG inline */}
                      <button
                        onClick={() => handleEditZona(zona.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#2C4874] hover:bg-gray-50"
                        aria-label="Editar"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M8.90469 3.76136L12.2385 7.09513L4.99932 14.3343L2.02701 14.6624C1.6291 14.7064 1.29291 14.3699 1.33718 13.972L1.6679 10.9976L8.90469 3.76136ZM14.3004 3.26502L12.7351 1.6997C12.2468 1.21143 11.4549 1.21143 10.9666 1.6997L9.494 3.17232L12.8278 6.50608L14.3004 5.03346C14.7887 4.54494 14.7887 3.75329 14.3004 3.26502Z"
                            fill="#2C4874"
                          />
                        </svg>
                      </button>

                      {/* Botón de activar/desactivar con SVG inline */}
                      <button
                        onClick={() => handleToggleEstado(zona.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#2C4874] hover:bg-gray-50"
                        aria-label={zona.estado === "Activa" ? "Desactivar" : "Activar"}
                      >
                        {zona.estado === "Activa" ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.5272 7.99992L14.3177 4.20939C14.7829 3.74424 14.7829 2.99007 14.3177 2.52454L13.4753 1.68212C13.0101 1.21696 12.256 1.21696 11.7904 1.68212L7.99992 5.47265L4.20939 1.68212C3.74424 1.21696 2.99007 1.21696 2.52454 1.68212L1.68212 2.52454C1.21696 2.98969 1.21696 3.74386 1.68212 4.20939L5.47265 7.99992L1.68212 11.7904C1.21696 12.2556 1.21696 13.0098 1.68212 13.4753L2.52454 14.3177C2.98969 14.7829 3.74424 14.7829 4.20939 14.3177L7.99992 10.5272L11.7904 14.3177C12.2556 14.7829 13.0101 14.7829 13.4753 14.3177L14.3177 13.4753C14.7829 13.0101 14.7829 12.256 14.3177 11.7904L10.5272 7.99992Z"
                              fill="#2C4874"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.86184 12.7761L1.52851 8.44278C1.26817 8.18244 1.26817 7.76033 1.52851 7.49997L2.47129 6.55715C2.73163 6.29679 3.15377 6.29679 3.41411 6.55715L6.33325 9.47627L12.5857 3.22382C12.8461 2.96348 13.2682 2.96348 13.5285 3.22382L14.4713 4.16663C14.7317 4.42697 14.7317 4.84908 14.4713 5.10945L6.80466 12.7761C6.54429 13.0365 6.12218 13.0365 5.86184 12.7761Z"
                              fill="#2C4874"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredZonas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron zonas con los filtros aplicados</p>
            <button className="mt-4 px-4 py-2 rounded-md border border-gray-300" onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Paginación */}
        {filteredZonas.length > 0 && (
          <div className="flex justify-center py-4 border-t border-gray-100">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-gray-500 text-sm disabled:opacity-50"
              >
                « Primera
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-gray-500 text-sm disabled:opacity-50"
              >
                ‹ Anterior
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      currentPage === pageNum ? "bg-[#303e65] text-white" : "text-gray-500"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-gray-500 text-sm disabled:opacity-50"
              >
                Siguiente ›
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-gray-500 text-sm disabled:opacity-50"
              >
                Última »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
