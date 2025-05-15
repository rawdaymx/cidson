import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckSquare, Plus } from "lucide-react"

export default function CapturaChecklistPage() {
  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold mb-2">Captura de Checklist</h1>
              <p className="text-gray-600 mb-6">Captura y completa los checklists asignados a tus actividades.</p>

              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Checklists pendientes</h2>
                  <Link href="/captura-checklist/nuevo">
                    <Button className="bg-[#303e65] hover:bg-[#253252] gap-2">
                      <Plus size={16} />
                      Nueva captura
                    </Button>
                  </Link>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-center">
                  <CheckSquare size={40} className="mx-auto mb-2 text-yellow-500" />
                  <p className="text-yellow-800 font-medium">No tienes checklists pendientes por capturar</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Todos los checklists asignados han sido completados o no tienes checklists asignados.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-medium mb-4">Historial de capturas</h2>

                <div className="overflow-hidden rounded-lg border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Checklist
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Fecha
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Estado
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Completado
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Checklist de limpieza 1
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10/05/2023</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completado
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">100%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href="/captura-checklist/detalle/1" className="text-[#303e65] hover:text-[#253252]">
                            Ver detalle
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Checklist de limpieza 2
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">08/05/2023</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completado
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">90%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href="/captura-checklist/detalle/2" className="text-[#303e65] hover:text-[#253252]">
                            Ver detalle
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
