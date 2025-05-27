"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { MaterialService } from "@/services/material-service";
import { getAuthToken } from "@/config/api-config";

export default function EditarMaterialPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Number(params.id);

  const empresaId = searchParams.get("empresaId");
  const configuracionId = searchParams.get("configuracionId");
  const nombreParam = searchParams.get("nombre");
  const estadoParam = searchParams.get("estado");
  const fechaCreacionParam = searchParams.get("fecha_creacion");

  const [formData, setFormData] = useState({
    nombre: nombreParam || "",
    estado: estadoParam === "1",
    fecha_creacion: fechaCreacionParam || "",
  });
  const [errors, setErrors] = useState({ nombre: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!empresaId || !configuracionId || !id || isNaN(id)) {
      console.error("Faltan parámetros requeridos:", {
        empresaId,
        configuracionId,
        id,
      });
      router.push("/empresas");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      console.error("No hay token de autenticación");
      router.push("/login");
      return;
    }

    // Ya no necesitamos cargar el material porque tenemos todos los datos en los parámetros
    setIsLoading(false);
  }, [id, empresaId, configuracionId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      setErrors({ nombre: "El nombre del material es requerido" });
      return;
    }

    try {
      setIsSubmitting(true);
      await MaterialService.update(Number(configuracionId), id, {
        nombre: formData.nombre.trim(),
        estado: formData.estado,
        fecha_creacion: formData.fecha_creacion,
      });

      // Construir la URL de retorno con los parámetros básicos
      const params = new URLSearchParams();
      if (empresaId) params.append("empresaId", empresaId);
      if (configuracionId) params.append("configuracionId", configuracionId);

      router.push(`/materiales?${params.toString()}`);
    } catch (error) {
      console.error("Error al actualizar el material:", error);
      if (error instanceof Error && error.message === "NOMBRE_DUPLICADO") {
        setErrors({
          nombre:
            "El nombre del material ya existe. Por favor, utilice otro nombre.",
        });
      } else {
        setErrors({
          nombre:
            "Error al actualizar el material. Por favor, intente nuevamente.",
        });
      }
      setIsSubmitting(false);
    }
  };

  const handleRegresar = () => {
    const params = new URLSearchParams();
    if (empresaId) params.append("empresaId", empresaId);
    if (configuracionId) params.append("configuracionId", configuracionId);
    router.push(`/materiales?${params.toString()}`);
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

  return (
    <div className="bg-[#f4f6fb] min-h-screen">
      <div className="pl-8 pr-6 py-6 max-w-[1200px]">
        <button
          onClick={handleRegresar}
          className="inline-flex items-center text-[#303e65] mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Regresar
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Editar registro
        </h1>
        <p className="text-gray-600 mb-8">
          Edita el nombre del material seleccionado.
        </p>

        <div className="bg-white rounded-xl p-8 shadow-sm max-w-[800px] mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre Del Material"
                  value={formData.nombre}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      nombre: e.target.value,
                    });
                    setErrors({ nombre: "" });
                  }}
                  className={`w-full h-12 px-4 bg-[#f4f6fb] rounded-md border-0 focus:ring-2 focus:ring-[#303e65] ${
                    errors.nombre ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center bg-[#f5d433] text-[#303e65] font-medium px-6 py-2.5 rounded-full hover:bg-[#f0ca20] transition-colors disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#303e65] border-t-transparent rounded-full animate-spin mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
