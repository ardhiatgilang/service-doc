import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    "SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY belum diset di environment variables (.env.local)."
  );
}

// Hanya dipakai di server (Route Handlers, Server Components, Server Actions).
// Service role key melewati RLS, jadi jangan pernah diekspos ke client.
export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});

export const PHOTOS_BUCKET = "service-photos";

export function photoPublicUrl(filePath: string): string {
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }
  const { data } = supabaseAdmin.storage.from(PHOTOS_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}
