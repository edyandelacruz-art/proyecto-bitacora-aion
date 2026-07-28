# AION AEGIS — ARQUITECTURA DE UI/UX ORGÁNICA

**Propósito:** definir la estructura visual y de navegación que Antigravity debe implementar y que Stitch debe representar.  
**No define lógica de agentes.** La lógica vive en el Blueprint técnico.

---

# 1. Principio rector

Aegis Core es la superficie principal.

Debe sentirse como una inteligencia viva y calmada, no como un tablero empresarial.

```text
El usuario vive y conversa.
Aegis organiza, resume y deja abrir profundidad cuando hace falta.
```

Core muestra poco.

Los módulos muestran profundidad.

---

# 2. Patrón heredado del AION legacy

Conservar estos patrones:

- top/system strip sobrio;
- rail/sidebar colapsable;
- grupos accordion;
- módulos satélite configurables;
- estados visible / colapsado / oculto;
- pin/unpin de módulos al Core;
- bandeja/lista de módulos no visibles;
- inspector contextual bajo demanda;
- conversación + salida operativa separadas conceptualmente;
- acciones rápidas alrededor del composer;
- Mi Día como proyección transversal.

No copiar estética legacy literalmente.

---

# 3. Desktop — estructura general

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ AION AEGIS       estado breve / hora                 🔔   ⚙   perfil       │
├──────────────┬──────────────────────────────────────────────┬───────────────┤
│ SIDEBAR      │                                              │ CONTEXT DRAWER │
│ colapsable   │              AEGIS CORE                      │ solo si se abre│
│              │                                              │               │
│ Core         │ conversación                                 │ evidencia      │
│ Mi Día       │ resumen contextual                           │ detalle        │
│              │ señales                                      │ auditoría      │
│ grupos       │ plan breve                                   │ explicación    │
│ accordion    │ día breve                                    │               │
│              │ módulos resumidos configurables              │               │
└──────────────┴──────────────────────────────────────────────┴───────────────┘
```

El panel derecho NO debe permanecer abierto por defecto.

---

# 4. Sidebar desktop

Arriba:

- logo AION Aegis;
- nombre;
- botón colapsar.

## Destinos principales

```text
Aegis Core
Mi Día
```

## MI ESTADO

- Cuerpo y peso
- Metabolismo
- Energía, ánimo, hambre y foco
- Dolor y síntomas

## CUIDADO DIARIO

- Sueño y recuperación
- Actividad y ejercicio
- Hidratación
- Hábitos y rutinas
- Medicación y suplementos

## ALIMENTACIÓN Y HOGAR

- Alimentación / Nutrición
- Despensa / Compras / Hogar
- Recetas / Preparaciones

## PLANIFICACIÓN

- Plan Vivo
- Alertas / Seguimiento

## INFORMACIÓN

- Reportes
- Exportaciones
- Auditoría Aegis

## SISTEMA

- Perfil y objetivos
- Preferencias
- Memoria
- Autonomía
- Notificaciones
- Privacidad y permisos
- Integraciones
- Configuración

### Comportamiento

- grupos cerrados por defecto salvo el contexto actual;
- una sola selección activa;
- sidebar contraída = iconos + tooltip;
- nunca desplegar todos los grupos simultáneamente por defecto.

---

# 5. Aegis Core — composición

Aegis Core debe ser un feed orgánico, no un grid fijo.

Orden sugerido:

```text
1. Header contextual mínimo
2. Conversación / composer
3. Acciones rápidas contextuales
4. Pulso de hoy
5. Aegis detecta
6. Plan Vivo breve
7. Mi Día breve
8. Mis módulos
9. Ayer / tendencia reciente si aporta valor
10. Reportes / exportación como acción secundaria
```

Una sección irrelevante se oculta.

---

# 6. Primer viewport móvil

Solo debe mostrar lo suficiente para empezar a usar Aegis.

```text
┌──────────────────────────────┐
│ ☰  AION Aegis        🔔  👤 │
│                              │
│ Buenas noches                │
│ ¿Qué está pasando?           │
│                              │
│ ┌──────────────────────────┐ │
│ │ Cuéntame, muéstrame o    │ │
│ │ pregúntame algo…         │ │
│ │                          │ │
│ │ 🎙  📷  📎           ➜ │ │
│ └──────────────────────────┘ │
│                              │
│ [Ya comí] [Tomé agua]        │
│ [¿Qué puedo comer?]          │
│                              │
│ Aegis nota                   │
│ Una señal relevante      >   │
└──────────────────────────────┘
```

No meter ocho indicadores aquí.

---

# 7. Mobile navigation

Bottom navigation:

```text
Aegis Core   Mi Día   + Registrar   Más
```

`Más` abre drawer con todos los módulos.

`+ Registrar` abre bottom sheet contextual.

No duplicar todos los módulos en bottom navigation.

---

# 8. Composer multimodal

Debe ser protagonista pero limpio.

Admite visualmente:

- texto;
- voz;
- cámara;
- galería;
- archivo/documento;
- enviar.

Cuando el usuario hace scroll:

```text
Preguntar a Aegis…                    🎙 📷
```

queda sticky encima de bottom nav.

Tap = expandir composer.

---

# 9. Módulos satélite dentro del Core

Recuperar la lógica legacy `open/minimized/hidden + pinned`, adaptada a UX moderna.

Cada módulo puede tener:

```text
visible_in_core
collapsed_in_core
hidden_from_core
pinned_to_core
core_order
```

## UI recomendada

En Core mostrar una lista compacta:

```text
MIS MÓDULOS

Alimentación              Hoy en curso      >
Sueño                     Último registro   >
Actividad                  Estado breve      >
Despensa                   2 por revisar     >
Plan Vivo                  3 pendientes      >

Ver todos
```

### Interacciones

Tap:
- abrir módulo.

Chevron:
- expandir resumen breve.

Menú `⋯`:
- fijar en Core;
- desfijar;
- ocultar de Core;
- mover arriba/abajo;
- abrir módulo.

`Ocultar de Core` NO desactiva ni elimina el módulo.

---

# 10. Personalizar Aegis Core

Agregar una superficie ligera:

```text
Personalizar Core

[✓] Alimentación      fijado
[✓] Sueño
[ ] Hidratación       oculto del Core
[✓] Actividad
[✓] Despensa
[✓] Plan Vivo         fijado
...
```

Permitir drag/reorder.

No convertir esto en configuración técnica.

---

# 11. Pulso de hoy

Una sola superficie, no múltiples cards.

Mostrar 2–4 elementos pertinentes.

Ejemplo:

```text
AHORA

Sueño 6 h 42 min · Última ingesta hace 10 h 20 min
Agua 350 ml · Próximo: caminar 09:30
```

Cada dato puede:

- abrir detalle;
- mostrar origen;
- mostrar estado `medido / confirmado / calculado / estimado / probable`.

---

# 12. Aegis detecta

Máximo 1–2 señales prominentes.

```text
Aegis detecta

Los tomates podrían necesitar consumirse pronto.

[Ver recetas] [Ignorar] [⋯]
```

Otra:

```text
No encuentro almuerzo registrado.

[Ya comí] [Todavía no] [Omitir]
```

`⋯` puede incluir:

- recordar luego;
- no volver a sugerir esto;
- por qué apareció.

---

# 13. Plan Vivo breve

Core muestra máximo tres momentos:

```text
AHORA
PRÓXIMO
DESPUÉS
```

Acciones:

- Hecho;
- Posponer;
- Cambiar;
- Ver;
- Replanificar.

`Ver plan completo` abre módulo profundo.

---

# 14. Mi Día breve

Core muestra solo 3–5 eventos recientes.

```text
07:15  Desperté
07:27  Agua 350 ml
08:10  Desayuno
10:42  Caminata 32 min
```

`Ver día completo` abre Mi Día.

Tap evento = detalle.

Long press / menú = corregir, nota, evidencia, impacto, anular si reversible.

---

# 15. Resumen de ayer

Aparece únicamente cuando aporta valor.

```text
AYER
7 h 18 min sueño · 3 comidas · 54 min actividad
Mejor hidratación que tu tendencia reciente.

[Ver]
```

No convertirlo en reporte permanente.

---

# 16. Respuestas ricas

La respuesta conversacional puede contener:

- texto corto;
- card;
- receta;
- fotografía;
- chips;
- mini timeline;
- mini gráfica;
- progreso;
- rango;
- botones;
- Action Receipt;
- link al módulo.

No responder siempre con bloques grandes de texto.

---

# 17. Flujo visual de foto

```text
captura
→ preview
→ análisis
→ candidatos
→ una pregunta si hay ambigüedad importante
→ estimación de rango
→ confirmar/corregir
→ resultado
→ Action Receipt
```

Debe existir UI para:

- `Confirmar`;
- `Corregir`;
- editar un ingrediente;
- modificar porción;
- añadir alimento faltante;
- rechazar análisis.

---

# 18. Inspector contextual bajo demanda

Recuperar el concepto legacy, pero no mostrarlo siempre.

Se abre desde:

- `¿Por qué?`;
- `Ver evidencia`;
- `Detalles`;
- `Auditoría`.

Desktop = drawer lateral.

Mobile = bottom sheet/full sheet.

Puede mostrar:

- fuente;
- evidencia;
- confianza;
- datos usados;
- cambios realizados;
- resultado;
- errores;
- enlace a auditoría profunda.

No mostrar razonamiento privado.

---

# 19. Módulo profundo — plantilla general

Cada módulo puede contener bastante información.

```text
Header del módulo
Resumen actual
Acciones principales
Chat contextual
Tendencia
Timeline / historial
Análisis
Registros
Filtros
Evidencia
Correcciones
Exportar
Auditoría
```

El orden se adapta al dominio.

---

# 20. Nutrición — arquitectura visual profunda

Debe recuperar la riqueza del módulo legacy.

## Header

```text
Alimentación
Hoy
[Preguntar a Aegis] [Registrar] [Foto]
```

## Resumen

- ingestas de hoy;
- kcal estimadas/rango;
- proteína/carbohidratos/grasas;
- fibra;
- evidencia/confianza general;
- objetivo/plan si está configurado.

## Comidas

Cada comida puede abrir:

- evidencia original;
- foto;
- hora;
- ingredientes;
- cantidad literal;
- porciones estimadas;
- kcal/macros rango;
- preparación;
- digestión reportada;
- componentes/alérgenos;
- calidad/pertinencia;
- sinergias;
- carga/horario;
- relaciones con sueño, actividad, medicación, metabolismo;
- corregir;
- anular;
- añadir nota.

## Vista avanzada expandible

- rutas metabólicas;
- fisiología;
- bioquímica;
- enzimas/transportadores cuando sea pertinente;
- explicación 0–6 h;
- interpretación 24–72 h cuando sea razonable;
- incertidumbre;
- datos faltantes.

No mostrar esto por defecto en Core.

---

# 21. Metabolismo — arquitectura visual profunda

- fase probable;
- tiempo desde ingesta;
- timeline metabólico;
- sustratos probables;
- estado de glucógeno inferido;
- balance energético;
- actividad que afecta estimación;
- explicación humana;
- explicación técnica expandible;
- evidencia/confianza;
- `¿Por qué Aegis cree esto?`.

No mostrar glucosa real si no hay medición.

---

# 22. Sueño — arquitectura visual profunda

- último sueño;
- dormir/despertar;
- duración;
- calidad;
- despertares;
- regularidad;
- recuperación;
- tendencias;
- rutina previa;
- pantallas;
- wearable vs autoinforme;
- eventos asociados;
- acciones;
- chat contextual.

---

# 23. Actividad — arquitectura visual profunda

- actividad de hoy;
- sesiones;
- duración;
- intensidad/RPE;
- gasto estimado con rango;
- pasos/NEAT si existen;
- recuperación;
- dolor antes/después;
- tendencia;
- relación temporal con sueño/energía/comida;
- chat contextual.

---

# 24. Despensa/Hogar — arquitectura visual profunda

- inventario;
- ubicaciones;
- bajo stock;
- próximos a vencer;
- lista de compras;
- compras recientes;
- recibos;
- historial de movimientos;
- consumo estimado;
- `¿por qué Aegis cree que queda esta cantidad?`;
- cámara para nevera/despensa/recibo;
- chat contextual.

---

# 25. Plan Vivo — arquitectura visual profunda

- timeline hoy;
- planificado vs realizado;
- ahora/próximo/después;
- cambios sugeridos;
- reprogramados;
- bloqueos;
- prioridades;
- plan de mañana;
- drag/reorder cuando tenga sentido;
- chat contextual.

---

# 26. Configuración

No omitir:

```text
Perfil y objetivos
Preferencias

Aegis
  estilo de respuesta
  nivel de detalle
  profundidad técnica
  preguntas automáticas
  autonomía
  memoria

Notificaciones
Privacidad y permisos
Integraciones
Datos / importación / exportación / backup
Apariencia
Accesibilidad
```

---

# 27. Responsive

## Mobile

- una columna;
- scroll vertical;
- drawer;
- bottom sheets;
- sticky composer;
- bottom navigation de 4 destinos;
- target táctil >=44 px;
- módulos profundos ocupan pantalla completa.

## Tablet

- rail compacto o drawer persistente;
- contenido 1–2 columnas;
- panel contextual opcional.

## Desktop

- sidebar colapsable;
- contenido central;
- inspector contextual opcional;
- nunca usar el ancho para meter todos los datos simultáneamente.

---

# 28. Motion

- 150–250 ms;
- expand/collapse suave;
- drawer natural;
- bottom sheet natural;
- subtle violet focus;
- respiración del logo mínima;
- feedback al registrar;
- skeleton discreto si espera.

No partículas permanentes ni animación gamer.

---

# 29. Paleta oficial

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

75% negro/grafito · 15% violeta · 5% dorado · 5% neutral.

---

# 30. Criterio final

La UI está bien cuando:

- Core respira;
- el usuario puede conversar inmediatamente;
- nada importante está enterrado;
- nada secundario invade la pantalla;
- cada módulo abre profundidad;
- el usuario puede personalizar qué módulos resume Core;
- la navegación se entiende sin tutorial;
- las operaciones tienen respuesta visual;
- móvil no parece desktop encogido;
- Aegis se siente vivo sin ser invasivo.
