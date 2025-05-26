"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Filter, Plus, Search, ArrowLeft } from "lucide-react";
import type { Actividad } from "@/types/actividad";
import { ActividadService } from "@/services/actividad-service";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { EmpresaService } from "@/services/empresa-service";

interface ActividadesModuleProps {
  empresaId?: string;
  configuracionId?: string;
}

export default function ActividadesModule({
  empresaId,
  configuracionId,
}: ActividadesModuleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const returnToParam = searchParams.get("returnTo");

  const [filtros, setFiltros] = useState<string[]>([]);
  const [inputSearchTerm, setInputSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    pageParam ? Number.parseInt(pageParam) : 1
  );
  const [configuracionIdState, setConfiguracionIdState] = useState<
    number | null
  >(configuracionId ? Number(configuracionId) : null);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<{
    totalPages: number;
    totalItems: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
  }>({
    totalPages: 1,
    totalItems: 0,
    links: [],
  });

  // Obtener el configuracion_id de la empresa si no se proporcionó como parámetro
  useEffect(() => {
    const fetchEmpresaConfiguracion = async () => {
      // Si ya tenemos el configuracionId del parámetro, no necesitamos obtenerlo de la empresa
      if (configuracionId) {
        console.log("Usando configuracionId del parámetro:", configuracionId);
        return;
      }

      if (!empresaId) {
        setError("No se proporcionó ID de empresa");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Obteniendo configuración para empresa ID:", empresaId);
        const empresa = await EmpresaService.getById(Number(empresaId));
        console.log("Empresa obtenida:", empresa);

        if (empresa && empresa.configuracion_id) {
          console.log(
            "Configuración ID obtenido de la empresa:",
            empresa.configuracion_id
          );
          setConfiguracionIdState(empresa.configuracion_id);
        } else {
          console.error(
            "No se encontró configuracion_id en la empresa:",
            empresa
          );

          // Si no hay configuracion_id
          console.log("Usando configuracion_id por defecto: 1");
          setConfiguracionIdState(1);
        }
      } catch (error) {
        console.error(
          "Error al obtener la configuración de la empresa:",
          error
        );
        setError("Error al cargar la configuración de la empresa");
      }
    };

    fetchEmpresaConfiguracion();
  }, [empresaId, configuracionId]);

  // Cargar actividades
  useEffect(() => {
    const fetchActividades = async () => {
      if (!configuracionIdState) {
        console.log("No hay configuracionId, no se pueden cargar actividades");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Preparar filtros para la API
        const apiFilters: { nombre?: string; estado?: number; page?: number } =
          {
            page: currentPage,
          };

        if (appliedSearchTerm) {
          apiFilters.nombre = appliedSearchTerm;
        }

        // Aplicar filtros de estado
        if (filtros.includes("1") && !filtros.includes("2")) {
          apiFilters.estado = 1; // Activas
        } else if (!filtros.includes("1") && filtros.includes("2")) {
          apiFilters.estado = 0; // Inactivas
        }

        const response = await ActividadService.getAll(
          configuracionIdState,
          apiFilters
        );
        setActividades(response.data);
        setPaginationInfo({
          totalPages: response.meta.last_page,
          totalItems: response.meta.total,
          links: response.meta.links,
        });
      } catch (error) {
        console.error("Error al cargar actividades:", error);
        if (error instanceof Error) {
          if (error.message.includes("Unauthenticated")) {
            router.push("/login");
            return;
          }
          setError(
            error.message ||
              "Error al cargar las actividades. Por favor, intente nuevamente."
          );
        } else {
          setError(
            "Error al cargar las actividades. Por favor, intente nuevamente."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (configuracionIdState) {
      fetchActividades();
    } else {
      setIsLoading(false);
    }
  }, [configuracionIdState, appliedSearchTerm, filtros, currentPage, router]);

  const toggleFiltro = (filtro: string) => {
    const newFiltros = filtros.includes(filtro)
      ? filtros.filter((f) => f !== filtro)
      : [...filtros, filtro];

    setFiltros(newFiltros);
    // Resetear a la primera página cuando se cambian los filtros
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setAppliedSearchTerm(inputSearchTerm);
    setCurrentPage(1); // Resetear a la primera página al buscar
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const limpiarFiltros = () => {
    setFiltros([]);
    setInputSearchTerm("");
    setAppliedSearchTerm("");
    setCurrentPage(1);
  };

  // Reemplazar el método handleToggleEstado con esta implementación mejorada
  const handleToggleEstado = async (id: number) => {
    if (!configuracionIdState) return;

    try {
      await ActividadService.toggleEstado(id);

      // Recargar actividades después de cambiar el estado
      const response = await ActividadService.getAll(configuracionIdState, {
        nombre: appliedSearchTerm || undefined,
        page: currentPage,
        estado: getEstadoFilter(),
      });

      setActividades(response.data);
      setPaginationInfo({
        totalPages: response.meta.last_page,
        totalItems: response.meta.total,
        links: response.meta.links,
      });
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      if (error instanceof Error) {
        setError(
          error.message ||
            "Error al cambiar el estado de la actividad. Por favor, intente nuevamente."
        );
      } else {
        setError(
          "Error al cambiar el estado de la actividad. Por favor, intente nuevamente."
        );
      }
    }
  };

  const handleEditActividad = (id: number) => {
    const params = new URLSearchParams();
    if (empresaId) params.append("empresaId", empresaId);
    if (configuracionIdState)
      params.append("configuracionId", configuracionIdState.toString());

    router.push(`/actividades/editar/${id}?${params.toString()}`);
  };

  const getEstadoFilter = (): number | undefined => {
    if (filtros.includes("1") && !filtros.includes("2")) {
      return 1; // Activas
    } else if (!filtros.includes("1") && filtros.includes("2")) {
      return 0; // Inactivas
    }
    return undefined;
  };

  const goToPage = (page: number) => {
    if (page > 0 && page <= paginationInfo.totalPages) {
      setCurrentPage(page);

      // Actualizar la URL con el nuevo número de página
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());

      // Mantener los otros parámetros
      if (empresaId) params.set("empresaId", empresaId);
      if (configuracionIdState)
        params.set("configuracionId", configuracionIdState.toString());
      if (returnToParam) params.set("returnTo", returnToParam);

      // Actualizar la URL sin recargar la página
      router.push(`/actividades?${params.toString()}`, { scroll: false });
    }
  };

  // Modificar la función handleVolver para que redirija a empresas/catalogos
  const handleVolver = () => {
    router.push(`/empresas/catalogos/${empresaId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f6fb]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#303e65] border-t-[#f5d433] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f6fb]">
        <div className="text-center">
          <p className="text-xl text-gray-700">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-[#303e65] text-white rounded-md"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-[1600px] mx-auto">
      {/* Botón Volver */}
      <button
        onClick={handleVolver}
        className="mb-4 flex items-center text-[#303e65] hover:text-[#1a2540] transition-colors"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        <span>Volver</span>
      </button>

      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
          Actividades
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Administra las actividades con las que trabaja CIDSON.
        </p>
        {configuracionIdState && (
          <p className="text-sm text-gray-500">
            Configuración ID: {configuracionIdState}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-card p-3 sm:p-4 md:p-5 mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Contador de registros */}
          <div className="flex items-center mb-3 lg:mb-0">
            <span className="text-xl sm:text-2xl font-bold text-[#f5d538] mr-2">
              {paginationInfo.totalItems}
            </span>
            <span className="text-sm sm:text-base text-gray-600 font-medium">
              REGISTROS
            </span>
          </div>

          {/* Barra de búsqueda, filtros y botón nueva actividad */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            {/* Primer grupo: Búsqueda y filtros */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  placeholder="Buscar actividad..."
                  className="pl-9 bg-gray-50 border border-gray-200 rounded-md w-full p-2 text-sm"
                  value={inputSearchTerm}
                  onChange={(e) => setInputSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Buscar"
                >
                  <Search className="h-4 w-4" />
                </button>
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-2">
                <button
                  className={`px-3 py-2 text-sm rounded-md border border-[#00b276] text-[#00b276] ${
                    filtros.includes("1") ? "bg-green-50" : ""
                  }`}
                  onClick={() => toggleFiltro("1")}
                >
                  Activas{" "}
                  {filtros.includes("1") && <span className="ml-1">✓</span>}
                </button>

                <button
                  className={`px-3 py-2 text-sm rounded-md border border-[#00b276] text-[#00b276] ${
                    filtros.includes("2") ? "bg-green-50" : ""
                  }`}
                  onClick={() => toggleFiltro("2")}
                >
                  Inactivas{" "}
                  {filtros.includes("2") && <span className="ml-1">✓</span>}
                </button>

                <button
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 flex items-center"
                  onClick={limpiarFiltros}
                  disabled={
                    filtros.length === 0 &&
                    !inputSearchTerm &&
                    !appliedSearchTerm
                  }
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
                Activas{" "}
                {filtros.includes("1") && <span className="ml-1">✓</span>}
              </button>

              <button
                className={`flex-1 px-3 py-2 text-sm rounded-md border border-[#00b276] text-[#00b276] ${
                  filtros.includes("2") ? "bg-green-50" : ""
                }`}
                onClick={() => toggleFiltro("2")}
              >
                Inactivas{" "}
                {filtros.includes("2") && <span className="ml-1">✓</span>}
              </button>

              <button
                className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 flex items-center justify-center"
                onClick={limpiarFiltros}
                disabled={
                  filtros.length === 0 && !inputSearchTerm && !appliedSearchTerm
                }
              >
                <Filter className="mr-1 h-4 w-4" /> Limpiar
              </button>
            </div>

            {/* Botón de Nueva Actividad */}
            <Link
              href={`/actividades/nueva?${new URLSearchParams({
                ...(empresaId ? { empresaId } : {}),
                ...(configuracionIdState
                  ? { configuracionId: configuracionIdState.toString() }
                  : {}),
                ...(returnToParam ? { returnTo: returnToParam } : {}),
              }).toString()}`}
              className="px-4 py-2 text-sm rounded-md bg-[#303e65] text-white flex items-center justify-center sm:justify-start w-full sm:w-auto sm:ml-auto"
            >
              <Plus className="mr-1 h-4 w-4" /> Nueva Actividad
            </Link>
          </div>
        </div>
      </div>

      {/* Tabla de actividades */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f4f6fb]">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Nombre
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">
                  Fecha Creación
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">
                  Estado
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {actividades.map((actividad) => (
                <tr key={actividad.id} className="border-t border-gray-100">
                  <td className="py-3 px-4 text-gray-800">
                    {actividad.nombre}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-800">
                    {/* Mostrar la fecha exactamente como viene de la API */}
                    {actividad.fecha_creacion || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          actividad.estado
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {actividad.estado ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-4">
                      {/* Botón de editar con SVG inline */}
                      <button
                        onClick={() => handleEditActividad(actividad.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#2C4874] hover:bg-gray-50"
                        aria-label="Editar"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.90469 3.76136L12.2385 7.09513L4.99932 14.3343L2.02701 14.6624C1.6291 14.7064 1.29291 14.3699 1.33718 13.972L1.6679 10.9976L8.90469 3.76136ZM14.3004 3.26502L12.7351 1.6997C12.2468 1.21143 11.4549 1.21143 10.9666 1.6997L9.494 3.17232L12.8278 6.50608L14.3004 5.03346C14.7887 4.54494 14.7887 3.75329 14.3004 3.26502Z"
                            fill="#2C4874"
                          />
                        </svg>
                      </button>

                      {/* Botón de activar/desactivar con SVG inline */}
                      <button
                        onClick={() => handleToggleEstado(actividad.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#2C4874] hover:bg-gray-50"
                        aria-label={actividad.estado ? "Desactivar" : "Activar"}
                      >
                        {actividad.estado ? (
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

        {actividades.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron actividades con los filtros aplicados
            </p>
            <button
              className="mt-4 px-4 py-2 rounded-md border border-gray-300"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Paginación del servidor */}
        {actividades.length > 0 && paginationInfo.totalPages > 0 && (
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

              {paginationInfo.links
                .filter(
                  (link) =>
                    !link.label.includes("Previous") &&
                    !link.label.includes("Next")
                )
                .map((link, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (link.url) {
                        const url = new URL(link.url);
                        const page = url.searchParams.get("page");
                        if (page) {
                          goToPage(Number.parseInt(page));
                        }
                      }
                    }}
                    className={`px-3 py-1 text-sm rounded-md ${
                      link.active ? "bg-[#303e65] text-white" : "text-gray-500"
                    }`}
                    disabled={!link.url}
                  >
                    {link.label}
                  </button>
                ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === paginationInfo.totalPages}
                className="px-3 py-1 text-gray-500 text-sm disabled:opacity-50"
              >
                Siguiente ›
              </button>
              <button
                onClick={() => goToPage(paginationInfo.totalPages)}
                disabled={currentPage === paginationInfo.totalPages}
                className="px-3 py-1 text-gray-500 text-sm disabled:opacity-50"
              >
                Última »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
