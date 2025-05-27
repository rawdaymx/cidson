"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { ActividadService } from "@/services/actividad-service";

export default function EditarActividadPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Number(params.id);

  // Obtener los parámetros de la URL actual para mantenerlos en la redirección
  const empresaId = searchParams.get("empresaId");
  const configuracionId = searchParams.get("configuracionId");
  const returnTo = searchParams.get("returnTo");
  const nombre = searchParams.get("nombre");
  const estado = searchParams.get("estado");
  const fecha_creacion = searchParams.get("fecha_creacion");

  // Modificar el estado inicial del formulario para usar los datos de la URL
  const [formData, setFormData] = useState({
    nombre: nombre || "",
  });

  // Modificar el estado de errores para eliminar el estado
  const [errors, setErrors] = useState({
    nombre: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actividad, setActividad] = useState<any>(
    nombre
      ? {
          id,
          nombre,
          estado: estado === "1",
          fecha_creacion,
        }
      : null
  );

  // Añadir un estado para mensajes de notificación
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Remover el useEffect que hacía la petición a la API y reemplazarlo por uno que verifique los parámetros
  useEffect(() => {
    if (!nombre) {
      setErrors({
        nombre:
          "No se encontró la información de la actividad. Regresando a la lista...",
      });
      setTimeout(() => {
        redirectToActividades();
      }, 2000);
    } else {
      setIsLoading(false);
    }
  }, [nombre]);

  // Función para construir la URL de redirección con los parámetros necesarios
  const redirectToActividades = () => {
    // Construir los parámetros de consulta
    const queryParams = new URLSearchParams();

    // Agregar los parámetros si existen
    if (empresaId) queryParams.append("empresaId", empresaId);

    // Si tenemos el configuracionId del parámetro, usarlo
    if (configuracionId) {
      queryParams.append("configuracionId", configuracionId);
    }
    // Si no, pero tenemos la actividad cargada, usar su configuracion_id
    else if (actividad && actividad.configuracion_id) {
      queryParams.append(
        "configuracionId",
        actividad.configuracion_id.toString()
      );
    }

    // Si hay un returnTo, usarlo como destino de redirección
    if (returnTo) {
      router.push(returnTo);
    } else {
      // Si no hay returnTo, ir a la página de actividades con los parámetros
      const queryString = queryParams.toString();
      const redirectUrl = `/actividades${queryString ? `?${queryString}` : ""}`;
      console.log(`Redirigiendo a: ${redirectUrl}`);
      router.push(redirectUrl);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpiar error al cambiar el valor
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Modificar la función validateForm para que solo valide el nombre
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      nombre: "",
    };

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre de la actividad es requerido";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Modificar la función handleSubmit para redirigir inmediatamente sin mostrar mensaje de éxito
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      console.log(
        `Actualizando actividad con ID ${id}, nombre: ${formData.nombre}`
      );

      // Enviar solo el nombre
      const updatedActividad = await ActividadService.update(id, {
        nombre: formData.nombre.trim(),
      });

      if (updatedActividad) {
        console.log("Actividad actualizada exitosamente:", updatedActividad);

        // Redirigir inmediatamente sin mostrar mensaje
        redirectToActividades();
      } else {
        throw new Error("No se pudo actualizar la actividad");
      }
    } catch (error) {
      console.error("Error al actualizar la actividad:", error);
      setErrors({
        nombre:
          "Ocurrió un error al actualizar la actividad. Por favor, intente nuevamente.",
      });
      setIsSubmitting(false);
    }
  };

  // Función para construir la URL para el enlace "Regresar"
  const getBackUrl = () => {
    // Si hay un returnTo, usarlo
    if (returnTo) return returnTo;

    // Si no, construir la URL de actividades con los parámetros
    const queryParams = new URLSearchParams();
    if (empresaId) queryParams.append("empresaId", empresaId);
    if (configuracionId) queryParams.append("configuracionId", configuracionId);

    const queryString = queryParams.toString();
    return `/actividades${queryString ? `?${queryString}` : ""}`;
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
          href={getBackUrl()}
          className="inline-flex items-center text-[#303e65] mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Regresar
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Editar registro
        </h1>
        <p className="text-gray-600 mb-8">
          Crea y registra nuevas actividades.
        </p>

        <div className="bg-white rounded-xl p-8 shadow-sm max-w-[800px] mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre De La Actividad"
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
