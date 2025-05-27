import type { Zona } from "@/types/zona";
import { API, getAuthToken } from "@/config/api-config";

interface ZonaApiResponse {
  data: Array<{
    id: number;
    nombre: string;
    estado: boolean;
    fecha_creacion: string;
    configuracion_id: number;
  }>;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export class ZonaService {
  static async getAll(
    configuracionId?: number,
    filters: { nombre?: string; estado?: number; page?: number } = {}
  ): Promise<ZonaApiResponse> {
    try {
      if (!configuracionId) {
        return {
          data: [],
          links: {
            first: "",
            last: "",
            prev: null,
            next: null,
          },
          meta: {
            current_page: 1,
            from: 0,
            last_page: 1,
            links: [],
            path: "",
            per_page: 10,
            to: 0,
            total: 0,
          },
        };
      }

      let url = `${API.BASE_URL}/api/zonas/${configuracionId}`;
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
        url = `${url}?${queryString}`;
      }

      const token = getAuthToken();
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
          console.error("No se pudo parsear el error como JSON:", parseError);
        }
        throw new Error(
          `Error al obtener zonas: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en getAll de ZonaService:", error);
      throw error;
    }
  }

  static async getById(id: number): Promise<Zona> {
    try {
      const url = `${API.BASE_URL}/api/zonas/show/${id}`;
      const token = getAuthToken();

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener la zona: ${response.status}`);
      }

      const result = await response.json();
      return {
        id: Number(result.data.id),
        nombre: result.data.nombre,
        estado: Boolean(result.data.estado),
        fecha_creacion: result.data.fecha_creacion,
        configuracion_id: Number(result.data.configuracion_id),
      };
    } catch (error) {
      console.error("Error al obtener zona:", error);
      throw error;
    }
  }

  static async create(zona: Omit<Zona, "id">): Promise<Zona> {
    try {
      const url = `${API.BASE_URL}/api/zonas/store/${zona.configuracion_id}`;
      const token = getAuthToken();

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: zona.nombre,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "NOMBRE_DUPLICADO") {
          throw new Error("NOMBRE_DUPLICADO");
        }
        throw new Error(`Error al crear la zona: ${response.status}`);
      }

      const result = await response.json();
      return {
        id: Number(result.data.id),
        nombre: result.data.nombre,
        estado: Boolean(result.data.estado),
        fecha_creacion: result.data.fecha_creacion,
        configuracion_id: Number(result.data.configuracion_id),
      };
    } catch (error) {
      console.error("Error al crear zona:", error);
      throw error;
    }
  }

  static async update(id: number, zona: Partial<Zona>): Promise<Zona> {
    try {
      const url = `${API.BASE_URL}/api/zonas/update/${id}`;
      const token = getAuthToken();

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: zona.nombre,
          estado: zona.estado,
          configuracion_id: zona.configuracion_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "NOMBRE_DUPLICADO") {
          throw new Error("NOMBRE_DUPLICADO");
        }
        throw new Error(`Error al actualizar la zona: ${response.status}`);
      }

      const result = await response.json();
      return {
        id: Number(result.data.id),
        nombre: result.data.nombre,
        estado: Boolean(result.data.estado),
        fecha_creacion: result.data.fecha_creacion,
        configuracion_id: Number(result.data.configuracion_id),
      };
    } catch (error) {
      console.error("Error al actualizar zona:", error);
      throw error;
    }
  }

  static async toggleEstado(id: number): Promise<Zona> {
    try {
      const url = `${API.BASE_URL}/api/zonas/destroy/${id}`;
      const token = getAuthToken();

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error al cambiar estado de la zona: ${response.status}`
        );
      }

      const result = await response.json();
      return {
        id: Number(result.data.id),
        nombre: result.data.nombre,
        estado: Boolean(result.data.estado),
        fecha_creacion: result.data.fecha_creacion,
        configuracion_id: Number(result.data.configuracion_id),
      };
    } catch (error) {
      console.error("Error al cambiar estado de la zona:", error);
      throw error;
    }
  }
}
