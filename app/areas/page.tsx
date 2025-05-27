"use client";

import { useSearchParams, useRouter } from "next/navigation";
import AreasModule from "@/components/areas/areas-module";
import { useEffect } from "react";

export default function AreasPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const empresaId = searchParams.get("empresaId");
  const configuracionId = searchParams.get("configuracionId");

  useEffect(() => {
    if (!empresaId && !configuracionId) {
      // Si no hay parámetros, redirigir a la página de empresas
      router.push("/empresas");
    }
  }, [empresaId, configuracionId, router]);

  if (!empresaId && !configuracionId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f6fb]">
        <div className="text-center p-6 bg-white rounded-xl shadow-card">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Parámetros Faltantes
          </h2>
          <p className="text-gray-600 mb-4">
            No se proporcionó un ID de empresa o configuración.
            <br />
            Serás redirigido a la página de empresas.
          </p>
          <div className="w-16 h-16 border-4 border-[#303e65] border-t-[#f5d433] rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <AreasModule
      empresaId={empresaId || undefined}
      configuracionId={configuracionId || undefined}
    />
  );
}
