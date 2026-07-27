import {
  Recipe,
  PreparedBatch,
  MealPortion,
  RecipeIngredient,
  MealRecord,
  EvidenceLevel,
} from '@aion/shared-types';
import { AionMemoryStore } from '@aion/memory';
import { AionEventBus } from '@aion/protocol';

export class RecipeSkill {
  private static instance: RecipeSkill;
  private memoryStore = AionMemoryStore.getInstance();
  private eventBus = AionEventBus.getInstance();

  private constructor() {}

  public static getInstance(): RecipeSkill {
    if (!RecipeSkill.instance) {
      RecipeSkill.instance = new RecipeSkill();
    }
    return RecipeSkill.instance;
  }

  /**
   * Cocinar una receta y generar un Lote Preparado (PreparedBatch)
   * 1. Descuenta ingredientes de la despensa mediante transacciones auditables.
   * 2. Registra el Lote Preparado (PreparedBatch) disponible para N días en el refrigerador.
   * 3. Registra la porción consumida hoy como MealRecord.
   * 4. Registra el evento en AegisLedgerEntry y publica en AION Protocol.
   */
  public cookRecipe(
    recipe: Recipe,
    servingsCooked: number = 3,
    servingsConsumedToday: number = 1
  ): { batch: PreparedBatch; mealRecord: MealRecord } {
    const scaleFactor = servingsCooked / (recipe.servings || 1);

    // 1. Descontar ingredientes de la despensa con transacciones auditables
    recipe.ingredients.forEach((ing) => {
      const neededAmount = ing.amount * scaleFactor;
      const pantry = this.memoryStore.getInventory();
      const match = pantry.find(
        (i) => i.name.toLowerCase().includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(i.name.toLowerCase())
      );

      if (match) {
        this.memoryStore.addInventoryTransaction({
          id: `tx-recipe-${Date.now()}-${match.id}`,
          pantryItemId: match.id,
          pantryItemName: match.name,
          type: 'recipe_use',
          quantityDelta: -neededAmount,
          unit: ing.unit,
          evidence: 'DETERMINISTIC_CALCULATION',
          confidence: 0.95,
          createdAt: new Date().toISOString(),
          relatedRecipeId: recipe.id,
          explanation: `Utilizado al cocinar receta "${recipe.name}" (${servingsCooked} porciones).`,
        });
      }
    });

    // 2. Crear Lote Preparado (PreparedBatch)
    const batch: PreparedBatch = {
      id: `batch-${Date.now()}`,
      recipeId: recipe.id,
      recipeName: recipe.name,
      preparedAt: new Date().toISOString(),
      expiresAtEstimate: new Date(Date.now() + 86400000 * 3).toISOString(),
      totalServings: servingsCooked,
      servingsRemaining: servingsCooked - servingsConsumedToday,
      storageLocation: 'refrigerador',
    };

    this.memoryStore.addPreparedBatch(batch);

    // 3. Crear Registro de Comida de la Porción Consumida Hoy
    const fraction = servingsConsumedToday / servingsCooked;
    const nutritionBase = recipe.totalNutrition || { kcal: 500, protein: 35, carbs: 40, fats: 12 };

    const mealRecord: MealRecord = {
      id: `meal-rec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mealType: 'Almuerzo',
      preparation: {
        id: `prep-rec-${Date.now()}`,
        name: recipe.name,
        ingredients: recipe.ingredients.map((ing, idx) => ({
          id: `ing-rec-${idx}`,
          name: ing.name,
          amountPreparation: ing.amount * scaleFactor,
          amountConsumed: (ing.amount * scaleFactor) * fraction,
          unit: ing.unit,
          kcal: Math.round((nutritionBase.kcal * scaleFactor * fraction) / recipe.ingredients.length),
          proteinGrams: Math.round((nutritionBase.protein * scaleFactor * fraction) / recipe.ingredients.length),
          carbsGrams: Math.round((nutritionBase.carbs * scaleFactor * fraction) / recipe.ingredients.length),
          fatsGrams: Math.round((nutritionBase.fats * scaleFactor * fraction) / recipe.ingredients.length),
          confidence: 'ALTA',
          source: 'DETERMINISTIC_CALCULATION',
        })),
        totalKcal: Math.round(nutritionBase.kcal * scaleFactor),
        totalProtein: Math.round(nutritionBase.protein * scaleFactor),
        totalCarbs: Math.round(nutritionBase.carbs * scaleFactor),
        totalFats: Math.round(nutritionBase.fats * scaleFactor),
      },
      consumedPortion: {
        fractionText: `${servingsConsumedToday} de ${servingsCooked} porciones preparadas`,
        fractionValue: fraction,
        consumedItems: [],
        actualKcal: Math.round(nutritionBase.kcal * scaleFactor * fraction),
        actualProtein: Math.round(nutritionBase.protein * scaleFactor * fraction),
        actualCarbs: Math.round(nutritionBase.carbs * scaleFactor * fraction),
        actualFats: Math.round(nutritionBase.fats * scaleFactor * fraction),
      },
      confidence: 'ALTA',
      evidenceSummary: `Cocinada desde receta "${recipe.name}" (${servingsCooked} porciones). Quedan ${batch.servingsRemaining} porciones en refrigerador.`,
      evidenceLevel: 'USER_CONFIRMED',
      userConfirmed: true,
    };

    this.memoryStore.addMeal(mealRecord);

    // 4. Registrar en AegisLedgerEntry
    this.memoryStore.addLedgerEntry({
      id: `led-cook-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'recipe_cooked',
      source: 'recipe',
      payload: { batch, mealRecord },
      evidence: 'USER_CONFIRMED',
      confidence: 0.95,
      reversible: true,
    });

    // 5. Publicar eventos en AION Protocol
    this.eventBus.publish({
      eventId: `evt-cook-${Date.now()}`,
      eventType: 'aion.aegis.nutrition.recipe.cooked',
      appId: 'aion-aegis',
      userId: 'user-default',
      occurredAt: new Date().toISOString(),
      payload: { batch, mealRecord },
      confidence: 0.95,
      schemaVersion: '1.0.0',
    });

    return { batch, mealRecord };
  }
}
