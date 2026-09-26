# AION Forge

**Estado:** PLANNED / arquitectura formal en definición.

AION Forge es la capa privada de operación, coordinación y ejecución del ecosistema AION. Su objetivo es permitir que Edyan delegue objetivos completos desde una interfaz única y que un supervisor coordine agentes, modelos, herramientas, computadores y servicios externos hasta producir un resultado verificable.

> Principio rector: **Edyan delega resultados; Forge organiza, ejecuta, verifica y conserva el estado.**

## Documentos normativos

1. [`MASTER_BLUEPRINT.md`](./MASTER_BLUEPRINT.md) — visión, arquitectura, roles, capacidades, ejecución y límites.
2. [`APP_WORKSPACE_SPEC.md`](./APP_WORKSPACE_SPEC.md) — especificación de la aplicación privada que centraliza proyectos, conversaciones, tareas, agentes y evidencias.
3. [`SECURITY_MODEL.md`](./SECURITY_MODEL.md) — modelo de seguridad, permisos, aislamiento y acciones sensibles.
4. [`TASK_MEMORY_AND_AUTOMATION.md`](./TASK_MEMORY_AND_AUTOMATION.md) — memoria operacional, persistencia de tareas, checkpoints, automatizaciones y concurrencia.
5. [`MVP_ROADMAP.md`](./MVP_ROADMAP.md) — secuencia de implementación y criterios de aceptación.

## Relación con AION

AION Forge **no sustituye AION Core, AION Aegis, AION Edu ni los productos verticales**. Forge es la infraestructura de trabajo y ejecución que permite construir, operar, probar y coordinar dichos proyectos.

## Primeros proyectos objetivo

- AION / AION Aegis / AION Edu.
- BETCA Docente Web.
- After Eight.
- Predictive.
- Hilo / investigación científica.
- Herramientas compartidas: GitHub, Vercel, Supabase, Playwright, Godot, modelos y agentes externos.

## Regla de estado

Ninguna capacidad debe etiquetarse como `REAL` hasta existir implementación ejecutable, persistencia o efecto verificable, manejo de errores, permisos, trazabilidad y pruebas. Hasta entonces usar `PLANNED`, `PARTIAL`, `MOCK` o `BLOCKED`.
