# AION Forge — Execution Mesh

## Concept
Forge is a scheduler over heterogeneous workers. Workers are selected by capabilities, risk, availability, quota, cost and locality.

| Worker | Primary jobs | Locality |
|---|---|---|
| OpenAI supervisor | planning, synthesis, review, routing | cloud |
| Codex worker | repository implementation/refactor | home/cloud depending adapter |
| Gemini/Antigravity | implementation, architecture, alternate provider | home/cloud |
| Claude Code | long-context coding/review | home/cloud |
| Local model | low-cost classification/summarization | home PC |
| Deterministic worker | scripts, linters, tests, AST transforms | home/cloud |
| Playwright worker | web QA/browser flows/screenshots | home/cloud |
| Godot worker | game execution, logs, deterministic QA | home PC |
| Visual QA worker | screenshot/frame critique | cloud model + artifacts |
| Vercel deploy worker | preview/deployment state | cloud |
| Supabase worker | scoped DB operations | cloud |

## Scheduler rule
A task declares required capabilities. The router filters workers by capabilities and permissions, then ranks available candidates. A quota failure returns the task to routing rather than failing the project.

## Parallelism
Independent tasks can run concurrently. Tasks touching the same repository/module use concurrency keys and worktree isolation. Resource-heavy local tasks are constrained by Home PC capacity.

## Durable flow
`CREATED -> PLANNING -> READY -> QUEUED -> RUNNING -> VERIFYING -> DONE`

At each meaningful boundary Forge writes an event/checkpoint. Worker loss causes lease expiry and requeue/checkpoint recovery.

## Repository use
Repositories are not merged into Forge. The Home PC maintains clones/cache under a dedicated workspace and creates disposable worktrees per task. Forge stores repository identity, ref, policy and artifact metadata.

## Provider fallback example
`codex -> antigravity/gemini -> claude-code -> alternate API/local` according to task capability and policy. Deterministic work should avoid LLMs when a script/test can do the job.

## Human authority
Edyan remains final authority. Production, destructive changes, secret mutation and other high-risk operations remain gated even when all reviewers agree.
