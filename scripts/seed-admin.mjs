import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) {
    console.error("File .env.local tidak ditemukan. Salin dari .env.example dulu.");
    process.exit(1);
  }
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum diisi di .env.local");
  process.exit(1);
}

const username = process.argv[2] || "admin.support";
const password = process.argv[3] || "admin123";

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
const passwordHash = await bcrypt.hash(password, 10);

const { error } = await supabase
  .from("admins")
  .upsert({ username, password_hash: passwordHash }, { onConflict: "username" });

if (error) {
  console.error("Gagal membuat admin:", error.message);
  process.exit(1);
}

console.log("Admin berhasil dibuat/diupdate.");
console.log("  Username:", username);
console.log("  Password:", password);
console.log("Login di /admin/login, lalu ganti password lewat menu Pengaturan.");
