# AION Forge — Security Model

## 1. Principio

No existe seguridad absoluta. Forge debe diseñarse para **reducir privilegios, limitar radio de daño, exigir verificación y hacer reversibles las acciones cuando sea posible**.

## 2. Identidad y acceso

- Usuario humano principal: Edyan.
- MFA obligatorio para consola privada.
- Sesiones con expiración y revocación.
- Roles separados para humano, supervisor, worker y servicio.
- Ningún worker recibe credenciales más amplias que las necesarias.

## 3. Home PC

Crear cuenta técnica independiente `AION-WORKER`:

- sin privilegios de administrador por defecto;
- sin acceso a documentos personales;
- sin navegador personal ni sesiones privadas;
- acceso únicamente a directorios de Forge;
- herramientas de desarrollo instaladas explícitamente;
- bloqueo de escritorio permitido;
- conexiones preferentemente salientes; no exponer RDP/VNC públicamente.

Directorio conceptual:

```text
D:\AION_FORGE\
├── repos\
├── worktrees\
├── workers\
├── artifacts\
├── logs\
├── cache\
└── runtime\
```

## 4. Principio de mínimos privilegios

Cada Task recibe capabilities explícitas.

Ejemplo:

```yaml
filesystem:
  read:
    - repos/betca/**
  write:
    - worktrees/BETCA-214/**
network:
  domains:
    - github.com
    - api.github.com
github:
  repo: betca-docente-web
  permissions:
    - read
    - create_branch
    - create_pr
production_deploy: false
secrets: []
```

## 5. Scope Guard

Antes de commit/PR:

- comparar `git diff` contra `allowed_paths`;
- bloquear archivos prohibidos;
- limitar número de archivos si la Task lo exige;
- detectar dependencias nuevas;
- detectar cambios de schema/migrations;
- detectar archivos de secretos.

Una violación debe cambiar la tarea a `BLOCKED_SCOPE_VIOLATION`.

## 6. Secretos

Reglas:

- nunca guardar API keys/tokens en Git;
- nunca registrar secretos en logs;
- usar referencias a secret manager;
- tokens de corta duración cuando sea posible;
- rotación y revocación;
- scopes mínimos por servicio;
- producción separada de desarrollo.

## 7. Git y producción

Para repos críticos:

- `main` sin push directo de agentes;
- PR obligatorio;
- status checks obligatorios;
- force push deshabilitado;
- cambios de producción requieren política de aprobación;
- deploy preview separado de producción.

## 8. Niveles de autonomía

| Nivel | Comportamiento |
|---|---|
| `AUTO` | puede ejecutar sin aprobación humana |
| `SUPERVISED` | ejecuta pero requiere aprobación para finalizar acción sensible |
| `MANUAL` | solo prepara propuesta/artefactos |

Política inicial sugerida:

| Acción | Nivel inicial |
|---|---|
| leer repo | AUTO |
| crear worktree/branch | AUTO |
| ejecutar tests | AUTO |
| crear preview | AUTO |
| abrir PR | AUTO |
| merge main | SUPERVISED |
| deploy producción | SUPERVISED |
| escribir notas académicas reales | SUPERVISED |
| modificar schema de producción | SUPERVISED/MANUAL |
| borrar datos/repo | MANUAL |
| cambiar secretos | MANUAL |

## 9. Browser y desktop control

Usar orden de preferencia:

1. API estructurada;
2. MCP/integración oficial;
3. Playwright/DOM;
4. computer-use visual;
5. coordenadas de mouse.

Control visual debe operar en cuenta/sesión técnica, no sobre el escritorio personal del usuario.

Dominios permitidos deben declararse por task o proyecto.

## 10. Datos académicos y personales

Para escrituras de alto impacto:

- leer fuente autorizada;
- mapear entidad por identificador estable cuando exista;
- comparar valor fuente vs valor destino;
- detenerse ante discrepancia;
- conservar evidencia de validación;
- requerir aprobación humana inicialmente.

Ejemplo de calificación:

```text
SOURCE Juan Perez = 4.5
TARGET Juan Perez = 4.5
MATCH = true
```

No confirmar envío hasta existir respuesta verificable de la plataforma.

## 11. Sandbox

Código no confiable o tareas experimentales deben ejecutarse en sandbox/VM/contenedor cuando sea posible.

No montar credenciales de producción dentro de sandboxes de código no confiable.

## 12. Observabilidad y auditoría

Registrar eventos relevantes:

```text
actor
agent
worker
task_id
correlation_id
action
tool
resource
result
timestamp
risk
approval_id
```

No registrar chain-of-thought privada. Sí registrar planes resumidos, decisiones operativas, inputs/outputs técnicos y evidencia necesaria para auditoría.

## 13. Kill switch

Debe existir capacidad para:

- impedir nuevos jobs;
- cancelar tareas activas;
- cortar automatización de teclado/mouse;
- detener procesos locales gestionados;
- invalidar sesiones de worker;
- revocar credenciales temporales cuando aplique.

## 14. Límites por tarea

Cada tarea puede definir:

- tiempo máximo;
- presupuesto máximo;
- número máximo de archivos;
- número máximo de acciones de browser;
- dominios permitidos;
- CPU/GPU máximos;
- permisos de escritura;
- permisos de despliegue.

## 15. Regla de seguridad operacional

Si una acción es irreversible, de alto impacto o no puede validarse correctamente, Forge debe preferir `WAITING_EDYAN` antes que adivinar.
