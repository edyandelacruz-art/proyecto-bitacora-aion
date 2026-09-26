# AION Forge — Superstructure

## Objective
AION Forge is the private execution and coordination layer over Edyan's projects, agents, repositories, cloud services and home workstation. The user delegates outcomes; Forge turns them into durable, scoped, auditable work.

## Layers

1. **Control Plane — Vercel**
   - private Forge web console
   - authenticated API
   - MCP endpoint for external AI clients
   - task/project/worker views
   - approval gates
   - status/telemetry

2. **State Plane — Supabase/PostgreSQL**
   - projects
   - tasks
   - task events/checkpoints
   - workers/heartbeats/leases
   - approvals
   - artifacts
   - conversations/project memory indexes
   - repository registry

3. **Execution Plane**
   - Home PC worker: heavy/local/private work
   - Vercel Sandbox: isolated short-lived execution where appropriate
   - GitHub Actions: deterministic CI and dispatch support
   - provider workers: Codex, Gemini/Antigravity, Claude Code, local models

4. **Tool Bus**
   - GitHub
   - Vercel
   - Supabase/Postgres
   - Playwright/browser
   - Godot/Game QA
   - filesystem/shell (scoped)
   - Stitch/design adapters
   - future MCP servers

5. **Knowledge and Capability Plane**
   - project docs
   - skills
   - agent manifests
   - architecture references
   - mirrored system prompt repositories
   - evals and policies

## Access paths

### Browser
Any authorized device -> Forge URL -> authenticated command center -> tasks/projects/approvals.

### ChatGPT / supervisor
ChatGPT -> Forge MCP/API -> read project/task state, create scoped tasks, inspect artifacts, request approvals and coordinate workers.

### Other agents
Gemini / Claude / Codex / Antigravity -> adapter or MCP -> only capabilities granted by task policy.

## Non-goals
Forge is not a giant copied monorepo of every external tool. Forge keeps capability manifests and adapters while original repositories remain independently versioned.

## Security invariants
- no direct writes to main
- no production deployment without policy approval
- no secrets in repositories
- read access can exceed write scope; write scope is explicit
- destructive database operations blocked by default
- Home PC exposes no public inbound control port
- task execution occurs in isolated worktrees/workspaces
- every consequential action is auditable
- UI never claims success before backend confirmation

## First vertical
Web UI on Vercel -> create task -> persist -> worker heartbeat/lease -> scoped Git worktree -> deterministic test -> reviewer -> result/artifact -> human approval if consequential.

## Second vertical
After Eight Game QA -> launch Godot on Home PC -> execute deterministic route -> collect logs/screenshots/video -> visual review -> create scoped bug-fix task -> Codex worker -> rerun same QA route -> compare evidence.
