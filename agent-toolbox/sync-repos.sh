#!/usr/bin/env bash
set -euo pipefail

# Safe fetch/update helper for the external AION agent toolbox.
# It only clones or fast-forwards repositories. It does NOT run installers,
# execute third-party code, modify API keys, or push anything to GitHub.

BASE_DIR="${1:-external/agent-toolbox}"
mkdir -p "$BASE_DIR"

repos=(
  "virgiliojr94/book-to-skill"
  "lfnovo/open-notebook"
  "petergyang/no-ai-slop"
  "usestrix/strix"
  "ayghri/i-have-adhd"
  "every-app/open-seo"
  "diegosouzapw/OmniRoute"
  "MadsLorentzen/ai-job-search"
  "Anil-matcha/Open-Generative-AI"
)

for repo in "${repos[@]}"; do
  owner="${repo%%/*}"
  name="${repo##*/}"
  target="$BASE_DIR/${owner}__${name}"

  if [[ -d "$target/.git" ]]; then
    echo "[update] $repo"
    git -C "$target" fetch --prune origin
    branch="$(git -C "$target" symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's#^origin/##' || true)"
    if [[ -n "$branch" ]]; then
      git -C "$target" checkout "$branch" >/dev/null 2>&1 || true
      git -C "$target" pull --ff-only origin "$branch"
    else
      echo "[warn] Could not resolve default branch for $repo; fetched only."
    fi
  else
    echo "[clone] $repo"
    git clone --filter=blob:none "https://github.com/${repo}.git" "$target"
  fi

done

echo
echo "Toolbox synchronized in: $BASE_DIR"
echo "Next step: inspect README, LICENSE, dependency files and scripts before installing anything."
