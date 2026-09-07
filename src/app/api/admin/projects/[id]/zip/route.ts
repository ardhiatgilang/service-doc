import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import JSZip from "jszip";
import { getAdminSession } from "@/lib/session";
import { getProjectWithStats, getPhotosForProject } from "@/lib/data";
import { supabaseAdmin, PHOTOS_BUCKET } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const project = await getProjectWithStats(id);
  if (!project) {
    return NextResponse.json({ error: "Project tidak ditemukan." }, { status: 404 });
  }

  const photos = await getPhotosForProject(id);
  const zip = new JSZip();
  let counter = 1;

  for (const photo of photos) {
    let bytes: ArrayBuffer | null = null;
    let ext = "jpg";

    if (photo.file_path.startsWith("http")) {
      const res = await fetch(photo.file_path);
      if (res.ok) {
        bytes = await res.arrayBuffer();
        const type = res.headers.get("content-type") ?? "";
        if (type.includes("png")) ext = "png";
      }
    } else {
      const { data, error } = await supabaseAdmin.storage
        .from(PHOTOS_BUCKET)
        .download(photo.file_path);
      if (!error && data) {
        bytes = await data.arrayBuffer();
        ext = photo.file_path.split(".").pop() || "jpg";
      }
    }

    if (bytes) {
      zip.file(`${counter}.${ext}`, bytes);
      counter += 1;
    }
  }

  const buffer = await zip.generateAsync({ type: "nodebuffer" });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${project.kode_project}-dokumentasi.zip"`,
    },
  });
}
