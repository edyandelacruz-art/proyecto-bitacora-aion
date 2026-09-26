# Worker capability matrix

| Worker | Primary role | Initial capabilities | Initial trust |
|---|---|---|---|
| Supervisor | planning/routing/review coordination | plan, route, request approval, synthesize evidence | supervised |
| Codex Worker | software implementation | repo-read, worktree-write, test, diff | supervised |
| Gemini/Antigravity Worker | alternate implementation/review | repo-read, worktree-write where granted | supervised |
| Script Worker | deterministic automation | shell whitelist, transforms, checks | auto for allowlisted commands |
| Browser Worker | web QA and controlled data entry | Playwright navigation, read, fill, screenshot | supervised for submit |
| Godot Worker | After Eight build/test | launch Godot, run project/tests, capture logs/artifacts | auto for non-destructive QA |
| QA Worker | independent verification | test, lint, build, static analysis | auto |
| Deploy Worker | preview/release | Vercel preview; production with approval | preview auto / prod supervised |
| Home-PC Worker | local execution host | approved local tools and project workspaces | capability-scoped |

## Routing principle
The router chooses the cheapest adequate worker, not the most powerful model by default. A model quota or outage must degrade capacity, not stop the task system.
