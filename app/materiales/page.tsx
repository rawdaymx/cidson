"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import MaterialesModule from "@/components/materiales/materiales-module";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/config/api-config";

export default function MaterialesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Obtener todos los parámetros de la URL
  const empresaId = searchParams.get("empresaId");
  const configuracionId = searchParams.get("configuracionId");

  console.log("Parámetros URL:", {
    empresaId,
    configuracionId,
    allParams: Object.fromEntries(searchParams.entries()),
  });

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

  // URL de regreso a los catálogos de la empresa
  const backUrl = empresaId ? `/empresas/catalogos/${empresaId}` : "/empresas";

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/empresas" className="text-blue-600 hover:underline">
            Volver a empresas
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#303e65] border-t-[#f5d433] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <MaterialesModule
        empresaId={empresaId || ""}
        configuracionId={configuracionId || ""}
      />
    </div>
  );
}
