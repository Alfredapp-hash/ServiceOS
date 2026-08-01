-- ServiceOS industry customization layer

create table if not exists public.industry_profiles (
  trade_key text primary key check (trade_key in ('hvac','plumbing','electrical','roofing','garage-door','water-treatment','energy-systems')),
  label text not null,
  version integer not null default 1,
  configuration jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_industry_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  trade_key text not null references public.industry_profiles(trade_key),
  enabled boolean not null default true,
  terminology_overrides jsonb not null default '{}'::jsonb,
  intake_overrides jsonb not null default '{}'::jsonb,
  asset_overrides jsonb not null default '{}'::jsonb,
  inspection_overrides jsonb not null default '{}'::jsonb,
  quote_overrides jsonb not null default '{}'::jsonb,
  compliance_overrides jsonb not null default '{}'::jsonb,
  membership_overrides jsonb not null default '{}'::jsonb,
  automation_overrides jsonb not null default '{}'::jsonb,
  dashboard_overrides jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, trade_key)
);

create table if not exists public.form_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  trade_key text not null references public.industry_profiles(trade_key),
  template_type text not null check (template_type in ('intake','asset','inspection','job-completion','compliance','warranty')),
  name text not null,
  description text,
  schema jsonb not null default '{"fields":[]}'::jsonb,
  is_system boolean not null default false,
  is_active boolean not null default true,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  trade_key text not null references public.industry_profiles(trade_key),
  name text not null,
  description text,
  calculation_schema jsonb not null default '{}'::jsonb,
  default_options jsonb not null default '["repair","restore","replace"]'::jsonb,
  financing_enabled boolean not null default true,
  is_system boolean not null default false,
  is_active boolean not null default true,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.automation_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  trade_key text not null references public.industry_profiles(trade_key),
  name text not null,
  trigger_key text not null,
  action_schema jsonb not null default '{}'::jsonb,
  is_system boolean not null default false,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.membership_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  trade_key text not null references public.industry_profiles(trade_key),
  name text not null,
  billing_interval text not null default 'monthly' check (billing_interval in ('monthly','quarterly','annual','custom')),
  included_services jsonb not null default '[]'::jsonb,
  benefits jsonb not null default '[]'::jsonb,
  default_price numeric(12,2),
  is_system boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_industry_settings_org_idx on public.organization_industry_settings(organization_id);
create index if not exists form_templates_trade_idx on public.form_templates(trade_key, template_type);
create index if not exists quote_templates_trade_idx on public.quote_templates(trade_key);
create index if not exists automation_templates_trade_idx on public.automation_templates(trade_key);
create index if not exists membership_templates_trade_idx on public.membership_templates(trade_key);

alter table public.industry_profiles enable row level security;
alter table public.organization_industry_settings enable row level security;
alter table public.form_templates enable row level security;
alter table public.quote_templates enable row level security;
alter table public.automation_templates enable row level security;
alter table public.membership_templates enable row level security;

create policy "industry profiles readable by authenticated users" on public.industry_profiles for select to authenticated using (true);

create policy "organization members manage industry settings" on public.organization_industry_settings
  for all to authenticated
  using (public.is_organization_member(organization_id))
  with check (public.is_organization_member(organization_id));

create policy "members read system or organization forms" on public.form_templates
  for select to authenticated
  using (organization_id is null or public.is_organization_member(organization_id));
create policy "members manage organization forms" on public.form_templates
  for all to authenticated
  using (organization_id is not null and public.is_organization_member(organization_id))
  with check (organization_id is not null and public.is_organization_member(organization_id));

create policy "members read system or organization quotes" on public.quote_templates
  for select to authenticated
  using (organization_id is null or public.is_organization_member(organization_id));
create policy "members manage organization quotes" on public.quote_templates
  for all to authenticated
  using (organization_id is not null and public.is_organization_member(organization_id))
  with check (organization_id is not null and public.is_organization_member(organization_id));

create policy "members read system or organization automations" on public.automation_templates
  for select to authenticated
  using (organization_id is null or public.is_organization_member(organization_id));
create policy "members manage organization automations" on public.automation_templates
  for all to authenticated
  using (organization_id is not null and public.is_organization_member(organization_id))
  with check (organization_id is not null and public.is_organization_member(organization_id));

create policy "members read system or organization memberships" on public.membership_templates
  for select to authenticated
  using (organization_id is null or public.is_organization_member(organization_id));
create policy "members manage organization memberships" on public.membership_templates
  for all to authenticated
  using (organization_id is not null and public.is_organization_member(organization_id))
  with check (organization_id is not null and public.is_organization_member(organization_id));

insert into public.industry_profiles (trade_key, label, configuration) values
  ('hvac', 'HVAC', '{"assetLabel":"HVAC system","jobLabel":"Service call"}'),
  ('plumbing', 'Plumbing', '{"assetLabel":"Plumbing system","jobLabel":"Plumbing call"}'),
  ('electrical', 'Electrical', '{"assetLabel":"Electrical system","jobLabel":"Electrical call"}'),
  ('roofing', 'Roofing', '{"assetLabel":"Roof system","jobLabel":"Roofing project"}'),
  ('garage-door', 'Garage Doors', '{"assetLabel":"Garage door system","jobLabel":"Garage door call"}'),
  ('water-treatment', 'Water Treatment', '{"assetLabel":"Water treatment system","jobLabel":"Water service call"}'),
  ('energy-systems', 'Energy Systems', '{"assetLabel":"Energy system","jobLabel":"Energy service call"}')
on conflict (trade_key) do update set label = excluded.label, configuration = excluded.configuration, updated_at = now();
