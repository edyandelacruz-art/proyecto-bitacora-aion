// Contratos Base Ecosistema AION - Modelo Universal de Certeza, Perfiles, Lenguaje, Drive & Informes

export type EvidenceLevel =
  | 'USER_CONFIRMED'
  | 'SENSOR_MEASURED'
  | 'DETERMINISTIC_CALCULATION'
  | 'VISUAL_ESTIMATE_HIGH'
  | 'VISUAL_ESTIMATE_MEDIUM'
  | 'VISUAL_ESTIMATE_LOW'
  | 'AI_INFERENCE'
  | 'UNKNOWN';

export type CertaintyLevel = EvidenceLevel;

export interface MemoryFact<T = any> {
  key: string;
  value: T;
  evidence: EvidenceLevel;
  source: 'user' | 'vision' | 'sensor' | 'calculation' | 'integration' | 'agent';
  createdAt: string;
  lastConfirmedAt?: string;
  confidence?: number;
  scope: 'core' | 'aegis' | string;
  sensitive?: boolean;
  expiresAt?: string;
  userEditable: boolean;
}

// Integración Google Drive & Exportación de Matriz
export interface GoogleDriveIntegration {
  connected: boolean;
  userEmail?: string;
  lastSyncedAt?: string;
  autoSyncEnabled: boolean;
}

// Sistema de Plantillas y Formatos Flexibles de Informes
export interface AionReportTemplate {
  id: string;
  name: string;
  type: 'daily_technical' | 'food_matrix' | 'weekly_summary';
  format: 'json' | 'markdown' | 'pdf' | 'csv';
  customFields?: string[];
}

// Informe Técnico Diario del Día Anterior o Actual
export interface DailyTechnicalReport {
  id: string;
  date: string; // YYYY-MM-DD
  summaryText: string;
  energyBalance: EnergyBalance;
  metabolicTransitionsCount: number;
  mealsLogged: number;
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  inventoryMovementsCount: number;
  agentRecommendations: string[];
  templateId: string;
  driveSyncStatus: 'synced' | 'pending' | 'disabled';
  createdAt: string;
}

// Perfil de Lenguaje Adaptativo
export interface ResponseLanguageProfile {
  mode: 'adaptive' | 'human' | 'simple' | 'technical' | 'biochemical' | 'clinical';
  verbosity: 'brief' | 'balanced' | 'detailed';
  explainUnknownTerms: boolean;
  preferredTone?: 'neutral' | 'friendly' | 'direct' | 'custom';
  customStyleExamples?: string[];
}

// Contexto Ubicación Base vs Ubicación Actual
export interface AionContext {
  baseLocation?: {
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
  };
  currentLocation?: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    source: 'user' | 'device' | 'integration' | 'inference';
    confidence?: number;
    temporary?: boolean;
  };
  currentEnvironment?:
    | 'home'
    | 'work'
    | 'restaurant'
    | 'supermarket'
    | 'travel'
    | 'gym'
    | 'outdoors'
    | 'unknown';
  updatedAt: string;
}

// Perfil Transversal AION Core
export interface AionUserProfile {
  displayName?: string;
  language: string;
  country?: string;
  region?: string;
  city?: string;
  timezone: string;
  locale: string;
  currency?: string;
  unitSystem: 'metric' | 'imperial';
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
  languageProfile?: ResponseLanguageProfile;
  driveIntegration?: GoogleDriveIntegration;
}

// Perfil Especializado AION Aegis
export interface NutritionGoal {
  type: 'deficit' | 'maintenance' | 'surplus' | 'health';
  targetKcal?: number;
  targetProteinG?: number;
}

export interface MealWindow {
  name: string;
  startHour: string;
  endHour: string;
}

export interface AegisProfile {
  goals?: NutritionGoal[];
  preferredEatingPattern?: string[];
  allergies?: string[];
  intolerances?: string[];
  dislikedFoods?: string[];
  preferredFoods?: string[];
  dietaryRestrictions?: string[];
  usualMealWindows?: MealWindow[];
  cookingSkill?: 'low' | 'medium' | 'high';
  cookingEquipment?: string[];
  typicalPrepTimeMinutes?: number;
  householdSize?: number;
  groceryFrequency?: string;
  foodBudget?: { min: number; max: number; currency: string };
  optionalBodyMetrics?: { weightKg?: number; heightCm?: number; age?: number; sex?: 'M' | 'F' | 'other' };
}

// Aegis Ledger Universal
export interface AegisLedgerEntry {
  id: string;
  timestamp: string;
  type:
    | 'meal'
    | 'ingredient_used'
    | 'inventory_added'
    | 'inventory_removed'
    | 'inventory_adjusted'
    | 'recipe_created'
    | 'recipe_cooked'
    | 'portion_consumed'
    | 'food_wasted'
    | 'food_expired'
    | 'activity'
    | 'hydration'
    | 'body_metric'
    | 'plan_change'
    | 'recommendation'
    | 'correction'
    | 'report_generated'
    | 'drive_synced';
  source: 'user' | 'vision' | 'recipe' | 'calculation' | 'integration' | 'agent';
  payload: any;
  evidence: EvidenceLevel;
  confidence?: number;
  relatedEntityIds?: string[];
  reversible?: boolean;
  correctedBy?: string;
}

// Transacciones de Inventario
export interface InventoryTransaction {
  id: string;
  pantryItemId: string;
  pantryItemName: string;
  type:
    | 'purchase'
    | 'manual_add'
    | 'recipe_use'
    | 'meal_use'
    | 'waste'
    | 'expired'
    | 'manual_adjustment'
    | 'visual_adjustment';
  quantityDelta?: number;
  unit?: string;
  quantityRangeDelta?: {
    min: number;
    likely: number;
    max: number;
  };
  evidence: EvidenceLevel;
  confidence?: number;
  createdAt: string;
  relatedMealId?: string;
  relatedRecipeId?: string;
  explanation?: string;
}

// Recetas & Lotes Preparados
export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  durationMinutes?: number;
}

export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
  substitutions?: string[];
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: RecipeIngredient[];
  instructions: RecipeStep[];
  totalNutrition?: { kcal: number; protein: number; carbs: number; fats: number };
  servings: number;
  prepTimeMin?: number;
  cookTimeMin?: number;
  difficulty?: 'easy' | 'medium' | 'advanced';
  equipment?: string[];
  tags?: string[];
  source: 'user' | 'aion_generated' | 'vision' | 'imported';
  createdAt: string;
  updatedAt: string;
}

export interface PreparedBatch {
  id: string;
  recipeId: string;
  recipeName: string;
  preparedAt: string;
  expiresAtEstimate?: string;
  totalServings: number;
  servingsRemaining: number;
  storageLocation: 'refrigerador' | 'congelador' | 'despensa';
}

export interface MealPortion {
  id: string;
  batchId?: string;
  recipeId?: string;
  consumedAt: string;
  servingsConsumed: number;
  actualNutrition: { kcal: number; protein: number; carbs: number; fats: number };
}

// Inteligencia Visual
export type SceneType =
  | 'meal'
  | 'pantry'
  | 'fridge'
  | 'grocery'
  | 'restaurant'
  | 'menu'
  | 'nutrition_label'
  | 'receipt'
  | 'unknown';

export interface VisionPortionRange {
  likely: number;
  min: number;
  max: number;
  unit: 'g' | 'ml' | 'unit' | 'tbsp' | 'cup' | 'portion';
  confidence: number;
  method: string;
}

export interface VisionDetectedItem {
  id: string;
  candidateName: string;
  confidence: number;
  cookingTechnique?: string;
  portionRange?: VisionPortionRange;
  isMaterialAmbiguity?: boolean;
}

export interface VisionQuestion {
  id: string;
  question: string;
  options?: string[];
  materialImpact: 'high' | 'medium' | 'low';
  reason: string;
}

export interface VisionAnalysis {
  id: string;
  imageUrl?: string;
  scene: {
    type: SceneType;
    confidence: number;
  };
  detectedItems: VisionDetectedItem[];
  assumptions: string[];
  unresolvedQuestions: VisionQuestion[];
  evidenceLevel: EvidenceLevel;
  createdAt: string;
}

export interface IngredientItem {
  id: string;
  name: string;
  amountPreparation: number;
  amountConsumed: number;
  unit: string;
  gramsEstimated?: number;
  portionRange?: VisionPortionRange;
  preparationMethod?: string;
  kcal: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams?: number;
  waterMl?: number;
  confidence: 'ALTA' | 'MEDIA' | 'BAJA';
  source: EvidenceLevel;
}

export interface Preparation {
  id: string;
  name: string;
  ingredients: IngredientItem[];
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  totalServingsEstimated?: number;
}

export interface ConsumedPortion {
  fractionText: string;
  fractionValue: number;
  consumedItems: IngredientItem[];
  actualKcal: number;
  actualProtein: number;
  actualCarbs: number;
  actualFats: number;
}

export interface MealRecord {
  id: string;
  timestamp: string;
  mealType: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack';
  imageUrl?: string;
  preparation: Preparation;
  consumedPortion: ConsumedPortion;
  confidence: 'ALTA' | 'MEDIA' | 'BAJA';
  evidenceSummary: string;
  evidenceLevel: EvidenceLevel;
  userConfirmed: boolean;
}

export type EnergyBalanceState = 'DÉFICIT' | 'MANTENIMIENTO' | 'SUPERÁVIT';

export interface EnergyBalance {
  state: EnergyBalanceState;
  targetKcal: number;
  consumedKcal: number;
  burnedKcal: number;
  remainingKcal: number;
  trend: 'estable' | 'en_progreso' | 'excedido';
}

export type MetabolicPhase =
  | 'POSPRANDIAL'
  | 'POSTABSORTIVO'
  | 'AYUNO_INICIAL'
  | 'UTILIZACION_GLUCOGENO'
  | 'OXIDACION_GRASA'
  | 'POSIBLE_CETOSIS'
  | 'NO_ESTIMABLE';

export interface MetabolicState {
  currentPhase: MetabolicPhase;
  phaseTitle: string;
  naturalExplanation: string;
  detailedTechnicalExplanation: string;
  glucoseStatus: string;
  fatsStatus: string;
  proteinsStatus: string;
  glycogenStatus: string;
  fatBurnRate: 'alta' | 'moderada' | 'menor_temporalmente' | 'baja';
  lastMealTime?: string;
  hoursElapsedSinceLastMeal?: number;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  type: 'meal' | 'metabolic_transition' | 'activity' | 'hydration';
  details?: string;
}

export type InventoryAvailability = 'DISPONIBLE' | 'BAJO' | 'AGOTADO' | 'PRÓXIMO A VENCER';

export interface InventoryItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  location?: 'refrigerador' | 'despensa' | 'congelador';
  availability: InventoryAvailability;
  addedDate: string;
  expirationDate?: string;
  kcalPerUnit?: number;
  confidence: 'ALTA' | 'MEDIA' | 'BAJA';
  source: EvidenceLevel;
}

export interface RecipeOption {
  id: string;
  title: string;
  subtitle: string;
  kcal: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  prepTimeMinutes: number;
  reasonToRecommend: string;
  category: 'MEJOR OPCIÓN' | 'MÁS RÁPIDA' | 'MÁS SACIANTE' | 'APROVECHA LO QUE VA A VENCER';
  ingredientsNeeded: { name: string; amount: string; availableInPantry: boolean }[];
  substitutions?: string[];
  steps: string[];
}

export interface LivePlan {
  dailyTargetKcal: number;
  consumedKcal: number;
  remainingKcal: number;
  macroTargets: { protein: number; carbs: number; fats: number };
  macroConsumed: { protein: number; carbs: number; fats: number };
  plannedMeals: { mealType: string; suggestedTime: string; recipeTitle?: string; kcal: number }[];
  lastRecalculated: string;
  adaptiveNote: string;
}

export interface AionEvent<T = any> {
  eventId: string;
  eventType: string;
  appId: string;
  userId: string;
  occurredAt: string;
  payload: T;
  confidence?: number;
  provenance?: string;
  sensitivity?: 'normal' | 'sensitive';
  schemaVersion: string;
}
