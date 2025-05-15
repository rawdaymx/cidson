"use client"

import { useState } from "react"
import {
  Home,
  Building2,
  Users,
  Hand,
  Server,
  Bed,
  Paintbrush,
  List,
  UserCircle,
  Package,
  ArrowRight,
  ArrowLeft,
  CheckSquare,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)

  // Usamos el hook usePathname directamente
  // Next.js 13+ maneja esto correctamente
  const pathname = usePathname() || "/"

  const toggleSidebar = () => {
    setExpanded(!expanded)
  }

  // Mapeo de iconos a nombres para el sidebar expandido
  const menuItems = [
    { name: "Dashboard", icon: Home, href: "/", isActive: pathname === "/" },
    { name: "Empresas", icon: Building2, href: "/empresas", isActive: pathname.startsWith("/empresas") },
    { name: "Usuarios", icon: Users, href: "/usuarios", isActive: pathname.startsWith("/usuarios") },
    { name: "Actividades", icon: FileText, href: "/actividades", isActive: pathname.startsWith("/actividades") },
    { name: "Motivos", icon: FileText, href: "/motivos", isActive: pathname.startsWith("/motivos") },
    { name: "Métodos", icon: Hand, href: "/metodos", isActive: pathname.startsWith("/metodos") },
    { name: "Áreas", icon: Server, href: "/areas", isActive: pathname.startsWith("/areas") },
    { name: "Zona", icon: Bed, href: "/zona", isActive: pathname.startsWith("/zona") },
    { name: "Materiales", icon: Paintbrush, href: "/materiales", isActive: pathname.startsWith("/materiales") },
    { name: "Checklist", icon: List, href: "/checklist", isActive: pathname.startsWith("/checklist") },
    { name: "Supervisor", icon: UserCircle, href: "/supervisor", isActive: pathname.startsWith("/supervisor") },
    {
      name: "Captura checklist",
      icon: CheckSquare,
      href: "/captura-checklist",
      isActive: pathname.startsWith("/captura-checklist"),
    },
    { name: "Inventario", icon: Package, href: "/inventario", isActive: pathname.startsWith("/inventario") },
  ]

  if (expanded) {
    return (
      <aside className="bg-white w-[240px] flex flex-col h-full shadow-sidebar transition-all duration-300 ease-in-out overflow-hidden">
        {/* Logo */}
        <div className="flex flex-col items-center mb-4 px-4 w-full flex-shrink-0 pt-6">
          <div className="text-2xl font-bold">
            <span className="text-yellow-400">C</span>
            <span className="text-[#303e65]">IDSON</span>
          </div>
          <div className="text-[10px] text-gray-500 text-center mt-1">Clean Industrial And Domestic Solutions</div>
        </div>

        {/* Separator */}
        <div className="w-full px-4 mb-6 flex-shrink-0">
          <div className="h-[2px] bg-gradient-to-r from-[#d9f0f4] via-[#f5d433] to-[#d9f0f4]"></div>
        </div>

        {/* Navigation - Make this section scrollable */}
        <nav className="flex flex-col items-center gap-3 w-full px-4 overflow-y-auto flex-grow">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`w-full h-12 rounded-full flex items-center px-4 transition-colors duration-200 flex-shrink-0 ${
                item.isActive ? "bg-yellow-400 text-[#303e65] font-medium" : "bg-[#303e65] text-white font-medium"
              }`}
            >
              <item.icon size={20} className="mr-3" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Close sidebar button */}
        <button
          onClick={toggleSidebar}
          className="w-full px-4 flex items-center text-orange-500 font-medium mt-4 mb-6 flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white mr-3">
            <ArrowLeft size={20} />
          </div>
          Cerrar sidebar
        </button>
      </aside>
    )
  }

  return (
    <aside className="bg-white w-[80px] flex flex-col items-center py-4 shadow-sidebar h-full transition-all duration-300 ease-in-out">
      {/* Logo */}
      <div className="flex flex-col items-center mb-4 w-full px-1 flex-shrink-0">
        <div className="text-xl font-bold">
          <span className="text-yellow-400">C</span>
          <span className="text-cidson-blue">IDSON</span>
        </div>
        <div className="text-[6px] text-gray-500 text-center mt-1">Clean Industrial and Domestic Solutions</div>
      </div>

      {/* Separator */}
      <div className="w-full px-2 mb-4 flex-shrink-0">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col items-center gap-3 w-full px-2 overflow-y-auto flex-grow">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 flex-shrink-0 ${
              item.isActive ? "bg-yellow-400 text-cidson-blue" : "bg-cidson-blue text-white"
            }`}
            aria-label={item.name}
          >
            <item.icon size={18} />
          </Link>
        ))}
      </nav>

      {/* Toggle sidebar button */}
      <button
        onClick={toggleSidebar}
        className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white mb-4 flex-shrink-0"
        aria-label="Expandir sidebar"
      >
        <ArrowRight size={18} className="text-white" />
      </button>
    </aside>
  )
}
