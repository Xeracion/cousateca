export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          descripcion: string | null
          descripcion_es: string | null
          id: string
          imagen_url: string | null
          nombre: string
          nombre_es: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          descripcion_es?: string | null
          id?: string
          imagen_url?: string | null
          nombre: string
          nombre_es?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          descripcion_es?: string | null
          id?: string
          imagen_url?: string | null
          nombre?: string
          nombre_es?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      item_state_history: {
        Row: {
          created_at: string | null
          estado_anterior_id: string | null
          estado_nuevo_id: string
          fecha_cambio: string | null
          id: string
          item_id: string
          notas: string | null
          usuario_id: string | null
        }
        Insert: {
          created_at?: string | null
          estado_anterior_id?: string | null
          estado_nuevo_id: string
          fecha_cambio?: string | null
          id?: string
          item_id: string
          notas?: string | null
          usuario_id?: string | null
        }
        Update: {
          created_at?: string | null
          estado_anterior_id?: string | null
          estado_nuevo_id?: string
          fecha_cambio?: string | null
          id?: string
          item_id?: string
          notas?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_state_history_estado_anterior_id_fkey"
            columns: ["estado_anterior_id"]
            isOneToOne: false
            referencedRelation: "item_states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_state_history_estado_nuevo_id_fkey"
            columns: ["estado_nuevo_id"]
            isOneToOne: false
            referencedRelation: "item_states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_state_history_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_state_history_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      item_states: {
        Row: {
          created_at: string | null
          descripcion: string | null
          id: string
          nombre: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      items: {
        Row: {
          categoria_id: string | null
          codigo_barras: string | null
          created_at: string | null
          descripcion: string | null
          disponible: boolean | null
          estado_id: string
          fecha_adquisicion: string | null
          id: string
          imagen_url: string | null
          max_dias_prestamo: number | null
          nombre: string
          ubicacion: string | null
          updated_at: string | null
          valor_estimado: number | null
        }
        Insert: {
          categoria_id?: string | null
          codigo_barras?: string | null
          created_at?: string | null
          descripcion?: string | null
          disponible?: boolean | null
          estado_id: string
          fecha_adquisicion?: string | null
          id?: string
          imagen_url?: string | null
          max_dias_prestamo?: number | null
          nombre: string
          ubicacion?: string | null
          updated_at?: string | null
          valor_estimado?: number | null
        }
        Update: {
          categoria_id?: string | null
          codigo_barras?: string | null
          created_at?: string | null
          descripcion?: string | null
          disponible?: boolean | null
          estado_id?: string
          fecha_adquisicion?: string | null
          id?: string
          imagen_url?: string | null
          max_dias_prestamo?: number | null
          nombre?: string
          ubicacion?: string | null
          updated_at?: string | null
          valor_estimado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "items_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_estado_id_fkey"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "item_states"
            referencedColumns: ["id"]
          },
        ]
      }
      perfiles: {
        Row: {
          created_at: string | null
          direccion: string | null
          id: string
          nombre: string | null
          role: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          direccion?: string | null
          id: string
          nombre?: string | null
          role?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          direccion?: string | null
          id?: string
          nombre?: string | null
          role?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      productos: {
        Row: {
          categoria_id: string | null
          created_at: string | null
          deposito: number
          descripcion: string | null
          descripcion_corta: string | null
          destacado: boolean | null
          disponible: boolean | null
          id: string
          imagenes: string[]
          nombre: string
          num_valoraciones: number | null
          precio_diario: number
          precio_mensual: number
          precio_semanal: number
          updated_at: string | null
          valoracion: number | null
        }
        Insert: {
          categoria_id?: string | null
          created_at?: string | null
          deposito: number
          descripcion?: string | null
          descripcion_corta?: string | null
          destacado?: boolean | null
          disponible?: boolean | null
          id?: string
          imagenes: string[]
          nombre: string
          num_valoraciones?: number | null
          precio_diario: number
          precio_mensual: number
          precio_semanal: number
          updated_at?: string | null
          valoracion?: number | null
        }
        Update: {
          categoria_id?: string | null
          created_at?: string | null
          deposito?: number
          descripcion?: string | null
          descripcion_corta?: string | null
          destacado?: boolean | null
          disponible?: boolean | null
          id?: string
          imagenes?: string[]
          nombre?: string
          num_valoraciones?: number | null
          precio_diario?: number
          precio_mensual?: number
          precio_semanal?: number
          updated_at?: string | null
          valoracion?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas: {
        Row: {
          created_at: string | null
          estado: string
          fecha_fin: string
          fecha_inicio: string
          id: string
          precio_total: number
          producto_id: string
          stripe_session_id: string | null
          updated_at: string | null
          usuario_id: string
        }
        Insert: {
          created_at?: string | null
          estado?: string
          fecha_fin: string
          fecha_inicio: string
          id?: string
          precio_total: number
          producto_id: string
          stripe_session_id?: string | null
          updated_at?: string | null
          usuario_id: string
        }
        Update: {
          created_at?: string | null
          estado?: string
          fecha_fin?: string
          fecha_inicio?: string
          id?: string
          precio_total?: number
          producto_id?: string
          stripe_session_id?: string | null
          updated_at?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservas_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          created_at: string | null
          estado: string
          fecha_devolucion_real: string | null
          fecha_fin_prevista: string
          fecha_inicio: string
          fecha_solicitud: string | null
          id: string
          item_id: string
          notas: string | null
          updated_at: string | null
          usuario_id: string
        }
        Insert: {
          created_at?: string | null
          estado?: string
          fecha_devolucion_real?: string | null
          fecha_fin_prevista: string
          fecha_inicio: string
          fecha_solicitud?: string | null
          id?: string
          item_id: string
          notas?: string | null
          updated_at?: string | null
          usuario_id: string
        }
        Update: {
          created_at?: string | null
          estado?: string
          fecha_devolucion_real?: string | null
          fecha_fin_prevista?: string
          fecha_inicio?: string
          fecha_solicitud?: string | null
          id?: string
          item_id?: string
          notas?: string | null
          updated_at?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          direccion: string | null
          email: string
          estado: string | null
          fecha_registro: string | null
          id: string
          nombre: string
          rol: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          direccion?: string | null
          email: string
          estado?: string | null
          fecha_registro?: string | null
          id: string
          nombre: string
          rol?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          direccion?: string | null
          email?: string
          estado?: string | null
          fecha_registro?: string | null
          id?: string
          nombre?: string
          rol?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_item_availability: {
        Args: { p_item_id: string; p_fecha_inicio: string; p_fecha_fin: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
