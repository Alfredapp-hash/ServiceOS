import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface ServiceOSDatabaseConfig {
  url: string;
  anonKey: string;
}

export function createServiceOSClient(config: ServiceOSDatabaseConfig): SupabaseClient {
  if (!config.url || !config.anonKey) {
    throw new Error("ServiceOS database URL and anonymous key are required.");
  }

  return createClient(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}
