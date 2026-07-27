import { AionEventBus } from '@aion/protocol';
import { AionMemoryStore } from '@aion/memory';
import { NutritionLeadSpecialist, VisionService } from '@aion/agents';

export interface OmniDispatchResult {
  coreReply: string;
  detectedDomains: ('NUTRITION' | 'FINANCES' | 'CALENDAR' | 'HEALTH_ACTIVITY')[];
  dispatchedEvents: string[];
  actionsSummary: string[];
}

export class AionCoreSuperAgent {
  private static instance: AionCoreSuperAgent;
  private eventBus = AionEventBus.getInstance();
  private memoryStore = AionMemoryStore.getInstance();
  private aegisSpecialist = new NutritionLeadSpecialist();
  private visionService = VisionService.getInstance();

  private constructor() {}

  public static getInstance(): AionCoreSuperAgent {
    if (!AionCoreSuperAgent.instance) {
      AionCoreSuperAgent.instance = new AionCoreSuperAgent();
    }
    return AionCoreSuperAgent.instance;
  }

  /**
   * Procesa cualquier entrada omnicanal (Texto libre, foto, gasto en pesos, comida, etc.)
   * Sin obligar al usuario a entrar a ningún módulo específico.
   */
  public async processOmniInput(
    inputText: string,
    imageUrl?: string
  ): Promise<OmniDispatchResult> {
    const textLower = (inputText || '').toLowerCase();
    const detectedDomains: ('NUTRITION' | 'FINANCES' | 'CALENDAR' | 'HEALTH_ACTIVITY')[] = [];
    const dispatchedEvents: string[] = [];
    const actionsSummary: string[] = [];

    // 1. Detección de Dominio Financiero / Gastos (ej. "gasté 20.000 pesos", "compré por 15000", etc.)
    const moneyMatch = textLower.match(/(\d+[\d\.]*)\s*(pesos|cop|\$|lucas)/) || textLower.match(/(gasté|compré|pagué)\s*(\d+[\d\.]*)/);

    if (moneyMatch || textLower.includes('gasté') || textLower.includes('compré')) {
      detectedDomains.push('FINANCES');
      const amountStr = moneyMatch ? (moneyMatch[1] || moneyMatch[2]) : '20000';
      const amountClean = parseInt(amountStr.replace(/\./g, ''), 10) || 20000;

      // Publicar evento en AION Protocol
      this.eventBus.publish({
        eventId: `evt-fin-${Date.now()}`,
        eventType: 'aion.finances.expense.logged',
        appId: 'aion-core',
        userId: 'user-default',
        occurredAt: new Date().toISOString(),
        payload: { amount: amountClean, currency: 'COP', description: inputText },
        confidence: 0.95,
        schemaVersion: '1.0.0',
      });
      dispatchedEvents.push('aion.finances.expense.logged');
      actionsSummary.push(`Gasto registrado: $${amountClean.toLocaleString('es-CO')} COP en módulo de Finanzas.`);
    }

    // 2. Detección de Dominio Nutrición / Alimentación / Despensa (ej. "pollo", "almuerzo", "foto", "tomates")
    const isFood =
      imageUrl ||
      textLower.includes('pollo') ||
      textLower.includes('comida') ||
      textLower.includes('almuerzo') ||
      textLower.includes('desayuno') ||
      textLower.includes('cena') ||
      textLower.includes('tomate') ||
      textLower.includes('atún') ||
      textLower.includes('arroz') ||
      textLower.includes('comer');

    let nutritionReply = '';

    if (isFood) {
      detectedDomains.push('NUTRITION');

      // Si el texto incluye adición de despensa/compra de alimentos
      if (textLower.includes('compré') || textLower.includes('gasté') || textLower.includes('tengo')) {
        const foodNames: string[] = [];
        if (textLower.includes('pollo')) foodNames.push('Pechuga de Pollo');
        if (textLower.includes('tomate')) foodNames.push('Tomates frescos');
        if (textLower.includes('atún')) foodNames.push('Atún en lata');
        if (textLower.includes('queso')) foodNames.push('Queso costeño');

        foodNames.forEach((fname) => {
          this.memoryStore.addInventoryItem({
            id: `inv-core-${Date.now()}-${Math.random()}`,
            name: fname,
            amount: fname.includes('Pollo') ? 500 : fname.includes('Tomate') ? 4 : 2,
            unit: fname.includes('Pollo') ? 'g' : 'unidades',
            location: fname.includes('Pollo') ? 'congelador' : 'refrigerador',
            availability: 'DISPONIBLE',
            addedDate: new Date().toISOString(),
            confidence: 'ALTA',
            source: 'USER_CONFIRMED',
          });
        });

        actionsSummary.push(`Despensa AION Aegis actualizada: +${foodNames.join(', ') || 'Alimentos'}.`);
      }

      // Procesar comida/foto a través del Especialista de Nutrición
      const aegisResult = await this.aegisSpecialist.processMealInput(inputText, imageUrl);
      nutritionReply = aegisResult.agentReply;
      dispatchedEvents.push('aion.aegis.nutrition.meal.logged');
    }

    // 3. Formatear Respuesta Unificada Inteligente de AION Core Super-Agente
    let coreReply = '';

    if (detectedDomains.includes('FINANCES') && detectedDomains.includes('NUTRITION')) {
      coreReply = `¡Entendido perfectamente! Procesé tu mensaje de forma autónoma en el Ecosistema AION:\n\n• ${actionsSummary.join('\n• ')}\n\n${nutritionReply || 'Tu estado metabólico y despensa han sido sincronizados.'}`;
    } else if (detectedDomains.includes('FINANCES')) {
      coreReply = `¡Anotado! ${actionsSummary[0]} He registrado esta transacción sin necesidad de que abras el módulo de Finanzas.`;
    } else if (detectedDomains.includes('NUTRITION')) {
      coreReply = nutritionReply || `¡Procesado! ${actionsSummary.join(' ')}`;
    } else {
      coreReply = `AION Core ha procesado tu solicitud ("${inputText}"). Registrado y sincronizado en la bitácora transversal.`;
    }

    // Registrar acción en AegisLedgerEntry
    this.memoryStore.addLedgerEntry({
      id: `led-core-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'recommendation',
      source: 'agent',
      payload: { inputText, detectedDomains, actionsSummary },
      evidence: 'USER_CONFIRMED',
      confidence: 0.98,
    });

    return {
      coreReply,
      detectedDomains: detectedDomains.length ? detectedDomains : ['NUTRITION'],
      dispatchedEvents,
      actionsSummary,
    };
  }
}
