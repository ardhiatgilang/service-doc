-- Data contoh (demo) — jalankan setelah schema.sql
-- Foto memakai URL placeholder (picsum.photos) supaya progress bar & thumbnail
-- langsung terisi tanpa perlu upload manual dulu.

insert into technicians (nip, name) values
  ('T-00123', 'Budi Santoso'),
  ('T-00124', 'Andi Setiawan'),
  ('T-00125', 'Rudi Hermawan'),
  ('T-00126', 'Deni Kurniawan')
on conflict (nip) do nothing;

insert into projects (kode_project, nama_project, lokasi, deskripsi, technician_id, tanggal, status)
select 'PRJ-00123', 'PT ABC', 'Jakarta', 'Servis rutin unit chiller lantai 5', id, '2026-09-01'::date, 'aktif' from technicians where nip = 'T-00123'
union all
select 'PRJ-00124', 'PT DEF', 'Bandung', 'Instalasi unit AC baru gedung B', id, '2026-09-01'::date, 'aktif' from technicians where nip = 'T-00124'
union all
select 'PRJ-00125', 'PT GHI', 'Surabaya', 'Maintenance berkala genset', id, '2026-08-31'::date, 'selesai' from technicians where nip = 'T-00125'
union all
select 'PRJ-00126', 'PT JKL', 'Semarang', 'Perbaikan sistem kelistrikan', id, '2026-08-31'::date, 'aktif' from technicians where nip = 'T-00126'
union all
select 'PRJ-00127', 'PT MNO', 'Jakarta', 'Servis unit chiller lantai 2', id, '2026-08-30'::date, 'aktif' from technicians where nip = 'T-00123'
on conflict (kode_project) do nothing;

insert into project_categories (project_id, category, required_count, sort_order)
select p.id, c.category, c.required_count, c.sort_order
from projects p
cross join (values
  ('before_service', 2, 1),
  ('nameplate', 1, 2),
  ('during_service', 2, 3),
  ('after_service', 2, 4),
  ('sparepart', null, 5)
) as c(category, required_count, sort_order)
on conflict (project_id, category) do nothing;

insert into photos (project_id, category, file_path, uploaded_by, uploaded_at)
select p.id, v.category, v.file_path, p.technician_id, now()
from projects p
join (values
  ('PRJ-00123', 'before_service', 'https://picsum.photos/seed/prj123-bs-1/600/800'),
  ('PRJ-00123', 'before_service', 'https://picsum.photos/seed/prj123-bs-2/600/800'),
  ('PRJ-00123', 'nameplate', 'https://picsum.photos/seed/prj123-np-1/600/800'),
  ('PRJ-00123', 'during_service', 'https://picsum.photos/seed/prj123-ds-1/600/800'),
  ('PRJ-00123', 'during_service', 'https://picsum.photos/seed/prj123-ds-2/600/800'),

  ('PRJ-00125', 'before_service', 'https://picsum.photos/seed/prj125-bs-1/600/800'),
  ('PRJ-00125', 'before_service', 'https://picsum.photos/seed/prj125-bs-2/600/800'),
  ('PRJ-00125', 'nameplate', 'https://picsum.photos/seed/prj125-np-1/600/800'),
  ('PRJ-00125', 'during_service', 'https://picsum.photos/seed/prj125-ds-1/600/800'),
  ('PRJ-00125', 'during_service', 'https://picsum.photos/seed/prj125-ds-2/600/800'),
  ('PRJ-00125', 'after_service', 'https://picsum.photos/seed/prj125-as-1/600/800'),
  ('PRJ-00125', 'after_service', 'https://picsum.photos/seed/prj125-as-2/600/800'),
  ('PRJ-00125', 'sparepart', 'https://picsum.photos/seed/prj125-sp-1/600/800'),

  ('PRJ-00126', 'before_service', 'https://picsum.photos/seed/prj126-bs-1/600/800'),
  ('PRJ-00126', 'before_service', 'https://picsum.photos/seed/prj126-bs-2/600/800'),
  ('PRJ-00126', 'nameplate', 'https://picsum.photos/seed/prj126-np-1/600/800'),
  ('PRJ-00126', 'during_service', 'https://picsum.photos/seed/prj126-ds-1/600/800'),
  ('PRJ-00126', 'during_service', 'https://picsum.photos/seed/prj126-ds-2/600/800'),
  ('PRJ-00126', 'after_service', 'https://picsum.photos/seed/prj126-as-1/600/800'),
  ('PRJ-00126', 'after_service', 'https://picsum.photos/seed/prj126-as-2/600/800'),

  ('PRJ-00127', 'before_service', 'https://picsum.photos/seed/prj127-bs-1/600/800'),
  ('PRJ-00127', 'before_service', 'https://picsum.photos/seed/prj127-bs-2/600/800'),
  ('PRJ-00127', 'nameplate', 'https://picsum.photos/seed/prj127-np-1/600/800')
) as v(kode_project, category, file_path) on v.kode_project = p.kode_project;
