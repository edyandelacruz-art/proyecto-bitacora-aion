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
const STORAGE_KEY_FINANCE_CONFIG = 'aion_memory_finance_config';

export interface FinancialProjectionRow {
  month: string;
  projectedIncomeCop: number;
  fixedExpensesCop: number;
  variableExpensesCop: number;
  savingsCop: number;
  netBalanceCop: number;
}

export interface FinanceConfig {
  monthlyBudgetCop: number;
  categoryBudgets: Record<string, number>;
  projections: FinancialProjectionRow[];
}

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

  private sleepRecords: SleepRecord[] = [];
  private activityRecords: ActivityRecord[] = [];
  private hydrationRecords: HydrationRecord[] = [];
  private stateRecords: StateRecord[] = [];
  private medicationRecords: MedicationRecord[] = [];
  private symptomRecords: SymptomRecord[] = [];
  private bodyRecords: BodyMeasurementRecord[] = [];
  private habitRecords: HabitRecord[] = [];
  private receiptRecords: PurchaseReceiptRecord[] = [];

  private financeConfig: FinanceConfig;

  private constructor() {
    this.coreProfile = this.createDefaultCoreProfile();
    this.aegisProfile = this.createDefaultAegisProfile();
    this.livePlan = this.createInitialPlan();
    this.financeConfig = this.createDefaultFinanceConfig();
    this.loadFromStorage();
  }

  public static getInstance(): AionMemoryStore {
    if (!AionMemoryStore.instance) {
      AionMemoryStore.instance = new AionMemoryStore();
    }
    return AionMemoryStore.instance;
  }

  private createDefaultFinanceConfig(): FinanceConfig {
    return {
      monthlyBudgetCop: 2500000,
      categoryBudgets: {
        Alimentos: 800000,
        Salud: 400000,
        Suplementos: 300000,
        Vivienda: 600000,
        General: 400000,
      },
      projections: [
        { month: 'Enero', projectedIncomeCop: 4500000, fixedExpensesCop: 2100000, variableExpensesCop: 800000, savingsCop: 1600000, netBalanceCop: 1600000 },
        { month: 'Febrero', projectedIncomeCop: 4500000, fixedExpensesCop: 2100000, variableExpensesCop: 750000, savingsCop: 1650000, netBalanceCop: 3250000 },
        { month: 'Marzo', projectedIncomeCop: 4800000, fixedExpensesCop: 2100000, variableExpensesCop: 900000, savingsCop: 1800000, netBalanceCop: 5050000 },
        { month: 'Abril', projectedIncomeCop: 4500000, fixedExpensesCop: 2100000, variableExpensesCop: 700000, savingsCop: 1700000, netBalanceCop: 6750000 },
        { month: 'Mayo', projectedIncomeCop: 5000000, fixedExpensesCop: 2100000, variableExpensesCop: 850000, savingsCop: 2050000, netBalanceCop: 8800000 },
        { month: 'Junio', projectedIncomeCop: 4500000, fixedExpensesCop: 2100000, variableExpensesCop: 800000, savingsCop: 1600000, netBalanceCop: 10400000 },
      ],
    };
  }

  public getFinanceConfig(): FinanceConfig {
    return { ...this.financeConfig };
  }

  public setFinanceConfig(config: Partial<FinanceConfig>): void {
    this.financeConfig = { ...this.financeConfig, ...config };
    this.saveToStorage();
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
    this.financeConfig = this.createDefaultFinanceConfig();
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
      goals: [
        {
          type: 'hypertrophy',
          targetKcal: 2100,
          targetProteinG: 160,
        } as any,
      ],
      medicalContext: {
        diagnoses: [],
        allergies: [],
        prescribedMeds: [],
        notes: 'Soberano AION Aegis Active',
      },
    } as AegisProfile;
  }

  private createInitialPlan(): LivePlan {
    return {
      id: 'plan_initial',
      currentKcal: 850,
      targetKcal: 2100,
      macroConsumed: { protein: 90, carbs: 75, fats: 25 },
      macroTargets: { protein: 160, carbs: 180, fats: 60 },
      scheduledBlocks: [
        { id: 'sb_1', startTime: '07:30', title: 'Desayuno Proteico', status: 'DONE' },
        { id: 'sb_2', startTime: '13:00', title: 'Almuerzo Metabólico', status: 'PENDING' },
        { id: 'sb_3', startTime: '17:30', title: 'Sesión Gimnasio Zona 4', status: 'PENDING' },
        { id: 'sb_4', startTime: '20:00', title: 'Cena Ligera & Descanso', status: 'PENDING' },
      ],
    } as any;
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      const m = localStorage.getItem(STORAGE_KEY_MEALS);
      if (m) this.meals = JSON.parse(m);

      const inv = localStorage.getItem(STORAGE_KEY_INVENTORY);
      if (inv) this.inventory = JSON.parse(inv);

      const plan = localStorage.getItem(STORAGE_KEY_PLAN);
      if (plan) this.livePlan = JSON.parse(plan);

      const cp = localStorage.getItem(STORAGE_KEY_CORE_PROFILE);
      if (cp) this.coreProfile = JSON.parse(cp);

      const ap = localStorage.getItem(STORAGE_KEY_AEGIS_PROFILE);
      if (ap) this.aegisProfile = JSON.parse(ap);

      const f = localStorage.getItem(STORAGE_KEY_FACTS);
      if (f) this.facts = JSON.parse(f);

      const l = localStorage.getItem(STORAGE_KEY_LEDGER);
      if (l) this.ledger = JSON.parse(l);

      const t = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (t) this.transactions = JSON.parse(t);

      const sl = localStorage.getItem(STORAGE_KEY_SLEEP);
      if (sl) this.sleepRecords = JSON.parse(sl);

      const ac = localStorage.getItem(STORAGE_KEY_ACTIVITY);
      if (ac) this.activityRecords = JSON.parse(ac);

      const hy = localStorage.getItem(STORAGE_KEY_HYDRATION);
      if (hy) this.hydrationRecords = JSON.parse(hy);

      const st = localStorage.getItem(STORAGE_KEY_STATE);
      if (st) this.stateRecords = JSON.parse(st);

      const med = localStorage.getItem(STORAGE_KEY_MEDICATION);
      if (med) this.medicationRecords = JSON.parse(med);

      const sym = localStorage.getItem(STORAGE_KEY_SYMPTOMS);
      if (sym) this.symptomRecords = JSON.parse(sym);

      const bod = localStorage.getItem(STORAGE_KEY_BODY);
      if (bod) this.bodyRecords = JSON.parse(bod);

      const hab = localStorage.getItem(STORAGE_KEY_HABITS);
      if (hab) this.habitRecords = JSON.parse(hab);

      const fin = localStorage.getItem(STORAGE_KEY_FINANCE_CONFIG);
      if (fin) this.financeConfig = JSON.parse(fin);
    } catch (e) {
      console.error('Error cargando AionMemoryStore:', e);
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      localStorage.setItem(STORAGE_KEY_MEALS, JSON.stringify(this.meals));
      localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(this.inventory));
      localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(this.livePlan));
      localStorage.setItem(STORAGE_KEY_CORE_PROFILE, JSON.stringify(this.coreProfile));
      localStorage.setItem(STORAGE_KEY_AEGIS_PROFILE, JSON.stringify(this.aegisProfile));
      localStorage.setItem(STORAGE_KEY_FACTS, JSON.stringify(this.facts));
      localStorage.setItem(STORAGE_KEY_LEDGER, JSON.stringify(this.ledger));
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(this.transactions));
      localStorage.setItem(STORAGE_KEY_SLEEP, JSON.stringify(this.sleepRecords));
      localStorage.setItem(STORAGE_KEY_ACTIVITY, JSON.stringify(this.activityRecords));
      localStorage.setItem(STORAGE_KEY_HYDRATION, JSON.stringify(this.hydrationRecords));
      localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(this.stateRecords));
      localStorage.setItem(STORAGE_KEY_MEDICATION, JSON.stringify(this.medicationRecords));
      localStorage.setItem(STORAGE_KEY_SYMPTOMS, JSON.stringify(this.symptomRecords));
      localStorage.setItem(STORAGE_KEY_BODY, JSON.stringify(this.bodyRecords));
      localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(this.habitRecords));
      localStorage.setItem(STORAGE_KEY_FINANCE_CONFIG, JSON.stringify(this.financeConfig));
    } catch (e) {
      console.error('Error guardando AionMemoryStore:', e);
    }
  }

  // Getters & Mutadores Completos
  public getMeals(): MealRecord[] { return [...this.meals]; }
  public addMeal(meal: MealRecord): void { this.meals.unshift(meal); this.saveToStorage(); }
  
  public getInventory(): InventoryItem[] { return [...this.inventory]; }
  public setInventory(items: InventoryItem[]): void { this.inventory = items; this.saveToStorage(); }
  public addInventoryItem(item: InventoryItem): void { this.inventory.unshift(item); this.saveToStorage(); }
  public updateInventoryItem(id: string, update: Partial<InventoryItem>): void {
    this.inventory = this.inventory.map(i => i.id === id ? { ...i, ...update } : i);
    this.saveToStorage();
  }

  public getLivePlan(): LivePlan { return { ...this.livePlan }; }
  public setLivePlan(plan: LivePlan): void { this.livePlan = plan; this.saveToStorage(); }
  
  public getCoreProfile(): AionUserProfile { return { ...this.coreProfile }; }
  public setCoreProfile(profile: AionUserProfile): void { this.coreProfile = profile; this.saveToStorage(); }
  public updateCoreProfile(update: Partial<AionUserProfile>): void {
    this.coreProfile = { ...this.coreProfile, ...update };
    this.saveToStorage();
  }
  public setLanguageMode(mode: any): void {
    this.coreProfile.languageProfile.mode = mode;
    this.saveToStorage();
  }

  public getAegisProfile(): AegisProfile { return { ...this.aegisProfile }; }
  public setAegisProfile(profile: AegisProfile): void { this.aegisProfile = profile; this.saveToStorage(); }
  public updateAegisProfile(update: Partial<AegisProfile>): void {
    this.aegisProfile = { ...this.aegisProfile, ...update };
    this.saveToStorage();
  }

  public getFacts(): MemoryFact[] { return [...this.facts]; }
  public addFact(fact: MemoryFact): void { this.facts.unshift(fact); this.saveToStorage(); }
  
  public getLedgerEntries(): AegisLedgerEntry[] { return [...this.ledger]; }
  public addLedgerEntry(entry: AegisLedgerEntry): void { this.ledger.unshift(entry); this.saveToStorage(); }
  
  public getInventoryTransactions(filter?: any): InventoryTransaction[] { return [...this.transactions]; }
  public addInventoryTransaction(tx: InventoryTransaction): void { this.transactions.unshift(tx); this.saveToStorage(); }

  public getRecipes(): Recipe[] { return [...this.recipes]; }
  public getPreparedBatches(): PreparedBatch[] { return [...this.preparedBatches]; }
  public addPreparedBatch(batch: PreparedBatch): void { this.preparedBatches.unshift(batch); this.saveToStorage(); }

  public getSleepRecords(): SleepRecord[] { return [...this.sleepRecords]; }
  public addSleepRecord(record: SleepRecord): void { this.sleepRecords.unshift(record); this.saveToStorage(); }
  
  public getActivityRecords(): ActivityRecord[] { return [...this.activityRecords]; }
  public addActivityRecord(record: ActivityRecord): void { this.activityRecords.unshift(record); this.saveToStorage(); }
  
  public getHydrationRecords(): HydrationRecord[] { return [...this.hydrationRecords]; }
  public addHydrationRecord(record: HydrationRecord): void { this.hydrationRecords.unshift(record); this.saveToStorage(); }

  public getStateRecords(): StateRecord[] { return [...this.stateRecords]; }
  public addStateRecord(record: StateRecord): void { this.stateRecords.unshift(record); this.saveToStorage(); }

  public getMedicationRecords(): MedicationRecord[] { return [...this.medicationRecords]; }
  public addMedicationRecord(record: MedicationRecord): void { this.medicationRecords.unshift(record); this.saveToStorage(); }

  public getSymptomRecords(): SymptomRecord[] { return [...this.symptomRecords]; }
  public addSymptomRecord(record: SymptomRecord): void { this.symptomRecords.unshift(record); this.saveToStorage(); }

  public getBodyRecords(): BodyMeasurementRecord[] { return [...this.bodyRecords]; }
  public addBodyRecord(record: BodyMeasurementRecord): void { this.bodyRecords.unshift(record); this.saveToStorage(); }

  public getHabitRecords(): HabitRecord[] { return [...this.habitRecords]; }
  public addHabitRecord(record: HabitRecord): void { this.habitRecords.unshift(record); this.saveToStorage(); }
}
