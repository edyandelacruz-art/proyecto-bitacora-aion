# AION Agent Toolbox — repositorios externos evaluados

Fecha de revisión: 2026-08-12

Objetivo: mantener a mano un conjunto de proyectos open source útiles para AION, BETCA y otros agentes, sin mezclar todavía su código con el núcleo del proyecto. Todos los repositorios listados se revisaron contra su repositorio oficial en GitHub.

## Prioridad recomendada

| Prioridad | Repositorio | Nota | Uso principal | Decisión |
|---|---|---:|---|---|
| A+ | `virgiliojr94/book-to-skill` | 9.5/10 | Convertir libros, PDFs, documentación y carpetas en Skills cargadas bajo demanda | Adoptar primero |
| A+ | `lfnovo/open-notebook` | 9.5/10 | Base de conocimiento privada, RAG, chat con fuentes y API REST | Adoptar |
| A | `petergyang/no-ai-slop` | 9.0/10 | Limpiar redacción genérica de IA y conservar voz | Instalar como skill |
| A | `usestrix/strix` | 9.0/10 | Pentesting automatizado y seguridad CI/CD | Integrar en proyectos propios/autorizados |
| A- | `ayghri/i-have-adhd` | 8.5/10 | Forzar respuestas breves, accionables y numeradas | Adaptar como regla/skill global |
| B+ | `every-app/open-seo` | 8.5/10 | SEO, MCP, auditorías, keywords, backlinks y agentes de marketing | Usar para marketing, con DataForSEO |
| B+ | `diegosouzapw/OmniRoute` | 8.0/10 | Gateway multi-proveedor para modelos y fallback | Probar aislado antes de producción |
| B | `MadsLorentzen/ai-job-search` | 8.0/10 | Flujo completo de búsqueda de empleo, CV, cartas e entrevistas | Reutilizar patrones y adaptar portales |
| C+ | `Anil-matcha/Open-Generative-AI` | 6.5/10 | Interfaz de generación de imagen/video/audio | Mantener como laboratorio, no núcleo |

## Evaluación práctica

### 1. `virgiliojr94/book-to-skill` — 9.5/10

Es el repositorio que más encaja con una arquitectura de agentes basada en documentación. Convierte PDF, EPUB, DOCX, Markdown, HTML y otros formatos en una Skill con `SKILL.md`, capítulos, glosario, patrones y cheatsheet. El agente carga solo el capítulo pertinente en lugar de meter un libro completo al contexto.

**Para AION/BETCA:** mallas curriculares, manuales institucionales, guías, estándares, libros técnicos, documentación interna y paquetes de investigación.

**Cuidado:** un PDF escaneado necesita OCR previo; la calidad de la Skill depende de la extracción y debe validarse antes de usarla como fuente normativa.

### 2. `lfnovo/open-notebook` — 9.5/10

Alternativa self-hosted a NotebookLM con soporte multi-modelo, PDFs, video, audio, páginas web, búsqueda full-text/vectorial, chat contextual y API REST. Admite proveedores externos y modelos locales como Ollama/LM Studio.

**Para AION/BETCA:** biblioteca de conocimiento persistente, repositorios de planeaciones, investigación, documentos institucionales y consultas desde agentes por API.

**Cuidado:** que la base sea local no significa que todo el procesamiento sea local. Si se usa OpenAI/Anthropic/u otro proveedor remoto, el contenido enviado al modelo sale del equipo. Cambiar las credenciales por defecto de SurrealDB y la clave de cifrado antes de exponer el servicio.

### 3. `petergyang/no-ai-slop` — 9.0/10

Skill pequeña y muy útil. Detecta y elimina más de 20 patrones de redacción repetitiva o artificial y puede usarse desde ChatGPT, Codex, Claude Code y otros agentes compatibles.

**Para AION/BETCA:** informes, materiales, correos, propuestas, textos académicos y revisión de estilo.

**Cuidado:** es deliberadamente opinada; no debe aplicarse a ciegas cuando una estructura retórica concreta sea intencional.

### 4. `usestrix/strix` — 9.0/10

Herramienta de pentesting con agentes, ejecución dinámica, PoC, análisis estático/dinámico, auto-fix y CI/CD. Tiene Skills para agentes y licencia Apache-2.0.

**Para AION/BETCA:** revisar aplicaciones propias antes de despliegue, escanear PRs y validar vulnerabilidades reales.

**Cuidado:** usar exclusivamente en sistemas propios o donde exista autorización explícita. Requiere Docker y un proveedor LLM. Ejecutarlo aislado de secretos de producción.

### 5. `ayghri/i-have-adhd` — 8.5/10

No es un agente completo sino una disciplina de salida: acción primero, pasos numerados, menos tangentes, un siguiente paso concreto y sin cierres innecesarios.

**Para AION:** convertirlo en una capa global de comportamiento para agentes operativos y tareas de soporte.

**Cuidado:** no conviene aplicarlo a informes extensos o análisis que sí necesitan contexto y matices.

### 6. `every-app/open-seo` — 8.5/10

Buen proyecto para SEO con MCP y Skills para agentes. Incluye keyword research, rank tracking, competidores, backlinks, auditorías y visibilidad en IA.

**Para BETCA/marketing:** investigación de palabras clave, auditoría web, seguimiento orgánico y automatización con agentes.

**Cuidado:** no es un reemplazo completamente gratuito de Semrush/Ahrefs. El self-hosting requiere una clave de DataForSEO y el consumo se paga por uso.

### 7. `diegosouzapw/OmniRoute` — 8.0/10

Gateway multi-proveedor muy activo, compatible con Claude Code, Codex, Cursor, Cline y otros. Su fortaleza es el fallback entre proveedores/modelos y la centralización del acceso.

**Para AION:** capa experimental de routing para reducir dependencia de un único proveedor y manejar cuotas.

**Cuidado:** es una pieza sensible porque toca credenciales y tráfico de modelos. Las cifras de tokens gratuitos dependen de los términos y límites de terceros y pueden cambiar. Probarlo primero con claves separadas, límites de gasto y sin secretos productivos.

### 8. `MadsLorentzen/ai-job-search` — 8.0/10

Arquitectura madura para perfil profesional, scoring de vacantes, CV, cartas, entrevistas, seguimiento y sincronización. Incluye `AGENTS.md` y partes reutilizables por Codex, Antigravity y otros agentes.

**Para AION:** tomar sus patrones de workflow, revisión por segundo agente, tracking y generación documental.

**Cuidado:** los portales de empleo incluidos están orientados en gran medida a Dinamarca; habría que crear Skills para Colombia y portales docentes/locales.

### 9. `Anil-matcha/Open-Generative-AI` — 6.5/10

Interfaz amplia para imagen, video, audio y otros flujos creativos, con licencia MIT y una comunidad grande.

**Para AION/BETCA:** laboratorio de contenido multimedia o referencia de UX/automatización creativa.

**Cuidado:** el README deja claro que gran parte del catálogo está impulsado por MuAPI y además promociona planes white-label. Por eso no lo trataría como una sustitución realmente gratuita y autosuficiente de todas las plataformas. Mantenerlo fuera del núcleo hasta auditar costes, dependencias y manejo de claves.

## Orden de adopción

1. `book-to-skill` + `open-notebook` como capa de conocimiento.
2. `no-ai-slop` + una adaptación de `i-have-adhd` como capa de comportamiento de los agentes.
3. `strix` como guardia de seguridad para repos propios.
4. `open-seo` para marketing y posicionamiento.
5. `OmniRoute` en sandbox para routing/fallback.
6. `ai-job-search` como biblioteca de patrones de workflow.
7. `Open-Generative-AI` solo como laboratorio multimedia hasta completar auditoría.

## Repositorios fuente

- https://github.com/lfnovo/open-notebook
- https://github.com/petergyang/no-ai-slop
- https://github.com/ayghri/i-have-adhd
- https://github.com/every-app/open-seo
- https://github.com/virgiliojr94/book-to-skill
- https://github.com/diegosouzapw/OmniRoute
- https://github.com/MadsLorentzen/ai-job-search
- https://github.com/usestrix/strix
- https://github.com/Anil-matcha/Open-Generative-AI

## Regla de integración

No ejecutar instaladores de terceros ni entregar credenciales automáticamente. Primero clonar, revisar `README`, `LICENSE`, dependencias, workflows y scripts; después habilitar por proyecto. Para servicios que reciban API keys, usar claves separadas con límites de gasto y nunca reutilizar secretos productivos durante pruebas.
