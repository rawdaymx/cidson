import { NextResponse } from "next/server"
import type { Empresa } from "@/types/empresa"

// This is a mock database for demonstration purposes
const empresas: Empresa[] = [
  {
    id: 1,
    nombre: "Constellation Brands",
    razonSocial: "CERVECERA DE COAHUILA, S. DE R.L. DE C.V.",
    fechaRegistro: "15/03/2023",
    estado: "Activo",
  },
]

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Format date to dd/mm/yyyy
    const date = new Date(data.fechaRegistro)
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`

    // Create new empresa
    const newEmpresa: Empresa = {
      id: empresas.length + 1,
      nombre: data.nombre,
      razonSocial: data.razonSocial,
      fechaRegistro: formattedDate,
      estado: "Activo",
    }

    // Add to "database"
    empresas.push(newEmpresa)

    return NextResponse.json({ success: true, empresa: newEmpresa })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create empresa" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ empresas })
}
