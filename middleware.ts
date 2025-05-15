import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Obtener el token de las cookies
  const token = request.cookies.get("auth_token")?.value

  // Verificar si hay un parámetro para mostrar la página principal
  const showHome = request.nextUrl.searchParams.has("home")

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login", "/recuperar-contrasena"]
  const isPublicRoute = publicRoutes.some(
    (route) => request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith("/reset-password/"),
  )

  // Si la ruta es exactamente la raíz y no se solicita mostrar la página principal,
  // redirigir a /empresas si está autenticado, o a /login si no lo está
  if (request.nextUrl.pathname === "/" && !showHome) {
    return token
      ? NextResponse.redirect(new URL("/empresas", request.url))
      : NextResponse.redirect(new URL("/login", request.url))
  }

  // Si es una ruta pública y el usuario está autenticado, redirigir a /empresas
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/empresas", request.url))
  }

  // Si no es una ruta pública y el usuario no está autenticado, redirigir a /login
  if (!isPublicRoute && !token && request.nextUrl.pathname !== "/") {
    // Guardar la URL a la que intentaba acceder para redirigir después del login
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Actualizar la configuración del matcher para excluir correctamente las rutas de imágenes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (image files)
     * - icons (icon files)
     * - public (public files)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|icons|public|api).*)",
  ],
}
