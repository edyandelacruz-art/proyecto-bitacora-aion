# AION AEGIS CORE — CONTRATO DE IDENTIDAD VISUAL EXACTA

**ID normativo:** `STITCH-AEGIS-CORE-EXACT-2026-07-28-v1`  
**Alcance:** página principal de AION Aegis Core.  
**Carácter:** obligatorio, no interpretativo.

---

## 1. Regla absoluta

La exportación de Stitch almacenada en:

```text
reference/aion-aegis-core/stitch-exact-v1/
```

NO es inspiración, referencia aproximada, moodboard ni punto de partida.

Es la **fuente visual canónica**.

La interfaz productiva debe ser una copia visual exacta de esa referencia antes de conectar o ampliar cualquier funcionalidad.

Quedan prohibidas expresiones o decisiones como:

- “hacer algo parecido”;
- “inspirarse en”;
- “reinterpretar”;
- “modernizar”;
- “mejorar la estética”;
- “simplificar visualmente”;
- “adaptar libremente”;
- “usar una versión propia”;
- “mantener la esencia”;
- “aproximar el layout”.

La orden es:

> **REPRODUCIR EXACTAMENTE LA IDENTIDAD, COMPOSICIÓN, PROPORCIONES, ESPACIADO, TIPOGRAFÍA, COLORES, SUPERFICIES, BORDES, RADIOS, DENSIDAD, ESTADOS Y MOVIMIENTO DEL ZIP CANÓNICO.**

---

## 2. Fuentes de verdad y precedencia

En caso de duda, usar este orden:

1. `screen.png` reconstruido: verdad visual y de composición final.
2. `code.html`: verdad de estructura DOM, clases, medidas, comportamiento y estilos.
3. `DESIGN.md`: verdad de tokens, tipografía y filosofía visual.
4. Este contrato: verdad de implementación y aceptación.
5. Otras especificaciones del repositorio: funcionalidad y arquitectura, sin autorización para alterar la identidad visual.

Si dos documentos anteriores contradicen una interpretación visual nueva, gana la referencia exacta de Stitch.

---

## 3. Integridad de la referencia

Antes de implementar:

```bash
cd reference/aion-aegis-core/stitch-exact-v1
bash restore-reference.sh
```

Verificar:

```text
ZIP SHA-256:
66ccf8cab625ac52a3a76cea8a20dfa4922ad327309bdb10b0c9d9773b1625f6

screen.png SHA-256:
aa0692caf8d80fc90c17a2c31a02089749a48813534abd3f89a4f640725a17e9

code.html SHA-256:
d4df987fae4d247fa2fb4efe20aa6b53904acc022e1bd1826ad98790acd3f729

DESIGN.md SHA-256:
e039c740638ae167573565b28c9ec6a221e84deb3e46c082255fa7288bad18f6
```

No usar una referencia cuyo hash no coincida.

---

## 4. Implementación en dos fases obligatorias

### Fase A — réplica visual exacta

Primero construir una ruta o estado visual verificable que reproduzca exactamente la referencia, todavía con datos de demostración controlados si es necesario.

En esta fase NO:

- añadir nuevos diseños;
- alterar navegación;
- sustituir componentes;
- cambiar textos por conveniencia;
- conectar lógica que cambie el layout;
- eliminar zonas porque todavía no tengan backend;
- adaptar la identidad a componentes existentes del prototipo anterior.

El prototipo anterior se adapta a esta identidad; esta identidad NO se degrada para acomodar el prototipo anterior.

### Fase B — conexión funcional sin alteración visual

Solo después de aprobar la réplica exacta:

- conectar datos reales;
- conectar módulos reales;
- conectar Aegis Core;
- conectar Mi Día;
- conectar Analíticas;
- conectar registros;
- conectar drawer inteligente derecho;
- conectar estados de usuario;
- conectar acciones, persistencia, auditoría y agentes.

La conexión funcional debe sustituir datos de demostración, no rediseñar los contenedores.

---

## 5. Elementos visuales no negociables

Deben preservarse exactamente según `screen.png` y `code.html`:

- fondo negro profundo;
- jerarquía tonal de superficies;
- identidad violeta/lavanda;
- acentos dorados;
- tipografías Hanken Grotesk y Manrope;
- sidebar estrecha y su expansión;
- top bar;
- escala tipográfica;
- radios;
- bordes de baja opacidad;
- espaciado;
- tamaño y forma del composer;
- botón principal violeta;
- composición del dashboard;
- panel “Estado de Módulos”;
- geometría, tamaños y alineación de las tarjetas;
- visualización “Síntesis del Día”;
- iconografía lineal;
- profundidad, glows y transparencias;
- densidad visual;
- comportamiento hover y transiciones definidas en el HTML.

No sustituir Hanken Grotesk o Manrope por fuentes “parecidas”.

No sustituir colores por equivalentes aproximados.

No convertir la composición en Material UI genérico, dashboard Bootstrap, tarjetas corporativas o diseño nativo improvisado.

---

## 6. Tokens exactos

Usar los tokens de `DESIGN.md` y `code.html` sin aproximarlos.

Entre los valores canónicos están:

```text
#070709
#0D0B12
#111017
#17131F
#1D1728
#7C3AED
#6D28D9
#8B5CF6
#C4B5FD
#DDD6FE
#D6B36A
#F3D18A
#A9803A
#F4F4F5
#A1A1AA
#71717A
```

Cuando `DESIGN.md` y `code.html` definan variantes adicionales, preservarlas también.

---

## 7. React/TypeScript no autoriza rediseño

Se permite trasladar el HTML a React/TypeScript/Expo/Web solamente como cambio de tecnología.

La traducción debe preservar:

- estructura visual;
- orden de elementos;
- medidas;
- clases/tokens equivalentes;
- estados;
- animaciones;
- interacción;
- respuesta al viewport.

No usar la migración tecnológica como excusa para cambiar la apariencia.

---

## 8. Arquitectura funcional que debe incorporarse después

La réplica exacta debe convertirse en la página principal real de Aegis Core y después incorporar la arquitectura ya definida:

### Superficies principales

- Aegis Core;
- Mi Día;
- Analíticas.

### Grupos de módulos

- Mi Estado;
- Cuidado Diario;
- Alimentación y Hogar;
- Planificación;
- Información;
- Sistema.

### Drawer derecho inteligente

El drawer derecho:

- no es una pestaña;
- no es un selector manual;
- normalmente está cerrado;
- se activa por contexto;
- identifica automáticamente módulo principal y relacionados;
- muestra análisis, edición, confirmación y cambios;
- mantiene Core visible;
- adapta su identidad al módulo;
- no abre varios drawers para una sola interacción.

Estas capacidades deben integrarse usando la misma identidad exacta del ZIP, sin introducir otro lenguaje visual.

---

## 9. Datos reales, no valores inventados

Los valores del prototipo visual son placeholders de referencia.

En producción:

- no inventar sueño;
- no inventar calorías;
- no inventar gasto;
- no inventar metabolismo;
- no inventar correlaciones;
- no inventar confianza;
- no inventar estados clínicos.

Cuando el dato real no exista, conservar la geometría del componente y mostrar un estado vacío, pendiente o desconocido diseñado dentro del mismo sistema visual.

---

## 10. Prueba visual obligatoria

Crear pruebas de regresión visual en navegador controlado.

Viewport canónico:

```text
1600 × 1280
```

Comparar la implementación con `restored/screen.png`.

Criterio:

- objetivo: coincidencia pixelar;
- no se aceptan diferencias de layout, escala, color, radio, tipografía o espaciado;
- solo se toleran diferencias mínimas de rasterización/antialiasing del entorno;
- cualquier diferencia intencional requiere autorización humana explícita.

Implementar prueba con Playwright o herramienta equivalente y conservar artefactos de comparación:

- baseline;
- screenshot actual;
- diff.

No marcar la identidad como completada sin prueba visual.

---

## 11. Definition of Done visual

La página principal solo puede declararse terminada si:

1. la referencia fue restaurada y validada por hash;
2. la ruta de réplica exacta existe;
3. el screenshot a 1600×1280 coincide con la referencia;
4. se usan las tipografías exactas;
5. se usan los tokens exactos;
6. la sidebar conserva geometría y comportamiento;
7. top bar y usuario conservan identidad y son interactivos;
8. composer conserva identidad;
9. Síntesis del Día conserva identidad;
10. Estado de Módulos conserva identidad;
11. el drawer inteligente usa el mismo lenguaje visual;
12. no quedan componentes heredados con estética incompatible;
13. la conexión de datos no altera el layout;
14. existe prueba visual automatizada;
15. la auditoría humana aprueba la coincidencia.

---

## 12. Orden final para Antigravity

> Restaura la referencia exacta. Ejecuta `code.html`. Estudia `DESIGN.md`. Compara contra `screen.png`. Construye primero una copia visual exacta. No la interpretes ni la mejores. Después conecta la arquitectura y los datos reales sin cambiar su identidad. Si el frontend productivo no se ve igual, la tarea no está terminada.
