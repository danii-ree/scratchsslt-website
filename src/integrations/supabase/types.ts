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
      documents: {
        Row: {
          created_at: string | null
          description: string | null
          file_url: string
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_url: string
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_url?: string
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      matching_questions: {
        Row: {
          created_at: string | null
          id: string
          pairs: Json
          practice_content_id: string | null
          question_text: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          pairs: Json
          practice_content_id?: string | null
          question_text: string
        }
        Update: {
          created_at?: string | null
          id?: string
          pairs?: Json
          practice_content_id?: string | null
          question_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "matching_questions_practice_content_id_fkey"
            columns: ["practice_content_id"]
            isOneToOne: false
            referencedRelation: "practice_content"
            referencedColumns: ["id"]
          },
        ]
      }
      multiple_choice_questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          id: string
          options: Json
          practice_content_id: string | null
          question_text: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          id?: string
          options: Json
          practice_content_id?: string | null
          question_text: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          id?: string
          options?: Json
          practice_content_id?: string | null
          question_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "multiple_choice_questions_practice_content_id_fkey"
            columns: ["practice_content_id"]
            isOneToOne: false
            referencedRelation: "practice_content"
            referencedColumns: ["id"]
          },
        ]
      }
      paragraph_questions: {
        Row: {
          created_at: string | null
          id: string
          practice_content_id: string | null
          question_text: string
          rubric: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          practice_content_id?: string | null
          question_text: string
          rubric: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          practice_content_id?: string | null
          question_text?: string
          rubric?: Json
        }
        Relationships: [
          {
            foreignKeyName: "paragraph_questions_practice_content_id_fkey"
            columns: ["practice_content_id"]
            isOneToOne: false
            referencedRelation: "practice_content"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_content: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: string
          document_id: string | null
          id: string
          image_url: string | null
          question_type: string
          time_estimate: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty?: string
          document_id?: string | null
          id?: string
          image_url?: string | null
          question_type: string
          time_estimate?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: string
          document_id?: string | null
          id?: string
          image_url?: string | null
          question_type?: string
          time_estimate?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "practice_content_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          updated_at: string | null
          profile_picture_url: string | null
          school: string | null
          grade: string | null
          bio: string | null
        }
        Insert: {
          created_at?: string | null
          first_name: string
          id: string
          last_name: string
          updated_at?: string | null
          profile_picture_url?: string | null
          school?: string | null
          grade?: string | null
          bio?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          updated_at?: string | null
          profile_picture_url?: string | null
          school?: string | null
          grade?: string | null
          bio?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_answer: string | null
          created_at: string | null
          id: string
          options: Json | null
          practice_content_id: string | null
          question_text: string
          question_type: string
          updated_at: string | null
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string | null
          id?: string
          options?: Json | null
          practice_content_id?: string | null
          question_text: string
          question_type: string
          updated_at?: string | null
        }
        Update: {
          correct_answer?: string | null
          created_at?: string | null
          id?: string
          options?: Json | null
          practice_content_id?: string | null
          question_text?: string
          question_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_practice_content_id_fkey"
            columns: ["practice_content_id"]
            isOneToOne: false
            referencedRelation: "practice_content"
            referencedColumns: ["id"]
          },
        ]
      }
      short_answer_questions: {
        Row: {
          answer_key: string
          created_at: string | null
          id: string
          practice_content_id: string | null
          question_text: string
        }
        Insert: {
          answer_key: string
          created_at?: string | null
          id?: string
          practice_content_id?: string | null
          question_text: string
        }
        Update: {
          answer_key?: string
          created_at?: string | null
          id?: string
          practice_content_id?: string | null
          question_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "short_answer_questions_practice_content_id_fkey"
            columns: ["practice_content_id"]
            isOneToOne: false
            referencedRelation: "practice_content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity: {
        Row: {
          id: string
          user_id: string
          practice_content_id: string | null
          activity_type: string
          score: number | null
          total_questions: number | null
          correct_answers: number | null
          time_spent_seconds: number | null
          started_at: string
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          practice_content_id?: string | null
          activity_type: string
          score?: number | null
          total_questions?: number | null
          correct_answers?: number | null
          time_spent_seconds?: number | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          practice_content_id?: string | null
          activity_type?: string
          score?: number | null
          total_questions?: number | null
          correct_answers?: number | null
          time_spent_seconds?: number | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activity_practice_content_id_fkey"
            columns: ["practice_content_id"]
            isOneToOne: false
            referencedRelation: "practice_content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          id: string
          user_id: string
          total_practice_sessions: number
          total_questions_answered: number
          total_correct_answers: number
          total_time_spent_seconds: number
          current_streak_days: number
          longest_streak_days: number
          last_practice_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_practice_sessions?: number
          total_questions_answered?: number
          total_correct_answers?: number
          total_time_spent_seconds?: number
          current_streak_days?: number
          longest_streak_days?: number
          last_practice_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_practice_sessions?: number
          total_questions_answered?: number
          total_correct_answers?: number
          total_time_spent_seconds?: number
          current_streak_days?: number
          longest_streak_days?: number
          last_practice_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_type: string
          title: string
          description: string | null
          icon_name: string | null
          earned_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_type: string
          title: string
          description?: string | null
          icon_name?: string | null
          earned_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_type?: string
          title?: string
          description?: string | null
          icon_name?: string | null
          earned_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
