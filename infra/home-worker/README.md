# AION Forge Home Worker

This directory prepares the future private execution node on Edyan's desktop PC.

## Security baseline
- Dedicated non-admin Windows account recommended.
- No public RDP/VNC exposure.
- Worker initiates outbound connections to Forge.
- Workspace restricted to a dedicated root such as `D:\AION_DEV`.
- Repository allowlist and tool allowlist are mandatory.
- Credentials live in OS/secret storage, not JSON config or Git.
- Production deploy and secret mutation denied by default.

## Tomorrow
1. Run `check-prerequisites.ps1`.
2. Decide final workspace drive/path.
3. Clone/sync approved repositories.
4. Implement signed worker registration + heartbeat.
5. Implement task claim/lease/checkpoint protocol.
6. Add Git worktree executor first.
7. Add Godot/Playwright adapters only after the worker protocol is stable.

`config.example.json` contains no credentials and is not an executable worker yet.
