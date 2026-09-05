"use server";

import { redirect } from "next/navigation";
import { getTechnicianByNip } from "@/lib/data";
import { createTeknisiSession } from "@/lib/session";

export type TeknisiLoginState = { error: string | null };

export async function loginTechnicianAction(
  _prevState: TeknisiLoginState,
  formData: FormData
): Promise<TeknisiLoginState> {
  const nip = String(formData.get("nip") ?? "").trim();
  if (!nip) return { error: "NIP wajib diisi." };

  const technician = await getTechnicianByNip(nip);
  if (!technician) return { error: "NIP tidak ditemukan." };

  await createTeknisiSession(technician.id, technician.nip);
  redirect("/teknisi/projects");
}

export async function lookupTechnicianAction(nip: string) {
  const trimmed = nip.trim();
  if (!trimmed) return null;
  const technician = await getTechnicianByNip(trimmed);
  return technician ? { name: technician.name } : null;
}
