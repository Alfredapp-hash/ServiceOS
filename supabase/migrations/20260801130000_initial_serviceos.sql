create extension if not exists pgcrypto;

create type public.trade_key as enum ('hvac','plumbing','electrical','roofing','garage_doors','water_treatment','energy_systems');
create type public.organization_role as enum ('owner','admin','manager','dispatcher','csr','technician','apprentice','warehouse','accounting','marketing','viewer');
create type public.job_status as enum ('lead','scheduled','dispatched','en_route','arrived','in_progress','awaiting_approval','parts_hold','completed','cancelled');
create type public.quote_status as enum ('draft','sent','viewed','approved','declined','expired');
create type public.invoice_status as enum ('draft','open','partially_paid','paid','void','overdue');
create type public.payment_status as enum ('pending','succeeded','failed','refunded','partially_refunded');
create type public.inventory_location_type as enum ('warehouse','branch','vehicle','job_site','returns','warranty','damaged');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  timezone text not null default 'America/Los_Angeles',
  currency text not null default 'USD',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.organization_role not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.organization_trades (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  trade public.trade_key not null,
  enabled boolean not null default true,
  settings jsonb not null default '{}'::jsonb,
  primary key (organization_id, trade)
);

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  address jsonb not null default '{}'::jsonb,
  service_area jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  first_name text not null,
  last_name text not null,
  phone text,
  email text,
  role public.organization_role not null,
  trades public.trade_key[] not null default '{}',
  certifications jsonb not null default '[]'::jsonb,
  status text not null default 'off_duty',
  photo_url text,
  created_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  company_name text,
  phone text,
  email text,
  preferred_contact text,
  billing_address jsonb not null default '{}'::jsonb,
  tags text[] not null default '{}',
  notes text,
  lead_source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  name text,
  address jsonb not null,
  property_type text,
  year_built integer,
  square_feet integer,
  access_notes text,
  pets jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  trade public.trade_key not null,
  asset_type text not null,
  manufacturer text,
  model text,
  serial_number text,
  installed_on date,
  warranty_expires_on date,
  condition text,
  location_description text,
  attributes jsonb not null default '{}'::jsonb,
  photos jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  property_id uuid references public.properties(id) on delete set null,
  trade public.trade_key not null,
  source text,
  status text not null default 'new',
  summary text not null,
  urgency text not null default 'normal',
  assigned_to uuid references public.staff_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  customer_id uuid not null references public.customers(id),
  property_id uuid not null references public.properties(id),
  lead_id uuid references public.leads(id) on delete set null,
  trade public.trade_key not null,
  status public.job_status not null default 'scheduled',
  title text not null,
  description text,
  priority text not null default 'normal',
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  dispatched_at timestamptz,
  arrived_at timestamptz,
  completed_at timestamptz,
  assigned_technician_id uuid references public.staff_profiles(id) on delete set null,
  required_skills text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job_assets (
  job_id uuid not null references public.jobs(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade,
  primary key (job_id, asset_id)
);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  status public.quote_status not null default 'draft',
  title text not null,
  expires_at timestamptz,
  notes text,
  approved_option_id uuid,
  created_by uuid references public.staff_profiles(id) on delete set null,
  sent_at timestamptz,
  viewed_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.quote_options (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  quote_id uuid not null references public.quotes(id) on delete cascade,
  label text not null,
  description text,
  position integer not null default 0,
  subtotal numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  cost_total numeric(12,2) not null default 0,
  gross_profit numeric(12,2) not null default 0,
  gross_margin_percent numeric(7,3) not null default 0,
  financing jsonb not null default '{}'::jsonb,
  warranty jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.quotes add constraint quotes_approved_option_fk foreign key (approved_option_id) references public.quote_options(id) on delete set null;

create table public.quote_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  quote_option_id uuid not null references public.quote_options(id) on delete cascade,
  item_type text not null,
  name text not null,
  description text,
  quantity numeric(12,3) not null default 1,
  unit_price numeric(12,2) not null default 0,
  unit_cost numeric(12,2) not null default 0,
  taxable boolean not null default true,
  metadata jsonb not null default '{}'::jsonb
);

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  assigned_staff_id uuid references public.staff_profiles(id) on delete set null,
  name text not null,
  vin text,
  plate text,
  make text,
  model text,
  year integer,
  gps_provider text,
  gps_external_id text,
  metadata jsonb not null default '{}'::jsonb
);

create table public.location_events (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  staff_id uuid not null references public.staff_profiles(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  recorded_at timestamptz not null default now(),
  latitude double precision not null,
  longitude double precision not null,
  accuracy_meters double precision,
  speed_mps double precision,
  heading_degrees double precision,
  source text not null default 'mobile'
);

create table public.customer_tracking_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  technician_id uuid not null references public.staff_profiles(id) on delete cascade,
  token_hash text not null unique,
  starts_at timestamptz not null,
  expires_at timestamptz not null,
  ended_at timestamptz,
  eta_minutes integer,
  last_latitude double precision,
  last_longitude double precision,
  last_accuracy_meters double precision,
  created_at timestamptz not null default now()
);

create table public.inventory_locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  type public.inventory_location_type not null,
  name text not null
);

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  sku text,
  name text not null,
  trade public.trade_key,
  category text,
  unit_cost numeric(12,2) not null default 0,
  retail_price numeric(12,2) not null default 0,
  reorder_point numeric(12,3) not null default 0,
  metadata jsonb not null default '{}'::jsonb
);

create table public.inventory_balances (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  location_id uuid not null references public.inventory_locations(id) on delete cascade,
  item_id uuid not null references public.inventory_items(id) on delete cascade,
  quantity_on_hand numeric(12,3) not null default 0,
  quantity_reserved numeric(12,3) not null default 0,
  primary key (location_id, item_id)
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id uuid not null references public.jobs(id),
  quote_id uuid references public.quotes(id) on delete set null,
  status public.invoice_status not null default 'draft',
  subtotal numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  amount_paid numeric(12,2) not null default 0,
  due_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  status public.payment_status not null default 'pending',
  provider text,
  provider_payment_id text,
  method text,
  amount numeric(12,2) not null,
  processed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index jobs_dispatch_idx on public.jobs (organization_id, status, scheduled_start);
create index customer_search_idx on public.customers (organization_id, last_name, first_name);
create index property_customer_idx on public.properties (organization_id, customer_id);
create index asset_property_idx on public.assets (organization_id, property_id, trade);
create index location_events_recent_idx on public.location_events (organization_id, staff_id, recorded_at desc);
create index quote_job_idx on public.quotes (organization_id, job_id);
create index invoice_status_idx on public.invoices (organization_id, status, due_at);

create or replace function public.is_org_member(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = target_org
      and user_id = auth.uid()
      and is_active = true
  );
$$;

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_trades enable row level security;
alter table public.branches enable row level security;
alter table public.staff_profiles enable row level security;
alter table public.customers enable row level security;
alter table public.properties enable row level security;
alter table public.assets enable row level security;
alter table public.leads enable row level security;
alter table public.jobs enable row level security;
alter table public.job_assets enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_options enable row level security;
alter table public.quote_items enable row level security;
alter table public.vehicles enable row level security;
alter table public.location_events enable row level security;
alter table public.customer_tracking_sessions enable row level security;
alter table public.inventory_locations enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_balances enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.audit_events enable row level security;

create policy org_read on public.organizations for select using (public.is_org_member(id));
create policy org_members_access on public.organization_members for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy org_trades_access on public.organization_trades for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy branches_access on public.branches for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy staff_access on public.staff_profiles for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy customers_access on public.customers for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy properties_access on public.properties for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy assets_access on public.assets for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy leads_access on public.leads for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy jobs_access on public.jobs for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy job_assets_access on public.job_assets for all using (exists (select 1 from public.jobs j where j.id = job_id and public.is_org_member(j.organization_id))) with check (exists (select 1 from public.jobs j where j.id = job_id and public.is_org_member(j.organization_id)));
create policy quotes_access on public.quotes for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy quote_options_access on public.quote_options for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy quote_items_access on public.quote_items for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy vehicles_access on public.vehicles for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy location_events_access on public.location_events for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy tracking_sessions_access on public.customer_tracking_sessions for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy inventory_locations_access on public.inventory_locations for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy inventory_items_access on public.inventory_items for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy inventory_balances_access on public.inventory_balances for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy invoices_access on public.invoices for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy payments_access on public.payments for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy audit_events_read on public.audit_events for select using (public.is_org_member(organization_id));
