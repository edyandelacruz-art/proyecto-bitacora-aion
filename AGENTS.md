# AION — INSTRUCCIONES OBLIGATORIAS PARA AGENTES DE CÓDIGO

Este repositorio se desarrolla con asistencia de agentes de programación. Antes de diseñar, refactorizar o implementar AION Aegis, **lee completos** los documentos normativos de la raíz.

## Orden de lectura obligatorio

1. `AION_AEGIS_MASTER_BLUEPRINT.md` — definición completa del producto, arquitectura, dominios, agentes, autonomía, datos y reglas generales.
2. `AION_LEGACY_REFERENCE_FOR_AEGIS.md` — patrones funcionales rescatados del AION original revisado en Drive y `AION (2).zip`: núcleo, navegación jerárquica, módulos satélite, bitácora, inspector y profundidad de Nutrición.
3. `PROTOCOLO_BITACORA_ACTIVADOR.md` — conducta orgánica de la bitácora: hechos literales, preguntas mínimas, propagación multidominio, evidencia, fisiología, bioquímica, fotografía y corrección forense.
4. `AION_AEGIS_AGENT_COVERAGE_AUDIT.md` — diferencia entre arquitectura deseada y agentes realmente implementados; lista de especialistas faltantes y criterio de agente REAL.
5. `AION_AEGIS_UI_ARCHITECTURE.md` — arquitectura visual y de navegación que debe implementar el frontend: Aegis Core orgánico, sidebar/drawer, módulos configurables, progressive disclosure y módulos profundos.
6. `ANTIGRAVITY_AEGIS_REBUILD_DIRECTIVE.md` — directiva técnica completa de implementación y secuencia de construcción.
7. `AION_BUILD_STATUS.md` — estado honesto `REAL / PARTIAL / MOCK / PLANNED / BLOCKED` basado en evidencia.
8. `README.md`.
9. Código y tests del workspace afectado.

### Archivo exclusivo para Stitch

`AION_AEGIS_STITCH_PROMPT.txt` es un brief **solo de UI/UX visual**. No debe usarse como sustituto del Blueprint ni de la directiva técnica de Antigravity.

Ningún agente debe asumir que un estado histórico marcado como `REAL` sigue siendo correcto sin contrastarlo con implementación y pruebas.

---

# Reglas obligatorias

1. No reducir AION Aegis a nutrición. Es una bitácora personal inteligente, multimódulo, multimodal, interactiva, adaptativa y progresivamente autónoma.
2. Distinguir siempre:
   - **AION Core**: orquestador del ecosistema AION entre aplicaciones.
   - **AION Aegis Core / Aegis Core**: agente/orquestador soberano interno de AION Aegis y experiencia principal del usuario.
3. Recuperar del AION legacy sus patrones útiles sin volver a meter todos los futuros AION dentro de Aegis.
4. La especialización crece hacia dentro: cada dominio tiene Supervisor Agent y especialistas. Evitar que dos módulos sean propietarios de la misma verdad.
5. Los especialistas pueden solaparse de forma controlada para verificación, segunda opinión y auditoría; los módulos no duplican fuentes de verdad.
6. Preservar y migrar capacidades REAL ya existentes. No reescribir por estética lo que funciona.
7. No inventar datos. `missing != default`. Ante información material faltante, preguntar lo mínimo o dejarla desconocida/estimada con evidencia.
8. No afirmar que una acción ocurrió si no existe confirmación de persistencia/resultado.
9. Mantener trazabilidad: entrada → interpretación → contexto → dominios → agentes → herramientas → lecturas → escrituras → evidencia → resultado → auditoría.
10. Acciones sensibles o irreversibles requieren confirmación humana según política de autonomía.
11. Salud/bienestar: estimar y explicar, no diagnosticar ni presentar valores fisiológicos no medidos como mediciones reales.
12. Toda funcionalidad debe clasificarse como `REAL`, `PARTIAL`, `MOCK`, `PLANNED` o `BLOCKED` hasta que exista evidencia técnica.
13. Construir y mantener pruebas para contratos de dominio, persistencia, agentes, autonomía, visión, correcciones, exportaciones y cruces multidominio.
14. La experiencia principal es conversacional y multimodal. El usuario no debe aprender a clasificar manualmente su vida para usar Aegis.
15. Los dashboards de módulo son superficies de inspección, corrección, análisis y configuración; no formularios obligatorios.
16. Aegis Core NO debe mostrar un grid permanente con todos los módulos. Debe usar progressive disclosure y resúmenes contextuales.
17. Recuperar el patrón legacy de módulos satélite: visible/colapsado/oculto + pin/unpin + orden del usuario, adaptado a Aegis Core moderno.
18. Ocultar un resumen de Core no elimina ni desactiva el módulo.
19. Mobile-first: una columna, scroll orgánico, drawer, bottom sheets, sticky composer y baja densidad.
20. El formato XLSX exportable debe respetar el contrato del Blueprint y la compatibilidad conceptual con `SALUD_METABOLISMO_EDYAN.xlsx`.
21. Diseño visual oficial: negro/grafito + violeta/lavanda + dorado premium como acento. Logo Aegis bajo `apps/aion-aegis/public/brand/`.
22. Antigravity u otro agente puede implementar por fases internas, pero debe continuar autónomamente cuando las decisiones ya estén resueltas y ejecutar build/tests entre fases.
23. Mantener `AION_BUILD_STATUS.md` y no sobrevalorar estados.
24. Las correcciones posteriores aprobadas son acumulativas; no reintroducir fallas conocidas.
25. No llamar “agente REAL” a un metadata object. Un agente REAL requiere implementación ejecutable, tool binding, schemas, permisos, error handling, Ledger/tracing y tests.
26. `AgentRuntime.invokeAgent()` debe despachar trabajo real; devolver el input como output es prototipo.
27. Visión real significa inferencia sobre imagen/documento mediante proveedor multimodal u otro pipeline real, no keywords del texto acompañante.
28. La UI nunca debe mostrar éxito que backend/runtime no confirmó.
29. Toda corrección de dato validado conserva `ANTES → DESPUÉS` y recalcula dependencias.
30. Una sola entrada puede afectar múltiples módulos. El usuario no administra manualmente esa propagación.
31. Preguntar solo el dato mínimo cuya ausencia cambie materialmente el resultado.
32. No mostrar todos los agentes al usuario. Complejidad oculta por defecto; transparencia opcional muestra metadata operativa, no chain-of-thought.
33. Nutrición debe conservar la profundidad histórica de la Bitácora/Magnum: ingesta literal, rangos, supuestos, confianza, digestión, fisiología, bioquímica, rutas, sinergias y QC; no reducirla a kcal/macros.
34. LLM interpreta/reconoce; motores y fuentes estructuradas calculan cuando el resultado es determinista.
35. La prioridad es un sistema coherente, verificable, usable y orgánico, no maximizar archivos, cards, pantallas o nombres de agentes.

---

# Criterio de agente REAL

Antes de elevar un agente a `REAL`, documentar:

- implementación ejecutable;
- archivo;
- versión;
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

Si falta evidencia, usar `PARTIAL`, `MOCK`, `PLANNED` o `BLOCKED`.

---

# Regla UX resumida

> **El usuario vive y conversa; Aegis organiza.**

Aegis Core muestra lo importante ahora, permite al usuario fijar/ocultar/reordenar resúmenes y deja la profundidad dentro de los módulos. Una pantalla limpia con información selectiva es preferible a una pantalla llena de datos correctos pero cognitivamente inútiles.
