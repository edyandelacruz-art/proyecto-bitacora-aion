import {
  MealRecord,
  InventoryItem,
  LivePlan,
  AionUserProfile,
  AegisProfile,
  MemoryFact,
  ResponseLanguageProfile,
  AegisLedgerEntry,
  InventoryTransaction,
  Recipe,
  PreparedBatch,
  EvidenceLevel,
} from '@aion/shared-types';

const STORAGE_KEY_MEALS = 'aion_memory_meals';
const STORAGE_KEY_INVENTORY = 'aion_memory_inventory';
const STORAGE_KEY_PLAN = 'aion_memory_live_plan';
const STORAGE_KEY_CORE_PROFILE = 'aion_memory_core_profile';
const STORAGE_KEY_AEGIS_PROFILE = 'aion_memory_aegis_profile';
const STORAGE_KEY_FACTS = 'aion_memory_facts';
const STORAGE_KEY_LEDGER = 'aion_memory_ledger';
const STORAGE_KEY_TRANSACTIONS = 'aion_memory_transactions';
const STORAGE_KEY_RECIPES = 'aion_memory_recipes';
const STORAGE_KEY_BATCHES = 'aion_memory_batches';

export class AionMemoryStore {
  private static instance: AionMemoryStore;

  private meals: MealRecord[] = [];
  private inventory: InventoryItem[] = [];
  private livePlan: LivePlan;
  private coreProfile: AionUserProfile;
  private aegisProfile: AegisProfile;
  private facts: MemoryFact[] = [];
  private ledger: AegisLedgerEntry[] = [];
  private transactions: InventoryTransaction[] = [];
  private recipes: Recipe[] = [];
  private preparedBatches: PreparedBatch[] = [];

  private constructor() {
    this.coreProfile = this.createDefaultCoreProfile();
    this.aegisProfile = this.createDefaultAegisProfile();
    this.livePlan = this.createInitialPlan();
    this.seedInitialInventory();
    this.seedInitialMeals();
    this.seedInitialRecipes();
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
      languageProfile: {
        mode: 'human',
        verbosity: 'balanced',
        explainUnknownTerms: true,
        preferredTone: 'friendly',
      },
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

    // Transacción inicial de siembra en el historial auditable
    this.inventory.forEach((item) => {
      this.transactions.push({
        id: `tx-init-${item.id}`,
        pantryItemId: item.id,
        pantryItemName: item.name,
        type: 'manual_add',
        quantityDelta: item.amount,
        unit: item.unit,
        evidence: item.source,
        confidence: 0.95,
        createdAt: item.addedDate,
        explanation: 'Registro inicial de inventario en despensa.',
      });
    });
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

  private seedInitialRecipes(): void {
    this.recipes = [
      {
        id: 'rec-1',
        name: 'Pechuga de pollo salteada con vegetales y papa sabanera',
        description: 'Receta alta en proteína utilizando ingredientes frescos de la despensa.',
        servings: 1,
        prepTimeMin: 15,
        cookTimeMin: 15,
        difficulty: 'easy',
        ingredients: [
          { name: 'Pechuga de Pollo', amount: 200, unit: 'g' },
          { name: 'Papa sabanera', amount: 1, unit: 'unidad' },
          { name: 'Tomates frescos', amount: 2, unit: 'unidades' },
        ],
        instructions: [
          { stepNumber: 1, instruction: 'Corta el pollo en tiras y saltea con tomates.' },
          { stepNumber: 2, instruction: 'Cocina la papa al vapor durante 15 minutos.' },
        ],
        totalNutrition: { kcal: 480, protein: 36, carbs: 35, fats: 10 },
        source: 'aion_generated',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    this.preparedBatches = [
      {
        id: 'batch-1',
        recipeId: 'rec-1',
        recipeName: 'Pechuga de pollo con vegetales (Meal Prep 3 días)',
        preparedAt: new Date(Date.now() - 86400000).toISOString(),
        expiresAtEstimate: new Date(Date.now() + 86400000 * 3).toISOString(),
        totalServings: 3,
        servingsRemaining: 2,
        storageLocation: 'refrigerador',
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

      const savedLedger = localStorage.getItem(STORAGE_KEY_LEDGER);
      if (savedLedger) this.ledger = JSON.parse(savedLedger);

      const savedTx = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (savedTx) this.transactions = JSON.parse(savedTx);

      const savedRecipes = localStorage.getItem(STORAGE_KEY_RECIPES);
      if (savedRecipes) this.recipes = JSON.parse(savedRecipes);

      const savedBatches = localStorage.getItem(STORAGE_KEY_BATCHES);
      if (savedBatches) this.preparedBatches = JSON.parse(savedBatches);
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
      localStorage.setItem(STORAGE_KEY_LEDGER, JSON.stringify(this.ledger));
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(this.transactions));
      localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(this.recipes));
      localStorage.setItem(STORAGE_KEY_BATCHES, JSON.stringify(this.preparedBatches));
    } catch (e) {
      console.warn('[AION Memory] Error guardando en localStorage');
    }
  }

  // API de Perfiles y Lenguaje
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

  public setLanguageMode(mode: ResponseLanguageProfile['mode']): void {
    if (!this.coreProfile.languageProfile) {
      this.coreProfile.languageProfile = { mode: 'human', verbosity: 'balanced', explainUnknownTerms: true };
    }
    this.coreProfile.languageProfile.mode = mode;
    this.saveToStorage();
  }

  // API de Aegis Ledger Universal
  public addLedgerEntry(entry: AegisLedgerEntry): void {
    this.ledger.unshift(entry);
    this.saveToStorage();
  }

  public getLedgerEntries(): AegisLedgerEntry[] {
    return [...this.ledger];
  }

  // API de Transacciones de Inventario Auditable
  public addInventoryTransaction(tx: InventoryTransaction): void {
    this.transactions.unshift(tx);

    const matchIdx = this.inventory.findIndex((i) => i.id === tx.pantryItemId);
    if (matchIdx !== -1) {
      const current = this.inventory[matchIdx];
      const delta = tx.quantityDelta || 0;
      const newAmount = Math.max(0, current.amount + delta);
      const newAvailability = newAmount === 0 ? 'AGOTADO' : newAmount <= 1 ? 'BAJO' : 'DISPONIBLE';

      this.inventory[matchIdx] = { ...current, amount: newAmount, availability: newAvailability };
    }
    this.saveToStorage();
  }

  public getInventoryTransactions(pantryItemId: string): InventoryTransaction[] {
    return this.transactions.filter((tx) => tx.pantryItemId === pantryItemId);
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

    this.addLedgerEntry({
      id: `led-${Date.now()}`,
      timestamp: meal.timestamp,
      type: 'meal',
      source: 'user',
      payload: meal,
      evidence: meal.evidenceLevel,
      confidence: 0.95,
    });

    this.saveToStorage();
  }

  private deductInventoryFromMeal(meal: MealRecord): void {
    meal.preparation.ingredients.forEach((ing) => {
      const matchIdx = this.inventory.findIndex(
        (inv) => inv.name.toLowerCase().includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(inv.name.toLowerCase())
      );
      if (matchIdx !== -1) {
        const item = this.inventory[matchIdx];
        const consumedAmount = ing.amountConsumed || 1;

        this.addInventoryTransaction({
          id: `tx-meal-${Date.now()}-${ing.id}`,
          pantryItemId: item.id,
          pantryItemName: item.name,
          type: 'meal_use',
          quantityDelta: -consumedAmount,
          unit: item.unit,
          evidence: ing.source,
          confidence: 0.9,
          createdAt: new Date().toISOString(),
          relatedMealId: meal.id,
          explanation: `Consumido en preparación "${meal.preparation.name}".`,
        });
      }
    });
  }

  // API Inventario
  public getInventory(): InventoryItem[] {
    return [...this.inventory];
  }

  public addInventoryItem(item: InventoryItem): void {
    this.inventory.unshift(item);
    this.addInventoryTransaction({
      id: `tx-add-${Date.now()}`,
      pantryItemId: item.id,
      pantryItemName: item.name,
      type: 'manual_add',
      quantityDelta: item.amount,
      unit: item.unit,
      evidence: item.source,
      createdAt: item.addedDate,
      explanation: 'Ingreso de nuevo alimento a la despensa.',
    });
    this.saveToStorage();
  }

  public updateInventoryItem(id: string, updates: Partial<InventoryItem>): void {
    const idx = this.inventory.findIndex((i) => i.id === id);
    if (idx !== -1) {
      const oldAmount = this.inventory[idx].amount;
      this.inventory[idx] = { ...this.inventory[idx], ...updates };

      if (updates.amount !== undefined && updates.amount !== oldAmount) {
        this.addInventoryTransaction({
          id: `tx-adj-${Date.now()}`,
          pantryItemId: id,
          pantryItemName: this.inventory[idx].name,
          type: 'manual_adjustment',
          quantityDelta: updates.amount - oldAmount,
          unit: this.inventory[idx].unit,
          evidence: 'USER_CONFIRMED',
          createdAt: new Date().toISOString(),
          explanation: `Ajuste manual de existencias de ${oldAmount} a ${updates.amount}.`,
        });
      }

      this.saveToStorage();
    }
  }

  // API de Recetas & Meal Prep
  public getRecipes(): Recipe[] {
    return [...this.recipes];
  }

  public addRecipe(recipe: Recipe): void {
    this.recipes.unshift(recipe);
    this.saveToStorage();
  }

  public getPreparedBatches(): PreparedBatch[] {
    return [...this.preparedBatches];
  }

  public addPreparedBatch(batch: PreparedBatch): void {
    this.preparedBatches.unshift(batch);
    this.saveToStorage();
  }

  // API Facts
  public addFact(fact: MemoryFact): void {
    this.facts.unshift(fact);
    this.saveToStorage();
  }

  public getFacts(): MemoryFact[] {
    return [...this.facts];
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
