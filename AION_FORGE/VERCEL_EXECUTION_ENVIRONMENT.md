# AION Forge — Vercel Execution Environment

## Purpose
Vercel hosts the always-available control surface, authenticated API and MCP entrypoint. Heavy/local work remains on Home PC or another explicit execution worker.

## Target deployment
Vercel project root: `apps/aion-forge`

### Surfaces
- `/` — Forge Command Center
- `/api/health` — public-safe readiness response (no secrets)
- `/api/manifest` — capability/architecture manifest with no credentials
- `/api/mcp` — PLANNED authenticated Streamable HTTP MCP endpoint
- future authenticated `/api/tasks/*`, `/api/workers/*`, `/api/approvals/*`

## Why Vercel is control plane, not the entire execution plane
Serverless/managed cloud execution is excellent for UI, APIs, orchestration, callbacks and isolated sandbox jobs. Godot, large repositories, local tools, browser desktop control and long/heavy pipelines belong on the Home PC worker or dedicated sandboxes.

## MCP
Vercel supports custom MCP servers using `mcp-handler` and Streamable HTTP. Forge will expose an authenticated MCP endpoint so authorized AI clients can interact with Forge without screen scraping the Forge UI.

Planned tools:
- `forge_list_projects`
- `forge_get_project`
- `forge_create_task`
- `forge_get_task`
- `forge_list_tasks`
- `forge_request_task_cancel`
- `forge_list_workers`
- `forge_get_artifact`
- `forge_request_approval`

Write tools must pass Forge policy checks. No MCP client receives unrestricted shell or secret access.

## Authentication
MVP: single-user authenticated application. API and MCP must reject unauthenticated writes. Production authentication choice is made during MVP bootstrap; do not embed static bearer tokens in client JavaScript.

## Environment variables (names only)
- `FORGE_SUPABASE_URL`
- `FORGE_SUPABASE_ANON_KEY`
- `FORGE_SUPABASE_SERVICE_ROLE_KEY` (server only)
- `FORGE_MCP_AUTH_*` (server only)
- provider credentials only when an adapter actually needs them

## Deployment policy
- Preview deployments: automatic/low-risk after CI
- Production: supervised approval initially
- Secrets: Vercel encrypted environment configuration, never git
- Logs: redact tokens and personal/institutional data

## Current status
Architecture/scaffolding is REAL. Live Vercel project connection, MCP endpoint, Supabase persistence and provider credentials remain PLANNED until deployed and tested.
