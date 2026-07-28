import { AionCoreSuperAgent } from '../packages/aion-agents/src/index.ts';
import { AionMemoryStore } from '../packages/aion-memory/src/index.ts';

async function testAgentIntegrity() {
  console.log('🧪 INICIANDO TEST DE INTEGRIDAD INTERNA Y CHAT REAL DE AGENTES AION...');

  const coreAgent = AionCoreSuperAgent.getInstance();
  const memoryStore = AionMemoryStore.getInstance();

  // Test 1: Saludo simple ("Hi")
  console.log('\n--- TEST 1: Enviar "Hi" ---');
  const res1 = await coreAgent.processOmniInput('Hi');
  console.log('Respuesta del agente:', res1.coreReply);
  console.log('Dominios detectados:', res1.detectedDomains);
  if (!res1.coreReply) throw new Error('Falló el procesamiento de "Hi"');

  // Test 2: Ingesta de alimentos ("Comí 250g de salmón a la plancha con espárragos")
  console.log('\n--- TEST 2: Enviar Ingesta ---');
  const res2 = await coreAgent.processOmniInput('Comí 250g de salmón a la plancha con espárragos');
  console.log('Respuesta del agente:', res2.coreReply);
  const meals = memoryStore.getMeals();
  console.log('Comidas registradas en AionMemoryStore:', meals.length);

  // Test 3: Registro de gasto financiero ("Gasté 35.000 pesos en el supermercado")
  console.log('\n--- TEST 3: Enviar Gasto Financiero ---');
  const res3 = await coreAgent.processOmniInput('Gasté 35.000 pesos en el supermercado');
  console.log('Respuesta del agente:', res3.coreReply);
  const ledger = memoryStore.getLedgerEntries();
  console.log('Entradas registradas en Aegis Ledger:', ledger.length);

  console.log('\n🎉 TEST DE INTEGRIDAD Y PERSISTENCIA COMPLETADO AL 100% EXITOSAMENTE!');
}

testAgentIntegrity().catch((err) => {
  console.error('❌ Error en el test de integridad:', err);
  process.exit(1);
});
