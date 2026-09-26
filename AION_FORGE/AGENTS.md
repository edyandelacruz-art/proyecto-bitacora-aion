# AION Forge — mandatory agent rules

1. Forge is an orchestration and execution-control product. It is not AION Aegis.
2. Never write directly to a project's protected/default branch during autonomous execution.
3. Every mutable coding task must have a Task Contract and an isolated branch/worktree before edits.
4. Read broadly when needed; write only inside `scope.allowedPaths` and never inside `scope.forbiddenPaths`.
5. A worker never validates its own success as final truth. Independent checks or a separate reviewer must verify consequential work.
6. `DONE` requires acceptance criteria plus required checks to be evidenced.
7. Production deploys, secrets, destructive database actions and final submission of consequential browser forms require explicit approval unless a future policy explicitly and narrowly grants autonomy.
8. Secrets are references, never task payloads, logs or committed files.
9. Prefer deterministic scripts/tools over LLM reasoning for deterministic transformations.
10. Preserve provenance: task -> plan -> worker -> tool actions -> artifacts -> checks -> approvals -> outcome.
11. A disconnected worker must checkpoint and return work to the queue; it must not silently lose a task.
12. Do not claim a connector, model, worker, deployment or browser action is REAL until exercised successfully and recorded as evidence.
13. Status vocabulary: `REAL`, `PARTIAL`, `MOCK`, `PLANNED`, `BLOCKED`.
14. Home-PC access must be outbound-only where practical; never expose RDP/VNC or arbitrary shell directly to the public Internet.
15. The STOP ALL AGENTS control must be designed as a real revocation/pause mechanism, not cosmetic UI.
