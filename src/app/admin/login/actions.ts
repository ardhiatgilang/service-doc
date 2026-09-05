"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { getAdminByUsername } from "@/lib/data";
import { createAdminSession } from "@/lib/session";

export type AdminLoginState = { error: string | null };

export async function loginAdminAction(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Username dan password wajib diisi." };
  }

  const admin = await getAdminByUsername(username);
  if (!admin) return { error: "Username atau password salah." };

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) return { error: "Username atau password salah." };

  await createAdminSession(admin.id, admin.username);
  redirect("/admin/dashboard");
}
