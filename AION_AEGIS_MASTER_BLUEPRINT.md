# AION AEGIS — MASTER BLUEPRINT

**Documento normativo completo de producto, arquitectura, agentes, módulos, autonomía, datos, dashboards, exportaciones, auditoría y diseño visual**

> Este documento NO es un resumen. Define el objetivo completo de AION Aegis y debe ser leído de principio a fin por cualquier agente de programación antes de modificar el producto.

---

# 0. Regla de interpretación

AION Aegis NO es una aplicación de nutrición.

AION Aegis es una **bitácora personal inteligente, multimodal, interactiva, adaptativa, auditada y progresivamente autónoma**, capaz de convertir hechos cotidianos expresados de forma natural en datos estructurados, contexto, planificación y acciones útiles.

El usuario no debe aprender a navegar formularios para registrar su vida. Debe poder simplemente decir, escribir, hablar o mostrar lo que está pasando:

- “Me acabo de levantar”.
- “Dormí mal”.
- “Me comí esto”.
- “Gasté esto en mercado”.
- “Compré cuatro latas de atún y tomates”.
- “Me duele la espalda”.
- “Hoy caminé una hora”.
- “Tengo hambre”.
- “Mañana almuerzo afuera”.
- “¿Qué puedo preparar con lo que tengo?”.
- “¿Qué me hace falta en la casa?”.
- “Hazme mi reporte semanal”.

Aegis debe entender el contexto, detectar los dominios implicados, consultar memoria, hablar con sus agentes especializados, preguntar solo lo necesario, registrar cambios, recalcular el estado del día, auditar lo ocurrido y responder como una sola inteligencia coherente.

---

# 1. Distinción obligatoria: AION Core vs AION Aegis Core

## 1.1 AION Core

`AION Core` es el orquestador del ecosistema AION completo. Coordina aplicaciones independientes como AION Aegis, AION Ops, AION Edu, AION Studio y futuras aplicaciones.

AION Aegis debe poder funcionar sin AION Core.

Cuando AION Core exista y esté conectado, Aegis puede compartir eventos autorizados mediante contratos explícitos, por ejemplo:

- una compra de mercado puede generar un evento financiero para otra aplicación;
- una actividad planificada puede interactuar con calendario;
- un reporte puede enviarse a un sistema externo autorizado.

Aegis no debe acceder directamente a las bases de datos internas de otras aplicaciones.

## 1.2 AION Aegis Core

`AION Aegis Core` es el agente/orquestador soberano interno de AION Aegis.

Es la inteligencia con la que el usuario siente que conversa.

Debe:

- interpretar lenguaje natural;
- aceptar texto, voz, fotografía, documentos y otras entradas futuras;
- detectar uno o varios dominios afectados;
- recuperar contexto relevante;
- decidir qué supervisores y agentes especialistas necesita;
- coordinar trabajo paralelo o secuencial;
- consolidar resultados;
- detectar incertidumbre y contradicciones;
- pedir confirmación cuando corresponda;
- ejecutar acciones autorizadas;
- verificar que realmente se ejecutaron;
- registrar trazabilidad;
- generar una respuesta final única;
- adaptar la interacción al usuario;
- aprender preferencias y patrones;
- activar autonomía y seguimiento sin convertirse en un sistema invasivo.

Aegis Core debe tener competencia general alta en alimentación, fisiología, bioquímica, hábitos, recetas, sueño, actividad, comportamiento y planificación cotidiana, pero no debe sustituir los especialistas internos cuando una tarea requiere análisis profundo, verificación o modificación de estado.

---

# 2. Filosofía multiagente

La arquitectura recupera la idea del AION original: **muchos especialistas, coordinados, comunicados y auditables**.

La jerarquía deseada es:

```text
Usuario
  ↓
AION Aegis Core
  ↓
Supervisores de módulo
  ↓
Agentes especialistas
  ↓
Skills / Engines / Tools / Bases de conocimiento
  ↓
Persistencia / Ledger / Eventos
  ↓
Auditoría
  ↓
Aegis Core
  ↓
Usuario
```

## 2.1 Regla contra la redundancia incorrecta

La redundancia que se debe evitar es **entre módulos propietarios de datos**.

Ejemplo incorrecto:

- Nutrición mantiene una versión del peso.
- Cuerpo mantiene otra versión del peso.
- Plan Vivo mantiene una tercera.

Ejemplo correcto:

- Cuerpo es propietario del peso.
- Nutrición consulta el peso.
- Plan Vivo consulta el peso.
- Ledger registra que el peso fue utilizado en una decisión.

## 2.2 Redundancia útil entre agentes

Sí se permite y se desea cierta redundancia controlada entre especialistas para:

- segunda opinión;
- verificación;
- detección de contradicciones;
- control de calidad;
- auditoría;
- análisis desde perspectivas diferentes.

Patrón recomendado:

```text
Worker Agent
   ↓
Verifier Agent
   ↓
Module Supervisor
   ↓
Cross-domain Auditor cuando aplique
   ↓
Aegis Core
```

No todos los mensajes necesitan activar todos los niveles. El runtime debe evitar latencia y costo innecesarios.

---

# 3. Principios no negociables

1. **Missing != default.** Nunca inventar cantidades, montos, horarios, porciones o hechos porque falte información.
2. **Una sola fuente de verdad por dato.** Los otros módulos consultan; no duplican.
3. **Datos confirmados, detectados, inferidos y estimados deben distinguirse.**
4. **Toda estimación debe tener nivel de confianza/evidencia.**
5. **No afirmar éxito sin verificar persistencia o resultado.**
6. **No diagnosticar.** Aegis puede explicar fisiología y bioquímica, estimar estados probables y reconocer señales de alerta, pero no inventar diagnósticos ni presentar valores no medidos como mediciones reales.
7. **Human in the loop para acciones sensibles o irreversibles.**
8. **Autonomía proporcional al riesgo.**
9. **Memoria externa y controlada.** El conocimiento persistente del usuario no puede depender solo del contexto temporal del modelo.
10. **Auditabilidad completa.** Debe poder explicarse qué creyó Aegis, qué agentes participaron, qué herramientas se usaron, qué cambió y por qué.
11. **Portabilidad.** El usuario puede exportar su información.
12. **Privacidad por diseño.** Compartir solo el contexto necesario.
13. **Conversación primero.** Los dashboards sirven para inspeccionar, corregir, profundizar y configurar; no para obligar al usuario a navegar formularios.
14. **El usuario sigue siendo soberano.** Puede corregir, borrar, confirmar, rechazar o desactivar automatizaciones.
15. **No fingir capacidades.** Todo debe clasificarse como REAL, PARTIAL, MOCK o PLANNED hasta que exista evidencia.

---

# 4. Estado actual del repositorio que debe preservarse y evolucionar

El repositorio actual ya contiene semillas reales de la visión. Antes de reescribir, el agente debe inspeccionar y preservar lo que funcione.

Capacidades existentes o parciales conocidas:

- monorepo TypeScript con `apps/*` y `packages/*`;
- aplicación AION Aegis con navegación por superficies;
- `AionMemoryStore`;
- `AionEventBus` / AION Protocol;
- ledger básico;
- inventario con transacciones auditables;
- registro conversacional de comidas;
- `NutritionLeadSpecialist`;
- `VisionService`;
- `LanguageEngine`;
- `RecipeSkill`;
- `DailyReportEngine`;
- `AionCoreSuperAgent` prototípico;
- onboarding/perfil;
- paneles de cuerpo, comida, despensa, plan y día;
- exportaciones iniciales de alimentación;
- lógica de eventos y memoria local.

Problemas actuales conocidos que deben corregirse durante la evolución:

- Core actual depende demasiado de palabras clave;
- existen valores de respaldo inventados cuando faltan montos o cantidades;
- la visión actual puede simular reconocimiento a partir del texto en lugar de una inferencia multimodal real;
- existen valores nutricionales hardcodeados;
- algunos estados metabólicos presentan valores como si fueran reales cuando son inferencias;
- existe gasto energético fijo en algunas rutas;
- una respuesta puede afirmar que se descontó despensa aunque la transacción no haya ocurrido;
- el flujo de confirmación de porción puede perder el contexto original;
- una excepción no puede devolver un mensaje que afirme falsamente que se registró correctamente;
- el dominio por defecto nunca debe convertirse automáticamente en Nutrición cuando no se detectó nada;
- la memoria principal todavía depende de almacenamiento local y no constituye backend productivo.

Estas fallas deben convertirse en tests de regresión.

---

# 5. Arquitectura objetivo de alto nivel

```text
                          ┌─────────────────────────┐
                          │      AION AEGIS UI       │
                          │ chat · voz · foto · docs │
                          └────────────┬────────────┘
                                       │
                          ┌────────────▼────────────┐
                          │   AION AEGIS CORE AGENT │
                          │ interaction/orchestration│
                          └────────────┬────────────┘
                                       │
                   ┌───────────────────┼───────────────────┐
                   │                   │                   │
            ┌──────▼──────┐     ┌──────▼──────┐    ┌──────▼──────┐
            │ USER MODEL  │     │   MEMORY    │    │    LEDGER    │
            └──────┬──────┘     └──────┬──────┘    └──────┬──────┘
                   └───────────────────┼───────────────────┘
                                       │
                          ┌────────────▼────────────┐
                          │      AGENT RUNTIME       │
                          │ registry · policies ·    │
                          │ tools · capabilities     │
                          └────────────┬────────────┘
                                       │
        ┌──────────────┬───────────────┼───────────────┬──────────────┐
        ▼              ▼               ▼               ▼              ▼
   Nutrition       Metabolism        Sleep          Activity       Pantry/Home
   Supervisor      Supervisor      Supervisor       Supervisor      Supervisor
        │              │               │               │              │
   specialists     specialists      specialists      specialists     specialists

        + Hydration + Energy/Mood + Medication + Symptoms + Body + Habits + Live Plan
        + Shared Expert Layer
        + Audit / Evidence / Intervention / Report / Export / Safety
```

---

# 6. Agent Runtime

Debe existir un runtime independiente de la interfaz.

Cada agente registrado debe declarar como mínimo:

```text
agentId
name
role
domain
capabilities
acceptedInputs
producedOutputs
tools
memoryScope
writePermissions
readPermissions
riskLevel
confirmationPolicy
confidencePolicy
fallbackPolicy
version
status
```

El runtime debe soportar:

- registro dinámico de agentes;
- descubrimiento por capacidades;
- invocación síncrona/asíncrona;
- trabajo paralelo;
- límites de costo y tiempo;
- cancelación;
- reintentos controlados;
- circuit breaker para agentes/herramientas fallidas;
- resultados estructurados;
- logging;
- correlation IDs;
- trazabilidad de cada turn;
- jerarquía Core → Supervisor → Specialist;
- verificación secundaria cuando una decisión lo requiera;
- escalamiento a usuario cuando la confianza es insuficiente;
- políticas de permisos;
- políticas de autonomía;
- versionado de prompts/contratos;
- evaluación del desempeño de cada agente.

---

# 7. Shared Expert Layer — expertos transversales

Estos agentes no son módulos. Son expertos compartidos que pueden ser consultados por varios supervisores.

## 7.1 Physiology Expert Agent

Debe razonar sobre fisiología humana relevante para el contexto cotidiano de Aegis:

- digestión;
- absorción;
- respuesta posprandial;
- regulación energética;
- sueño y recuperación;
- ejercicio;
- hidratación;
- hambre/saciedad;
- respuesta autonómica;
- adaptación al entrenamiento;
- fatiga.

No diagnostica.

## 7.2 Biochemistry Expert Agent

Debe manejar mecanismos y rutas como:

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
- transporte de lípidos;
- quilomicrones;
- insulina/glucagón;
- lactato;
- LDH;
- utilización de sustratos;
- estado alimentado, postabsortivo y ayuno.

Debe distinguir explicación educativa de inferencia individual.

## 7.3 Culinary & Recipe Expert Group

Puede contener varios agentes especializados:

- Recipe Generation Agent;
- Recipe Adaptation Agent;
- Ingredient Substitution Agent;
- Culinary Technique Agent;
- Meal Prep Agent;
- Batch Cooking Agent;
- Food Safety/Storage Guidance Agent;
- Leftovers Optimization Agent.

Debe usar despensa real, preferencias, equipo de cocina, tiempo disponible, objetivos y restricciones.

## 7.4 Evidence & Uncertainty Agent

Responsable de:

- clasificar evidencia;
- distinguir medido/confirmado/estimado/detectado/inferido/desconocido;
- calibrar confianza;
- detectar sobreafirmaciones;
- impedir que un dato estimado se presente como exacto.

## 7.5 Temporal Reasoning Agent

Debe entender:

- hora local;
- última comida;
- última actividad;
- duración de sueño;
- ventanas temporales;
- planes futuros;
- vencimientos;
- intervalos;
- patrones por día de semana;
- eventos esperados pero ausentes.

## 7.6 User Model / Personalization Agent

Construye progresivamente un modelo del usuario:

- rutinas;
- preferencias;
- rechazo de alimentos;
- horarios habituales;
- nivel técnico preferido;
- tolerancia a notificaciones;
- estilo de interacción;
- comidas frecuentes;
- tiempos de preparación;
- patrones de compra;
- objetivos;
- cambios de comportamiento;
- contexto de hogar.

El modelo debe ser editable y auditable.

## 7.7 Memory Curator Agent

Decide qué información merece persistencia de largo plazo y qué información es solo contexto temporal.

Debe evitar acumular basura o hechos contradictorios.

## 7.8 Intervention Policy Agent

Decide si Aegis debe interrumpir/proponer/preguntar o guardar silencio.

Debe considerar:

- relevancia;
- urgencia;
- riesgo;
- confianza;
- frecuencia reciente de intervenciones;
- preferencias del usuario;
- hora;
- contexto;
- calendario si está autorizado;
- historial de rechazo/aceptación.

## 7.9 Cross-Domain Consistency Agent

Busca contradicciones entre módulos.

Ejemplos:

- inventario insuficiente para una receta registrada;
- comida registrada incompatible con una preparación disponible;
- ejercicio reportado durante una franja de sueño confirmada;
- dos registros duplicados;
- cantidades imposibles;
- plan que utiliza un alimento agotado.

## 7.10 Audit Agent

Audita acciones y respuestas importantes:

- intención detectada;
- agentes invocados;
- fuentes consultadas;
- datos utilizados;
- cambios persistidos;
- eventos emitidos;
- nivel de evidencia;
- resultado real;
- errores;
- rollback si existió.

## 7.11 Safety & Permission Agent

Controla:

- permisos de lectura/escritura;
- acciones de riesgo;
- confirmaciones;
- información médica sensible;
- acciones externas;
- compartir/exportar datos;
- eliminación;
- integraciones.

## 7.12 Report & Export Agent

Transforma datos canónicos en diferentes presentaciones sin modificar el significado.

---

# 8. Módulos y propiedad de datos

Cada módulo tiene un Supervisor Agent y especialistas. Los módulos pueden consultarse entre sí mediante contratos, pero no duplicar datos maestros.

---

# 9. Módulo: Alimentación / Nutrición

## Propiedad

Es propietario de:

- ingestas;
- comidas;
- bebidas con aporte nutricional;
- alimentos consumidos;
- porciones;
- macronutrientes/micronutrientes calculados;
- evidencia alimentaria;
- clasificación de tipo de comida;
- patrones de alimentación.

No es propietario de peso, sueño, actividad o inventario.

## Supervisor

`NutritionSupervisorAgent`

## Especialistas

1. `MealInputInterpreterAgent`
   - entiende texto/voz libre;
   - identifica si el usuario comió, planea comer, pregunta o corrige.

2. `FoodVisionAgent`
   - analiza imágenes reales;
   - identifica candidatos;
   - devuelve confidence y ambigüedades.

3. `MenuAndLabelReaderAgent`
   - interpreta etiquetas, menús y empaques.

4. `PortionEstimationAgent`
   - rangos min/probable/max;
   - unidades;
   - fracción consumida;
   - evita falsa precisión.

5. `FoodResolutionAgent`
   - normaliza nombres hacia base de alimentos;
   - distingue crudo/cocido;
   - técnicas de preparación.

6. `NutrientCalculationAgent`
   - usa motor/base determinista;
   - no inventa nutrientes con LLM.

7. `MealContextAgent`
   - interpreta hora, tipo de comida, hambre, objetivo y contexto.

8. `DietaryPlanningAgent`
   - propone qué comer dentro del día usando datos de otros módulos.

9. `EatingPatternAgent`
   - tendencias longitudinales.

10. `NutritionAuditAgent`
    - verifica sumas, evidencia, duplicados, inconsistencias y afirmaciones.

## Dashboard nutricional

Debe incluir:

- calorías hoy vs objetivo;
- proteína, carbohidratos, grasas;
- fibra;
- ingestas del día;
- distribución por comida;
- rango de incertidumbre;
- tendencia semanal;
- cumplimiento de proteína;
- comidas recientes;
- botón/chat contextual “Preguntar a Aegis sobre alimentación”;
- acceso a fotos/evidencias;
- corrección de registros;
- exportación del dominio.

---

# 10. Módulo: Metabolismo y estado fisiológico

## Propiedad

- etapa metabólica probable;
- tiempo desde última ingesta;
- sustrato energético probable;
- balance energético estimado;
- interpretación metabólica;
- historial de cambios de fase;
- notas bioquímicas.

Nunca almacena glucosa u otros valores como medidos si no fueron medidos realmente.

## Supervisor

`MetabolismSupervisorAgent`

## Especialistas

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

## Dashboard

- última comida;
- horas desde última ingesta;
- etapa probable;
- confianza;
- sustratos probables;
- calorías ingeridas/gasto estimado;
- explicación simple;
- detalle técnico expandible;
- eventos que justifican la estimación;
- advertencia “estimación, no medición clínica”;
- línea temporal metabólica;
- explicación “¿por qué Aegis cree esto?”.

---

# 11. Módulo: Sueño y recuperación

## Propiedad

- hora de dormir;
- despertar;
- horas en cama;
- despertares;
- calidad subjetiva;
- somnolencia;
- rutina previa;
- pantallas;
- datos wearable autorizados;
- recuperación estimada.

## Supervisor

`SleepSupervisorAgent`

## Especialistas

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

## Ejemplo de interacción

“Me acabo de levantar” puede activar:

- temporal reasoning;
- sueño;
- metabolismo;
- nutrición;
- plan vivo;
- despensa;
- personalización.

Aegis puede preguntar la hora de dormir si no puede inferirla con suficiente certeza.

## Dashboard

- duración último sueño;
- calidad;
- hora dormir/despertar;
- tendencia semanal;
- regularidad;
- recuperación;
- somnolencia;
- wearable vs autoinforme;
- factores asociados;
- recomendaciones no médicas;
- chat contextual.

---

# 12. Módulo: Actividad, ejercicio y movimiento

## Propiedad

- actividad;
- duración;
- intensidad;
- RPE;
- tipo de ejercicio;
- pasos cuando existan;
- NEAT estimado/registrado;
- gasto energético estimado;
- entrenamiento;
- dolor antes/después;
- recuperación asociada.

## Supervisor

`ActivitySupervisorAgent`

## Especialistas

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

## Dashboard

- minutos del día;
- actividad por tipo;
- RPE;
- gasto estimado con rango;
- dolor antes/después;
- tendencia semanal;
- adherencia;
- recuperación;
- relación con sueño/energía;
- chat contextual.

---

# 13. Módulo: Hidratación

## Propiedad

- ingesta de agua;
- otras bebidas relevantes;
- acumulado diario;
- contexto de calor/ejercicio;
- objetivo adaptable.

## Supervisor

`HydrationSupervisorAgent`

## Especialistas

- `HydrationInputAgent`;
- `HydrationNeedsAgent`;
- `ExerciseHydrationAgent`;
- `HydrationPatternAgent`;
- `HydrationAuditAgent`.

## Dashboard

- agua acumulada;
- objetivo;
- ritmo de consumo;
- relación con actividad/clima si está disponible;
- tendencia;
- eventos de hidratación;
- chat contextual.

---

# 14. Módulo: Energía, ánimo, hambre y estado cognitivo

## Propiedad

- energía subjetiva;
- ánimo;
- hambre;
- ansiedad reportada;
- enfoque;
- irritabilidad;
- carga mental;
- contexto asociado.

No diagnostica salud mental.

## Supervisor

`StateSupervisorAgent`

## Especialistas

- `SubjectiveStateInterpreterAgent`;
- `EnergyPatternAgent`;
- `HungerPatternAgent`;
- `FocusLoadAgent`;
- `ContextCorrelationAgent`;
- `StateTrendAgent`;
- `StateAuditAgent`.

## Dashboard

- energía actual/último registro;
- hambre;
- ánimo;
- foco;
- carga mental;
- tendencia diaria/semanal;
- correlaciones descriptivas con sueño/comidas/actividad;
- no inferir causalidad sin evidencia.

---

# 15. Módulo: Medicación, suplementos y apoyos

## Propiedad

- medicamento/suplemento reportado;
- dosis declarada;
- motivo declarado;
- tomado/no tomado;
- efecto percibido;
- efecto secundario reportado;
- prescrito sí/no/desconocido;
- recordatorio autorizado.

## Supervisor

`MedicationSupervisorAgent`

## Especialistas

- `MedicationLoggerAgent`;
- `DoseCaptureAgent`;
- `MedicationReminderAgent`;
- `AdherenceAgent`;
- `SideEffectReporterAgent`;
- `MedicationAuditAgent`.

No debe recomendar iniciar, suspender o modificar tratamientos como si fuera médico.

## Dashboard

- tomas del día;
- pendientes;
- adherencia;
- efectos reportados;
- recordatorios;
- historial;
- exportación específica.

---

# 16. Módulo: Dolor y síntomas

## Propiedad

- zona;
- intensidad;
- tipo;
- activador;
- posición/movimiento;
- duración;
- medicación usada;
- mejora;
- señales de alerta;
- observaciones.

## Supervisor

`SymptomsSupervisorAgent`

## Especialistas

- `SymptomIntakeAgent`;
- `PainCharacterizationAgent`;
- `TriggerContextAgent`;
- `SeverityAgent`;
- `RedFlagSafetyAgent`;
- `SymptomPatternAgent`;
- `CrossDomainSymptomAgent`;
- `SymptomsAuditAgent`.

## Dashboard

- síntomas activos;
- dolor máximo;
- zonas;
- duración;
- tendencia;
- relación temporal con actividad/sueño;
- alertas;
- historial.

---

# 17. Módulo: Peso, medidas y cuerpo

## Propiedad

- peso;
- cintura;
- cuello;
- cadera;
- IMC como métrica matemática cuando corresponda;
- cambios respecto a mediciones anteriores;
- otras mediciones futuras;
- datos de básculas/wearables autorizados.

## Supervisor

`BodySupervisorAgent`

## Especialistas

- `MeasurementCaptureAgent`;
- `MeasurementValidationAgent`;
- `WeightTrendAgent`;
- `BodyCompositionAgent` solo cuando existan datos suficientes;
- `GoalTrendAgent`;
- `BodyAuditAgent`.

## Dashboard

- última medición;
- tendencia;
- cambio semanal/mensual;
- cintura/otras medidas;
- relación descriptiva con adherencia;
- niveles de evidencia.

---

# 18. Módulo: Hábitos y rutinas

## Propiedad

- rutinas repetidas;
- agua resumida si corresponde como proyección;
- pasos si se usa como hábito;
- sol;
- movilidad;
- comida preparada;
- ayuno cumplido;
- paseo de mascota;
- rutina de sueño;
- pantallas nocturnas;
- adherencia general;
- otros hábitos configurables.

## Supervisor

`HabitsSupervisorAgent`

## Especialistas

- `HabitEventAgent`;
- `RoutineDiscoveryAgent`;
- `HabitAdherenceAgent`;
- `HabitPlanningAgent`;
- `HabitPatternAgent`;
- `HabitInterventionAgent`;
- `HabitsAuditAgent`.

## Dashboard

- hábitos del día;
- rachas sin gamificación infantil;
- adherencia;
- patrones;
- hábitos en riesgo;
- sugerencias adaptativas;
- controles de notificación.

---

# 19. Módulo: Despensa, inventario, compras y hogar

Este módulo no se limita a alimentos. Puede evolucionar para saber qué falta en la casa dentro del alcance que el usuario habilite.

## Propiedad

- inventario;
- cantidades;
- unidades;
- ubicación;
- fecha de ingreso;
- vencimiento estimado/confirmado;
- disponibilidad;
- historial de movimientos;
- compras;
- recibos;
- productos del hogar;
- lista de compras;
- reposición.

## Supervisor

`InventoryHomeSupervisorAgent`

## Especialistas

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

## Reglas

- no descontar inventario sin transacción;
- no inventar cantidades compradas;
- registrar incertidumbre;
- distinguir producto presente, estimado y agotado;
- toda modificación de inventario genera movimiento auditable;
- una compra puede emitir evento hacia AION Core para Finanzas, pero Aegis no es propietario de contabilidad financiera global.

## Dashboard

- existencias;
- bajo stock;
- próximos a vencer;
- qué falta;
- compras recientes;
- consumo estimado;
- desperdicio evitado;
- lista de compras;
- filtros por ubicación/categoría;
- historial “¿por qué Aegis cree que queda esta cantidad?”.

---

# 20. Módulo: Plan Vivo

El Plan Vivo no es un calendario estático. Es una planificación que cambia con la realidad del día.

## Propiedad

- acciones planificadas dentro de Aegis;
- comidas futuras;
- preparación;
- compras;
- ejercicio;
- descanso;
- recordatorios internos;
- prioridades;
- dependencias;
- replanificación.

## Supervisor

`LivePlanSupervisorAgent`

## Especialistas

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

## Dashboard

- timeline de hoy;
- ahora/próximo/después;
- planificado vs realizado;
- elementos reprogramados;
- bloqueos;
- recomendaciones;
- acciones pendientes;
- plan de mañana;
- chat contextual.

---

# 21. Mi Día / Bitácora universal

`Mi Día` no crea copias de todos los datos. Es una **proyección transversal** construida desde el Ledger y los módulos.

Debe mostrar cronológicamente:

- despertar;
- sueño;
- comidas;
- agua;
- actividad;
- medicación;
- síntomas;
- cambios de energía/ánimo;
- compras;
- cambios de despensa;
- planes;
- recomendaciones aceptadas;
- correcciones;
- alertas;
- acciones autónomas;
- exportaciones.

Cada entrada debe permitir:

- ver origen;
- ver evidencia;
- corregir;
- anular cuando sea reversible;
- ver agente responsable;
- ver impacto en otros módulos.

---

# 22. Autonomía

Aegis debe evolucionar hacia asistente real y no permanecer como chatbot reactivo.

## 22.1 Autonomy Loop

```text
OBSERVE
  ↓
INTERPRET
  ↓
COMPARE WITH MEMORY / PLAN / PATTERNS
  ↓
DETECT MISSING DATA / CONFLICT / OPPORTUNITY
  ↓
DECIDE
  ├── do nothing
  ├── register
  ├── calculate
  ├── ask
  ├── recommend
  ├── replan
  ├── alert
  └── request confirmation
  ↓
ACT
  ↓
VERIFY
  ↓
AUDIT
  ↓
LEARN
```

## 22.2 Niveles de autonomía

### Nivel A — automático silencioso

Solo acciones de bajo riesgo, reversibles y derivadas directamente de datos confirmados.

Ejemplos:

- recalcular dashboard;
- actualizar proyección;
- ordenar timeline;
- detectar alimento próximo a vencer.

### Nivel B — automático + informar

Ejemplos:

- clasificar un alimento como “consumir pronto”;
- generar una sugerencia de desayuno;
- reordenar una recomendación.

### Nivel C — preguntar antes de modificar

Ejemplos:

- corregir un registro ambiguo;
- cambiar un objetivo importante;
- realizar acción externa;
- compartir datos;
- borrar datos;
- decisiones sensibles.

### Nivel D — no ejecutar automáticamente

Acciones médicas, irreversibles o fuera del alcance autorizado.

## 22.3 Proactividad

Aegis puede detectar:

- comida esperada pero no registrada;
- horas de sueño por debajo de patrón;
- agua muy baja frente al día;
- alimentos próximos a vencer;
- lista de compras probable;
- actividad planeada no realizada;
- medicamento pendiente si el usuario configuró recordatorio;
- dolor recurrente;
- caída de energía;
- inconsistencias.

Pero el `InterventionPolicyAgent` decide si vale la pena molestar al usuario.

---

# 23. Memoria y modelo de usuario

La memoria debe tener capas.

## 23.1 Core Profile

Hechos relativamente estables:

- zona horaria;
- sistema de unidades;
- preferencias de interacción;
- configuración de privacidad;
- integraciones;
- objetivos activos.

## 23.2 Domain Memory

Memoria específica por dominio.

## 23.3 Episodic Memory

Eventos relevantes históricos.

## 23.4 Pattern Memory

Patrones aprendidos con evidencia y ventana temporal.

## 23.5 Preferences

- alimentos;
- cocina;
- formatos de reporte;
- nivel de detalle;
- profundidad bioquímica;
- frecuencia de notificaciones;
- estilos de respuesta.

## 23.6 Regla de memoria

No convertir inferencias temporales en hechos permanentes sin suficiente evidencia.

---

# 24. Ledger y trazabilidad

El Ledger es universal e idealmente append-only para el historial de acciones.

Cada entrada importante debe poder registrar:

```text
id
timestamp
userId
sessionId
source
input
interpretedIntent
domains
authoritativeModule
agentsInvoked
toolsInvoked
readEntities
writeEntities
evidence
confidence
changes
eventsEmitted
confirmationRequired
confirmationState
result
error
rollback
notes
```

El estado materializado de cada módulo puede reconstruirse o auditarse a partir de transacciones suficientes.

---

# 25. Backend y persistencia objetivo

La aplicación no debe depender de `localStorage` como verdad productiva.

Arquitectura objetivo:

```text
Aegis UI
  ↓
Aegis API
  ↓
Domain Services
  ↓
Agent Runtime
  ↓
PostgreSQL / durable store
  + Object Storage for images/documents
  + Ledger
  + Event Bus
```

Mantener TypeScript end-to-end salvo razón técnica fuerte.

El agente de código debe inspeccionar dependencias actuales y evitar churn innecesario. Como objetivo, implementar:

- API backend independiente;
- autenticación;
- autorización;
- separación por usuario;
- migraciones;
- transacciones;
- constraints;
- índices;
- logs;
- observabilidad;
- backups;
- secretos por entorno;
- rate limiting;
- validación de entradas;
- almacenamiento de archivos;
- jobs/scheduler;
- tests de integración.

Puede existir almacenamiento local/offline como cache, pero no como única fuente productiva.

---

# 26. Contratos de eventos

Los eventos deben tener versión y esquema.

Ejemplos:

```text
aegis.sleep.started
aegis.sleep.ended
aegis.sleep.logged
aegis.nutrition.meal.logged
aegis.nutrition.meal.corrected
aegis.hydration.logged
aegis.activity.logged
aegis.symptom.logged
aegis.medication.logged
aegis.body.measurement.logged
aegis.inventory.item.added
aegis.inventory.stock.changed
aegis.purchase.logged
aegis.plan.created
aegis.plan.replanned
aegis.alert.created
aegis.agent.action.completed
aegis.agent.action.failed
aegis.export.generated
```

Cada evento debe incluir correlationId, actor, evidence, schemaVersion y timestamp.

---

# 27. Conversación universal

La entrada principal de Aegis debe estar siempre disponible.

Debe soportar progresivamente:

- texto;
- voz;
- imagen/cámara;
- documentos;
- recibos;
- etiquetas;
- menú;
- datos importados.

## 27.1 Chat global

Scope = Aegis completo.

Aegis decide dominios.

## 27.2 Chat contextual por módulo

Cada módulo puede mostrar un chat contextual, pero sigue siendo Aegis Core con scope restringido/preferente.

Ejemplo:

```text
chatGlobal.scope = aegis
chatNutrition.scope = nutrition
chatSleep.scope = sleep
chatInventory.scope = inventory
```

El contexto debe poder viajar entre chats.

“Ver en Sueño” no debe iniciar una conversación desde cero.

---

# 28. Preguntas inteligentes

Aegis debe preguntar únicamente cuando la información faltante tenga impacto material.

Ejemplo correcto:

“¿La carne era frita, asada o guisada? Cambia significativamente la estimación.”

Ejemplo incorrecto:

interrogar al usuario sobre 12 campos que pueden dejarse como desconocidos.

Toda pregunta debe tener:

- razón;
- impacto;
- prioridad;
- posibilidad de omitir;
- estado pending/resolved.

---

# 29. Sistema de evidencia

Niveles sugeridos:

```text
MEASURED
USER_CONFIRMED
DEVICE_REPORTED
DOCUMENT_PARSED_HIGH
DOCUMENT_PARSED_MEDIUM
VISUAL_ESTIMATE_HIGH
VISUAL_ESTIMATE_MEDIUM
TEXT_INFERRED_HIGH
TEXT_INFERRED_MEDIUM
MODEL_ESTIMATE
UNKNOWN
```

Cada dato importante puede tener:

- source;
- confidence;
- capturedAt;
- agent;
- evidenceLink;
- assumptions.

---

# 30. Reportes y exportación universal

Los datos son únicos. La presentación cambia.

```text
Canonical Aegis Dataset
          ↓
Report Assembler
          ↓
  ┌───────┼────────┬────────┬────────┬────────┐
  ▼       ▼        ▼        ▼        ▼        ▼
Screen   Table     XLSX     PDF      DOCX     JSON/CSV
```

## 30.1 El usuario puede elegir formato

Ejemplos:

- “Muéstrame la semana” → tabla/pantalla.
- “Exporta todo” → XLSX.
- “Hazme un informe bonito” → PDF.
- “Necesito editarlo” → DOCX.
- “Dame los datos crudos” → JSON/CSV.

## 30.2 Preferencias

Aegis puede recordar:

- formato semanal preferido;
- detalle técnico;
- incluir tablas;
- incluir gráficos;
- incluir bioquímica;
- incluir anexos.

La preferencia puede sobreescribirse en cada solicitud.

## 30.3 Reportes

Debe soportar:

- diario;
- semanal;
- mensual;
- por dominio;
- rango personalizado;
- evolución;
- auditoría;
- exportación completa;
- reporte compartible con terceros autorizado por usuario.

---

# 31. Contrato XLSX — referencia obligatoria

El formato XLSX debe conservar conceptualmente la estructura de la matriz `SALUD_METABOLISMO_EDYAN.xlsx` y ampliarla sin destruir sus principios.

No generar simplemente un CSV renombrado. Debe ser un workbook con hojas, formato, tablas, fórmulas, dashboard y reportes.

## 31.1 Hojas existentes a preservar conceptualmente

### `00_DASHBOARD_SALUD`

Debe resumir:

- Fecha activa
- Calorías hoy / Meta / Estado / Notas
- Proteína hoy / Meta / Estado / Notas
- Carbohidratos hoy / Meta / Estado / Notas
- Grasas hoy / Meta / Estado / Notas
- Agua hoy / Meta / Estado / Notas
- Ejercicio min hoy / Meta / Estado / Notas
- Sueño horas / Meta / Estado / Notas
- Energía prom / Meta / Estado / Notas
- Hambre prom / Meta / Estado / Notas
- Dolor max hoy / Meta / Estado / Notas
- Adherencia hoy / Meta / Estado / Notas
- Lectura metabólica: última etapa, sustrato probable, proceso bioquímico, interpretación, acción y notas.

### `01_PARAMETROS`

Columnas:

`Parametro | Valor | Unidad | Notas`

Debe almacenar configuración y metas editables, no hardcodeadas.

### `02_COMIDAS_DIARIAS`

Columnas obligatorias:

`Fecha | Hora | Tipo comida | Foto / link | Descripcion | Calorias min | Calorias estimadas | Calorias max | Proteina g | Carbohidratos g | Grasas g | Fibra g | Agua ml | Confiabilidad | Etiquetas metabolicas | Observacion`

### `03_FOTOS_COMIDA`

Evolucionar a evidencia visual general si conviene, manteniendo compatibilidad.

Columnas base:

`Fecha | Hora | Foto / link | Comida relacionada | Descripcion visual | Confiabilidad | Procesado por | Observacion`

Puede ampliarse con `Tipo evidencia` para nevera, recibo, etiqueta, plato, menú, etc.

### `04_METABOLISMO_DIARIO`

Columnas:

`Fecha | Hora | Ultima comida | Horas ayuno | Carbs acumulados | Calorias acumuladas | Ejercicio hoy | Etapa probable | Sustrato probable | Proceso bioquimico probable | Confianza | Senales subjetivas | Notas bioquimicas / LDH / lactato / glucogeno | Observacion`

### `05_EJERCICIO`

Columnas:

`Fecha | Hora | Actividad | Duracion min | Intensidad | RPE 1-10 | Calorias estimadas | Dolor antes | Dolor despues | Perro | Gimnasio | Trote | Zona trabajada | Observacion`

La implementación general debe permitir otros tipos de actividad sin romper el esquema.

### `06_SUENO_DESCANSO`

Columnas:

`Fecha | Hora dormir | Hora despertar | Horas en cama | Calidad 1-10 | Despertares | REM estimada / wearable | Sueño profundo / wearable | Apoyo dormir | Somnolencia | Pantallas noche | Rutina previa | Evaluacion sueño | Observacion`

### `07_ENERGIA_ANIMO`

Columnas:

`Fecha | Hora | Energia 1-10 | Animo 1-10 | Hambre 1-10 | Ansiedad 1-10 | Enfoque 1-10 | Irritabilidad 1-10 | Carga mental 1-10 | Contexto | Observacion`

### `08_MEDICACION`

Columnas:

`Fecha | Hora | Medicamento / suplemento | Dosis | Motivo | Tomado | Efecto percibido | Efecto secundario | Prescrito | Recordatorio | Observacion`

### `09_DOLOR_SINTOMAS`

Columnas:

`Fecha | Hora | Zona | Intensidad 0-10 | Tipo dolor | Activador | Posicion / movimiento | Duracion | Medicacion usada | Mejora | Alerta | Observacion`

### `10_PESO_MEDIDAS`

Columnas:

`Fecha | Peso kg | Cintura cm | Cuello cm | Cadera cm | IMC | Cambio peso vs anterior | Energia semana | Observacion`

### `11_HABITOS_DIARIOS`

Columnas:

`Fecha | Agua ml | Pasos | Sol min | Movilidad | Comida preparada | Ayuno cumplido | Perro | Rutina sueño | Pantallas noche | Adherencia 0-100 | Observacion`

### `12_ALERTAS`

Columnas:

`Fecha | Tipo alerta | Nivel | Disparador | Accion sugerida | Estado | Observacion`

### `13_RESUMEN_SEMANAL`

Columnas:

`Semana | Inicio | Fin | Calorias prom | Proteina prom | Carbs prom | Grasas prom | Ejercicio min | Sueno prom | Dolor prom | Peso inicio | Peso fin | Cambio peso | Evaluacion | Ajustes`

### `14_REPORTES`

Debe incluir indicadores calculados y tendencias.

### `15_LISTAS`

Listas maestras/validaciones para estados, confiabilidad, intensidad, tipos de comida, zonas, etapas metabólicas, prioridades y categorías.

### `16_INSTRUCCIONES`

Debe documentar reglas del workbook y advertir que fórmulas, estructura y dashboards no se modifican durante una simple operación de registro.

## 31.2 Nuevas hojas requeridas

### `17_DESPENSA_HOGAR`

`ID | Categoria | Producto | Cantidad | Unidad | Ubicacion | Disponibilidad | Fecha ingreso | Vencimiento estimado | Vencimiento confirmado | Confianza | Fuente | Ultima actualizacion | Observacion`

### `18_MOVIMIENTOS_INVENTARIO`

`Fecha | Hora | Transaction ID | Item ID | Producto | Tipo movimiento | Cantidad delta | Unidad | Saldo resultante | Motivo | Evento origen | Evidencia | Confianza | Agente responsable | Observacion`

### `19_COMPRAS_RECIBOS`

`Fecha | Hora | Compra ID | Comercio | Producto | Categoria | Cantidad | Unidad | Precio unitario | Valor total | Medio de pago | Recibo / link | Ingreso a inventario | Confianza | Observacion`

### `20_RECETAS_PREPARACIONES`

`ID | Tipo | Nombre | Porciones | Ingredientes | Cantidades | Calorias totales | Proteina | Carbohidratos | Grasas | Fibra | Tiempo min | Equipo | Tecnica | Fecha preparacion | Vencimiento | Ubicacion | Estado | Observacion`

### `21_PLAN_VIVO`

`Fecha | Hora / franja | Plan ID | Tipo | Descripcion | Modulo propietario | Estado | Prioridad | Dependencias | Objetivo | Agente responsable | Resultado | Observacion`

### `22_AUDITORIA_AEGIS`

`Fecha | Hora | Action ID | Session ID | Entrada usuario | Dominios | Supervisor | Agentes | Herramientas | Lecturas | Escrituras | Evidencia | Confianza | Confirmacion requerida | Resultado | Error | Rollback | Observacion`

### `23_EXPORTACIONES`

`Fecha | Hora | Export ID | Tipo reporte | Rango | Formato | Secciones | Destino | Estado | Hash / version | Observacion`

## 31.3 Regla del exportador XLSX

Usar una plantilla versionada.

El exportador debe:

- crear/actualizar hojas correctas;
- conservar estilo;
- conservar fórmulas;
- actualizar dashboards;
- validar tipos;
- no alterar columnas por capricho;
- permitir exportación completa o por rango;
- incluir metadatos de versión;
- producir archivo real `.xlsx`.

---

# 32. PDF y DOCX

## PDF

Debe ser un informe visual y de lectura, no una copia literal de Excel.

Estructura posible:

1. portada;
2. resumen ejecutivo;
3. indicadores;
4. tendencias;
5. eventos importantes;
6. explicación fisiológica/metabólica cuando aplique;
7. alertas;
8. recomendaciones;
9. tablas seleccionadas;
10. anexos y evidencia.

## DOCX

Misma base de datos, pero editable.

Debe soportar narrativa, tablas, gráficos, notas y anexos.

---

# 33. Dashboard global de Aegis

La pantalla principal debe sentirse como un centro de vida, no un panel médico ni una hoja de cálculo.

## 33.1 Elementos obligatorios

### A. Aegis Command / Universal Chat

Entrada principal:

`Escribe, habla, toma una foto o adjunta algo…`

Debe ser el centro de la experiencia.

### B. “Ahora”

Resumen contextual:

- tiempo desde última comida;
- estado metabólico probable;
- estado de energía reciente;
- última actividad;
- recuperación/sueño;
- próximo elemento del plan.

Debe mostrar confianza y fuente.

### C. “Mi Día”

Timeline universal.

### D. “Aegis detecta”

Señales útiles:

- faltante de información;
- alimento próximo a vencer;
- patrón detectado;
- inconsistencia;
- recordatorio relevante;
- oportunidad de planificación.

### E. Plan Vivo

Ahora / próximo / después.

### F. Métricas rápidas

- sueño;
- alimentación;
- agua;
- actividad;
- energía;
- peso/tendencia si existe;
- dolor/síntomas activos;
- hábitos.

### G. Despensa/Hogar

- bajo stock;
- próximos a vencer;
- lista de compras;
- qué falta.

### H. Reportes

- diario;
- semanal;
- exportar.

### I. Transparencia

Acceso discreto a:

- acciones recientes de Aegis;
- por qué tomó una decisión;
- auditoría;
- correcciones.

---

# 34. Dashboards por módulo

Cada dashboard debe compartir componentes comunes:

- `MetricCard`;
- `TrendChart`;
- `Timeline`;
- `EvidenceBadge`;
- `ConfidenceBadge`;
- `ActionReceipt`;
- `AgentChat`;
- `WhyAegisBelievesThis`;
- `CorrectionDrawer`;
- `ExportMenu`;
- `AlertCard`;
- `PlanCard`.

No crear diseños completamente diferentes por módulo.

---

# 35. Action Receipt

Después de una acción significativa, Aegis puede mostrar un recibo compacto:

```text
Hecho
✓ comida registrada
✓ plan actualizado
✓ inventario actualizado
✓ ledger verificado

Ver detalles
```

Si algo falló:

```text
Parcial
✓ comida registrada
✕ no pude actualizar inventario

Reintentar / corregir
```

Nunca ocultar un fallo bajo un mensaje de éxito.

---

# 36. Diseño visual premium oscuro

Sí: **negro + violeta combinan muy bien** para AION si el violeta se usa como acento y profundidad, no como fondo saturado de toda la aplicación.

## 36.1 Dirección visual

- premium;
- técnica;
- sobria;
- futurista sin estética gamer infantil;
- alto contraste;
- superficies oscuras profundas;
- bordes sutiles;
- violetas controlados;
- datos legibles;
- animaciones discretas;
- glow solo para estados inteligentes importantes.

## 36.2 Paleta recomendada

```css
--aion-bg: #070709;
--aion-bg-elevated: #0D0B12;
--aion-surface-1: #111017;
--aion-surface-2: #17131F;
--aion-surface-3: #1D1728;
--aion-border: #2B2338;
--aion-border-soft: rgba(196,181,253,0.12);

--aion-violet: #7C3AED;
--aion-violet-strong: #6D28D9;
--aion-violet-bright: #8B5CF6;
--aion-lavender: #C4B5FD;
--aion-lavender-soft: #DDD6FE;

--aion-text: #F4F4F5;
--aion-text-muted: #A1A1AA;
--aion-text-dim: #71717A;

--aion-success: #22C55E;
--aion-warning: #F59E0B;
--aion-danger: #EF4444;
--aion-info: #38BDF8;
```

## 36.3 Regla de uso

- 70–80% negro/grafito;
- 10–20% grises/bordes;
- 5–10% violeta/lavanda como acento;
- colores semánticos solo cuando expresen estado.

## 36.4 Evitar

- fondos completamente violetas;
- neón excesivo;
- gradientes en todas las tarjetas;
- sombras enormes;
- glassmorphism en exceso;
- iconografía infantil;
- dashboards saturados;
- diez colores sin significado.

## 36.5 Componentes

- tarjetas con fondo #111017;
- border 1px suave;
- radius 12–16px;
- encabezados blancos;
- labels lavanda;
- gráficos con base neutral y serie principal violeta;
- hover con elevación ligera;
- botones primarios violetas;
- botones secundarios transparentes;
- foco accesible lavanda.

Dark mode debe ser el modo oficial inicial. Light mode puede agregarse después sin bloquear el producto.

---

# 37. Visualización de agentes

El usuario no necesita ver 60 agentes todo el tiempo.

La complejidad interna se oculta por defecto.

Modo normal:

> “Aegis está analizando…”

Modo transparencia:

```text
Nutrition Supervisor
  ├─ Meal Interpreter ✓
  ├─ Portion Estimator ✓
  ├─ Nutrition Calculator ✓
  └─ Audit Agent ✓
```

Debe existir para confianza, debugging y auditoría avanzada.

---

# 38. Planificación contextual real

Aegis no recomienda comidas de forma aislada.

Para una recomendación puede combinar:

- hora;
- sueño;
- última comida;
- hambre;
- peso/objetivo si está configurado;
- actividad planificada;
- actividad realizada;
- inventario;
- tiempo para cocinar;
- preferencias;
- ingredientes próximos a vencer;
- plan del día;
- historial de adherencia.

La respuesta debe explicar por qué se recomienda algo.

---

# 39. Recetas

El sistema de recetas debe poder:

- generar recetas desde inventario;
- adaptar por número de porciones;
- cambiar ingredientes;
- cambiar técnica;
- estimar nutrientes;
- estimar costo cuando haya datos;
- estimar tiempo;
- usar equipo disponible;
- crear meal prep;
- crear batch cooking;
- registrar preparación;
- registrar consumo parcial;
- descontar inventario mediante transacciones;
- generar lista de faltantes;
- priorizar productos próximos a vencer;
- aprender preferencias culinarias;
- guardar recetas favoritas;
- modificar recetas habituales;
- distinguir receta planeada de comida realmente consumida.

---

# 40. Compras y hogar

Aegis debe aceptar:

- texto;
- foto del recibo;
- foto del mercado;
- foto de nevera/despensa;
- lista manual.

Debe extraer lo que pueda, marcar confianza y preguntar lo materialmente ambiguo.

Ejemplo:

“Compré cuatro latas de atún por 28.000.”

Aegis puede:

- registrar compra;
- actualizar inventario;
- conservar costo;
- emitir evento a AION Core para Finanzas si está conectado;
- actualizar recomendaciones y lista de compras.

---

# 41. Autoconstrucción entendida correctamente

Aegis debe **autoconfigurarse y personalizarse** con uso.

Puede aprender:

- horarios;
- alimentos frecuentes;
- marcas;
- tamaño de porciones habituales;
- tiempos de cocina;
- patrones de compra;
- respuesta a notificaciones;
- formatos preferidos;
- relaciones entre eventos.

No debe modificar autónomamente código de producción sin pipeline controlado.

La evolución autónoma ocurre principalmente mediante:

- memoria;
- configuración;
- reglas;
- perfiles;
- skills registradas;
- modelos/policies versionados.

---

# 42. Seguridad, privacidad y confianza

Aegis maneja información privada. Desde arquitectura inicial debe contemplar:

- autenticación;
- autorización;
- aislamiento por usuario;
- cifrado en tránsito;
- cifrado en reposo donde aplique;
- secretos fuera del código;
- consentimiento para integraciones;
- exportación;
- eliminación;
- revocación de permisos;
- auditoría;
- historial de accesos sensibles;
- minimización de datos;
- política de retención;
- backups;
- recuperación;
- no enviar a proveedores externos más datos de los necesarios.

---

# 43. Integraciones futuras

Diseñar contratos desde ahora, aunque no todas se implementen inmediatamente:

- Google Drive;
- Google Calendar;
- Health Connect;
- Apple Health;
- wearables;
- básculas;
- servicios meteorológicos/contextuales;
- OCR/visión multimodal;
- servicios de alimentos;
- almacenamiento de documentos;
- AION Core;
- futura AION Finance/Ops.

Cada integración debe tener adapter independiente.

---

# 44. Evaluación de agentes

Cada agente debe poder evaluarse con casos reproducibles.

Métricas posibles:

- precisión de dominio;
- precisión de extracción;
- tasa de preguntas innecesarias;
- tasa de omisión de preguntas necesarias;
- invented-data rate = 0 deseado;
- success claim mismatch = 0;
- consistencia entre agentes;
- tiempo;
- costo;
- errores de persistencia;
- calidad de explicación;
- satisfacción/aceptación del usuario.

Crear datasets de prueba sintéticos sin usar datos personales reales.

---

# 45. Testing obligatorio

## Unit

- dominio;
- cálculos;
- validadores;
- policies;
- exportadores.

## Contract

- eventos;
- agentes;
- APIs;
- adapters.

## Integration

- chat → agentes → persistencia → ledger;
- comida → nutrientes → metabolismo → plan;
- compra → inventario → receta;
- sueño → recuperación → plan;
- corrección → rollback/recalculo.

## E2E

Casos conversacionales completos.

## Regression

Especialmente para fallas conocidas del prototipo.

---

# 46. Observabilidad

Debe existir:

- logs estructurados;
- correlation IDs;
- agent spans;
- tool calls;
- errores;
- latencia;
- tokens/costo si aplica;
- tasa de fallos;
- acciones revertidas;
- métricas por módulo.

No registrar secretos en logs.

---

# 47. Estados REAL / PARTIAL / MOCK / PLANNED

Crear y mantener `AION_BUILD_STATUS.md`.

Ejemplo:

| Capability | Status | Evidence | Tests | Notes |
|---|---|---|---|---|
| Inventory transactions | REAL | path | passing | ... |
| Real image recognition | PARTIAL | path | ... | provider pending |
| Drive upload | MOCK | path | no | contract only |
| Wearable sync | PLANNED | - | - | future |

Reglas:

- `REAL`: implementado, conectado, persistente y probado.
- `PARTIAL`: funciona solo en parte o falta endurecimiento.
- `MOCK`: simulación explícita.
- `PLANNED`: especificado pero no implementado.

---

# 48. Estrategia de implementación para Antigravity

Antigravity debe construir el alcance completo en fases internas, pero **continuar automáticamente de una fase a la siguiente** sin esperar aprobación por cada decisión ya definida en este documento.

El usuario hará la auditoría después módulo por módulo.

## Fase 0 — auditoría del repositorio

- inventariar apps/packages;
- detectar código real, parcial y mock;
- ejecutar build/test;
- crear `AION_BUILD_STATUS.md`;
- no borrar funcionalidades reales.

## Fase 1 — normalización arquitectónica

- separar AION Core global de AION Aegis Core;
- crear contratos de agentes;
- crear capability registry;
- crear runtime;
- crear políticas de permisos/evidencia.

## Fase 2 — datos y backend

- definir modelos canónicos;
- durable persistence;
- migraciones;
- API;
- ledger;
- archivos;
- jobs;
- auth.

## Fase 3 — supervisores y especialistas

Implementar supervisores de todos los módulos y especialistas descritos.

Los agentes pueden comenzar con modelos/providers configurables, pero no con respuestas hardcodeadas que pretendan inteligencia real.

## Fase 4 — servicios científicos y culinarios

- physiology;
- biochemistry;
- food/nutrition engine;
- recipes;
- portions;
- evidence;
- vision adapters.

## Fase 5 — autonomía

- scheduler;
- signals;
- intervention policy;
- follow-ups;
- verification;
- audit.

## Fase 6 — reportes/exportación

- canonical report builder;
- table;
- XLSX real;
- PDF;
- DOCX;
- JSON/CSV;
- preferencias.

## Fase 7 — dashboards

Construir dashboard global y dashboards de cada módulo con el sistema visual premium definido.

## Fase 8 — UX conversacional

- chat universal;
- chats contextuales;
- fotos;
- voz preparada;
- action receipts;
- confirmaciones;
- correcciones;
- transparencia de agentes.

## Fase 9 — pruebas y cierre

- build completo;
- unit/contract/integration/E2E;
- accesibilidad;
- responsive;
- seguridad básica;
- actualizar `AION_BUILD_STATUS.md`.

---

# 49. Regla de construcción continua

Mientras implementa:

1. hacer cambios pequeños y coherentes;
2. correr build/tests;
3. corregir antes de acumular más errores;
4. continuar;
5. no detenerse para preguntar sobre una decisión ya resuelta en este Blueprint;
6. documentar cualquier decisión nueva de arquitectura;
7. no esconder TODOs críticos;
8. no inventar integración “real” si solo existe interfaz;
9. conservar compatibilidad cuando sea razonable;
10. dejar el producto navegable al final de cada fase.

---

# 50. Flujo de auditoría del usuario

Después de que Antigravity implemente el conjunto, el trabajo se revisará por módulos.

Flujo:

```text
Antigravity crea
   ↓
Edyan prueba y audita
   ↓
Se registra corrección
   ↓
Agente corrige
   ↓
Tests
   ↓
Edyan vuelve a auditar
```

Las correcciones aprobadas son acumulativas.

No reintroducir fallas que ya fueron corregidas.

Orden sugerido de auditoría:

1. Aegis Core / Runtime;
2. persistencia / Ledger;
3. Mi Día;
4. Sueño;
5. Alimentación;
6. Metabolismo;
7. Actividad;
8. Hidratación;
9. Energía/Ánimo;
10. Medicación;
11. Dolor/Síntomas;
12. Peso/Cuerpo;
13. Hábitos;
14. Despensa/Hogar;
15. Plan Vivo;
16. Autonomía;
17. Reportes/exportación;
18. dashboards;
19. integraciones;
20. experiencia global.

---

# 51. Criterio de “terminado”

Una pantalla no significa módulo terminado.

Un módulo se considera funcional cuando:

- tiene contrato de datos;
- tiene persistencia;
- tiene supervisor;
- tiene especialistas relevantes;
- puede leer/escribir sin inventar;
- produce eventos;
- aparece en Ledger;
- tiene pruebas;
- tiene dashboard;
- tiene chat contextual;
- puede corregirse;
- puede exportarse;
- puede explicar evidencia;
- maneja errores;
- se integra con Aegis Core;
- está clasificado correctamente en build status.

---

# 52. Casos de aceptación globales

## Caso A — despertar

Entrada:

> “Me acabo de levantar”.

Aegis debe:

- detectar evento de sueño;
- determinar si sabe la hora de inicio;
- preguntar si falta un dato material;
- registrar despertar;
- actualizar sueño;
- recalcular contexto temporal/metabólico;
- consultar plan;
- consultar despensa si va a recomendar comida;
- adaptar respuesta a objetivos/preferencias;
- no inventar valores fisiológicos;
- registrar en Ledger;
- responder de forma natural.

## Caso B — comida con foto

- analizar imagen real;
- mostrar candidatos y confianza;
- preguntar ambigüedad material;
- estimar porción con rango;
- calcular nutrientes desde fuente determinista;
- registrar solo al confirmar cuando aplique;
- actualizar metabolismo/plan;
- descontar inventario solo si hay correspondencia y transacción;
- verificar;
- emitir action receipt.

## Caso C — compra

> “Compré cuatro latas de atún por 28.000”.

- registrar compra;
- agregar cuatro unidades;
- conservar precio;
- actualizar lista;
- emitir evento financiero externo solo si integración existe;
- no duplicar gasto dentro de Aegis como contabilidad global.

## Caso D — qué comer

> “Tengo hambre”.

Aegis debe consultar al menos:

- tiempo;
- última ingesta;
- hambre;
- plan;
- inventario;
- objetivo;
- preferencias;
- actividad relevante;
- productos a vencer.

Debe generar opciones reales y explicar por qué.

## Caso E — dolor

> “Me duele mucho el pecho”.

Aegis debe priorizar seguridad, registrar lo reportado si el usuario lo desea y no seguir como si fuera una simple métrica de bienestar.

## Caso F — exportación

> “Dame toda mi bitácora en Excel”.

Debe generar workbook real con las hojas del contrato, datos del rango solicitado, dashboards/reportes actualizados y metadatos de versión.

## Caso G — auditoría

El usuario debe poder preguntar:

> “¿Por qué Aegis dice que me quedan tres huevos?”

Y recibir reconstrucción de movimientos y evidencia.

---

# 53. Qué NO hacer

- No convertir cada skill en una pantalla.
- No convertir cada función en un agente innecesario.
- No reducir el sistema a un solo agente gigantesco.
- No duplicar la misma verdad entre módulos.
- No usar hardcodes como si fueran inferencia real.
- No responder éxito después de un catch.
- No esconder incertidumbre.
- No inferir diagnósticos.
- No depender exclusivamente de localStorage.
- No diseñar primero una UI brillante sobre lógica falsa.
- No romper el monorepo por una reescritura total sin necesidad.
- No construir dashboards desconectados de datos reales.
- No generar exportaciones que pierdan estructura.
- No obligar al usuario a entrar a un módulo para registrar un evento cotidiano.

---

# 54. Visión final

AION Aegis debe sentirse como una sola inteligencia personal, aunque internamente sea una orquesta compleja de supervisores, especialistas, engines, herramientas, memoria, datos y auditoría.

La experiencia ideal es:

> el usuario vive y conversa; Aegis organiza.

Aegis escucha, entiende, registra, conecta, pregunta, calcula, planifica, recuerda, verifica, audita y aprende.

Los módulos existen para mantener límites claros de datos y responsabilidad.

Los agentes existen para aportar especialización profunda.

Aegis Core existe para que toda esa complejidad se convierta en una sola interacción coherente.

Los dashboards existen para que el usuario pueda inspeccionar su realidad.

El Ledger existe para que Aegis pueda demostrar qué hizo.

Las exportaciones existen para que los datos sigan perteneciendo al usuario.

La autonomía existe para que el producto deje de ser un formulario inteligente y se convierta en un asistente real.

---

# 55. Mandato para el agente constructor

**Construir el sistema, no una demostración.**

Implementar todos los módulos y dashboards descritos, reutilizando y corrigiendo la base actual. Priorizar arquitectura, datos, persistencia, agentes, contratos, pruebas y auditabilidad. Después acoplar la capa visual premium negra/violeta.

Cuando una capacidad todavía no pueda ser real, dejar el contrato implementado y marcarla explícitamente como `PARTIAL`, `MOCK` o `PLANNED`; jamás fingir que está terminada.

Crear `AION_BUILD_STATUS.md`, mantenerlo actualizado y dejar Aegis listo para que el usuario audite módulo por módulo.
