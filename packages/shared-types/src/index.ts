// Tipos de Certeza y Procedencia de Datos en AION Memory
export type CertaintyLevel =
  | 'observed_event'
  | 'user_informed'
  | 'estimate'
  | 'inference'
  | 'detected_pattern'
  | 'preference'
  | 'habit'
  | 'user_confirmed'
  | 'user_corrected'
  | 'recommendation';

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
  source: 'usuario' | 'foto' | 'calculo' | 'estimacion';
}

export interface Preparation {
  id: string;
  name: string;
  ingredients: IngredientItem[];
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
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

// Estados Metabólicos
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
  source: CertaintyLevel;
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
  category: 'MEJOR OPCIÓN' | 'MÁS RÁPIDA' | 'MÁS SACIANTE';
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

// AION Event Architecture
export interface AionEvent<T = any> {
  eventId: string;
  eventType: string; // ej. "aion.aegis.nutrition.meal.logged"
  publisherApp: string; // "aion-aegis"
  timestamp: string;
  payload: T;
  certainty: CertaintyLevel;
}
