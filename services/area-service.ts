import type { Area, AreaApiResponse, AreaItemApiResponse } from "@/types/area";
import { API, getAuthToken } from "@/config/api-config";

export class AreaService {
  // Método para obtener todas las áreas de una configuración (empresa) con paginación
  static async getAll(
    configuracionId?: number,
    filters: { nombre?: string; estado?: number; page?: number } = {}
  ): Promise<AreaApiResponse> {
    try {
      console.log("=== Iniciando getAll de AreaService ===");
      console.log("configuracionId:", configuracionId);
      console.log("filters:", filters);

      if (!configuracionId) {
        console.log(
          "No se proporcionó configuracionId, retornando respuesta vacía"
        );
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

      // Construir URL base
      let url = `${API.BASE_URL}${API.ENDPOINTS.AREAS}/${configuracionId}`;
      const queryParams = new URLSearchParams();

      // Agregar parámetros de filtro
      if (filters.nombre) {
        queryParams.append("nombre", filters.nombre);
      }
      if (filters.estado !== undefined) {
        queryParams.append("estado", filters.estado.toString());
      }
      if (filters.page) {
        queryParams.append("page", filters.page.toString());
      }

      // Agregar los parámetros a la URL
      const queryString = queryParams.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }

      console.log("URL completa de la petición:", url);

      const token =
        getAuthToken() || "26plhaQiSc4m6AA6LFUAIP6tllkA2ZdAXF3c5ov5f7a6f932";
      console.log("Token a utilizar:", token);

      console.log("Realizando petición fetch con headers:", {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      });

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Respuesta recibida:");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);
      console.log("Headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error en la respuesta. Texto del error:", errorText);

        try {
          const errorData = JSON.parse(errorText);
          console.log("Error parseado como JSON:", errorData);
          if (errorData.message) {
            throw new Error(errorData.message);
          }
        } catch (parseError) {
          console.error("No se pudo parsear el error como JSON:", parseError);
        }

        throw new Error(
          `Error al obtener áreas: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Datos recibidos de la API:", data);
      return data;
    } catch (error) {
      console.error("Error en getAll de AreaService:", error);
      console.error(
        "Stack trace:",
        error instanceof Error ? error.stack : "No stack trace disponible"
      );
      throw error;
    }
  }

  // Resto de métodos del servicio...
  static async getById(id: number): Promise<Area | undefined> {
    try {
      console.log("=== Iniciando getById de AreaService ===");
      console.log("ID a buscar:", id);

      const url = `${API.BASE_URL}${API.ENDPOINTS.AREAS}/show/${id}`;
      console.log("URL de la petición:", url);

      const token =
        getAuthToken() || "26plhaQiSc4m6AA6LFUAIP6tllkA2ZdAXF3c5ov5f7a6f932";
      console.log("Token a utilizar:", token);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Respuesta recibida:");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error en la respuesta:", errorText);
        throw new Error(
          `Error al obtener área: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Datos recibidos:", data);

      return {
        id: data.data.id,
        nombre: data.data.nombre,
        estado: data.data.estado ? "Activa" : "Inactiva",
        fechaCreacion: data.data.fecha_creacion || "N/A",
        configuracion_id: data.data.configuracion_id,
      };
    } catch (error) {
      console.error("Error en getById:", error);
      return undefined;
    }
  }

  static async create(areaData: {
    nombre: string;
    configuracion_id: number;
  }): Promise<Area> {
    try {
      console.log("=== Iniciando create de AreaService ===");
      console.log("Datos a enviar:", areaData);

      const url = `${API.BASE_URL}${API.ENDPOINTS.AREAS}/store/${areaData.configuracion_id}`;
      console.log("URL de la petición:", url);

      const token =
        getAuthToken() || "26plhaQiSc4m6AA6LFUAIP6tllkA2ZdAXF3c5ov5f7a6f932";
      console.log("Token a utilizar:", token);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: areaData.nombre,
        }),
      });

      console.log("Respuesta recibida:");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error en la respuesta:", errorText);
        try {
          const errorData = JSON.parse(errorText);
          console.log("Error parseado:", errorData);
          if (errorData.message) {
            if (errorData.message.includes("already exists")) {
              throw new Error("NOMBRE_DUPLICADO");
            }
            throw new Error(errorData.message);
          }
        } catch (parseError) {
          console.error("Error al parsear respuesta de error:", parseError);
        }

        throw new Error(
          `Error al crear área: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Datos recibidos:", data);

      return {
        id: data.data.id,
        nombre: data.data.nombre,
        estado: data.data.estado ? "Activa" : "Inactiva",
        fechaCreacion: data.data.fecha_creacion || "N/A",
        configuracion_id: data.data.configuracion_id,
      };
    } catch (error) {
      console.error("Error en create:", error);
      throw error;
    }
  }

  static async update(id: number, areaData: { nombre: string }): Promise<Area> {
    try {
      console.log("=== Iniciando update de AreaService ===");
      console.log("ID a actualizar:", id);
      console.log("Datos a enviar:", areaData);

      const url = `${API.BASE_URL}${API.ENDPOINTS.AREAS}/update/${id}`;
      console.log("URL de la petición:", url);

      const token =
        getAuthToken() || "26plhaQiSc4m6AA6LFUAIP6tllkA2ZdAXF3c5ov5f7a6f932";
      console.log("Token a utilizar:", token);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: areaData.nombre,
        }),
      });

      console.log("Respuesta recibida:");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error en la respuesta:", errorText);
        try {
          const errorData = JSON.parse(errorText);
          console.log("Error parseado:", errorData);
          if (errorData.message) {
            if (errorData.message.includes("already exists")) {
              throw new Error("NOMBRE_DUPLICADO");
            }
            throw new Error(errorData.message);
          }
        } catch (parseError) {
          console.error("Error al parsear respuesta de error:", parseError);
        }

        throw new Error(
          `Error al actualizar área: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Datos recibidos:", data);

      return {
        id: data.data.id,
        nombre: data.data.nombre,
        estado: data.data.estado ? "Activa" : "Inactiva",
        fechaCreacion: data.data.fecha_creacion || "N/A",
        configuracion_id: data.data.configuracion_id,
      };
    } catch (error) {
      console.error("Error en update:", error);
      throw error;
    }
  }

  static async toggleEstado(id: number): Promise<Area> {
    try {
      console.log("=== Iniciando toggleEstado de AreaService ===");
      console.log("ID a cambiar estado:", id);

      const url = `${API.BASE_URL}${API.ENDPOINTS.AREAS}/destroy/${id}`;
      console.log("URL de la petición:", url);

      const token =
        getAuthToken() || "26plhaQiSc4m6AA6LFUAIP6tllkA2ZdAXF3c5ov5f7a6f932";
      console.log("Token a utilizar:", token);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Respuesta recibida:");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error en la respuesta:", errorText);
        try {
          const errorData = JSON.parse(errorText);
          console.log("Error parseado:", errorData);
          if (errorData.message) {
            throw new Error(errorData.message);
          }
        } catch (parseError) {
          console.error("Error al parsear respuesta de error:", parseError);
        }

        throw new Error(
          `Error al cambiar estado del área: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Datos recibidos:", data);

      return {
        id: data.data.id,
        nombre: data.data.nombre,
        estado: data.data.estado ? "Activa" : "Inactiva",
        fechaCreacion: data.data.fecha_creacion || "N/A",
        configuracion_id: data.data.configuracion_id,
      };
    } catch (error) {
      console.error("Error en toggleEstado:", error);
      throw error;
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      console.log("=== Iniciando delete de AreaService ===");
      console.log("ID a eliminar:", id);

      const url = `${API.BASE_URL}${API.ENDPOINTS.AREAS}/delete/${id}`;
      console.log("URL de la petición:", url);

      const token =
        getAuthToken() || "26plhaQiSc4m6AA6LFUAIP6tllkA2ZdAXF3c5ov5f7a6f932";
      console.log("Token a utilizar:", token);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Respuesta recibida:");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error en la respuesta:", errorText);
        throw new Error(
          `Error al eliminar área: ${response.status} - ${errorText}`
        );
      }

      return true;
    } catch (error) {
      console.error("Error en delete:", error);
      return false;
    }
  }
}
