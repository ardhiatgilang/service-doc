-- Service Doc — skema database Supabase
-- Jalankan file ini di Supabase Dashboard -> SQL Editor -> New query -> Run

create extension if not exists "pgcrypto";

create table if not exists technicians (
  id uuid primary key default gen_random_uuid(),
  nip text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  kode_project text unique not null,
  nama_project text not null,
  lokasi text,
  deskripsi text,
  technician_id uuid not null references technicians(id) on delete restrict,
  tanggal date not null default current_date,
  status text not null default 'aktif' check (status in ('aktif', 'selesai')),
  created_at timestamptz not null default now()
);

create table if not exists project_categories (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  category text not null check (category in ('before_service', 'nameplate', 'during_service', 'after_service', 'sparepart')),
  required_count int,
  sort_order int not null default 0,
  unique (project_id, category)
);

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  category text not null check (category in ('before_service', 'nameplate', 'during_service', 'after_service', 'sparepart')),
  file_path text not null,
  uploaded_by uuid references technicians(id),
  uploaded_at timestamptz not null default now()
);

create index if not exists idx_projects_technician on projects(technician_id);
create index if not exists idx_project_categories_project on project_categories(project_id);
create index if not exists idx_photos_project on photos(project_id);

-- RLS dimatikan: semua akses data lewat API route Next.js di server
-- menggunakan SUPABASE_SERVICE_ROLE_KEY, jadi tidak lewat browser langsung.
alter table technicians disable row level security;
alter table admins disable row level security;
alter table projects disable row level security;
alter table project_categories disable row level security;
alter table photos disable row level security;

-- Storage bucket untuk foto (buat manual sekali lewat Dashboard -> Storage -> New bucket
-- nama: service-photos, set "Public bucket" = ON, lalu jalankan bagian ini jika mau
-- policy tambahan; untuk demo, public bucket saja sudah cukup).
