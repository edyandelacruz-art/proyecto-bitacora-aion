# ANTIGRAVITY — LEER ANTES DE CONSTRUIR

Antes de modificar AION Aegis, lee COMPLETOS y en este orden:

1. `AION_AEGIS_MASTER_BLUEPRINT.md`
2. `PROTOCOLO_BITACORA_ACTIVADOR.md`
3. `AION_AEGIS_AGENT_COVERAGE_AUDIT.md`
4. `AION_AEGIS_ORGANIC_UX_STITCH_SPEC.md`
5. `AGENTS.md`
6. `AION_BUILD_STATUS.md`
7. código y tests del workspace afectado

## Por qué son obligatorios

- El Blueprint define qué debe ser Aegis.
- El Protocolo Bitácora define cómo debe comportarse orgánicamente ante acontecimientos reales, datos faltantes, fotografía, fisiología, bioquímica y correcciones.
- Agent Coverage Audit impide confundir metadata con agentes reales y enumera los especialistas que todavía deben implementarse.
- Organic UX/Stitch Spec define la experiencia Aegis Core: mobile-first, conversacional, multimodal, interactiva, respirable y sin saturación.
- Build Status expresa el estado técnico honesto y debe actualizarse con evidencia.

## Reglas inmediatas

1. Audita el código actual antes de escribir.
2. Preserva lo que de verdad sea REAL.
3. Corrige cualquier capacidad sobrevalorada en `AION_BUILD_STATUS.md`.
4. No confundas AION Core global con AION Aegis Core.
5. No inventes datos, cantidades, montos, horas, sueño, gasto, porciones ni estados.
6. No uses keywords/hardcodes como si fueran inteligencia real.
7. No declares agentes REAL si `AgentRuntime` no ejecuta realmente su comportamiento.
8. Implementa supervisores + especialistas + verifier/auditor donde el Blueprint lo requiere.
9. Toda operación importante debe verificarse antes de responder éxito.
10. Ejecuta build/tests continuamente.
11. La UI debe ocultar complejidad: el usuario habla con Aegis, no administra agentes.
12. En Aegis Core NO hagas una parrilla de todos los módulos. Usa progressive disclosure y resúmenes contextuales.
13. Mobile-first: drawer, bottom sheets, sticky composer, scroll vertical y acciones táctiles.
14. La identidad oficial Aegis está en `apps/aion-aegis/public/brand/aion-aegis-logo-dark.svg`.
15. Estética: negro/grafito + violeta/lavanda + dorado premium discreto.
16. Mantén `REAL / PARTIAL / MOCK / PLANNED` basado en evidencia, no intención.

## Flujo de trabajo

```text
Leer especificaciones
  ↓
Auditar implementación
  ↓
Corregir estado
  ↓
Implementar bloque pequeño
  ↓
Build/tests
  ↓
Verificar persistencia/resultado
  ↓
Actualizar Ledger/tests/status
  ↓
Continuar
```

No te detengas para preguntar decisiones ya resueltas por los documentos normativos. Documenta cualquier nueva decisión arquitectónica.

Al final, deja el producto navegable y entrega:

- qué quedó REAL;
- qué quedó PARTIAL;
- qué quedó MOCK;
- qué quedó PLANNED;
- tests ejecutados;
- fallos pendientes;
- decisiones nuevas;
- orden recomendado para auditoría humana.
