# AION — instrucciones obligatorias para agentes de código

Este repositorio se desarrolla con asistencia de agentes de programación. Antes de diseñar, refactorizar o implementar AION Aegis, **lee completo** el documento raíz:

`AION_AEGIS_MASTER_BLUEPRINT.md`

Ese archivo es la especificación normativa de producto, arquitectura, agentes, módulos, datos, dashboards, autonomía, auditoría, exportaciones y diseño visual de AION Aegis.

## Reglas obligatorias

1. No reducir AION Aegis a nutrición. Es una bitácora personal inteligente, multimódulo, interactiva, adaptativa y autónoma.
2. Distinguir siempre:
   - **AION Core**: orquestador del ecosistema AION entre aplicaciones.
   - **AION Aegis Core**: agente/orquestador soberano interno de AION Aegis.
3. La especialización crece hacia dentro: cada módulo tiene un Supervisor Agent y agentes expertos especializados. Evitar que dos módulos sean propietarios de la misma verdad.
4. Los especialistas pueden solaparse de forma controlada para verificación, segunda opinión y auditoría; los módulos no deben duplicar fuentes de verdad.
5. Preservar y migrar las capacidades reales ya existentes. No reescribir por estética lo que ya funciona.
6. No inventar datos. `missing != default`. Ante información material faltante, preguntar o dejarla como desconocida/estimada con nivel de evidencia.
7. No afirmar que una acción ocurrió si no existe confirmación de persistencia/resultado.
8. Mantener trazabilidad: entrada -> interpretación -> agentes -> herramientas -> cambios -> evidencia -> resultado -> auditoría.
9. Acciones sensibles o irreversibles requieren confirmación humana según la política de autonomía del Blueprint.
10. Salud/bienestar: estimar y explicar, no diagnosticar ni presentar valores fisiológicos no medidos como si fueran mediciones reales.
11. Toda funcionalidad debe quedar clasificada como `REAL`, `PARTIAL`, `MOCK` o `PLANNED` hasta que exista evidencia técnica de su estado.
12. Construir y mantener pruebas para contratos de dominio, persistencia, agentes, reglas de autonomía y exportaciones.
13. La experiencia principal es conversacional y multimodal. El usuario no debe aprender a clasificar manualmente su vida para usar Aegis.
14. Los dashboards son superficies de inspección, corrección, análisis y configuración; no deben convertirse en formularios obligatorios para registrar cada evento.
15. El formato XLSX exportable debe respetar el contrato de datos descrito en el Blueprint y mantener compatibilidad conceptual con `SALUD_METABOLISMO_EDYAN.xlsx`.
16. Implementar el diseño visual premium oscuro definido en el Blueprint: negro/grafito como base y violeta como acento, sin saturar toda la interfaz de púrpura.
17. Antigravity u otro agente puede implementar en fases internas, pero debe continuar de forma autónoma hasta completar el alcance solicitado, ejecutando build/tests entre fases y sin detenerse a pedir aprobación por decisiones no destructivas ya resueltas en el Blueprint.
18. Mantener un archivo `AION_BUILD_STATUS.md` con el estado por módulo, agente, servicio, dashboard, integración y exportador.
19. Edyan audita después de la construcción. Las correcciones posteriores son acumulativas: no revertir decisiones aprobadas sin una razón técnica documentada.

## Orden de lectura

1. `AION_AEGIS_MASTER_BLUEPRINT.md`
2. `README.md`
3. `AION_BUILD_STATUS.md` si ya existe
4. código actual del workspace afectado
5. tests existentes

La prioridad es construir un sistema coherente y verificable, no maximizar el número de archivos, agentes o pantallas.