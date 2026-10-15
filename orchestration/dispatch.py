#!/usr/bin/env python3
"""AION local task dispatcher: opt-in agent execution in isolated Git worktrees."""
from __future__ import annotations
import argparse
import datetime as dt
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import sys

VALID_ID = re.compile(r"^[A-Z][A-Z0-9-]{2,63}$")
ENGINES = ("antigravity", "codex")

def load_task(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or not VALID_ID.fullmatch(str(data.get("id", ""))):
        raise ValueError("Invalid task or task id")
    if data.get("status") not in ("DRAFT", "READY", "BLOCKED", "COMPLETE"):
        raise ValueError("Invalid task status")
    if data.get("risk") not in ("LOW", "MEDIUM", "HIGH"):
        raise ValueError("Invalid risk")
    if data.get("engine") not in ENGINES:
        raise ValueError("Invalid engine")
    if not isinstance(data.get("objective"), str) or not data["objective"].strip():
        raise ValueError("Objective required")
    for field in ("allowed_paths", "acceptance_criteria"):
        vals = data.get(field)
        if not isinstance(vals, list) or not vals or not all(isinstance(x, str) and x.strip() for x in vals):
            raise ValueError(field + " must be a nonempty string list")
    for raw in data["allowed_paths"]:
        p = PurePosixPath(raw)
        if p.is_absolute() or "\\" in raw or ".." in p.parts or raw in (".", ""):
            raise ValueError("Unsafe path in allowed_paths")
    if not isinstance(data.get("constraints", []), list):
        raise ValueError("constraints must be a list")
    return data

def build_prompt(task: dict, engine: str) -> str:
    return "\n".join([
        "AION verified work order. Read and obey root AGENTS.md before any action.",
        "Task: " + task["id"], "Worker: " + engine,
        "Goal: " + task["objective"],
        "Allowed change paths: " + ", ".join(task["allowed_paths"]),
        "Acceptance criteria:", *(("- " + x) for x in task["acceptance_criteria"]),
        "Constraints:", *(("- " + str(x)) for x in task.get("constraints", [])),
        "Preserve existing correct code. Do not modify files outside allowed paths.",
        "Do not install dependencies, access secrets, push, merge, deploy, spend or contact external users.",
        "Report commands actually executed, tests actually run, changed files, and blockers.",
        "Classify outcomes REAL, PARTIAL or BLOCKED; never invent successful execution."
    ])

def make_command(engine: str, prompt: str, workspace: Path, minutes: int) -> list[str]:
    if engine == "antigravity":
        return ["agy", "-p", prompt, "--output-format", "json",
                "--sandbox", "--print-timeout", str(minutes) + "m"]
    return ["codex", "exec", "--json", "--sandbox", "workspace-write",
            "--cd", str(workspace), prompt]

def git(repo: Path, *args: str) -> str:
    p = subprocess.run(["git", "-C", str(repo), *args], check=True,
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    return p.stdout.strip()

def dispatch(task: dict, engine: str, repo: Path, minutes: int, execute: bool) -> int:
    if task["status"] != "READY":
        raise ValueError("Task not READY; review its contract first")
    if task["risk"] == "HIGH":
        raise ValueError("HIGH-risk tasks blocked until separate approval process exists")
    if not 1 <= minutes <= 120:
        raise ValueError("Timeout must be 1-120 minutes")
    root = Path(git(repo, "rev-parse", "--show-toplevel")).resolve()
    exe = "agy" if engine == "antigravity" else "codex"
    if not execute:
        print(json.dumps({"task": task["id"], "engine": engine, "repo": str(root),
                          "status": "PLAN_ONLY", "executable_found": shutil.which(exe) is not None},
                         ensure_ascii=False, indent=2))
        return 0
    if not shutil.which(exe):
        raise RuntimeError(exe + " CLI not found on executing machine")
    stamp = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    runid = task["id"] + "-" + engine + "-" + stamp
    branch = "agents/" + engine + "/" + task["id"].lower() + "-" + stamp.lower()
    runtime = Path.home() / ".aion-control-plane"
    workspace = runtime / "worktrees" / runid
    logdir = runtime / "runs" / runid
    logdir.mkdir(parents=True, exist_ok=False)
    os.chmod(logdir, 0o700)
    git(root, "worktree", "add", "-b", branch, str(workspace), "HEAD")
    record = {"task": task["id"], "engine": engine, "branch": branch,
              "workspace": str(workspace), "status": "RUNNING", "verified": False}
    try:
        proc = subprocess.run(make_command(engine, build_prompt(task, engine), workspace, minutes),
                              cwd=workspace, capture_output=True, text=True, encoding="utf-8",
                              errors="replace", timeout=minutes * 60 + 30, check=False)
        (logdir / "stdout.log").write_text(proc.stdout, encoding="utf-8")
        (logdir / "stderr.log").write_text(proc.stderr, encoding="utf-8")
        record["exit_code"] = proc.returncode
        record["status"] = "UNVERIFIED_REVIEW_REQUIRED" if proc.returncode == 0 else "PROCESS_ERROR"
    except subprocess.TimeoutExpired as exc:
        record.update(status="TIMEOUT", error=str(exc))
    finally:
        record["git_status"] = git(workspace, "status", "--short")
        record["ended_at"] = dt.datetime.now(dt.timezone.utc).isoformat()
        (logdir / "run.json").write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
        print(json.dumps({"report": str(logdir / "run.json"), **record}, ensure_ascii=False, indent=2))
    return 0 if record["status"] == "UNVERIFIED_REVIEW_REQUIRED" else 2

def main() -> int:
    parser = argparse.ArgumentParser(description="AION Codex / Antigravity local dispatcher")
    parser.add_argument("--task", required=True, type=Path)
    parser.add_argument("--repo", default=".", type=Path)
    parser.add_argument("--engine", choices=ENGINES)
    parser.add_argument("--timeout-minutes", type=int, default=20)
    parser.add_argument("--execute", action="store_true", help="Required to actually invoke an agent")
    args = parser.parse_args()
    try:
        task = load_task(args.task)
        return dispatch(task, args.engine or task["engine"], args.repo,
                        args.timeout_minutes, args.execute)
    except (OSError, RuntimeError, ValueError, subprocess.CalledProcessError) as exc:
        print("BLOCKED: " + str(exc), file=sys.stderr)
        return 2

if __name__ == "__main__":
    raise SystemExit(main())
