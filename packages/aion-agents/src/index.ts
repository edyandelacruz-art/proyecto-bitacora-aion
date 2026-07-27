import {
  MealRecord,
  Preparation,
  ConsumedPortion,
  MetabolicState,
  EnergyBalance,
  RecipeOption,
  InventoryItem,
  LivePlan,
} from '@aion/shared-types';
import { AionEventBus } from '@aion/protocol';
import { AionMemoryStore } from '@aion/memory';

export class NutritionLeadSpecialist {
  private memoryStore = AionMemoryStore.getInstance();
  private eventBus = AionEventBus.getInstance();

  /**
   * Analiza una consulta conversacional o imagen enviada por el usuario
   */
  public async processMealInput(
    userInput: string,
    imageBlobUrl?: string,
    fractionConsumed?: number
  ): Promise<{
    agentReply: string;
    detectedPreparation?: Preparation;
    consumedPortion?: ConsumedPortion;
    missingInfoQuestion?: string;
    mealRecord?: MealRecord;
  }> {
    const isImage = !!imageBlobUrl || userInput.toLowerCase().includes('foto') || userInput.toLowerCase().includes('comí');

    // 1. Simulación o Inferencia de Visión & Texto (Reconocimiento tentativo)
    const detectedIngredients = [
      {
        id: 'ing-atun',
        name: 'Ensalada de Atún',
        amountPreparation: 1,
        amountConsumed: fractionConsumed ?? 0.2,
        unit: 'preparación completa',
        kcal: 180,
        proteinGrams: 22,
        carbsGrams: 4,
        fatsGrams: 8,
        confidence: 'ALTA' as const,
        source: 'foto' as const,
      },
      {
        id: 'ing-papa',
        name: 'Papa cocida',
        amountPreparation: 1,
        amountConsumed: 1,
        unit: 'unidad',
        kcal: 160,
        proteinGrams: 4,
        carbsGrams: 36,
        fatsGrams: 0.2,
        confidence: 'ALTA' as const,
        source: 'foto' as const,
      },
      {
        id: 'ing-queso',
        name: 'Queso costeño',
        amountPreparation: 100,
        amountConsumed: 100,
        unit: 'g',
        kcal: 240,
        proteinGrams: 14,
        carbsGrams: 0,
        fatsGrams: 20,
        confidence: 'MEDIA' as const,
        source: 'calculo' as const,
      },
    ];

    // Si falta saber la porción consumida y no se ha especificado:
    if (fractionConsumed === undefined && isImage) {
      return {
        agentReply:
          'Veo una papa cocida, queso costeño y una ensalada de atún. Ya tengo los ingredientes de la preparación. Para calcular exactamente lo que comiste, ¿qué fracción de toda la ensalada serviste o terminaste comiendo?',
        missingInfoQuestion: '¿Qué fracción de toda la ensalada terminaste comiendo? (Ejemplo: 1/5, 1/2 o la mitad)',
      };
    }

    const fraction = fractionConsumed ?? 0.2;
    const fractionText = fraction === 0.2 ? '1/5 de la preparación' : `${(fraction * 100).toFixed(0)}% de la preparación`;

    // 2. Cálculo Determinista de Porción Consumida
    const actualKcal = Math.round(180 * fraction + 160 + 240);
    const actualProtein = Math.round(22 * fraction + 4 + 14);
    const actualCarbs = Math.round(4 * fraction + 36 + 0);
    const actualFats = Math.round(8 * fraction + 0.2 + 20);

    const mealRecord: MealRecord = {
      id: `meal-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mealType: new Date().getHours() < 12 ? 'Desayuno' : new Date().getHours() < 17 ? 'Almuerzo' : 'Cena',
      imageUrl: imageBlobUrl,
      preparation: {
        id: `prep-${Date.now()}`,
        name: 'Atún con Papa y Queso',
        ingredients: detectedIngredients,
        totalKcal: 580 / fraction,
        totalProtein: 60,
        totalCarbs: 60,
        totalFats: 70,
      },
      consumedPortion: {
        fractionText,
        fractionValue: fraction,
        consumedItems: detectedIngredients,
        actualKcal,
        actualProtein,
        actualCarbs,
        actualFats,
      },
      confidence: 'MEDIA',
      evidenceSummary: `Identificado por foto/descripción y confirmado en ${fractionText}.`,
      userConfirmed: true,
    };

    // 3. Guardar en memoria y emitir evento AION Protocol
    this.memoryStore.addMeal(mealRecord);
    this.eventBus.publish({
      eventId: `evt-${Date.now()}`,
      eventType: 'aion.aegis.nutrition.meal.logged',
      publisherApp: 'aion-aegis',
      timestamp: new Date().toISOString(),
      payload: mealRecord,
      certainty: 'user_confirmed',
    });

    return {
      agentReply: `He registrado tu ${mealRecord.mealType.toLowerCase()} (${actualKcal} kcal estimadas, ${actualProtein}g proteína, ${actualCarbs}g carbohidratos, ${actualFats}g grasas). He actualizado tu estado metabólico postprandial y recalculado tu Plan Vivo para el resto del día.`,
      mealRecord,
    };
  }

  /**
   * Acción Principal: ¿Qué puedo comer ahora?
   * Cruza calorías restantes + macros + inventario disponible + tiempo + estado metabólico
   */
  public getWhatCanIEatNowOptions(): RecipeOption[] {
    const plan = this.memoryStore.getLivePlan();
    const inventory = this.memoryStore.getInventory();

    const hasChicken = inventory.some((i) => i.name.toLowerCase().includes('pollo') && i.amount > 0);
    const hasTuna = inventory.some((i) => i.name.toLowerCase().includes('atún') && i.amount > 0);

    return [
      {
        id: 'rec-1',
        title: 'Pechuga de pollo salteada con vegetales y papa',
        subtitle: 'Ideal para cumplir tu meta de proteína usando alimentos por terminar.',
        kcal: Math.min(520, plan.remainingKcal),
        proteinGrams: 35,
        carbsGrams: 40,
        fatsGrams: 12,
        prepTimeMinutes: 20,
        category: 'MEJOR OPCIÓN',
        reasonToRecommend: 'Utiliza la pechuga de pollo del congelador y tomates próximos a vencer, manteniendo controlado el presupuesto calórico restante.',
        ingredientsNeeded: [
          { name: 'Pechuga de Pollo', amount: '200g', availableInPantry: hasChicken },
          { name: 'Tomates frescos', amount: '2 unidades', availableInPantry: true },
          { name: 'Papa sabanera', amount: '1 unidad', availableInPantry: true },
        ],
        steps: [
          'Corta la pechuga de pollo en cubos y saltea con cebolla y tomate picado.',
          'Cocina 1 papa sabanera al vapor o al microondas durante 5 minutos.',
          'Sirve caliente y disfruta.',
        ],
      },
      {
        id: 'rec-2',
        title: 'Ensalada rápida de Atún con tomate y queso costeño',
        subtitle: 'Preparación en 5 minutos sin cocinar.',
        kcal: 380,
        proteinGrams: 28,
        carbsGrams: 8,
        fatsGrams: 18,
        prepTimeMinutes: 5,
        category: 'MÁS RÁPIDA',
        reasonToRecommend: 'No requiere estufa y aprovecha latas de atún disponibles en despensa.',
        ingredientsNeeded: [
          { name: 'Atún en agua', amount: '1 lata', availableInPantry: hasTuna },
          { name: 'Queso costeño', amount: '50g', availableInPantry: true },
          { name: 'Tomate fresco', amount: '1 unidad', availableInPantry: true },
        ],
        steps: ['Mezcla el atún drenado con el tomate picado y trozos de queso costeño.'],
      },
      {
        id: 'rec-3',
        title: 'Tortilla de papa con atún y verduras',
        subtitle: 'Alta saciedad y liberación lenta de energía.',
        kcal: 450,
        proteinGrams: 26,
        carbsGrams: 45,
        fatsGrams: 15,
        prepTimeMinutes: 15,
        category: 'MÁS SACIANTE',
        reasonToRecommend: 'La fibra del tomate y los carbohidratos complejos de la papa extienden la saciedad por más de 4 horas.',
        ingredientsNeeded: [
          { name: 'Papa sabanera', amount: '2 unidades', availableInPantry: true },
          { name: 'Atún en agua', amount: '1 lata', availableInPantry: hasTuna },
        ],
        steps: ['Ralla la papa, saltea con atún en una sartén antiadherente hasta dorar.'],
      },
    ];
  }

  /**
   * Cálculo fisiológico adaptativo del Estado Metabólico actual ("Tu cuerpo ahora")
   */
  public getCurrentMetabolicState(): MetabolicState {
    const meals = this.memoryStore.getMeals();
    const lastMeal = meals[0];

    if (!lastMeal) {
      return {
        currentPhase: 'POSTABSORTIVO',
        phaseTitle: 'Estado Postabsortivo Inicial',
        naturalExplanation: 'Han pasado varias horas desde tu última ingesta registrada. Tu cuerpo está estabilizando la glucosa usando reservas de glucógeno.',
        detailedTechnicalExplanation: 'Glucemia en rango basal. La insulina desciende y glucagón aumenta para movilizar glucógeno hepático.',
        glucoseStatus: 'Estable en rango basal',
        fatsStatus: 'Iniciando movilización progresiva de ácidos grasos',
        proteinsStatus: 'Equilibrio de aminoácidos',
        glycogenStatus: 'En uso para mantenimiento de glucemia',
        fatBurnRate: 'moderada',
      };
    }

    return {
      currentPhase: 'POSPRANDIAL',
      phaseTitle: 'Estado Posprandial (Digestión y Absorción Activa)',
      naturalExplanation: 'Terminaste de comer hace poco. Tu cuerpo está digiriendo la comida. La papa aporta glucosa para energía y almacenamiento en glucógeno, mientras que las proteínas del atún y queso quedan disponibles para reparación de tejidos.',
      detailedTechnicalExplanation: 'Absorción intestinal de macronutrientes. Nivel de insulina incrementado facilitando captación muscular de glucosa y síntesis de glucógeno. Lipoproteínas (quilomicrones) transportando grasas dietarias.',
      glucoseStatus: '↑ Disponible tras la ingesta',
      fatsStatus: '→ Transportadas y procesadas (quilomicrones)',
      proteinsStatus: '→ Aminoácidos disponibles para reparación muscular',
      glycogenStatus: '→ Reposición activa en hígado y músculo',
      fatBurnRate: 'menor_temporalmente',
      lastMealTime: lastMeal.timestamp,
    };
  }

  public getCurrentEnergyBalance(): EnergyBalance {
    const plan = this.memoryStore.getLivePlan();
    return {
      state: 'DÉFICIT',
      targetKcal: plan.dailyTargetKcal,
      consumedKcal: plan.consumedKcal,
      burnedKcal: 2100, // estimado
      remainingKcal: plan.remainingKcal,
      trend: 'en_progreso',
    };
  }
}
