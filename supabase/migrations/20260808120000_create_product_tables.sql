-- YükseltPC — Faz 11 Adım 1-3: iki katmanlı ürün şeması
--
-- Bu migration, /content/veri-mimarisi-tasarimi.md raporundaki Bölüm 2
-- şema tasarımını uygular. Kapsam: SADECE tablo yapısı. Bu migration
-- hiçbir veri eklemez (bkz. scripts/seedFromJson.ts) ve tier='raw'
-- akışını aktive etmez — tüm satırlar bu fazda tier='verified' olarak
-- doldurulacak.
--
-- 7 kategori tablosu, mevcut lib/types.ts arayüzlerini birebir yansıtır
-- (bkz. rapor §2.1 — "B: 7 ayrı tablo" kararı). Ortak kolonlar (§2.2) +
-- kategoriye özel kolonlar (§2.4) her tabloda tekrarlanır.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Ortak kolonları her tabloya eklemek için kullanılan yardımcı fonksiyon
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- cpus
-- ---------------------------------------------------------------------
create table cpus (
  id                       text primary key,
  slug                     text unique not null,
  name                     text not null,
  mpn                      text,
  price_new_min            integer not null,
  price_new_max            integer not null,
  price_used_min           integer not null,
  price_used_max           integer not null,
  last_updated             date not null,

  tier                     text not null default 'verified' check (tier in ('verified', 'raw')),
  source                   text not null default 'manual',
  confidence               text not null default 'high' check (confidence in ('high', 'medium', 'low')),
  verified_at              timestamptz,
  verified_by              text,
  icecat_id                bigint,
  raw_specs                jsonb,

  brand                    text not null,
  socket                   text not null,
  cores                    integer not null,
  threads                  integer not null,
  tdp                      integer,
  has_integrated_graphics  boolean not null,
  generation               text not null,

  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index cpus_socket_idx on cpus (socket);

-- ---------------------------------------------------------------------
-- motherboards
-- ---------------------------------------------------------------------
create table motherboards (
  id              text primary key,
  slug            text unique not null,
  name            text not null,
  mpn             text,
  price_new_min   integer not null,
  price_new_max   integer not null,
  price_used_min  integer not null,
  price_used_max  integer not null,
  last_updated    date not null,

  tier            text not null default 'verified' check (tier in ('verified', 'raw')),
  source          text not null default 'manual',
  confidence      text not null default 'high' check (confidence in ('high', 'medium', 'low')),
  verified_at     timestamptz,
  verified_by     text,
  icecat_id       bigint,
  raw_specs       jsonb,

  brand           text not null,
  socket          text not null,
  chipset         text not null,
  ram_type        text not null check (ram_type in ('DDR4', 'DDR5')),
  ram_slots       integer not null,
  form_factor     text not null check (form_factor in ('ATX', 'mATX', 'ITX')),
  pcie_version    text not null,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index motherboards_socket_idx on motherboards (socket);
create index motherboards_ram_type_idx on motherboards (ram_type);

-- ---------------------------------------------------------------------
-- rams
-- ---------------------------------------------------------------------
create table rams (
  id              text primary key,
  slug            text unique not null,
  name            text not null,
  mpn             text,
  price_new_min   integer not null,
  price_new_max   integer not null,
  price_used_min  integer not null,
  price_used_max  integer not null,
  last_updated    date not null,

  tier            text not null default 'verified' check (tier in ('verified', 'raw')),
  source          text not null default 'manual',
  confidence      text not null default 'high' check (confidence in ('high', 'medium', 'low')),
  verified_at     timestamptz,
  verified_by     text,
  icecat_id       bigint,
  raw_specs       jsonb,

  type            text not null check (type in ('DDR4', 'DDR5')),
  speed           integer not null,
  capacity        integer not null,
  module_count    integer not null,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index rams_type_idx on rams (type);

-- ---------------------------------------------------------------------
-- gpus
-- ---------------------------------------------------------------------
create table gpus (
  id                        text primary key,
  slug                      text unique not null,
  name                      text not null,
  mpn                       text,
  price_new_min             integer not null,
  price_new_max             integer not null,
  price_used_min            integer not null,
  price_used_max            integer not null,
  last_updated              date not null,

  tier                      text not null default 'verified' check (tier in ('verified', 'raw')),
  source                    text not null default 'manual',
  confidence                text not null default 'high' check (confidence in ('high', 'medium', 'low')),
  verified_at               timestamptz,
  verified_by               text,
  icecat_id                 bigint,
  raw_specs                 jsonb,

  brand                     text not null,
  length_mm                 integer not null,
  power_connector_required  text not null,
  recommended_psu_watt      integer,
  vram                      integer not null,
  tdp                       integer,           -- nullable: Icecat kaynaklı raw kayıtlarda genelde eksik (bkz. icecat-dogrulama-raporu.md §3.4)

  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- psus
-- ---------------------------------------------------------------------
create table psus (
  id              text primary key,
  slug            text unique not null,
  name            text not null,
  mpn             text,
  price_new_min   integer not null,
  price_new_max   integer not null,
  price_used_min  integer not null,
  price_used_max  integer not null,
  last_updated    date not null,

  tier            text not null default 'verified' check (tier in ('verified', 'raw')),
  source          text not null default 'manual',
  confidence      text not null default 'high' check (confidence in ('high', 'medium', 'low')),
  verified_at     timestamptz,
  verified_by     text,
  icecat_id       bigint,
  raw_specs       jsonb,

  wattage         integer not null,
  certification   text not null,
  is_modular      boolean not null,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- cases
-- ---------------------------------------------------------------------
create table cases (
  id                      text primary key,
  slug                    text unique not null,
  name                    text not null,
  mpn                     text,
  price_new_min           integer not null,
  price_new_max           integer not null,
  price_used_min          integer not null,
  price_used_max          integer not null,
  last_updated            date not null,

  tier                    text not null default 'verified' check (tier in ('verified', 'raw')),
  source                  text not null default 'manual',
  confidence              text not null default 'high' check (confidence in ('high', 'medium', 'low')),
  verified_at             timestamptz,
  verified_by             text,
  icecat_id               bigint,
  raw_specs               jsonb,

  supported_form_factors  text[] not null,
  max_gpu_length_mm       integer not null,
  max_cooler_height_mm    integer not null,

  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- coolers
-- ---------------------------------------------------------------------
create table coolers (
  id                    text primary key,
  slug                  text unique not null,
  name                  text not null,
  mpn                   text,
  price_new_min         integer not null,
  price_new_max         integer not null,
  price_used_min        integer not null,
  price_used_max        integer not null,
  last_updated          date not null,

  tier                  text not null default 'verified' check (tier in ('verified', 'raw')),
  source                text not null default 'manual',
  confidence            text not null default 'high' check (confidence in ('high', 'medium', 'low')),
  verified_at           timestamptz,
  verified_by           text,
  icecat_id             bigint,
  raw_specs             jsonb,

  type                  text not null check (type in ('air', 'liquid')),
  compatible_sockets    text[] not null,
  height_mm             integer,          -- nullable: Icecat'te eksen karışıklığı riski (bkz. icecat-dogrulama-raporu.md §3.2)

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- field_confidence — alan bazlı güven skoru (rapor §2.3)
-- Bu fazda boş kalır (tüm satırlar tier='verified', tüm alanlar high).
-- ---------------------------------------------------------------------
create table field_confidence (
  id          uuid primary key default gen_random_uuid(),
  table_name  text not null,
  row_id      text not null,
  field_name  text not null,
  confidence  text not null check (confidence in ('high', 'medium', 'low', 'missing')),
  note        text,
  created_at  timestamptz not null default now(),
  unique (table_name, row_id, field_name)
);

-- ---------------------------------------------------------------------
-- updated_at tetikleyicileri
-- ---------------------------------------------------------------------
create trigger cpus_set_updated_at before update on cpus
  for each row execute function set_updated_at();
create trigger motherboards_set_updated_at before update on motherboards
  for each row execute function set_updated_at();
create trigger rams_set_updated_at before update on rams
  for each row execute function set_updated_at();
create trigger gpus_set_updated_at before update on gpus
  for each row execute function set_updated_at();
create trigger psus_set_updated_at before update on psus
  for each row execute function set_updated_at();
create trigger cases_set_updated_at before update on cases
  for each row execute function set_updated_at();
create trigger coolers_set_updated_at before update on coolers
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security — herkese açık okuma, yazma yalnızca service_role
-- (service_role Supabase'de RLS'i zaten bypass eder; burada sadece
-- anon/authenticated rollerine SELECT izni tanımlıyoruz.)
-- ---------------------------------------------------------------------
alter table cpus enable row level security;
alter table motherboards enable row level security;
alter table rams enable row level security;
alter table gpus enable row level security;
alter table psus enable row level security;
alter table cases enable row level security;
alter table coolers enable row level security;
alter table field_confidence enable row level security;

create policy "Public read access" on cpus for select using (true);
create policy "Public read access" on motherboards for select using (true);
create policy "Public read access" on rams for select using (true);
create policy "Public read access" on gpus for select using (true);
create policy "Public read access" on psus for select using (true);
create policy "Public read access" on cases for select using (true);
create policy "Public read access" on coolers for select using (true);
create policy "Public read access" on field_confidence for select using (true);
