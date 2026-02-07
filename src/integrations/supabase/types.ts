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
      audios: {
        Row: {
          audio_url: string
          created_at: string
          duration_seconds: number | null
          id: string
          mode: Database["public"]["Enums"]["content_mode"]
          sha256: string | null
          status: Database["public"]["Enums"]["audio_status"]
          title: string | null
          user_id: string | null
        }
        Insert: {
          audio_url: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          mode?: Database["public"]["Enums"]["content_mode"]
          sha256?: string | null
          status?: Database["public"]["Enums"]["audio_status"]
          title?: string | null
          user_id?: string | null
        }
        Update: {
          audio_url?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          mode?: Database["public"]["Enums"]["content_mode"]
          sha256?: string | null
          status?: Database["public"]["Enums"]["audio_status"]
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      checks: {
        Row: {
          created_at: string
          explanation: string | null
          extracted_claims: Json | null
          id: string
          input_text: string | null
          source_id: string | null
          source_type: Database["public"]["Enums"]["source_type"]
          sources_used: Json | null
          user_id: string | null
          verdict: Database["public"]["Enums"]["verdict_type"] | null
        }
        Insert: {
          created_at?: string
          explanation?: string | null
          extracted_claims?: Json | null
          id?: string
          input_text?: string | null
          source_id?: string | null
          source_type: Database["public"]["Enums"]["source_type"]
          sources_used?: Json | null
          user_id?: string | null
          verdict?: Database["public"]["Enums"]["verdict_type"] | null
        }
        Update: {
          created_at?: string
          explanation?: string | null
          extracted_claims?: Json | null
          id?: string
          input_text?: string | null
          source_id?: string | null
          source_type?: Database["public"]["Enums"]["source_type"]
          sources_used?: Json | null
          user_id?: string | null
          verdict?: Database["public"]["Enums"]["verdict_type"] | null
        }
        Relationships: []
      }
      custody_logs: {
        Row: {
          audio_id: string | null
          check_id: string | null
          created_at: string
          document_id: string | null
          event_type: string
          id: string
          meta: Json | null
          sha256: string | null
        }
        Insert: {
          audio_id?: string | null
          check_id?: string | null
          created_at?: string
          document_id?: string | null
          event_type: string
          id?: string
          meta?: Json | null
          sha256?: string | null
        }
        Update: {
          audio_id?: string | null
          check_id?: string | null
          created_at?: string
          document_id?: string | null
          event_type?: string
          id?: string
          meta?: Json | null
          sha256?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custody_logs_audio_id_fkey"
            columns: ["audio_id"]
            isOneToOne: false
            referencedRelation: "audios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custody_logs_check_id_fkey"
            columns: ["check_id"]
            isOneToOne: false
            referencedRelation: "checks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custody_logs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_pages: {
        Row: {
          confidence: number | null
          created_at: string
          document_id: string
          id: string
          page_number: number
          text: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          document_id: string
          id?: string
          page_number: number
          text?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          document_id?: string
          id?: string
          page_number?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_pages_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_structures: {
        Row: {
          created_at: string
          document_id: string
          id: string
          structured_json: Json
        }
        Insert: {
          created_at?: string
          document_id: string
          id?: string
          structured_json?: Json
        }
        Update: {
          created_at?: string
          document_id?: string
          id?: string
          structured_json?: Json
        }
        Relationships: [
          {
            foreignKeyName: "document_structures_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          file_url: string
          filetype: string
          id: string
          mode: Database["public"]["Enums"]["content_mode"]
          overall_confidence: number | null
          pages_count: number | null
          provider_fallback_used: boolean | null
          provider_primary: string | null
          quality_flags: Json | null
          sha256: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          file_url: string
          filetype: string
          id?: string
          mode?: Database["public"]["Enums"]["content_mode"]
          overall_confidence?: number | null
          pages_count?: number | null
          provider_fallback_used?: boolean | null
          provider_primary?: string | null
          quality_flags?: Json | null
          sha256?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          file_url?: string
          filetype?: string
          id?: string
          mode?: Database["public"]["Enums"]["content_mode"]
          overall_confidence?: number | null
          pages_count?: number | null
          provider_fallback_used?: boolean | null
          provider_primary?: string | null
          quality_flags?: Json | null
          sha256?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      law_articles: {
        Row: {
          article_label: string
          article_text: string
          id: string
          law_id: string
          updated_at: string
        }
        Insert: {
          article_label: string
          article_text: string
          id?: string
          law_id: string
          updated_at?: string
        }
        Update: {
          article_label?: string
          article_text?: string
          id?: string
          law_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "law_articles_law_id_fkey"
            columns: ["law_id"]
            isOneToOne: false
            referencedRelation: "laws"
            referencedColumns: ["id"]
          },
        ]
      }
      laws: {
        Row: {
          created_at: string
          id: string
          last_checked_at: string | null
          number: string | null
          official_url: string | null
          source: string | null
          status: string | null
          summary: string | null
          text_hash: string | null
          text_raw: string | null
          title: string
          type: string
          uri: string | null
          year: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_checked_at?: string | null
          number?: string | null
          official_url?: string | null
          source?: string | null
          status?: string | null
          summary?: string | null
          text_hash?: string | null
          text_raw?: string | null
          title: string
          type: string
          uri?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          last_checked_at?: string | null
          number?: string | null
          official_url?: string | null
          source?: string | null
          status?: string | null
          summary?: string | null
          text_hash?: string | null
          text_raw?: string | null
          title?: string
          type?: string
          uri?: string | null
          year?: number | null
        }
        Relationships: []
      }
      share_links: {
        Row: {
          check_id: string
          created_at: string
          expires_at: string | null
          id: string
          public_token: string
        }
        Insert: {
          check_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          public_token: string
        }
        Update: {
          check_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          public_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_links_check_id_fkey"
            columns: ["check_id"]
            isOneToOne: false
            referencedRelation: "checks"
            referencedColumns: ["id"]
          },
        ]
      }
      transcriptions: {
        Row: {
          audio_id: string
          confidence: number | null
          created_at: string
          id: string
          provider: string | null
          transcript_text: string
        }
        Insert: {
          audio_id: string
          confidence?: number | null
          created_at?: string
          id?: string
          provider?: string | null
          transcript_text: string
        }
        Update: {
          audio_id?: string
          confidence?: number | null
          created_at?: string
          id?: string
          provider?: string | null
          transcript_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "transcriptions_audio_id_fkey"
            columns: ["audio_id"]
            isOneToOne: false
            referencedRelation: "audios"
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
      audio_status: "pending" | "transcribed" | "analyzed" | "error"
      content_mode: "news_tv" | "document"
      source_type: "question" | "document" | "audio"
      verdict_type: "confirmed" | "misleading" | "false" | "unverifiable"
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
      audio_status: ["pending", "transcribed", "analyzed", "error"],
      content_mode: ["news_tv", "document"],
      source_type: ["question", "document", "audio"],
      verdict_type: ["confirmed", "misleading", "false", "unverifiable"],
    },
  },
} as const
