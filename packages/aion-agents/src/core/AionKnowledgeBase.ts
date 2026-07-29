/**
 * AionKnowledgeBase — Base de Conocimiento Profunda Embebida
 *
 * Contiene expertise real y verificada en:
 * - Bioquímica metabólica y señalización celular
 * - Fisiología del ejercicio y rendimiento neuromuscular
 * - Nutrición clínica y composición de alimentos
 * - Arquitectura circadiana y sueño
 * - Hidratación y equilibrio hidroelectrolítico
 * - Finanzas personales y presupuesto
 *
 * También gestiona el SISTEMA DE APRENDIZAJE CONTINUO:
 * el agente recuerda correcciones, preferencias de estilo
 * y retroalimentación del usuario para mejorar con cada interacción.
 */

export interface KnowledgeEntry {
  domain: string;
  topic: string;
  keywords: string[];
  content: string;
}

export interface UserLearning {
  id: string;
  timestamp: string;
  type: 'correction' | 'preference' | 'feedback' | 'fact';
  content: string;
}

const STORAGE_KEY_LEARNINGS = 'aion_agent_learnings';

export class AionKnowledgeBase {
  private static instance: AionKnowledgeBase;
  private learnings: UserLearning[] = [];

  private entries: KnowledgeEntry[] = [
    // ═══════════════════════════════════════════════════════════════════
    // BIOQUÍMICA METABÓLICA
    // ═══════════════════════════════════════════════════════════════════
    {
      domain: 'NUTRITION',
      topic: 'Síntesis Proteica Muscular (MPS)',
      keywords: ['proteína', 'músculo', 'mps', 'mtORC1', 'leucina', 'aminoácidos', 'anabólico'],
      content: 'La síntesis proteica muscular (MPS) se activa principalmente a través de la vía mTORC1, estimulada por la leucina. Se necesitan aproximadamente 2.5-3g de leucina por comida (equivalente a ~30-40g de proteína de alta calidad) para maximizar la señal anabólica. La ventana de elevación de MPS dura 3-5 horas tras la ingesta, por lo que distribuir la proteína en 4-5 comidas optimiza la síntesis durante las 24h.',
    },
    {
      domain: 'NUTRITION',
      topic: 'Índice Glucémico y Carga Glucémica',
      keywords: ['glucosa', 'azúcar', 'insulina', 'glucémico', 'carbohidrato', 'arroz', 'pan', 'avena'],
      content: 'El índice glucémico (IG) mide la velocidad a la que un carbohidrato eleva la glucosa sanguínea. Alimentos de IG bajo (<55) como la avena, legumbres y frutas enteras producen picos moderados de insulina, favoreciendo la oxidación de grasas. La carga glucémica (CG) es más útil clínicamente porque considera la porción real consumida. Un pico glucémico posprandial ideal se mantiene por debajo de 140 mg/dL.',
    },
    {
      domain: 'NUTRITION',
      topic: 'Lipólisis y Oxidación de Grasas',
      keywords: ['grasa', 'quemar', 'lipolisis', 'oxidación', 'déficit', 'cetosis', 'ácidos grasos'],
      content: 'La lipólisis es la hidrólisis de triglicéridos almacenados en adipocitos, liberando ácidos grasos libres (AGL) y glicerol al torrente sanguíneo. La oxidación de grasas se maximiza en ejercicio aeróbico de baja-moderada intensidad (60-70% FCmax, Zona 2), donde la tasa de oxidación lipídica puede alcanzar 0.5-1.0 g/min. La insulina elevada inhibe la lipólisis, por lo que el ayuno o periodos prolongados sin carbohidratos refinados favorecen la movilización de grasas.',
    },
    {
      domain: 'NUTRITION',
      topic: 'Ciclo de Krebs y Fosforilación Oxidativa',
      keywords: ['energía', 'atp', 'krebs', 'mitocondria', 'metabolismo', 'respiración celular'],
      content: 'El ciclo de Krebs (ciclo del ácido cítrico) opera en la matriz mitocondrial, oxidando acetil-CoA derivado de carbohidratos, grasas y aminoácidos. Cada vuelta genera 3 NADH, 1 FADH2 y 1 GTP. La cadena de transporte de electrones acoplada a la fosforilación oxidativa produce ~30-32 ATP por molécula de glucosa, haciendo de la respiración aeróbica la vía más eficiente de producción energética.',
    },
    {
      domain: 'NUTRITION',
      topic: 'Micronutrientes Esenciales',
      keywords: ['vitamina', 'mineral', 'hierro', 'zinc', 'magnesio', 'vitamina d', 'b12', 'deficiencia'],
      content: 'La vitamina D regula la absorción intestinal de calcio y la mineralización ósea; niveles séricos óptimos son 40-60 ng/mL. El magnesio participa en >300 reacciones enzimáticas, incluyendo la síntesis de ATP y la regulación neuromuscular. El zinc es cofactor de la superóxido dismutasa (SOD) y es esencial para la función inmune. La deficiencia de B12 afecta la mielinización neuronal y la eritropoyesis.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // FISIOLOGÍA DEL EJERCICIO
    // ═══════════════════════════════════════════════════════════════════
    {
      domain: 'ACTIVITY',
      topic: 'Zonas de Frecuencia Cardíaca y METs',
      keywords: ['zona', 'cardíaca', 'frecuencia', 'mets', 'aeróbico', 'anaeróbico', 'umbral', 'ejercicio'],
      content: 'Zona 1 (50-60% FCmax): Recuperación activa, 3-4 METs. Zona 2 (60-70% FCmax): Base aeróbica, máxima oxidación de grasas, 5-7 METs. Zona 3 (70-80% FCmax): Umbral aeróbico, transición lactato, 7-9 METs. Zona 4 (80-90% FCmax): Umbral anaeróbico, depleción rápida de glucógeno, 9-12 METs. Zona 5 (90-100% FCmax): Esfuerzo máximo, producción predominante de lactato, >12 METs. Para salud cardiovascular general, Zona 2 durante 150-180 min/semana es la recomendación basada en evidencia.',
    },
    {
      domain: 'ACTIVITY',
      topic: 'Hipertrofia Muscular y Entrenamiento de Fuerza',
      keywords: ['hipertrofia', 'fuerza', 'repeticiones', 'series', 'peso', 'músculo', 'gym', 'pesas'],
      content: 'La hipertrofia muscular se optimiza con 10-20 series semanales por grupo muscular, 6-30 repeticiones por serie llevadas cerca del fallo muscular (RIR 0-3). La tensión mecánica es el estímulo primario, mediada por mecanotransducción celular. El tiempo bajo tensión ideal por serie es de 30-60 segundos. La supercompensación proteica requiere ~1.6-2.2 g/kg/día de proteína distribuida en 4+ comidas. El descanso entre series de 2-3 minutos maximiza el volumen de entrenamiento.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // SUEÑO Y RITMO CIRCADIANO
    // ═══════════════════════════════════════════════════════════════════
    {
      domain: 'SLEEP',
      topic: 'Arquitectura del Sueño NREM/REM',
      keywords: ['sueño', 'dormir', 'nrem', 'rem', 'profundo', 'ligero', 'ciclo', 'descanso', 'cansado', 'trasnoché'],
      content: 'El sueño se organiza en ciclos de ~90 minutos. Cada ciclo contiene fases NREM (N1 superficial, N2 intermedio, N3 profundo/ondas lentas) y REM. El sueño N3 predomina en la primera mitad de la noche y es crítico para la consolidación de memoria declarativa, la secreción de hormona del crecimiento (GH) y la reparación tisular. El sueño REM predomina en la segunda mitad y es esencial para la regulación emocional y la memoria procedimental. Un adulto necesita 7-9 horas, con ~20% en N3 y ~20-25% en REM.',
    },
    {
      domain: 'SLEEP',
      topic: 'Regulación de Melatonina y Luz Azul',
      keywords: ['melatonina', 'luz', 'pantalla', 'circadiano', 'reloj', 'noche', 'despertar'],
      content: 'La melatonina es sintetizada por la glándula pineal a partir de serotonina, bajo el control del núcleo supraquiasmático (NSQ). La exposición a luz azul (460-480 nm) de pantallas suprime la secreción de melatonina en un 50% si ocurre 2 horas antes de dormir. Estrategias de higiene circadiana: exposición a luz solar matutina (>10,000 lux) dentro de los primeros 30 min tras despertar, reducir luz artificial a <50 lux 1h antes de dormir, mantener la habitación a 18-20°C.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // HIDRATACIÓN Y ELECTROLITOS
    // ═══════════════════════════════════════════════════════════════════
    {
      domain: 'HYDRATION',
      topic: 'Osmolalidad y Bomba Sodio-Potasio',
      keywords: ['agua', 'sed', 'hidratación', 'osmolalidad', 'sodio', 'potasio', 'electrolitos', 'riñón'],
      content: 'La osmolalidad plasmática normal es 275-295 mOsm/kg. La bomba Na+/K+-ATPasa mantiene el gradiente electroquímico celular: 3 Na+ fuera, 2 K+ dentro por ciclo, consumiendo 1 ATP. La deshidratación del 2% del peso corporal reduce el rendimiento cognitivo y físico. Ingesta hídrica recomendada: 35 mL/kg/día base + 500-750 mL por hora de ejercicio. Añadir 0.5-1g de sodio por litro de agua durante ejercicio prolongado (>60 min) previene la hiponatremia dilucional.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // FINANZAS PERSONALES
    // ═══════════════════════════════════════════════════════════════════
    {
      domain: 'FINANCES',
      topic: 'Presupuesto Base Cero en COP',
      keywords: ['presupuesto', 'gasto', 'ingreso', 'ahorro', 'lucas', 'plata', 'dinero', 'barras', 'pesos'],
      content: 'En el presupuesto base cero (PBC), cada peso de ingreso se asigna a una categoría antes de gastarse. La regla 50/30/20 adapta: 50% necesidades (arriendo, servicios, transporte, alimentación), 30% deseos (entretenimiento, ropa), 20% ahorro/inversión/deuda. En Pesos Colombianos (COP), un ejercicio mensual de conciliación compara lo presupuestado vs lo ejecutado. El flujo de caja libre personal = Ingreso neto - Gastos fijos - Gastos variables.',
    },
    {
      domain: 'FINANCES',
      topic: 'Contabilidad de Doble Entrada',
      keywords: ['contabilidad', 'débito', 'crédito', 'balance', 'registro', 'ledger', 'cuenta'],
      content: 'En la contabilidad de doble entrada, cada transacción afecta al menos dos cuentas: un débito y un crédito. Activos = Pasivos + Patrimonio. Un gasto de $50,000 COP en almuerzo se registra como: Débito a Gastos-Alimentación $50,000 / Crédito a Efectivo $50,000. La auditoría mensual verifica que la suma de débitos iguale la suma de créditos en todas las cuentas.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // SALUD Y FARMACOVIGILANCIA
    // ═══════════════════════════════════════════════════════════════════
    {
      domain: 'MEDICATION',
      topic: 'Suplementación Basada en Evidencia',
      keywords: ['suplemento', 'creatina', 'omega', 'vitamina', 'magnesio', 'probiótico'],
      content: 'Suplementos con evidencia sólida (nivel A): Creatina monohidrato (3-5 g/día) para rendimiento y cognición; Omega-3 EPA/DHA (2-3 g/día) para inflamación sistémica y salud cardiovascular; Vitamina D3 (2000-4000 UI/día) si niveles séricos <30 ng/mL; Magnesio glicinato/bisglicinato (200-400 mg/día) para calidad de sueño y relajación neuromuscular; Probióticos multiespecie para integridad de barrera intestinal.',
    },
  ];

  private constructor() {
    this.loadLearnings();
  }

  public static getInstance(): AionKnowledgeBase {
    if (!AionKnowledgeBase.instance) {
      AionKnowledgeBase.instance = new AionKnowledgeBase();
    }
    return AionKnowledgeBase.instance;
  }

  /** Busca entradas de conocimiento relevantes por keywords coincidentes */
  public findRelevantKnowledge(text: string, domain?: string): KnowledgeEntry[] {
    const textLower = text.toLowerCase();
    const tokens = textLower.split(/\s+/);

    return this.entries
      .filter((entry) => {
        if (domain && entry.domain !== domain && domain !== 'CONVERSATIONAL') return false;
        return entry.keywords.some((kw) => tokens.some((t) => t.includes(kw) || kw.includes(t)));
      })
      .slice(0, 3); // Máximo 3 entradas relevantes para no sobrecargar el contexto
  }

  /** Construye un contexto de conocimiento como string para inyectar al generador */
  public buildKnowledgeContext(text: string, domain?: string): string {
    const relevant = this.findRelevantKnowledge(text, domain);
    if (relevant.length === 0) return '';
    return relevant.map((e) => `[${e.topic}]: ${e.content}`).join('\n\n');
  }

  // ═══════════════════════════════════════════════════════════════════
  // SISTEMA DE APRENDIZAJE CONTINUO
  // ═══════════════════════════════════════════════════════════════════

  /** Registra una corrección o preferencia del usuario para aprendizaje futuro */
  public addLearning(type: UserLearning['type'], content: string): void {
    const learning: UserLearning = {
      id: `learn_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      content,
    };
    this.learnings.push(learning);
    this.saveLearnings();
  }

  /** Obtiene todas las correcciones y preferencias aprendidas */
  public getLearnings(): UserLearning[] {
    return this.learnings;
  }

  /** Construye contexto de aprendizaje para inyectar al generador */
  public buildLearningContext(): string {
    if (this.learnings.length === 0) return '';
    const recent = this.learnings.slice(-10); // Últimas 10 lecciones
    return recent.map((l) => `[${l.type.toUpperCase()}]: ${l.content}`).join('\n');
  }

  private saveLearnings(): void {
    try {
      localStorage.setItem(STORAGE_KEY_LEARNINGS, JSON.stringify(this.learnings));
    } catch (_) {}
  }

  private loadLearnings(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LEARNINGS);
      if (stored) this.learnings = JSON.parse(stored);
    } catch (_) {
      this.learnings = [];
    }
  }
}
