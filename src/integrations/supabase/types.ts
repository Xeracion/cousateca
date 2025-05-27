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
