import { MetabolicPhase, ResponseLanguageProfile } from '@aion/shared-types';

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
          technicalExplanation: 'Glucemia e insulina elevadas.',
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
        // MODO HUMANO / ADAPTATIVO (Predeterminado)
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
}
