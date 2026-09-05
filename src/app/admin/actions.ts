"use server";

import { redirect } from "next/navigation";
import { clearAdminSession } from "@/lib/session";

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/admin/login");
}
