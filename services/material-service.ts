import { API, getApiUrl, getAuthToken } from "@/config/api-config";
import type { Material } from "@/types/material";

// Interfaz para los parámetros de búsqueda
export interface MaterialSearchParams {
  nombre?: string;
  estado?: number;
  page?: number;
}

export class MaterialService {
  static async getAll(
    configuracionId: number,
    params?: MaterialSearchParams
  ): Promise<{
    materiales: Material[];
    pagination: any;
  }> {
    try {
      // Obtener API URL y token de autenticación
      const apiUrl = getApiUrl();
      const token =
        getAuthToken() || "yBPONqL0SH66XBKyfXu2ouwayDl7qaCn05ODKAioebfbd8ad";

      // Validar que tenemos una URL base válida
      if (!apiUrl) {
        console.error("URL de API no definida");
        throw new Error("URL de API no definida");
      }

      // Construir URL con parámetros de consulta
      let url = `${apiUrl}/api/materiales/${configuracionId}`;

      if (params) {
        const queryParams = new URLSearchParams();
        if (params.nombre) queryParams.append("nombre", params.nombre);
        if (params.estado !== undefined)
          queryParams.append("estado", params.estado.toString());
        if (params.page) queryParams.append("page", params.page.toString());

        const queryString = queryParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      console.log("Fetching materiales from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error HTTP: ${response.status} - ${errorText}`);
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();

      // Transformar los datos para mantener compatibilidad con la interfaz existente
      const materiales = result.data.map((material: any) => ({
        id: material.id,
        nombre: material.nombre,
        estado: material.estado,
        fecha_creacion: material.fecha_creacion,
      }));

      const pagination = {
        currentPage: result.meta.current_page,
        totalPages: result.meta.last_page,
        total: result.meta.total,
        links: result.meta.links,
      };

      return { materiales, pagination };
    } catch (error) {
      console.error("Error al obtener materiales:", error);
      // En caso de error, devolver datos vacíos
      return {
        materiales: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          total: 0,
          links: [],
        },
      };
    }
  }

  static async create(
    configuracionId: number,
    material: Omit<Material, "id">
  ): Promise<Material> {
    try {
      const apiUrl = getApiUrl();
      const token =
        getAuthToken() || "yBPONqL0SH66XBKyfXu2ouwayDl7qaCn05ODKAioebfbd8ad";

      const url = `${apiUrl}/api/materiales/${configuracionId}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: material.nombre,
          estado: material.estado === "Activo" ? 1 : 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Error al crear material: ${response.statusText}`
        );
      }

      const result = await response.json();
      return {
        id: result.data.id,
        nombre: result.data.nombre,
        estado: result.data.estado,
        fecha_creacion: result.data.fecha_creacion,
      };
    } catch (error) {
      console.error("Error al crear material:", error);
      throw error;
    }
  }

  static async update(
    configuracionId: number,
    id: number,
    material: Partial<Material>
  ): Promise<Material> {
    try {
      const apiUrl = getApiUrl();
      const token =
        getAuthToken() || "yBPONqL0SH66XBKyfXu2ouwayDl7qaCn05ODKAioebfbd8ad";

      const url = `${apiUrl}/api/materiales/${configuracionId}/${id}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: material.nombre,
          estado: material.estado === "Activo" ? 1 : 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Error al actualizar material: ${response.statusText}`
        );
      }

      const result = await response.json();
      return {
        id: result.data.id,
        nombre: result.data.nombre,
        estado: result.data.estado,
        fecha_creacion: result.data.fecha_creacion,
      };
    } catch (error) {
      console.error("Error al actualizar material:", error);
      throw error;
    }
  }

  static async toggleEstado(
    configuracionId: number,
    id: number
  ): Promise<Material> {
    try {
      const apiUrl = getApiUrl();
      const token =
        getAuthToken() || "yBPONqL0SH66XBKyfXu2ouwayDl7qaCn05ODKAioebfbd8ad";

      const url = `${apiUrl}/api/materiales/${configuracionId}/${id}/toggle`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Error al cambiar estado del material: ${response.statusText}`
        );
      }

      const result = await response.json();
      return {
        id: result.data.id,
        nombre: result.data.nombre,
        estado: result.data.estado,
        fecha_creacion: result.data.fecha_creacion,
      };
    } catch (error) {
      console.error("Error al cambiar estado del material:", error);
      throw error;
    }
  }

  static async delete(configuracionId: number, id: number): Promise<boolean> {
    try {
      const apiUrl = getApiUrl();
      const token =
        getAuthToken() || "yBPONqL0SH66XBKyfXu2ouwayDl7qaCn05ODKAioebfbd8ad";

      const url = `${apiUrl}/api/materiales/${configuracionId}/${id}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Error al eliminar material: ${response.statusText}`
        );
      }

      return true;
    } catch (error) {
      console.error("Error al eliminar material:", error);
      return false;
    }
  }
}
