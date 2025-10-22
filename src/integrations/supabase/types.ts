export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
          email: string | null
          id: string
          nombre: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          id: string
          nombre?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          nombre?: string | null
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
          {
            foreignKeyName: "reservas_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "v_catalogo_productos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_catalogo_productos: {
        Row: {
          categoria_id: string | null
          created_at: string | null
          deposito: number | null
          descripcion: string | null
          descripcion_corta: string | null
          destacado: boolean | null
          id: string | null
          imagenes: string[] | null
          nombre: string | null
          num_valoraciones: number | null
          precio_diario: number | null
          valoracion: number | null
        }
        Insert: {
          categoria_id?: string | null
          created_at?: string | null
          deposito?: number | null
          descripcion?: string | null
          descripcion_corta?: string | null
          destacado?: boolean | null
          id?: string | null
          imagenes?: string[] | null
          nombre?: string | null
          num_valoraciones?: number | null
          precio_diario?: number | null
          valoracion?: number | null
        }
        Update: {
          categoria_id?: string | null
          created_at?: string | null
          deposito?: number | null
          descripcion?: string | null
          descripcion_corta?: string | null
          destacado?: boolean | null
          id?: string | null
          imagenes?: string[] | null
          nombre?: string | null
          num_valoraciones?: number | null
          precio_diario?: number | null
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
    }
    Functions: {
      check_item_availability: {
        Args: { p_fecha_fin: string; p_fecha_inicio: string; p_item_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_user: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
