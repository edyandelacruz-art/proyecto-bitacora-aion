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
      if (mode === 'simple') {
        return {
          title: 'Comida Reciente (Digestión)',
          naturalExplanation: 'Acabas de comer. Tu cuerpo está procesando los alimentos para darle energía a tus músculos y cuerpo.',
          technicalExplanation: 'Glucemia e insulina elevadas en plasma.',
          fatBurnHuman: 'En pausa temporal',
        };
      } else if (mode === 'technical' || mode === 'clinical') {
        return {
          title: 'Estado Posprandial (Absorción Activa)',
          naturalExplanation: `Transcurridas ${hoursElapsed.toFixed(1)}h desde la ingesta. El pool de glucosa y aminoácidos está enriquecido en plasma.`,
          technicalExplanation: 'Glucemia en pico posprandial. Captación de glucosa vía GLUT4 regulada por insulina. Lipogénesis y síntesis de glucógeno activa.',
          fatBurnHuman: 'Menor temporalmente',
        };
      } else if (mode === 'biochemical') {
        return {
          title: 'Estado Posprandial (Vía Anabólica mTORC1 / GLUT4)',
          naturalExplanation: `Transcurridas ${hoursElapsed.toFixed(1)}h. La secreción pancreática de insulina estimula la actividad de la glucógeno sintasa y la síntesis proteica tisular.`,
          technicalExplanation: 'Fosforilación de receptores de insulina (IRS-1, Akt). Inhibición de AMPK y activación de la vía mTORC1. Lipoproteína lipasa hidrolizando triglicéridos de quilomicrones.',
          fatBurnHuman: 'Inhibida por Insulina',
        };
      } else {
        // MODO HUMANO / ADAPTATIVO
        return {
          title: 'Digestión y Absorción Activa',
          naturalExplanation: `Terminaste de comer hace aproximadamente ${hoursElapsed.toFixed(1)} horas${lastMealName ? ` (${lastMealName})` : ''}. Tu cuerpo está usando los nutrientes que ingeriste para reponer tu energía y reparar tejidos.`,
          technicalExplanation: 'Nivel de insulina elevado facilitando la entrada de glucosa a los músculos y la síntesis proteica.',
          fatBurnHuman: 'Usando energía de la comida',
        };
      }
    } else if (phase === 'POSTABSORTIVO' || (hoursElapsed >= 3.5 && hoursElapsed < 7)) {
      if (mode === 'simple') {
        return {
          title: 'Energía de Reservas Iniciales',
          naturalExplanation: 'Ya pasaron varias horas desde la comida. Tu cuerpo terminó de digerir y empieza a usar reservas.',
          technicalExplanation: 'Liberación de glucógeno hepático.',
          fatBurnHuman: 'Usando reservas ligeras',
        };
      } else if (mode === 'technical' || mode === 'clinical') {
        return {
          title: 'Estado Postabsortivo (Glucogenólisis Hepática)',
          naturalExplanation: `Transcurridas ${hoursElapsed.toFixed(1)}h. Fin de la absorción intestinal. La glucemia es mantenida por glucogenólisis hepática.`,
          technicalExplanation: 'Cociente insulina/glucagón bajo. Activación de la glucógeno fosforilasa hepática para sostener la normoglucemia.',
          fatBurnHuman: 'Transición hacia grasas',
        };
      } else if (mode === 'biochemical') {
        return {
          title: 'Fase Postabsortiva (Glucagón / PKA / HSL)',
          naturalExplanation: `Transcurridas ${hoursElapsed.toFixed(1)}h. El glucagón estimula la formación de AMPc y PKA, activando la lipasa sensible a hormonas en adipocitos.`,
          technicalExplanation: 'Fosforilación de perilipinas y HSL. Beta-oxidación de ácidos grasos en matriz mitocondrial y gluconeogénesis activa.',
          fatBurnHuman: 'Moderada en progreso',
        };
      } else {
        // MODO HUMANO / ADAPTATIVO
        return {
          title: 'Uso de Reservas Energéticas',
          naturalExplanation: `Ya pasó un buen rato (${hoursElapsed.toFixed(1)} horas) desde tu última comida. Tu cuerpo terminó de procesar los alimentos e inició el uso progresivo de sus reservas naturales.`,
          technicalExplanation: 'Aumento paulatino de glucagón facilitando la liberación de glucosa desde el hígado.',
          fatBurnHuman: 'Empieza a usar grasas',
        };
      }
    } else {
      // AYUNO INICIAL / OXIDACION DE GRASA
      if (mode === 'simple') {
        return {
          title: 'Quema de Grasas Activa',
          naturalExplanation: `Llevas ${hoursElapsed.toFixed(1)} horas sin comer. Tu cuerpo está quemando principalmente grasas almacenadas.`,
          technicalExplanation: 'Beta-oxidación de grasas elevada.',
          fatBurnHuman: 'Alta quema de grasas',
        };
      } else if (mode === 'technical' || mode === 'clinical') {
        return {
          title: 'Fase de Ayuno Inicial (Dominancia Lipídica)',
          naturalExplanation: `Transcurridas ${hoursElapsed.toFixed(1)}h sin ingesta. Los ácidos grasos libres constituyen el sustrato energético principal.`,
          technicalExplanation: 'Depósitos de glucógeno disminuidos. Estimulación de AMPK y beta-oxidación de grasas sostenida.',
          fatBurnHuman: 'Alta oxidación lipídica',
        };
      } else if (mode === 'biochemical') {
        return {
          title: 'Fase Catabólica Adaptativa (AMPK / CPT-1 / Cetogénesis)',
          naturalExplanation: `Transcurridas ${hoursElapsed.toFixed(1)}h. La activación de AMPK promueve la traslocación de CPT-1 mitocondrial para la beta-oxidación.`,
          technicalExplanation: 'Elevada acetil-CoA mitocondrial con posible derivación hacia cuerpos cetónicos (acetoacetato y beta-hidroxibutirato).',
          fatBurnHuman: 'Máxima beta-oxidación',
        };
      } else {
        // MODO HUMANO / ADAPTATIVO
        return {
          title: 'Mayor Utilización de Grasas',
          naturalExplanation: `Llevas ${hoursElapsed.toFixed(1)} horas sin alimentos. Tu cuerpo ha cambiado su fuente principal de combustible hacia la energía almacenada en tus reservas de grasa.`,
          technicalExplanation: 'Movilización lipídica en tejido adiposo e incremento en la producción energética mitocondrial.',
          fatBurnHuman: 'Usando grasas como fuente principal',
        };
      }
    }
  }

  /**
   * Genera la traducción dinámica en tiempo real de las 4 burbujas nutricionales
   * (Glucosa, Grasas, Proteínas, Glucógeno) según la modalidad de lenguaje activa.
   */
  public getNutrientBubbles(
    phase: MetabolicPhase,
    mode: ResponseLanguageProfile['mode'] = 'human'
  ): DynamicNutrientBubble[] {
    const isPostprandial = phase === 'POSPRANDIAL';

    if (mode === 'simple') {
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
    } else if (mode === 'technical' || mode === 'clinical') {
      return [
        {
          id: 'glucose',
          tag: 'Glucosa Plasmática',
          title: isPostprandial ? '↑ Ingesta e Incremento Basal' : '→ Normoglucemia Basal',
          simple: isPostprandial ? 'Glucemia en elevación por absorción entérica.' : 'Homeostasis de glucosa sostenida por gluconeogénesis.',
          detail: 'Glicemia medida en mg/dL. Regulada por insulina.',
          color: 'var(--aion-glucose)',
        },
        {
          id: 'fats',
          tag: 'Ácidos Grasos Libres',
          title: isPostprandial ? '→ Transporte Quilomicrónico' : '↑ Beta-oxidación Adipocitaria',
          simple: isPostprandial ? 'Lípidos en tránsito endotelial.' : 'Inhibición de lipogénesis y activación lipolítica.',
          detail: 'Metabolismo lipídico y acil-carnitinas.',
          color: 'var(--aion-fats)',
        },
        {
          id: 'protein',
          tag: 'Aminoácidos Plasmáticos',
          title: 'Balance Nitrogenado Positivo',
          simple: 'Recambio proteico muscular en fase anabólica/mantenimiento.',
          detail: 'Pool circulante de Leucina, Isoleucina y Valina.',
          color: 'var(--aion-protein)',
        },
        {
          id: 'glycogen',
          tag: 'Glucógeno Hepático/Muscular',
          title: isPostprandial ? '↑ Glucogenogénesis Activa' : '↓ Glucogenólisis Hepática',
          simple: isPostprandial ? 'Saturación de depósitos glucogénicos.' : 'Deplición paulatina de depósitos de carbohidratos.',
          detail: 'Reserva poliglucídica de glucosa.',
          color: 'var(--aion-glycogen)',
        },
      ];
    } else if (mode === 'biochemical') {
      return [
        {
          id: 'glucose',
          tag: 'Vía GLUT4 / Glucólisis',
          title: isPostprandial ? 'Insulina / Akt / Hexocinasa II' : 'Gluconeogénesis / PEPCK',
          simple: isPostprandial ? 'Traslocación de GLUT4 por fosforilación de Akt.' : 'Expresión de fosfoenolpiruvato carboxicinasa (PEPCK).',
          detail: 'Fosforilación de glucosa a glucosa-6-fosfato.',
          color: 'var(--aion-glucose)',
        },
        {
          id: 'fats',
          tag: 'Lipólisis / HSL / CPT-1',
          title: isPostprandial ? 'Lipoproteína Lipasa (LPL)' : 'AMPK / PKA / Beta-oxidación',
          simple: isPostprandial ? 'LPL endotelial hidrolizando triglicéridos.' : 'PKA fosforila HSL; CPT-1 introduce acil-CoA a la mitocondria.',
          detail: 'Cascada de AMPc y beta-oxidación celular.',
          color: 'var(--aion-fats)',
        },
        {
          id: 'protein',
          tag: 'Vía mTORC1 / S6K1',
          title: 'Activación Rheb / mTORC1',
          simple: 'La leucina activa Rag GTPasas estimulando la traducción de ARNm en el ribosoma.',
          detail: 'Fosforilación de p70S6K y 4E-BP1.',
          color: 'var(--aion-protein)',
        },
        {
          id: 'glycogen',
          tag: 'Glucógeno Fosforilasa a',
          title: isPostprandial ? 'Glucógeno Sintasa Activa' : 'Fosforilasa a por Glucagón',
          simple: isPostprandial ? 'Desfosforilación de la glucógeno sintasa.' : 'Glucagón vía proteína Gs estimula glucógeno fosforilasa a.',
          detail: 'Ruptura de enlaces alfa-1,4 y alfa-1,6 glucosídicos.',
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
