# AION Forge — Task Memory and Automation

## 1. Objetivo

Forge debe conservar el estado de una tarea independientemente de una conversación, un modelo o una sesión. Una tarea material no desaparece hasta llegar a un estado terminal (`DONE`, `FAILED`, `CANCELLED`).

## 2. Máquina de estados

Estados mínimos:

```text
CREATED
PLANNING
READY
QUEUED
RUNNING
CHECKPOINTED
BLOCKED
WAITING_AGENT
WAITING_EDYAN
VERIFYING
READY_TO_DEPLOY
DEPLOYING
DONE
FAILED
CANCELLED
```

Cada transición debe producir un `task_event` auditable.

## 3. Persistencia

Fuente de verdad propuesta: PostgreSQL/Supabase.

Tablas mínimas:

```text
tasks
task_runs
task_events
task_dependencies
checkpoints
artifacts
approvals
workers
agents
projects
decisions
automations
```

## 4. Checkpoints

Cada ejecución larga debe poder guardar:

- último paso completado;
- archivos modificados;
- commit/branch/worktree;
- artefactos generados;
- outputs de herramientas;
- tests ejecutados;
- siguiente acción;
- bloqueo actual;
- worker/modelo que ejecutaba.

Ejemplo:

```json
{
  "task_id": "AFTER8-037",
  "status": "CHECKPOINTED",
  "completed_step": "run-bedroom-test",
  "branch": "agent/AFTER8-037",
  "workspace": "worktrees/AFTER8-037",
  "artifacts": ["video/run-03.mp4", "screenshots/frame-22.png"],
  "next_action": "visual-review",
  "retry_count": 0
}
```

## 5. Reanudación

Una tarea reanudada no debe depender de que el mismo modelo conserve contexto. El nuevo worker recibe:

- goal;
- task contract;
- project memory relevante;
- checkpoint;
- diff/branch actual;
- evidencias;
- decisiones previas resumidas.

## 6. Concurrencia

Cada Task tiene workspace aislado cuando escribe código.

Scheduler considera:

- CPU;
- RAM;
- GPU;
- procesos Godot;
- browsers activos;
- jobs científicos pesados;
- límites/cuotas de proveedores;
- exclusión mutua por recurso.

Ejemplo:

```text
BETCA-214       coding-worker-01
PRED-042        coding-worker-02
AFTER8-037      game-worker-01
HILO-019        science-worker-01
WEB-QA-102      browser-worker-01
```

## 7. Dependencias

Una tarea puede depender de otra:

```text
IMPLEMENT_FEATURE
   ↓
RUN_TESTS
   ↓
BROWSER_QA
   ↓
SECURITY_REVIEW
   ↓
PREVIEW
   ↓
WAITING_EDYAN
```

Fallos deben bloquear descendientes sin borrar evidencia anterior.

## 8. Reintentos y fallback

El scheduler puede cambiar worker ante:

- error transitorio;
- cuota agotada;
- timeout;
- worker offline;
- incapacidad declarada.

Ejemplo:

```text
Codex unavailable
→ Claude Code
→ Gemini/Antigravity
→ local/script si la tarea lo permite
```

El cambio de worker no autoriza ampliar scope ni permisos.

## 9. Automatizaciones

Tipos:

### Programadas

- nightly build;
- revisión periódica de dependencias;
- análisis de cobertura de datos;
- backups/verificación;
- health checks.

### Basadas en eventos

- push GitHub → tests;
- PR → review;
- deploy preview → browser QA;
- nueva versión → regression suite;
- nuevo dataset → pipeline científico.

### Basadas en condiciones

- worker vuelve online → reanudar;
- cuota vuelve disponible → continuar;
- aparece respuesta externa → desbloquear;
- error crítico → abrir investigación.

## 10. Fecha límite / objetivo diario

Una instrucción como:

> “Necesito que para hoy quede funcional el login de BETCA. No hagas producción.”

debe convertirse en:

```yaml
goal: login BETCA funcional
deadline: fecha/hora
production: forbidden
completion_definition:
  - tests pass
  - build pass
  - browser login pass
  - preview available
```

Forge mantiene la tarea hasta cumplir definición de terminado o llegar a un bloqueo que requiera intervención.

## 11. Memoria de decisiones

Guardar decisiones resumidas, no razonamiento privado interno.

Ejemplo:

```text
Decision: no modificar schema de auth.
Reason: problema localizado en session handling; migration innecesaria.
Evidence: test X + trace Y.
```

## 12. Conversaciones como interfaz, no como estado

Una conversación puede crear, consultar o modificar tareas, pero el estado real vive en Forge.

Ejemplo:

```text
ChatGPT:
"¿Cómo va After Eight?"
        ↓
Forge API/MCP
        ↓
tasks + checkpoints + artifacts
        ↓
respuesta actualizada
```

Esto permite usar ChatGPT, Forge Workspace o una futura interfaz móvil sin perder continuidad.

## 13. Notificaciones

Eventos que justifican notificar:

- tarea terminada;
- tarea bloqueada;
- aprobación requerida;
- error de seguridad;
- deadline en riesgo;
- deploy completado/fallido.

No enviar ruido por cada paso interno.
