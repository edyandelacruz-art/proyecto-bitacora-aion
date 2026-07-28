# AION Aegis Core — referencia visual exacta de Stitch

**Versión canónica:** `STITCH-AEGIS-CORE-EXACT-2026-07-28-v1`  
**Estado:** referencia normativa congelada para la página principal de AION Aegis Core.

Este directorio NO contiene inspiración, bocetos ni recomendaciones. Contiene la fuente visual exacta que debe trasladarse al frontend productivo.

## Orden de autoridad

1. `screen.png` reconstruido: verdad visual/pixelar.
2. `code.html`: verdad estructural, dimensional, tipográfica y de interacción del prototipo.
3. `DESIGN.md`: tokens y reglas de identidad.
4. `AION_AEGIS_EXACT_VISUAL_IDENTITY_CONTRACT.md` en la raíz: contrato obligatorio de implementación.

## Archivos preservados

- `code.html`: exportación original de Stitch, sin reescritura.
- `DESIGN.md`: sistema visual original, sin reescritura.
- `screen.png.b64.part-*`: imagen de referencia exacta codificada en Base64 y dividida en fragmentos.
- `stitch_aion_aegis_core_interface.zip.b64.part-*`: ZIP original exacto codificado en Base64 y dividido en fragmentos.
- `restore-reference.sh`: reconstruye `screen.png` y el ZIP original byte por byte.
- `SHA256SUMS`: hashes canónicos para comprobar integridad.

## Reconstrucción

Desde este directorio:

```bash
bash restore-reference.sh
```

El script reconstruye:

```text
restored/screen.png
restored/stitch_aion_aegis_core_interface.zip
```

Luego valida SHA-256. Si un hash no coincide, la referencia está dañada y NO debe usarse.

## Regla de implementación

Antigravity/Codex/Claude/Cursor NO deben “inspirarse” en esta referencia. Deben copiarla exactamente y conectar después la lógica real sin alterar su identidad visual.
