import type { Actividad, ActividadResponse } from "@/types/actividad";
import { API } from "@/config/api-config";
import { getAuthToken } from "@/config/api-config";

export class ActividadService {
  static async getAll(
    configuracionId: number,
    filters: { nombre?: string; estado?: number; page?: number } = {}
  ): Promise<ActividadResponse> {
    try {
      let url = `${API.BASE_URL}/api/actividades/${configuracionId}`;
      const queryParams = new URLSearchParams();

      if (filters.nombre) {
        queryParams.append("nombre", filters.nombre);
      }

      if (filters.estado !== undefined) {
        queryParams.append("estado", filters.estado.toString());
      }

      if (filters.page) {
        queryParams.append("page", filters.page.toString());
      }

      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const token =
        getAuthToken() || "yBPONqL0SH66XBKyfXu2ouwayDl7qaCn05ODKAioebfbd8ad";

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            throw new Error(errorData.message);
          }
        } catch (parseError) {
          // Si no se puede parsear, usar el texto del error original
        }

        throw new Error(
          `Error al obtener actividades: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en ActividadService.getAll:", error);
      throw error;
    }
  }

  static async getById(
    id: number,
    configuracionId?: number
  ): Promise<Actividad | undefined> {
    try {
      const token =
        getAuthToken() || "yBPONqL0SH66XBKyfXu2ouwayDl7qaCn05ODKAioebfbd8ad";

      const response = await fetch(
        `${API.BASE_URL}/api/actividades/detalle/${id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            throw new Error(errorData.message);
          }
        } catch (parseError) {
          // Si no se puede parsear, usar el texto del error original
        }

        throw new Error(
          `Error al obtener actividad: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error en ActividadService.getById:", error);
      throw error;
    }
  }

  static async create(
    configuracionId: number,
    nombre: string
  ): Promise<Actividad | undefined> {
    try {
      const token =
        getAuthToken() || "yBPONqL0SH66XBKyfXu2ouwayDl7qaCn05ODKAioebfbd8ad";

      const response = await fetch(
        `${API.BASE_URL}/api/actividades/store/${configuracionId}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nombre }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            if (errorData.message.includes("already exists")) {
              throw new Error("NOMBRE_DUPLICADO");
            }
            throw new Error(errorData.message);
          }
        } catch (parseError) {
          // Si no se puede parsear, usar el texto del error original
        }

        throw new Error(
          `Error al crear actividad: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error en ActividadService.create:", error);
      throw error;
    }
  }

  static async update(
    id: number,
    actividad: Partial<Actividad>
  ): Promise<Actividad | undefined> {
    try {
      const token =
        getAuthToken() || "yBPONqL0SH66XBKyfXu2ouwayDl7qaCn05ODKAioebfbd8ad";

      const response = await fetch(
        `${API.BASE_URL}/api/actividades/update/${id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(actividad),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            if (errorData.message.includes("already exists")) {
              throw new Error("NOMBRE_DUPLICADO");
            }
            throw new Error(errorData.message);
          }
        } catch (parseError) {
          // Si no se puede parsear, usar el texto del error original
        }

        throw new Error(
          `Error al actualizar actividad: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error en ActividadService.update:", error);
      throw error;
    }
  }

  static async toggleEstado(id: number): Promise<Actividad | undefined> {
    try {
      const token =
        getAuthToken() || "yBPONqL0SH66XBKyfXu2ouwayDl7qaCn05ODKAioebfbd8ad";

      const response = await fetch(
        `${API.BASE_URL}/api/actividades/destroy/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            throw new Error(errorData.message);
          }
        } catch (parseError) {
          // Si no se puede parsear, usar el texto del error original
        }

        throw new Error(
          `Error al cambiar estado de actividad: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error en ActividadService.toggleEstado:", error);
      throw error;
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const token =
        getAuthToken() || "yBPONqL0SH66XBKyfXu2ouwayDl7qaCn05ODKAioebfbd8ad";

      const response = await fetch(`${API.BASE_URL}/api/actividades/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            throw new Error(errorData.message);
          }
        } catch (parseError) {
          // Si no se puede parsear, usar el texto del error original
        }

        throw new Error(
          `Error al eliminar actividad: ${response.status} - ${errorText}`
        );
      }

      return true;
    } catch (error) {
      console.error("Error en ActividadService.delete:", error);
      throw error;
    }
  }
}
