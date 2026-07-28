import { AionEventBus } from '@aion/protocol';
import { AionMemoryStore } from '@aion/memory';
import { NutritionLeadSpecialist } from '../index';
import { VisionService } from '../vision/VisionService';
import { AionGenerativeLlmEngine } from './AionGenerativeLlmEngine';
import { AionNaturalDialogueEngine } from './AionNaturalDialogueEngine';

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

    // 1. EXTRAER INFERENCIAS DE DATOS Y EVENTOS
    const inferenceResult = this.naturalEngine.processNaturalInput(inputText, userName);
    let detectedDomains = inferenceResult.detectedDomains;
    let actionsSummary = inferenceResult.inferredActions;

    // 2. GENERAR RESPUESTA FLUIDA MEDIANTE MOTOR GENERATIVO LLM LIBRE DE PLANTILLAS
    let finalReply = await this.llmEngine.generateResponse({
      userPrompt: inputText,
      systemPrompt: `Eres AION Aegis, la prótesis ejecutiva IA soberana de ${userName}. Hablas en español fluido, natural, empático y profundamente inteligente. NUNCA usas plantillas enlatadas ni respuestas robóticas. Respondes directamente a las dudas de ${userName}.`,
    });

    // 3. SI ADJUNTA IMAGEN O ES ESPECÍFICO DE ALIMENTOS, PROCESAR VISIÓN Y NUTRICIÓN
    if (imageUrl || textLower.includes('comida') || textLower.includes('plato') || textLower.includes('almuerzo')) {
      if (!detectedDomains.includes('NUTRITION')) detectedDomains.push('NUTRITION');
      const aegisResult = await this.aegisSpecialist.processMealInput(inputText, imageUrl);
      if (aegisResult.agentReply) {
        finalReply = `${finalReply}\n\n${aegisResult.agentReply}`;
      }
    }

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
