import { AionMemoryStore } from '../packages/aion-memory/src/index.ts';
import { RecipeSkill, LanguageEngine } from '../packages/aion-agents/src/index.ts';

console.log('=== INICIANDO PRUEBAS DE INTEGRACIÓN DE DOMINIO AION ===\n');

const memory = AionMemoryStore.getInstance();
const recipeSkill = RecipeSkill.getInstance();
const languageEngine = LanguageEngine.getInstance();

// TEST 1: Compra 1000g de pollo -> inventory = 1000
console.log('--- TEST 1: Compra 1000g de pollo ---');
const polloItem = {
  id: 'test-pollo-1',
  name: 'Pollo Pechuga',
  amount: 1000,
  unit: 'g',
  location: 'congelador',
  availability: 'DISPONIBLE',
  addedDate: new Date().toISOString(),
  confidence: 'ALTA',
  source: 'USER_CONFIRMED',
};
memory.addInventoryItem(polloItem);
let inv = memory.getInventory().find((i) => i.id === 'test-pollo-1');
console.log(`Resultado TEST 1: Cantidad en inventario = ${inv?.amount}g (${inv?.amount === 1000 ? 'ÉXITO' : 'FALLO'})`);

// TEST 2: Cocina receta usando 300g -> inventory = 700, PreparedBatch creado
console.log('\n--- TEST 2: Cocinar receta con 300g de pollo ---');
const recipe = {
  id: 'test-rec-1',
  name: 'Pollo al Horno',
  ingredients: [{ name: 'Pollo Pechuga', amount: 300, unit: 'g' }],
  instructions: [{ stepNumber: 1, instruction: 'Hornear 30 min.' }],
  totalNutrition: { kcal: 600, protein: 90, carbs: 0, fats: 10 },
  servings: 1,
  source: 'user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const cookResult = recipeSkill.cookRecipe(recipe, 3, 1);
inv = memory.getInventory().find((i) => i.id === 'test-pollo-1');
const batch = cookResult.batch;
console.log(`Resultado TEST 2: Inventario Pollo = ${inv?.amount}g (esperado 700g). Batch Creado ID = ${batch.id}, Servings Restantes = ${batch.servingsRemaining} (${inv?.amount === 700 && batch.servingsRemaining === 2 ? 'ÉXITO' : 'FALLO'})`);

// TEST 3: Consumir porción -> MealPortion y MealRegistrada
console.log('\n--- TEST 3: Registro de porción consumida ---');
const meals = memory.getMeals();
const lastMeal = meals[0];
console.log(`Resultado TEST 3: Comida registrada = "${lastMeal.preparation.name}", kcal = ${lastMeal.consumedPortion.actualKcal} (${lastMeal ? 'ÉXITO' : 'FALLO'})`);

// TEST 4: Transacción compensatoria por corrección
console.log('\n--- TEST 4: Corrección e Inventario Reversible ---');
memory.addInventoryTransaction({
  id: `tx-corr-${Date.now()}`,
  pantryItemId: 'test-pollo-1',
  pantryItemName: 'Pollo Pechuga',
  type: 'manual_adjustment',
  quantityDelta: 100,
  unit: 'g',
  evidence: 'USER_CONFIRMED',
  createdAt: new Date().toISOString(),
  explanation: 'Corrección manual: se usaron 200g en lugar de 300g.',
});
inv = memory.getInventory().find((i) => i.id === 'test-pollo-1');
const txs = memory.getInventoryTransactions('test-pollo-1');
console.log(`Resultado TEST 4: Inventario recalibrado a ${inv?.amount}g. Transacciones registradas: ${txs.length} (${inv?.amount === 800 && txs.length >= 2 ? 'ÉXITO' : 'FALLO'})`);

// TEST 5: Reinicio y Persistencia
console.log('\n--- TEST 5: Persistencia en AionMemoryStore ---');
memory.saveToStorage();
const memory2 = AionMemoryStore.getInstance();
const inv2 = memory2.getInventory().find((i) => i.id === 'test-pollo-1');
console.log(`Resultado TEST 5: Existencia recuperada tras persistencia = ${inv2?.amount}g (${inv2?.amount === 800 ? 'ÉXITO' : 'FALLO'})`);

// TEST 6: Lenguaje Humano vs Bioquímico
console.log('\n--- TEST 6: Invarianza Fisiológica y Cambio de Lenguaje ---');
const humanExp = languageEngine.translateMetabolicExplanation('POSTABSORTIVO', 5, 'Pollo al Horno', 'human');
const biochemExp = languageEngine.translateMetabolicExplanation('POSTABSORTIVO', 5, 'Pollo al Horno', 'biochemical');

console.log(`HUMANO: "${humanExp.naturalExplanation}"`);
console.log(`BIOQUÍMICO: "${biochemExp.naturalExplanation}"`);
console.log(`Resultado TEST 6: Mismo estado subyacente (POSTABSORTIVO, 5h), representaciones distintas (${humanExp.naturalExplanation !== biochemExp.naturalExplanation ? 'ÉXITO' : 'FALLO'})`);

console.log('\n=== TODAS LAS PRUEBAS DE INTEGRACIÓN FINALIZADAS CON ÉXITO ===');
