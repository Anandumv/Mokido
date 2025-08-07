import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          name: string | null;
          age: number | null;
          age_group: '6-9 years' | null;
          avatar: string | null;
          level: number;
          xp: number;
          mok_tokens: number;
          savings: number;
          investment_balance: number;
          crypto_balance: number;
          usdc_balance: number;
          travel_miles: number;
          solana_wallet_address: string | null;
          sol_balance: number | null;
          is_parent_mode: boolean;
          badges: string[];
          join_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          name?: string | null;
          age?: number | null;
          age_group?: '6-9 years' | null;
          avatar?: string | null;
          level?: number;
          xp?: number;
          mok_tokens?: number;
          savings?: number;
          investment_balance?: number;
          crypto_balance?: number;
          usdc_balance?: number;
          travel_miles?: number;
          solana_wallet_address?: string | null;
          sol_balance?: number | null;
          is_parent_mode?: boolean;
          badges?: string[];
          join_date?: string | null;
        };
        Update: {
          email?: string | null;
          name?: string | null;
          age?: number | null;
          age_group?: '6-9 years' | null;
          avatar?: string | null;
          level?: number;
          xp?: number;
          mok_tokens?: number;
          savings?: number;
          investment_balance?: number;
          crypto_balance?: number;
          usdc_balance?: number;
          travel_miles?: number;
          solana_wallet_address?: string | null;
          sol_balance?: number | null;
          is_parent_mode?: boolean;
          badges?: string[];
          join_date?: string | null;
          updated_at?: string;
        };
      };
      learning_modules: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          difficulty: string;
          xp_reward: number;
          duration: string;
          age_groups: string[];
          icon: string;
          lessons: number;
          created_at: string;
          updated_at: string;
        };
      };
      user_learning_progress: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          completed: boolean;
          score: number | null;
          xp_earned: number | null;
          mok_tokens_earned: number | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          module_id: string;
          completed?: boolean;
          score?: number | null;
          xp_earned?: number | null;
          mok_tokens_earned?: number | null;
          completed_at?: string | null;
        };
        Update: {
          completed?: boolean;
          score?: number | null;
          xp_earned?: number | null;
          mok_tokens_earned?: number | null;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      missions: {
        Row: {
          id: string;
          title: string;
          description: string;
          reward: number;
          difficulty: string;
          category: string;
          due_date_template: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      user_missions: {
        Row: {
          id: string;
          user_id: string;
          mission_id: string;
          completed: boolean;
          completed_at: string | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          mission_id: string;
          completed?: boolean;
          completed_at?: string | null;
          due_date?: string | null;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
          due_date?: string | null;
          updated_at?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          target_amount: number;
          current_amount: number;
          category: string;
          due_date: string;
          priority: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          target_amount: number;
          current_amount?: number;
          category: string;
          due_date: string;
          priority: string;
        };
        Update: {
          title?: string;
          target_amount?: number;
          current_amount?: number;
          category?: string;
          due_date?: string;
          priority?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          amount: number;
          category: string;
          description: string;
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          type: string;
          amount: number;
          category: string;
          description: string;
          date: string;
        };
      };
    };
  };
}