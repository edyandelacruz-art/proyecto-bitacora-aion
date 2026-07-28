# AION AEGIS — AUDITORÍA REAL DE COBERTURA MULTIAGENTE

**Fecha:** 2026-07-28  
**Objetivo:** comparar la arquitectura multiagente definida en `AION_AEGIS_MASTER_BLUEPRINT.md` con la implementación real del repositorio.  
**Regla:** no marcar `REAL` por existir un nombre, un metadata object, una tarjeta o un método que devuelve datos de prueba. `REAL` exige comportamiento conectado, verificable, persistente y probado.

---

# 1. Resultado ejecutivo

La arquitectura conceptual sí está documentada, pero **la implementación multiagente todavía NO corresponde al Blueprint completo**.

Estado honesto actual:

- Jerarquía Core → Supervisor → Specialist: **PARTIAL**.
- `AgentRegistry`: **PARTIAL**.
- `AgentRuntime`: **MOCK/PARTIAL**.
- Supervisores por módulo: **metadata registrado, comportamiento especializado incompleto**.
- Especialistas internos por módulo: **mayoritariamente PLANNED**.
- Expertos transversales: **PARTIAL**; existen algunas capacidades/engines, pero no toda la capa de agentes definida.
- Verifier pattern / segunda opinión: **PLANNED**.
- Cross-domain consistency real: **PARTIAL**.
- Intervention Policy real: **PLANNED/PARTIAL**.
- Safety & Permission Agent dedicado: **PLANNED**.
- Report & Export Agent como agente real: **PARTIAL**; existen motores de exportación.
- Autonomía auditada: **PARTIAL**.

El archivo `AION_BUILD_STATUS.md` anterior sobreestimó varias de estas capacidades al marcarlas como `REAL`.

---

# 2. Evidencia del código actual

## 2.1 Registry actual

Archivo:

`packages/aion-agents/src/runtime/AgentRuntime.ts`

Actualmente registra 16 entradas de metadata:

1. `aegis-core`
2. `nutrition-supervisor`
3. `metabolism-supervisor`
4. `sleep-supervisor`
5. `activity-supervisor`
6. `hydration-supervisor`
7. `state-supervisor`
8. `medication-supervisor`
9. `symptoms-supervisor`
10. `body-supervisor`
11. `habits-supervisor`
12. `inventory-home-supervisor`
13. `live-plan-supervisor`
14. `physiology-expert`
15. `biochemistry-expert`
16. `audit-agent`

Esto es una buena semilla de registro, pero NO equivale a tener todos los especialistas operativos.

## 2.2 Runtime actual

`AgentRuntime.invokeAgent()` actualmente:

- valida que el metadata exista;
- registra una entrada en Ledger;
- devuelve `inputPayload` como `output`;
- no despacha realmente a una implementación especializada;
- no ejecuta una herramienta real mediante el metadata;
- no hace worker → verifier;
- no consolida especialistas;
- no aplica circuit breaker real;
- no hace retry real;
- no ejecuta políticas de autonomía como runtime.

Por tanto el runtime NO puede clasificarse como `REAL` todavía.

## 2.3 Orquestador actual

Archivo:

`packages/aion-agents/src/core/AionCoreSuperAgent.ts`

Problemas actuales:

- usa regex/palabras clave como mecanismo principal de detección;
- conoce solo `NUTRITION`, `FINANCES`, `CALENDAR`, `HEALTH_ACTIVITY`;
- ante cantidad financiera ausente puede introducir `20000`;
- asigna cantidades hardcodeadas al inventario;
- llama directamente a `NutritionLeadSpecialist`;
- no usa `AgentRuntime` como runtime soberano;
- no convoca los supervisores del resto de los dominios de Aegis;
- cuando no detecta dominio devuelve `NUTRITION` por defecto;
- puede afirmar sincronización/registro sin verificar todas las transacciones.

Esta implementación debe conservarse como prototipo o migrarse, no presentarse como el Aegis Core final.

---

# 3. Cobertura esperada por el Blueprint

El Blueprint define una arquitectura con **muchos especialistas reales**. Si cada rol nombrado se implementa como agente, la especificación contiene más de cien roles entre Aegis Core, supervisores, especialistas de módulo y expertos transversales.

La especialización debe crecer hacia dentro. No se debe reducir el sistema a 16 metadatos genéricos.

---

# 4. Aegis Core

## Esperado

`AION Aegis Core`

Debe ser capaz de:

- interpretar texto, voz, foto y documentos;
- detectar múltiples dominios en una sola interacción;
- recuperar memoria pertinente;
- consultar temporalidad;
- seleccionar supervisores;
- invocar especialistas;
- decidir paralelo/secuencial;
- solicitar verificación;
- consolidar resultados;
- resolver contradicciones;
- decidir si debe preguntar;
- aplicar política de intervención;
- comprobar persistencia;
- emitir Action Receipt;
- aprender preferencias/patrones;
- coordinar autonomía;
- responder como una sola inteligencia.

## Estado

**PARTIAL.**

---

# 5. Shared Expert Layer esperado

Deben existir como agentes o grupos de agentes con implementación ejecutable, prompt/versionado, herramientas, outputs estructurados y tests:

### Fisiología
- `PhysiologyExpertAgent`

### Bioquímica
- `BiochemistryExpertAgent`

### Cocina / recetas
- `RecipeGenerationAgent`
- `RecipeAdaptationAgent`
- `IngredientSubstitutionAgent`
- `CulinaryTechniqueAgent`
- `MealPrepAgent`
- `BatchCookingAgent`
- `FoodSafetyStorageGuidanceAgent`
- `LeftoversOptimizationAgent`

### Evidencia
- `EvidenceUncertaintyAgent`

### Tiempo
- `TemporalReasoningAgent`

### Personalización
- `UserModelPersonalizationAgent`

### Memoria
- `MemoryCuratorAgent`

### Intervención
- `InterventionPolicyAgent`

### Coherencia transversal
- `CrossDomainConsistencyAgent`

### Auditoría
- `AuditAgent`

### Seguridad y permisos
- `SafetyPermissionAgent`

### Reportes
- `ReportExportAgent`

## Estado

- Fisiología: **PARTIAL**.
- Bioquímica: **PARTIAL**.
- Cocina/recetas: **PARTIAL** por existencia de `RecipeSkill`, pero el grupo de agentes no existe completo.
- Evidencia: **PARTIAL/PLANNED**.
- Temporal: **PARTIAL/PLANNED**.
- Personalización: **PARTIAL**.
- Memory Curator: **PLANNED** como agente dedicado.
- Intervention Policy: **PLANNED** como agente dedicado.
- Cross-domain Consistency: **PLANNED/PARTIAL**.
- Audit: **PARTIAL**.
- Safety/Permissions: **PLANNED** como agente real.
- Report/Export: **PARTIAL**; motores existen, agente no completo.

---

# 6. Alimentación / Nutrición

## Supervisor
- `NutritionSupervisorAgent`

## Especialistas obligatorios
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

## Estado

Supervisor metadata: **PARTIAL**.  
Especialistas: **mayoritariamente PLANNED/PARTIAL**.  
Existen capacidades como `VisionService`, `NutrientCalculationEngine`, `RecipeSkill` y `NutritionLeadSpecialist`, pero no equivalen a la orquesta completa.

---

# 7. Metabolismo / Fisiología

## Supervisor
- `MetabolismSupervisorAgent`

## Especialistas
- `MetabolicPhaseAgent`
- `FastingStateAgent`
- `SubstrateUtilizationAgent`
- `HormonalResponseAgent`
- `GlycogenStateAgent`
- `EnergyBalanceAgent`
- `ExerciseBiochemistryAgent`
- `MetabolicPatternAgent`
- `BiochemicalExplanationAgent`
- `MetabolismAuditAgent`

## Estado

**Mayormente PLANNED/PARTIAL.**

`LanguageEngine` no reemplaza por sí solo estos agentes.

---

# 8. Sueño / Recuperación

## Supervisor
- `SleepSupervisorAgent`

## Especialistas
- `SleepEventInterpreterAgent`
- `SleepWindowAgent`
- `SleepQualityAgent`
- `CircadianPatternAgent`
- `RecoveryAgent`
- `WearableSleepAgent`
- `SleepRoutineAgent`
- `SleepPatternAgent`
- `SleepInterventionAgent`
- `SleepAuditAgent`

## Estado

Supervisor metadata: **PARTIAL**.  
Especialistas: **PLANNED**, salvo lógica aislada existente.

---

# 9. Actividad / Ejercicio / Movimiento

## Supervisor
- `ActivitySupervisorAgent`

## Especialistas
- `ActivityInputAgent`
- `ExerciseClassificationAgent`
- `TrainingLoadAgent`
- `EnergyExpenditureAgent`
- `RPEAgent`
- `MovementPatternAgent`
- `RecoveryInteractionAgent`
- `ExercisePainContextAgent`
- `ActivityPatternAgent`
- `ActivityAuditAgent`

## Estado

**PLANNED/PARTIAL.**

---

# 10. Hidratación

## Supervisor
- `HydrationSupervisorAgent`

## Especialistas
- `HydrationInputAgent`
- `HydrationNeedsAgent`
- `ExerciseHydrationAgent`
- `HydrationPatternAgent`
- `HydrationAuditAgent`

## Estado

**PLANNED/PARTIAL.**

---

# 11. Energía / Ánimo / Hambre / Foco

## Supervisor
- `StateSupervisorAgent`

## Especialistas
- `SubjectiveStateInterpreterAgent`
- `EnergyPatternAgent`
- `HungerPatternAgent`
- `FocusLoadAgent`
- `ContextCorrelationAgent`
- `StateTrendAgent`
- `StateAuditAgent`

## Estado

**PLANNED/PARTIAL.**

---

# 12. Medicación / Suplementos

## Supervisor
- `MedicationSupervisorAgent`

## Especialistas
- `MedicationLoggerAgent`
- `DoseCaptureAgent`
- `MedicationReminderAgent`
- `AdherenceAgent`
- `SideEffectReporterAgent`
- `MedicationAuditAgent`

## Estado

**PLANNED/PARTIAL.**

---

# 13. Dolor / Síntomas

## Supervisor
- `SymptomsSupervisorAgent`

## Especialistas
- `SymptomIntakeAgent`
- `PainCharacterizationAgent`
- `TriggerContextAgent`
- `SeverityAgent`
- `RedFlagSafetyAgent`
- `SymptomPatternAgent`
- `CrossDomainSymptomAgent`
- `SymptomsAuditAgent`

## Estado

**PLANNED/PARTIAL.**

---

# 14. Peso / Medidas / Cuerpo

## Supervisor
- `BodySupervisorAgent`

## Especialistas
- `MeasurementCaptureAgent`
- `MeasurementValidationAgent`
- `WeightTrendAgent`
- `BodyCompositionAgent`
- `GoalTrendAgent`
- `BodyAuditAgent`

## Estado

**PLANNED/PARTIAL.**

---

# 15. Hábitos / Rutinas

## Supervisor
- `HabitsSupervisorAgent`

## Especialistas
- `HabitEventAgent`
- `RoutineDiscoveryAgent`
- `HabitAdherenceAgent`
- `HabitPlanningAgent`
- `HabitPatternAgent`
- `HabitInterventionAgent`
- `HabitsAuditAgent`

## Estado

**PLANNED/PARTIAL.**

---

# 16. Despensa / Compras / Hogar

## Supervisor
- `InventoryHomeSupervisorAgent`

## Especialistas
- `InventoryInputAgent`
- `ReceiptVisionAgent`
- `PurchaseParserAgent`
- `StockMovementAgent`
- `ExpirationAgent`
- `ReplenishmentAgent`
- `ShoppingListAgent`
- `HouseholdNeedsAgent`
- `FoodWasteAgent`
- `InventoryAuditAgent`

## Estado

Transacciones de inventario: **PARTIAL/REAL en piezas concretas**.  
Orquesta de agentes: **PLANNED/PARTIAL**.

---

# 17. Plan Vivo

## Supervisor
- `LivePlanSupervisorAgent`

## Especialistas
- `DayPlanningAgent`
- `ConstraintResolverAgent`
- `MealPlanningAgent`
- `PreparationPlanningAgent`
- `ActivityPlanningAgent`
- `RecoveryPlanningAgent`
- `ReplanningAgent`
- `GoalAlignmentAgent`
- `PlanConflictAgent`
- `PlanAuditAgent`

## Estado

**PLANNED/PARTIAL.**

---

# 18. Mi Día / Bitácora universal

No debe crear copias de datos. Es una proyección transversal desde Ledger y módulos.

Debe mostrar:
- eventos;
- fuente;
- evidencia;
- agente responsable;
- correcciones;
- impacto en otros módulos;
- acciones autónomas;
- exportaciones.

El `AuditAgent` debe poder reconstruir cada evento.

Estado: **PARTIAL**.

---

# 19. Requisitos mínimos para considerar un agente REAL

Un agente NO es REAL por aparecer en `AgentRegistry`.

Cada agente REAL debe tener:

1. `agentId` estable.
2. Metadata y versión.
3. Prompt/instrucciones versionadas o política determinista explícita.
4. Input schema.
5. Output schema.
6. Capability declaration.
7. Tool bindings reales.
8. Read scope.
9. Write scope.
10. Risk policy.
11. Confidence policy.
12. Confirmation policy.
13. Implementación ejecutable.
14. Persistencia cuando corresponda.
15. Ledger span / correlation ID.
16. Manejo de errores.
17. Tests unitarios.
18. Tests de contrato.
19. Casos de evaluación reproducibles.
20. Estado `REAL/PARTIAL/MOCK/PLANNED` verificable.

---

# 20. Runtime objetivo

```text
Aegis Core
  ↓
Intent + Context Resolver
  ↓
Capability Resolver
  ↓
Agent Registry
  ↓
Agent Runtime
  ↓
Module Supervisor
  ├─ Worker Specialist(s)
  ├─ Verifier Specialist(s) cuando corresponda
  └─ Shared Expert(s)
  ↓
Domain Transaction
  ↓
Persistence
  ↓
Ledger
  ↓
Audit
  ↓
Action Receipt
  ↓
Aegis Core response
```

El runtime debe ejecutar funciones reales, no devolver el payload recibido como resultado.

---

# 21. Patrón de redundancia útil

Ejemplo comida con fotografía:

```text
FoodVisionAgent
      ↓
PortionEstimationAgent
      ↓
FoodResolutionAgent
      ↓
NutrientCalculationAgent
      ↓
EvidenceUncertaintyAgent
      ↓
NutritionAuditAgent
      ↓
NutritionSupervisorAgent
      ↓
CrossDomainConsistencyAgent
      ↓
Aegis Core
```

Ejemplo “me acabo de levantar”:

```text
SleepEventInterpreterAgent
TemporalReasoningAgent
RecoveryAgent
MetabolicPhaseAgent
FastingStateAgent
DietaryPlanningAgent
InventoryHomeSupervisorAgent
LivePlanSupervisorAgent
UserModelPersonalizationAgent
InterventionPolicyAgent
       ↓
Aegis Core
```

---

# 22. Auditoría obligatoria para Antigravity

Antes de marcar un agente como REAL, Antigravity debe responder en `AION_BUILD_STATUS.md`:

- ¿Existe implementación ejecutable?
- ¿Qué archivo la contiene?
- ¿Qué herramientas invoca?
- ¿Qué datos lee?
- ¿Qué puede escribir?
- ¿Tiene test?
- ¿Qué test demuestra que no es metadata-only?
- ¿Qué ocurre cuando falla?
- ¿Cómo aparece en Ledger?
- ¿Cómo se verifica su resultado?

Si no puede responder estas preguntas con evidencia de código, el estado no puede ser `REAL`.

---

# 23. Prioridad inmediata de corrección

P0:
- dejar de presentar los 16 metadatos actuales como orquesta completa;
- corregir `AION_BUILD_STATUS.md`;
- implementar dispatch real en `AgentRuntime`;
- separar AION Core global de AION Aegis Core dentro de la app Aegis;
- eliminar defaults inventados y routing por defecto a nutrición.

P1:
- implementar especialistas reales por módulo empezando por los caminos cotidianos de mayor uso;
- crear Worker/Verifier/Audit cuando aplique;
- integrar protocolos de bitácora, evidencia y corrección forense.

P2:
- autonomía, intervención y cross-domain consistency reales;
- evaluaciones por agente;
- observabilidad de spans y costos.

---

# 24. Conclusión

La dirección arquitectónica es correcta, pero la implementación actual todavía es una **semilla multiagente**, no la orquesta completa definida en el Blueprint.

La siguiente regla es obligatoria:

> **No contar nombres. Contar capacidades especializadas realmente ejecutadas, verificadas y auditadas.**
