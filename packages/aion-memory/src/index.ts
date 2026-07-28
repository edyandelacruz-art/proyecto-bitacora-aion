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
  SleepRecord,
  ActivityRecord,
  HydrationRecord,
  StateRecord,
  MedicationRecord,
  SymptomRecord,
  BodyMeasurementRecord,
  HabitRecord,
  PurchaseReceiptRecord,
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
const STORAGE_KEY_SLEEP = 'aion_memory_sleep';
const STORAGE_KEY_ACTIVITY = 'aion_memory_activity';
const STORAGE_KEY_HYDRATION = 'aion_memory_hydration';
const STORAGE_KEY_STATE = 'aion_memory_state';
const STORAGE_KEY_MEDICATION = 'aion_memory_medication';
const STORAGE_KEY_SYMPTOMS = 'aion_memory_symptoms';
const STORAGE_KEY_BODY = 'aion_memory_body';
const STORAGE_KEY_HABITS = 'aion_memory_habits';
const STORAGE_KEY_RECEIPTS = 'aion_memory_receipts';

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

  // Nuevos Almacenes Canónicos de Módulos Aegis
  private sleepRecords: SleepRecord[] = [];
  private activityRecords: ActivityRecord[] = [];
  private hydrationRecords: HydrationRecord[] = [];
  private stateRecords: StateRecord[] = [];
  private medicationRecords: MedicationRecord[] = [];
  private symptomRecords: SymptomRecord[] = [];
  private bodyRecords: BodyMeasurementRecord[] = [];
  private habitRecords: HabitRecord[] = [];
  private receiptRecords: PurchaseReceiptRecord[] = [];

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
    this.sleepRecords = [];
    this.activityRecords = [];
    this.hydrationRecords = [];
    this.stateRecords = [];
    this.medicationRecords = [];
    this.symptomRecords = [];
    this.bodyRecords = [];
    this.habitRecords = [];
    this.receiptRecords = [];
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
      plannedItems: [
        { id: 'plan-1', scheduledTime: '14:00', title: 'Almuerzo', description: 'Pechuga de pollo salteada con vegetales', moduleOwner: 'NUTRITION', status: 'PENDIENTE', priority: 'ALTA' },
        { id: 'plan-2', scheduledTime: '20:00', title: 'Cena', description: 'Ensalada de Atún con tomate y queso', moduleOwner: 'NUTRITION', status: 'PENDIENTE', priority: 'MEDIA' },
      ],
      lastRecalculated: new Date().toISOString(),
      adaptiveNote: 'Plan vivo recalculado para el día actual.',
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

      const savedSleep = localStorage.getItem(STORAGE_KEY_SLEEP);
      if (savedSleep) this.sleepRecords = JSON.parse(savedSleep);

      const savedAct = localStorage.getItem(STORAGE_KEY_ACTIVITY);
      if (savedAct) this.activityRecords = JSON.parse(savedAct);

      const savedHydr = localStorage.getItem(STORAGE_KEY_HYDRATION);
      if (savedHydr) this.hydrationRecords = JSON.parse(savedHydr);

      const savedState = localStorage.getItem(STORAGE_KEY_STATE);
      if (savedState) this.stateRecords = JSON.parse(savedState);

      const savedMed = localStorage.getItem(STORAGE_KEY_MEDICATION);
      if (savedMed) this.medicationRecords = JSON.parse(savedMed);

      const savedSym = localStorage.getItem(STORAGE_KEY_SYMPTOMS);
      if (savedSym) this.symptomRecords = JSON.parse(savedSym);

      const savedBody = localStorage.getItem(STORAGE_KEY_BODY);
      if (savedBody) this.bodyRecords = JSON.parse(savedBody);

      const savedHab = localStorage.getItem(STORAGE_KEY_HABITS);
      if (savedHab) this.habitRecords = JSON.parse(savedHab);

      const savedRec = localStorage.getItem(STORAGE_KEY_RECEIPTS);
      if (savedRec) this.receiptRecords = JSON.parse(savedRec);
    } catch (e) {
      console.warn('[AION Memory] Usando almacenamiento en tiempo de ejecución.');
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
      localStorage.setItem(STORAGE_KEY_SLEEP, JSON.stringify(this.sleepRecords));
      localStorage.setItem(STORAGE_KEY_ACTIVITY, JSON.stringify(this.activityRecords));
      localStorage.setItem(STORAGE_KEY_HYDRATION, JSON.stringify(this.hydrationRecords));
      localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(this.stateRecords));
      localStorage.setItem(STORAGE_KEY_MEDICATION, JSON.stringify(this.medicationRecords));
      localStorage.setItem(STORAGE_KEY_SYMPTOMS, JSON.stringify(this.symptomRecords));
      localStorage.setItem(STORAGE_KEY_BODY, JSON.stringify(this.bodyRecords));
      localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(this.habitRecords));
      localStorage.setItem(STORAGE_KEY_RECEIPTS, JSON.stringify(this.receiptRecords));
    } catch (e) {
      console.warn('[AION Memory] Error al guardar en localStorage.');
    }
  }

  // Core & Aegis Profile APIs
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

  // Aegis Universal Ledger API
  public addLedgerEntry(entry: AegisLedgerEntry): void {
    this.ledger.unshift(entry);
    this.saveToStorage();
  }

  public getLedgerEntries(): AegisLedgerEntry[] {
    return [...this.ledger];
  }

  // Inventory & Transactions API
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

  // Meals API
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

  // Sleep API
  public getSleepRecords(): SleepRecord[] {
    return [...this.sleepRecords];
  }

  public addSleepRecord(record: SleepRecord): void {
    this.sleepRecords.unshift(record);
    this.addLedgerEntry({
      id: `led-sleep-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'sleep_logged',
      source: record.source === 'USER_REPORTED' ? 'user' : 'integration',
      authoritativeModule: 'SLEEP',
      agentsInvoked: ['SleepSupervisorAgent', 'SleepQualityAgent'],
      toolsInvoked: ['saveSleepRecord'],
      payload: record,
      evidence: record.evidenceLevel,
      confidence: 0.95,
    });
    this.saveToStorage();
  }

  // Activity API
  public getActivityRecords(): ActivityRecord[] {
    return [...this.activityRecords];
  }

  public addActivityRecord(record: ActivityRecord): void {
    this.activityRecords.unshift(record);
    this.addLedgerEntry({
      id: `led-act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'activity_logged',
      source: 'user',
      authoritativeModule: 'ACTIVITY',
      agentsInvoked: ['ActivitySupervisorAgent', 'EnergyExpenditureAgent'],
      toolsInvoked: ['saveActivityRecord'],
      payload: record,
      evidence: record.evidenceLevel,
      confidence: 0.92,
    });
    this.saveToStorage();
  }

  // Hydration API
  public getHydrationRecords(): HydrationRecord[] {
    return [...this.hydrationRecords];
  }

  public addHydrationRecord(record: HydrationRecord): void {
    this.hydrationRecords.unshift(record);
    this.addLedgerEntry({
      id: `led-hyd-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'hydration_logged',
      source: 'user',
      authoritativeModule: 'HYDRATION',
      agentsInvoked: ['HydrationSupervisorAgent'],
      toolsInvoked: ['saveHydrationRecord'],
      payload: record,
      evidence: record.evidenceLevel,
      confidence: 1.0,
    });
    this.saveToStorage();
  }

  // State (Energy/Mood/Hunger) API
  public getStateRecords(): StateRecord[] {
    return [...this.stateRecords];
  }

  public addStateRecord(record: StateRecord): void {
    this.stateRecords.unshift(record);
    this.addLedgerEntry({
      id: `led-state-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'state_logged',
      source: 'user',
      authoritativeModule: 'STATE',
      agentsInvoked: ['StateSupervisorAgent', 'SubjectiveStateInterpreterAgent'],
      toolsInvoked: ['saveStateRecord'],
      payload: record,
      evidence: record.evidenceLevel,
      confidence: 1.0,
    });
    this.saveToStorage();
  }

  // Medication API
  public getMedicationRecords(): MedicationRecord[] {
    return [...this.medicationRecords];
  }

  public addMedicationRecord(record: MedicationRecord): void {
    this.medicationRecords.unshift(record);
    this.addLedgerEntry({
      id: `led-med-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'medication_logged',
      source: 'user',
      authoritativeModule: 'MEDICATION',
      agentsInvoked: ['MedicationSupervisorAgent', 'MedicationLoggerAgent'],
      toolsInvoked: ['saveMedicationRecord'],
      payload: record,
      evidence: record.evidenceLevel,
      confidence: 1.0,
    });
    this.saveToStorage();
  }

  // Symptoms API
  public getSymptomRecords(): SymptomRecord[] {
    return [...this.symptomRecords];
  }

  public addSymptomRecord(record: SymptomRecord): void {
    this.symptomRecords.unshift(record);
    this.addLedgerEntry({
      id: `led-symp-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'symptom_logged',
      source: 'user',
      authoritativeModule: 'SYMPTOMS',
      agentsInvoked: ['SymptomsSupervisorAgent', 'PainCharacterizationAgent'],
      toolsInvoked: ['saveSymptomRecord'],
      payload: record,
      evidence: record.evidenceLevel,
      confidence: 1.0,
    });
    this.saveToStorage();
  }

  // Body Measurements API
  public getBodyRecords(): BodyMeasurementRecord[] {
    return [...this.bodyRecords];
  }

  public addBodyRecord(record: BodyMeasurementRecord): void {
    this.bodyRecords.unshift(record);
    this.addLedgerEntry({
      id: `led-body-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'body_measurement_logged',
      source: 'user',
      authoritativeModule: 'BODY',
      agentsInvoked: ['BodySupervisorAgent', 'MeasurementCaptureAgent'],
      toolsInvoked: ['saveBodyRecord'],
      payload: record,
      evidence: record.evidenceLevel,
      confidence: 1.0,
    });
    this.saveToStorage();
  }

  // Habits API
  public getHabitRecords(): HabitRecord[] {
    return [...this.habitRecords];
  }

  public addHabitRecord(record: HabitRecord): void {
    this.habitRecords.unshift(record);
    this.addLedgerEntry({
      id: `led-habit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'habit_logged',
      source: 'user',
      authoritativeModule: 'HABITS',
      agentsInvoked: ['HabitsSupervisorAgent', 'HabitAdherenceAgent'],
      toolsInvoked: ['saveHabitRecord'],
      payload: record,
      evidence: record.evidenceLevel,
      confidence: 1.0,
    });
    this.saveToStorage();
  }

  // Recipes & Batches API
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

  // Memory Facts API
  public addFact(fact: MemoryFact): void {
    this.facts.unshift(fact);
    this.saveToStorage();
  }

  public getFacts(): MemoryFact[] {
    return [...this.facts];
  }

  // Live Plan API
  public getLivePlan(): LivePlan {
    const defaultPlan = this.createInitialPlan();
    return {
      dailyTargetKcal: this.livePlan?.dailyTargetKcal ?? defaultPlan.dailyTargetKcal,
      consumedKcal: this.livePlan?.consumedKcal ?? defaultPlan.consumedKcal,
      remainingKcal: this.livePlan?.remainingKcal ?? defaultPlan.remainingKcal,
      macroTargets: this.livePlan?.macroTargets ?? defaultPlan.macroTargets,
      macroConsumed: this.livePlan?.macroConsumed ?? defaultPlan.macroConsumed,
      plannedItems: Array.isArray(this.livePlan?.plannedItems) ? this.livePlan.plannedItems : defaultPlan.plannedItems,
      lastRecalculated: this.livePlan?.lastRecalculated ?? defaultPlan.lastRecalculated,
      adaptiveNote: this.livePlan?.adaptiveNote ?? defaultPlan.adaptiveNote,
    };
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
