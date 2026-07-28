import {
  MealRecord,
  Preparation,
  ConsumedPortion,
  MetabolicState,
  EnergyBalance,
  RecipeOption,
  InventoryItem,
  LivePlan,
  EvidenceLevel,
  VisionAnalysis,
  ResponseLanguageProfile,
} from '@aion/shared-types';
import { AionEventBus } from '@aion/protocol';
import { AionMemoryStore } from '@aion/memory';
import { VisionService } from './vision/VisionService';
import { LanguageEngine } from './language/LanguageEngine';
import { RecipeSkill } from './skills/RecipeSkill';
import { DailyReportEngine } from './export/DailyReportEngine';
import { XlsxExporter } from './export/XlsxExporter';
import { AionCoreSuperAgent, OmniDispatchResult } from './core/AionCoreSuperAgent';
import { AgentRuntime, AgentRegistry } from './runtime/AgentRuntime';
import { NutrientCalculationEngine } from './nutrition/NutrientCalculationEngine';

export {
  VisionService,
  LanguageEngine,
  RecipeSkill,
  DailyReportEngine,
  XlsxExporter,
  AionCoreSuperAgent,
  AgentRuntime,
  AgentRegistry,
  NutrientCalculationEngine,
};
export type { OmniDispatchResult };

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

export class NutritionLeadSpecialist {
  private memoryStore = AionMemoryStore.getInstance();
  private eventBus = AionEventBus.getInstance();
  private visionService = VisionService.getInstance();
  private languageEngine = LanguageEngine.getInstance();
  private nutrientEngine = NutrientCalculationEngine.getInstance();
  private contextAgent = new ContextAndLocationAgent();

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
    const visionAnalysis = await this.visionService.analyzeImage(imageBlobUrl, userInput);
    const materialQuestion = visionAnalysis.unresolvedQuestions.find((q) => q.materialImpact === 'high');

    if (materialQuestion && fractionConsumed === undefined && !userInput.toLowerCase().includes('confirmado')) {
      return {
        agentReply: materialQuestion.question,
        visionAnalysis,
        missingInfoQuestion: materialQuestion.question,
      };
    }

    const fraction = fractionConsumed ?? 1.0;
    const fractionText = fraction === 1.0 ? '100% (Toda la comida)' : `${(fraction * 100).toFixed(0)}% de la preparación (${fraction === 0.2 ? '1/5' : fraction === 0.33 ? '1/3' : '1/2'})`;

    const ingredients = visionAnalysis.detectedItems.map((item) => {
      const range = item.portionRange || { likely: 150, min: 120, max: 180, unit: 'g', confidence: 0.8, method: 'Estimación volumétrica' };
      return this.nutrientEngine.calculateNutrientsForIngredient(
        item.candidateName,
        range.likely,
        fraction,
        visionAnalysis.evidenceLevel
      );
    });

    const actualKcal = Math.round(ingredients.reduce((acc, curr) => acc + curr.kcal, 0));
    const actualProtein = Math.round(ingredients.reduce((acc, curr) => acc + curr.proteinGrams, 0) * 10) / 10;
    const actualCarbs = Math.round(ingredients.reduce((acc, curr) => acc + curr.carbsGrams, 0) * 10) / 10;
    const actualFats = Math.round(ingredients.reduce((acc, curr) => acc + curr.fatsGrams, 0) * 10) / 10;

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
      evidenceSummary: `Análisis visual (${visionAnalysis.scene.type}) con cálculo determinista de composición alimentaria.`,
      evidenceLevel: fractionConsumed ? 'USER_CONFIRMED' : visionAnalysis.evidenceLevel,
      userConfirmed: true,
    };

    this.memoryStore.addMeal(mealRecord);

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

    const portionSummary = ingredients
      .map((i) => `${i.name} (${i.gramsEstimated}g)`)
      .join(', ');

    return {
      agentReply: `Procesado mediante cálculo determinista (${portionSummary}). Registrado: ${actualKcal} kcal (${actualProtein}g prot, ${actualCarbs}g carbs, ${actualFats}g grasas). Tu estado metabólico posprandial ha sido actualizado.`,
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
    ];
  }

  public getCurrentMetabolicState(requestedMode?: ResponseLanguageProfile['mode']): MetabolicState {
    const meals = this.memoryStore.getMeals();
    const coreProfile = this.memoryStore.getCoreProfile();
    const mode = requestedMode || coreProfile.languageProfile?.mode || 'human';
    const lastMeal = meals[0];

    if (!lastMeal) {
      const exp = this.languageEngine.translateMetabolicExplanation('POSTABSORTIVO', 8, undefined, mode);
      return {
        currentPhase: 'POSTABSORTIVO',
        phaseTitle: exp.title,
        naturalExplanation: exp.naturalExplanation,
        detailedTechnicalExplanation: exp.technicalExplanation,
        glucoseStatus: 'Estable en rango basal (70-99 mg/dL)',
        fatsStatus: 'Iniciando lipólisis progresiva en tejido adiposo',
        proteinsStatus: 'Equilibrio de síntesis y degradación proteica',
        glycogenStatus: 'En uso para mantenimiento normoglucémico',
        fatBurnRate: 'moderada',
        confidence: 0.9,
        evidenceLevel: 'DETERMINISTIC_CALCULATION',
      };
    }

    const lastMealTime = new Date(lastMeal.timestamp).getTime();
    const nowTime = new Date().getTime();
    const hoursElapsed = Math.max(0, (nowTime - lastMealTime) / (1000 * 3600));

    const phase = hoursElapsed < 3.5 ? 'POSPRANDIAL' : hoursElapsed < 7 ? 'POSTABSORTIVO' : 'AYUNO_INICIAL';
    const exp = this.languageEngine.translateMetabolicExplanation(phase, hoursElapsed, lastMeal.preparation.name, mode);

    return {
      currentPhase: phase,
      phaseTitle: exp.title,
      naturalExplanation: exp.naturalExplanation,
      detailedTechnicalExplanation: exp.technicalExplanation,
      glucoseStatus: phase === 'POSPRANDIAL' ? '↑ Disponible tras la ingesta' : 'Normalizando hacia rango basal',
      fatsStatus: phase === 'POSPRANDIAL' ? '→ Transportadas en quilomicrones' : '↑ Oxidación lipídica en tejido adiposo',
      proteinsStatus: '→ Aminoácidos en recambio y reparación proteica',
      glycogenStatus: phase === 'POSPRANDIAL' ? '→ Reposición activa' : '↓ Liberación desde depósitos hepáticos',
      fatBurnRate: phase === 'POSPRANDIAL' ? 'menor_temporalmente' : phase === 'POSTABSORTIVO' ? 'moderada' : 'alta',
      lastMealTime: lastMeal.timestamp,
      hoursElapsedSinceLastMeal: hoursElapsed,
      confidence: 0.95,
      evidenceLevel: lastMeal.evidenceLevel,
    };
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
