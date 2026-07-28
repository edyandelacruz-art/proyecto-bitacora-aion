#!/usr/bin/env bash
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$HERE/restored"
mkdir -p "$OUT"

cat "$HERE"/screen.png.b64.part-* | base64 --decode > "$OUT/screen.png"
cat "$HERE"/stitch_aion_aegis_core_interface.zip.b64.part-* | base64 --decode > "$OUT/stitch_aion_aegis_core_interface.zip"

EXPECTED_SCREEN="aa0692caf8d80fc90c17a2c31a02089749a48813534abd3f89a4f640725a17e9"
EXPECTED_ZIP="66ccf8cab625ac52a3a76cea8a20dfa4922ad327309bdb10b0c9d9773b1625f6"

ACTUAL_SCREEN="$(sha256sum "$OUT/screen.png" | awk '{print $1}')"
ACTUAL_ZIP="$(sha256sum "$OUT/stitch_aion_aegis_core_interface.zip" | awk '{print $1}')"

[[ "$ACTUAL_SCREEN" == "$EXPECTED_SCREEN" ]] || { echo "ERROR: screen.png no coincide" >&2; exit 1; }
[[ "$ACTUAL_ZIP" == "$EXPECTED_ZIP" ]] || { echo "ERROR: ZIP no coincide" >&2; exit 1; }

echo "Referencia exacta restaurada y validada:"
echo "  $OUT/screen.png"
echo "  $OUT/stitch_aion_aegis_core_interface.zip"
