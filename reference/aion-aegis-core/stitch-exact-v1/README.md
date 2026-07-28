# AION Aegis Core — referencia visual exacta de Stitch

**Versión canónica:** `STITCH-AEGIS-CORE-EXACT-2026-07-28-v1`  
**Estado:** referencia normativa congelada para la página principal de AION Aegis Core.

Este directorio NO contiene inspiración, bocetos ni recomendaciones. Contiene la identidad visual exacta que debe trasladarse al frontend productivo.

## Orden de autoridad

1. `screen.png`, extraído del ZIP canónico: verdad visual/pixelar.
2. `code.html`, restaurado desde `code.html.gz.b64`: verdad estructural, dimensional, tipográfica y de interacción.
3. `DESIGN.md`: tokens y reglas de identidad originales.
4. `AION_AEGIS_EXACT_VISUAL_IDENTITY_CONTRACT.md` en la raíz: contrato obligatorio de implementación.

## Archivo ZIP canónico

El ZIP original exacto está preservado en Google Drive y registrado en:

```text
SOURCE_ARCHIVE.md
```

Datos de integridad:

```text
Archivo: STITCH_AION_AEGIS_CORE_EXACT_2026-07-28.zip
Drive file ID: 12tEAT4rDhtdyG_4nnksnXzq9q9u3giiE
SHA-256: 66ccf8cab625ac52a3a76cea8a20dfa4922ad327309bdb10b0c9d9773b1625f6
```

No utilizar otra exportación con el mismo nombre si el hash no coincide.

## Archivos preservados en GitHub

- `DESIGN.md`: sistema visual original, sin reescritura.
- `code.html.gz.b64`: `code.html` original exacto, comprimido con Gzip y codificado en Base64.
- `restore-reference.sh`: restaura y valida el HTML; también valida y extrae el ZIP canónico cuando se le entrega su ruta.
- `SOURCE_ARCHIVE.md`: ubicación y hash del ZIP original exacto.
- `SHA256SUMS`: hashes canónicos.

## Restaurar el HTML exacto

Desde este directorio:

```bash
bash restore-reference.sh
```

Esto genera y valida:

```text
restored/code.html
```

## Validar y extraer el ZIP exacto

Después de descargar el ZIP canónico desde la ubicación de `SOURCE_ARCHIVE.md`:

```bash
bash restore-reference.sh /ruta/STITCH_AION_AEGIS_CORE_EXACT_2026-07-28.zip
```

El script verifica SHA-256 y extrae:

```text
restored/source-archive/code.html
restored/source-archive/DESIGN.md
restored/source-archive/screen.png
```

## Regla de implementación

Antigravity, Codex, Claude Code y Cursor NO deben “inspirarse” en esta referencia. Deben copiarla exactamente y conectar después la lógica real sin alterar su identidad visual.
