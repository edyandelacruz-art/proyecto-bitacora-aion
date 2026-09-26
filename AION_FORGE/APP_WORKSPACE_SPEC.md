# AION Forge — App / Workspace Specification

## 1. Objetivo de la aplicación

AION Forge Workspace es la interfaz privada desde la cual Edyan organiza proyectos, conversa con el Supervisor, delega tareas, observa ejecuciones, revisa evidencias y aprueba acciones sensibles.

No debe parecer una colección desordenada de chats. La unidad principal de navegación es el **proyecto** y dentro de cada proyecto existen conversaciones, tareas, decisiones, artefactos y ejecuciones relacionadas.

## 2. Principio UX

> **El usuario piensa en proyectos y objetivos; Forge organiza conversaciones, memoria, tareas y agentes.**

La interfaz debe ocultar la complejidad de workers por defecto y permitir inspeccionarla cuando se necesite.

## 3. Navegación propuesta

```text
AION Forge
├── Command Center
├── Projects
├── Conversations
├── Tasks
├── Team / Agents
├── Workspaces
├── Knowledge
├── Automations
├── Approvals
└── Control & Security
```

## 4. Command Center

Debe mostrar:

- entrada principal de lenguaje natural;
- tareas activas;
- tareas esperando aprobación;
- estado de Home PC;
- workers disponibles;
- GitHub/Vercel/Supabase y otros conectores;
- incidentes/bloqueos;
- actividad reciente;
- accesos rápidos a proyectos.

Ejemplo:

```text
¿Qué necesitas?
> Para hoy corrige Predictive y prueba After Eight. No hagas producción.

[Planificar] [Ejecutar]
```

## 5. Projects

Cada proyecto debe tener una página propia:

```text
Project: After Eight
├── Overview
├── Conversations
├── Tasks
├── Repository
├── Architecture
├── Decisions
├── Builds
├── QA
├── Artifacts
└── Memory
```

Proyectos iniciales previstos:

- AION Core / AION Aegis / AION Edu;
- BETCA Docente Web;
- After Eight;
- Predictive;
- Hilo;
- herramientas y librerías compartidas.

## 6. Conversations

Las conversaciones no deben vivir como una lista global plana. Cada conversación debe asociarse a:

- `project_id`;
- participantes/modelos;
- objetivo;
- tareas derivadas;
- decisiones producidas;
- artefactos;
- timestamps;
- resumen persistente.

### Relación con ChatGPT

Forge no debe asumir que puede importar mágicamente todo el historial privado de ChatGPT. El diseño debe soportar tres mecanismos:

1. **Conversaciones originadas dentro de Forge** usando un Supervisor vía API.
2. **Conector/MCP de Forge hacia ChatGPT**, para que desde una conversación de ChatGPT se puedan crear/consultar tareas y memoria en Forge.
3. **Importación explícita de conversaciones o resúmenes** cuando el usuario quiera conservar chats históricos.

La identidad funcional del Supervisor debe provenir de reglas, memoria y contexto almacenados en Forge; no depender exclusivamente de una sesión concreta de ChatGPT.

## 7. Task View

Cada tarea debe mostrar como mínimo:

| Campo | Ejemplo |
|---|---|
| Task | `AFTER8-037` |
| Objetivo | corregir animación de caminar |
| Proyecto | After Eight |
| Estado | VERIFYING |
| Worker | Codex Worker 01 |
| Reviewer | Visual QA Agent |
| Workspace | worktree/AFTER8-037 |
| Branch | agent/AFTER8-037 |
| Progreso | 82% |
| Último checkpoint | timestamp |
| Riesgo | medium |
| Producción | prohibida |

Acciones:

- Ver plan.
- Ver ejecución.
- Ver diff.
- Ver logs.
- Ver screenshots/video.
- Solicitar cambios.
- Aprobar.
- Cancelar.
- Reasignar worker.

## 8. Team / Agents

Vista opcional de organización:

```text
Supervisor
  OpenAI Supervisor

Architecture
  Gemini Architect
  Claude Reviewer

Coding
  Codex Worker
  Claude Code Worker
  Antigravity Worker

QA
  Test Runner
  Playwright Browser Agent
  Game QA Agent

Design
  Stitch
  SkillUI
  UIUX Pro Max
  Impeccable
```

Cada agente muestra:

- estado;
- capabilities;
- permisos;
- tarea actual;
- costo/uso si está disponible;
- último resultado;
- health.

## 9. Workspaces

Representa entornos de ejecución:

- Home PC;
- Vercel Sandbox;
- cloud worker;
- browser session;
- Godot session;
- scientific workspace.

Cada workspace debe mostrar recursos, tarea, procesos y artefactos.

## 10. Knowledge

Debe contener:

- documentación de proyectos;
- decisiones de arquitectura;
- skills;
- agentes;
- contratos;
- documentación externa de referencia;
- repositorios de referencia como Fable/Claude prompts;
- resultados de evaluaciones.

La búsqueda debe ser por proyecto y por tipo de conocimiento.

## 11. Approvals

Bandeja explícita para acciones sensibles:

```text
WAITING FOR EDYAN

BETCA-214
Merge main
[review] [approve] [reject]

IBS-018
Submit 40 grades
[source validation: 40/40]
[review] [approve] [reject]
```

## 12. Automations

Vista para reglas recurrentes/condicionales:

- nightly builds;
- health checks;
- revisión de PR;
- QA después de deploy;
- pipelines científicos;
- tareas con fecha límite;
- recuperación de tareas bloqueadas.

## 13. Diseño técnico inicial

Propuesta inicial:

- **Frontend:** Next.js App Router.
- **Hosting UI/control plane:** Vercel.
- **Persistencia:** Supabase/PostgreSQL.
- **Auth:** proveedor con MFA/passkeys cuando sea posible.
- **Realtime:** Supabase Realtime/WebSocket o capa equivalente.
- **Workers:** Home PC + workers cloud/sandbox.
- **Code truth:** GitHub.
- **Artifacts:** object storage.
- **Secrets:** proveedor de secrets; nunca texto plano en DB/repos.

## 14. Modelo de datos mínimo

```text
users
projects
conversations
conversation_messages
conversation_summaries
tasks
task_runs
task_events
checkpoints
agents
agent_capabilities
workers
workspaces
repositories
branches
artifacts
approvals
automations
decisions
knowledge_items
connectors
security_events
```

## 15. Mobile-first

La app debe ser plenamente utilizable desde teléfono.

Acciones prioritarias móviles:

- delegar objetivo;
- revisar progreso;
- abrir preview;
- ver screenshot/video;
- aprobar/rechazar;
- responder una pregunta del agente;
- detener una ejecución.

No exigir terminal ni GitHub UI para operación normal.

## 16. Kill switch

Siempre visible cuando existan agentes ejecutando:

`STOP ALL AGENTS`

Debe detener input automation, nuevos jobs y workers en ejecución según la política de seguridad.
