import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-3xl font-bold mb-6">Bienvenido a CIDSON</h1>
      <p className="mb-8 text-gray-600 max-w-md">Sistema de gestión para Clean Industrial And Domestic Solutions</p>
      <div className="space-y-4">
        <Link href="/empresas" passHref>
          <Button className="w-full sm:w-auto px-8 py-2 bg-[#303e65]">Ir al Dashboard</Button>
        </Link>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        API URL:{" "}
        {process.env.NEXT_PUBLIC_ENV === "production"
          ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
          : process.env.NEXT_PUBLIC_ENV === "test"
            ? process.env.NEXT_PUBLIC_API_URL_TEST
            : process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT}
      </div>
    </div>
  )
}
