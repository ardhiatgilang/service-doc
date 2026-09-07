import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { getTeknisiSession } from "@/lib/session";
import { getProjectWithStats, insertPhotos } from "@/lib/data";
import { supabaseAdmin, PHOTOS_BUCKET } from "@/lib/supabase";
import { MAX_PHOTOS_PER_PROJECT } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const session = await getTeknisiSession();
  if (!session) {
    return NextResponse.json({ error: "Sesi tidak valid, silakan login ulang." }, { status: 401 });
  }

  const formData = await request.formData();
  const projectId = String(formData.get("projectId") ?? "");
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (!projectId) {
    return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });
  }
  if (files.length === 0) {
    return NextResponse.json({ error: "Pilih minimal satu foto." }, { status: 400 });
  }

  const project = await getProjectWithStats(projectId);
  if (!project || project.technician_id !== session.technicianId) {
    return NextResponse.json({ error: "Project tidak ditemukan." }, { status: 404 });
  }

  const remainingSlots = MAX_PHOTOS_PER_PROJECT - project.photoCount;
  if (remainingSlots <= 0) {
    return NextResponse.json(
      { error: `Project ini sudah mencapai batas maksimal ${MAX_PHOTOS_PER_PROJECT} foto.` },
      { status: 400 }
    );
  }
  if (files.length > remainingSlots) {
    return NextResponse.json(
      { error: `Hanya bisa menambah ${remainingSlots} foto lagi (maks ${MAX_PHOTOS_PER_PROJECT} per project).` },
      { status: 400 }
    );
  }

  const uploadedPaths: string[] = [];
  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${projectId}/${Date.now()}-${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabaseAdmin.storage
      .from(PHOTOS_BUCKET)
      .upload(path, buffer, { contentType: file.type || "image/jpeg" });
    if (error) {
      return NextResponse.json({ error: `Gagal upload: ${error.message}` }, { status: 500 });
    }
    uploadedPaths.push(path);
  }

  await insertPhotos(
    uploadedPaths.map((path) => ({
      project_id: projectId,
      file_path: path,
      uploaded_by: session.technicianId,
    }))
  );

  return NextResponse.json({
    uploadedCount: uploadedPaths.length,
    uploadedAt: new Date().toISOString(),
  });
}
