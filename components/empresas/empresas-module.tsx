"use client";

import { useState, useEffect } from "react";
import { Filter, Plus, Search, Check } from "lucide-react";
import EmpresaCard from "./empresa-card";
import type { Empresa } from "@/types/empresa";
import Link from "next/link";
import {
  EmpresaService,
  type EmpresaSearchParams,
} from "@/services/empresa-service";

// Tipo para el filtro de estado
type EstadoFilter = "todas" | "activas" | "inactivas";

export default function EmpresasModule() {
  const [filtros, setFiltros] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<EstadoFilter>("todas");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [filteredEmpresas, setFilteredEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });
  const [showEstadoDropdown, setShowEstadoDropdown] = useState(false);

  // Función para cargar las empresas desde la API
  const loadEmpresas = async (params?: EmpresaSearchParams) => {
    setIsLoading(true);
    setError(null);

    try {
      // Preparar los parámetros de búsqueda
      const searchParams: EmpresaSearchParams = { ...params };

      // Agregar el filtro de estado si no es "todas"
      if (estadoFilter !== "todas") {
        searchParams.estado = estadoFilter === "activas" ? 1 : 0;
      }

      const { empresas, pagination } = await EmpresaService.getAll(
        searchParams
      );
      setEmpresas(empresas);
      setFilteredEmpresas(empresas);
      setPagination({
        currentPage: pagination.current_page,
        totalPages: pagination.last_page,
        total: pagination.total,
      });
    } catch (err) {
      console.error("Error al cargar empresas:", err);
      setError(
        "No se pudieron cargar las empresas. Por favor, intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar empresas al montar el componente o cuando cambia el filtro de estado
  useEffect(() => {
    loadEmpresas({
      nombre: searchTerm,
      page: 1, // Resetear a la primera página cuando cambia el filtro
    });
  }, [estadoFilter]);

  // Función para manejar la búsqueda
  const handleSearch = () => {
    loadEmpresas({
      nombre: searchTerm,
      page: 1, // Resetear a la primera página cuando se realiza una búsqueda
    });
  };

  // Función para manejar el cambio de página
  const handlePageChange = (page: number) => {
    loadEmpresas({
      nombre: searchTerm,
      page,
    });
  };

  // Función para manejar el cambio de estado de una empresa
  const handleStatusChange = (updatedEmpresa: Empresa) => {
    // Actualizar la lista de empresas con la empresa actualizada
    const updatedEmpresas = empresas.map((emp) =>
      emp.id === updatedEmpresa.id ? updatedEmpresa : emp
    );
    setEmpresas(updatedEmpresas);

    // Aplicar filtros si es necesario
    if (estadoFilter !== "todas") {
      const filteredList = updatedEmpresas.filter(
        (emp) =>
          (estadoFilter === "activas" && emp.estado === "Activo") ||
          (estadoFilter === "inactivas" && emp.estado === "Inactivo")
      );
      setFilteredEmpresas(filteredList);
    } else {
      setFilteredEmpresas(updatedEmpresas);
    }
  };

  // Función para cambiar el filtro de estado
  const handleEstadoFilterChange = (estado: EstadoFilter) => {
    setEstadoFilter(estado);
    setShowEstadoDropdown(false);
  };

  const toggleFiltro = (filtro: string) => {
    if (filtros.includes(filtro)) {
      setFiltros(filtros.filter((f) => f !== filtro));
    } else {
      setFiltros([...filtros, filtro]);
    }
  };

  const limpiarFiltros = () => {
    setFiltros([]);
    setSearchTerm("");
    setEstadoFilter("todas");
    loadEmpresas(); // Recargar sin filtros
  };

  // Obtener el texto del filtro de estado para mostrar en el botón
  const getEstadoFilterText = () => {
    switch (estadoFilter) {
      case "activas":
        return "Activas";
      case "inactivas":
        return "Inactivas";
      default:
        return "Todas";
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-[1600px] mx-auto">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
          Empresas
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Crea y selecciona la empresa para trabajar con CIDSON
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-card p-3 sm:p-4 md:p-5 mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Contador de registros */}
          <div className="flex items-center mb-3 lg:mb-0">
            <span className="text-xl sm:text-2xl font-bold text-[#f5d538] mr-2">
              {pagination.total}
            </span>
            <span className="text-sm sm:text-base text-gray-600 font-medium">
              REGISTROS
            </span>
          </div>

          {/* Barra de búsqueda, filtros y botón nueva empresa */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            {/* Primer grupo: Búsqueda y filtros */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  placeholder="Buscar empresa..."
                  className="pl-9 bg-gray-50 border border-gray-200 rounded-md w-full p-2 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Search
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 cursor-pointer"
                  onClick={handleSearch}
                />
              </div>

              <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-2">
                {/* Filtro de Estado */}
                <div className="relative">
                  <button
                    className={`px-3 py-2 text-sm rounded-md border border-[#00b276] text-[#00b276] ${
                      estadoFilter !== "todas" ? "bg-green-50" : ""
                    } flex items-center`}
                    onClick={() => setShowEstadoDropdown(!showEstadoDropdown)}
                  >
                    Estado: {getEstadoFilterText()}
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {showEstadoDropdown && (
                    <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg">
                      <ul className="py-1">
                        <li
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => handleEstadoFilterChange("todas")}
                        >
                          Todas
                          {estadoFilter === "todas" && (
                            <Check className="ml-auto h-4 w-4 text-[#00b276]" />
                          )}
                        </li>
                        <li
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => handleEstadoFilterChange("activas")}
                        >
                          Activas
                          {estadoFilter === "activas" && (
                            <Check className="ml-auto h-4 w-4 text-[#00b276]" />
                          )}
                        </li>
                        <li
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => handleEstadoFilterChange("inactivas")}
                        >
                          Inactivas
                          {estadoFilter === "inactivas" && (
                            <Check className="ml-auto h-4 w-4 text-[#00b276]" />
                          )}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  className={`px-3 py-2 text-sm rounded-md border border-[#00b276] text-[#00b276] ${
                    filtros.includes("1") ? "bg-green-50" : ""
                  }`}
                  onClick={() => toggleFiltro("1")}
                >
                  Filtro 1{" "}
                  {filtros.includes("1") && <span className="ml-1">✓</span>}
                </button>

                <button
                  className={`px-3 py-2 text-sm rounded-md border border-[#00b276] text-[#00b276] ${
                    filtros.includes("2") ? "bg-green-50" : ""
                  }`}
                  onClick={() => toggleFiltro("2")}
                >
                  Filtro 2{" "}
                  {filtros.includes("2") && <span className="ml-1">✓</span>}
                </button>

                <button
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 flex items-center"
                  onClick={limpiarFiltros}
                  disabled={
                    filtros.length === 0 &&
                    !searchTerm &&
                    estadoFilter === "todas"
                  }
                >
                  <Filter className="mr-1 h-4 w-4" /> Limpiar
                </button>
              </div>
            </div>

            {/* Filtros solo para móvil */}
            <div className="flex sm:hidden flex-wrap items-center gap-2 w-full">
              {/* Filtro de Estado para móvil */}
              <div className="relative w-full">
                <button
                  className={`w-full px-3 py-2 text-sm rounded-md border border-[#00b276] text-[#00b276] ${
                    estadoFilter !== "todas" ? "bg-green-50" : ""
                  } flex items-center justify-between`}
                  onClick={() => setShowEstadoDropdown(!showEstadoDropdown)}
                >
                  <span>Estado: {getEstadoFilterText()}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showEstadoDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
                    <ul className="py-1">
                      <li
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleEstadoFilterChange("todas")}
                      >
                        Todas
                        {estadoFilter === "todas" && (
                          <Check className="ml-auto h-4 w-4 text-[#00b276]" />
                        )}
                      </li>
                      <li
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleEstadoFilterChange("activas")}
                      >
                        Activas
                        {estadoFilter === "activas" && (
                          <Check className="ml-auto h-4 w-4 text-[#00b276]" />
                        )}
                      </li>
                      <li
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleEstadoFilterChange("inactivas")}
                      >
                        Inactivas
                        {estadoFilter === "inactivas" && (
                          <Check className="ml-auto h-4 w-4 text-[#00b276]" />
                        )}
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex w-full gap-2">
                <button
                  className={`flex-1 px-3 py-2 text-sm rounded-md border border-[#00b276] text-[#00b276] ${
                    filtros.includes("1") ? "bg-green-50" : ""
                  }`}
                  onClick={() => toggleFiltro("1")}
                >
                  Filtro 1{" "}
                  {filtros.includes("1") && <span className="ml-1">✓</span>}
                </button>

                <button
                  className={`flex-1 px-3 py-2 text-sm rounded-md border border-[#00b276] text-[#00b276] ${
                    filtros.includes("2") ? "bg-green-50" : ""
                  }`}
                  onClick={() => toggleFiltro("2")}
                >
                  Filtro 2{" "}
                  {filtros.includes("2") && <span className="ml-1">✓</span>}
                </button>

                <button
                  className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 flex items-center justify-center"
                  onClick={limpiarFiltros}
                  disabled={
                    filtros.length === 0 &&
                    !searchTerm &&
                    estadoFilter === "todas"
                  }
                >
                  <Filter className="mr-1 h-4 w-4" /> Limpiar
                </button>
              </div>
            </div>

            {/* Botón de Nueva Empresa */}
            <Link
              href="/empresas/nueva"
              className="px-4 py-2 text-sm rounded-md bg-[#303e65] text-white flex items-center justify-center sm:justify-start w-full sm:w-auto sm:ml-auto"
            >
              <Plus className="mr-1 h-4 w-4" /> Nueva Empresa
            </Link>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Cargando empresas...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            className="mt-4 px-4 py-2 rounded-md border border-gray-300"
            onClick={() => loadEmpresas()}
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {filteredEmpresas.map((empresa) => (
              <EmpresaCard
                key={empresa.id}
                empresa={empresa}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>

          {filteredEmpresas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No se encontraron empresas con los filtros aplicados
              </p>
              <button
                className="mt-4 px-4 py-2 rounded-md border border-gray-300"
                onClick={limpiarFiltros}
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </>
      )}

      {/* Paginación */}
      {filteredEmpresas.length > 0 && (
        <div className="flex justify-center mt-6 sm:mt-8 md:mt-10">
          <div className="flex flex-wrap items-center justify-center gap-1 text-sm">
            <button
              className="px-2 sm:px-3 py-1 text-gray-500 text-xs sm:text-sm"
              onClick={() => handlePageChange(1)}
              disabled={pagination.currentPage === 1}
            >
              « Primera
            </button>
            <button
              className="px-2 sm:px-3 py-1 text-gray-500 text-xs sm:text-sm"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              ‹ Anterior
            </button>

            {/* Generar botones de página */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`px-2 sm:px-3 py-1 ${
                    page === pagination.currentPage
                      ? "bg-[#303e65] text-white"
                      : "text-gray-500"
                  } rounded-md text-xs sm:text-sm`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="px-2 sm:px-3 py-1 text-gray-500 text-xs sm:text-sm"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Siguiente ›
            </button>
            <button
              className="px-2 sm:px-3 py-1 text-gray-500 text-xs sm:text-sm"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Última »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
