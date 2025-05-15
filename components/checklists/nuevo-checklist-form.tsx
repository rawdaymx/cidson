"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type {
  ChecklistFormData,
  ZonaChecklist,
  ActividadChecklist,
  MetodoChecklist,
  MaterialChecklist,
  DiaSemana,
} from "@/types/checklist"
import { useRouter } from "next/navigation"
import {
  getAreas,
  getZonasByAreaId,
  getActividadesByZonaId,
  getMetodosByActividadId,
  getMaterialesByMetodoId,
} from "@/services/checklist-form-service"
import type { Area } from "@/types/area"
import { ChevronDown, ChevronLeft, Plus, X, Check, FileOutputIcon as FileExport } from "lucide-react"

export default function NuevoChecklistForm() {
  const router = useRouter()
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<ChecklistFormData>({
    area: "",
    fechaInicio: "",
    fechaFin: "",
    mostrarMetodos: true,
    mostrarMateriales: true,
    zonas: [],
  })

  // Añadir este estado después de los otros estados
  const [openMaterialDropdown, setOpenMaterialDropdown] = useState<string | null>(null)

  // Cargar áreas al iniciar
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const areasData = await getAreas()
        setAreas(areasData)
      } catch (error) {
        console.error("Error al cargar áreas:", error)
        setError("No se pudieron cargar las áreas")
      }
    }

    fetchAreas()
  }, [])

  const handleAreaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const areaId = e.target.value
    setFormData({
      ...formData,
      area: areaId,
      zonas: [],
    })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const addZona = async () => {
    if (!formData.area) {
      setError("Selecciona un área primero")
      return
    }

    try {
      const zonasData = await getZonasByAreaId(formData.area)
      if (zonasData.length === 0) {
        setError("No hay zonas disponibles para esta área")
        return
      }

      const newZona: ZonaChecklist = {
        id: `temp-zona-${Date.now()}`,
        nombre: "",
        actividades: [],
      }

      setFormData({
        ...formData,
        zonas: [...formData.zonas, newZona],
      })
    } catch (error) {
      console.error("Error al añadir zona:", error)
      setError("No se pudo añadir la zona")
    }
  }

  const removeZona = (zonaIndex: number) => {
    const updatedZonas = [...formData.zonas]
    updatedZonas.splice(zonaIndex, 1)
    setFormData({
      ...formData,
      zonas: updatedZonas,
    })
  }

  const handleZonaChange = async (zonaIndex: number, zonaId: string) => {
    const updatedZonas = [...formData.zonas]
    updatedZonas[zonaIndex] = {
      ...updatedZonas[zonaIndex],
      nombre: zonaId,
      actividades: [],
    }

    setFormData({
      ...formData,
      zonas: updatedZonas,
    })
  }

  const addActividad = async (zonaIndex: number) => {
    const zonaId = formData.zonas[zonaIndex].nombre
    if (!zonaId) {
      setError("Selecciona una zona primero")
      return
    }

    try {
      const actividadesData = await getActividadesByZonaId(zonaId)
      if (actividadesData.length === 0) {
        setError("No hay actividades disponibles para esta zona")
        return
      }

      const newActividad: ActividadChecklist = {
        id: `temp-actividad-${Date.now()}`,
        nombre: "",
        metodos: [],
      }

      const updatedZonas = [...formData.zonas]
      updatedZonas[zonaIndex] = {
        ...updatedZonas[zonaIndex],
        actividades: [...updatedZonas[zonaIndex].actividades, newActividad],
      }

      setFormData({
        ...formData,
        zonas: updatedZonas,
      })
    } catch (error) {
      console.error("Error al añadir actividad:", error)
      setError("No se pudo añadir la actividad")
    }
  }

  const removeActividad = (zonaIndex: number, actividadIndex: number) => {
    const updatedZonas = [...formData.zonas]
    updatedZonas[zonaIndex].actividades.splice(actividadIndex, 1)
    setFormData({
      ...formData,
      zonas: updatedZonas,
    })
  }

  const handleActividadChange = async (zonaIndex: number, actividadIndex: number, actividadId: string) => {
    const updatedZonas = [...formData.zonas]
    updatedZonas[zonaIndex].actividades[actividadIndex] = {
      ...updatedZonas[zonaIndex].actividades[actividadIndex],
      nombre: actividadId,
      metodos: [],
    }

    setFormData({
      ...formData,
      zonas: updatedZonas,
    })
  }

  const addMetodo = async (zonaIndex: number, actividadIndex: number) => {
    const actividadId = formData.zonas[zonaIndex].actividades[actividadIndex].nombre
    if (!actividadId) {
      setError("Selecciona una actividad primero")
      return
    }

    try {
      const metodosData = await getMetodosByActividadId(actividadId)
      if (metodosData.length === 0) {
        setError("No hay métodos disponibles para esta actividad")
        return
      }

      const newMetodo: MetodoChecklist = {
        id: `temp-metodo-${Date.now()}`,
        nombre: "",
        materiales: [],
        turnos: [
          { id: `turno-1-${Date.now()}`, numero: 1, dias: [] },
          { id: `turno-2-${Date.now()}`, numero: 2, dias: [] },
          { id: `turno-3-${Date.now()}`, numero: 3, dias: [] },
        ],
      }

      const updatedZonas = [...formData.zonas]
      updatedZonas[zonaIndex].actividades[actividadIndex] = {
        ...updatedZonas[zonaIndex].actividades[actividadIndex],
        metodos: [...updatedZonas[zonaIndex].actividades[actividadIndex].metodos, newMetodo],
      }

      setFormData({
        ...formData,
        zonas: updatedZonas,
      })
    } catch (error) {
      console.error("Error al añadir método:", error)
      setError("No se pudo añadir el método")
    }
  }

  const removeMetodo = (zonaIndex: number, actividadIndex: number, metodoIndex: number) => {
    const updatedZonas = [...formData.zonas]
    updatedZonas[zonaIndex].actividades[actividadIndex].metodos.splice(metodoIndex, 1)
    setFormData({
      ...formData,
      zonas: updatedZonas,
    })
  }

  const handleMetodoChange = async (
    zonaIndex: number,
    actividadIndex: number,
    metodoIndex: number,
    metodoId: string,
  ) => {
    const updatedZonas = [...formData.zonas]
    updatedZonas[zonaIndex].actividades[actividadIndex].metodos[metodoIndex] = {
      ...updatedZonas[zonaIndex].actividades[actividadIndex].metodos[metodoIndex],
      nombre: metodoId,
      materiales: [],
    }

    if (formData.mostrarMateriales) {
      try {
        const materialesData = await getMaterialesByMetodoId(metodoId)
        const materialesChecklist: MaterialChecklist[] = materialesData.map((material) => ({
          id: material.id,
          nombre: material.nombre,
        }))

        updatedZonas[zonaIndex].actividades[actividadIndex].metodos[metodoIndex].materiales = materialesChecklist
      } catch (error) {
        console.error("Error al cargar materiales:", error)
      }
    }

    setFormData({
      ...formData,
      zonas: updatedZonas,
    })
  }

  const toggleDia = (
    zonaIndex: number,
    actividadIndex: number,
    metodoIndex: number,
    turnoIndex: number,
    dia: DiaSemana,
  ) => {
    const updatedZonas = [...formData.zonas]
    const turno = updatedZonas[zonaIndex].actividades[actividadIndex].metodos[metodoIndex].turnos[turnoIndex]

    if (turno.dias.includes(dia)) {
      turno.dias = turno.dias.filter((d) => d !== dia)
    } else {
      turno.dias = [...turno.dias, dia]
    }

    setFormData({
      ...formData,
      zonas: updatedZonas,
    })
  }

  const aplicarATodosTurnos = (
    zonaIndex: number,
    actividadIndex: number,
    metodoIndex: number,
    diasSeleccionados: string[],
  ) => {
    const updatedZonas = [...formData.zonas]
    const turnos = updatedZonas[zonaIndex].actividades[actividadIndex].metodos[metodoIndex].turnos

    turnos.forEach((turno) => {
      turno.dias = [...diasSeleccionados]
    })

    setFormData({
      ...formData,
      zonas: updatedZonas,
    })
  }

  const agregarTurno = (zonaIndex: number, actividadIndex: number, metodoIndex: number) => {
    const updatedZonas = [...formData.zonas]
    const metodo = updatedZonas[zonaIndex].actividades[actividadIndex].metodos[metodoIndex]
    const nuevoNumero = metodo.turnos.length + 1

    metodo.turnos.push({
      id: `turno-${nuevoNumero}-${Date.now()}`,
      numero: nuevoNumero,
      dias: [],
    })

    setFormData({
      ...formData,
      zonas: updatedZonas,
    })
  }

  const removeTurno = (zonaIndex: number, actividadIndex: number, metodoIndex: number, turnoIndex: number) => {
    const updatedZonas = [...formData.zonas]
    updatedZonas[zonaIndex].actividades[actividadIndex].metodos[metodoIndex].turnos.splice(turnoIndex, 1)

    // Renumerar los turnos
    updatedZonas[zonaIndex].actividades[actividadIndex].metodos[metodoIndex].turnos.forEach((turno, idx) => {
      turno.numero = idx + 1
    })

    setFormData({
      ...formData,
      zonas: updatedZonas,
    })
  }

  const handleMaterialSelection = (
    zonaIndex: number,
    actividadIndex: number,
    metodoIndex: number,
    materialId: string,
  ) => {
    try {
      // In a real implementation, this would fetch the material details
      // For now, we'll create a sample material
      const newMaterial = {
        id: materialId || `material-${Date.now()}`,
        nombre:
          materialId === "1"
            ? "Franela Húmeda"
            : materialId === "2"
              ? "Desinfectante"
              : materialId === "3"
                ? "Cepillo"
                : materialId === "4"
                  ? "Detergente"
                  : "Material nuevo",
      }

      const updatedZonas = [...formData.zonas]
      const currentMateriales = updatedZonas[zonaIndex].actividades[actividadIndex].metodos[metodoIndex].materiales

      // Check if material already exists to avoid duplicates
      if (!currentMateriales.some((m) => m.id === newMaterial.id)) {
        updatedZonas[zonaIndex].actividades[actividadIndex].metodos[metodoIndex].materiales = [
          ...currentMateriales,
          newMaterial,
        ]

        setFormData({
          ...formData,
          zonas: updatedZonas,
        })
      }
    } catch (error) {
      console.error("Error al añadir material:", error)
      setError("No se pudo añadir el material")
    }
  }

  const removeMaterial = (zonaIndex: number, actividadIndex: number, metodoIndex: number, materialId: string) => {
    const updatedZonas = [...formData.zonas]
    updatedZonas[zonaIndex].actividades[actividadIndex].metodos[metodoIndex].materiales = updatedZonas[
      zonaIndex
    ].actividades[actividadIndex].metodos[metodoIndex].materiales.filter((m) => m.id !== materialId)

    setFormData({
      ...formData,
      zonas: updatedZonas,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Aquí iría la lógica para enviar el formulario
      console.log("Datos del formulario:", formData)

      // Simulación de envío
      await new Promise((resolve) => setTimeout(resolve, 1000))

      router.push("/checklist")
    } catch (error) {
      console.error("Error al guardar el checklist:", error)
      setError("Ocurrió un error al guardar el checklist. Por favor, inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const diasSemana: DiaSemana[] = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2">
          <button
            onClick={() => router.push("/checklist")}
            className="flex items-center text-[#303e65] hover:text-[#253252] mr-4"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Regresar</span>
          </button>
          <h1 className="text-2xl font-bold">Nuevo registro</h1>
        </div>

        <p className="text-gray-600 mb-6">Crea y registra nuevo personal.</p>

        <div className="flex justify-end gap-2 mb-6">
          <Button
            variant="outline"
            className="flex items-center gap-1 border-[#303e65] text-[#303e65] hover:bg-[#303e65]/10"
          >
            <FileExport className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar en Excel</span>
            <span className="sm:hidden">Exportar</span>
          </Button>
          <Button className="bg-[#f5d433] hover:bg-[#e6c52a] text-black font-medium">Guardar</Button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="area" className="text-sm font-medium text-gray-700 mb-1 block">
                  Área
                </Label>
                <div className="relative">
                  <select
                    id="area"
                    value={formData.area}
                    onChange={handleAreaChange}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#303e65] focus-visible:ring-offset-2 appearance-none pr-10"
                  >
                    <option value="">Seleccionar área</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.nombre}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-500" />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">Campos a mostrar</Label>
                <div className="flex items-center gap-4 sm:gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.mostrarMetodos ? "bg-[#f1f5f9]" : "bg-gray-100"}`}
                      >
                        {formData.mostrarMetodos && (
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        id="mostrarMetodos"
                        name="mostrarMetodos"
                        checked={formData.mostrarMetodos}
                        onChange={handleCheckboxChange}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                    <Label htmlFor="mostrarMetodos" className="cursor-pointer text-sm font-medium">
                      Métodos
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.mostrarMateriales ? "bg-[#f1f5f9]" : "bg-gray-100"}`}
                      >
                        {formData.mostrarMateriales && (
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        id="mostrarMateriales"
                        name="mostrarMateriales"
                        checked={formData.mostrarMateriales}
                        onChange={handleCheckboxChange}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                    <Label htmlFor="mostrarMateriales" className="cursor-pointer text-sm font-medium">
                      Materiales
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="fechaInicio" className="text-sm font-medium text-gray-700 mb-1 block">
                  Fecha de inicio
                </Label>
                <div className="relative">
                  <Input
                    id="fechaInicio"
                    name="fechaInicio"
                    type="date"
                    value={formData.fechaInicio}
                    onChange={handleDateChange}
                    className="w-full border-gray-300 focus:border-[#303e65] focus:ring-[#303e65] placeholder:text-gray-400"
                    placeholder="dd/mm/aaaa"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 1V3M11 1V3M1.5 5.5H14.5M2 2.5H14C14.2761 2.5 14.5 2.72386 14.5 3V13.5C14.5 13.7761 14.2761 14 14 14H2C1.72386 14 1.5 13.7761 1.5 13.5V3C1.5 2.72386 1.72386 2.5 2 2.5Z"
                        stroke="#64748B"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="fechaFin" className="text-sm font-medium text-gray-700 mb-1 block">
                  Fecha de fin
                </Label>
                <div className="relative">
                  <Input
                    id="fechaFin"
                    name="fechaFin"
                    type="date"
                    value={formData.fechaFin}
                    onChange={handleDateChange}
                    className="w-full border-gray-300 focus:border-[#303e65] focus:ring-[#303e65] placeholder:text-gray-400"
                    placeholder="dd/mm/aaaa"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 1V3M11 1V3M1.5 5.5H14.5M2 2.5H14C14.2761 2.5 14.5 2.72386 14.5 3V13.5C14.5 13.7761 14.2761 14 14 14H2C1.72386 14 1.5 13.7761 1.5 13.5V3C1.5 2.72386 1.72386 2.5 2 2.5Z"
                        stroke="#64748B"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Zonas */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Zona</h2>
                <div className="flex items-center gap-2">
                  {formData.zonas.map((_, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        index === 0
                          ? "bg-[#303e65] text-white"
                          : index === 1
                            ? "bg-[#f5d433] text-black"
                            : "bg-white border border-gray-300 text-gray-700"
                      }`}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
              <Button
                type="button"
                onClick={addZona}
                className="bg-[#303e65] hover:bg-[#253252] text-white flex items-center gap-1 w-full sm:w-auto rounded-full"
              >
                <Plus className="h-4 w-4" /> Añadir Zona
              </Button>
            </div>

            {formData.zonas.map((zona, zonaIndex) => (
              <div key={zona.id} className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
                <div className="mb-6">
                  <Label htmlFor={`zona-${zonaIndex}`}>Zona</Label>
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <select
                      id={`zona-${zonaIndex}`}
                      value={zona.nombre}
                      onChange={(e) => handleZonaChange(zonaIndex, e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none pr-10"
                    >
                      <option value="">Seleccionar zona</option>
                      {formData.area && <option value="1">Despeletizadora</option>}
                    </select>
                    <ChevronDown className="absolute right-3 top-[14px] sm:top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
                    <Button
                      type="button"
                      onClick={() => removeZona(zonaIndex)}
                      variant="destructive"
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto rounded-full"
                    >
                      <X className="h-4 w-4 mr-1" /> Eliminar Zona
                    </Button>
                  </div>
                </div>

                {zona.nombre && (
                  <>
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                        <h3 className="font-semibold">Información correspondiente a la zona</h3>
                        <Button
                          type="button"
                          onClick={() => addActividad(zonaIndex)}
                          className="bg-[#303e65] hover:bg-[#253252] text-white w-full sm:w-auto rounded-full"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Añadir Actividades
                        </Button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                        <h4 className="font-medium">Actividades</h4>
                        <div className="flex items-center gap-2">
                          {zona.actividades.map((_, index) => (
                            <div
                              key={index}
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                                index === 0
                                  ? "bg-[#303e65] text-white"
                                  : index === 1
                                    ? "bg-[#f5d433] text-black"
                                    : "bg-white border border-gray-300 text-gray-700"
                              }`}
                            >
                              {index + 1}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actividades */}
                      {zona.actividades.map((actividad, actividadIndex) => (
                        <div key={actividad.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                          <div className="mb-4">
                            <Label htmlFor={`actividad-${zonaIndex}-${actividadIndex}`}>Actividad</Label>
                            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-2">
                              <select
                                id={`actividad-${zonaIndex}-${actividadIndex}`}
                                value={actividad.nombre}
                                onChange={(e) => handleActividadChange(zonaIndex, actividadIndex, e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none pr-10"
                              >
                                <option value="">Seleccionar actividad</option>
                                <option value="1">TRANSPORTADORES DE BOTELLA-BOTE VACÍA</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-[14px] sm:top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
                              <Button
                                type="button"
                                onClick={() => removeActividad(zonaIndex, actividadIndex)}
                                variant="destructive"
                                size="sm"
                                className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto rounded-full"
                              >
                                <X className="h-4 w-4 mr-1" /> Eliminar Actividad
                              </Button>
                            </div>
                          </div>

                          {actividad.nombre && formData.mostrarMetodos && (
                            <>
                              <div className="border-t border-gray-200 pt-4 mb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                                  <h4 className="font-medium">Métodos</h4>
                                  <Button
                                    type="button"
                                    onClick={() => addMetodo(zonaIndex, actividadIndex)}
                                    className="bg-[#303e65] hover:bg-[#253252] text-white rounded-full w-full sm:w-auto"
                                    size="sm"
                                  >
                                    <Plus className="h-4 w-4" /> Método
                                  </Button>
                                </div>

                                {/* Métodos */}
                                {actividad.metodos.map((metodo, metodoIndex) => (
                                  <div key={metodo.id} className="mb-6">
                                    <div className="text-sm text-gray-500 mb-2">Método {metodoIndex + 1}</div>
                                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
                                      <select
                                        value={metodo.nombre}
                                        onChange={(e) =>
                                          handleMetodoChange(zonaIndex, actividadIndex, metodoIndex, e.target.value)
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none pr-10"
                                      >
                                        <option value="">Seleccionar método</option>
                                        <option value="1">Limpieza Externa De Techos Y Cortinas</option>
                                        <option value="2">Limpieza Interna De Techos Y Cortinas</option>
                                      </select>
                                      <ChevronDown className="absolute right-3 top-[14px] sm:top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
                                      <Button
                                        type="button"
                                        onClick={() => removeMetodo(zonaIndex, actividadIndex, metodoIndex)}
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-full"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>

                                    {metodo.nombre && formData.mostrarMateriales && (
                                      <div className="mb-4">
                                        <div className="text-sm text-gray-500 mb-2">Materiales</div>
                                        <div className="relative">
                                          <div className="flex flex-wrap gap-2 p-2 bg-[#f1f5f9] rounded-md border border-gray-200 min-h-[40px]">
                                            {metodo.materiales.length > 0 ? (
                                              metodo.materiales.map((material) => (
                                                <div
                                                  key={material.id}
                                                  className="px-2 py-1.5 bg-[#f1f5f9] rounded-[49px] outline outline-1 outline-offset-[-1px] outline-[#303e65] inline-flex justify-start items-center gap-1"
                                                >
                                                  <div className="text-center justify-start text-[#303e65] text-xs font-normal">
                                                    {material.nombre}
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      removeMaterial(
                                                        zonaIndex,
                                                        actividadIndex,
                                                        metodoIndex,
                                                        material.id,
                                                      )
                                                    }
                                                    className="w-4 h-4 flex items-center justify-center text-[#303e65]"
                                                  >
                                                    <X className="h-4 w-4" />
                                                  </button>
                                                </div>
                                              ))
                                            ) : (
                                              <div className="text-gray-400 text-sm">Seleccione materiales</div>
                                            )}
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const dropdownId = `material-${zonaIndex}-${actividadIndex}-${metodoIndex}`
                                              setOpenMaterialDropdown(
                                                openMaterialDropdown === dropdownId ? null : dropdownId,
                                              )
                                            }}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                          >
                                            <ChevronDown className="h-5 w-5" />
                                          </button>

                                          {/* Dropdown de materiales */}
                                          {openMaterialDropdown ===
                                            `material-${zonaIndex}-${actividadIndex}-${metodoIndex}` && (
                                            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                                              <div className="p-2">
                                                <div
                                                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md flex items-center"
                                                  onClick={() => {
                                                    handleMaterialSelection(zonaIndex, actividadIndex, metodoIndex, "1")
                                                  }}
                                                >
                                                  <div className="w-4 h-4 mr-2 border border-gray-300 rounded-sm flex items-center justify-center">
                                                    {metodo.materiales.some((m) => m.id === "1") && (
                                                      <Check className="h-3 w-3" />
                                                    )}
                                                  </div>
                                                  Franela Húmeda
                                                </div>
                                                <div
                                                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md flex items-center"
                                                  onClick={() => {
                                                    handleMaterialSelection(zonaIndex, actividadIndex, metodoIndex, "2")
                                                  }}
                                                >
                                                  <div className="w-4 h-4 mr-2 border border-gray-300 rounded-sm flex items-center justify-center">
                                                    {metodo.materiales.some((m) => m.id === "2") && (
                                                      <Check className="h-3 w-3" />
                                                    )}
                                                  </div>
                                                  Desinfectante
                                                </div>
                                                <div
                                                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md flex items-center"
                                                  onClick={() => {
                                                    handleMaterialSelection(zonaIndex, actividadIndex, metodoIndex, "3")
                                                  }}
                                                >
                                                  <div className="w-4 h-4 mr-2 border border-gray-300 rounded-sm flex items-center justify-center">
                                                    {metodo.materiales.some((m) => m.id === "3") && (
                                                      <Check className="h-3 w-3" />
                                                    )}
                                                  </div>
                                                  Cepillo
                                                </div>
                                                <div
                                                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md flex items-center"
                                                  onClick={() => {
                                                    handleMaterialSelection(zonaIndex, actividadIndex, metodoIndex, "4")
                                                  }}
                                                >
                                                  <div className="w-4 h-4 mr-2 border border-gray-300 rounded-sm flex items-center justify-center">
                                                    {metodo.materiales.some((m) => m.id === "4") && (
                                                      <Check className="h-3 w-3" />
                                                    )}
                                                  </div>
                                                  Detergente
                                                </div>
                                                <div
                                                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md flex items-center"
                                                  onClick={() => {
                                                    handleMaterialSelection(zonaIndex, actividadIndex, metodoIndex, "5")
                                                  }}
                                                >
                                                  <div className="w-4 h-4 mr-2 border border-gray-300 rounded-sm flex items-center justify-center">
                                                    {metodo.materiales.some((m) => m.id === "5") && (
                                                      <Check className="h-3 w-3" />
                                                    )}
                                                  </div>
                                                  Escoba
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {metodo.nombre && (
                                      <div>
                                        {metodo.turnos.map((turno, turnoIndex) => (
                                          <div key={turno.id} className="mb-4">
                                            <div className="text-sm text-gray-500 mb-2">Turno {turno.numero}</div>
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                              <div className="relative flex-grow">
                                                <div className="flex flex-wrap gap-2 p-2 bg-[#f1f5f9] rounded-md border border-gray-200 min-h-[40px]">
                                                  {turno.dias.length > 0 ? (
                                                    turno.dias.map((dia) => (
                                                      <div
                                                        key={dia}
                                                        className="px-2 py-1.5 bg-[#f1f5f9] rounded-[49px] outline outline-1 outline-offset-[-1px] outline-[#303e65] inline-flex justify-start items-center gap-1"
                                                      >
                                                        <div className="text-center justify-start text-[#303e65] text-xs font-normal">
                                                          {dia.charAt(0).toUpperCase() + dia.slice(1)}
                                                        </div>
                                                        <button
                                                          type="button"
                                                          onClick={() =>
                                                            toggleDia(
                                                              zonaIndex,
                                                              actividadIndex,
                                                              metodoIndex,
                                                              turnoIndex,
                                                              dia as DiaSemana,
                                                            )
                                                          }
                                                          className="w-4 h-4 flex items-center justify-center text-[#303e65]"
                                                        >
                                                          <X className="h-4 w-4" />
                                                        </button>
                                                      </div>
                                                    ))
                                                  ) : (
                                                    <div className="text-gray-400 text-sm">Seleccione días</div>
                                                  )}
                                                </div>
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const dropdownId = `dias-${zonaIndex}-${actividadIndex}-${metodoIndex}-${turnoIndex}`
                                                    setOpenMaterialDropdown(
                                                      openMaterialDropdown === dropdownId ? null : dropdownId,
                                                    )
                                                  }}
                                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                                >
                                                  <ChevronDown className="h-5 w-5" />
                                                </button>

                                                {/* Dropdown de días */}
                                                {openMaterialDropdown ===
                                                  `dias-${zonaIndex}-${actividadIndex}-${metodoIndex}-${turnoIndex}` && (
                                                  <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                                                    <div className="p-2">
                                                      {diasSemana.map((dia) => (
                                                        <div
                                                          key={dia}
                                                          className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md flex items-center"
                                                          onClick={() => {
                                                            toggleDia(
                                                              zonaIndex,
                                                              actividadIndex,
                                                              metodoIndex,
                                                              turnoIndex,
                                                              dia,
                                                            )
                                                          }}
                                                        >
                                                          <div className="w-4 h-4 mr-2 border border-gray-300 rounded-sm flex items-center justify-center">
                                                            {turno.dias.includes(dia) && <Check className="h-3 w-3" />}
                                                          </div>
                                                          {dia.charAt(0).toUpperCase() + dia.slice(1)}
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="h-7 w-7 bg-red-500 hover:bg-red-600 text-white rounded-full"
                                                onClick={() =>
                                                  removeTurno(zonaIndex, actividadIndex, metodoIndex, turnoIndex)
                                                }
                                              >
                                                <X className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          </div>
                                        ))}
                                        <div className="flex flex-wrap gap-2">
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() =>
                                              aplicarATodosTurnos(
                                                zonaIndex,
                                                actividadIndex,
                                                metodoIndex,
                                                metodo.turnos[0]?.dias || [],
                                              )
                                            }
                                          >
                                            <Check className="h-3 w-3" />
                                            Aplicar a todos los turnos
                                          </Button>
                                          <Button
                                            type="button"
                                            className="bg-[#303e65] hover:bg-[#253252] text-white flex items-center gap-1 rounded-full"
                                            size="sm"
                                            onClick={() => agregarTurno(zonaIndex, actividadIndex, metodoIndex)}
                                          >
                                            <Plus className="h-3 w-3" />
                                            Agregar turnos
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <Button type="submit" className="bg-[#f5d433] hover:bg-[#e6c52a] text-black font-medium" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
