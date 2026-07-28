// AION AEGIS - CONTRATOS DE DOMINIO CANÓNICOS UNIVERSALES
// Especificación máster normada según AION_AEGIS_MASTER_BLUEPRINT.md

export type EvidenceLevel =
  | 'MEASURED'
  | 'USER_CONFIRMED'
  | 'DEVICE_REPORTED'
  | 'DOCUMENT_PARSED_HIGH'
  | 'DOCUMENT_PARSED_MEDIUM'
  | 'VISUAL_ESTIMATE_HIGH'
  | 'VISUAL_ESTIMATE_MEDIUM'
  | 'TEXT_INFERRED_HIGH'
  | 'TEXT_INFERRED_MEDIUM'
  | 'DETERMINISTIC_CALCULATION'
  | 'MODEL_ESTIMATE'
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

// ----------------------------------------------------------------------
// AGENT RUNTIME & SUPERVISORS
// ----------------------------------------------------------------------
export type AgentDomain =
  | 'NUTRITION'
  | 'METABOLISM'
  | 'SLEEP'
  | 'ACTIVITY'
  | 'HYDRATION'
  | 'STATE'
  | 'MEDICATION'
  | 'SYMPTOMS'
  | 'BODY'
  | 'HABITS'
  | 'INVENTORY_HOME'
  | 'LIVE_PLAN'
  | 'CROSS_DOMAIN';

export type ConfirmationPolicy = 'ALWAYS_ASK' | 'ASK_IF_LOW_CONFIDENCE' | 'SILENT_AUTO' | 'NEVER_EXECUTE';

export interface AgentMetadata {
  agentId: string;
  name: string;
  role: string;
  domain: AgentDomain;
  capabilities: string[];
  acceptedInputs: string[];
  producedOutputs: string[];
  tools: string[];
  memoryScope: string;
  writePermissions: string[];
  readPermissions: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confirmationPolicy: ConfirmationPolicy;
  confidencePolicy: number;
  version: string;
  status: 'ACTIVE' | 'PAUSED' | 'DEPRECATED';
}

export interface AgentInvocationResult<T = any> {
  invocationId: string;
  agentId: string;
  timestamp: string;
  success: boolean;
  output?: T;
  error?: string;
  confidence: number;
  evidence: EvidenceLevel;
  executionTimeMs: number;
  toolsUsed: string[];
  reasoningSummary: string;
}

// ----------------------------------------------------------------------
// SATELLITE MODULES & UI ARCHITECTURE CONTRACTS
// ----------------------------------------------------------------------
export type SatelliteModuleVisibility = 'pinned' | 'minimized' | 'hidden' | 'normal';

export interface SatelliteModuleConfig {
  moduleId: string;
  title: string;
  category: 'Mi Estado' | 'Cuidado Diario' | 'Alimentación & Hogar' | 'Planificación' | 'Información' | 'Sistema';
  visibility: SatelliteModuleVisibility;
  order: number;
}

// ----------------------------------------------------------------------
// 1. NUTRITION / ALIMENTACIÓN & VISION TYPES
// ----------------------------------------------------------------------
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
  unit: string;
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
  notes?: string;
}

// ----------------------------------------------------------------------
// RECETAS & LOTES PREPARADOS
// ----------------------------------------------------------------------
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

// ----------------------------------------------------------------------
// 2. METABOLISM & PHYSIOLOGY
// ----------------------------------------------------------------------
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
  confidence: number;
  evidenceLevel: EvidenceLevel;
}

// ----------------------------------------------------------------------
// 3. SLEEP & RECOVERY / SUEÑO
// ----------------------------------------------------------------------
export interface SleepRecord {
  id: string;
  date: string;
  sleepStart: string;
  sleepEnd: string;
  hoursInBed: number;
  subjectiveQualityScore: number;
  awakeningsCount: number;
  remHoursEstimated?: number;
  deepHoursEstimated?: number;
  daytimeSleepinessScore: number;
  nightScreensUse: boolean;
  preBedRoutine?: string;
  sleepAidUsed?: string;
  source: 'USER_REPORTED' | 'WEARABLE_SYNC' | 'AGENT_INFERRED';
  evidenceLevel: EvidenceLevel;
  notes?: string;
}

// ----------------------------------------------------------------------
// 4. ACTIVITY & EXERCISE / ACTIVIDAD
// ----------------------------------------------------------------------
export interface ActivityRecord {
  id: string;
  timestamp: string;
  activityName: string;
  activityType: 'caminata' | 'trote' | 'gimnasio' | 'movilidad' | 'deporte' | 'otro';
  durationMinutes: number;
  intensity: 'baja' | 'moderada' | 'alta' | 'vigorosa';
  rpeScore: number;
  estimatedKcalBurned: number;
  painBeforeScore?: number;
  painAfterScore?: number;
  targetBodyZone?: string;
  source: 'USER_REPORTED' | 'WEARABLE_SYNC' | 'ESTIMATED';
  evidenceLevel: EvidenceLevel;
  notes?: string;
}

// ----------------------------------------------------------------------
// 5. HYDRATION / HIDRATACIÓN
// ----------------------------------------------------------------------
export interface HydrationRecord {
  id: string;
  timestamp: string;
  amountMl: number;
  fluidType: 'agua' | 'cafe' | 'te' | 'electrolitos' | 'infusion' | 'otro';
  dailyAccumulatedMl: number;
  dailyGoalMl: number;
  evidenceLevel: EvidenceLevel;
}

// ----------------------------------------------------------------------
// 6. ENERGY, MOOD & FOCUS / ENERGÍA & ÁNIMO
// ----------------------------------------------------------------------
export interface StateRecord {
  id: string;
  timestamp: string;
  energyScore: number;
  moodScore: number;
  hungerScore: number;
  anxietyScore: number;
  focusScore: number;
  irritabilityScore: number;
  mentalLoadScore: number;
  contextNotes?: string;
  evidenceLevel: EvidenceLevel;
}

// ----------------------------------------------------------------------
// 7. MEDICATION & SUPPLEMENTS / MEDICACIÓN
// ----------------------------------------------------------------------
export interface MedicationRecord {
  id: string;
  timestamp: string;
  name: string;
  dose: string;
  reason: string;
  taken: boolean;
  perceivedEffect?: string;
  reportedSideEffect?: string;
  prescribedByDoctor: boolean;
  reminderEnabled: boolean;
  evidenceLevel: EvidenceLevel;
  notes?: string;
}

// ----------------------------------------------------------------------
// 8. SYMPTOMS & PAIN / SÍNTOMAS & DOLOR
// ----------------------------------------------------------------------
export interface SymptomRecord {
  id: string;
  timestamp: string;
  bodyZone: string;
  intensityScore: number;
  painType: 'punzante' | 'sordo' | 'opresivo' | 'ardor' | 'rigidez' | 'otro';
  triggerContext?: string;
  aggravatingMovement?: string;
  durationMinutes?: number;
  medicationUsed?: string;
  improvementObserved?: string;
  isRedFlagAlert: boolean;
  evidenceLevel: EvidenceLevel;
  notes?: string;
}

// ----------------------------------------------------------------------
// 9. BODY MEASUREMENTS / PESO & CUERPO
// ----------------------------------------------------------------------
export interface BodyMeasurementRecord {
  id: string;
  date: string;
  weightKg: number;
  waistCm?: number;
  neckCm?: number;
  hipCm?: number;
  bmiCalculated: number;
  weightChangeVsPreviousKg?: number;
  bodyFatPctEstimated?: number;
  source: 'USER_REPORTED' | 'SCALE_DEVICE' | 'AGENT_INFERRED';
  evidenceLevel: EvidenceLevel;
  notes?: string;
}

// ----------------------------------------------------------------------
// 10. HABITS & ROUTINES / HÁBITOS
// ----------------------------------------------------------------------
export interface HabitRecord {
  id: string;
  date: string;
  waterTargetMet: boolean;
  stepsCount?: number;
  sunlightExposureMin?: number;
  mobilitySessionDone: boolean;
  homeCookedMealsCount: number;
  fastingFulfilled: boolean;
  petWalkDone: boolean;
  nightScreenCurfewMet: boolean;
  overallAdherenceScore: number;
  evidenceLevel: EvidenceLevel;
  notes?: string;
}

// ----------------------------------------------------------------------
// 11. PANTRY & HOME INVENTORY / DESPENSA & HOGAR
// ----------------------------------------------------------------------
export type InventoryAvailability = 'DISPONIBLE' | 'BAJO' | 'AGOTADO' | 'PRÓXIMO A VENCER';

export interface InventoryItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  location?: 'refrigerador' | 'despensa' | 'congelador';
  category?: 'Proteínas' | 'Embutidos' | 'Lácteos' | 'Granos' | 'Vegetales' | 'Condimentos' | 'Hogar';
  availability: InventoryAvailability;
  addedDate: string;
  expirationDate?: string;
  kcalPerUnit?: number;
  confidence: 'ALTA' | 'MEDIA' | 'BAJA';
  source: EvidenceLevel;
}

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

export interface PurchaseReceiptRecord {
  id: string;
  timestamp: string;
  merchantName: string;
  totalValueCop: number;
  paymentMethod: string;
  itemsPurchased: { name: string; category: string; amount: number; unit: string; unitPriceCop?: number }[];
  receiptImageUrl?: string;
  enteredIntoInventory: boolean;
  evidenceLevel: EvidenceLevel;
}

// ----------------------------------------------------------------------
// 12. LIVE PLAN & REPLANNING / PLAN VIVO
// ----------------------------------------------------------------------
export interface PlanItem {
  id: string;
  scheduledTime: string;
  title: string;
  description: string;
  moduleOwner: AgentDomain;
  status: 'PENDIENTE' | 'COMPLETADO' | 'REPROGRAMADO' | 'OMITIDO';
  priority: 'ALTA' | 'MEDIA' | 'BAJA';
  targetGoal?: string;
  assignedAgent?: string;
  notes?: string;
}

export interface LivePlan {
  dailyTargetKcal: number;
  consumedKcal: number;
  remainingKcal: number;
  macroTargets: { protein: number; carbs: number; fats: number };
  macroConsumed: { protein: number; carbs: number; fats: number };
  plannedItems: PlanItem[];
  lastRecalculated: string;
  adaptiveNote: string;
}

// ----------------------------------------------------------------------
// UNIVERSAL AEGIS LEDGER & AUDIT TRAIL
// ----------------------------------------------------------------------
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
    | 'sleep_logged'
    | 'activity_logged'
    | 'hydration_logged'
    | 'state_logged'
    | 'medication_logged'
    | 'symptom_logged'
    | 'body_measurement_logged'
    | 'habit_logged'
    | 'plan_changed'
    | 'recommendation'
    | 'correction'
    | 'report_generated'
    | 'drive_synced';
  source: 'user' | 'vision' | 'recipe' | 'calculation' | 'integration' | 'agent';
  authoritativeModule?: AgentDomain;
  agentsInvoked?: string[];
  toolsInvoked?: string[];
  payload: any;
  evidence: EvidenceLevel;
  confidence?: number;
  relatedEntityIds?: string[];
  reversible?: boolean;
  correctedBy?: string;
}

// ----------------------------------------------------------------------
// INTEGRACIONES & EXPORTACIONES
// ----------------------------------------------------------------------
export interface GoogleDriveIntegration {
  connected: boolean;
  userEmail?: string;
  lastSyncedAt?: string;
  autoSyncEnabled: boolean;
}

export interface AionReportTemplate {
  id: string;
  name: string;
  type: 'daily_technical' | 'food_matrix' | 'weekly_summary' | 'full_workbook';
  format: 'xlsx' | 'pdf' | 'docx' | 'json' | 'csv';
  customFields?: string[];
}

export interface DailyTechnicalReport {
  id: string;
  date: string;
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

export interface EnergyBalance {
  state: 'DÉFICIT' | 'MANTENIMIENTO' | 'SUPERÁVIT';
  targetKcal: number;
  consumedKcal: number;
  burnedKcal: number;
  remainingKcal: number;
  trend: 'estable' | 'en_progreso' | 'excedido';
}

export interface ResponseLanguageProfile {
  mode: 'adaptive' | 'human' | 'simple' | 'technical' | 'biochemical' | 'clinical';
  verbosity: 'brief' | 'balanced' | 'detailed';
  explainUnknownTerms: boolean;
  preferredTone?: 'neutral' | 'friendly' | 'direct' | 'custom';
}

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
  languageProfile?: ResponseLanguageProfile;
  driveIntegration?: GoogleDriveIntegration;
}

export interface AegisProfile {
  goals?: { type: string; targetKcal?: number; targetProteinG?: number }[];
  preferredEatingPattern?: string[];
  allergies?: string[];
  intolerances?: string[];
  dislikedFoods?: string[];
  preferredFoods?: string[];
  typicalPrepTimeMinutes?: number;
  householdSize?: number;
  optionalBodyMetrics?: { weightKg?: number; heightCm?: number; age?: number; sex?: 'M' | 'F' | 'other' };
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
  schemaVersion: string;
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
