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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_learning_history: {
        Row: {
          created_at: string
          description: string
          id: string
          impact: string
          metrics_change: Json | null
          related_incidents: string[]
          title: string
          type: Database["public"]["Enums"]["ai_learning_type"]
        }
        Insert: {
          created_at?: string
          description?: string
          id: string
          impact?: string
          metrics_change?: Json | null
          related_incidents?: string[]
          title: string
          type: Database["public"]["Enums"]["ai_learning_type"]
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          impact?: string
          metrics_change?: Json | null
          related_incidents?: string[]
          title?: string
          type?: Database["public"]["Enums"]["ai_learning_type"]
        }
        Relationships: []
      }
      alert_trends: {
        Row: {
          created_at: string
          critical: number
          high: number
          hour: string
          id: string
          low: number
          medium: number
        }
        Insert: {
          created_at?: string
          critical?: number
          high?: number
          hour: string
          id?: string
          low?: number
          medium?: number
        }
        Update: {
          created_at?: string
          critical?: number
          high?: number
          hour?: string
          id?: string
          low?: number
          medium?: number
        }
        Relationships: []
      }
      analyst_notes: {
        Row: {
          ai_relevant: boolean
          author_id: string | null
          author_name: string
          author_role: string
          content: string
          created_at: string
          id: string
          incident_id: string
          type: Database["public"]["Enums"]["note_type"]
        }
        Insert: {
          ai_relevant?: boolean
          author_id?: string | null
          author_name?: string
          author_role?: string
          content: string
          created_at?: string
          id?: string
          incident_id: string
          type?: Database["public"]["Enums"]["note_type"]
        }
        Update: {
          ai_relevant?: boolean
          author_id?: string | null
          author_name?: string
          author_role?: string
          content?: string
          created_at?: string
          id?: string
          incident_id?: string
          type?: Database["public"]["Enums"]["note_type"]
        }
        Relationships: [
          {
            foreignKeyName: "analyst_notes_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      attack_chain_steps: {
        Row: {
          attack_chain_id: string
          confidence: number
          created_at: string
          detail: string
          evidence: string[]
          id: string
          label: string
          mitre_id: string
          severity: Database["public"]["Enums"]["severity"]
          step_order: number
          step_timestamp: string | null
          technique: string
        }
        Insert: {
          attack_chain_id: string
          confidence?: number
          created_at?: string
          detail?: string
          evidence?: string[]
          id: string
          label: string
          mitre_id?: string
          severity?: Database["public"]["Enums"]["severity"]
          step_order?: number
          step_timestamp?: string | null
          technique?: string
        }
        Update: {
          attack_chain_id?: string
          confidence?: number
          created_at?: string
          detail?: string
          evidence?: string[]
          id?: string
          label?: string
          mitre_id?: string
          severity?: Database["public"]["Enums"]["severity"]
          step_order?: number
          step_timestamp?: string | null
          technique?: string
        }
        Relationships: [
          {
            foreignKeyName: "attack_chain_steps_attack_chain_id_fkey"
            columns: ["attack_chain_id"]
            isOneToOne: false
            referencedRelation: "attack_chains"
            referencedColumns: ["id"]
          },
        ]
      }
      attack_chains: {
        Row: {
          created_at: string
          id: string
          incident_id: string
          overall_confidence: number
          severity: Database["public"]["Enums"]["severity"]
          threat: string
          title: string
        }
        Insert: {
          created_at?: string
          id: string
          incident_id: string
          overall_confidence?: number
          severity?: Database["public"]["Enums"]["severity"]
          threat?: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          incident_id?: string
          overall_confidence?: number
          severity?: Database["public"]["Enums"]["severity"]
          threat?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "attack_chains_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      category_distribution: {
        Row: {
          created_at: string
          fill: string
          id: string
          name: string
          value: number
        }
        Insert: {
          created_at?: string
          fill?: string
          id?: string
          name: string
          value?: number
        }
        Update: {
          created_at?: string
          fill?: string
          id?: string
          name?: string
          value?: number
        }
        Relationships: []
      }
      dashboard_metrics: {
        Row: {
          active_analysts: number
          created_at: string
          critical_alerts: number
          escalated: number
          false_positive_rate: number
          id: string
          ingestion_rate: number
          mttr: number
          resolved_today: number
          total_incidents: number
        }
        Insert: {
          active_analysts?: number
          created_at?: string
          critical_alerts?: number
          escalated?: number
          false_positive_rate?: number
          id?: string
          ingestion_rate?: number
          mttr?: number
          resolved_today?: number
          total_incidents?: number
        }
        Update: {
          active_analysts?: number
          created_at?: string
          critical_alerts?: number
          escalated?: number
          false_positive_rate?: number
          id?: string
          ingestion_rate?: number
          mttr?: number
          resolved_today?: number
          total_incidents?: number
        }
        Relationships: []
      }
      incidents: {
        Row: {
          affected_assets: string[]
          ai_summary: string
          category: Database["public"]["Enums"]["incident_category"]
          confidence_score: number
          created_at: string
          created_by: string | null
          description: string
          id: string
          is_false_positive: boolean
          risk_score: number
          severity: Database["public"]["Enums"]["severity"]
          source_ip: string
          status: Database["public"]["Enums"]["incident_status"]
          target_ip: string
          title: string
          updated_at: string
        }
        Insert: {
          affected_assets?: string[]
          ai_summary?: string
          category?: Database["public"]["Enums"]["incident_category"]
          confidence_score?: number
          created_at?: string
          created_by?: string | null
          description?: string
          id: string
          is_false_positive?: boolean
          risk_score?: number
          severity?: Database["public"]["Enums"]["severity"]
          source_ip?: string
          status?: Database["public"]["Enums"]["incident_status"]
          target_ip?: string
          title: string
          updated_at?: string
        }
        Update: {
          affected_assets?: string[]
          ai_summary?: string
          category?: Database["public"]["Enums"]["incident_category"]
          confidence_score?: number
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          is_false_positive?: boolean
          risk_score?: number
          severity?: Database["public"]["Enums"]["severity"]
          source_ip?: string
          status?: Database["public"]["Enums"]["incident_status"]
          target_ip?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          category: Database["public"]["Enums"]["notification_category"]
          created_at: string
          dismissed: boolean
          id: string
          incident_id: string | null
          message: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["notification_category"]
          created_at?: string
          dismissed?: boolean
          id?: string
          incident_id?: string | null
          message?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["notification_category"]
          created_at?: string
          dismissed?: boolean
          id?: string
          incident_id?: string | null
          message?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          role_title: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          role_title?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      resolved_incidents: {
        Row: {
          ai_accuracy: number
          category: string
          created_at: string
          detected_at: string
          id: string
          lessons_learned: string
          resolution: string
          resolved_at: string
          resolved_by: string
          root_cause: string
          severity: Database["public"]["Enums"]["severity"]
          tags: string[]
          title: string
          ttd: number
          ttr: number
        }
        Insert: {
          ai_accuracy?: number
          category?: string
          created_at?: string
          detected_at?: string
          id: string
          lessons_learned?: string
          resolution?: string
          resolved_at?: string
          resolved_by?: string
          root_cause?: string
          severity?: Database["public"]["Enums"]["severity"]
          tags?: string[]
          title: string
          ttd?: number
          ttr?: number
        }
        Update: {
          ai_accuracy?: number
          category?: string
          created_at?: string
          detected_at?: string
          id?: string
          lessons_learned?: string
          resolution?: string
          resolved_at?: string
          resolved_by?: string
          root_cause?: string
          severity?: Database["public"]["Enums"]["severity"]
          tags?: string[]
          title?: string
          ttd?: number
          ttr?: number
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          created_at: string
          detail: string
          event_timestamp: string
          id: string
          incident_id: string | null
          label: string
          severity: Database["public"]["Enums"]["severity"]
        }
        Insert: {
          created_at?: string
          detail?: string
          event_timestamp?: string
          id?: string
          incident_id?: string | null
          label: string
          severity?: Database["public"]["Enums"]["severity"]
        }
        Update: {
          created_at?: string
          detail?: string
          event_timestamp?: string
          id?: string
          incident_id?: string | null
          label?: string
          severity?: Database["public"]["Enums"]["severity"]
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      ai_learning_type:
        | "model-update"
        | "rule-tuned"
        | "fp-correction"
        | "pattern-learned"
        | "threshold-adjusted"
      app_role: "admin" | "analyst" | "viewer"
      incident_category:
        | "malware"
        | "phishing"
        | "brute-force"
        | "data-exfiltration"
        | "insider-threat"
        | "dos"
        | "unauthorized-access"
        | "reconnaissance"
      incident_status: "open" | "investigating" | "resolved" | "escalated"
      note_type: "observation" | "correction" | "recommendation" | "escalation"
      notification_category: "critical" | "escalation" | "system" | "ai-insight"
      severity: "critical" | "high" | "medium" | "low" | "info"
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
      ai_learning_type: [
        "model-update",
        "rule-tuned",
        "fp-correction",
        "pattern-learned",
        "threshold-adjusted",
      ],
      app_role: ["admin", "analyst", "viewer"],
      incident_category: [
        "malware",
        "phishing",
        "brute-force",
        "data-exfiltration",
        "insider-threat",
        "dos",
        "unauthorized-access",
        "reconnaissance",
      ],
      incident_status: ["open", "investigating", "resolved", "escalated"],
      note_type: ["observation", "correction", "recommendation", "escalation"],
      notification_category: ["critical", "escalation", "system", "ai-insight"],
      severity: ["critical", "high", "medium", "low", "info"],
    },
  },
} as const
