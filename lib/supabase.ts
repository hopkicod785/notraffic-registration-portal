import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if using placeholder values
if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
  console.warn('⚠️  Supabase environment variables not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      installations: {
        Row: {
          id: string
          created_at: string
          intersection_name: string
          end_user: string
          distributor: string
          cabinet_type: string
          tls_connection: string
          detection_io: string
          phasing_files: string[]
          timing_files: string[]
          contact_name: string
          contact_email: string
          contact_phone: string
          estimated_install_date: string
          status: 'pending' | 'completed' | 'cancelled'
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          intersection_name: string
          end_user: string
          distributor: string
          cabinet_type: string
          tls_connection: string
          detection_io: string
          phasing_files?: string[]
          timing_files?: string[]
          contact_name: string
          contact_email: string
          contact_phone: string
          estimated_install_date: string
          status?: 'pending' | 'completed' | 'cancelled'
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          intersection_name?: string
          end_user?: string
          distributor?: string
          cabinet_type?: string
          tls_connection?: string
          detection_io?: string
          phasing_files?: string[]
          timing_files?: string[]
          contact_name?: string
          contact_email?: string
          contact_phone?: string
          estimated_install_date?: string
          status?: 'pending' | 'completed' | 'cancelled'
          updated_at?: string
        }
      }
      mobility_accounts: {
        Row: {
          id: string
          created_at: string
          first_name: string
          last_name: string
          email: string
          phone: string
          end_user: string
          status: 'active' | 'inactive'
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          first_name: string
          last_name: string
          email: string
          phone: string
          end_user: string
          status?: 'active' | 'inactive'
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          end_user?: string
          status?: 'active' | 'inactive'
          updated_at?: string
        }
      }
    }
  }
}
