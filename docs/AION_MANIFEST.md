# AION Manifest Specification

Cada aplicación del Ecosistema AION expone un archivo de manifiesto tipado con sus capacidades y permisos.

```typescript
export interface AionManifest {
  app_id: string;
  name: string;
  version: string;
  description: string;
  capabilities: string[];
  agents: string[];
  events_published: string[];
  events_consumed: string[];
  tools_available: string[];
  required_permissions: string[];
  protocol_version: string;
}
```
