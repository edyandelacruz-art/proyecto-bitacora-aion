# AION — instrucciones obligatorias para agentes de código

Este repositorio se desarrolla con asistencia de agentes de programación. Antes de diseñar, refactorizar o implementar AION Aegis, **lee completos** los documentos normativos de la raíz.

## Orden de lectura obligatorio

1. `AION_AEGIS_MASTER_BLUEPRINT.md` — producto, arquitectura, módulos, agentes, datos, autonomía, exportaciones y reglas generales.
2. `PROTOCOLO_BITACORA_ACTIVADOR.md` — conducta orgánica original de la bitácora: hechos literales, preguntas mínimas, propagación multódulo, fisiología, bioquímica, fotografía, corrección forense y jerarquía de certeza.
3. `AION_AEGIS_AGENT_COVERAGE_AUDIT.md` — diferencia entre agentes definidos y agentes realmente implementados; lista de especialistas faltantes y criterio de agente REAL.
4. `AION_AEGIS_ORGANIC_UX_STITCH_SPEC.md` — especificación visual mobile-first, Aegis Core orgánico, navegación, interacción, progressive disclosure, evidencia, Action Receipts y diseño Stitch.
5. `AION_BUILD_STATUS.md` — estado honesto `REAL / PARTIAL / MOCK / PLANNED` basado en evidencia.
6. `README.md`.
7. Código y tests del workspace afectado.

Ningún agente debe asumir que un estado histórico marcado como `REAL` sigue siendo correcto sin contrastarlo con la implementación.

---

# Reglas obligatorias

1. No reducir AION Aegis a nutrición. Es una bitácora personal inteligente, multimódulo, interactiva, adaptativa y progresivamente autónoma.
2. Distinguir siempre:
   - **AION Core**: orquestador del ecosistema AION entre aplicaciones.
   - **AION Aegis Core / Aegis Core**: agente/orquestador soberano interno de AION Aegis y experiencia conversacional principal del usuario.
3. La especialización crece hacia dentro: cada módulo tiene un Supervisor Agent y agentes expertos especializados. Evitar que dos módulos sean propietarios de la misma verdad.
4. Los especialistas pueden solaparse de forma controlada para verificación, segunda opinión y auditoría; los módulos no deben duplicar fuentes de verdad.
5. Preservar y migrar capacidades reales ya existentes. No reescribir por estética lo que ya funciona.
6. No inventar datos. `missing != default`. Ante información material faltante, preguntar o dejarla desconocida/estimada con evidencia.
7. No afirmar que una acción ocurrió si no existe confirmación de persistencia/resultado.
8. Mantener trazabilidad: entrada → interpretación → dominios → agentes → herramientas → lecturas → escrituras → evidencia → resultado → auditoría.
9. Acciones sensibles o irreversibles requieren confirmación humana según la política de autonomía.
10. Salud/bienestar: estimar y explicar, no diagnosticar ni presentar valores fisiológicos no medidos como mediciones reales.
11. Toda funcionalidad debe clasificarse como `REAL`, `PARTIAL`, `MOCK` o `PLANNED` hasta que exista evidencia técnica.
12. Construir y mantener pruebas para contratos de dominio, persistencia, agentes, autonomía, visión, correcciones y exportaciones.
13. La experiencia principal es conversacional y multimodal. El usuario no debe aprender a clasificar manualmente su vida para usar Aegis.
14. Los dashboards son superficies de inspección, corrección, análisis y configuración; no formularios obligatorios.
15. Aegis Core NO debe mostrar un grid permanente con todos los módulos. Debe usar progressive disclosure y resúmenes contextuales.
16. Mobile-first: una columna, scroll orgánico, drawer, bottom sheets, sticky composer y baja densidad.
17. El formato XLSX exportable debe respetar el contrato del Blueprint y la compatibilidad conceptual con `SALUD_METABOLISMO_EDYAN.xlsx`.
18. Diseño visual oficial: negro/grafito + violeta/lavanda + dorado premium como acento. Logo Aegis: `apps/aion-aegis/public/brand/aion-aegis-logo-dark.svg`.
19. Antigravity u otro agente puede implementar por fases internas, pero debe continuar autónomamente cuando las decisiones ya estén resueltas y ejecutar build/tests entre fases.
20. Mantener `AION_BUILD_STATUS.md` y no sobrevalorar estados.
21. Las correcciones posteriores aprobadas son acumulativas; no reintroducir fallas conocidas.
22. No llamar “agente REAL” a un metadata object. Un agente REAL requiere implementación ejecutable, tool binding, schemas, permisos, error handling, Ledger/tracing y tests.
23. `AgentRuntime.invokeAgent()` debe terminar despachando trabajo real; devolver el input como output es solo prototipo.
24. Vision real significa inferencia sobre píxeles/documentos mediante proveedor multimodal u otro pipeline real, no keywords del texto acompañante.
25. La UI nunca debe mostrar un éxito que el backend/runtime no confirmó.
26. Toda corrección de dato validado conserva `ANTES → DESPUÉS` y recalcula dependencias.
27. Una sola entrada puede afectar múltiples módulos. El usuario no debe administrar manualmente esa propagación.
28. Preguntar solo el dato mínimo cuya ausencia cambie materialmente el resultado.
29. No mostrar todos los agentes al usuario. Complejidad oculta por defecto; transparencia opcional muestra metadata operativa, no chain-of-thought.
30. La prioridad es un sistema coherente, verificable, usable y orgánico, no maximizar archivos, cards, pantallas o nombres de agentes.

---

# Criterio de agente REAL

Antes de elevar un agente a `REAL`, documentar:

- implementación ejecutable;
- archivo;
- input/output schemas;
- capabilities;
- tools reales;
- lecturas/escrituras;
- permisos/risk policy;
- confidence/confirmation policy;
- manejo de errores;
- persistencia si aplica;
- Ledger/correlation ID;
- test unitario;
- test de contrato;
- evaluación reproducible;
- verificación de resultado.

Si falta evidencia, usar `PARTIAL`, `MOCK` o `PLANNED`.

---

# Regla UX resumida

> **El usuario vive y conversa; Aegis organiza.**

Aegis Core muestra lo importante ahora y deja la profundidad dentro de los módulos. Una pantalla limpia con información selectiva es preferible a una pantalla llena de datos correctos pero cognitivamente inútiles.
