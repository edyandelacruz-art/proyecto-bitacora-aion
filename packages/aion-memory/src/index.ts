import {
  MealRecord,
  InventoryItem,
  LivePlan,
  AionUserProfile,
  AegisProfile,
  MemoryFact,
  EvidenceLevel,
} from '@aion/shared-types';

const STORAGE_KEY_MEALS = 'aion_memory_meals';
const STORAGE_KEY_INVENTORY = 'aion_memory_inventory';
const STORAGE_KEY_PLAN = 'aion_memory_live_plan';
const STORAGE_KEY_CORE_PROFILE = 'aion_memory_core_profile';
const STORAGE_KEY_AEGIS_PROFILE = 'aion_memory_aegis_profile';
const STORAGE_KEY_FACTS = 'aion_memory_facts';

export class AionMemoryStore {
  private static instance: AionMemoryStore;

  private meals: MealRecord[] = [];
  private inventory: InventoryItem[] = [];
  private livePlan: LivePlan;
  private coreProfile: AionUserProfile;
  private aegisProfile: AegisProfile;
  private facts: MemoryFact[] = [];

  private constructor() {
    this.coreProfile = this.createDefaultCoreProfile();
    this.aegisProfile = this.createDefaultAegisProfile();
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

  private createDefaultCoreProfile(): AionUserProfile {
    return {
      displayName: 'Usuario AION',
      language: 'es',
      country: 'Colombia',
      region: 'Cundinamarca',
      city: 'Bogotá',
      timezone: 'America/Bogota',
      locale: 'es-CO',
      currency: 'COP',
      unitSystem: 'metric',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h',
    };
  }

  private createDefaultAegisProfile(): AegisProfile {
    return {
      goals: [{ type: 'deficit', targetKcal: 1800, targetProteinG: 120 }],
      preferredEatingPattern: ['Desayuno', 'Almuerzo', 'Cena'],
      allergies: [],
      intolerances: [],
      dislikedFoods: [],
      preferredFoods: ['Atún', 'Papa sabanera', 'Pollo', 'Queso costeño', 'Tomate'],
      cookingSkill: 'medium',
      typicalPrepTimeMinutes: 20,
      householdSize: 1,
    };
  }

  private createInitialPlan(): LivePlan {
    return {
      dailyTargetKcal: 1800,
      consumedKcal: 580,
      remainingKcal: 1220,
      macroTargets: { protein: 120, carbs: 180, fats: 60 },
      macroConsumed: { protein: 30, carbs: 36, fats: 36 },
      plannedMeals: [
        { mealType: 'Almuerzo', suggestedTime: '14:00', recipeTitle: 'Pechuga de pollo salteada con vegetales', kcal: 520 },
        { mealType: 'Cena', suggestedTime: '20:00', recipeTitle: 'Ensalada de Atún con tomate', kcal: 450 },
        { mealType: 'Snack', suggestedTime: '17:30', recipeTitle: 'Manzana con almendras', kcal: 250 },
      ],
      lastRecalculated: new Date().toISOString(),
      adaptiveNote: 'Plan reorganizado automáticamente tras tu desayuno.',
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
        source: 'USER_CONFIRMED',
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
        source: 'USER_CONFIRMED',
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
        source: 'USER_CONFIRMED',
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
        source: 'USER_CONFIRMED',
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
        source: 'VISUAL_ESTIMATE_HIGH',
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
              source: 'USER_CONFIRMED',
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
              source: 'VISUAL_ESTIMATE_HIGH',
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
              source: 'USER_CONFIRMED',
            },
          ],
          totalKcal: 1100,
          totalProtein: 60,
          totalCarbs: 60,
          totalFats: 70,
        },
        consumedPortion: {
          fractionText: '1/5 de la ensalada + 1 papa + 100g queso',
          fractionValue: 0.2,
          consumedItems: [],
          actualKcal: 580,
          actualProtein: 28,
          actualCarbs: 36,
          actualFats: 36,
        },
        confidence: 'MEDIA',
        evidenceSummary: 'Analizado por foto y confirmado en 1/5 de la preparación.',
        evidenceLevel: 'USER_CONFIRMED',
        userConfirmed: true,
      },
    ];
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const savedCore = localStorage.getItem(STORAGE_KEY_CORE_PROFILE);
      if (savedCore) this.coreProfile = JSON.parse(savedCore);

      const savedAegis = localStorage.getItem(STORAGE_KEY_AEGIS_PROFILE);
      if (savedAegis) this.aegisProfile = JSON.parse(savedAegis);

      const savedMeals = localStorage.getItem(STORAGE_KEY_MEALS);
      if (savedMeals) this.meals = JSON.parse(savedMeals);

      const savedInventory = localStorage.getItem(STORAGE_KEY_INVENTORY);
      if (savedInventory) this.inventory = JSON.parse(savedInventory);

      const savedPlan = localStorage.getItem(STORAGE_KEY_PLAN);
      if (savedPlan) this.livePlan = JSON.parse(savedPlan);

      const savedFacts = localStorage.getItem(STORAGE_KEY_FACTS);
      if (savedFacts) this.facts = JSON.parse(savedFacts);
    } catch (e) {
      console.warn('[AION Memory] Usando memoria de tiempo de ejecución.');
    }
  }

  public saveToStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(STORAGE_KEY_CORE_PROFILE, JSON.stringify(this.coreProfile));
      localStorage.setItem(STORAGE_KEY_AEGIS_PROFILE, JSON.stringify(this.aegisProfile));
      localStorage.setItem(STORAGE_KEY_MEALS, JSON.stringify(this.meals));
      localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(this.inventory));
      localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(this.livePlan));
      localStorage.setItem(STORAGE_KEY_FACTS, JSON.stringify(this.facts));
    } catch (e) {
      console.warn('[AION Memory] Error guardando en localStorage');
    }
  }

  // API de Perfiles
  public getCoreProfile(): AionUserProfile {
    return { ...this.coreProfile };
  }

  public updateCoreProfile(updates: Partial<AionUserProfile>): void {
    this.coreProfile = { ...this.coreProfile, ...updates };
    this.saveToStorage();
  }

  public getAegisProfile(): AegisProfile {
    return { ...this.aegisProfile };
  }

  public updateAegisProfile(updates: Partial<AegisProfile>): void {
    this.aegisProfile = { ...this.aegisProfile, ...updates };
    this.saveToStorage();
  }

  // API de Hechos de Memoria (MemoryFact)
  public addFact(fact: MemoryFact): void {
    this.facts.unshift(fact);
    this.saveToStorage();
  }

  public getFacts(): MemoryFact[] {
    return [...this.facts];
  }

  // API Comidas
  public getMeals(): MealRecord[] {
    return [...this.meals];
  }

  public addMeal(meal: MealRecord): void {
    this.meals.unshift(meal);
    this.recalculatePlanAfterMeal(
      meal.consumedPortion.actualKcal,
      meal.consumedPortion.actualProtein,
      meal.consumedPortion.actualCarbs,
      meal.consumedPortion.actualFats
    );
    this.deductInventoryFromMeal(meal);
    this.saveToStorage();
  }

  private deductInventoryFromMeal(meal: MealRecord): void {
    meal.preparation.ingredients.forEach((ing) => {
      const matchIdx = this.inventory.findIndex(
        (inv) => inv.name.toLowerCase().includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(inv.name.toLowerCase())
      );
      if (matchIdx !== -1) {
        const current = this.inventory[matchIdx];
        const newAmount = Math.max(0, current.amount - (ing.amountConsumed || 1));
        const newAvailability = newAmount === 0 ? 'AGOTADO' : newAmount <= 1 ? 'BAJO' : 'DISPONIBLE';
        this.inventory[matchIdx] = { ...current, amount: newAmount, availability: newAvailability };
      }
    });
  }

  // API Inventario
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

  // API Plan Vivo
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
    this.livePlan.adaptiveNote = `Plan vivo recalculado automáticamente: te quedan ${this.livePlan.remainingKcal} kcal para el resto del día.`;
  }
}
