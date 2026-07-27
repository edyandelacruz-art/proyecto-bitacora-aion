import {
  MealRecord,
  InventoryItem,
  LivePlan,
  EnergyBalance,
  MetabolicState,
  CertaintyLevel,
} from '@aion/shared-types';

export interface MemoryRecord<T> {
  id: string;
  key: string;
  data: T;
  certainty: CertaintyLevel;
  timestamp: string;
  updatedAt: string;
}

const STORAGE_KEY_MEALS = 'aion_memory_meals';
const STORAGE_KEY_INVENTORY = 'aion_memory_inventory';
const STORAGE_KEY_PLAN = 'aion_memory_live_plan';

export class AionMemoryStore {
  private static instance: AionMemoryStore;

  private meals: MealRecord[] = [];
  private inventory: InventoryItem[] = [];
  private livePlan: LivePlan;

  private constructor() {
    this.livePlan = this.createInitialPlan();
    this.seedInitialInventory();
    this.seedInitialMeals();
    this.loadFromStorage();
  }

  public static getInstance(): AionMemoryStore {
    if (!AionMemoryStore.instance) {
      AionMemoryStore.instance = new AionMemoryStore();
    }
    return AionMemoryStore.instance;
  }

  private createInitialPlan(): LivePlan {
    return {
      dailyTargetKcal: 1800,
      consumedKcal: 580,
      remainingKcal: 1220,
      macroTargets: { protein: 120, carbs: 180, fats: 60 },
      macroConsumed: { protein: 30, carbs: 36, fats: 36 },
      plannedMeals: [
        { mealType: 'Almuerzo', suggestedTime: '14:00', recipeTitle: 'Pollo salteado con vegetales', kcal: 520 },
        { mealType: 'Cena', suggestedTime: '20:00', recipeTitle: 'Ensalada de Atún con aguacate', kcal: 450 },
        { mealType: 'Snack Opcional', suggestedTime: '17:30', recipeTitle: 'Yogurt natural con almendras', kcal: 250 },
      ],
      lastRecalculated: new Date().toISOString(),
      adaptiveNote: 'Plan reorganizado automáticamente tras tu desayuno de 580 kcal.',
    };
  }

  private seedInitialInventory(): void {
    this.inventory = [
      {
        id: 'inv-1',
        name: 'Lata de Atún',
        amount: 3,
        unit: 'latas',
        location: 'despensa',
        availability: 'DISPONIBLE',
        addedDate: new Date().toISOString(),
        confidence: 'ALTA',
        source: 'user_informed',
      },
      {
        id: 'inv-2',
        name: 'Papas sabaneras',
        amount: 6,
        unit: 'unidades',
        location: 'despensa',
        availability: 'DISPONIBLE',
        addedDate: new Date().toISOString(),
        confidence: 'ALTA',
        source: 'user_informed',
      },
      {
        id: 'inv-3',
        name: 'Queso costeño',
        amount: 250,
        unit: 'g',
        location: 'refrigerador',
        availability: 'BAJO',
        addedDate: new Date().toISOString(),
        expirationDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        confidence: 'ALTA',
        source: 'user_informed',
      },
      {
        id: 'inv-4',
        name: 'Pechuga de Pollo',
        amount: 500,
        unit: 'g',
        location: 'congelador',
        availability: 'DISPONIBLE',
        addedDate: new Date().toISOString(),
        confidence: 'ALTA',
        source: 'user_informed',
      },
      {
        id: 'inv-5',
        name: 'Tomates frescos',
        amount: 2,
        unit: 'unidades',
        location: 'refrigerador',
        availability: 'PRÓXIMO A VENCER',
        addedDate: new Date().toISOString(),
        expirationDate: new Date(Date.now() + 86400000).toISOString(),
        confidence: 'MEDIA',
        source: 'observed_event',
      },
    ];
  }

  private seedInitialMeals(): void {
    this.meals = [
      {
        id: 'meal-1',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        mealType: 'Desayuno',
        preparation: {
          id: 'prep-1',
          name: 'Ensalada de Atún con Papa y Queso',
          ingredients: [
            {
              id: 'ing-1',
              name: 'Atún en agua',
              amountPreparation: 1,
              amountConsumed: 0.2,
              unit: 'lata',
              kcal: 30,
              proteinGrams: 6,
              carbsGrams: 0,
              fatsGrams: 0.5,
              confidence: 'ALTA',
              source: 'usuario',
            },
            {
              id: 'ing-2',
              name: 'Papa cocida',
              amountPreparation: 1,
              amountConsumed: 1,
              unit: 'unidad',
              kcal: 160,
              proteinGrams: 4,
              carbsGrams: 36,
              fatsGrams: 0.2,
              confidence: 'ALTA',
              source: 'foto',
            },
            {
              id: 'ing-3',
              name: 'Queso costeño',
              amountPreparation: 100,
              amountConsumed: 100,
              unit: 'g',
              kcal: 290,
              proteinGrams: 18,
              carbsGrams: 0,
              fatsGrams: 24,
              confidence: 'MEDIA',
              source: 'usuario',
            },
            {
              id: 'ing-4',
              name: 'Margarina',
              amountPreparation: 1,
              amountConsumed: 1,
              unit: 'cucharada',
              kcal: 100,
              proteinGrams: 0,
              carbsGrams: 0,
              fatsGrams: 11.3,
              confidence: 'MEDIA',
              source: 'calculo',
            },
          ],
          totalKcal: 1100,
          totalProtein: 60,
          totalCarbs: 60,
          totalFats: 70,
        },
        consumedPortion: {
          fractionText: '1/5 de la ensalada + 1 papa + 100g queso + margarina',
          fractionValue: 0.2,
          consumedItems: [],
          actualKcal: 580,
          actualProtein: 28,
          actualCarbs: 36,
          actualFats: 36,
        },
        confidence: 'MEDIA',
        evidenceSummary: 'Analizado por foto y confirmado por el usuario en 1/5 de la preparación.',
        userConfirmed: true,
      },
    ];
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const savedMeals = localStorage.getItem(STORAGE_KEY_MEALS);
      if (savedMeals) this.meals = JSON.parse(savedMeals);

      const savedInventory = localStorage.getItem(STORAGE_KEY_INVENTORY);
      if (savedInventory) this.inventory = JSON.parse(savedInventory);

      const savedPlan = localStorage.getItem(STORAGE_KEY_PLAN);
      if (savedPlan) this.livePlan = JSON.parse(savedPlan);
    } catch (e) {
      console.warn('[AION Memory] Could not load from localStorage, using in-memory state.');
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(STORAGE_KEY_MEALS, JSON.stringify(this.meals));
      localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(this.inventory));
      localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(this.livePlan));
    } catch (e) {
      console.warn('[AION Memory] Could not save to localStorage');
    }
  }

  // API Métodos de Consulta y Guardado
  public getMeals(): MealRecord[] {
    return [...this.meals];
  }

  public addMeal(meal: MealRecord): void {
    this.meals.unshift(meal);
    this.recalculatePlanAfterMeal(meal.consumedPortion.actualKcal, meal.consumedPortion.actualProtein, meal.consumedPortion.actualCarbs, meal.consumedPortion.actualFats);
    this.saveToStorage();
  }

  public getInventory(): InventoryItem[] {
    return [...this.inventory];
  }

  public addInventoryItem(item: InventoryItem): void {
    this.inventory.unshift(item);
    this.saveToStorage();
  }

  public updateInventoryItem(id: string, updates: Partial<InventoryItem>): void {
    const idx = this.inventory.findIndex((i) => i.id === id);
    if (idx !== -1) {
      this.inventory[idx] = { ...this.inventory[idx], ...updates };
      this.saveToStorage();
    }
  }

  public getLivePlan(): LivePlan {
    return { ...this.livePlan };
  }

  private recalculatePlanAfterMeal(kcal: number, protein: number, carbs: number, fats: number): void {
    this.livePlan.consumedKcal += kcal;
    this.livePlan.remainingKcal = Math.max(0, this.livePlan.dailyTargetKcal - this.livePlan.consumedKcal);
    this.livePlan.macroConsumed.protein += protein;
    this.livePlan.macroConsumed.carbs += carbs;
    this.livePlan.macroConsumed.fats += fats;
    this.livePlan.lastRecalculated = new Date().toISOString();
    this.livePlan.adaptiveNote = `Plan vivo recalculado: te quedan ${this.livePlan.remainingKcal} kcal para el resto del día.`;
  }
}
