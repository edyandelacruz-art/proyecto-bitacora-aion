import { MetabolicPhase, ResponseLanguageProfile } from '@aion/shared-types';

export interface DynamicNutrientBubble {
  id: 'glucose' | 'fats' | 'protein' | 'glycogen';
  tag: string;
  title: string;
  simple: string;
  detail: string;
  color: string;
}

export class LanguageEngine {
  private static instance: LanguageEngine;

  private constructor() {}

  public static getInstance(): LanguageEngine {
    if (!LanguageEngine.instance) {
      LanguageEngine.instance = new LanguageEngine();
    }
    return LanguageEngine.instance;
  }

  /**
   * Los TÍTULOS son SIEMPRE simples, claros y humanos.
   * La profundidad técnica/bioquímica/clínica reside exclusivamente en el CUERPO de la explicación.
   */
  public translateMetabolicExplanation(
    phase: MetabolicPhase,
    hoursElapsed: number,
    lastMealName?: string,
    requestedMode?: ResponseLanguageProfile['mode']
  ): {
    title: string;
    naturalExplanation: string;
    technicalExplanation: string;
    fatBurnHuman: string;
  } {
    const mode = requestedMode || 'human';

    if (phase === 'POSPRANDIAL' || hoursElapsed < 3.5) {
      const title = 'Digestión y Absorción Activa';

      if (mode === 'simple') {
        return {
          title,
          naturalExplanation: 'Acabas de comer. Tu cuerpo está procesando los alimentos para darle energía a tus músculos y órganos.',
          technicalExplanation: 'Glucemia e insulina elevadas en plasma.',
          fatBurnHuman: 'En pausa temporal',
        };
      } else if (mode === 'biochemical') {
        return {
          title,
          naturalExplanation: `Han pasado ${hoursElapsed.toFixed(1)}h desde tu última ingesta${lastMealName ? ` (${lastMealName})` : ''}. Tu cuerpo está digiriendo y convirtiendo los nutrientes en energía disponible para tus células.`,
          technicalExplanation: `PARÁGRAFO 1 — SEÑALIZACIÓN ENZIMÁTICA Y GLUCÓLISIS:
La elevación de la glucemia pancreática induce la secreción de insulina. La insulina se une a receptores tirosina quinasa (RTK), activando la vía IRS-1 -> PI3K -> Akt/PKB. Akt activa la exocitosis de vesículas con el transportador GLUT4 hacia la membrana muscular y adipocitaria. Simultáneamente, la Hexocinasa II fosforila la glucosa libre a Glucosa-6-Fosfato (G6P) para glucólisis o glucogenogénesis.

PARÁGRAFO 2 — LIPOGÉNESIS Y SUPRESIÓN DE LA BETA-OXIDACIÓN:
La insulina inactiva la Lipasa Sensible a Hormonas (HSL) e inhibe el AMPc. La Acetil-CoA Carboxilasa (ACC) produce Malonil-CoA, el cual actúa como inhibidor alostérico directo de la Carnitina Palmitoiltransferasa 1 (CPT-1), bloqueando la entrada de ácidos grasos a la mitocondria y pausando la beta-oxidación.

PARÁGRAFO 3 — SÍNTESIS PROTEICA Y COMPLEJO RHEB/mTORC1:
La L-Leucina estimula las GTPasas Rag A/B, acoplando el complejo mTORC1 en el lisosoma. mTORC1 fosforila a p70S6K1 e inactiva a 4E-BP1, desencadenando la traducción ribosómica del ARNm y la síntesis proteica muscular.`,
          fatBurnHuman: 'Inhibida por inhibición alostérica de CPT-1 vía Malonil-CoA',
        };
      } else if (mode === 'clinical') {
        return {
          title,
          naturalExplanation: `Evaluación clínica post-ingesta (${hoursElapsed.toFixed(1)}h). El paciente se encuentra en respuesta fisiológica posprandial normoglucémica sostenida.`,
          technicalExplanation: `EVALUACIÓN CLÍNICA METABÓLICA:
1. Dinámica Glucémica: Glucemia plasmática en rango posprandial fisiológico (<140 mg/dL). Supresión de la gluconeogénesis hepática de novo por captación periférica de glucosa.
2. Perfil Lipídico Posprandial: Aumento transitorio de quilomicrones en circulación y activación endotelial de la Lipoproteína Lipasa (LPL) dependiente de ApoC-II.
3. Péptidos de Saciedad: Estimulación entérica de GLP-1 y PYY con inhibición del péptido orexigénico Ghrelina.`,
          fatBurnHuman: 'Supresión fisiológica normal por pico insulínico',
        };
      } else if (mode === 'technical') {
        return {
          title,
          naturalExplanation: `Transcurridas ${hoursElapsed.toFixed(1)}h desde la ingesta. El pool de glucosa y aminoácidos está enriquecido en plasma.`,
          technicalExplanation: 'Glucemia en pico posprandial. Captación de glucosa vía GLUT4 regulada por insulina. Lipogénesis y síntesis de glucógeno activa.',
          fatBurnHuman: 'Menor temporalmente',
        };
      } else {
        // MODO HUMANO / ADAPTATIVO
        return {
          title,
          naturalExplanation: `Terminaste de comer hace aproximadamente ${hoursElapsed.toFixed(1)} horas${lastMealName ? ` (${lastMealName})` : ''}. Tu cuerpo está usando los nutrientes que ingeriste para reponer tu energía y reparar tejidos.`,
          technicalExplanation: 'Nivel de insulina elevado facilitando la entrada de glucosa a los músculos y la síntesis proteica.',
          fatBurnHuman: 'Usando energía de la comida',
        };
      }
    } else if (phase === 'POSTABSORTIVO' || (hoursElapsed >= 3.5 && hoursElapsed < 7)) {
      const title = 'Uso de Reservas Energéticas';

      if (mode === 'biochemical') {
        return {
          title,
          naturalExplanation: `Han pasado ${hoursElapsed.toFixed(1)} horas desde tu última comida. Tu cuerpo terminó de digerir e inició la liberación paulatina de sus reservas internas.`,
          technicalExplanation: `PARÁGRAFO 1 — AMPc, PKA Y GLUCOGENÓLISIS HEPÁTICA:
La elevación del glucagón acoplado a receptores Gs activa la adenilato ciclasa y la Proteín Quinasa A (PKA). La PKA fosforila la Glucógeno Fosforilasa a, la cual cataliza la fosforolisis de enlaces alfa-1,4-glucosídicos liberando Glucosa-6-Fosfato desfosforilada por la Glucosa-6-Fosfatasa hepática a glucosa libre en plasma.

PARÁGRAFO 2 — LIBERACIÓN DE HSL Y DESINHIBICIÓN DE LA CPT-1:
En los adipocitos, la PKA fosforila la Lipasa Sensible a Hormonas (HSL) y la Perilipina-1. La reducción de Malonil-CoA levanta la inhibición sobre la CPT-1, permitiendo la esterificación de ácidos grasos con carnitina para su importación a la matriz mitocondrial.

PARÁGRAFO 3 — ESPIRAL DE BETA-OXIDACIÓN:
La beta-oxidación ejecuta 4 pasos recurrentes (Acil-CoA Deshidrogenasa, Enoil-CoA Hidratasa, 3-Hidroxiacil-CoA Deshidrogenasa y Beta-Cetotiolasa), produciendo Acetil-CoA, NADH y FADH2 para el ciclo de Krebs.`,
          fatBurnHuman: 'Fosforilación de HSL mediada por PKA y desinhibición de CPT-1',
        };
      } else if (mode === 'clinical') {
        return {
          title,
          naturalExplanation: `Evaluación postabsortiva (${hoursElapsed.toFixed(1)}h). Transición fisiológica hacia el uso de sustratos endógenos para sostener la glucemia basal.`,
          technicalExplanation: `REVISIÓN CLÍNICA FISIOLÓGICA:
1. Cociente Insulina/Glucagón: Descenso de I/G plasmática con activación del eje catabólico adaptativo sostenido por glucagón.
2. Tasa Glucogenolítica: Salida neta hepática a 2.0 mg/kg/min para abastecer los requerimientos obligatorios del sistema nervioso central.
3. Partición de Lipídicos: Elevación progresiva de ácidos grasos libres (FFA) con cociente respiratorio (RQ) descendiendo hacia 0.82.`,
          fatBurnHuman: 'Transición hacia la oxidación lipídica endógena sostenida',
        };
      } else if (mode === 'simple') {
        return {
          title,
          naturalExplanation: 'Ya pasaron varias horas desde la comida. Tu cuerpo terminó de digerir y empieza a usar reservas.',
          technicalExplanation: 'Liberación de glucógeno hepático.',
          fatBurnHuman: 'Usando reservas ligeras',
        };
      } else {
        // MODO HUMANO / ADAPTATIVO
        return {
          title,
          naturalExplanation: `Ya pasó un buen rato (${hoursElapsed.toFixed(1)} horas) desde tu última comida. Tu cuerpo terminó de procesar los alimentos e inició el uso progresivo de sus reservas naturales.`,
          technicalExplanation: 'Aumento paulatino de glucagón facilitando la liberación de glucosa desde el hígado.',
          fatBurnHuman: 'Empieza a usar grasas',
        };
      }
    } else {
      // AYUNO INICIAL / OXIDACION DE GRASA
      const title = 'Mayor Oxidación de Grasas';

      if (mode === 'biochemical') {
        return {
          title,
          naturalExplanation: `Llevas ${hoursElapsed.toFixed(1)} horas sin ingerir alimentos. Tu metabolismo ha cambiado su fuente primaria de energía hacia las reservas lipídicas de tu cuerpo.`,
          technicalExplanation: `PARÁGRAFO 1 — SENSOR AMPK Y REGULACIÓN ENERGÉTICA:
El aumento de la relación AMP/ATP activa la quinasa AMPK. AMPK fosforila e inactiva a la Acetil-CoA Carboxilasa (ACC), suprimiendo la síntesis de Malonil-CoA y desinhibiendo al máximo el transporte de la CPT-1.

PARÁGRAFO 2 — GLUCONEOGÉNESIS Y CETOGÉNESIS HEPÁTICA:
El exceso de Acetil-CoA proveniente de la beta-oxidación sobrepasa la capacidad de condensación del ciclo de Krebs. Se activa la vía cetogénica hepática catalizada por HMGCS2, generando Acetoacetato y Beta-Hidroxibutirato (BHB) como combustible alternativo hidrosoluble para el cerebro y el corazón.`,
          fatBurnHuman: 'Máxima beta-oxidación e inicio de cetogénesis por desinhibición total de CPT-1',
        };
      } else if (mode === 'clinical') {
        return {
          title,
          naturalExplanation: `Evaluación de ayuno inicial (${hoursElapsed.toFixed(1)}h). Adaptación celular caracterizada por baja insulina basal y alta movilización lipídica.`,
          technicalExplanation: `REVISIÓN CLÍNICO-METABÓLICA AVANZADA:
1. Cociente Respiratorio (RQ): RQ aproximándose a 0.72 (85-90% de energía derivada de ácidos grasos libres).
2. Cetogénesis Fisiológica: Concentración plasmática de Beta-Hidroxibutirato en elevación fisiológica nutricional segura (0.2 a 0.5 mmol/L).
3. Preservación Magra: Reducción del catabolismo proteico muscular por sustitución glucídica con cetoácidos.`,
          fatBurnHuman: 'Dominancia metabólica lipídica y preservación magra',
        };
      } else if (mode === 'simple') {
        return {
          title,
          naturalExplanation: `Llevas ${hoursElapsed.toFixed(1)} horas sin comer. Tu cuerpo está quemando principalmente grasas almacenadas.`,
          technicalExplanation: 'Beta-oxidación de grasas elevada.',
          fatBurnHuman: 'Alta quema de grasas',
        };
      } else {
        // MODO HUMANO / ADAPTATIVO
        return {
          title,
          naturalExplanation: `Llevas ${hoursElapsed.toFixed(1)} horas sin alimentos. Tu cuerpo ha cambiado su fuente principal de combustible hacia la energía almacenada en tus reservas de grasa.`,
          technicalExplanation: 'Movilización lipídica en tejido adiposo e incremento en la producción energética mitocondrial.',
          fatBurnHuman: 'Usando grasas como fuente principal',
        };
      }
    }
  }

  public getNutrientBubbles(
    phase: MetabolicPhase,
    mode: ResponseLanguageProfile['mode'] = 'human'
  ): DynamicNutrientBubble[] {
    const isPostprandial = phase === 'POSPRANDIAL';

    if (mode === 'biochemical') {
      return [
        {
          id: 'glucose',
          tag: 'Vía GLUT4 / Glucólisis',
          title: isPostprandial ? 'Fosforilación Akt / Exocitosis GLUT4' : 'Gluconeogénesis / PEPCK / G6Pasa',
          simple: isPostprandial ? 'La insulina activa Akt, desinhibiendo vesículas de transportadores GLUT4 hacia la membrana.' : 'Inducción transcripcional de PEPCK por PGC-1alfa para síntesis de glucosa.',
          detail: 'Parámetro molecular: Fosforilación Ser473 de Akt y traslocación membranosa citosólica.',
          color: 'var(--aion-glucose)',
        },
        {
          id: 'fats',
          tag: 'Lipólisis / HSL / CPT-1',
          title: isPostprandial ? 'LPL Endotelial / Inhibición HSL' : 'PKA / Perilipina-1 / CPT-1',
          simple: isPostprandial ? 'PDE3B reduce AMPc. HSL inactiva y LPL endotelial hidrolizando triglicéridos.' : 'AMPc eleva PKA. Fosforilación de HSL y Perilipina-1. CPT-1 importa Acil-CoA a mitocondria.',
          detail: 'Parámetro molecular: Tasa de Beta-oxidación mitocondrial en ciclos de 4 pasos.',
          color: 'var(--aion-fats)',
        },
        {
          id: 'protein',
          tag: 'Vía mTORC1 / S6K1 / 4E-BP1',
          title: 'Activación Rag GTPasas / Rheb-GTP',
          simple: 'La L-Leucina activa Rag GTPasas, reclutando mTORC1 al lisosoma para traducción de ARNm.',
          detail: 'Parámetro molecular: Fosforilación Thr389 de p70S6K1 e inhabilitación de 4E-BP1.',
          color: 'var(--aion-protein)',
        },
        {
          id: 'glycogen',
          tag: 'Glucogenólisis / Fosforilasa a',
          title: isPostprandial ? 'Glucógeno Sintasa a Activa' : 'Cascada PKA / Glucagón',
          simple: isPostprandial ? 'PP1 desfosforila la glucógeno sintasa a la forma activa.' : 'Glucagón vía Gs activa PKA y Glucógeno Fosforilasa a en Ser14.',
          detail: 'Parámetro molecular: Ruptura de enlaces glucosídicos alfa-1,4 citosólicos.',
          color: 'var(--aion-glycogen)',
        },
      ];
    } else if (mode === 'clinical') {
      return [
        {
          id: 'glucose',
          tag: 'Cinética Glucémica & Insulina',
          title: isPostprandial ? 'Pico Posprandial Fisiológico (<140 mg/dL)' : 'Normoglucemia Basal',
          simple: isPostprandial ? 'Captación periférica de glucosa por respuesta insulínica bifásica.' : 'Aclaramiento y producción hepática de glucosa equilibrados.',
          detail: 'Evaluación: Sensibilidad insulínica e índice HOMA-IR.',
          color: 'var(--aion-glucose)',
        },
        {
          id: 'fats',
          tag: 'Perfil Lipídico Circulante',
          title: isPostprandial ? 'Lipemia de Quilomicrones' : 'Ácidos Grasos Libres (FFA)',
          simple: isPostprandial ? 'Depuración endotelial de triglicéridos por Lipoproteína Lipasa.' : 'Incremento de FFA no esterificados para energía miocárdica.',
          detail: 'Evaluación: Cociente respiratorio (RQ) descendiendo a dominancia lipídica.',
          color: 'var(--aion-fats)',
        },
        {
          id: 'protein',
          tag: 'Balance Nitrogenado Muscular',
          title: 'Recambio Proteico Fisiológico',
          simple: 'Disponibilidad de aminoácidos esenciales preservando la masa magra.',
          detail: 'Evaluación: Tasa de síntesis proteica muscular (MPS) sostenida.',
          color: 'var(--aion-protein)',
        },
        {
          id: 'glycogen',
          tag: 'Reserva Glucogénica',
          title: isPostprandial ? 'Saturación de Depósitos' : 'Glucogenólisis Hepática',
          simple: isPostprandial ? 'Restauración del fondo de reserva de carbohidratos.' : 'Deplición progresiva sostenida para prevenir hipoglucemia.',
          detail: 'Evaluación: Capacidad glucogénica hepática (aprox. 100g).',
          color: 'var(--aion-glycogen)',
        },
      ];
    } else if (mode === 'simple') {
      return [
        {
          id: 'glucose',
          tag: 'Glucosa',
          title: isPostprandial ? 'Azúcar de la comida' : 'Azúcar en nivel normal',
          simple: isPostprandial ? 'Energía rápida que acabas de comer.' : 'Tu cuerpo mantiene el azúcar estable.',
          detail: 'Medido en sangre para dar fuerza a los músculos.',
          color: 'var(--aion-glucose)',
        },
        {
          id: 'fats',
          tag: 'Grasas',
          title: isPostprandial ? 'Grasas guardándose' : 'Quemando reservas de grasa',
          simple: isPostprandial ? 'Las grasas de la comida se absorben despacio.' : 'Tu cuerpo usa la gordura acumulada para tener energía.',
          detail: 'Transporte de lípidos en sangre.',
          color: 'var(--aion-fats)',
        },
        {
          id: 'protein',
          tag: 'Proteínas',
          title: 'Construcción muscular',
          simple: 'Nutrientes que reparan tus músculos.',
          detail: 'Bloques de construcción celular.',
          color: 'var(--aion-protein)',
        },
        {
          id: 'glycogen',
          tag: 'Glucógeno',
          title: isPostprandial ? 'Batería llenándose' : 'Usando batería de reserva',
          simple: isPostprandial ? 'Cargando reservas de energía.' : 'Gastando la energía guardada en el hígado.',
          detail: 'Reserva energética hepática.',
          color: 'var(--aion-glycogen)',
        },
      ];
    } else {
      // MODO HUMANO / ADAPTATIVO
      return [
        {
          id: 'glucose',
          tag: 'Glucosa',
          title: isPostprandial ? 'Energía disponible de la comida' : 'Glucosa estable en sangre',
          simple: isPostprandial ? 'Energía rápida que acabas de ingerir.' : 'Tu cuerpo mantiene tu energía estable usando glucosa del hígado.',
          detail: 'Nutriente primario procesado desde carbohidratos.',
          color: 'var(--aion-glucose)',
        },
        {
          id: 'fats',
          tag: 'Grasas',
          title: isPostprandial ? 'Grasas en proceso de digestión' : 'Utilizando grasas almacenadas',
          simple: isPostprandial ? 'Nutrientes esenciales absorbiéndose despacio.' : 'Tu cuerpo está recurriendo a la grasa guardada para mantener tu energía.',
          detail: 'Combustible denso para actividades sostenidas.',
          color: 'var(--aion-fats)',
        },
        {
          id: 'protein',
          tag: 'Proteínas',
          title: 'Reparación de tejidos y músculo',
          simple: 'Aminoácidos usados para mantener tu musculatura fuerte.',
          detail: 'Componente estructural fundamental del cuerpo.',
          color: 'var(--aion-protein)',
        },
        {
          id: 'glycogen',
          tag: 'Glucógeno',
          title: isPostprandial ? 'Recargando depósitos de reserva' : 'Liberando glucógeno del hígado',
          simple: isPostprandial ? 'Llenando el tanque de energía de reserva.' : 'Liberando el azúcar almacenado en tu hígado.',
          detail: 'Batería interna de almacenamiento de carbohidratos.',
          color: 'var(--aion-glycogen)',
        },
      ];
    }
  }
}
