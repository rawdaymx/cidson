"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Empresa } from "@/types/empresa";
import { EmpresaService } from "@/services/empresa-service";
import CatalogoCard from "@/components/empresas/catalogo-card";

export default function CatalogosEmpresaPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (isNaN(id)) {
          setError("ID de empresa inválido");
          setIsLoading(false);
          return;
        }

        const empresaData = await EmpresaService.getById(id);

        if (empresaData) {
          console.log("Empresa obtenida:", empresaData);
          console.log("Configuración ID:", empresaData.configuracion_id);
          setEmpresa(empresaData);
        } else {
          setError("Empresa no encontrada");
        }
      } catch (error) {
        console.error("Error al cargar la empresa:", error);
        setError(
          "Error al cargar los datos de la empresa. Por favor, intente nuevamente."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEmpresa();
    }
  }, [id, router]);

  const catalogos = [
    {
      id: 1,
      nombre: "Actividades",
      descripcion: "Gestión de actividades asociadas a la empresa",
      icono: "FileText",
      ruta: "/actividades",
    },
    {
      id: 2,
      nombre: "Motivos",
      descripcion: "Gestión de motivos asociados a la empresa",
      icono: "FileText",
      ruta: "/motivos",
    },
    {
      id: 3,
      nombre: "Métodos",
      descripcion: "Gestión de métodos asociados a la empresa",
      icono: "Hand",
      ruta: "/metodos",
    },
    {
      id: 4,
      nombre: "Áreas",
      descripcion: "Gestión de áreas asociadas a la empresa",
      icono: "Server",
      ruta: "/areas",
    },
    {
      id: 5,
      nombre: "Zonas",
      descripcion: "Gestión de zonas asociadas a la empresa",
      icono: "Bed",
      ruta: "/zonas",
    },
    {
      id: 6,
      nombre: "Materiales",
      descripcion: "Gestión de materiales asociados a la empresa",
      icono: "Package",
      ruta: "/materiales",
    },
  ];

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
          <Link
            href="/empresas"
            className="mt-4 inline-block text-[#303e65] hover:underline"
          >
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f6fb]">
        <div className="text-center">
          <p className="text-xl text-gray-700">Empresa no encontrada</p>
          <Link
            href="/empresas"
            className="mt-4 inline-block text-[#303e65] hover:underline"
          >
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  // Si la empresa no tiene configuracion_id, mostrar una advertencia
  const configuracionMissing = !empresa.configuracion_id;

  return (
    <div className="bg-[#f4f6fb] min-h-screen">
      <div className="pl-8 pr-6 py-6 max-w-[1200px]">
        <Link
          href="/empresas"
          className="inline-flex items-center text-[#303e65] mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Regresar
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Catálogos de {empresa.nombre}
        </h1>
        <p className="text-gray-600 mb-2">
          Seleccione un catálogo para gestionar.
        </p>

        {configuracionMissing ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  No se encontró ID de configuración para esta empresa. Se
                  utilizará un valor por defecto (1) para pruebas.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-8">
            ID de Configuración: {empresa.configuracion_id}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogos.map((catalogo) => (
            <CatalogoCard
              key={catalogo.id}
              catalogo={catalogo}
              empresaId={id}
              configuracionId={empresa.configuracion_id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
