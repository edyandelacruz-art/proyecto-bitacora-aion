# ANTIGRAVITY — LEER ANTES DE CONSTRUIR

Antes de modificar AION Aegis, lee COMPLETOS y en este orden:

1. `AION_AEGIS_MASTER_BLUEPRINT.md`
2. `AION_LEGACY_REFERENCE_FOR_AEGIS.md`
3. `PROTOCOLO_BITACORA_ACTIVADOR.md`
4. `AION_AEGIS_AGENT_COVERAGE_AUDIT.md`
5. `AION_AEGIS_UI_ARCHITECTURE.md`
6. `ANTIGRAVITY_AEGIS_REBUILD_DIRECTIVE.md`
7. `AGENTS.md`
8. `AION_BUILD_STATUS.md`
9. código y tests del workspace afectado

## Archivo que NO sustituye estas instrucciones

`AION_AEGIS_STITCH_PROMPT.txt` es el brief visual para Google Stitch. Sirve para definir cómo debe verse y sentirse la UI, pero NO contiene la arquitectura técnica, agentes, runtime, persistencia, contratos o criterios de implementación.

## Por qué son obligatorios

- `AION_AEGIS_MASTER_BLUEPRINT.md` define qué debe ser Aegis.
- `AION_LEGACY_REFERENCE_FOR_AEGIS.md` documenta qué patrones útiles se recuperan del AION original revisado en Drive y en `AION (2).zip`: núcleo, rail, módulos satélite configurables, bitácora, inspector, modos conversacional/operativo y profundidad histórica de Nutrición.
- `PROTOCOLO_BITACORA_ACTIVADOR.md` define cómo debe comportarse orgánicamente ante acontecimientos reales, datos faltantes, fotografía, fisiología, bioquímica y correcciones.
- `AION_AEGIS_AGENT_COVERAGE_AUDIT.md` impide confundir metadata con agentes reales y enumera los especialistas que todavía deben implementarse.
- `AION_AEGIS_UI_ARCHITECTURE.md` define la estructura visual que debe ensamblarse sobre la lógica real: Aegis Core orgánico, módulos profundos, sidebar/drawer y módulos configurables.
- `ANTIGRAVITY_AEGIS_REBUILD_DIRECTIVE.md` contiene la secuencia de implementación técnica completa.
- `AION_BUILD_STATUS.md` expresa el estado técnico honesto y debe actualizarse con evidencia.

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
11. La UI oculta complejidad: el usuario habla con Aegis, no administra agentes.
12. En Aegis Core NO hagas una parrilla de todos los módulos. Usa progressive disclosure y resúmenes contextuales.
13. Recupera del legacy la capacidad de fijar, colapsar, ocultar y reordenar módulos/resúmenes dentro del Core.
14. Ocultar de Core no elimina ni desactiva el módulo.
15. Mobile-first: drawer, bottom sheets, sticky composer, scroll vertical y acciones táctiles.
16. La identidad oficial Aegis está bajo `apps/aion-aegis/public/brand/`.
17. Estética: negro/grafito + violeta/lavanda + dorado premium discreto.
18. Nutrición no se reduce a kcal/macros: recuperar la profundidad del protocolo M2/Magnum y del AION legacy, con evidencia, rangos, fisiología, bioquímica, rutas, digestión, sinergias, cruces y QC.
19. Mantén `REAL / PARTIAL / MOCK / PLANNED / BLOCKED` basado en evidencia, no intención.
20. Stitch diseña; Antigravity implementa. No mezcles ambos briefs.

## Flujo de trabajo

```text
Leer especificaciones
  ↓
Auditar implementación
  ↓
Corregir estado
  ↓
Implementar bloque
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
- qué quedó BLOCKED;
- tests ejecutados;
- fallos pendientes;
- decisiones nuevas;
- orden recomendado para auditoría humana.
