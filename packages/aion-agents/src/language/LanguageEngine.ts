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
      } else if (mode === 'biochemical') {
        return {
          title: 'Fase Anabólica Posprandial: Transducción IRS-1 / Akt / mTORC1 & Cascada de GLUT4',
          naturalExplanation: `Transcurridas ${hoursElapsed.toFixed(1)}h desde la ingesta de ${lastMealName || 'alimentos'}. La elevación de la glucemia pancreática induce la exocitosis de insulina mediada por canales de K+ sensibles a ATP. La insulina se une a sus receptores tirosina quinasa (RTK), desencadenando la autofosforilación en residuos de tirosina y el reclutamiento del sustrato del receptor de insulina (IRS-1).`,
          technicalExplanation: `PARÁGRAFO 1 — SEÑALIZACIÓN ENZIMÁTICA Y GLUCÓLISIS:
IRS-1 activa la fosfoinosítido 3-quinasa (PI3K), generando fosfatidilinositol (3,4,5)-trisfosfato (PIP3), el cual recluta a la PDK1 y a la proteín quinasa B (Akt/PKB). Akt activa desencadena la fosforilación e inactivación de la proteína AS160 (Akt substrate of 160 kDa), permitiendo la exocitosis de vesículas integradas con el transportador facilitado de glucosa GLUT4 hacia la membrana sarcolémica y adipocitaria. Simultáneamente, la Hexocinasa II en músculo y la Glucocinasa en hepatocitos fosforilan la glucosa libre a Glucosa-6-Fosfato (G6P), atrapándola en el citosol para glucólisis o síntesis de glucógeno.

PARÁGRAFO 2 — LIPOGÉNESIS Y SUPRESIÓN DE LA BETA-OXIDACIÓN:
Las elevadas concentraciones de insulina provocan la desfosforilación e inhabilitación de la Lipasa Sensible a Hormonas (HSL) e inhiben la vía del AMP cíclico (AMPc) mediante la fosfodiesterasa 3B (PDE3B). El exceso de acetil-CoA citosólico se carboxila a malonil-CoA mediado por la Acetil-CoA Carboxilasa (ACC). La elevación celular de Malonil-CoA actúa como un inhibidor alostérico directo de la Carnitina Palmitoiltransferasa 1 (CPT-1) en la membrana mitocondrial externa, bloqueando por completo la entrada de ácidos grasos a la matriz mitocondrial y paralizando la beta-oxidación.

PARÁGRAFO 3 — SÍNTESIS PROTEICA Y COMPLEJO RHEB/mTORC1:
Los aminoácidos esenciales de cadena ramificada (BCAA, en especial la L-Leucina) estimulan las GTPasas Rag A/B y C/D en la superficie lisosomal, acoplando el complejo mTORC1. mTORC1 activado fosforila a la proteín quinasa p70S6K1 e inactiva a la proteína de unión 4E-BP1, desencadenando la iniciación de la traducción ribosómica del ARNm y la síntesis proteica muscular.`,
          fatBurnHuman: 'Inhibida por inhibición alostérica de CPT-1 vía Malonil-CoA',
        };
      } else if (mode === 'clinical') {
        return {
          title: 'Evaluación Fisiopatológica: Estado de Absorción Nutricional y Dinámica Insulinémica',
          naturalExplanation: `Evaluación transcurridas ${hoursElapsed.toFixed(1)}h post-ingesta. El paciente se encuentra en respuesta fisiológica posprandial normoglucémica sostenida. La carga glucémica del bolo alimenticio ha producido una respuesta insulínica bifásica adecuada por las células beta del páncreas endocrino.`,
          technicalExplanation: `EVALUACIÓN CLÍNICA METABÓLICA:
1. Dinámica Glucémica: Glucemia plasmática en rango posprandial fisiológico (<140 mg/dL). Supresión de la gluconeogénesis hepática de novo debido al aclaramiento insulínico y la captación periférica de glucosa en el lecho vascular esplácnico y muscular.
2. Perfil Lipídico Posprandial: Aumento transitorio en la concentración de quilomicrones ricos en triglicéridos en la circulación linfática y vascular. Activación periférica de la Lipoproteína Lipasa (LPL) dependiente de Apolipoproteína C-II en el endotelio capilar del tejido adiposo.
3. Balance Nitrogenado y Saciedad: Estimulación de los péptidos entéricos de saciedad (GLP-1 y PYY) en las células L del íleon distal, con inhibición concomitante del péptido orexigénico Ghrelina en la mucosa gástrica.`,
          fatBurnHuman: 'Supresión fisiológica normal por pico insulínico',
        };
      } else if (mode === 'technical') {
        return {
          title: 'Estado Posprandial (Absorción y Tránsito Vascular)',
          naturalExplanation: `Transcurridas ${hoursElapsed.toFixed(1)}h desde la ingesta. El pool de glucosa y aminoácidos está enriquecido en plasma con una alta tasa de aclaramiento periférico.`,
          technicalExplanation: 'Glucemia en pico posprandial. Captación de glucosa vía GLUT4 regulada por insulina. Lipogénesis y síntesis de glucógeno activa en hepatocitos y miocitos.',
          fatBurnHuman: 'Menor temporalmente',
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
      if (mode === 'biochemical') {
        return {
          title: 'Fase Postabsortiva Catabólica: Cascada Glucagón / PKA / HSL & Beta-Oxidación Mitocondrial',
          naturalExplanation: `Transcurridas ${hoursElapsed.toFixed(1)}h sin ingesta. Al descender la glucosa circulante por debajo del umbral basal (80 mg/dL), el páncreas reduce la secreción de insulina y libera glucagón desde las células alfa. El glucagón se acopla a Receptores Acoplados a Proteínas G (GPCRs de tipo Gs) en los hepatocitos.`,
          technicalExplanation: `PARÁGRAFO 1 — AMPc, PKA Y GLUCOGENÓLISIS HEPÁTICA:
La subunidad Gs-alfa activa la adenilato ciclasa citosólica, incrementando los niveles de AMP cíclico (AMPc), el cual activa la Proteín Quinasa A (PKA). La PKA fosforila e inactiva a la Glucógeno Sintasa a, mientras fosforila y activa a la Fosforilasa Quinasa, la cual a su vez convierte la Glucógeno Fosforilasa b inactiva en Glucógeno Fosforilasa a activa. Ésta cataliza la fosforolisis de enlaces alfa-1,4-glucosídicos liberando Glucosa-1-Fosfato, convertida a Glucosa-6-Fosfato por la fosfoglucomutasa y desfosforilada a glucosa libre en lumen del RE por la Glucosa-6-Fosfatasa hepática.

PARÁGRAFO 2 — LIBERACIÓN DE HSL Y DESINHIBICIÓN DE LA CPT-1:
En los adipocitos, la PKA fosforila la enzima Lipasa Sensible a Hormonas (HSL) y la proteína estructural Perilipina-1. La perilipina fosforilada se disocia de la CGI-58, permitiendo que la Lipasa de Triglicéridos Adipocíticos (ATGL) e HSL hidrolicen triglicéridos a diacilglicéridos, monoacilglicéridos y ácidos grasos libres (FFA). La reducción simultánea de Malonil-CoA levanta la inhibición sobre la CPT-1, permitiendo la esterificación de los FFA con carnitina para su importación a la matriz mitocondrial.

PARÁGRAFO 3 — ESPIRAL DE BETA-OXIDACIÓN Y GENERACIÓN DE ATP:
Dentro de la matriz mitocondrial, la beta-oxidación ejecuta 4 pasos recurrentes catalizados por la Acil-CoA Deshidrogenasa, Enoil-CoA Hidratasa, 3-Hidroxiacil-CoA Deshidrogenasa y Beta-Cetotiolasa. Cada ciclo acorta la cadena de ácido graso en 2 carbonos, rindiendo 1 Acetil-CoA, 1 NADH y 1 FADH2, alimentando directamente el ciclo de Krebs y la cadena de fosforilación oxidativa (Complejos I a IV).`,
          fatBurnHuman: 'Fosforilación de HSL mediada por PKA y desinhibición de CPT-1',
        };
      } else if (mode === 'clinical') {
        return {
          title: 'Fisiopatología del Estado Postabsortivo: Homeostasis Normoglucémica Basal',
          naturalExplanation: `Evaluación transcurridas ${hoursElapsed.toFixed(1)}h desde la última ingesta. Finalizada la absorción gastrointestinal de macronutrientes. El organismo inicia la transición metabólica fisiológica hacia el uso de sustratos endógenos para sostener la glucemia en el SNC y el miocardio.`,
          technicalExplanation: `REVISIÓN CLÍNICA FISIOLÓGICA:
1. Cociente Hormonal Insulina/Glucagón: Descenso en la relación I/G plasmática. Activación del eje hormonal catabólico adaptativo sostenido por glucagón, con leve incremento de catecolaminas basales (adrenalina y noradrenalina).
2. Tasa de Glucogenólisis Hepática: Salida neta de glucosa del hígado a una tasa de 2.0 mg/kg/min para abastecer los requerimientos obligatorios del sistema nervioso central y los eritrocitos (glucólisis anaeróbica).
3. Partición de Sustratos Lipídicos: Elevación progresiva en la concentración de ácidos grasos libres (FFA) en plasma (0.3 a 0.6 mEq/L), reflejando un cociente de respiración celular (RQ) descendiendo de 0.95 hacia 0.82.`,
          fatBurnHuman: 'Transición hacia la oxidación lipídica endógena sostenida',
        };
      } else if (mode === 'simple') {
        return {
          title: 'Energía de Reservas Iniciales',
          naturalExplanation: 'Ya pasaron varias horas desde la comida. Tu cuerpo terminó de digerir y empieza a usar reservas.',
          technicalExplanation: 'Liberación de glucógeno hepático.',
          fatBurnHuman: 'Usando reservas ligeras',
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
      if (mode === 'biochemical') {
        return {
          title: 'Fase Catabólica de Ayuno Inicial: Dominancia AMPK / CPT-1 / Cetogénesis Hepática',
          naturalExplanation: `Llevas ${hoursElapsed.toFixed(1)}h sin ingesta energética. Los depósitos de glucógeno hepático se encuentran sustancialmente depletados (<30% de capacidad). El cociente celular [AMP]/[ATP] se eleva exponencialmente activando la Serina/Treonina Proteín Quinasa AMPK por la quinasa aguas arriba LKB1.`,
          technicalExplanation: `PARÁGRAFO 1 — SENSOR AMPK Y REGULACIÓN ENERGÉTICA:
AMPK fosforila e inactiva a la Acetil-CoA Carboxilasa (ACC), suprimiendo por completo la síntesis de Malonil-CoA. La ausencia total de Malonil-CoA maximiza la actividad transportadora de la CPT-1 en la membrana mitocondrial externa, permitiendo la máxima importación masiva de ácidos grasos de cadena larga hacia la beta-oxidación mitocondrial.

PARÁGRAFO 2 — GLUCONEOGÉNESIS HEPÁTICA Y CICLO DE KREBS:
Dado que el oxaloacetato hepático se consume en la gluconeogénesis (vía Piruvato Carboxilasa y PEPCK a partir de glicerol, lactato y alanina), la enorme cantidad de Acetil-CoA producida por la beta-oxidación sobrepasa la capacidad de condensación del ciclo de Krebs con oxaloacetato para formar citrato.

PARÁGRAFO 3 — RUTAS CETOGÉNICAS Y CETOGÉNESIS:
El exceso mitocondrial de Acetil-CoA se deriva hacia la vía cetogénica hepática catalizada por la Acetoacetil-CoA Tiolasa y la HMG-CoA Sintasa Mitocondrial (HMGCS2). Se sintetiza Acetoacetato y Beta-Hidroxibutirato (BHB), los cuales se liberan al torrente sanguíneo como sustratos energéticos hidrosolubles alternativos para el tejido cerebral y cardíaco, reduciendo la necesidad de proteólisis muscular.`,
          fatBurnHuman: 'Máxima beta-oxidación e inicio de cetogénesis por desinhibición total de CPT-1',
        };
      } else if (mode === 'clinical') {
        return {
          title: 'Evaluación de Ayuno Inicial Prolongado: Transición Metaxogénica y Cetónica',
          naturalExplanation: `Evaluación clínica transcurridas ${hoursElapsed.toFixed(1)}h sin ingesta de alimentos. El paciente presenta un perfil oxidativo con baja tasa de insulina basal, marcada lipólisis sistémica y adaptación celular al ayuno.`,
          technicalExplanation: `REVISIÓN CLÍNICO-METABÓLICA AVANZADA:
1. Cociente Respiratorio (RQ): RQ aproximándose a 0.70 - 0.73, indicando que el 85-90% del consumo total de oxígeno (VO2) proviene de la beta-oxidación de triglicéridos adipocitarios.
2. Producción de Cuerpos Cetónicos: Concentración plasmática de Beta-Hidroxibutirato (BHB) en elevación adaptativa inicial (0.2 a 0.5 mmol/L), dentro del rango fisiológico nutricional seguro.
3. Preservación Proteica Muscular: Reducción fisiológica en la excreción urinaria de nitrógeno ureico debido al ahorro proteico inducido por la sustitución de glucosa por cetoácidos en la economía corporal.`,
          fatBurnHuman: 'Dominancia metabólica lipídica y preservación magra',
        };
      } else if (mode === 'simple') {
        return {
          title: 'Quema de Grasas Activa',
          naturalExplanation: `Llevas ${hoursElapsed.toFixed(1)} horas sin comer. Tu cuerpo está quemando principalmente grasas almacenadas.`,
          technicalExplanation: 'Beta-oxidación de grasas elevada.',
          fatBurnHuman: 'Alta quema de grasas',
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

  public getNutrientBubbles(
    phase: MetabolicPhase,
    mode: ResponseLanguageProfile['mode'] = 'human'
  ): DynamicNutrientBubble[] {
    const isPostprandial = phase === 'POSPRANDIAL';

    if (mode === 'biochemical') {
      return [
        {
          id: 'glucose',
          tag: 'Vía GLUT4 / Glucólisis & Hexocinasa II',
          title: isPostprandial ? 'Fosforilación Akt / Exocitosis GLUT4' : 'Gluconeogénesis / PEPCK / G6Pasa',
          simple: isPostprandial ? 'La unión de insulina activa la cascada PI3K/Akt. Akt fosforila AS160 desinhibiendo Rab-GTPasas para la inserción de vesículas de transportadores GLUT4 en la membrana.' : 'Inactivación de la piruvato quinasa. Inducción transcripcional de PEPCK y Glucosa-6-Fotasa por el coactivador PGC-1alfa mediado por FOXO1.',
          detail: 'Parámetro molecular: Fosforilación Ser473 de Akt y traslocación membranosa citosólica.',
          color: 'var(--aion-glucose)',
        },
        {
          id: 'fats',
          tag: 'Lipólisis / Cascadas HSL / CPT-1 Mitocondrial',
          title: isPostprandial ? 'LPL Endotelial / Inhibición de HSL' : 'PKA / Perilipina-1 / Beta-oxidación CPT-1',
          simple: isPostprandial ? 'La insulina fosforila la PDE3B reduciendo AMPc. HSL permanece desfosforilada e inactiva. LPL endotelial hidroliza TG de quilomicrones.' : 'AMPc elevado activa PKA. PKA fosforila Ser563/Ser660 de HSL y Ser492 de Perilipina-1. CPT-1 desinhibida importa Acil-CoA a la matriz mitocondrial.',
          detail: 'Parámetro molecular: Tasa de Beta-oxidación mitocondrial en ciclos de 4 pasos de 2 carbonos.',
          color: 'var(--aion-fats)',
        },
        {
          id: 'protein',
          tag: 'Vía Lisosomal mTORC1 / S6K1 / 4E-BP1',
          title: 'Activación Rag GTPasas / Komplejo Rheb-GTP',
          simple: 'La L-Leucina intracelular es censada por Sestrin2, activando las GTPasas Rag A/B que reclutan mTORC1 a la membrana lisosomal donde Rheb-GTP estimula la función catalítica.',
          detail: 'Parámetro molecular: Fosforilación Thr389 de p70S6K1 e hiperfosforilación inhabilitante de 4E-BP1.',
          color: 'var(--aion-protein)',
        },
        {
          id: 'glycogen',
          tag: 'Glucogenólisis / Glucógeno Fosforilasa a',
          title: isPostprandial ? 'Glucógeno Sintasa a Desfosforilada' : 'Cascada de Proteín Quinasa A / Glucagón',
          simple: isPostprandial ? 'La PP1 (Proteín Fosfatasa 1) desfosforila la glucógeno sintasa b convirtiéndola en la forma a activa.' : 'El glucagón acoplado a Gs activa PKA, que fosforila la Fosforilasa Quinasa b a la forma a activa, la cual fosforila la Glucógeno Fosforilasa en Ser14.',
          detail: 'Parámetro molecular: Ruptura fosforolítica de enlaces glucosídicos alfa-1,4 citosólicos.',
          color: 'var(--aion-glycogen)',
        },
      ];
    } else if (mode === 'clinical') {
      return [
        {
          id: 'glucose',
          tag: 'Cinética Glucémica & Respuesta Insulínica',
          title: isPostprandial ? 'Pico Posprandial Fisiológico (<140 mg/dL)' : 'Homeostasis Normoglucémica Basal',
          simple: isPostprandial ? 'Captación periférica rápida de glucosa en lecho vascular esplácnico y muscular mediada por respuesta pancreática bifásica.' : 'Aclaramiento y producción hepática de glucosa equilibrados para preservación del metabolismo cerebral.',
          detail: 'Evaluación: Sensibilidad insulínica e índice HOMA-IR fisiológico.',
          color: 'var(--aion-glucose)',
        },
        {
          id: 'fats',
          tag: 'Perfil Lipídico Circulante & FFA',
          title: isPostprandial ? 'Lipemia Posprandial de Quilomicrones' : 'Elevación Fisiológica de FFA Plasmáticos',
          simple: isPostprandial ? 'Depuración endotelial de triglicéridos por la Lipoproteína Lipasa capilar.' : 'Incremento progresivo de ácidos grasos libres no esterificados para energía del miocardio y músculo esquelético.',
          detail: 'Evaluación: Cociente respiratorio (RQ) descendiendo a dominancia lipídica.',
          color: 'var(--aion-fats)',
        },
        {
          id: 'protein',
          tag: 'Balance Nitrogenado Muscular',
          title: 'Recambio Proteico Muscular Fisiológico',
          simple: 'Disponibilidad plasmática de aminoácidos esenciales preservando la masa magra corporal.',
          detail: 'Evaluación: Tasa de síntesis proteica muscular (MPS) sostenida.',
          color: 'var(--aion-protein)',
        },
        {
          id: 'glycogen',
          tag: 'Reserva Glucogénica Hepato-Muscular',
          title: isPostprandial ? 'Saturación de Depósitos de Reserva' : 'Tasa de Glucogenólisis Hepática',
          simple: isPostprandial ? 'Restauración del fondo de reserva de carbohidratos en tejido muscular e hepático.' : 'Deplición progresiva sostenida para prevenir hipoglucemia reactiva.',
          detail: 'Evaluación: Capacidad glucogénica hepática (aprox. 100g en reposo).',
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
