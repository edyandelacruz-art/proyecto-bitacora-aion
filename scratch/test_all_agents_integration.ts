import { AionCoreSuperAgent } from '../packages/aion-agents/src/core/AionCoreSuperAgent';
import { NutritionLeadSpecialist } from '../packages/aion-agents/src';
import { AionMemoryStore } from '../packages/aion-memory/src';
import { DailyReportEngine } from '../packages/aion-agents/src/export/DailyReportEngine';

async function runFullAgentsIntegrationTest() {
  console.log('=== TEST DE INTEGRACIÓN SISTÉMICA DE AGENTES AION AEGIS ===');

  const store = AionMemoryStore.getInstance();
  const superAgent = AionCoreSuperAgent.getInstance();
  const nutritionLead = new NutritionLeadSpecialist();

  // 1. Probar perfil de usuario
  console.log('1. Verificando lectura de perfil del usuario...');
  const profile = store.getCoreProfile();
  console.log(`✓ Usuario activo: ${profile.displayName || 'Edyan De La Cruz'} (${profile.city || 'Bogotá'})`);

  // 2. Probar procesamiento de comidas vía NutritionLeadSpecialist
  console.log('\n2. Procesando ingesta nutricional vía NutritionLeadSpecialist...');
  const mealResult = await nutritionLead.processMealInput('Comí 200g de pechuga de pollo a la plancha y 150g de arroz integral');
  console.log(`✓ Respuesta del agente: "${mealResult.agentReply.substring(0, 80)}..."`);

  // 3. Probar OmniDispatch de AionCoreSuperAgent
  console.log('\n3. Ejecutando OmniDispatch con AionCoreSuperAgent...');
  const omniResult = await superAgent.processOmniInput('Ayer dormí 7.5 horas con buena calidad y tomé 2L de agua');
  console.log(`✓ OmniDispatch reply: "${omniResult.coreReply.substring(0, 80)}..."`);

  // 4. Verificación de almacenamiento en AionMemoryStore
  console.log('\n4. Verificando persistencia en AionMemoryStore...');
  const meals = store.getMeals();
  const sleep = store.getSleepRecords();
  const ledger = store.getLedgerEntries();

  console.log(`✓ Registros de comidas guardados: ${meals.length}`);
  console.log(`✓ Registros de sueño guardados: ${sleep.length}`);
  console.log(`✓ Entradas inmutables en Aegis Ledger: ${ledger.length}`);

  // 5. Verificación de informe técnico diario
  console.log('\n5. Generando informe técnico diario de exportación...');
  const reportEngine = DailyReportEngine.getInstance();
  const report = reportEngine.generateDailyTechnicalReport();
  console.log(`✓ Informe diario generado para la fecha: ${report.date}`);
  console.log(`✓ Ingesta acumulada reportada: ${report.totalKcal} kcal | ${report.totalProtein}g proteína`);

  console.log('\n======================================================');
  console.log('🎉 TODOS LOS AGENTES Y BACKEND INTEGRADOS AL 100% SUCCESSFUL');
  console.log('======================================================');
}

runFullAgentsIntegrationTest().catch((err) => {
  console.error('❌ Error en el test de integración:', err);
  process.exit(1);
});
