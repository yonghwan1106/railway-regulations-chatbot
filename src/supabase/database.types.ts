export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          organization: string | null
          role: 'engineer' | 'government_official' | 'contractor' | 'admin'
          created_at: string
          last_login: string
        }
        Insert: {
          id: string
          email: string
          name: string
          organization?: string | null
          role?: 'engineer' | 'government_official' | 'contractor' | 'admin'
          created_at?: string
          last_login?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          organization?: string | null
          role?: 'engineer' | 'government_official' | 'contractor' | 'admin'
          created_at?: string
          last_login?: string
        }
      }
      regulations: {
        Row: {
          id: string
          title: string
          content: string
          category: string
          article_number: string
          source_document: string
          priority_level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category: string
          article_number: string
          source_document: string
          priority_level?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: string
          article_number?: string
          source_document?: string
          priority_level?: number
          created_at?: string
          updated_at?: string
        }
      }
      search_history: {
        Row: {
          id: string
          user_id: string
          query: string
          results_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          query: string
          results_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          query?: string
          results_count?: number
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          regulation_id: string
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          regulation_id: string
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          regulation_id?: string
          note?: string | null
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          favorite_regulations: string[]
          search_history_enabled: boolean
          notification_regulation_updates: boolean
          notification_system_announcements: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          favorite_regulations?: string[]
          search_history_enabled?: boolean
          notification_regulation_updates?: boolean
          notification_system_announcements?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          favorite_regulations?: string[]
          search_history_enabled?: boolean
          notification_regulation_updates?: boolean
          notification_system_announcements?: boolean
          created_at?: string
          updated_at?: string
        }
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