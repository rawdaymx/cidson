"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { AreaService } from "@/services/area-service";

export default function CrearAreaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const empresaId = searchParams.get("empresaId");
  const returnToParam = searchParams.get("returnTo");

  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError("El nombre del área es requerido");
      return;
    }

    if (!empresaId) {
      setError("No se proporcionó ID de empresa");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const area = await AreaService.create({
        nombre: nombre.trim(),
        configuracion_id: Number(empresaId),
      });

      if (area) {
        // Redirigir a la página de áreas
        const params = new URLSearchParams();
        if (empresaId) params.append("empresaId", empresaId);
        if (returnToParam) params.append("returnTo", returnToParam);

        router.push(`/areas?${params.toString()}`);
      }
    } catch (error) {
      console.error("Error al crear área:", error);
      if (error instanceof Error) {
        if (error.message.includes("ya existe")) {
          setError(
            "El nombre del área ya existe. Por favor, utilice otro nombre."
          );
        } else {
          setError(
            error.message ||
              "Error al crear el área. Por favor, intente nuevamente."
          );
        }
      } else {
        setError("Error al crear el área. Por favor, intente nuevamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para construir la URL para el enlace "Regresar"
  const getBackUrl = () => {
    const params = new URLSearchParams();
    if (empresaId) params.append("empresaId", empresaId);
    if (returnToParam) params.append("returnTo", returnToParam);

    return `/areas${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-[1600px] mx-auto">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <a
          href={getBackUrl()}
          className="inline-flex items-center text-[#303e65] hover:text-[#1a2540] transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          <span>Regresar</span>
        </a>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-4">
          Nueva Área
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Crea una nueva área para CIDSON.
        </p>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm max-w-[800px] mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre Del Área"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (e.target.value.trim()) setError("");
                }}
                className={`w-full h-12 px-4 bg-[#f4f6fb] rounded-md border-0 focus:ring-2 focus:ring-[#303e65] ${
                  error ? "ring-2 ring-red-500" : ""
                }`}
              />
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
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
  );
}
