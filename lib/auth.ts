// Función para obtener el token de autenticación
export function getAuthToken(): string | null {
  // Intentar obtener el token del localStorage
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}
