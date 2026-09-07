import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/session";
import { getAllProjectsWithStats } from "@/lib/data";
import { filterProjects } from "@/lib/project-filters";
import { formatDateID } from "@/lib/format";
import { MAX_PHOTOS_PER_PROJECT } from "@/lib/constants";

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const projects = await getAllProjectsWithStats();
  const filtered = filterProjects(projects, {
    q: searchParams.get("q") ?? undefined,
    teknisi: searchParams.get("teknisi") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  });

  const header = [
    "Kode Project",
    "Nama Project",
    "Lokasi",
    "Teknisi",
    "NIP",
    "Tanggal",
    `Jumlah Foto (maks ${MAX_PHOTOS_PER_PROJECT})`,
    "Status",
  ];
  const rows = filtered.map((p) => [
    p.kode_project,
    p.nama_project,
    p.lokasi ?? "",
    p.technician.name,
    p.technician.nip,
    formatDateID(p.tanggal),
    String(p.photoCount),
    p.status,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => escapeCsv(String(cell))).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="projects.csv"',
    },
  });
}
