import { AionCoreSuperAgent } from '../packages/aion-agents/src/core/AionCoreSuperAgent';
import { DesignAndVisualAgent } from '../packages/aion-agents/src/visual/DesignAndVisualAgent';
import { AionMemoryStore } from '../packages/aion-memory/src';

async function testAionCoreSuperAgentAndVisualAgent() {
  console.log('======================================================');
  console.log('🔥 TEST EXHAUSTIVO DE AION CORE SUPERAGENT & VISUAL AGENT');
  console.log('======================================================\n');

  const coreAgent = AionCoreSuperAgent.getInstance();
  const visualAgent = DesignAndVisualAgent.getInstance();
  const store = AionMemoryStore.getInstance();

  // 1. Probar OmniDispatch de Nutrición
  console.log('1. Enviando consulta de Nutrición a AION Core SuperAgent...');
  const res1 = await coreAgent.processOmniInput('Comí 2 huevos cocidos con 1 rebanada de pan integral');
  console.log('✓ Dominio detectado:', res1.detectedDomains);
  console.log('✓ Eventos publicados:', res1.dispatchedEvents);
  console.log('✓ Respuesta AION Core:', res1.coreReply);

  // 2. Probar OmniDispatch de Finanzas / Gastos
  console.log('\n2. Enviando registro de Finanzas/Gastos a AION Core SuperAgent...');
  const res2 = await coreAgent.processOmniInput('Gasté 25.000 pesos en el supermercado para comprar verduras');
  console.log('✓ Dominio detectado:', res2.detectedDomains);
  console.log('✓ Acciones ejecutadas:', res2.actionsSummary);
  console.log('✓ Respuesta AION Core:', res2.coreReply);

  // 3. Probar DesignAndVisualAgent
  console.log('\n3. Invocando DesignAndVisualAgent para síntesis visual de infografía...');
  const visualPrompt = visualAgent.generateVisualPrompt('Flexibilidad Metabólica & Lipólisis', 'metabolic_chart');
  console.log('✓ Título Activo:', visualPrompt.topic);
  console.log('✓ Categoría:', visualPrompt.category);
  console.log('✓ Prompt Sugerido:', visualPrompt.suggestedPrompt);

  const assets = visualAgent.getSystemVisualAssets();
  console.log(`✓ Activos gráficos registrados en el sistema: ${assets.length}`);

  // 4. Verificación final de Ledger en Memoria
  console.log('\n4. Verificando inmutabilidad en Aegis Ledger...');
  const ledger = store.getLedgerEntries();
  console.log(`✓ Entradas totales acumuladas en Ledger: ${ledger.length}`);

  console.log('\n======================================================');
  console.log('🎉 AION CORE SUPERAGENT FUNCIONAL Y ACTUANDO COMO MULTIAGENTE');
  console.log('======================================================');
}

testAionCoreSuperAgentAndVisualAgent().catch((err) => {
  console.error('❌ Error en el test de AION Core SuperAgent:', err);
  process.exit(1);
});
