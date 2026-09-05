"use server";

import { redirect } from "next/navigation";
import { clearTeknisiSession } from "@/lib/session";

export async function logoutTechnicianAction() {
  await clearTeknisiSession();
  redirect("/teknisi/login");
}
