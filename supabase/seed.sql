-- Data contoh (demo) — jalankan setelah schema.sql
-- Foto memakai URL placeholder (picsum.photos) supaya jumlah foto langsung
-- terisi tanpa perlu upload manual dulu. Maks 20 foto per project.

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

insert into photos (project_id, file_path, uploaded_by, uploaded_at)
select p.id,
       'https://picsum.photos/seed/' || p.kode_project || '-' || g || '/600/800',
       p.technician_id,
       now() - (g || ' minutes')::interval
from projects p
join (values
  ('PRJ-00123', 5),
  ('PRJ-00124', 0),
  ('PRJ-00125', 20),
  ('PRJ-00126', 14),
  ('PRJ-00127', 8)
) as v(kode_project, photo_count) on v.kode_project = p.kode_project
cross join lateral generate_series(1, v.photo_count) as g;
