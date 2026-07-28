import { AionEventBus } from '@aion/protocol';
import { AionMemoryStore } from '@aion/memory';
import { NutritionLeadSpecialist } from '../index';
import { VisionService } from '../vision/VisionService';

export interface OmniDispatchResult {
  coreReply: string;
  detectedDomains: ('NUTRITION' | 'FINANCES' | 'SLEEP' | 'HYDRATION' | 'ACTIVITY' | 'MEDICATION')[];
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

  public async processOmniInput(
    inputText: string,
    imageUrl?: string
  ): Promise<OmniDispatchResult> {
    const textLower = (inputText || '').toLowerCase();
    const detectedDomains: ('NUTRITION' | 'FINANCES' | 'SLEEP' | 'HYDRATION' | 'ACTIVITY' | 'MEDICATION')[] = [];
    const dispatchedEvents: string[] = [];
    const actionsSummary: string[] = [];

    // 1. DOMINIO FINANZAS (ej. "gasté 30.000", "ingreso de 1.500.000", "compré", "pesos")
    const moneyMatch = textLower.match(/(\d+[\d\.]*)\s*(pesos|cop|\$|lucas)/) || textLower.match(/(gasté|compré|pagué|ingreso|recibí)\s*(\d+[\d\.]*)/);
    if (moneyMatch || textLower.includes('gasté') || textLower.includes('ingreso') || textLower.includes('compré')) {
      detectedDomains.push('FINANCES');
      const amountStr = moneyMatch ? (moneyMatch[1] || moneyMatch[2]) : '35000';
      const amountClean = parseInt(amountStr.replace(/\./g, ''), 10) || 35000;
      const isIncome = textLower.includes('ingreso') || textLower.includes('gané') || textLower.includes('recibí');

      this.memoryStore.addLedgerEntry({
        id: `fin_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'inventory_added',
        source: 'user',
        evidence: 'USER_CONFIRMED',
        confidence: 0.98,
        payload: {
          description: inputText,
          amountCop: amountClean,
          category: isIncome ? 'Ingreso General' : 'Alimentos / Varios',
          type: isIncome ? 'INCOME' : 'EXPENSE',
        },
      });

      dispatchedEvents.push('aion.finances.transaction.logged');
      actionsSummary.push(`${isIncome ? 'Ingreso' : 'Gasto'} registrado: $${amountClean.toLocaleString('es-CO')} COP en Finanzas.`);
    }

    // 2. DOMINIO SUEÑO (ej. "dormí 7 horas", "sueño rem", "me desperté")
    const sleepMatch = textLower.match(/(\d+)\s*(horas|hrs|h)/);
    if (textLower.includes('dormí') || textLower.includes('sueño') || textLower.includes('desperté')) {
      detectedDomains.push('SLEEP');
      const hours = sleepMatch ? parseInt(sleepMatch[1]) : 7.5;
      this.memoryStore.addSleepRecord({
        id: `slp_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        totalSleepHours: hours,
        remHours: hours * 0.22,
        deepSleepHours: hours * 0.25,
        efficiencyPercentage: 92,
        score: 88,
      } as any);
      dispatchedEvents.push('aion.sleep.record.logged');
      actionsSummary.push(`Registro de Sueño: ${hours}h con eficiencia del 92%.`);
    }

    // 3. DOMINIO HIDRATACIÓN (ej. "tomé 500ml", "vaso de agua")
    const waterMatch = textLower.match(/(\d+)\s*(ml|litros|l|vasos)/);
    if (textLower.includes('agua') || textLower.includes('tomé') || textLower.includes('hidratación')) {
      detectedDomains.push('HYDRATION');
      const ml = waterMatch ? (waterMatch[2]?.startsWith('l') ? parseInt(waterMatch[1]) * 1000 : parseInt(waterMatch[1])) : 350;
      this.memoryStore.addHydrationRecord({
        id: `hyd_${Date.now()}`,
        timestamp: new Date().toISOString(),
        amountMl: ml,
        type: 'agua',
      } as any);
      dispatchedEvents.push('aion.hydration.record.logged');
      actionsSummary.push(`Hidratación actualizada: +${ml} ml de agua.`);
    }

    // 4. DOMINIO ACTIVIDAD FÍSICA (ej. "hice 45 min de gimnasio", "corrí 5km")
    if (textLower.includes('gimnasio') || textLower.includes('pesas') || textLower.includes('corrí') || textLower.includes('ejercicio')) {
      detectedDomains.push('ACTIVITY');
      this.memoryStore.addActivityRecord({
        id: `act_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'Fuerza & Musculación',
        durationMinutes: 45,
        kcalBurned: 320,
      } as any);
      dispatchedEvents.push('aion.activity.logged');
      actionsSummary.push(`Actividad Física: 45 min de Entrenamiento de Fuerza (320 kcal).`);
    }

    // 5. DOMINIO NUTRICIÓN & ALIMENTACIÓN
    const isFood =
      imageUrl ||
      textLower.includes('pollo') ||
      textLower.includes('comida') ||
      textLower.includes('almuerzo') ||
      textLower.includes('desayuno') ||
      textLower.includes('cena') ||
      textLower.includes('comí');

    let nutritionReply = '';
    if (isFood || detectedDomains.length === 0) {
      detectedDomains.push('NUTRITION');
      const aegisResult = await this.aegisSpecialist.processMealInput(inputText, imageUrl);
      nutritionReply = aegisResult.agentReply;
      dispatchedEvents.push('aion.aegis.nutrition.meal.logged');
    }

    let coreReply = '';
    if (actionsSummary.length > 0) {
      coreReply = `¡Recibido y procesado por la Red Multiagente AION Aegis!\n\n• ${actionsSummary.join('\n• ')}\n\n${nutritionReply || 'Tus métricas fisiológicas han sido actualizadas.'}`;
    } else {
      coreReply = nutritionReply || `AION Core ha registrado tu reporte en la bitácora transversal.`;
    }

    this.memoryStore.addLedgerEntry({
      id: `led_core_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'recommendation',
      source: 'agent',
      payload: { inputText, imageUrl, detectedDomains, actionsSummary },
      evidence: 'USER_CONFIRMED',
      confidence: 0.99,
    });

    return {
      coreReply,
      detectedDomains,
      dispatchedEvents,
      actionsSummary,
    };
  }
}
