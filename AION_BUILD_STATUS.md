# AION BUILD STATUS — ESTADO HONESTO Y AUDITABLE

**Actualizado:** 2026-07-28  
**Fuente normativa:** `AION_AEGIS_MASTER_BLUEPRINT.md`  
**Auditoría de agentes:** `AION_AEGIS_AGENT_COVERAGE_AUDIT.md`  
**Protocolo de interacción:** `PROTOCOLO_BITACORA_ACTIVADOR.md`

## Leyenda obligatoria

- `REAL`: implementado, conectado, persistente dentro de su alcance declarado y probado con evidencia reproducible.
- `PARTIAL`: existe una implementación útil, pero todavía no cumple el contrato completo, depende de almacenamiento/proveedores provisionales o le faltan pruebas/endurecimiento.
- `MOCK`: simulado, hardcodeado, metadata-only o interfaz sin ejecución real equivalente.
- `PLANNED`: definido en Blueprint, aún sin implementación suficiente.

> **Regla:** no marcar `REAL` por existir una pantalla, una clase, un nombre de agente o un test que únicamente compruebe que no lanza excepción. El estado debe corresponder al comportamiento real.

---

# 1. Núcleo / arquitectura

| Componente | Estado | Evidencia / realidad actual |
|---|---|---|
| Monorepo workspaces | **REAL** | `apps/*`, `packages/*` y dependencias compartidas |
| AION Protocol / EventBus básico | **PARTIAL** | Existe publicación/suscripción, pero falta runtime completo de request/dispatch/ack/completed/failed/needs_confirmation y contratos endurecidos |
| Aegis Memory Store | **PARTIAL** | Persistencia y modelos existen, pero el producto aún depende de almacenamiento local/provisional; falta backend durable multiusuario productivo |
| Universal Ledger | **PARTIAL** | Existe trazabilidad básica; falta garantizar append-only durable, spans completos, reconstrucción y auditoría de todas las operaciones |
| AION Aegis Core | **PARTIAL** | Blueprint definido; la UI actual usa todavía `AionCoreSuperAgent` prototípico y mezcla AION Core global con Aegis Core |
| Agent Registry | **PARTIAL** | Registra 16 metadata entries; no representa aún todos los especialistas del Blueprint |
| Agent Runtime | **MOCK/PARTIAL** | `invokeAgent()` registra y actualmente devuelve el payload de entrada como output; no despacha todavía implementaciones especializadas reales |
| Capability Resolver | **PLANNED/PARTIAL** | Hay detecciones aisladas, no resolución robusta por capacidades |
| Intent Resolver multidominio | **MOCK/PARTIAL** | El router actual usa principalmente regex/palabras clave |
| User Model & Profile | **PARTIAL** | Perfiles y preferencias existen; falta aprendizaje longitudinal completo, curación y edición/auditoría madura |
| Evidence & Confidence | **PARTIAL** | Tipos existen; no todos los flujos los aplican de forma consistente |
| Autonomy Loop | **PARTIAL** | Existen acciones y routing prototípicos; no está implementado completo OBSERVE→INTERPRET→DECIDE→ACT→VERIFY→AUDIT→LEARN |
| Intervention Policy | **PLANNED/PARTIAL** | No existe aún el agente dedicado con política real de interrupción |
| Cross-domain consistency | **PLANNED/PARTIAL** | Hay algunas transacciones cruzadas, no un verificador transversal completo |
| Safety & Permission runtime | **PLANNED/PARTIAL** | Hay metadatos/policies, falta enforcement completo y agente dedicado |
| Backend productivo | **PARTIAL** | Servidor/persistencia local útil; falta backend durable, auth/aislamiento, producción, backups, observabilidad y seguridad completa |
| Object storage | **PARTIAL** | URLs/blobs previstos; falta storage productivo completo para imágenes/documentos |

---

# 2. Fallas conocidas que impiden considerar el núcleo finalizado

1. `AionCoreSuperAgent` todavía usa routing por regex/palabras clave.
2. Si falta un monto financiero, el prototipo puede introducir `20000` como fallback.
3. El prototipo puede asignar cantidades hardcodeadas al inventario.
4. Si no detecta dominio puede devolver `NUTRITION` por defecto.
5. `AgentRuntime.invokeAgent()` no ejecuta aún la implementación del agente seleccionado: devuelve el payload como output.
6. La UI Aegis actual llama a `AionCoreSuperAgent`, mezclando la frontera AION Core global vs AION Aegis Core.
7. `VisionService` no realiza todavía inferencia multimodal real: usa descripción textual y casos hardcodeados.
8. Algunos estados metabólicos todavía muestran números o categorías con más certeza de la justificable.
9. `getCurrentEnergyBalance()` contiene gasto fijo de `2100` kcal.
10. La experiencia principal actual muestra un grid denso de módulos; no cumple todavía la UX orgánica y progresiva definida.

Estas fallas deben quedar cubiertas por tests de regresión antes de elevar estado.

---

# 3. Cobertura multiagente

Consultar `AION_AEGIS_AGENT_COVERAGE_AUDIT.md` para la lista completa.

| Capa | Estado actual | Objetivo |
|---|---|---|
| Aegis Core visible | **PARTIAL** | Orquestador interno real, multimodal, multi-dominio |
| Supervisores de módulo | **PARTIAL** | Implementaciones ejecutables, no solo metadata |
| Especialistas de Nutrición | **PLANNED/PARTIAL** | 10 roles definidos en Blueprint |
| Especialistas de Metabolismo | **PLANNED/PARTIAL** | 10 roles definidos |
| Especialistas de Sueño | **PLANNED/PARTIAL** | 10 roles definidos |
| Especialistas de Actividad | **PLANNED/PARTIAL** | 10 roles definidos |
| Especialistas de Hidratación | **PLANNED/PARTIAL** | 5 roles definidos |
| Especialistas Estado/Energía | **PLANNED/PARTIAL** | 7 roles definidos |
| Especialistas Medicación | **PLANNED/PARTIAL** | 6 roles definidos |
| Especialistas Síntomas | **PLANNED/PARTIAL** | 8 roles definidos |
| Especialistas Cuerpo | **PLANNED/PARTIAL** | 6 roles definidos |
| Especialistas Hábitos | **PLANNED/PARTIAL** | 7 roles definidos |
| Especialistas Inventario/Hogar | **PLANNED/PARTIAL** | 10 roles definidos |
| Especialistas Plan Vivo | **PLANNED/PARTIAL** | 10 roles definidos |
| Physiology Expert | **PARTIAL** | agente ejecutable + herramientas + tests + provenance |
| Biochemistry Expert | **PARTIAL** | agente ejecutable + herramientas + tests + provenance |
| Culinary/Recipe Expert Group | **PARTIAL** | varios agentes especializados; actualmente hay `RecipeSkill` |
| Evidence & Uncertainty Agent | **PLANNED/PARTIAL** | verificación transversal real |
| Temporal Reasoning Agent | **PLANNED/PARTIAL** | contexto temporal universal |
| Personalization Agent | **PARTIAL** | aprendizaje y modelo longitudinal auditables |
| Memory Curator Agent | **PLANNED** | curación de memoria estable/episódica/patrón |
| Intervention Policy Agent | **PLANNED** | decide preguntar/proponer/guardar silencio |
| Cross-Domain Consistency Agent | **PLANNED/PARTIAL** | contradicciones entre módulos |
| Universal Audit Agent | **PARTIAL** | auditoría completa de acciones/resultados |
| Safety & Permission Agent | **PLANNED/PARTIAL** | enforcement real |
| Report & Export Agent | **PARTIAL** | motores existen; falta agente completo |

---

# 4. Módulos canónicos

Una pantalla o almacenamiento no convierte un módulo en `REAL` completo. Para ser `REAL` según Blueprint debe tener: contrato, persistencia durable dentro del alcance, supervisor ejecutable, especialistas relevantes, eventos, ledger, auditoría, corrección, dashboard, chat contextual, exportación y tests.

| Módulo | Datos/persistencia | Dashboard | Supervisor/Agentes | Estado global |
|---|---|---|---|---|
| Alimentación/Nutrición | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Metabolismo/Fisiología | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Sueño/Recuperación | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Actividad/Ejercicio | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Hidratación | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Energía/Ánimo/Hambre/Foco | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Medicación/Suplementos | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Dolor/Síntomas | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Peso/Medidas/Cuerpo | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Hábitos/Rutinas | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Despensa/Compras/Hogar | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Plan Vivo | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Mi Día / proyección Ledger | PARTIAL | PARTIAL | Transversal PARTIAL | **PARTIAL** |

---

# 5. Inteligencia visual

| Capacidad | Estado | Nota |
|---|---|---|
| Adjuntar/transportar referencia de imagen | **PARTIAL** | Flujo de datos existe en piezas |
| Clasificación de escena real desde píxeles | **MOCK/PARTIAL** | `VisionService` usa hoy keywords de texto |
| Food detection real desde foto | **MOCK/PARTIAL** | Casos hardcodeados |
| Portion estimation real | **MOCK/PARTIAL** | Rangos predefinidos en flujo actual |
| Receipt vision real | **PLANNED/PARTIAL** | Contratos/roles definidos |
| Fridge/pantry vision real | **PLANNED/PARTIAL** | Contratos/roles definidos |
| Menu/label real | **PLANNED/PARTIAL** | Contratos/roles definidos |
| Evidence/provenance visual | **PARTIAL** | Tipos existen; falta pipeline multimodal real |

Objetivo obligatorio: proveedor multimodal real + outputs estructurados + confidence + micro-pregunta material + cálculo determinista + verificación.

---

# 6. Nutrición, metabolismo y ciencia

| Capacidad | Estado | Nota |
|---|---|---|
| NutrientCalculationEngine | **PARTIAL** | Cálculo determinista existe, ampliar base de alimentos, unidades, cobertura y tests |
| Preparación total vs porción | **PARTIAL** | Modelos/lógica existen en piezas; auditar todos los caminos |
| RecipeSkill | **PARTIAL** | Recomendaciones actuales limitadas y algunas recetas siguen predefinidas |
| LanguageEngine bioquímico | **PARTIAL** | Buenas explicaciones, pero no equivale al conjunto de agentes bioquímicos/fisiológicos |
| Estado metabólico temporal | **PARTIAL** | Existe; retirar falsa precisión y ampliar evidencia/contexto |
| Balance energético | **MOCK/PARTIAL** | aún contiene `burnedKcal: 2100` fijo |

---

# 7. Exportaciones

| Formato | Estado | Nota |
|---|---|---|
| XLSX | **PARTIAL** | Existe `XlsxExporter`; verificar fidelidad de 24 hojas, fórmulas, estilo, plantilla y datos reales antes de REAL |
| PDF | **PARTIAL** | Existe salida HTML/reportable; verificar generación PDF real end-to-end |
| DOCX | **PARTIAL** | Verificar archivo DOCX real, no solo contenido/plantilla |
| CSV/JSON | **PARTIAL/REAL dentro de alcance** | Exportadores existentes; validar esquema y cobertura universal |

---

# 8. UX / Dashboards

| Superficie | Estado | Nota |
|---|---|---|
| Dark premium base | **REAL visualmente** | `#070709` + violeta está aplicado |
| Identidad oficial AION Aegis | **REAL asset** | `apps/aion-aegis/public/brand/aion-aegis-logo-dark.svg` |
| Aegis Core conversacional | **PARTIAL** | existe hub, pero usa agente/global naming incorrecto y necesita UX orgánica |
| Dashboard global | **PARTIAL** | existe, pero está demasiado denso y debe pasar a progressive disclosure |
| Navegación de todos los módulos | **PARTIAL** | implementación actual visible en `App.tsx` expone pocas superficies principales |
| Mobile-first orgánico | **PARTIAL** | debe reconstruirse visualmente sin romper lógica |
| Chats contextuales por módulo | **PARTIAL/PLANNED** | Blueprint los exige; auditar implementación por módulo |
| Action Receipts | **PARTIAL** | existen superficies, falta verificación universal real |
| “¿Por qué Aegis cree esto?” | **PLANNED/PARTIAL** | debe conectarse a provenance/agents/ledger |
| Transparencia de agentes | **PLANNED** | oculto por defecto, drawer opcional |

La nueva especificación visual obligatoria vive en `AION_AEGIS_ORGANIC_UX_STITCH_SPEC.md`.

---

# 9. Prioridades inmediatas

## P0 — Veracidad y fronteras
- separar visual y técnicamente AION Core global de AION Aegis Core;
- reemplazar defaults inventados;
- eliminar dominio nutrición por defecto;
- corregir falsa confirmación de acciones;
- reemplazar VisionService mock por adapter multimodal real;
- eliminar gasto fijo `2100`;
- mantener este status honesto.

## P1 — Runtime multiagente real
- dispatcher real;
- capability resolver;
- supervisors ejecutables;
- especialistas reales en los caminos cotidianos prioritarios;
- Worker → Verifier → Supervisor → Audit cuando aplique;
- correlation IDs y spans.

## P2 — UX orgánica
- Aegis Core como superficie conversacional principal;
- no grid permanente de 12 módulos;
- progressive disclosure;
- módulos resumidos y expandibles;
- interacción rica con voz/foto/archivos/cards/bottom sheets/action receipts;
- sidebar/drawer colapsable;
- mobile vertical y respirable.

## P3 — Backend/productización
- persistencia durable multiusuario;
- auth/autorización;
- object storage;
- backups;
- observabilidad;
- seguridad;
- tests E2E.

---

# 10. Regla final

> **AION Aegis no se considera terminado porque se pueda navegar. Se considera más cerca de terminado cuando el usuario vive, habla, toma una foto o corrige un dato y la orquesta de agentes convierte eso en estado, memoria, cálculo, acción, verificación y auditoría sin fricción ni falsa precisión.**
