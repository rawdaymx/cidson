/**
 * Interfaz para los permisos del usuario
 */
interface Permission {
  name: string;
}

/**
 * Obtiene los permisos del usuario del localStorage
 */
export function getUserPermissions(): Permission[] {
  if (typeof window !== "undefined") {
    const permissions = localStorage.getItem("user_permissions");
    if (permissions) {
      return JSON.parse(permissions);
    }
  }
  return [];
}

/**
 * Verifica si el usuario tiene un permiso específico
 * @param permissionName Nombre del permiso a verificar
 */
export function hasPermission(permissionName: string): boolean {
  const permissions = getUserPermissions();
  return permissions.some((permission) => permission.name === permissionName);
}

/**
 * Guarda los permisos del usuario en localStorage
 * @param permissions Lista de permisos del usuario
 */
export function setUserPermissions(permissions: Permission[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("user_permissions", JSON.stringify(permissions));
  }
}

/**
 * Elimina los permisos del usuario del localStorage
 */
export function removeUserPermissions(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_permissions");
  }
}

/**
 * Verifica si el usuario tiene alguno de los permisos especificados
 * @param permissionNames Lista de nombres de permisos a verificar
 */
export function hasAnyPermission(permissionNames: string[]): boolean {
  const permissions = getUserPermissions();
  return permissionNames.some((permissionName) =>
    permissions.some((permission) => permission.name === permissionName)
  );
}

/**
 * Verifica si el usuario tiene todos los permisos especificados
 * @param permissionNames Lista de nombres de permisos a verificar
 */
export function hasAllPermissions(permissionNames: string[]): boolean {
  const permissions = getUserPermissions();
  return permissionNames.every((permissionName) =>
    permissions.some((permission) => permission.name === permissionName)
  );
}
