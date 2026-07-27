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
    this.loadFromStorage();
  }

  public static getInstance(): AionMemoryStore {
    if (!AionMemoryStore.instance) {
      AionMemoryStore.instance = new AionMemoryStore();
    }
    return AionMemoryStore.instance;
  }

  public resetToCleanState(): void {
    this.meals = [];
    this.inventory = [];
    this.facts = [];
    this.ledger = [];
    this.transactions = [];
    this.recipes = [];
    this.preparedBatches = [];
    this.livePlan = this.createInitialPlan();
    this.saveToStorage();
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
      consumedKcal: 0,
      remainingKcal: 1800,
      macroTargets: { protein: 120, carbs: 180, fats: 60 },
      macroConsumed: { protein: 0, carbs: 0, fats: 0 },
      plannedMeals: [
        { mealType: 'Almuerzo', suggestedTime: '14:00', recipeTitle: 'Pechuga de pollo salteada con vegetales', kcal: 520 },
        { mealType: 'Cena', suggestedTime: '20:00', recipeTitle: 'Ensalada de Atún con tomate', kcal: 450 },
      ],
      lastRecalculated: new Date().toISOString(),
      adaptiveNote: 'Plan inicial disponible.',
    };
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

  // API de Transacciones de Inventario Auditable (Reductor Único de Estado Materializado)
  public addInventoryTransaction(tx: InventoryTransaction): void {
    this.transactions.unshift(tx);

    let matchIdx = this.inventory.findIndex((i) => i.id === tx.pantryItemId);
    if (matchIdx === -1) {
      matchIdx = this.inventory.findIndex((i) => i.name.toLowerCase() === tx.pantryItemName.toLowerCase());
    }

    if (matchIdx !== -1) {
      const current = this.inventory[matchIdx];
      const delta = tx.quantityDelta || 0;
      const newAmount = Math.max(0, current.amount + delta);
      const newAvailability = newAmount === 0 ? 'AGOTADO' : newAmount <= 1 ? 'BAJO' : 'DISPONIBLE';

      this.inventory[matchIdx] = { ...current, amount: newAmount, availability: newAvailability };
    } else {
      // Si el ítem no existe en la colección de inventario, se registra con la cantidad delta inicial
      const newItem: InventoryItem = {
        id: tx.pantryItemId,
        name: tx.pantryItemName,
        amount: Math.max(0, tx.quantityDelta || 0),
        unit: tx.unit || 'unidad',
        availability: (tx.quantityDelta || 0) > 0 ? 'DISPONIBLE' : 'AGOTADO',
        addedDate: tx.createdAt,
        confidence: tx.confidence && tx.confidence > 0.8 ? 'ALTA' : 'MEDIA',
        source: tx.evidence,
      };
      this.inventory.unshift(newItem);
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
    this.saveToStorage();
  }

  // API Inventario (Delegado Exclusivo a addInventoryTransaction)
  public getInventory(): InventoryItem[] {
    return [...this.inventory];
  }

  public addInventoryItem(item: InventoryItem): void {
    const existing = this.inventory.find((i) => i.id === item.id || i.name.toLowerCase() === item.name.toLowerCase());
    const itemId = existing ? existing.id : item.id;
    const itemName = existing ? existing.name : item.name;

    this.addInventoryTransaction({
      id: `tx-add-${Date.now()}`,
      pantryItemId: itemId,
      pantryItemName: itemName,
      type: 'manual_add',
      quantityDelta: item.amount,
      unit: item.unit,
      evidence: item.source,
      createdAt: item.addedDate,
      explanation: existing ? 'Adición de existencias a alimento existente.' : 'Ingreso de nuevo alimento a la despensa.',
    });
  }

  public updateInventoryItem(id: string, updates: Partial<InventoryItem>): void {
    const idx = this.inventory.findIndex((i) => i.id === id);
    if (idx !== -1) {
      const oldAmount = this.inventory[idx].amount;
      this.inventory[idx] = { ...this.inventory[idx], ...updates };

      if (updates.amount !== undefined && updates.amount !== oldAmount) {
        const delta = updates.amount - oldAmount;
        this.transactions.unshift({
          id: `tx-adj-${Date.now()}`,
          pantryItemId: id,
          pantryItemName: this.inventory[idx].name,
          type: 'manual_adjustment',
          quantityDelta: delta,
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
