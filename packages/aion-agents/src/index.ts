import {
  MealRecord,
  Preparation,
  ConsumedPortion,
  MetabolicState,
  EnergyBalance,
  RecipeOption,
  InventoryItem,
  LivePlan,
  AionUserProfile,
  AegisProfile,
  EvidenceLevel,
  VisionAnalysis,
} from '@aion/shared-types';
import { AionEventBus } from '@aion/protocol';
import { AionMemoryStore } from '@aion/memory';
import { VisionService } from './vision/VisionService';

export { VisionService };

// Agente Especialista de Contexto y Ubicación
export class ContextAndLocationAgent {
  private memoryStore = AionMemoryStore.getInstance();

  public getContextSummary(): {
    location: string;
    timezone: string;
    isTravel: boolean;
    unitSystem: string;
  } {
    const profile = this.memoryStore.getCoreProfile();
    return {
      location: `${profile.city || 'Bogotá'}, ${profile.country || 'Colombia'}`,
      timezone: profile.timezone || 'America/Bogota',
      isTravel: false,
      unitSystem: profile.unitSystem || 'metric',
    };
  }
}

// Orquestador Principal: Especialista de Nutrición AION
export class NutritionLeadSpecialist {
  private memoryStore = AionMemoryStore.getInstance();
  private eventBus = AionEventBus.getInstance();
  private visionService = VisionService.getInstance();
  private contextAgent = new ContextAndLocationAgent();

  /**
   * Vertical Slice Completo de Extremo a Extremo (P2):
   * Foto -> Vision Service -> Scene & Foods -> Confidence & Microquestion -> Portion Range (min-max) -> Kcal/Macros -> Memory -> Events
   */
  public async processMealInput(
    userInput: string,
    imageBlobUrl?: string,
    fractionConsumed?: number
  ): Promise<{
    agentReply: string;
    visionAnalysis?: VisionAnalysis;
    detectedPreparation?: Preparation;
    consumedPortion?: ConsumedPortion;
    missingInfoQuestion?: string;
    mealRecord?: MealRecord;
  }> {
    // 1. Análisis por VisionService Real
    const visionAnalysis = await this.visionService.analyzeImage(imageBlobUrl, userInput);

    // 2. Evaluar micro-preguntas con impacto nutricional real
    const materialQuestion = visionAnalysis.unresolvedQuestions.find((q) => q.materialImpact === 'high');

    if (materialQuestion && fractionConsumed === undefined && !userInput.toLowerCase().includes('confirmado')) {
      return {
        agentReply: materialQuestion.question,
        visionAnalysis,
        missingInfoQuestion: materialQuestion.question,
      };
    }

    const fraction = fractionConsumed ?? 0.2;
    const fractionText = fraction === 1.0 ? '100% (Toda la comida)' : `${(fraction * 100).toFixed(0)}% de la preparación (${fraction === 0.2 ? '1/5' : fraction === 0.33 ? '1/3' : '1/2'})`;

    // 3. Conversión de Rango Estimado Visual a Ingredientes Deterministas
    const ingredients = visionAnalysis.detectedItems.map((item, idx) => {
      const range = item.portionRange || { likely: 150, min: 120, max: 180, unit: 'g', confidence: 0.8, method: 'Estimación volumétrica' };
      const isChicken = item.candidateName.toLowerCase().includes('pollo');
      const isPotato = item.candidateName.toLowerCase().includes('papa');

      const kcalBase = isChicken ? 220 : isPotato ? 150 : 240;
      const protBase = isChicken ? 32 : isPotato ? 3 : 16;
      const carbsBase = isChicken ? 0 : isPotato ? 33 : 1;
      const fatsBase = isChicken ? 5 : isPotato ? 0.2 : 18;

      return {
        id: `ing-${idx}-${Date.now()}`,
        name: item.candidateName,
        amountPreparation: 1,
        amountConsumed: fraction,
        unit: range.unit,
        gramsEstimated: Math.round(range.likely * fraction),
        portionRange: {
          ...range,
          min: Math.round(range.min * fraction),
          max: Math.round(range.max * fraction),
          likely: Math.round(range.likely * fraction),
        },
        kcal: Math.round(kcalBase * fraction),
        proteinGrams: Math.round(protBase * fraction),
        carbsGrams: Math.round(carbsBase * fraction),
        fatsGrams: Math.round(fatsBase * fraction),
        confidence: item.confidence > 0.85 ? ('ALTA' as const) : ('MEDIA' as const),
        source: visionAnalysis.evidenceLevel,
      };
    });

    const actualKcal = ingredients.reduce((acc, curr) => acc + curr.kcal, 0);
    const actualProtein = ingredients.reduce((acc, curr) => acc + curr.proteinGrams, 0);
    const actualCarbs = ingredients.reduce((acc, curr) => acc + curr.carbsGrams, 0);
    const actualFats = ingredients.reduce((acc, curr) => acc + curr.fatsGrams, 0);

    const mealRecord: MealRecord = {
      id: `meal-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mealType: new Date().getHours() < 12 ? 'Desayuno' : new Date().getHours() < 17 ? 'Almuerzo' : 'Cena',
      imageUrl: imageBlobUrl,
      preparation: {
        id: `prep-${Date.now()}`,
        name: visionAnalysis.detectedItems.map((i) => i.candidateName).join(', ') || 'Comida Registrada',
        ingredients,
        totalKcal: Math.round(actualKcal / fraction),
        totalProtein: Math.round(actualProtein / fraction),
        totalCarbs: Math.round(actualCarbs / fraction),
        totalFats: Math.round(actualFats / fraction),
      },
      consumedPortion: {
        fractionText,
        fractionValue: fraction,
        consumedItems: ingredients,
        actualKcal,
        actualProtein,
        actualCarbs,
        actualFats,
      },
      confidence: visionAnalysis.evidenceLevel === 'VISUAL_ESTIMATE_HIGH' ? 'ALTA' : 'MEDIA',
      evidenceSummary: `Análisis visual (${visionAnalysis.scene.type}) con certeza ${visionAnalysis.evidenceLevel}.`,
      evidenceLevel: fractionConsumed ? 'USER_CONFIRMED' : visionAnalysis.evidenceLevel,
      userConfirmed: true,
    };

    // 4. Persistir episodio en AION Memory (descuenta inventario real)
    this.memoryStore.addMeal(mealRecord);

    // 5. Publicar eventos versionados en AION Protocol
    this.eventBus.publish({
      eventId: `evt-meal-${Date.now()}`,
      eventType: 'aion.aegis.nutrition.meal.logged',
      appId: 'aion-aegis',
      userId: 'user-default',
      occurredAt: new Date().toISOString(),
      payload: mealRecord,
      confidence: 0.95,
      schemaVersion: '1.0.0',
    });

    this.eventBus.publish({
      eventId: `evt-vis-${Date.now()}`,
      eventType: 'aion.aegis.nutrition.vision.analyzed',
      appId: 'aion-aegis',
      userId: 'user-default',
      occurredAt: new Date().toISOString(),
      payload: visionAnalysis,
      confidence: visionAnalysis.scene.confidence,
      schemaVersion: '1.0.0',
    });

    // Formatear texto de porción en rango (ej. "aprox. 130-190g")
    const portionSummary = ingredients
      .map((i) => `${i.name} (aprox. ${i.portionRange?.min || i.gramsEstimated}-${i.portionRange?.max || i.gramsEstimated}g)`)
      .join(', ');

    return {
      agentReply: `He procesado el análisis visual de tu plato (${portionSummary}). Registrado: ${actualKcal} kcal (${actualProtein}g prot, ${actualCarbs}g carbs, ${actualFats}g grasas). Tu estado metabólico posprandial ha sido actualizado.`,
      visionAnalysis,
      mealRecord,
    };
  }

  public getWhatCanIEatNowOptions(): RecipeOption[] {
    const plan = this.memoryStore.getLivePlan();
    const inventory = this.memoryStore.getInventory();
    const aegisProfile = this.memoryStore.getAegisProfile();

    const availableItems = inventory.filter((i) => i.amount > 0 && i.availability !== 'AGOTADO');
    const hasChicken = availableItems.some((i) => i.name.toLowerCase().includes('pollo'));
    const hasTuna = availableItems.some((i) => i.name.toLowerCase().includes('atún'));
    const hasTomatoes = availableItems.some((i) => i.name.toLowerCase().includes('tomate'));

    return [
      {
        id: 'rec-1',
        title: 'Pechuga de pollo salteada con tomate y papa sabanera',
        subtitle: `Aprovecha alimentos en tu despensa de ${this.contextAgent.getContextSummary().location}.`,
        kcal: Math.min(480, plan.remainingKcal),
        proteinGrams: 36,
        carbsGrams: 35,
        fatsGrams: 10,
        prepTimeMinutes: aegisProfile.typicalPrepTimeMinutes || 20,
        category: 'MEJOR OPCIÓN',
        reasonToRecommend: 'Utiliza ingredientes disponibles en tu refrigerador (tomates próximos a vencer) y cumple con tu objetivo de proteína diaria.',
        ingredientsNeeded: [
          { name: 'Pechuga de Pollo', amount: '200g', availableInPantry: hasChicken },
          { name: 'Tomates frescos', amount: '2 unidades', availableInPantry: hasTomatoes },
          { name: 'Papa sabanera', amount: '1 unidad', availableInPantry: true },
        ],
        steps: [
          'Corta la pechuga de pollo en julianas y saltea con tomate y cebolla picada.',
          'Cocina la papa sabanera al vapor durante 15 minutos.',
          'Sirve de inmediato.',
        ],
      },
      {
        id: 'rec-2',
        title: 'Ensalada rápida de Atún con queso costeño',
        subtitle: 'Preparación ultrarrápida sin cocinar.',
        kcal: 350,
        proteinGrams: 28,
        carbsGrams: 6,
        fatsGrams: 16,
        prepTimeMinutes: 5,
        category: 'MÁS RÁPIDA',
        reasonToRecommend: 'Ideal cuando tienes poco tiempo. No requiere estufa y aprovecha latas de atún disponibles.',
        ingredientsNeeded: [
          { name: 'Lata de Atún', amount: '1 lata', availableInPantry: hasTuna },
          { name: 'Queso costeño', amount: '50g', availableInPantry: true },
        ],
        steps: ['Mezcla el atún drenado con trozos de queso costeño y sirve fresco.'],
      },
      {
        id: 'rec-3',
        title: 'Tortilla de papa sabanera con verduras',
        subtitle: 'Alta saciedad y liberación sostenida de glucosa.',
        kcal: 410,
        proteinGrams: 18,
        carbsGrams: 48,
        fatsGrams: 12,
        prepTimeMinutes: 15,
        category: 'MÁS SACIANTE',
        reasonToRecommend: 'Los carbohidratos complejos de la papa y la fibra vegetal prolongan la sensación de saciedad durante más de 4 horas.',
        ingredientsNeeded: [{ name: 'Papa sabanera', amount: '2 unidades', availableInPantry: true }],
        steps: ['Ralla la papa, dora en una sartén antiadherente y sirve caliente.'],
      },
    ];
  }

  public getCurrentMetabolicState(): MetabolicState {
    const meals = this.memoryStore.getMeals();
    const lastMeal = meals[0];

    if (!lastMeal) {
      return {
        currentPhase: 'POSTABSORTIVO',
        phaseTitle: 'Estado Postabsortivo Inicial',
        naturalExplanation: 'No hay ingesta reciente registrada. Tu cuerpo mantiene la glucosa plasmática mediante la descomposición del glucógeno hepático.',
        detailedTechnicalExplanation: 'Glucemia basal. Cociente de insulina/glucagón bajo que estimula la glucogenólisis hepática.',
        glucoseStatus: 'Estable en rango basal (70-99 mg/dL)',
        fatsStatus: 'Iniciando lipólisis progresiva en tejido adiposo',
        proteinsStatus: 'Equilibrio de síntesis y degradación proteica',
        glycogenStatus: 'En uso para mantenimiento normoglucémico',
        fatBurnRate: 'moderada',
      };
    }

    const lastMealTime = new Date(lastMeal.timestamp).getTime();
    const nowTime = new Date().getTime();
    const hoursElapsed = Math.max(0, (nowTime - lastMealTime) / (1000 * 3600));

    if (hoursElapsed < 3.5) {
      return {
        currentPhase: 'POSPRANDIAL',
        phaseTitle: 'Estado Posprandial (Absorción Nutricional Activa)',
        naturalExplanation: `Han pasado aproximadamente ${hoursElapsed.toFixed(1)} horas desde tu última comida (${lastMeal.preparation.name}). Tu cuerpo está absorbiendo los carbohidratos como glucosa y usando la proteína para recambio muscular.`,
        detailedTechnicalExplanation: 'Absorción intestinal de macronutrientes. Insulina elevada estimulando la captación celular de glucosa vía GLUT4, síntesis de glucógeno y transporte de lípidos en quilomicrones.',
        glucoseStatus: '↑ Elevada y disponible para energía',
        fatsStatus: '→ En tránsito linfático y vascular (quilomicrones)',
        proteinsStatus: '→ Captación de aminoácidos para síntesis muscular',
        glycogenStatus: '→ Almacenamiento activo en hígado y músculo',
        fatBurnRate: 'menor_temporalmente',
        lastMealTime: lastMeal.timestamp,
        hoursElapsedSinceLastMeal: hoursElapsed,
      };
    } else if (hoursElapsed < 7) {
      return {
        currentPhase: 'POSTABSORTIVO',
        phaseTitle: 'Estado Postabsortivo (Transición Energética)',
        naturalExplanation: `Han pasado ${hoursElapsed.toFixed(1)} horas desde tu última ingesta. La absorción de alimentos ha finalizado y tu cuerpo ha comenzado a liberar reservas de glucógeno.`,
        detailedTechnicalExplanation: 'Nivel de insulina descendiendo y glucagón aumentando. Activación de la glucogenólisis hepática para sostener la glucemia en reposo.',
        glucoseStatus: 'Normalizando hacia rango basal',
        fatsStatus: '↑ Activación paulatina de beta-oxidación de grasas',
        proteinsStatus: 'Preservación de masa magra',
        glycogenStatus: 'Liberación progresiva desde depósitos hepáticos',
        fatBurnRate: 'moderada',
        lastMealTime: lastMeal.timestamp,
        hoursElapsedSinceLastMeal: hoursElapsed,
      };
    } else {
      return {
        currentPhase: 'AYUNO_INICIAL',
        phaseTitle: 'Ayuno Inicial (Mayor Oxidación de Grasas)',
        naturalExplanation: `Han pasado ${hoursElapsed.toFixed(1)} horas sin ingesta. Tu cuerpo ha cambiado su fuente primaria de energía hacia los ácidos grasos almacenados.`,
        detailedTechnicalExplanation: 'Glucogenólisis hepática reducida. Activación de lipasa sensible a hormonas (HSL), movilización de ácidos grasos libres e inicio de gluconeogénesis.',
        glucoseStatus: 'Estable mantenida por gluconeogénesis',
        fatsStatus: '↑ Oxidación principal de grasas (beta-oxidación)',
        proteinsStatus: 'Uso menor de aminoácidos para gluconeogénesis',
        glycogenStatus: 'Reservas hepáticas disminuidas',
        fatBurnRate: 'alta',
        lastMealTime: lastMeal.timestamp,
        hoursElapsedSinceLastMeal: hoursElapsed,
      };
    }
  }

  public getCurrentEnergyBalance(): EnergyBalance {
    const plan = this.memoryStore.getLivePlan();
    return {
      state: 'DÉFICIT',
      targetKcal: plan.dailyTargetKcal,
      consumedKcal: plan.consumedKcal,
      burnedKcal: 2100,
      remainingKcal: plan.remainingKcal,
      trend: 'en_progreso',
    };
  }
}
