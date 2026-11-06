import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function getSupabaseServerClient(config?: any): SupabaseClient {
  if (supabaseInstance) return supabaseInstance

  const runtimeConfig = config || useRuntimeConfig()
  const supabaseUrl = runtimeConfig.supabaseUrl || process.env.SUPABASE_URL || 'https://kesxqpfnngzofzkpmlix.supabase.co'
  const supabaseKey = runtimeConfig.supabaseKey || process.env.SUPABASE_KEY || 'sb_publishable_uGQJxk4gtX_Lw35UZXSpsA_qldd9t38'

  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })

  return supabaseInstance
}
