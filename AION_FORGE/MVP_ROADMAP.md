# AION Forge — MVP Roadmap

## Objetivo del MVP

Demostrar que Edyan puede delegar desde el teléfono una tarea real y que Forge puede conservarla, ejecutarla en el Home PC, producir evidencia, detenerse ante riesgo y entregar un resultado verificable sin exigir acceso manual al computador.

## Fase 0 — Fundaciones

**Estado:** PLANNED

Entregables:

- carpeta/repositorio lógico `AION_FORGE`;
- definición de proyectos;
- Task Contract;
- estados de tarea;
- Security Model;
- Agent/Worker Registry;
- formato de checkpoints.

Criterio de aceptación:

- una tarea puede describirse de forma inequívoca y persistirse sin depender de chat.

## Fase 1 — Forge Console

**Estado:** PLANNED

Stack inicial propuesto:

- Next.js App Router;
- Vercel;
- Supabase/PostgreSQL;
- autenticación privada;
- realtime/event stream.

Pantallas MVP:

1. Command Center.
2. Projects.
3. Task detail.
4. Approvals.
5. Workers.
6. Artifacts/logs.

Criterio de aceptación:

- desde móvil se crea una tarea y se observa su cambio de estados en tiempo real.

## Fase 2 — Home PC Worker

**Estado:** PLANNED

Configurar cuenta técnica y runtime local:

```text
AION-WORKER
├── Git
├── Codex / coding workers
├── Node
├── Python
├── Playwright
├── Godot
└── Forge Worker Service
```

Criterios:

- worker arranca como servicio;
- aparece ONLINE/OFFLINE en Forge;
- recibe job;
- crea workspace aislado;
- ejecuta comando permitido;
- devuelve logs/artefactos;
- no requiere exponer escritorio públicamente.

## Fase 3 — GitHub Development Pipeline

**Estado:** PLANNED

Flujo:

```text
Task
→ branch
→ worktree
→ coding worker
→ scope guard
→ tests
→ PR
```

Criterios:

- main no es modificado directamente;
- archivo fuera de scope bloquea ejecución;
- PR contiene trazabilidad hacia task_id.

## Fase 4 — Browser QA

**Estado:** PLANNED

Integrar Playwright.

Capacidades:

- navegar;
- autenticarse en entorno de prueba;
- llenar formularios;
- screenshots;
- consola/network;
- pruebas responsive;
- evidencia por paso.

Prueba sugerida:

- BETCA preview o aplicación web controlada.

## Fase 5 — After Eight / Game QA

**Estado:** PLANNED

Prueba de fuego para control local.

Secuencia objetivo:

```text
Forge Task
→ Home PC
→ Godot
→ ejecutar After Eight
→ secuencia de input
→ video + screenshots + logs
→ Visual QA
→ issue/task de corrección
→ coding worker
→ nueva ejecución
→ comparación
```

Criterio de aceptación:

- desde móvil se solicita una prueba del juego;
- Forge entrega evidencia visual y técnica sin intervención física de Edyan.

## Fase 6 — Multi-provider Router

**Estado:** PLANNED

Workers previstos:

- OpenAI/Codex;
- Gemini/Antigravity;
- Claude/Claude Code si hay acceso compatible;
- modelos locales cuando convenga;
- scripts deterministas.

Criterios:

- la pérdida temporal de un worker no destruye la Task;
- se puede reasignar sin ampliar permisos;
- el resultado conserva trazabilidad del worker usado.

## Fase 7 — Conversational Bridge

**Estado:** PLANNED

Crear una API/MCP de Forge para que una interfaz conversacional pueda:

- listar proyectos;
- crear Task;
- consultar estado;
- leer checkpoints;
- obtener artefactos;
- aprobar/rechazar cuando la política lo permita;
- guardar decisiones y resúmenes.

Objetivo:

> poder conversar en ChatGPT y usar Forge como memoria y motor operacional persistente.

## Fase 8 — Automations

**Estado:** PLANNED

Agregar:

- cron/scheduler;
- triggers GitHub;
- triggers deploy;
- health checks;
- deadlines;
- reanudación automática;
- notificaciones.

## Fase 9 — Browser/Desktop Actions de alto impacto

**Estado:** PLANNED

Después de validar seguridad:

- interacción con páginas institucionales;
- carga controlada de información;
- verificación fuente/destino;
- aprobación humana;
- auditoría completa.

No automatizar escrituras sensibles antes de completar esta fase.

## Día de construcción intensivo — objetivo realista

En una jornada enfocada, el objetivo no debe ser declarar todo `REAL`, sino dejar un vertical funcional completo:

```text
Forge Console
+
Supabase task memory
+
Home PC worker
+
GitHub integration
+
una Task real
+
logs/artefactos
+
approval gate
```

Si queda tiempo:

- Playwright;
- primer Game QA de After Eight.

## Definition of Done del MVP

AION Forge MVP está `REAL` cuando:

1. Edyan crea una Task desde móvil/web.
2. Task persiste en DB.
3. Home PC recibe ejecución.
4. Ejecución ocurre en workspace aislado.
5. Logs y artefactos regresan a Forge.
6. Reinicio/interrupción no elimina la Task.
7. Acción sensible solicita aprobación.
8. Resultado puede verificarse independientemente.
9. Existe kill switch.
10. Todo queda asociado a `task_id` y `correlation_id`.
