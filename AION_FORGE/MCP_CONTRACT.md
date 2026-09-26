# AION Forge — MCP Contract

## Goal
Expose a small, authenticated, policy-aware interface so ChatGPT-compatible clients, Codex, Claude Code, Gemini and other MCP clients can query and coordinate Forge without controlling the Forge UI by screen scraping.

## Security model
The MCP endpoint is **not** a raw shell bridge. Every tool maps to a Forge domain command and passes through authentication, task policy, authorization and audit logging.

### Phase 1 — read-only
- `forge_status()`
- `forge_list_projects()`
- `forge_get_project(project_id)`
- `forge_list_tasks(filters?)`
- `forge_get_task(task_id)`
- `forge_list_workers()`
- `forge_get_artifact_metadata(artifact_id)`

### Phase 2 — controlled writes
- `forge_create_task(input)`
- `forge_request_task_cancel(task_id)`
- `forge_request_approval(input)`
- `forge_add_project_memory(input)`

### Never expose directly
- unrestricted shell
- arbitrary filesystem paths
- raw database admin connection
- secrets
- direct production deployment
- delete repository
- direct push to protected branches

## Transport
Target: Streamable HTTP at `/api/mcp` on Vercel. Vercel documents `mcp-handler` for deploying MCP servers. Authentication is mandatory before write tools are enabled.

## Authentication progression
1. MVP: single-user server-side token/OAuth-compatible gate; no credential in browser JavaScript.
2. Production: OAuth/protected-resource metadata with scoped permissions.
3. Worker identity is separate from human/MCP client identity.

## Scopes
- `forge:read`
- `forge:task:create`
- `forge:task:cancel`
- `forge:approval:request`
- `forge:memory:write`

No single scope grants production deployment or destructive actions.

## Tool response rule
Every consequential operation returns a task/event identifier and a persisted state. Never report success from model text alone.

## ChatGPT integration target
Forge MCP is the machine interface. A ChatGPT-side custom integration/plugin can authenticate to this endpoint and let the supervisor inspect projects, create tasks and review results while the durable state remains in Forge.
