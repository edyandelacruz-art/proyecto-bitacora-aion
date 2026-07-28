# AION AEGIS — ORGANIC UX / STITCH MASTER SPEC

**Documento normativo de diseño visual e interacción**  
**Uso:** Google Stitch, Antigravity y cualquier agente que construya la capa visual de AION Aegis.  
**Principio:** modificar presentación, navegación y microinteracciones SIN romper arquitectura, contratos, persistencia, agentes, eventos, Ledger ni lógica de dominio.

---

# 0. INSTRUCCIÓN MAESTRA

Diseña AION Aegis como una **inteligencia personal viva, orgánica, multimodal y progresivamente autónoma**, no como un dashboard empresarial, no como una colección de 12 tarjetas y no como un formulario de salud.

La experiencia principal se llama **Aegis Core**.

Aegis Core es la superficie con la que el usuario conversa. La complejidad interna de supervisores, agentes, engines, memoria y auditoría existe detrás y se revela solo cuando aporta valor.

> **El usuario vive y conversa; Aegis organiza.**

> **Edyan produce acontecimientos; el sistema produce estructura.**

La interfaz debe sentirse:

- orgánica;
- fluida;
- respirable;
- elegante;
- premium;
- contextual;
- profundamente interactiva;
- mobile-first;
- útil sin exigir navegación constante;
- capaz de mostrar profundidad sin saturación.

---

# 1. COSAS QUE NO SE DEBEN HACER

NO diseñar:

- un dashboard con 12 o 15 cards visibles simultáneamente;
- una landing page de marketing;
- una pantalla clínica;
- una hoja de cálculo convertida en app;
- una interfaz gamer/neón excesiva;
- un formulario gigante;
- un menú inferior con 10 iconos;
- un chat que solo devuelve párrafos de texto;
- una aplicación en la que cada dato requiera abrir un módulo;
- una UI donde el usuario deba elegir qué agente debe trabajar;
- una UI que revele toda la arquitectura multiagente todo el tiempo;
- una pantalla móvil donde todo intente caber en el primer viewport;
- un grid permanente de métricas;
- cifras estimadas visualmente como si fueran exactas.

No borrar, simplificar o alterar capacidades existentes por razones estéticas.

---

# 2. IDENTIDAD VISUAL OFICIAL

Logo principal de AION Aegis:

`apps/aion-aegis/public/brand/aion-aegis-logo-dark.svg`

Usar el logo como referencia de identidad, no como textura repetida.

## Paleta

```css
--aion-bg: #070709;
--aion-bg-elevated: #0D0B12;
--aion-surface-1: #111017;
--aion-surface-2: #17131F;
--aion-surface-3: #1D1728;

--aion-violet: #7C3AED;
--aion-violet-strong: #6D28D9;
--aion-violet-bright: #8B5CF6;
--aion-lavender: #C4B5FD;
--aion-lavender-soft: #DDD6FE;

--aion-gold: #D6B36A;
--aion-gold-bright: #F3D18A;
--aion-gold-dark: #A9803A;

--aion-text: #F4F4F5;
--aion-text-muted: #A1A1AA;
--aion-text-dim: #71717A;

--aion-success: #22C55E;
--aion-warning: #F59E0B;
--aion-danger: #EF4444;
--aion-info: #38BDF8;
```

## Proporción visual

Aproximadamente:

- 75% negro/grafito;
- 15% violeta/lavanda;
- 5% dorado;
- 5% blanco/neutral.

El dorado expresa:

- jerarquía;
- acción excepcional;
- inteligencia premium;
- selección destacada;
- hitos o estados relevantes.

No usar dorado en cada borde ni violeta brillante en cada tarjeta.

## Acabado

- superficies oscuras profundas;
- sombras discretas;
- bordes 1px muy suaves;
- radius 12–18 px;
- glow violeta solo para foco, actividad inteligente o estado vivo;
- gold highlight solo en elementos de alta jerarquía;
- iconografía lineal, simple, coherente;
- logo puede conservar acabado 3D premium;
- UI cotidiana debe ser más plana y limpia.

---

# 3. ARQUITECTURA DE INFORMACIÓN

La aplicación se organiza en dos niveles:

1. **Aegis Core** — experiencia cotidiana y conversacional.
2. **Módulos** — profundidad, inspección, edición, análisis, auditoría y configuración específica.

Aegis Core NO debe duplicar el dashboard completo de cada módulo.

Aegis Core solo muestra **resúmenes contextualmente pertinentes**.

---

# 4. NAVEGACIÓN GLOBAL

## 4.1 Desktop / tablet grande

Usar **sidebar colapsable** a la izquierda.

Estado expandido:

- logo AION Aegis arriba;
- nombre de la app;
- icono + nombre de cada destino;
- grupos accordion.

Estado contraído:

- logo reducido;
- solo iconos;
- tooltip al hover;
- selección visible mediante acento violeta/dorado muy discreto.

### Estructura

```text
AION AEGIS

◉ Aegis Core
◷ Mi Día

MI ESTADO
  Cuerpo y peso
  Metabolismo
  Energía, ánimo, hambre y foco
  Dolor y síntomas

CUIDADO DIARIO
  Sueño y recuperación
  Actividad y ejercicio
  Hidratación
  Hábitos y rutinas
  Medicación y suplementos

ALIMENTACIÓN Y HOGAR
  Alimentación / Nutrición
  Despensa / Compras / Hogar
  Recetas / Preparaciones

PLANIFICACIÓN
  Plan Vivo
  Alertas / Seguimiento

INFORMACIÓN
  Reportes
  Exportaciones
  Auditoría Aegis

SISTEMA
  Perfil y objetivos
  Preferencias
  Memoria
  Autonomía
  Notificaciones
  Privacidad y permisos
  Integraciones
  Configuración
```

Los grupos se expanden y contraen independientemente.

No mostrar todos los subitems abiertos simultáneamente por defecto.

## 4.2 Mobile

La sidebar se transforma en **navigation drawer** invocado por hamburger.

Bottom navigation fija con solo cuatro destinos:

```text
Aegis Core     Mi Día     + Registrar     Más
```

`+ Registrar` debe ser visualmente destacado pero no enorme.

`Más` abre drawer con todos los módulos y configuración.

---

# 5. AEGIS CORE — PRINCIPIO DE DISEÑO

Aegis Core debe ser una mezcla entre:

- conversación moderna;
- bitácora viva;
- asistente personal;
- resumen contextual;
- superficie de decisiones;
- sistema visual de acciones.

No debe sentirse como “ChatGPT con otro color”.

Tampoco debe sentirse como un dashboard.

Debe tener **progresive disclosure**: primero lo importante, luego más si el usuario lo pide o hace scroll.

---

# 6. PRIMER VIEWPORT MÓVIL

En un teléfono, el primer viewport debe contener aproximadamente:

1. header mínimo;
2. saludo/contexto breve;
3. composer multimodal protagonista;
4. máximo 2–3 acciones rápidas contextuales;
5. una sola señal contextual importante si existe.

Ejemplo conceptual:

```text
┌────────────────────────────┐
│ ☰  AION Aegis       🔔  👤 │
│                            │
│ Buenas noches              │
│ ¿Qué está pasando?         │
│                            │
│ ┌────────────────────────┐ │
│ │ Cuéntame, muestra o    │ │
│ │ pregúntame algo…       │ │
│ │                        │ │
│ │  🎙   📷   📎      ➜  │ │
│ └────────────────────────┘ │
│                            │
│ [Ya comí] [Tomé agua]      │
│ [¿Qué puedo comer?]        │
│                            │
│ Aegis nota                 │
│ Dormiste menos que tu      │
│ patrón habitual.       >   │
└────────────────────────────┘
```

No colocar ocho métricas aquí.

---

# 7. FEED VERTICAL ORGÁNICO

Después del primer viewport, el usuario puede desplazarse naturalmente.

El feed NO es fijo. Aegis decide qué secciones tienen valor hoy.

Orden de prioridad sugerido:

1. `Ahora / Pulso de hoy`;
2. `Aegis detecta`;
3. `Plan Vivo`;
4. `Mi Día`;
5. `Tus módulos` resumidos;
6. `Ayer / tendencia reciente` si aporta contexto;
7. `Reportes / exportación` como acción secundaria.

Una sección sin información útil puede:

- ocultarse;
- reducirse a una línea;
- quedar colapsada.

Nunca rellenar espacio con datos inventados.

---

# 8. “AHORA / PULSO DE HOY”

No construir siete cards.

Crear una superficie compacta con 2–4 datos verdaderamente útiles según contexto.

Ejemplo mañanero:

```text
AHORA
Sueño 6 h 42 min  ·  Despierto hace 18 min
Última ingesta 10 h 20 min  ·  Plan: caminar 09:30
```

Ejemplo tarde:

```text
AHORA
Almuerzo hace 2 h 10 min · Agua 1.4 L · Energía 7/10
Próximo: entrenamiento 18:30
```

Permitir:

- tap para ampliar;
- botón `¿Por qué?` cuando sea inferencia;
- badge discreto `medido / calculado / estimado / probable`;
- swipe horizontal solo si existen más indicadores pertinentes.

---

# 9. “AEGIS DETECTA”

Máximo 1–2 señales prominentes.

Las restantes bajo `Ver todas`.

Ejemplos:

```text
Aegis detecta
Los tomates podrían necesitar consumirse pronto.
[Ver recetas] [Ignorar]
```

```text
No encuentro almuerzo registrado y normalmente comes antes de esta hora.
[Ya comí] [Todavía no] [Omitir]
```

```text
Hoy dormiste 1 h 15 min menos que tu patrón reciente.
[Ver sueño] [Ajustar plan]
```

Toda intervención debe poder:

- resolverse;
- rechazarse;
- posponerse;
- silenciarse;
- explicar por qué apareció.

Esto refleja `InterventionPolicyAgent`.

---

# 10. PLAN VIVO

En Aegis Core mostrar solo:

- Ahora;
- Próximo;
- Después.

Máximo 3 elementos visibles.

Ejemplo:

```text
PLAN VIVO

AHORA
Preparar desayuno
[Hecho] [Cambiar]

PRÓXIMO · 11:00
Actividad
[Ver]

DESPUÉS · 13:30
Almuerzo estimado
```

Acciones:

- Hecho;
- Posponer;
- Cambiar;
- Ver detalle;
- Replanificar.

Swipe opcional:

- derecha = completar;
- izquierda = posponer / acciones.

Mostrar `Ver plan completo` para entrar al módulo.

---

# 11. MI DÍA EN CORE

Mostrar últimos 3–5 eventos, no toda la bitácora.

Ejemplo:

```text
MI DÍA
07:15  Desperté
07:27  350 ml de agua
08:10  Desayuno
10:42  Caminata 32 min

[Ver día completo]
```

Cada evento permite:

- tap → detalle;
- long press → acciones;
- corregir;
- agregar nota;
- ver evidencia;
- ver impacto;
- anular cuando sea reversible.

Nunca borrar silenciosamente: corrección `ANTES → DESPUÉS`.

---

# 12. TUS MÓDULOS — RESUMEN SIN SATURAR

NO usar parrilla 3x4 de cards.

Usar una de estas soluciones:

### Opción preferida: accordion compacto

```text
TUS MÓDULOS

Alimentación               En curso  >
Sueño                6 h 42 min       >
Actividad             32 min hoy      >
Despensa              2 por usar      >
Plan Vivo             3 pendientes    >

Ver todos los módulos
```

### Alternativa móvil
Carrusel horizontal de 2.3 cards visibles, cada una compacta, sin números excesivos.

### Regla
Cada módulo muestra solo:

- nombre;
- 1 indicador principal;
- 1 estado contextual;
- affordance de abrir.

El detalle vive dentro del módulo.

---

# 13. AYER / RESUMEN RECIENTE

No debe aparecer siempre.

Puede aparecer:

- al iniciar el día;
- cuando existió algo importante ayer;
- si Aegis detecta patrón relevante;
- si el usuario pregunta.

Ejemplo:

```text
AYER
Dormiste 7 h 18 min · 3 comidas · 54 min de actividad
Aegis detectó mejor hidratación que tu promedio reciente.
[Ver resumen]
```

No mostrar veinte indicadores.

---

# 14. COMPOSER MULTIMODAL

Debe ser el elemento interactivo principal.

Soporta visualmente:

- texto;
- voz;
- cámara;
- galería;
- archivo;
- documento;
- recibo;
- etiqueta;
- menú.

## Estado compacto sticky

Al hacer scroll:

```text
Preguntar a Aegis…     🎙  📷
```

Debe permanecer accesible encima de bottom navigation.

Tap → expande composer completo.

## Estado procesando

No usar spinner genérico únicamente.

Mostrar frases breves según acción:

- “Entendiendo el contexto…”
- “Revisando tu día…”
- “Analizando la imagen…”
- “Consultando despensa…”
- “Verificando antes de registrar…”

No mostrar cadena de razonamiento privada.

---

# 15. RESPUESTAS RICAS, NO SOLO TEXTO

Aegis puede responder con combinaciones de:

- texto corto;
- card accionable;
- mini timeline;
- imagen anotada;
- receta;
- comparación;
- progress/range;
- gráfica simple;
- tabla compacta;
- Action Receipt;
- botones;
- módulo relacionado;
- badge de evidencia;
- pregunta única de confirmación.

## Ejemplo “Tengo hambre”

```text
Aegis
Con lo que tienes y tu día de hoy, empezaría por estas dos:

[ Huevos + tomate ]
~310 kcal · 26 g proteína · 12 min
Usa tomates que conviene consumir pronto.
[Ver receta] [Elegir]

[ Atún + ensalada ]
~260 kcal · 32 g proteína · 8 min
[Ver receta] [Elegir]

¿Por qué estas opciones?
```

No mostrar cinco opciones si dos son suficientes.

---

# 16. FOTO DE COMIDA — FLUJO INTERACTIVO

Debe respetar el Protocolo Bitácora.

```text
Usuario toma foto
      ↓
Preview
      ↓
Aegis analiza
      ↓
Lista breve de candidatos + confidence
      ↓
Si hay UNA ambigüedad material → micro-pregunta
      ↓
Confirmar/corregir
      ↓
Estimación de porciones con rango
      ↓
Cálculo determinista
      ↓
Registro
      ↓
Actualización de módulos relacionados
      ↓
Verificación
      ↓
Action Receipt
```

UI ejemplo:

```text
[ FOTO ]

Veo probablemente:
✓ arroz                       alta
✓ pollo a la plancha          alta
✓ tomate/cebolla              media-alta
? lo blanco podría ser queso o salsa

¿Es queso costeño o salsa?
[Queso] [Salsa] [Otra cosa]
```

Después:

```text
Estimación
Arroz       140–180 g
Pollo       160–210 g
Ensalada     70–100 g

[Confirmar] [Ajustar]
```

Nunca exigir gramos por defecto.

---

# 17. VOZ

Flujo:

- tap micrófono;
- escuchar;
- waveform mínimo;
- transcripción provisional;
- opción corregir antes de confirmar si la interpretación afecta una escritura;
- Aegis procesa en contexto.

Ejemplo:

```text
“Me acabo de levantar y dormí como seis horas.”

Transcripción
[Corregir] [Usar]
```

Para acciones simples de bajo riesgo, se puede registrar sin paso adicional cuando la confidence sea alta y la política lo permita.

---

# 18. ACCIONES RÁPIDAS CONTEXTUALES

No deben ser siempre iguales.

### Mañana
- `Ya desperté`
- `Registrar peso`
- `Tomé agua`
- `¿Qué desayuno?`

Mostrar máximo tres según contexto.

### Mediodía
- `Ya comí`
- `Tomar foto`
- `¿Qué puedo comer?`

### Después de actividad
- `Terminé`
- `RPE`
- `Dolor / recuperación`

### Supermercado
- `Escanear compra`
- `Ver lista`
- `Escanear etiqueta`

El `Context & Location / Temporal / Intervention Policy` decide qué tiene sentido.

---

# 19. ACTION RECEIPT

Toda escritura significativa debe poder mostrar resultado real.

### Éxito

```text
HECHO
✓ comida registrada
✓ balance recalculado
✓ plan actualizado
✓ Ledger verificado

[Ver detalles]
```

### Parcial

```text
PARCIAL
✓ comida registrada
✕ no pude actualizar inventario

[Reintentar] [Revisar]
```

### Pendiente

```text
NECESITO CONFIRMACIÓN
La foto no permite distinguir queso vs salsa.

[Confirmar]
```

Nunca ocultar un fallo bajo un mensaje de éxito.

---

# 20. EVIDENCIA Y “¿POR QUÉ AEGIS CREE ESTO?”

Cada inferencia relevante puede tener un icono discreto.

Tap abre bottom sheet:

```text
POR QUÉ AEGIS CREE ESTO

Estado: probable
Confianza: media-alta
Basado en:
• última comida confirmada 08:12
• caminata 32 min
• hora actual 12:38

No es una medición clínica.

[Ver evidencia] [Ver agentes]
```

Niveles visuales:

- medido;
- confirmado;
- calculado;
- estimado;
- probable;
- desconocido.

No usar colores alarmistas para estimaciones normales.

---

# 21. TRANSPARENCIA MULTIAGENTE

En modo normal, ocultar la complejidad.

Mostrar simplemente:

`Aegis está analizando…`

El usuario puede abrir `Ver agentes`.

Ejemplo:

```text
ANÁLISIS UTILIZADO

Nutrition Supervisor          ✓
Food Vision                   ✓
Portion Estimation            ✓
Nutrient Calculation          ✓
Evidence & Uncertainty        ✓
Nutrition Audit               ✓

Resultado verificado
```

No mostrar chain-of-thought.

Mostrar:

- quién participó;
- qué herramienta usó;
- qué fuente consultó;
- confianza;
- resultado;
- errores.

Esto debe apoyarse en Ledger/agent spans.

---

# 22. INTELIGENCIA QUE LA UI DEBE REPRESENTAR

Stitch NO implementa estos agentes, pero el diseño debe prever que Aegis Core puede convocarlos y mostrar resultados/auditoría sin saturar.

## 22.1 Aegis Core

Debe sentirse capaz de:

- entender entradas naturales;
- detectar múltiples dominios;
- recordar contexto;
- coordinar especialistas;
- preguntar solo lo material;
- verificar acciones;
- aprender patrones;
- actuar con autonomía proporcional al riesgo.

## 22.2 Expertos transversales

- Physiology Expert Agent
- Biochemistry Expert Agent
- Evidence & Uncertainty Agent
- Temporal Reasoning Agent
- User Model / Personalization Agent
- Memory Curator Agent
- Intervention Policy Agent
- Cross-Domain Consistency Agent
- Audit Agent
- Safety & Permission Agent
- Report & Export Agent

### Culinary & Recipe Expert Group
- Recipe Generation Agent
- Recipe Adaptation Agent
- Ingredient Substitution Agent
- Culinary Technique Agent
- Meal Prep Agent
- Batch Cooking Agent
- Food Safety / Storage Guidance Agent
- Leftovers Optimization Agent

---

# 23. AGENTES POR MÓDULO — CONTEXTO OBLIGATORIO PARA EL DISEÑO

## Alimentación / Nutrición
Supervisor:
- NutritionSupervisorAgent

Especialistas:
- MealInputInterpreterAgent
- FoodVisionAgent
- MenuAndLabelReaderAgent
- PortionEstimationAgent
- FoodResolutionAgent
- NutrientCalculationAgent
- MealContextAgent
- DietaryPlanningAgent
- EatingPatternAgent
- NutritionAuditAgent

El dashboard del módulo puede ser profundo. En Core solo mostrar resumen contextual.

## Metabolismo / Fisiología
Supervisor:
- MetabolismSupervisorAgent

Especialistas:
- MetabolicPhaseAgent
- FastingStateAgent
- SubstrateUtilizationAgent
- HormonalResponseAgent
- GlycogenStateAgent
- EnergyBalanceAgent
- ExerciseBiochemistryAgent
- MetabolicPatternAgent
- BiochemicalExplanationAgent
- MetabolismAuditAgent

## Sueño / Recuperación
Supervisor:
- SleepSupervisorAgent

Especialistas:
- SleepEventInterpreterAgent
- SleepWindowAgent
- SleepQualityAgent
- CircadianPatternAgent
- RecoveryAgent
- WearableSleepAgent
- SleepRoutineAgent
- SleepPatternAgent
- SleepInterventionAgent
- SleepAuditAgent

## Actividad / Ejercicio
Supervisor:
- ActivitySupervisorAgent

Especialistas:
- ActivityInputAgent
- ExerciseClassificationAgent
- TrainingLoadAgent
- EnergyExpenditureAgent
- RPEAgent
- MovementPatternAgent
- RecoveryInteractionAgent
- ExercisePainContextAgent
- ActivityPatternAgent
- ActivityAuditAgent

## Hidratación
Supervisor:
- HydrationSupervisorAgent

Especialistas:
- HydrationInputAgent
- HydrationNeedsAgent
- ExerciseHydrationAgent
- HydrationPatternAgent
- HydrationAuditAgent

## Energía / Ánimo / Hambre / Foco
Supervisor:
- StateSupervisorAgent

Especialistas:
- SubjectiveStateInterpreterAgent
- EnergyPatternAgent
- HungerPatternAgent
- FocusLoadAgent
- ContextCorrelationAgent
- StateTrendAgent
- StateAuditAgent

## Medicación / Suplementos
Supervisor:
- MedicationSupervisorAgent

Especialistas:
- MedicationLoggerAgent
- DoseCaptureAgent
- MedicationReminderAgent
- AdherenceAgent
- SideEffectReporterAgent
- MedicationAuditAgent

## Dolor / Síntomas
Supervisor:
- SymptomsSupervisorAgent

Especialistas:
- SymptomIntakeAgent
- PainCharacterizationAgent
- TriggerContextAgent
- SeverityAgent
- RedFlagSafetyAgent
- SymptomPatternAgent
- CrossDomainSymptomAgent
- SymptomsAuditAgent

## Peso / Medidas / Cuerpo
Supervisor:
- BodySupervisorAgent

Especialistas:
- MeasurementCaptureAgent
- MeasurementValidationAgent
- WeightTrendAgent
- BodyCompositionAgent
- GoalTrendAgent
- BodyAuditAgent

## Hábitos / Rutinas
Supervisor:
- HabitsSupervisorAgent

Especialistas:
- HabitEventAgent
- RoutineDiscoveryAgent
- HabitAdherenceAgent
- HabitPlanningAgent
- HabitPatternAgent
- HabitInterventionAgent
- HabitsAuditAgent

## Despensa / Compras / Hogar
Supervisor:
- InventoryHomeSupervisorAgent

Especialistas:
- InventoryInputAgent
- ReceiptVisionAgent
- PurchaseParserAgent
- StockMovementAgent
- ExpirationAgent
- ReplenishmentAgent
- ShoppingListAgent
- HouseholdNeedsAgent
- FoodWasteAgent
- InventoryAuditAgent

## Plan Vivo
Supervisor:
- LivePlanSupervisorAgent

Especialistas:
- DayPlanningAgent
- ConstraintResolverAgent
- MealPlanningAgent
- PreparationPlanningAgent
- ActivityPlanningAgent
- RecoveryPlanningAgent
- ReplanningAgent
- GoalAlignmentAgent
- PlanConflictAgent
- PlanAuditAgent

---

# 24. PROTOCOLO ORGÁNICO DE ENTRADAS

La UI debe asumir esta conducta:

```text
entrada natural
  ↓
memoria/contexto
  ↓
evidencia
  ↓
dominios implicados
  ↓
agentes relevantes
  ↓
dato faltante material?
  ├─ no → continuar
  └─ sí → una micro-pregunta
  ↓
calcular / estimar
  ↓
acción
  ↓
persistencia
  ↓
verificación
  ↓
auditoría
  ↓
respuesta visual
```

Una interacción puede alimentar varios módulos sin obligar al usuario a saberlo.

Ejemplo:

`Me comí esto a las 2 y luego caminé 40 minutos.`

Puede actualizar:

- alimentación;
- cronología;
- actividad;
- gasto;
- balance;
- metabolismo;
- Plan Vivo.

Aegis responde una sola vez.

---

# 25. PROTOCOLO DE PREGUNTAS

No interrogar.

Pregunta solo si:

- falta algo que cambia materialmente el resultado;
- existe conflicto;
- una acción sensible requiere consentimiento;
- la confidence es insuficiente para escribir.

Cada pregunta debe ser:

- corta;
- contextual;
- una sola idea;
- fácil de responder con tap cuando sea posible.

Ejemplo bueno:

`Lo blanco parece queso costeño o salsa. ¿Cuál es?`

Ejemplo malo:

Formulario de 12 campos sobre una foto.

---

# 26. CORRECCIÓN FORENSE

Cuando el usuario corrige:

`No eran dos huevos, eran tres.`

UI:

```text
CORRECCIÓN
2 huevos → 3 huevos

Se recalculará:
• comida
• nutrientes
• acumulado del día
• estado metabólico
• plan

[Confirmar corrección]
```

Después:

```text
ACTUALIZADO
✓ registro corregido
✓ cálculos actualizados
✓ Ledger conserva historial
```

No sobrescribir silenciosamente.

---

# 27. MÓDULOS — AQUÍ SÍ PUEDE EXISTIR PROFUNDIDAD

La regla de baja densidad aplica a Aegis Core.

Dentro de un módulo el usuario eligió profundizar, por lo que puede haber:

- gráficas;
- tendencias;
- filtros;
- historial;
- tablas;
- indicadores;
- evidencia;
- exportar;
- auditoría;
- chat contextual;
- controles avanzados.

Aun así conservar jerarquía y whitespace.

Cada módulo debe incluir `Preguntar a Aegis sobre…` con scope contextual.

---

# 28. DASHBOARD DE ALIMENTACIÓN

Puede incluir:

- kcal hoy vs objetivo;
- proteína/carbs/grasas;
- fibra;
- comidas del día;
- rango de incertidumbre;
- tendencia semanal;
- cumplimiento de proteína;
- fotos/evidencias;
- correcciones;
- exportar.

No mostrar todo en una sola fila.

---

# 29. DASHBOARD DE METABOLISMO

- última ingesta;
- horas desde ingesta;
- etapa probable;
- confianza;
- sustratos probables;
- balance energético estimado;
- explicación humana;
- detalle técnico expandible;
- línea temporal;
- `¿Por qué Aegis cree esto?`;
- badge `estimación, no medición clínica`.

---

# 30. DASHBOARD DE SUEÑO

- último sueño;
- hora dormir/despertar;
- calidad;
- despertares;
- regularidad;
- tendencia;
- recuperación;
- somnolencia;
- wearable vs autoinforme;
- factores asociados;
- chat contextual.

---

# 31. DASHBOARD DE ACTIVIDAD

- minutos;
- sesiones;
- segmentos mixtos;
- RPE;
- gasto estimado con rango;
- dolor antes/después;
- tendencia;
- recuperación;
- relación descriptiva con sueño/energía.

---

# 32. DASHBOARD HIDRATACIÓN

- acumulado;
- objetivo contextual;
- ritmo;
- actividad/calor cuando exista;
- eventos;
- tendencia;
- acciones rápidas.

---

# 33. DASHBOARD ESTADO / ENERGÍA

- energía;
- ánimo;
- hambre;
- ansiedad reportada;
- foco;
- irritabilidad;
- carga mental;
- tendencias;
- correlaciones descriptivas, no causalidad inventada.

---

# 34. MEDICACIÓN

- tomas;
- pendientes;
- adherencia;
- efectos percibidos;
- efectos secundarios reportados;
- recordatorios;
- historial;
- exportación.

No diseñar controles que parezcan prescripción médica.

---

# 35. SÍNTOMAS / DOLOR

- síntomas activos;
- intensidad;
- zona;
- activador;
- duración;
- evolución;
- alertas;
- relación temporal;
- registro fácil;
- seguridad prioritaria.

Red flags deben escalar visualmente sin convertir toda la app en alarmas.

---

# 36. CUERPO / PESO

- última medición;
- tendencia;
- cambios semanales/mensuales;
- cintura/otras medidas;
- evidencia;
- objetivos;
- wearable/báscula si existe.

---

# 37. HÁBITOS

- hábitos de hoy;
- adherencia;
- patrones;
- hábitos en riesgo;
- sugerencias;
- controles de notificación;
- rachas discretas, sin gamificación infantil.

---

# 38. DESPENSA / HOGAR

- existencias;
- bajo stock;
- próximos a vencer;
- qué falta;
- compras recientes;
- lista;
- ubicaciones;
- movimiento de inventario;
- `¿por qué Aegis cree que queda esta cantidad?`;
- cámara para nevera/despensa/recibo.

---

# 39. PLAN VIVO PROFUNDO

- timeline del día;
- ahora/próximo/después;
- planificado vs realizado;
- reprogramados;
- bloqueos;
- dependencias;
- recomendaciones;
- mañana;
- drag/reorder cuando sea apropiado;
- chat contextual.

---

# 40. CONFIGURACIÓN COMPLETA

Debe existir, pero NO contaminar Aegis Core.

```text
CONFIGURACIÓN

Perfil y objetivos
Preferencias

Aegis
  estilo de respuesta
  nivel de detalle
  profundidad técnica/bioquímica
  preguntas automáticas
  autonomía
  memoria

Notificaciones
  alimentación
  hidratación
  sueño
  medicación
  plan
  alertas

Privacidad y permisos
  datos sensibles
  fotos/documentos
  ubicación
  memoria
  integraciones
  exportaciones
  eliminación

Integraciones
  calendario
  wearables
  básculas
  almacenamiento
  otras AION

Datos
  importar
  exportar
  backups
  auditoría
```

---

# 41. REGISTRAR — BOTTOM SHEET MÓVIL

Tap `+ Registrar`:

```text
¿Qué pasó?

Comida
Agua
Sueño
Actividad
Energía / ánimo
Síntoma / dolor
Medicación
Peso / medida
Compra
Foto
Hablar

Cancelar
```

Debe ser bottom sheet, no nueva pantalla obligatoria.

Cada opción puede abrir entrada ultrabreve y luego volver a Core.

---

# 42. GESTOS / MICROINTERACCIONES

Usar con moderación:

- tap: abrir detalle;
- long press: acciones secundarias;
- swipe: completar/posponer cuando sea intuitivo;
- drag: reordenar Plan Vivo;
- pull to refresh: sincronizar;
- haptic feedback móvil para confirmación importante;
- expand/collapse;
- bottom sheets;
- drawers;
- toast breve solo para feedback no crítico.

No esconder funciones esenciales exclusivamente detrás de gestos invisibles.

---

# 43. MOTION

Animaciones:

- 150–250 ms normales;
- easing suave;
- expansión fluida;
- cambio de estado sin saltos;
- orbit/logo puede tener respiración casi imperceptible;
- glow aumenta levemente cuando Aegis procesa.

Evitar:

- partículas permanentes;
- animaciones de sci-fi exageradas;
- cards flotando sin motivo;
- loaders largos llamativos.

---

# 44. MOBILE-FIRST

En móvil:

- una columna;
- scroll vertical natural;
- cards full-width solo cuando aportan;
- controles táctiles ≥44 px;
- bottom sheets;
- sticky composer;
- bottom nav de cuatro destinos;
- drawer para profundidad;
- acciones rápidas contextuales;
- gráficos simplificados;
- tablas se convierten en cards/listas o scroll horizontal controlado.

No comprimir desktop dentro de 390 px.

---

# 45. DESKTOP

Desktop puede aprovechar ancho con:

- sidebar;
- contenido 65–72%;
- panel contextual opcional 28–35%;
- conversación principal amplia;
- detalles laterales cuando el usuario abre una evidencia o agente.

No convertir ancho extra en más información simultánea.

---

# 46. ACCESSIBILITY

- contraste WCAG razonable;
- no usar color como única señal;
- focus visible;
- labels para iconos;
- targets grandes;
- reduced motion;
- soporte teclado desktop;
- estados de loading/error claros;
- texto escalable.

---

# 47. ESTADOS VACÍOS

No mostrar ceros falsos.

Ejemplo:

```text
Sueño
Todavía no tengo suficiente información sobre tu última noche.
[Contarme cómo dormí]
```

No:

`Sueño 7.5 h` como fallback inventado.

---

# 48. ERROR / FALLA PARCIAL

Error debe ser accionable:

```text
No pude analizar la imagen.
Tu foto no fue registrada todavía.

[Reintentar] [Escribir qué contiene]
```

No decir “procesado” después de una excepción.

---

# 49. AUTONOMÍA VISIBLE SIN SER INVASIVA

Aegis puede actuar silenciosamente en bajo riesgo, pero el usuario debe poder inspeccionar.

Superficie `Actividad de Aegis`:

```text
Hoy
09:21  Recalculé tu resumen después del desayuno
10:03  Detecté bajo stock de tomates
10:04  No te notifiqué: prioridad baja
```

Esto puede vivir en Auditoría, no en Core por defecto.

---

# 50. CASOS DE ACEPTACIÓN VISUAL

## A. “Me acabo de levantar”

UI debe poder:

- recibir frase en Core;
- mostrar respuesta humana;
- pedir hora de dormir solo si materialmente necesaria;
- registrar despertar;
- mostrar Action Receipt;
- actualizar Pulso;
- ofrecer máximo 1–2 acciones pertinentes;
- no abrir siete módulos automáticamente.

## B. Foto de comida

- cámara desde Core;
- preview;
- análisis;
- candidatos;
- micro-pregunta;
- rango;
- confirmación;
- receipt;
- opción `Ver en Alimentación`.

## C. Compra

`Compré cuatro latas de atún por 28.000.`

Respuesta rica:

```text
Registré 4 latas de atún en despensa.
Compra: $28.000 (confirmado por tu mensaje)

[Ver despensa] [Ver compra]
```

No duplicar finanzas globales si la integración no existe.

## D. Tengo hambre

- 2–3 opciones contextuales;
- usar despensa;
- explicar breve razón;
- elegir receta;
- permitir `otra opción`.

## E. Corrección

- BEFORE→AFTER;
- recalcular;
- receipt;
- undo cuando sea seguro.

## F. Día tranquilo

Si no hay alertas ni información importante, Core debe verse muy limpio.

No crear artificialmente “Aegis detecta” con mensajes inútiles.

---

# 51. PROMPT DIRECTO PARA GOOGLE STITCH

Copia desde aquí si se usa Stitch directamente:

---

**Diseña la interfaz REAL de AION Aegis, mobile-first y responsive. Usa como referencia obligatoria el logo AION Aegis adjunto / `aion-aegis-logo-dark.svg`. No diseñes una landing page. No cambies backend, agentes, contratos o lógica: esta tarea es únicamente de UI/UX e interacción visual.**

AION Aegis es una bitácora personal inteligente, multimodal, adaptativa, auditada y progresivamente autónoma. Su pantalla principal se llama **Aegis Core**. Aegis Core es una interfaz conversacional viva: el usuario habla, escribe, toma fotos o adjunta archivos; detrás, una orquesta de supervisores y agentes estructura la información, consulta memoria, calcula, estima, pregunta solo lo indispensable, registra, verifica, audita y responde como una sola inteligencia.

Quiero una experiencia **orgánica, fluida, elegante, premium y profundamente interactiva**, con baja densidad visual. No quiero un dashboard empresarial con 12 tarjetas visibles. Los módulos individuales pueden contener profundidad, tablas y métricas; Aegis Core solo debe mostrar resúmenes contextuales y abrir módulos bajo demanda.

PALETA EXACTA:
- fondo #070709
- fondo elevado #0D0B12
- surface #111017
- surface 2 #17131F
- surface 3 #1D1728
- violeta #7C3AED
- violeta fuerte #6D28D9
- violeta brillante #8B5CF6
- lavanda #C4B5FD
- lavanda suave #DDD6FE
- dorado #D6B36A
- dorado brillante #F3D18A
- dorado oscuro #A9803A
- texto #F4F4F5
- secundario #A1A1AA
- tenue #71717A
- éxito #22C55E
- warning #F59E0B
- danger #EF4444
- info #38BDF8

Usa aproximadamente 75% negro/grafito, 15% violeta, 5% dorado y 5% blanco/lavanda. El dorado es un acento premium, no un color masivo. No estética gamer, no neón excesivo, no glassmorphism excesivo.

NAVEGACIÓN DESKTOP: sidebar izquierda colapsable con logo AION Aegis arriba. Primer destino: Aegis Core. Después Mi Día. Agrupa en accordions:

MI ESTADO: Cuerpo y peso; Metabolismo; Energía, ánimo, hambre y foco; Dolor y síntomas.

CUIDADO DIARIO: Sueño y recuperación; Actividad y ejercicio; Hidratación; Hábitos y rutinas; Medicación y suplementos.

ALIMENTACIÓN Y HOGAR: Alimentación/Nutrición; Despensa/Compras/Hogar; Recetas/Preparaciones.

PLANIFICACIÓN: Plan Vivo; Alertas/Seguimiento.

INFORMACIÓN: Reportes; Exportaciones; Auditoría Aegis.

SISTEMA: Perfil y objetivos; Preferencias; Memoria; Autonomía; Notificaciones; Privacidad y permisos; Integraciones; Configuración.

MOBILE: convertir sidebar en drawer. Bottom navigation con solo cuatro destinos: Aegis Core, Mi Día, botón central + Registrar, Más. Registrar abre bottom sheet con Comida, Agua, Sueño, Actividad, Energía/Ánimo, Síntoma/Dolor, Medicación, Peso/Medida, Compra, Foto y Hablar.

AEGIS CORE MOBILE: primer viewport muy limpio. Header mínimo con hamburger, logo/nombre AION Aegis, notificaciones y avatar. Saludo contextual breve. Gran composer multimodal con placeholder “Cuéntame, muéstrame o pregúntame algo…”, botones de voz, cámara, adjuntar y enviar. Debajo máximo 2–3 acciones rápidas que cambian según hora/contexto. No mostrar ocho métricas en el primer viewport.

El resto es feed vertical desplazable con progressive disclosure. Orden sugerido: Pulso de hoy/Ahora; Aegis Detecta; Plan Vivo; Mi Día; Tus módulos; resumen de ayer si es relevante; reportes/exportación secundaria. Una sección sin información útil puede ocultarse o colapsarse. No rellenar con datos falsos.

AHORA/PULSO: superficie compacta, no siete cards. Mostrar solo 2–4 datos útiles en una línea o pequeña card: sueño, tiempo desde ingesta, energía, agua, actividad, siguiente plan, según contexto. Cada inferencia puede tener “¿Por qué?” y badge medido/calculado/estimado/probable.

AEGIS DETECTA: máximo 1–2 señales visibles. Ejemplo “Los tomates podrían necesitar consumirse pronto” con botones Ver recetas / Ignorar. Ejemplo “No encuentro almuerzo registrado” con Ya comí / Todavía no / Omitir. El usuario puede resolver, posponer, rechazar, silenciar y preguntar por qué apareció.

PLAN VIVO EN CORE: mostrar máximo Ahora, Próximo, Después. Cada evento permite Hecho, Posponer, Cambiar, Ver. Botón Ver plan completo. No mostrar todo el calendario.

MI DÍA EN CORE: últimos 3–5 eventos. Cada evento abre detalle y permite corregir, agregar nota, ver evidencia, ver impacto o anular si es reversible. Correcciones deben verse ANTES→DESPUÉS, nunca borrado silencioso.

TUS MÓDULOS: NO grid de 12 tarjetas. Usar accordion compacto o carrusel de cards pequeñas. Cada módulo muestra nombre + un indicador + un estado + flecha. “Ver todos los módulos”. La profundidad vive dentro del módulo.

El composer debe quedar disponible al hacer scroll mediante una barra sticky compacta “Preguntar a Aegis…” con micrófono y cámara que se expande al tocarla.

RESPUESTAS: no solo párrafos. Deben poder contener cards, fotos, recetas, mini gráficas, timelines, tablas compactas, botones, confirmaciones, Action Receipts, comparaciones, evidencia y links “Ver en módulo”. Mostrar máximo lo necesario y permitir expandir.

FOTO DE COMIDA: foto→preview→Aegis analiza→candidatos + confidence→si existe ambigüedad material hacer UNA micro-pregunta→estimación de porción con rango→confirmar/corregir→cálculo→registro→Action Receipt. Nunca obligar al usuario a dar gramos si la IA puede estimar. Mostrar estimado como estimado.

VOZ: waveform discreto, transcripción provisional, corregir/usarla, luego acción contextual.

ACTION RECEIPT: tras una escritura mostrar un bloque compacto: HECHO con checks reales. Si algo falló mostrar PARCIAL y exactamente qué no se actualizó, con Reintentar/Revisar. Nunca mostrar éxito si una operación falló.

EVIDENCIA: “¿Por qué Aegis cree esto?” abre bottom sheet con estado, confidence, fuentes, supuestos, evidencia y advertencia si es inferencia. Permitir “Ver agentes”.

TRANSPARENCIA MULTIAGENTE: en modo normal ocultar complejidad y decir “Aegis está analizando…”. En modo transparencia mostrar únicamente metadata operativa, no chain-of-thought: Supervisor utilizado, especialistas, tools, fuentes, confidence, resultado, errores y auditoría.

La arquitectura interna que la UI debe ser capaz de representar incluye Aegis Core; supervisores de Nutrición, Metabolismo, Sueño, Actividad, Hidratación, Estado/Energía, Medicación, Síntomas, Cuerpo, Hábitos, Despensa/Hogar y Plan Vivo; expertos transversales de Fisiología, Bioquímica, Evidencia, Temporalidad, Personalización, Memoria, Política de Intervención, Coherencia Transversal, Auditoría, Seguridad/Permisos y Reportes/Exportación; además del grupo culinario de generación/adaptación de recetas, sustitución de ingredientes, técnica culinaria, meal prep, batch cooking, seguridad/almacenamiento y aprovechamiento de sobras.

La experiencia debe asumir que una sola frase puede afectar varios módulos. Ejemplo “Me comí esto a las 2 y luego caminé 40 minutos” puede actualizar alimentación, cronología, actividad, gasto, balance, metabolismo y plan, pero el usuario recibe UNA respuesta coherente.

Los módulos profundos sí pueden tener toda la información necesaria. Cada módulo debe incluir chat contextual “Preguntar a Aegis sobre…”, gráficas, tendencias, filtros, historial, evidencia, auditoría, exportación y corrección según su dominio. Mantener jerarquía y whitespace.

CONFIGURACIÓN completa: perfil/objetivos, preferencias, estilo de respuesta, profundidad técnica/bioquímica, nivel de autonomía, memoria, notificaciones, privacidad, permisos, integraciones, importación, exportación, backups y auditoría. No poner esa complejidad en Core.

INTERACCIONES: tap para abrir, long press para acciones secundarias, swipe cuando sea intuitivo, drag/reorder en Plan Vivo, bottom sheets, drawers, expand/collapse, haptic feedback móvil en confirmaciones. No esconder funciones esenciales solo detrás de gestos.

MOTION: 150–250 ms, suave. El logo/orbita puede respirar casi imperceptiblemente. Glow leve al procesar. No partículas permanentes ni animación gamer.

ESTADOS VACÍOS: nunca inventar 7.5 h de sueño, 2500 ml objetivo o datos falsos. Mostrar “Todavía no tengo suficiente información” + acción para aportarla.

ERROR: “No pude analizar la imagen. Tu foto no fue registrada todavía.” + Reintentar / Escribir qué contiene. Nunca afirmar éxito después de catch.

Diseña una pantalla mobile completa de Aegis Core y su versión desktop responsive, además del drawer/sidebar, bottom sheet Registrar, ejemplo de respuesta multimodal, ejemplo de foto de comida, ejemplo de Action Receipt, drawer de evidencia/agentes y una pantalla de módulo profundo. Debe sentirse como un producto real, no un mockup de marketing.

Frase de diseño final: **el usuario vive y conversa; Aegis organiza.**

---

# 52. CRITERIO DE APROBACIÓN

El diseño se rechaza si:

- muestra 12 cards en Core simultáneamente;
- Core parece dashboard empresarial;
- la interacción es solo chat de texto;
- no hay cámara/voz/archivo;
- no hay confirmación/corrección;
- no hay Action Receipt;
- no hay evidencia/confidence;
- no hay acceso a módulos;
- no hay mobile scroll real;
- no hay drawer/sidebar;
- no hay configuración;
- no contempla agentes/auditoría;
- no contempla estados parciales/errores;
- el usuario tiene que gestionar agentes;
- el diseño se ve saturado.

Se aprueba cuando se siente como una sola inteligencia personal, aunque debajo exista una orquesta compleja.
