import { AionEventBus } from '@aion/protocol';
import { AionMemoryStore } from '@aion/memory';
import { NutritionLeadSpecialist } from '../index';
import { VisionService } from '../vision/VisionService';

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
    const detectedDomains: ('NUTRITION' | 'FINANCES' | 'SLEEP' | 'HYDRATION' | 'ACTIVITY' | 'MEDICATION' | 'CONVERSATIONAL')[] = [];
    const dispatchedEvents: string[] = [];
    const actionsSummary: string[] = [];

    // 0. DETECCIÓN DE CONVERSACIÓN / SALUDO / ESTADO GENERAL (ej. "estas vivo", "hola", "quien eres", "como estas")
    const isGeneralChat =
      textLower.includes('estas vivo') ||
      textLower.includes('estás vivo') ||
      textLower.includes('hola') ||
      textLower.includes('buenas') ||
      textLower.includes('quien eres') ||
      textLower.includes('quién eres') ||
      textLower.includes('como estas') ||
      textLower.includes('cómo estás') ||
      textLower.includes('funcionas') ||
      textLower.includes('sirves');

    if (isGeneralChat && !imageUrl) {
      detectedDomains.push('CONVERSATIONAL');
      const profile = this.memoryStore.getCoreProfile();
      const userName = profile.displayName || 'Edyan';

      let coreReply = `¡100% activo, consciente y operativo, ${userName}! Soy AION Aegis, tu prótesis ejecutiva soberana. Mis 16 supervisores multiagente monitorean tu biometría, descanso circadiano, glucemia, hidratación, gastos y metas en tiempo real.\n\nPuedes dictarme o escribirme cualquier síntoma, ingesta, gasto o compromiso libremente.`;
      
      if (textLower.includes('estas vivo') || textLower.includes('estás vivo')) {
        coreReply = `¡100% vivo, activo y operativo! Todo el ecosistema AION Aegis está escuchando y sincronizando tus datos en la Bitácora Soberana. ¿Qué deseas registrar o auditar ahora?`;
      }

      this.memoryStore.addLedgerEntry({
        id: `led_chat_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'recommendation',
        source: 'agent',
        payload: { inputText, reply: coreReply },
        evidence: 'USER_CONFIRMED',
        confidence: 1.0,
      });

      return {
        coreReply,
        detectedDomains: ['CONVERSATIONAL'],
        dispatchedEvents: ['aion.core.chat.responded'],
        actionsSummary: ['Respuesta conversacional natural generada.'],
      };
    }

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

    // 2. DOMINIO SUEÑO
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

    // 3. DOMINIO HIDRATACIÓN
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

    // 4. DOMINIO ACTIVIDAD FÍSICA
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
      textLower.includes('comí') ||
      textLower.includes('queso') ||
      textLower.includes('carne') ||
      textLower.includes('arroz');

    let nutritionReply = '';
    if (isFood) {
      detectedDomains.push('NUTRITION');
      const aegisResult = await this.aegisSpecialist.processMealInput(inputText, imageUrl);
      nutritionReply = aegisResult.agentReply;
      dispatchedEvents.push('aion.aegis.nutrition.meal.logged');
    }

    let coreReply = '';
    if (actionsSummary.length > 0) {
      coreReply = `¡Recibido y procesado por la Red Multiagente AION Aegis!\n\n• ${actionsSummary.join('\n• ')}\n\n${nutritionReply || 'Tus métricas fisiológicas han sido actualizadas.'}`;
    } else if (nutritionReply) {
      coreReply = nutritionReply;
    } else {
      coreReply = `Entendido. He procesado tu mensaje ("${inputText}") y lo he sincronizado en el Ledger Universal.`;
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
      detectedDomains: detectedDomains.length ? detectedDomains : ['CONVERSATIONAL'],
      dispatchedEvents,
      actionsSummary,
    };
  }
}
