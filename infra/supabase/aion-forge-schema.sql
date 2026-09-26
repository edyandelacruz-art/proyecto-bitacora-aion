-- AION Forge MVP schema. REVIEW before applying to any Supabase project.
-- This file is declarative preparation only; it has not been executed.

create extension if not exists pgcrypto;

create table if not exists forge_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  slug text not null,
  name text not null,
  repository text,
  status text not null default 'active' check (status in ('active','paused','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, slug)
);

create table if not exists forge_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references forge_projects(id) on delete cascade,
  external_key text,
  title text not null,
  goal text not null,
  status text not null default 'CREATED' check (status in ('CREATED','PLANNING','READY','QUEUED','RUNNING','CHECKPOINTED','BLOCKED','WAITING_AGENT','WAITING_EDYAN','VERIFYING','READY_TO_DEPLOY','DEPLOYING','DONE','FAILED','CANCELLED')),
  risk text not null default 'medium' check (risk in ('low','medium','high','critical')),
  autonomy text not null default 'supervised' check (autonomy in ('auto','supervised','manual')),
  contract jsonb not null default '{}'::jsonb,
  deadline timestamptz,
  claimed_by uuid,
  lease_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists forge_workers (
  id uuid primary key default gen_random_uuid(),
  worker_key text not null unique,
  name text not null,
  kind text not null,
  location text not null check (location in ('cloud','home-pc')),
  status text not null default 'offline' check (status in ('online','busy','offline','degraded')),
  capabilities text[] not null default '{}',
  max_concurrent integer not null default 1 check (max_concurrent > 0),
  active_tasks integer not null default 0 check (active_tasks >= 0),
  last_heartbeat_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table forge_tasks
  add constraint forge_tasks_claimed_by_fkey
  foreign key (claimed_by) references forge_workers(id) on delete set null;

create table if not exists forge_task_events (
  id bigint generated always as identity primary key,
  task_id uuid not null references forge_tasks(id) on delete cascade,
  event_type text not null,
  actor text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists forge_approvals (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references forge_tasks(id) on delete cascade,
  action text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','expired')),
  requested_by text not null,
  decided_by uuid,
  decision_note text,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create table if not exists forge_artifacts (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references forge_tasks(id) on delete cascade,
  kind text not null,
  uri text not null,
  sha256 text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists forge_tasks_project_status_idx on forge_tasks(project_id, status);
create index if not exists forge_task_events_task_created_idx on forge_task_events(task_id, created_at);
create index if not exists forge_approvals_task_status_idx on forge_approvals(task_id, status);

-- RLS is enabled now; policies must be reviewed against the final auth model before production use.
alter table forge_projects enable row level security;
alter table forge_tasks enable row level security;
alter table forge_workers enable row level security;
alter table forge_task_events enable row level security;
alter table forge_approvals enable row level security;
alter table forge_artifacts enable row level security;

-- No permissive policies are intentionally created here. Applying this schema without policies
-- keeps browser access denied by default until Forge's final single-user/server-side model is chosen.
