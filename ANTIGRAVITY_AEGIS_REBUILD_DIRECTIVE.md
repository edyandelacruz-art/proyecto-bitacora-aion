# ANTIGRAVITY — DIRECTIVA MAESTRA DE RECONSTRUCCIÓN AION AEGIS

**Tipo:** orden de implementación técnica completa.  
**No es un prompt para diseño visual.**  
**Objetivo:** construir AION Aegis sobre el repositorio actual, recuperando la potencia funcional del AION legacy, la profundidad de la Bitácora Magnum y la nueva arquitectura Aegis multiagente, sin romper las piezas REAL ya existentes.

---

# 0. Orden de lectura obligatorio

Antes de escribir código, leer completos y en este orden:

1. `AION_AEGIS_MASTER_BLUEPRINT.md`
2. `AION_LEGACY_REFERENCE_FOR_AEGIS.md`
3. `PROTOCOLO_BITACORA_ACTIVADOR.md`
4. `AION_AEGIS_AGENT_COVERAGE_AUDIT.md`
5. `AION_AEGIS_UI_ARCHITECTURE.md`
6. `AION_BUILD_STATUS.md`
7. `AGENTS.md`
8. código actual afectado
9. tests existentes

Después producir una auditoría técnica breve del estado inicial antes de modificar.

NO reconstruir desde cero.

NO reducir alcance porque exista código incompleto.

NO considerar `metadata`, nombres de clases o pantallas como implementación real.

---

# 1. Definición del producto

AION Aegis es una bitácora personal inteligente, multimodal, contextual, interactiva, auditada y progresivamente autónoma.

El usuario debe poder vivir normalmente y expresar hechos en lenguaje natural:

- `me levanté`;
- `dormí mal`;
- `me comí esto`;
- enviar una fotografía;
- `tomé dos vasos de agua`;
- `caminé una hora`;
- `me duele la espalda`;
- `compré esto`;
- enviar un recibo;
- `qué puedo comer`;
- `mañana almuerzo afuera`;
- `qué hace falta en la casa`;
- `hazme un reporte`.

Aegis debe convertir esas entradas en:

```text
interpretación
→ contexto
→ dominios afectados
→ análisis especializado
→ dato estructurado
→ cálculo
→ memoria
→ planificación
→ acciones autorizadas
→ verificación
→ auditoría
→ respuesta única
```

El usuario NO debe elegir agentes.

El usuario NO debe elegir manualmente todos los módulos afectados.

---

# 2. Fronteras de AION

Distinguir estrictamente:

## AION Core global

Orquesta aplicaciones AION independientes.

Ejemplos futuros:

- AION Aegis;
- AION Edu;
- AION Studio;
- AION Ops;
- futuras AION.

## AION Aegis Core

Orquestador soberano interno de Aegis.

NO mezclar ambos en nombres, imports, UI o responsabilidades.

El código legacy `AionCoreSuperAgent` debe migrarse o deprecarse correctamente cuando se construya el `AegisCoreAgent` real.

Aegis puede emitir eventos hacia AION Core global, pero no debe apropiarse de contabilidad financiera global, correo, educación, creación multimedia u operaciones pertenecientes a otras AION.

---

# 3. Estado actual que NO debe sobreestimarse

Según la auditoría real del repositorio:

- `AgentRegistry` registra metadata parcial;
- `AgentRuntime.invokeAgent()` todavía no es un runtime real completo;
- muchos especialistas del Blueprint no existen como implementaciones ejecutables;
- el router prototípico usa regex/palabras clave;
- existen defaults inventados en el prototipo financiero/inventario;
- VisionService actual no constituye visión multimodal real;
- existen valores fisiológicos y gasto energético demasiado hardcodeados;
- backend productivo sigue parcial;
- UI actual usa un grid denso incompatible con la UX final.

No marcar ninguno de estos componentes `REAL` hasta corregirlo y demostrarlo con pruebas reproducibles.

---

# 4. Filosofía multiagente obligatoria

La estructura objetivo es:

```text
Usuario
  ↓
Aegis Core Agent
  ↓
Intent + Context + Capability Resolution
  ↓
Module Supervisor(s)
  ↓
Specialist Agents
  ↓
Tools / Engines / Knowledge / Data
  ↓
Verifier(s)
  ↓
Module Supervisor
  ↓
Cross-domain checks cuando aplique
  ↓
Persistencia + Ledger + Eventos
  ↓
Audit
  ↓
Aegis Core
  ↓
Usuario
```

Se desea mucha especialización interna.

La redundancia correcta es:

```text
Worker
→ Verifier
→ Supervisor
→ Auditor si el riesgo/impacto lo amerita
```

La redundancia incorrecta es que dos módulos sean propietarios de la misma verdad.

---

# 5. Requisitos de un agente REAL

Un agente solo puede marcarse REAL si tiene:

```text
agentId
name
role
domain
version
promptVersion o system instruction versionada
capabilities
acceptedInput schema
output schema
tools reales
read permissions
write permissions
memory scope
risk level
confirmation policy
confidence policy
fallback policy
implementation executable
structured result
error handling
telemetry
ledger trace
tests
```

Un objeto `AgentMetadata` sin implementación NO es un agente REAL.

Un método que devuelve el mismo input NO es ejecución.

Una función helper puede ser una tool/engine; no convertir todo en agente artificialmente. Pero cada especialista definido como agente en el Blueprint debe tener conducta propia si se mantiene como agente.

---

# 6. Agent Runtime real

Construir o evolucionar `AgentRuntime` para soportar realmente:

- registry;
- capability lookup;
- implementations registry;
- invocation;
- structured inputs/outputs;
- sync/async;
- parallel execution;
- sequential dependencies;
- timeouts;
- retry policy;
- cancellation;
- circuit breaker;
- tool execution;
- permission enforcement;
- confirmation requirements;
- confidence thresholds;
- verifier invocation;
- supervisor aggregation;
- result provenance;
- correlation/session/turn IDs;
- tracing;
- metrics;
- failure propagation;
- partial success;
- audit receipt;
- cost/latency budgets;
- prompt/agent versioning.

`invokeAgent()` debe localizar la implementación real del `agentId` y ejecutarla.

Nunca devolver input como output para simular éxito.

---

# 7. Capability Resolver + Intent Resolver

Eliminar dependencia central de regex simples.

El sistema debe poder interpretar una entrada como:

> `Compré cuatro latas de atún por 28.000 y me comí una al llegar.`

como múltiples hechos relacionados:

```text
purchase
inventory intake
food consumption
possible financial cross-app event
meal timing
nutrition analysis
live plan impact
ledger
```

Resolver intención mediante una combinación robusta de:

- model structured classification;
- deterministic extraction;
- schemas;
- domain policies;
- confidence;
- memory/context;
- fallback seguro.

Regex puede existir como helper de alta precisión, NO como cerebro principal.

Regla:

```text
Missing != default
```

No inventar monto, cantidad, fecha, alimento, peso o horario.

---

# 8. Aegis Core Agent

Debe poder:

- recibir texto;
- recibir voz transcrita;
- recibir imagen;
- recibir documento;
- recibir recibo;
- recibir etiqueta/menu;
- entender contexto temporal;
- entender lugar cuando esté autorizado;
- consultar User Model;
- consultar memoria;
- consultar el día actual;
- detectar múltiples dominios;
- seleccionar supervisores;
- seleccionar expertos transversales;
- paralelizar cuando sea seguro;
- esperar dependencias cuando sea necesario;
- pedir una micro-pregunta si falta dato material;
- consolidar respuestas;
- verificar writes;
- emitir Action Receipt;
- aprender de correcciones;
- activar seguimiento/autonomía;
- no molestar innecesariamente;
- responder como una sola inteligencia.

Aegis Core tiene competencia general alta, pero usa especialistas para profundidad y escrituras relevantes.

---

# 9. Expertos transversales a implementar

Como mínimo:

## PhysiologyExpertAgent

- digestión;
- absorción;
- respuesta posprandial;
- regulación energética;
- hambre/saciedad;
- sueño/recuperación;
- ejercicio;
- hidratación;
- fatiga;
- adaptación.

## BiochemistryExpertAgent

- glucólisis;
- glucogénesis;
- glucogenólisis;
- gluconeogénesis;
- lipogénesis;
- lipólisis;
- beta-oxidación;
- cetogénesis;
- metabolismo de aminoácidos;
- ciclo de Krebs;
- quilomicrones/transporte lipídico;
- insulina/glucagón;
- lactato/LDH;
- utilización de sustratos.

## EvidenceUncertaintyAgent

- clasificar evidencia;
- calibrar confianza;
- detectar falsa precisión;
- impedir que estimado parezca medido.

## TemporalReasoningAgent

- zona horaria;
- hoy/ayer;
- última ingesta;
- última actividad;
- sueño;
- ventanas;
- intervalos;
- vencimientos;
- patrones por día;
- eventos esperados ausentes.

## UserModelPersonalizationAgent

- rutinas;
- preferencias;
- rechazo;
- horarios;
- cocina;
- formatos;
- nivel técnico;
- tolerancia a notificaciones;
- compras;
- objetivos;
- contexto del hogar.

## MemoryCuratorAgent

- decidir qué persistir;
- evitar falsa memoria;
- resolver hechos obsoletos;
- separar episodic/semantic/pattern memory.

## InterventionPolicyAgent

Decidir:

```text
ask
recommend
remind
wait
stay silent
```

según relevancia, urgencia, confianza, preferencias y frecuencia de interrupciones.

## CrossDomainConsistencyAgent

Buscar contradicciones:

- inventario negativo;
- receta sin existencias;
- registros duplicados;
- actividad durante sueño confirmado;
- dos horarios incompatibles;
- alimento agotado usado en plan;
- corrección no propagada.

## AuditAgent

- intención;
- agentes;
- tools;
- fuentes;
- datos usados;
- writes;
- eventos;
- resultado;
- errores;
- rollback.

## SafetyPermissionAgent

- scopes;
- permisos;
- datos sensibles;
- confirmaciones;
- acciones externas;
- eliminación;
- exportación;
- integraciones.

## ReportExportAgent

- dataset canónico;
- XLSX;
- PDF;
- DOCX;
- CSV;
- JSON;
- tabla UI;
- preferencias de formato.

---

# 10. Grupo culinario

Implementar especialistas definidos:

- `RecipeGenerationAgent`;
- `RecipeAdaptationAgent`;
- `IngredientSubstitutionAgent`;
- `CulinaryTechniqueAgent`;
- `MealPrepAgent`;
- `BatchCookingAgent`;
- `FoodSafetyStorageGuidanceAgent`;
- `LeftoversOptimizationAgent`.

Todos consultan inventario real, preferencias, equipo, tiempo, objetivo y restricciones.

No hardcodear solamente dos recetas.

---

# 11. Módulo Alimentación / Nutrición

Supervisor:

`NutritionSupervisorAgent`

Especialistas mínimos:

1. `MealInputInterpreterAgent`
2. `FoodVisionAgent`
3. `MenuAndLabelReaderAgent`
4. `PortionEstimationAgent`
5. `FoodResolutionAgent`
6. `NutrientCalculationAgent`
7. `MealContextAgent`
8. `DietaryPlanningAgent`
9. `EatingPatternAgent`
10. `NutritionAuditAgent`

## Recuperar profundidad del AION legacy

El antiguo módulo manejaba conceptualmente:

```text
kcal
quality signal
pertinence
biochemistry
metabolic routes
digestion
components/allergens
heaviness
synergies
cross-module links
kcal estimate range
recognized dish
canon gaps
```

El nuevo módulo debe preservar esa riqueza con un modelo mejor estructurado.

## Contrato de comida

Debe diferenciar:

- evidencia original;
- preparación completa;
- porción consumida;
- alimentos/ingredientes;
- técnica culinaria;
- cantidad literal del usuario;
- estimación min/likely/max;
- fuente de estimación;
- nutrients;
- confidence;
- assumptions;
- user confirmation;
- corrections;
- remaining prepared portions;
- inventory effects.

## M2 Nutrición PhD

Recuperar del protocolo Drive:

### Ingesta cruda literal

No resumir destruyendo detalle.

### kcal/macros por ítem

Rango + supuestos + confianza.

### Electrolitos/micronutrientes

Solo cuando exista fuente de datos suficiente.

### Calidad biológica

Cuando proceda y la base de datos lo soporte.

### Rutas metabólicas

Con mecanismos y enzimas cuando el usuario pida modo técnico o sea útil.

### Sinergias/antagonismos

Relacionar con contexto real.

### Digestión 0–6 h

Explicación educativa + estimación individual claramente diferenciadas.

### Perspectiva temporal

24–72 h solo cuando tenga sentido, sin convertir hipótesis en predicción clínica.

### Anti-huecos

Preguntar solo datos que cambien materialmente el resultado.

### QC nutricional

Verificar:

- porciones;
- rangos;
- duplicados;
- sums;
- evidence;
- cross-domain effects;
- inventory transaction;
- claims.

---

# 12. Visión real

Reemplazar la inferencia hardcodeada de `VisionService`.

Construir provider abstraction:

```text
VisionProvider
  analyzeScene()
  detectObjects()
  readText()
  detectFoods()
  estimatePortions()
  return structured uncertainty
```

Soportar:

- plato;
- nevera;
- despensa;
- recibo;
- etiqueta;
- menú;
- compra;
- preparación grande;
- porciones restantes.

Toda salida visual debe incluir provenance/confidence.

No afirmar que una imagen fue analizada realmente si se usó solo texto.

---

# 13. Nutrition data engine

LLM reconoce/interpreta.

Motor determinista calcula.

Crear/fortalecer:

- FoodEntity normalization;
- units conversion;
- cooked/raw state;
- portion conversion;
- nutrient source;
- macro/micro calculation;
- recipe total;
- portion split;
- confidence propagation;
- ranges.

No usar números hardcodeados por keyword como solución final.

---

# 14. Módulo Metabolismo / Fisiología

Supervisor:

`MetabolismSupervisorAgent`

Especialistas:

- `MetabolicPhaseAgent`;
- `FastingStateAgent`;
- `SubstrateUtilizationAgent`;
- `HormonalResponseAgent`;
- `GlycogenStateAgent`;
- `EnergyBalanceAgent`;
- `ExerciseBiochemistryAgent`;
- `MetabolicPatternAgent`;
- `BiochemicalExplanationAgent`;
- `MetabolismAuditAgent`.

Reglas:

- estimación ≠ medición;
- no inventar glucosa;
- no inventar cetosis;
- no fixed 2100 kcal;
- gasto deriva de perfil + actividad + modelo documentado;
- todas las estimaciones tienen confidence/evidence;
- diferenciar explicación educativa de estado individual probable.

---

# 15. Sueño / Recuperación

Supervisor:

`SleepSupervisorAgent`

Especialistas:

- `SleepEventInterpreterAgent`;
- `SleepWindowAgent`;
- `SleepQualityAgent`;
- `CircadianPatternAgent`;
- `RecoveryAgent`;
- `WearableSleepAgent`;
- `SleepRoutineAgent`;
- `SleepPatternAgent`;
- `SleepInterventionAgent`;
- `SleepAuditAgent`.

Mantener continuidad overnight y separación ayer/hoy.

`Me acabo de levantar` debe poder:

- registrar/confirmar despertar;
- reconstruir ventana de sueño si existe evidencia;
- preguntar hora de dormir solo si es material;
- actualizar recuperación;
- informar metabolismo/nutrición/plan de que cambió el contexto.

---

# 16. Actividad / Ejercicio

Supervisor:

`ActivitySupervisorAgent`

Especialistas:

- `ActivityInputAgent`;
- `ExerciseClassificationAgent`;
- `TrainingLoadAgent`;
- `EnergyExpenditureAgent`;
- `RPEAgent`;
- `MovementPatternAgent`;
- `RecoveryInteractionAgent`;
- `ExercisePainContextAgent`;
- `ActivityPatternAgent`;
- `ActivityAuditAgent`.

Permitir sesiones mixtas.

No forzar una sola categoría si el usuario combinó actividades.

---

# 17. Hidratación

Supervisor:

`HydrationSupervisorAgent`

Especialistas:

- `HydrationInputAgent`;
- `HydrationNeedsAgent`;
- `ExerciseHydrationAgent`;
- `HydrationPatternAgent`;
- `HydrationAuditAgent`.

Objetivo adaptable, no fijo universal.

---

# 18. Energía / Ánimo / Hambre / Foco

Supervisor:

`StateSupervisorAgent`

Especialistas:

- `SubjectiveStateInterpreterAgent`;
- `EnergyPatternAgent`;
- `HungerPatternAgent`;
- `FocusLoadAgent`;
- `ContextCorrelationAgent`;
- `StateTrendAgent`;
- `StateAuditAgent`.

Correlación descriptiva no implica causalidad.

---

# 19. Medicación / Suplementos

Supervisor:

`MedicationSupervisorAgent`

Especialistas:

- `MedicationLoggerAgent`;
- `DoseCaptureAgent`;
- `MedicationReminderAgent`;
- `AdherenceAgent`;
- `SideEffectReporterAgent`;
- `MedicationAuditAgent`.

No recomendar iniciar/suspender/modificar tratamiento como autoridad médica.

---

# 20. Dolor / Síntomas

Supervisor:

`SymptomsSupervisorAgent`

Especialistas:

- `SymptomIntakeAgent`;
- `PainCharacterizationAgent`;
- `TriggerContextAgent`;
- `SeverityAgent`;
- `RedFlagSafetyAgent`;
- `SymptomPatternAgent`;
- `CrossDomainSymptomAgent`;
- `SymptomsAuditAgent`.

Seguridad clínica separada de registro de bienestar.

---

# 21. Cuerpo / Peso / Medidas

Supervisor:

`BodySupervisorAgent`

Especialistas:

- `MeasurementCaptureAgent`;
- `MeasurementValidationAgent`;
- `WeightTrendAgent`;
- `BodyCompositionAgent`;
- `GoalTrendAgent`;
- `BodyAuditAgent`.

BodyComposition solo si existen datos suficientes.

---

# 22. Hábitos / Rutinas

Supervisor:

`HabitsSupervisorAgent`

Especialistas:

- `HabitEventAgent`;
- `RoutineDiscoveryAgent`;
- `HabitAdherenceAgent`;
- `HabitPlanningAgent`;
- `HabitPatternAgent`;
- `HabitInterventionAgent`;
- `HabitsAuditAgent`.

No convertir un evento aislado en hábito estable.

---

# 23. Despensa / Inventario / Compras / Hogar

Supervisor:

`InventoryHomeSupervisorAgent`

Especialistas:

- `InventoryInputAgent`;
- `ReceiptVisionAgent`;
- `PurchaseParserAgent`;
- `StockMovementAgent`;
- `ExpirationAgent`;
- `ReplenishmentAgent`;
- `ShoppingListAgent`;
- `HouseholdNeedsAgent`;
- `FoodWasteAgent`;
- `InventoryAuditAgent`.

Reglas:

- toda modificación = InventoryTransaction;
- no quantity default;
- no negative stock silencioso;
- reconciliar discrepancias;
- receipt parse con confidence;
- una compra puede generar evento financiero cross-app;
- Aegis no se vuelve contabilidad global.

---

# 24. Plan Vivo

Supervisor:

`LivePlanSupervisorAgent`

Especialistas:

- `DayPlanningAgent`;
- `ConstraintResolverAgent`;
- `MealPlanningAgent`;
- `PreparationPlanningAgent`;
- `ActivityPlanningAgent`;
- `RecoveryPlanningAgent`;
- `ReplanningAgent`;
- `GoalAlignmentAgent`;
- `PlanConflictAgent`;
- `PlanAuditAgent`.

Plan Vivo cambia con eventos reales.

No es calendario estático.

---

# 25. Universal Ledger / Mi Día

Mi Día es una proyección.

No duplicar fuentes de verdad.

Cada evento relevante conserva:

```text
id
timestamp
userId
sessionId
source
input
intent
domains
authoritativeModule
agentsInvoked
toolsInvoked
readEntities
writes
before/after
evidence
confidence
confirmations
result
errors
rollback
correlationId
version
```

Correcciones:

```text
ANTES → DESPUÉS
```

Nunca borrar historia silenciosamente.

---

# 26. Memoria

Implementar capas:

- Core/Profile Memory;
- Domain Memory;
- Episodic Memory;
- Semantic Fact Memory;
- Pattern Memory;
- Preferences;
- Temporary Context.

Cada memoria necesita:

- provenance;
- createdAt;
- updatedAt;
- confidence;
- scope;
- validity window si aplica;
- correction history;
- ability to forget/delete.

No convertir un dato aislado en preferencia estable.

---

# 27. Autonomy Loop

Implementar realmente:

```text
OBSERVE
→ INTERPRET
→ COMPARE WITH MEMORY/PLAN/PATTERNS
→ DETECT GAP/CONFLICT/OPPORTUNITY
→ DECIDE
→ ACT OR ASK OR STAY SILENT
→ VERIFY
→ AUDIT
→ LEARN
```

## Niveles

### A
Automático silencioso, bajo riesgo y reversible.

### B
Automático + informar.

### C
Confirmar antes de modificar.

### D
No ejecutar automáticamente.

InterventionPolicyAgent debe controlar frecuencia de intervención.

---

# 28. Backend objetivo

No depender de localStorage/AsyncStorage como fuente productiva final.

Construir arquitectura durable:

```text
Client
→ API
→ Auth
→ Domain Services
→ Agent Runtime
→ Durable DB
→ Object Storage
→ Event Bus
→ Ledger
→ Jobs/Automation
```

Requisitos:

- multiusuario;
- aislamiento por userId/tenant;
- migrations;
- constraints;
- transactions;
- indexes;
- encryption/secrets;
- object storage;
- backups;
- restore tests;
- rate limiting;
- logs;
- metrics;
- error tracking;
- health checks;
- scheduled jobs;
- idempotency.

---

# 29. AION Protocol

Evolucionar publish/subscribe hacia contratos operativos:

```text
capability.register
capability.request
dispatch.accepted
needs_confirmation
completed
failed
partial
cancelled
```

Cada operación cross-app debe ser explícita y autorizada.

---

# 30. Excel canónico + exportación

Mantener compatibilidad conceptual con `SALUD_METABOLISMO_EDYAN.xlsx`.

El dato canónico vive en backend/modelos.

Export renderers:

- Table;
- XLSX;
- PDF;
- DOCX;
- CSV;
- JSON.

No crear lógicas de cálculo diferentes por formato.

El XLSX debe conservar y ampliar las hojas definidas en Blueprint.

PDF = informe visual.

DOCX = informe editable.

Tabla = visualización rápida.

JSON/CSV = portabilidad.

Guardar preferencia de formato cuando el usuario lo indique.

---

# 31. Recuperar patrones UI del AION legacy

Implementar la nueva UI descrita en `AION_AEGIS_UI_ARCHITECTURE.md`.

Conservar conceptualmente:

- SystemStrip/top bar;
- sidebar/rail;
- accordions;
- módulos satélite;
- `open/minimized/hidden` evolucionado a `visible/collapsed/hidden`;
- pin/unpin;
- ordenar módulos;
- module drawer;
- inspector bajo demanda;
- conversation surface;
- operational receipt;
- action dock simplificado alrededor del composer;
- unified daybook.

No copiar el UI viejo pixel a pixel.

---

# 32. Aegis Core UI

Aegis Core NO debe mostrar un grid de 12 módulos.

Debe tener feed orgánico:

```text
Composer
Acciones contextuales
Pulso de hoy
Aegis detecta
Plan Vivo breve
Mi Día breve
Mis módulos configurables
Ayer si es útil
```

Los módulos pueden fijarse/desfijarse/ocultarse/reordenarse en Core.

El detalle completo vive en el módulo.

---

# 33. Stitch → Antigravity

Stitch define diseño visual y prototipo.

Cuando exista entrega Stitch:

1. analizarla;
2. mapear componentes a arquitectura existente;
3. no reimplementar lógica de dominio dentro de UI;
4. crear design tokens/componentes compartidos;
5. preservar contratos;
6. conectar pantallas a datos reales;
7. no usar datos falsos para llenar estados;
8. mantener empty/error/loading states.

La UI puede cambiar radicalmente sin destruir backend/agents.

---

# 34. Identidad visual

Usar assets bajo:

`apps/aion-aegis/public/brand/`

Paleta:

```text
#070709 background
#0D0B12 elevated
#111017 surface
#17131F surface2
#1D1728 surface3
#7C3AED violet
#6D28D9 violet strong
#8B5CF6 violet bright
#C4B5FD lavender
#DDD6FE lavender soft
#D6B36A gold
#F3D18A gold bright
#A9803A gold dark
#F4F4F5 text
#A1A1AA muted
#71717A dim
```

No estética gamer.

---

# 35. Testing obligatorio

Construir tests por capas.

## Domain tests

- parsing;
- units;
- calculations;
- corrections;
- ownership;
- inventory transactions;
- timelines;
- exports.

## Agent contract tests

- schemas;
- permissions;
- confidence;
- missing data;
- verifier behavior;
- error behavior.

## Runtime integration

- multi-agent dispatch;
- parallel;
- dependency;
- partial failure;
- confirmation;
- retry;
- timeout;
- audit.

## Multimodal

- real provider test fixtures;
- photo ambiguous;
- receipt;
- label;
- menu;
- provider unavailable.

## Cross-domain

- meal + inventory;
- sleep + metabolism;
- activity + metabolism;
- purchase + inventory + cross-app event;
- correction propagation.

## UI

- module navigation;
- pin/hide/reorder;
- mobile drawer;
- sticky composer;
- Action Receipt;
- error state;
- empty state;
- accessibility.

## E2E

Casos del Blueprint completos.

---

# 36. Regresiones obligatorias conocidas

Crear tests que fallen si reaparecen:

- `20000` financiero por default;
- inventario hardcodeado;
- dominio Nutrición por default;
- VisionService fake descrito como real;
- `userConfirmed=true` sin confirmación;
- error que responde éxito;
- gasto fijo 2100 kcal;
- glucosa numérica sin medición;
- claim de inventario actualizado sin transaction;
- confirmation que pierde contexto de meal pending;
- runtime que retorna input como output;
- metadata-only marcado REAL.

---

# 37. Observabilidad

Cada operación importante debe producir telemetry suficiente para depurar:

- traceId;
- turnId;
- selected capabilities;
- agents;
- tools;
- latencies;
- retries;
- confidence;
- writes;
- result;
- failure reason.

No registrar secretos o datos sensibles innecesarios.

---

# 38. Performance / costo

No activar cien agentes por turno.

El Core selecciona el conjunto mínimo suficiente.

Ejemplo simple:

`Tomé 500 ml de agua.`

No necesita Bioquímica + Recetas + Nutrición + Auditoría completa.

Ejemplo complejo:

`Me levanté, dormí seis horas, tengo hambre, entreno en dos horas y quiero comer algo con lo que hay en la nevera.`

Puede requerir:

- Sleep;
- Temporal;
- User Model;
- Metabolism;
- Nutrition;
- Inventory;
- Planning;
- Evidence;
- Audit.

Optimizar sin sacrificar corrección.

---

# 39. Seguridad y salud

Aegis puede:

- registrar;
- calcular;
- estimar;
- explicar;
- detectar información faltante;
- recomendar opciones de bienestar de bajo riesgo.

No debe:

- diagnosticar;
- inventar mediciones;
- modificar medicación;
- presentar inferencia como examen clínico;
- ocultar incertidumbre;
- ejecutar acciones sensibles sin permiso.

---

# 40. Secuencia de implementación

## Fase 0 — Audit + Freeze contracts

- inventario de código;
- preservar REAL;
- mapear legacy reutilizable;
- corregir estados falsos.

## Fase 1 — Canonical data model

- entidades;
- ownership;
- evidence;
- corrections;
- ledger.

## Fase 2 — Durable backend

- DB;
- auth;
- repositories;
- object storage;
- migrations;
- transactions.

## Fase 3 — Protocol + runtime

- capability registry;
- implementation registry;
- dispatch;
- policies;
- telemetry.

## Fase 4 — Aegis Core

- intent/context;
- supervisor routing;
- aggregation;
- receipts.

## Fase 5 — Shared experts

- temporal;
- evidence;
- personalization;
- memory;
- intervention;
- audit;
- safety;
- physiology;
- biochemistry;
- reports.

## Fase 6 — Domain supervisors + specialists

Implementar módulo por módulo.

Prioridad sugerida:

1. Nutrition;
2. Inventory/Home;
3. Metabolism;
4. Sleep;
5. Activity;
6. Hydration;
7. Body;
8. State;
9. Habits;
10. Live Plan;
11. Medication;
12. Symptoms.

## Fase 7 — Multimodal real

- image provider;
- receipts;
- labels;
- menus;
- pantry/fridge.

## Fase 8 — Autonomy

- event watcher;
- policies;
- background jobs;
- proactive signals.

## Fase 9 — Export

- XLSX;
- PDF;
- DOCX;
- CSV/JSON.

## Fase 10 — UI assembly

- Stitch reference;
- sidebar;
- Aegis Core organic feed;
- module surfaces;
- responsive;
- interactions.

## Fase 11 — E2E hardening

- security;
- accessibility;
- performance;
- production readiness.

---

# 41. Método de trabajo autónomo

Antigravity debe trabajar en iteraciones internas sin pedir aprobación por cada decisión no destructiva ya definida.

Ciclo:

```text
inspect
→ implement
→ test
→ verify
→ update status
→ continue
```

No detenerse al terminar un componente si la fase puede continuar.

Sí detenerse si:

- falta un secreto/credencial indispensable;
- una decisión destruiría datos;
- existe una ambigüedad de producto no resuelta por documentos;
- una dependencia externa requiere autorización.

---

# 42. Método Edyan → auditoría

La estrategia del proyecto es:

```text
Antigravity construye
→ Edyan audita módulo
→ se registran fallas
→ Antigravity corrige
→ tests
→ Edyan vuelve a auditar
```

Las correcciones son acumulativas.

No revertir una decisión ya auditada/aprobada sin justificar técnicamente.

---

# 43. AION_BUILD_STATUS

Actualizar siempre con:

```text
REAL
PARTIAL
MOCK
PLANNED
BLOCKED
```

`REAL` requiere evidencia.

Añadir por componente:

- path;
- tests;
- limitations;
- provider/dependency;
- last audit date.

---

# 44. Definition of Done de un módulo

Un módulo solo está REAL completo cuando tiene:

- canonical model;
- ownership;
- persistence durable;
- API/service;
- events;
- supervisor real;
- required specialists reales;
- relevant tools;
- evidence/confidence;
- corrections;
- ledger;
- audit;
- contextual chat path;
- deep dashboard;
- export;
- cross-domain contracts;
- empty/error states;
- tests;
- documented limitations.

---

# 45. Definition of Done de Aegis Core

Debe superar E2E como:

## Caso despertar

`Me acabo de levantar.`

- entender temporalidad;
- consultar sueño;
- registrar/confirmar despertar;
- actualizar contexto;
- no inventar hora de dormir;
- responder naturalmente.

## Caso despertar + hambre

`Me acabo de levantar y tengo hambre.`

- sueño;
- temporal;
- metabolismo;
- nutrición;
- despensa;
- plan;
- contexto del usuario;
- respuesta integrada.

## Foto comida

- análisis real;
- candidates;
- confidence;
- micro-question si aplica;
- portion ranges;
- deterministic nutrition;
- confirmation;
- write;
- inventory effects si corresponden;
- ledger;
- receipt.

## Compra

`Compré 4 latas de atún por 28.000.`

- purchase parsed;
- inventory transaction;
- amount preserved;
- no fake quantity;
- cross-app financial event si AION Core está conectado;
- receipt.

## Corrección

`No eran dos huevos, eran tres.`

- localizar registro;
- correction before/after;
- recalc nutrition;
- propagate metabolism/plan;
- ledger;
- receipt.

## Qué comer

- context;
- inventory;
- goal;
- recent intake;
- activity;
- sleep when relevant;
- recipes;
- limited best options;
- explanation.

---

# 46. Resultado final esperado

AION Aegis no debe terminar como:

- un dashboard;
- un chat decorativo;
- un contador de calorías;
- un conjunto de metadata agents;
- una demo con números hardcodeados.

Debe terminar como:

> una inteligencia personal multimodal que convierte acontecimientos cotidianos en una bitácora estructurada y auditable, mantiene un modelo vivo del usuario, coordina especialistas profundos, cruza dominios sin duplicar verdades, planifica, propone, verifica y permite inspeccionar todo mediante módulos potentes, mientras Aegis Core permanece orgánico, fluido y simple de usar.

Construir eso. No simularlo.
