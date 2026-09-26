# AION Forge — MVP bootstrap for next work session

## Definition of tomorrow's first usable MVP
A user can create a project-scoped task in Forge; the task persists; a worker can claim it; execution events are recorded; approval can pause it; and the UI reflects the real state.

## Build order
1. Merge/checkout `aion-forge-blueprint` only after review.
2. Run `npm install` at repo root to refresh the workspace lockfile and verify both Aegis and Forge remain buildable.
3. Typecheck `@aion/forge-core` and build `apps/aion-forge`.
4. Create Supabase project/schema from `infra/supabase/aion-forge-schema.sql` (do not place service-role keys in browser code).
5. Add server-side Forge API layer for Projects, Tasks, Task Events, Workers, Approvals and Artifacts.
6. Replace UI mock arrays with repository/API calls.
7. Implement Task state transitions using `@aion/forge-core`.
8. Implement first worker heartbeat + task claim protocol using Home PC.
9. First vertical test: GitHub worktree task OR After Eight Godot QA. Do not attempt both until persistence is proven.
10. Add independent verification and approval gate.
11. Add Vercel preview only after local build/test succeeds.

## Minimum acceptance criteria
- Tasks survive browser refresh and server restart.
- Illegal state transitions are rejected server-side.
- A worker cannot claim more than its concurrency limit.
- Task events are append-only from application paths.
- Browser clients never receive privileged secrets.
- Production deployment is impossible without an approval record.
- STOP ALL AGENTS changes scheduler state, not only UI state.

## First credentials/config needed tomorrow
- Supabase URL + anon key for browser; service role only server-side if used.
- GitHub installation already connected; local worker Git credentials scoped to required repos.
- Optional model/API credentials added only after the task engine works.
- Home PC tool paths: Git, Node, Python, Godot, optional Playwright/FFmpeg.

## Explicitly out of MVP until the core works
- unrestricted desktop control;
- importing all historical ChatGPT conversations;
- production database writes from autonomous agents;
- unrestricted browser form submission;
- multi-provider automatic billing optimization;
- arbitrary shell commands from the public web app.
