import { AionEventBus } from '@aion/protocol';
import { AionMemoryStore } from '@aion/memory';
import { NutritionLeadSpecialist } from '../index';
import { VisionService } from '../vision/VisionService';
import { AionGenerativeLlmEngine } from './AionGenerativeLlmEngine';
import { AionNaturalDialogueEngine } from './AionNaturalDialogueEngine';
import { FinancesSpecialistAgent } from './FinancesSpecialistAgent';

export interface OmniDispatchResult {
  coreReply: string;
  detectedDomains: ('NUTRITION' | 'FINANCES' | 'SLEEP' | 'HYDRATION' | 'ACTIVITY' | 'MEDICATION' | 'CONVERSATIONAL')[];
  dispatchedEvents: string[];
  actionsSummary: string[];
}

export class AionCoreSuperAgent {
  private static instance: AionCoreSuperAgent;
  private eventBus = AionEventBus.getInstance();
  private memoryStore = AionMemoryStore.getInstance();
  private aegisSpecialist = new NutritionLeadSpecialist();
  private visionService = VisionService.getInstance();
  private llmEngine = AionGenerativeLlmEngine.getInstance();
  private naturalEngine = AionNaturalDialogueEngine.getInstance();
  private financesAgent = FinancesSpecialistAgent.getInstance();

  private constructor() {}

  public static getInstance(): AionCoreSuperAgent {
    if (!AionCoreSuperAgent.instance) {
      AionCoreSuperAgent.instance = new AionCoreSuperAgent();
    }
    return AionCoreSuperAgent.instance;
  }

  public async processOmniInput(
    inputText: string,
    imageUrl?: string
  ): Promise<OmniDispatchResult> {
    const textLower = (inputText || '').toLowerCase().trim();
    const profile = this.memoryStore.getCoreProfile();
    const userName = profile.displayName || 'Edyan';

    // 1. INFERENCIA AUTÓNOMA DE DOMINIOS Y ACCIONES
    const inferenceResult = this.naturalEngine.processNaturalInput(inputText, userName);
    let detectedDomains = inferenceResult.detectedDomains;
    let actionsSummary = inferenceResult.inferredActions;
    const primaryDomain = detectedDomains[0] || 'CONVERSATIONAL';

    let finalReply = '';

    // 2. DESPACHO ESPECIALIZADO POR DOMINIO

    // --- FINANZAS: despachar al agente financiero especialista ---
    if (primaryDomain === 'FINANCES' || textLower.includes('gasté') || textLower.includes('lucas') || textLower.includes('plata') || textLower.includes('barras') || textLower.includes('pagué') || textLower.includes('cobré') || textLower.includes('presupuesto')) {
      if (!detectedDomains.includes('FINANCES')) detectedDomains.push('FINANCES');
      const finResult = await this.financesAgent.processFinanceInput(inputText, userName);
      finalReply = finResult.reply;
      if (finResult.transactionRegistered) {
        actionsSummary.push(`Transacción ${finResult.type}: $${finResult.amount?.toLocaleString('es-CO')} COP → ${finResult.category}`);
      }
    }
    // --- NUTRICIÓN: despachar al especialista de nutrición ---
    else if (imageUrl || primaryDomain === 'NUTRITION' || textLower.includes('comida') || textLower.includes('plato') || textLower.includes('almuerzo') || textLower.includes('comí') || textLower.includes('desayuné')) {
      if (!detectedDomains.includes('NUTRITION')) detectedDomains.push('NUTRITION');
      const aegisResult = await this.aegisSpecialist.processMealInput(inputText, imageUrl);
      finalReply = aegisResult.agentReply || '';

      // Complementar con respuesta del LLM si la respuesta de nutrición está vacía
      if (!finalReply) {
        finalReply = await this.llmEngine.generateResponse({
          userPrompt: inputText,
          domain: 'NUTRITION',
        });
      }
    }
    // --- TODOS LOS DEMÁS DOMINIOS: LLM generativo con conocimiento ---
    else {
      finalReply = await this.llmEngine.generateResponse({
        userPrompt: inputText,
        domain: primaryDomain,
      });
    }

    // Registrar en ledger
    this.memoryStore.addLedgerEntry({
      id: `led_gen_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'recommendation',
      source: 'agent',
      payload: { inputText, imageUrl, detectedDomains, actionsSummary },
      evidence: 'USER_CONFIRMED',
      confidence: 0.99,
    });

    return {
      coreReply: finalReply,
      detectedDomains,
      dispatchedEvents: ['aion.core.generative.dialogue.processed'],
      actionsSummary,
    };
  }
}
