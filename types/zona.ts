export interface Zona {
  id: number;
  nombre: string;
  estado: boolean;
  fecha_creacion?: string;
  configuracion_id?: number;
}

export interface ZonaApiResponse {
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
