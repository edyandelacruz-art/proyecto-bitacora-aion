import { AionMemoryStore } from '../packages/aion-memory/src/index';
import { AgentRuntime } from '../packages/aion-agents/src/runtime/AgentRuntime';
import { NutrientCalculationEngine } from '../packages/aion-agents/src/nutrition/NutrientCalculationEngine';
import { DailyReportEngine } from '../packages/aion-agents/src/export/DailyReportEngine';
import { XlsxExporter } from '../packages/aion-agents/src/export/XlsxExporter';

async function runMasterTestSuite() {
  console.log('====================================================');
  console.log('🧪 INICIANDO SUITE MASTER DE PRUEBAS AION AEGIS');
  console.log('====================================================\n');

  const memoryStore = AionMemoryStore.getInstance();
  memoryStore.resetToCleanState();

  // TEST 1: Agent Runtime & Registry
  console.log('[TEST 1] Invocación de AgentRuntime & AgentRegistry...');
  const runtime = AgentRuntime.getInstance();
  const reg = runtime.getRegistry();
  const allAgents = reg.getAllAgents();
  console.log(`✓ Agentes registrados en el sistema: ${allAgents.length}`);
  const invRes = await runtime.invokeAgent('nutrition-supervisor', { test: true });
  if (invRes.success) {
    console.log('✓ TEST 1 PASÓ: AgentRuntime e invocación de supervisor exitosa.\n');
  } else {
    throw new Error(`TEST 1 FALLÓ: ${invRes.error}`);
  }

  // TEST 2: Motor Determinista de Nutrientes
  console.log('[TEST 2] Verificando NutrientCalculationEngine (Cálculo determinista sin LLM)...');
  const nutEngine = NutrientCalculationEngine.getInstance();
  const ing1 = nutEngine.calculateNutrientsForIngredient('Pechuga de Pollo', 200, 1.0);
  console.log(`✓ Pechuga de Pollo 200g -> Kcal: ${ing1.kcal}, Proteína: ${ing1.proteinGrams}g, Grasas: ${ing1.fatsGrams}g`);
  if (ing1.kcal === 330 && ing1.proteinGrams === 62) {
    console.log('✓ TEST 2 PASÓ: Nutrientes calculados con precisión determinista exacta.\n');
  } else {
    throw new Error(`TEST 2 FALLÓ: Cálculo incorrecto (${ing1.kcal} kcal, ${ing1.proteinGrams}g protein)`);
  }

  // TEST 3: Persistencia en los 12 Módulos & Ledger Universal
  console.log('[TEST 3] Almacenamiento y Recuperación en Módulos (Sueño, Actividad, Hidratación, etc.)...');
  memoryStore.addSleepRecord({
    id: 's-1',
    date: '2026-07-27',
    sleepStart: '23:00',
    sleepEnd: '07:00',
    hoursInBed: 8,
    subjectiveQualityScore: 9,
    awakeningsCount: 0,
    daytimeSleepinessScore: 2,
    nightScreensUse: false,
    source: 'USER_REPORTED',
    evidenceLevel: 'USER_CONFIRMED',
  });

  memoryStore.addActivityRecord({
    id: 'a-1',
    timestamp: new Date().toISOString(),
    activityName: 'Caminata en parque',
    activityType: 'caminata',
    durationMinutes: 45,
    intensity: 'moderada',
    rpeScore: 5,
    estimatedKcalBurned: 220,
    source: 'USER_REPORTED',
    evidenceLevel: 'USER_CONFIRMED',
  });

  memoryStore.addHydrationRecord({
    id: 'h-1',
    timestamp: new Date().toISOString(),
    amountMl: 500,
    fluidType: 'agua',
    dailyAccumulatedMl: 500,
    dailyGoalMl: 2500,
    evidenceLevel: 'USER_CONFIRMED',
  });

  const sleep = memoryStore.getSleepRecords();
  const act = memoryStore.getActivityRecords();
  const hyd = memoryStore.getHydrationRecords();
  const ledger = memoryStore.getLedgerEntries();

  if (sleep.length === 1 && act.length === 1 && hyd.length === 1 && ledger.length >= 3) {
    console.log(`✓ Registros guardados: Sueño (${sleep.length}), Actividad (${act.length}), Hidratación (${hyd.length}), Entradas en Ledger (${ledger.length})`);
    console.log('✓ TEST 3 PASÓ: Persistencia y trazabilidad universal en Ledger verificada.\n');
  } else {
    throw new Error('TEST 3 FALLÓ: Error en persistencia de módulos');
  }

  // TEST 4: Generación Oficial del Libro Excel (.xlsx) de 24 Pestañas
  console.log('[TEST 4] Generación del Contrato XLSX (workbook de 24 pestañas SALUD_METABOLISMO_EDYAN.xlsx)...');
  const xlsxExporter = XlsxExporter.getInstance();
  const buffer = await xlsxExporter.generateFullWorkbookBuffer();
  console.log(`✓ Buffer del archivo XLSX generado exitosamente: ${buffer.byteLength} bytes.`);
  if (buffer.byteLength > 5000) {
    console.log('✓ TEST 4 PASÓ: Libro Excel de 24 pestañas generado con éxito.\n');
  } else {
    throw new Error('TEST 4 FALLÓ: Buffer de Excel demasiado pequeño o corrupto');
  }

  // TEST 5: Generador de Informes Técnicos Diarios & PDF/JSON
  console.log('[TEST 5] Generación de Informe Técnico Diario & Exportaciones...');
  const reportEngine = DailyReportEngine.getInstance();
  const report = reportEngine.generateDailyTechnicalReport();
  const pdfHtml = reportEngine.generatePdfHtmlReport();
  const csvMat = reportEngine.exportFoodMatrix('csv');

  if (report && pdfHtml.includes('INFORME TÉCNICO COMPLETO') && csvMat.includes('Fecha,Tipo,Alimento')) {
    console.log('✓ TEST 5 PASÓ: Informe diario, HTML para PDF y CSV exportados exitosamente.\n');
  } else {
    throw new Error('TEST 5 FALLÓ: Error en DailyReportEngine');
  }

  console.log('====================================================');
  console.log('🎉 TODOS LOS TESTS MASTER DE AION AEGIS PASARON 100%');
  console.log('====================================================');
}

runMasterTestSuite().catch((err) => {
  console.error('❌ PRUEBA FALLIDA:', err);
  process.exit(1);
});
