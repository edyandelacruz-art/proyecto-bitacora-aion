// Contratos Base Ecosistema AION - Modelo Universal de Certeza & Perfiles

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
  createdAt: string; // ISO 8601
  lastConfirmedAt?: string;
  confidence?: number; // 0.0 - 1.0
  scope: 'core' | 'aegis' | string;
  sensitive?: boolean;
  expiresAt?: string;
  userEditable: boolean;
}

// Perfil Transversal AION Core
export interface AionUserProfile {
  displayName?: string;
  language: string; // ej. 'es'
  country?: string; // ej. 'Colombia'
  region?: string; // ej. 'Cundinamarca'
  city?: string; // ej. 'Bogotá'
  timezone: string; // ej. 'America/Bogota'
  locale: string; // ej. 'es-CO'
  currency?: string; // ej. 'COP'
  unitSystem: 'metric' | 'imperial';
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
}

// Perfil Especializado AION Aegis
export interface NutritionGoal {
  type: 'deficit' | 'maintenance' | 'surplus' | 'health';
  targetKcal?: number;
  targetProteinG?: number;
}

export interface MealWindow {
  name: string; // ej. 'Desayuno', 'Almuerzo'
  startHour: string; // ej. '08:00'
  endHour: string; // ej. '10:00'
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

// Estructura de Alimentos e Ingredientes
export interface IngredientItem {
  id: string;
  name: string;
  amountPreparation: number;
  amountConsumed: number;
  unit: string;
  gramsEstimated?: number;
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
  fractionText: string; // ej. "1/5 de la preparación"
  fractionValue: number; // ej. 0.20
  consumedItems: IngredientItem[];
  actualKcal: number;
  actualProtein: number;
  actualCarbs: number;
  actualFats: number;
}

export interface MealRecord {
  id: string;
  timestamp: string; // ISO 8601
  mealType: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack';
  imageUrl?: string;
  preparation: Preparation;
  consumedPortion: ConsumedPortion;
  confidence: 'ALTA' | 'MEDIA' | 'BAJA';
  evidenceSummary: string;
  evidenceLevel: EvidenceLevel;
  userConfirmed: boolean;
}

// Balance Energético
export type EnergyBalanceState = 'DÉFICIT' | 'MANTENIMIENTO' | 'SUPERÁVIT';

export interface EnergyBalance {
  state: EnergyBalanceState;
  targetKcal: number;
  consumedKcal: number;
  burnedKcal: number;
  remainingKcal: number;
  trend: 'estable' | 'en_progreso' | 'excedido';
}

// Estados Metabólicos Fisiológicos
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

// Timeline Metabólico
export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  type: 'meal' | 'metabolic_transition' | 'activity' | 'hydration';
  details?: string;
}

// Inventario / Despensa Inteligente
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

// Motor de Recetas Contextuales
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

// Plan Vivo Alimentario
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

// Eventos Versionados AION Protocol
export interface AionEvent<T = any> {
  eventId: string;
  eventType: string; // ej. "aion.aegis.nutrition.meal.logged"
  appId: string; // "aion-aegis" o "aion-core"
  userId: string;
  occurredAt: string; // ISO 8601
  payload: T;
  confidence?: number;
  provenance?: string;
  sensitivity?: 'normal' | 'sensitive';
  schemaVersion: string; // "1.0.0"
}
