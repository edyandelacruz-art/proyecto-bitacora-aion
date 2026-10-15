# AION: Codex + Antigravity control plane (v0.1)

Goal: the user designs and approves; ChatGPT coordinates task contracts through GitHub; Antigravity executes work in its local CLI environment; Codex executes or independently reviews in its own worktree. GitHub stores contracts and version history.

**Status 2026-10-15:** The dispatcher code and tests exist on this feature branch. The user's PC has NOT been accessed, and remote execution and authentication are NOT verified. ChatGPT cannot directly click, launch or force an Antigravity desktop session from this conversation. A machine running this dispatcher is required.

## Operator procedure (Windows, from repository root)

First install, sign in to and verify Antigravity CLI and Codex CLI locally using official instructions. Never copy credentials into ChatGPT or GitHub.

1. Check Python and Git: py -3 --version ; git --version
2. Check CLI: agy --version ; codex --version
3. Verify headless Antigravity in a disposable workspace: agy -p "Reply with OK only" --output-format json --sandbox
4. Run tests: py -3 -m unittest discover -s orchestration/tests -v
5. Review and edit the template in orchestration/tasks/AION-001.json; it is DRAFT, and must become READY only after human review.
6. Preview the job without invoking any agent:
   py -3 orchestration/dispatch.py --task orchestration/tasks/AION-001.json --repo .
7. Execute explicitly after READY:
   py -3 orchestration/dispatch.py --task orchestration/tasks/AION-001.json --repo . --engine antigravity --execute

Codex can be selected with --engine codex on a separate, appropriately scoped task.

## What actually happens

- The runner validates the JSON task, verifies task READY and blocks HIGH-risk tasks.
- In plan mode, nothing is executed.
- In execute mode, the runner uses a Git worktree and branch exclusive to the run.
- It calls the locally installed CLI in headless mode with restricted sandbox options.
- Logs and a machine-readable run record stay in the local home directory: ~/.aion-control-plane/runs.
- It does NOT push branches, open PRs, merge code, deploy software, access personal accounts, or schedule itself.
- An exit code of 0 is recorded as UNVERIFIED_REVIEW_REQUIRED, not completed.
- The declared allowed_paths is only part of a written task contract. It must be independently checked before integration; it is NOT enforced by a system-level file allowlist.

## Architecture

User approval
    ↓
ChatGPT task coordinator (conversation + GitHub)
    ↓
JSON task contract (DRAFT → READY)
    ↓
Local dispatcher (manual invocation v0.1)
    ↓
One selected worker: Antigravity CLI / Codex CLI
    ↓
Dedicated Git worktree + local execution logs
    ↓
Independent code review → approval → PR/merge (future step)

Independent specialist tasks may be run in parallel only in distinct worktrees and nonconflicting scopes. A shared-memory/queue service and scheduled runner are NOT present.

## Why use the signed-in CLI first

Antigravity CLI supports headless mode and structured output with cached sign-in. This is distinct from the hosted Antigravity agent available through the Gemini API. Using the latter incurs a separate pay-as-you-go token/tool bill and requires an API key, quota controls and explicit configuration.

## References

- https://antigravity.google/docs/cli/headless/
- https://antigravity.google/docs/remote-control/
- https://learn.chatgpt.com/docs/cli/reference
- https://ai.google.dev/gemini-api/docs/antigravity-agent
