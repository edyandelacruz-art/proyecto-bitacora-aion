# AION Architecture & Monorepo Structure

El repositorio de AION está estructurado como un monorepositorio modular mediante npm workspaces.

```
apps/
  aion-aegis/       # Aplicación independiente de vida personal & nutrición inteligente
  aion-core/        # Superadministrador y coordinador cognitivo del ecosistema

packages/
  aion-design-tokens/ # CSS variables, colores AION y tipografía
  aion-protocol/      # Bus de comunicación pub-sub y AionAppRegistry
  aion-manifest/      # Tipos y esquemas de AionManifest
  aion-memory/        # Motor de almacenamiento persistente etiquetado
  aion-agents/        # Especialistas multiagente (Nutrición, Despensa, Plan Vivo)
  shared-types/       # Interfaces globales de TypeScript
```
