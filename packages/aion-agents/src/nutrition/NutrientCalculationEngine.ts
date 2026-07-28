import { IngredientItem, EvidenceLevel } from '@aion/shared-types';

export interface FoodNutrientDefinition {
  id: string;
  name: string;
  category: 'Proteínas' | 'Lácteos' | 'Granos' | 'Vegetales' | 'Frutas' | 'Grasas' | 'Embutidos';
  kcalPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatsPer100g: number;
  fiberPer100g: number;
  waterMlPer100g: number;
  standardPortionUnit: string;
  standardPortionGrams: number;
}

export class NutrientCalculationEngine {
  private static instance: NutrientCalculationEngine;
  private foodDatabase: Map<string, FoodNutrientDefinition> = new Map();

  private constructor() {
    this.initializeFoodDatabase();
  }

  public static getInstance(): NutrientCalculationEngine {
    if (!NutrientCalculationEngine.instance) {
      NutrientCalculationEngine.instance = new NutrientCalculationEngine();
    }
    return NutrientCalculationEngine.instance;
  }

  private initializeFoodDatabase(): void {
    const defaultFoods: FoodNutrientDefinition[] = [
      { id: 'fd-pollo', name: 'Pechuga de Pollo', category: 'Proteínas', kcalPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatsPer100g: 3.6, fiberPer100g: 0, waterMlPer100g: 65, standardPortionUnit: 'g', standardPortionGrams: 200 },
      { id: 'fd-carne', name: 'Carne molida magra', category: 'Proteínas', kcalPer100g: 215, proteinPer100g: 26, carbsPer100g: 0, fatsPer100g: 12, fiberPer100g: 0, waterMlPer100g: 60, standardPortionUnit: 'g', standardPortionGrams: 150 },
      { id: 'fd-atun', name: 'Atún en lata', category: 'Proteínas', kcalPer100g: 130, proteinPer100g: 28, carbsPer100g: 0, fatsPer100g: 2, fiberPer100g: 0, waterMlPer100g: 70, standardPortionUnit: 'lata', standardPortionGrams: 120 },
      { id: 'fd-huevo', name: 'Huevos frescos', category: 'Proteínas', kcalPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatsPer100g: 11, fiberPer100g: 0, waterMlPer100g: 75, standardPortionUnit: 'unidad', standardPortionGrams: 50 },
      { id: 'fd-jamon', name: 'Jamón pavo / cerdo', category: 'Embutidos', kcalPer100g: 145, proteinPer100g: 18, carbsPer100g: 3, fatsPer100g: 6, fiberPer100g: 0, waterMlPer100g: 70, standardPortionUnit: 'g', standardPortionGrams: 50 },
      { id: 'fd-queso', name: 'Queso costeño', category: 'Lácteos', kcalPer100g: 320, proteinPer100g: 22, carbsPer100g: 2, fatsPer100g: 25, fiberPer100g: 0, waterMlPer100g: 45, standardPortionUnit: 'g', standardPortionGrams: 50 },
      { id: 'fd-leche', name: 'Leche entera', category: 'Lácteos', kcalPer100g: 62, proteinPer100g: 3.2, carbsPer100g: 4.8, fatsPer100g: 3.3, fiberPer100g: 0, waterMlPer100g: 88, standardPortionUnit: 'vaso/ml', standardPortionGrams: 240 },
      { id: 'fd-papa', name: 'Papa sabanera', category: 'Granos', kcalPer100g: 87, proteinPer100g: 1.9, carbsPer100g: 20, fatsPer100g: 0.1, fiberPer100g: 1.8, waterMlPer100g: 77, standardPortionUnit: 'unidad', standardPortionGrams: 150 },
      { id: 'fd-arroz', name: 'Arroz blanco cocido', category: 'Granos', kcalPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatsPer100g: 0.3, fiberPer100g: 0.4, waterMlPer100g: 68, standardPortionUnit: 'g', standardPortionGrams: 150 },
      { id: 'fd-tomate', name: 'Tomates frescos', category: 'Vegetales', kcalPer100g: 18, proteinPer100g: 0.9, carbsPer100g: 3.9, fatsPer100g: 0.2, fiberPer100g: 1.2, waterMlPer100g: 94, standardPortionUnit: 'unidad', standardPortionGrams: 120 },
      { id: 'fd-aguacate', name: 'Aguacate Hass', category: 'Frutas', kcalPer100g: 160, proteinPer100g: 2, carbsPer100g: 8.5, fatsPer100g: 15, fiberPer100g: 6.7, waterMlPer100g: 73, standardPortionUnit: 'unidad', standardPortionGrams: 100 },
      { id: 'fd-aceite', name: 'Aceite de Oliva', category: 'Grasas', kcalPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatsPer100g: 100, fiberPer100g: 0, waterMlPer100g: 0, standardPortionUnit: 'cucharada', standardPortionGrams: 14 },
    ];

    defaultFoods.forEach((f) => this.foodDatabase.set(f.name.toLowerCase(), f));
  }

  /**
   * Realiza la búsqueda determinista en la tabla de composición alimentaria
   */
  public findFoodDefinition(foodName: string): FoodNutrientDefinition | undefined {
    const nameLower = foodName.toLowerCase();
    for (const [key, def] of this.foodDatabase.entries()) {
      if (nameLower.includes(key) || key.includes(nameLower)) {
        return def;
      }
    }
    return undefined;
  }

  /**
   * Calcula de forma determinista la información nutricional exacta según peso y porción consumida
   */
  public calculateNutrientsForIngredient(
    foodName: string,
    gramsPrepared: number,
    fractionConsumed: number = 1.0,
    evidenceLevel: EvidenceLevel = 'DETERMINISTIC_CALCULATION'
  ): IngredientItem {
    const def = this.findFoodDefinition(foodName);
    const weightGrams = gramsPrepared || (def ? def.standardPortionGrams : 100);
    const multiplier = (weightGrams / 100) * fractionConsumed;

    if (def) {
      return {
        id: `ing-det-${Date.now()}-${Math.random()}`,
        name: def.name,
        amountPreparation: 1,
        amountConsumed: fractionConsumed,
        unit: 'g',
        gramsEstimated: Math.round(weightGrams * fractionConsumed),
        portionRange: {
          likely: Math.round(weightGrams * fractionConsumed),
          min: Math.round(weightGrams * 0.85 * fractionConsumed),
          max: Math.round(weightGrams * 1.15 * fractionConsumed),
          unit: 'g',
          confidence: 0.95,
          method: 'Cálculo determinista de composición alimentaria',
        },
        kcal: Math.round(def.kcalPer100g * multiplier),
        proteinGrams: Math.round(def.proteinPer100g * multiplier * 10) / 10,
        carbsGrams: Math.round(def.carbsPer100g * multiplier * 10) / 10,
        fatsGrams: Math.round(def.fatsPer100g * multiplier * 10) / 10,
        fiberGrams: Math.round(def.fiberPer100g * multiplier * 10) / 10,
        waterMl: Math.round(def.waterMlPer100g * multiplier),
        confidence: 'ALTA',
        source: evidenceLevel,
      };
    }

    // Fallback con marca explícita de estimación (sin inventar falsos datos medidos)
    return {
      id: `ing-est-${Date.now()}-${Math.random()}`,
      name: foodName,
      amountPreparation: 1,
      amountConsumed: fractionConsumed,
      unit: 'g',
      gramsEstimated: Math.round(weightGrams * fractionConsumed),
      portionRange: {
        likely: Math.round(weightGrams * fractionConsumed),
        min: Math.round(weightGrams * 0.7 * fractionConsumed),
        max: Math.round(weightGrams * 1.3 * fractionConsumed),
        unit: 'g',
        confidence: 0.6,
        method: 'Estimación por categoría genérica',
      },
      kcal: Math.round(150 * multiplier),
      proteinGrams: Math.round(10 * multiplier * 10) / 10,
      carbsGrams: Math.round(15 * multiplier * 10) / 10,
      fatsGrams: Math.round(5 * multiplier * 10) / 10,
      confidence: 'MEDIA',
      source: 'MODEL_ESTIMATE',
    };
  }
}
