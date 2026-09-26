# AION Forge — Master Blueprint

## 1. Propósito

AION Forge es un entorno privado de desarrollo, operación y coordinación multiagente. Debe permitir que Edyan formule objetivos en lenguaje natural y que un Supervisor convierta esos objetivos en planes, tareas, ejecuciones, revisiones y resultados trazables.

La plataforma debe reducir la dependencia de una sola herramienta o proveedor. Codex, Gemini, Claude, Antigravity, modelos locales, scripts deterministas y herramientas externas son **workers intercambiables**, no el sistema completo.

## 2. Autoridad

Jerarquía obligatoria:

1. **Edyan** — autoridad final sobre objetivos, producción, secretos, datos sensibles y acciones irreversibles.
2. **AION Forge Supervisor** — coordinador lógico principal; interpreta, divide, enruta, verifica y consolida.
3. **Specialist Leads** — arquitectura, código, diseño, QA, datos, ciencia, despliegue, seguridad.
4. **Workers** — Codex, Claude Code, Gemini/Antigravity, modelos locales, scripts, Playwright, Godot, herramientas CLI y APIs.

Ningún worker individual es autoridad final sobre producción.

## 3. Arquitectura lógica

```text
Edyan / móvil / web
        │
        ▼
AION Forge Console
        │
        ▼
Supervisor
        │
 ┌──────┼───────────────┐
 ▼      ▼               ▼
Planner Workers      Reviewers
        │
        ▼
Capability Router
        │
 ┌──────┼─────────────────────────────────────┐
 ▼      ▼          ▼          ▼              ▼
Codex  Gemini     Claude    Local/CLI     Deterministic
                                           scripts/tests
        │
        ▼
Tool / MCP / API Bus
        │
 ┌──────┼─────────────┬────────────┬──────────────┐
 ▼      ▼             ▼            ▼              ▼
GitHub Vercel      Supabase     Browser         Home PC
                                                Worker
```

## 4. Home PC como nodo de ejecución

El computador potente de casa funcionará como **AION Dev Node**.

Capacidades previstas:

- repositorios locales sincronizados;
- git worktrees por tarea;
- Codex / agentes CLI;
- Antigravity / Gemini;
- Godot;
- Playwright / navegador;
- Python / R / Node;
- Docker si aplica;
- bioinformática y pipelines científicos;
- captura de pantalla y grabación;
- ejecución de tests y builds;
- almacenamiento temporal de artefactos.

El nodo debe operar con una cuenta técnica separada y permisos mínimos.

## 5. Unidad de trabajo

Toda solicitud material se convierte en una `Task` persistente.

Ejemplo:

```yaml
task_id: PRED-042
project: predictive
goal: Corregir insufficient coverage
base_branch: main
allowed_paths:
  - src/data/**
  - src/coverage/**
  - tests/**
forbidden_paths:
  - .env*
  - production/**
allow_dependencies: false
allow_database_changes: false
allow_production_deploy: false
required_checks:
  - tests
  - lint
  - build
  - browser_qa
```

La tarea debe conservar estado, evidencia, logs, artefactos, decisiones y checkpoints hasta terminar.

## 6. Aislamiento de desarrollo

Regla obligatoria para cambios de código:

```text
repo base
  ↓
branch de tarea
  ↓
git worktree dedicado
  ↓
worker
  ↓
scope guard
  ↓
tests
  ↓
review independiente
  ↓
Pull Request
```

No trabajar directamente sobre `main` salvo operación explícitamente autorizada.

## 7. Capability Router

Forge debe seleccionar worker según:

- complejidad;
- costo;
- disponibilidad/cuota;
- lenguaje/stack;
- necesidad de GUI;
- necesidad de contexto amplio;
- riesgo;
- privacidad;
- capacidad local requerida.

Ejemplo conceptual:

| Trabajo | Worker preferido | Fallback |
|---|---|---|
| cambio de código complejo | Codex | Claude Code / Gemini |
| arquitectura | Supervisor + reviewer | Claude / Gemini |
| refactor mecánico | script/local | modelo barato |
| pruebas web | Playwright | computer-use |
| Godot | Home PC + Codex | agente alterno |
| análisis científico | Python/R + agente | worker científico |
| diseño | Stitch/SkillUI/UIUX | agente visual |

## 8. Principio de verificación independiente

Un agente que implementa no debe considerarse suficiente para afirmar éxito.

Patrón mínimo:

```text
Implementer
   ↓
Deterministic checks
   ↓
Independent reviewer
   ↓
Runtime/browser/game verification
   ↓
Result
```

## 9. Desarrollo web

Flujo objetivo:

```text
requerimiento
→ arquitectura
→ branch/worktree
→ implementación
→ tests/lint/build
→ browser QA
→ preview Vercel
→ revisión
→ aprobación
→ producción
```

Integraciones previstas:

- GitHub;
- Vercel;
- Supabase/Postgres;
- Netlify cuando aplique;
- Playwright;
- Stitch;
- SkillUI;
- Impeccable;
- UI UX Pro Max.

## 10. Game Development / After Eight

Forge debe soportar un `Game QA Agent` capaz de:

- ejecutar Godot;
- lanzar builds o escenas;
- reproducir secuencias deterministas;
- controlar input cuando corresponda;
- capturar video, screenshots y logs;
- observar problemas visuales;
- correlacionar errores con frames;
- crear tareas de corrección;
- pedir a un coding worker implementar;
- volver a ejecutar el mismo escenario;
- comparar antes/después.

No considerar un bug corregido porque el coding worker lo afirme; se requiere nueva ejecución verificable.

## 11. Browser / Desktop Automation

Orden de preferencia:

1. API oficial.
2. MCP / integración estructurada.
3. DOM / Playwright.
4. Accessibility tree / semántica de UI.
5. Computer-use visual.
6. Coordenadas de mouse como último recurso.

Para operaciones académicas o de alto impacto, validar fuente y destino antes de confirmar escritura.

## 12. Memoria

Forge debe separar:

- **Project Memory** — arquitectura, contratos, restricciones.
- **Task Memory** — estado y checkpoints.
- **Decision Memory** — decisiones y justificación resumida.
- **Operational Memory** — errores, builds, deploys, incidentes.
- **Knowledge Memory** — documentación, repositorios, skills y referencias.

La memoria operacional no depende de una conversación de ChatGPT.

## 13. Concurrencia

Forge debe admitir múltiples ejecuciones en paralelo con aislamiento por worktree/workspace. El scheduler limita concurrencia según CPU, RAM, GPU, navegador y tipo de proceso.

Ejemplo:

```text
Worker 01 → BETCA auth
Worker 02 → After Eight QA
Worker 03 → Predictive coverage
Worker 04 → Hilo pipeline
Browser 01 → UI regression
Reviewer 01 → PR audit
```

## 14. Automatización

Tipos de disparador:

- manual desde Forge/ChatGPT;
- programación horaria;
- push/PR en GitHub;
- deploy en Vercel;
- error/alerta;
- aparición de nuevo dataset;
- condición externa;
- continuación de una tarea bloqueada.

## 15. Estados de capacidad

Toda capacidad Forge se clasifica como:

- `REAL` — ejecutable y verificada;
- `PARTIAL` — ejecutable con limitaciones;
- `MOCK` — simulada;
- `PLANNED` — especificada, no implementada;
- `BLOCKED` — depende de acceso o tecnología ausente.

## 16. Objetivo de producto

El usuario final no debe administrar agentes manualmente para cada tarea.

La experiencia objetivo es:

> “Necesito que hoy quede funcional X. No hagas producción.”

Forge debe traducir eso a tareas, trabajadores, pruebas, checkpoints, revisión y entrega, mostrando complejidad operativa solo cuando el usuario quiera inspeccionarla.
