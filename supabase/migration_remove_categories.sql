-- Migrasi: hapus sistem kategori foto, upload jadi flat maks 20 foto per project
-- Jalankan di Supabase SQL Editor SETELAH schema.sql/seed.sql yang lama pernah dijalankan.

drop table if exists project_categories;
alter table photos drop column if exists category;
