# AION LEGACY — REFERENCIA OBLIGATORIA PARA RECONSTRUIR AION AEGIS

**Estado:** referencia histórica/funcional, NO contrato para copiar literalmente la UI antigua.  
**Fuente:** AION legacy (Drive + `AION (2).zip`, junio 2026) + `BITACORA PROMT` de Drive.  
**Objetivo:** recuperar las ideas valiosas del AION original y migrarlas a AION Aegis sin volver a mezclar todos los futuros productos AION en una sola aplicación.

---

# 1. Regla principal

AION Aegis NO debe copiar visualmente el AION original. Debe conservar su filosofía operativa:

- un núcleo conversacional central;
- módulos satélite profundos;
- navegación jerárquica;
- módulos que pueden abrirse, minimizarse, ocultarse y fijarse;
- bitácora transversal;
- inspector/auditoría contextual;
- acciones rápidas;
- conversación y operación como capas distintas;
- memoria y continuidad;
- una interacción puede afectar varios dominios sin que el usuario tenga que clasificarlos.

AION original era un sistema generalista. AION Aegis es una aplicación especializada dentro del nuevo ecosistema AION. Por tanto, deben migrarse los patrones útiles, NO todos los dominios antiguos.

---

# 2. Qué era estructuralmente el AION original

El AION legacy contenía un `Command Center` como superficie central y un conjunto de módulos satélite.

La UI se componía conceptualmente de:

```text
SYSTEM STRIP / TOP BAR
        ↓
LEFT RAIL NAV
        ↓
COMMAND CENTER
  ├─ Núcleo conversacional
  ├─ Centro de respuestas
  ├─ Centro de salida / bitácora operativa
  ├─ Inspector contextual
  ├─ módulos satélite
  ├─ bandeja de módulos minimizados
  └─ Action Dock
```

El `MainOsChrome` organizaba `SystemStrip + RailNav + content`.

El `SystemStrip` permitía, según pantalla:

- logo;
- hora;
- conectividad/estado;
- estado de Aion;
- agregar módulo;
- calendario;
- zoom;
- inspector;
- notificaciones;
- paleta;
- ayuda;
- ajustes;
- usuario.

No todo esto tiene que permanecer siempre visible en Aegis. Debe aplicarse progressive disclosure.

---

# 3. Rail/Nav del AION original

El AION legacy tenía una navegación jerárquica, no una simple fila de tabs.

Existían destinos y grupos como:

```text
Principal

Diario
  ├─ Bitácora
  ├─ Agenda
  └─ Tareas

Eficiencia

Biblioteca
  ├─ Archivos
  ├─ Plantillas
  ├─ Prompts
  └─ Listas

Conectores
Correo
Finanzas
Grabación
Automatizaciones
Memoria
Sistemas

Ajustes
  ├─ Núcleo
  ├─ Operación
  ├─ Personal
  └─ otras secciones
```

Aegis debe recuperar el mismo patrón de navegación agrupada y colapsable, pero con sus propios dominios.

---

# 4. Módulos satélite del Core legacy

El AION original implementó un patrón muy importante para Aegis:

```text
SatelliteVisibility = open | minimized | hidden
```

Además un módulo podía estar `pinned`.

Los satélites visibles del Command Center legacy incluían:

- Sueño;
- Comida;
- Salud;
- Actividad;
- Agenda;
- Finanzas;
- Auditoría.

Los módulos abiertos se ordenaban según:

1. módulos fijados;
2. orden canónico.

Cada panel podía:

- abrirse;
- minimizarse;
- ocultarse;
- fijarse arriba;
- volver desde bandeja minimizada.

## Regla para Aegis

Recuperar esta mecánica.

Aegis Core debe permitir al usuario decidir qué resúmenes de módulo quiere tener visibles sin convertir la pantalla principal en un grid permanente.

Los estados recomendados son:

```text
core_visibility = visible | collapsed | hidden
pinned_to_core = true | false
priority = contextual | user_pinned | normal
```

En móvil:

- no intentar mostrar todos los módulos;
- los módulos fijados pueden aparecer como lista compacta/carrusel/accordion;
- el resto vive en `Más` / drawer;
- abrir un módulo debe llevar a su experiencia profunda.

---

# 5. Núcleo conversacional legacy

`CommandCore` ya contenía varias ideas que deben sobrevivir:

- núcleo como puerta maestra;
- conversación natural;
- textarea/composer expandible;
- adjuntar contexto;
- voz;
- enviar;
- transcript integrado;
- separación conceptual entre charla, núcleo, procesamiento y salida.

La doctrina interna del componente era esencialmente:

> el Core origina, coordina y dispara; los módulos reflejan, revisan, auditan y editan en secundario.

Ese principio sigue siendo válido para Aegis.

## Evolución Aegis

Aegis Core debe mejorar el antiguo núcleo con:

- texto;
- voz;
- cámara;
- galería;
- documentos;
- recibos;
- etiquetas;
- menús;
- respuesta rica;
- preguntas mínimas;
- Action Receipts;
- navegación contextual a módulos.

---

# 6. Conversar vs operar

El documento soberano legacy distinguía dos estados:

## Conversacional

- responder;
- explicar;
- reflexionar;
- analizar;
- continuar diálogo.

## Operativo

- crear;
- modificar;
- registrar;
- mover;
- confirmar;
- reorganizar;
- ejecutar una acción que cambia estado.

Aegis debe conservar esta distinción.

No todo mensaje crea un registro.

No toda pregunta genera una operación.

Toda operación real debe generar trazabilidad.

---

# 7. Centro de respuestas, Centro de salida e Inspector

El diseño conceptual legacy separaba:

## Centro de respuestas

Conversación natural.

## Centro de salida

Bitácora operativa de acciones concretas.

## Inspector

Intención, riesgo, módulo objetivo, estado, contexto y seguimiento.

## Evolución para Aegis

No se necesitan tres columnas permanentes.

Debe mantenerse la separación conceptual pero con UI orgánica:

- conversación en Aegis Core;
- Action Receipt inmediatamente después de operaciones;
- Mi Día / Ledger para historial;
- `¿Por qué?` / `Ver evidencia` como bottom sheet o drawer;
- `Ver actividad de Aegis` para auditoría profunda;
- detalle contextual solo bajo demanda.

---

# 8. Action Dock legacy

AION legacy tenía acciones directas:

- voz;
- texto;
- grabar;
- captura rápida;
- subir archivo;
- crear tarea;
- vista fija;
- interrumpir;
- confirmar.

## Evolución para Aegis

No copiar nueve botones en móvil.

Integrar las capacidades alrededor del composer y un `+ Registrar` contextual:

```text
Composer
  ├─ Texto
  ├─ Voz
  ├─ Cámara
  ├─ Galería/Archivo
  └─ Enviar

+ Registrar
  ├─ Comida
  ├─ Agua
  ├─ Sueño
  ├─ Actividad
  ├─ Estado
  ├─ Síntoma
  ├─ Medicación
  ├─ Peso
  ├─ Compra
  ├─ Foto
  └─ Voz
```

---

# 9. Bitácora como núcleo transversal

El AION legacy tenía una bitácora que cruzaba múltiples tipos:

- sueño;
- nutrición;
- salud;
- actividad;
- agenda;
- finanzas;
- auditoría;
- notas;
- tareas;
- eficiencia.

Una idea central era que una entrada pudiera aparecer en su dominio y también en la cronología sin duplicar la verdad.

Aegis debe evolucionar esto hacia:

```text
Source-of-truth module
        ↓
Universal Ledger
        ↓
Mi Día / projections
```

`Mi Día` NO es una copia de cada módulo.

---

# 10. Lo que el AION legacy ya hacía con Comida/Nutrición

Nutrición no era solamente un contador de calorías.

El módulo legacy reconocía o pretendía manejar:

- comida/ingesta;
- hora;
- descripción;
- energía kcal;
- señal favorable/mejorable;
- pertinencia/calidad;
- bioquímica;
- contexto bioquímico de otras comidas;
- rutas metabólicas;
- digestión;
- componentes/alérgenos;
- carga/pesadez;
- sinergias;
- estimación kcal de catálogo cuando faltaba cifra;
- rango mínimo/máximo;
- platillo reconocido;
- cruces con otros módulos.

El `NutritionEntryPeek` legacy incluía conceptualmente:

```text
timeLabel
kcal
quality signal
pertinence
biochemistryLine
biochemistryContextOtherMeal
metabolicLine
digestionLine
componentsNote
magnum excerpts
moduleLinks
heavinessNote
synergyLines
kcalFromCatalog
kcalRangeFromCatalog
catalogDishId
```

El `NutritionDayAuditDigest` agregaba:

```text
mealCount
meals
kcalFromEfficiencySample
kcalIngestaSumarizada
canonGaps
```

Aegis moderno debe conservar esta profundidad y mejorarla con datos estructurados, evidencia, visión real y agentes especializados.

---

# 11. Cruces nutricionales que existían

El sistema legacy ya contemplaba vínculos de una comida con:

- medicación;
- sueño;
- agenda;
- eficiencia;
- análisis Magnum.

También buscaba:

- comidas cercanas temporalmente;
- separación amplia entre ingestas;
- sinergias alimentarias;
- carga tardía cercana al sueño;
- contexto bioquímico de otras ingestas;
- faltantes de energía;
- digestión/pesadez;
- componentes/alérgenos.

Aegis debe convertir estos cruces heurísticos en comportamiento estructurado y auditable.

---

# 12. Magnum Opus / BITACORA PROMT — reglas que deben sobrevivir

El prompt de Drive `BITACORA PROMT` tenía principios que Aegis debe preservar, aunque NO debe mostrar sus tablas gigantes en Aegis Core.

## Jerarquía de verdad

- dato literal del usuario;
- cálculo derivado;
- inferencia con confianza;
- dato bloqueado/desconocido cuando falta evidencia.

## No inventar

Dato faltante no se completa por estilo.

## Corrección forense

```text
ANTES → DESPUÉS
```

No se borra silenciosamente la historia.

## Cronología

Todo evento temporal relevante debe conservar relación con el día y hora/ventana.

## Predicción ≠ hecho

Toda inferencia debe declarar confianza.

## Anti-duplicado

No registrar dos veces una misma operación o ingesta por repetición conversacional.

## Anti-omisión

Hechos útiles comunicados durante una interacción deben evaluarse para los dominios afectados.

---

# 13. Nutrición PhD del prompt de Drive

El documento `BITACORA PROMT` y el documento específico `M2_NUTRICION_PhD_D0_v2_MAS_DETALLE.docx` definen una profundidad que Aegis NO debe perder.

El módulo nutricional moderno debe ser capaz de producir, cuando el usuario pide profundidad o el análisis lo requiere:

## Ingesta cruda

- día;
- hora/ventana;
- contexto;
- alimento/bebida;
- cantidad literal;
- preparación;
- evidencia;
- estado/confianza.

## Estimación nutricional

Por ítem:

- kcal rango;
- proteína;
- carbohidratos;
- grasas;
- fibra;
- micronutrientes cuando haya fuente;
- supuestos;
- confidence.

## Calidad biológica

Cuando sea pertinente y existan datos fiables:

- calidad proteica;
- aminoácidos relevantes;
- perfil lipídico;
- fibra;
- carga glucémica estimada;
- electrolitos.

No inventar micronutrientes si la base de datos no los soporta.

## Rutas metabólicas

Explicar, según contexto:

- digestión y absorción;
- glucólisis;
- glucogénesis;
- glucogenólisis;
- gluconeogénesis;
- lipogénesis;
- lipólisis;
- beta-oxidación;
- metabolismo de aminoácidos;
- ciclo de Krebs;
- quilomicrones/transporte lipídico;
- respuesta insulina/glucagón;
- lactato/LDH cuando aplique;
- estado alimentado/postabsortivo/ayuno.

Siempre distinguir educación general de inferencia individual.

## Sinergias / antagonismos

Relacionar alimentos, horario, actividad, sueño, hidratación, medicación y objetivos solamente cuando exista base suficiente.

## Anti-huecos

Preguntar únicamente el dato mínimo que realmente cambie el resultado:

- tamaño;
- porción;
- técnica;
- ingrediente ambiguo;
- hora;
- uso parcial/total de una preparación.

No convertir este protocolo en interrogatorio.

---

# 14. Aegis Core debe heredar el concepto de módulos satélite

La experiencia moderna debe ser:

```text
Aegis Core
  ├─ conversación
  ├─ Pulso de hoy
  ├─ Aegis detecta
  ├─ Plan Vivo breve
  ├─ Mi Día breve
  └─ módulos satélite resumidos configurables
```

El usuario puede:

- abrir módulo;
- colapsarlo;
- fijarlo en Core;
- quitarlo de Core sin desactivar el módulo;
- reorganizar los fijados;
- volver a `Todos los módulos`.

## Regla

Ocultar de Core ≠ eliminar el módulo.

---

# 15. Organización Aegis propuesta a partir del legacy

```text
AION AEGIS
│
├── Aegis Core
├── Mi Día
│
├── MI ESTADO
│   ├── Cuerpo y peso
│   ├── Metabolismo
│   ├── Energía / ánimo / hambre / foco
│   └── Dolor / síntomas
│
├── CUIDADO DIARIO
│   ├── Sueño / recuperación
│   ├── Actividad / ejercicio
│   ├── Hidratación
│   ├── Hábitos / rutinas
│   └── Medicación / suplementos
│
├── ALIMENTACIÓN Y HOGAR
│   ├── Alimentación / Nutrición
│   ├── Despensa / Compras / Hogar
│   └── Recetas / Preparaciones
│
├── PLANIFICACIÓN
│   ├── Plan Vivo
│   └── Alertas / Seguimiento
│
├── INFORMACIÓN
│   ├── Reportes
│   ├── Exportaciones
│   └── Auditoría Aegis
│
└── SISTEMA
    ├── Perfil y objetivos
    ├── Preferencias
    ├── Memoria
    ├── Autonomía
    ├── Notificaciones
    ├── Privacidad / permisos
    ├── Integraciones
    └── Configuración
```

---

# 16. Dashboard profundo por módulo

Aegis Core NO muestra todas estas métricas.

Cada módulo profundo sí puede tener:

- header contextual;
- resumen actual;
- tendencias;
- timeline;
- filtros;
- registros;
- análisis;
- evidencia/confianza;
- acciones;
- corrección;
- exportación;
- conversación contextual con Aegis;
- auditoría del módulo.

Esto recupera la filosofía de las superficies legacy sin saturar Core.

---

# 17. Qué NO migrar del AION original a Aegis

No copiar dentro de Aegis como módulos propietarios:

- correo;
- finanzas globales;
- biblioteca general;
- documentos generales;
- sistemas globales;
- operaciones generales;
- módulos de AION Edu/Studio/Ops.

Esas capacidades pertenecen a otras AION o a AION Core global.

Aegis solo debe emitir/consumir eventos autorizados.

---

# 18. Reglas obligatorias para Antigravity

Antes de modificar la estructura Aegis:

1. Leer este documento.
2. Leer `AION_AEGIS_MASTER_BLUEPRINT.md`.
3. Leer `PROTOCOLO_BITACORA_ACTIVADOR.md`.
4. Leer `AION_AEGIS_AGENT_COVERAGE_AUDIT.md`.
5. Leer `AION_AEGIS_UI_ARCHITECTURE.md`.
6. No copiar la antigua UI pixel por pixel.
7. Reutilizar patrones conceptuales probados.
8. Preservar lo REAL del repo actual.
9. No presentar metadata-only como agente REAL.
10. No sacrificar profundidad de módulos por simplificar Aegis Core.

---

# 19. Resultado deseado

AION Aegis debe sentirse como una evolución orgánica del AION original:

- un solo cerebro visible;
- múltiples dominios profundos;
- módulos satélite configurables;
- conversación primero;
- operaciones verificables;
- bitácora viva;
- auditoría bajo demanda;
- navegación poderosa sin saturación;
- profundidad científica real en Nutrición/Metabolismo;
- usuario no obligado a administrar la arquitectura interna.

El legado no se copia: **se destila y se especializa.**
