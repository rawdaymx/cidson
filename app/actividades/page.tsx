"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ActividadesModule from "@/components/actividades/actividades-module";
import { getAuthToken } from "@/config/api-config";

export default function ActividadesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const empresaId = searchParams.get("empresaId");
  const configuracionId = searchParams.get("configuracionId");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkParams = async () => {
      try {
        console.log("Verificando parámetros:", { empresaId, configuracionId });

        // Verificar que tengamos los parámetros necesarios
        if (!empresaId) {
          console.error("Falta empresaId");
          setError("Falta el ID de la empresa");
          router.push("/empresas");
          return;
        }

        if (!configuracionId) {
          console.error("Falta configuracionId");
          setError("Falta el ID de configuración");
          router.push("/empresas");
          return;
        }

        // Verificar que los valores sean números válidos
        if (isNaN(Number(empresaId)) || isNaN(Number(configuracionId))) {
          console.error("IDs inválidos:", { empresaId, configuracionId });
          setError("IDs inválidos");
          router.push("/empresas");
          return;
        }

        // Verificar autenticación usando getAuthToken
        const token = getAuthToken();
        if (!token) {
          console.error("No hay token de autenticación");
          router.push("/login");
          return;
        }

        console.log("Verificación exitosa, procediendo a cargar el módulo");
        setIsLoading(false);
        setError(null);
      } catch (error) {
        console.error("Error en la verificación:", error);
        setError("Error en la verificación");
        router.push("/login");
      }
    };

    checkParams();
  }, [router, empresaId, configuracionId]);

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
    <ActividadesModule
      empresaId={empresaId || undefined}
      configuracionId={configuracionId || undefined}
    />
  );
}
