export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      goals: {
        Row: {
          created_at: string
          deadline: string | null
          id: string
          kind: Database["public"]["Enums"]["goal_kind"]
          starts_on: string
          status: Database["public"]["Enums"]["goal_status"]
          target_value: number
          title: string
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          id?: string
          kind: Database["public"]["Enums"]["goal_kind"]
          starts_on?: string
          status?: Database["public"]["Enums"]["goal_status"]
          target_value: number
          title: string
          unit: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["goal_kind"]
          starts_on?: string
          status?: Database["public"]["Enums"]["goal_status"]
          target_value?: number
          title?: string
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      planned_runs: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          run_type: Database["public"]["Enums"]["run_type"]
          scheduled_for: string
          status: Database["public"]["Enums"]["plan_status"]
          target_distance_km: number | null
          target_duration_seconds: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          run_type?: Database["public"]["Enums"]["run_type"]
          scheduled_for: string
          status?: Database["public"]["Enums"]["plan_status"]
          target_distance_km?: number | null
          target_duration_seconds?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          run_type?: Database["public"]["Enums"]["run_type"]
          scheduled_for?: string
          status?: Database["public"]["Enums"]["plan_status"]
          target_distance_km?: number | null
          target_duration_seconds?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          experience_level: Database["public"]["Enums"]["experience_level"]
          id: string
          primary_goal: Database["public"]["Enums"]["primary_goal"]
          updated_at: string
          weekly_goal_km: number | null
        }
        Insert: {
          created_at?: string
          display_name: string
          experience_level?: Database["public"]["Enums"]["experience_level"]
          id: string
          primary_goal?: Database["public"]["Enums"]["primary_goal"]
          updated_at?: string
          weekly_goal_km?: number | null
        }
        Update: {
          created_at?: string
          display_name?: string
          experience_level?: Database["public"]["Enums"]["experience_level"]
          id?: string
          primary_goal?: Database["public"]["Enums"]["primary_goal"]
          updated_at?: string
          weekly_goal_km?: number | null
        }
        Relationships: []
      }
      runs: {
        Row: {
          created_at: string
          distance_km: number
          duration_seconds: number
          id: string
          notes: string | null
          pace_seconds_per_km: number | null
          perceived_effort: number | null
          performed_at: string
          planned_run_id: string | null
          run_type: Database["public"]["Enums"]["run_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          distance_km: number
          duration_seconds: number
          id?: string
          notes?: string | null
          pace_seconds_per_km?: number | null
          perceived_effort?: number | null
          performed_at: string
          planned_run_id?: string | null
          run_type?: Database["public"]["Enums"]["run_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          distance_km?: number
          duration_seconds?: number
          id?: string
          notes?: string | null
          pace_seconds_per_km?: number | null
          perceived_effort?: number | null
          performed_at?: string
          planned_run_id?: string | null
          run_type?: Database["public"]["Enums"]["run_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "runs_planned_run_id_fkey"
            columns: ["planned_run_id"]
            isOneToOne: true
            referencedRelation: "planned_runs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      experience_level: "beginner" | "intermediate" | "advanced"
      goal_kind:
        | "weekly_distance"
        | "weekly_frequency"
        | "event_distance"
        | "target_pace"
      goal_status: "active" | "completed" | "cancelled"
      plan_status: "planned" | "completed" | "cancelled"
      primary_goal:
        | "start_running"
        | "run_5k"
        | "run_10k"
        | "run_half_marathon"
        | "run_marathon"
        | "improve_pace"
        | "stay_active"
      run_type:
        | "easy"
        | "long"
        | "interval"
        | "tempo"
        | "recovery"
        | "walk_run"
        | "race"
        | "other"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      experience_level: ["beginner", "intermediate", "advanced"],
      goal_kind: [
        "weekly_distance",
        "weekly_frequency",
        "event_distance",
        "target_pace",
      ],
      goal_status: ["active", "completed", "cancelled"],
      plan_status: ["planned", "completed", "cancelled"],
      primary_goal: [
        "start_running",
        "run_5k",
        "run_10k",
        "run_half_marathon",
        "run_marathon",
        "improve_pace",
        "stay_active",
      ],
      run_type: [
        "easy",
        "long",
        "interval",
        "tempo",
        "recovery",
        "walk_run",
        "race",
        "other",
      ],
    },
  },
} as const

