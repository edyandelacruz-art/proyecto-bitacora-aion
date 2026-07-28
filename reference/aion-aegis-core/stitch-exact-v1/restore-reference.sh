#!/usr/bin/env bash
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$HERE/restored"
mkdir -p "$OUT"

EXPECTED_ZIP="66ccf8cab625ac52a3a76cea8a20dfa4922ad327309bdb10b0c9d9773b1625f6"
EXPECTED_SCREEN="aa0692caf8d80fc90c17a2c31a02089749a48813534abd3f89a4f640725a17e9"
EXPECTED_CODE="d4df987fae4d247fa2fb4efe20aa6b53904acc022e1bd1826ad98790acd3f729"
EXPECTED_DESIGN="e039c740638ae167573565b28c9ec6a221e84deb3e46c082255fa7288bad18f6"
DRIVE_FILE_ID="12tEAT4rDhtdyG_4nnksnXzq9q9u3giiE"
DRIVE_URL="https://drive.google.com/file/d/${DRIVE_FILE_ID}/view?usp=drivesdk"

# Restaurar el HTML original exacto preservado en GitHub.
base64 --decode "$HERE/code.html.gz.b64" | gzip --decompress > "$OUT/code.html"
ACTUAL_CODE="$(sha256sum "$OUT/code.html" | awk '{print $1}')"
ACTUAL_DESIGN="$(sha256sum "$HERE/DESIGN.md" | awk '{print $1}')"

[[ "$ACTUAL_CODE" == "$EXPECTED_CODE" ]] || { echo "ERROR: code.html no coincide" >&2; exit 1; }
[[ "$ACTUAL_DESIGN" == "$EXPECTED_DESIGN" ]] || { echo "ERROR: DESIGN.md no coincide" >&2; exit 1; }

echo "HTML y sistema visual restaurados y validados:"
echo "  $OUT/code.html"
echo "  $HERE/DESIGN.md"

# Opcional: validar y extraer el ZIP original exacto si se proporciona su ruta.
if [[ $# -ge 1 ]]; then
  ZIP_PATH="$1"
  [[ -f "$ZIP_PATH" ]] || { echo "ERROR: no existe $ZIP_PATH" >&2; exit 1; }

  ACTUAL_ZIP="$(sha256sum "$ZIP_PATH" | awk '{print $1}')"
  [[ "$ACTUAL_ZIP" == "$EXPECTED_ZIP" ]] || { echo "ERROR: el ZIP no coincide con la fuente canónica" >&2; exit 1; }

  ARCHIVE_OUT="$OUT/source-archive"
  rm -rf "$ARCHIVE_OUT"
  mkdir -p "$ARCHIVE_OUT"
  unzip -q "$ZIP_PATH" -d "$ARCHIVE_OUT"

  ACTUAL_SCREEN="$(sha256sum "$ARCHIVE_OUT/screen.png" | awk '{print $1}')"
  ARCHIVE_CODE="$(sha256sum "$ARCHIVE_OUT/code.html" | awk '{print $1}')"
  ARCHIVE_DESIGN="$(sha256sum "$ARCHIVE_OUT/DESIGN.md" | awk '{print $1}')"

  [[ "$ACTUAL_SCREEN" == "$EXPECTED_SCREEN" ]] || { echo "ERROR: screen.png no coincide" >&2; exit 1; }
  [[ "$ARCHIVE_CODE" == "$EXPECTED_CODE" ]] || { echo "ERROR: code.html del ZIP no coincide" >&2; exit 1; }
  [[ "$ARCHIVE_DESIGN" == "$EXPECTED_DESIGN" ]] || { echo "ERROR: DESIGN.md del ZIP no coincide" >&2; exit 1; }

  echo "ZIP canónico validado y extraído:"
  echo "  $ARCHIVE_OUT/screen.png"
  echo "  $ARCHIVE_OUT/code.html"
  echo "  $ARCHIVE_OUT/DESIGN.md"
else
  echo
  echo "Para validar la referencia visual completa, descarga el ZIP canónico y ejecuta:"
  echo "  bash restore-reference.sh /ruta/STITCH_AION_AEGIS_CORE_EXACT_2026-07-28.zip"
  echo "Ubicación registrada: $DRIVE_URL"
  echo "SHA-256 esperado: $EXPECTED_ZIP"
fi
