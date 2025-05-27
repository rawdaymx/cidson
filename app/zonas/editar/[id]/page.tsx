"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { ZonaService } from "@/services/zona-service";

export default function EditarZonaPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // Asegurarse de que el ID sea un número
  const id =
    typeof params.id === "string" ? parseInt(params.id) : Number(params.id);

  // Obtener los parámetros de la URL actual para mantenerlos en la redirección
  const empresaId = searchParams.get("empresaId");
  const configuracionId = searchParams.get("configuracionId");
  const returnTo = searchParams.get("returnTo");

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    id: id,
    estado: true,
    configuracion_id: configuracionId ? parseInt(configuracionId) : undefined,
  });

  // Estado de errores y carga
  const [errors, setErrors] = useState({
    nombre: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos de la zona
  useEffect(() => {
    const fetchZona = async () => {
      try {
        const zona = await ZonaService.getById(id);
        if (zona) {
          setFormData({
            ...zona,
            id: id,
            configuracion_id: configuracionId
              ? parseInt(configuracionId)
              : zona.configuracion_id,
          });
        } else {
          throw new Error("No se encontró la zona");
        }
      } catch (error) {
        console.error("Error al cargar la zona:", error);
        setErrors({
          nombre: "Error al cargar la información de la zona",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!isNaN(id)) {
      fetchZona();
    } else {
      setErrors({
        nombre: "ID de zona inválido",
      });
      setIsLoading(false);
    }
  }, [id, configuracionId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      nombre: "",
    };

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre de la zona es requerido";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedZona = await ZonaService.update(id, {
        nombre: formData.nombre.trim(),
        estado: formData.estado,
        configuracion_id: formData.configuracion_id,
      });

      if (updatedZona) {
        redirectToZonas();
      } else {
        throw new Error("No se pudo actualizar la zona");
      }
    } catch (error) {
      console.error("Error al actualizar la zona:", error);
      if (error instanceof Error && error.message === "NOMBRE_DUPLICADO") {
        setErrors({
          nombre:
            "El nombre de la zona ya existe. Por favor, utilice otro nombre.",
        });
      } else {
        setErrors({
          nombre:
            "Ocurrió un error al actualizar la zona. Por favor, intente nuevamente.",
        });
      }
      setIsSubmitting(false);
    }
  };

  const redirectToZonas = () => {
    const params = new URLSearchParams();
    if (empresaId) params.append("empresaId", empresaId);
    if (configuracionId) params.append("configuracionId", configuracionId);
    if (returnTo) {
      router.push(returnTo);
    } else {
      const queryString = params.toString();
      router.push(`/zonas${queryString ? `?${queryString}` : ""}`);
    }
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
        <Link
          href={returnTo || "/zonas"}
          className="inline-flex items-center text-[#303e65] mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Regresar
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Editar registro
        </h1>
        <p className="text-gray-600 mb-8">
          Modifica la información de la zona.
        </p>

        <div className="bg-white rounded-xl p-8 shadow-sm max-w-[800px] mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre De La Zona"
                  value={formData.nombre}
                  onChange={handleChange}
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
