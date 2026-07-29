import { AionMemoryStore } from '@aion/memory';
import { AionKnowledgeBase } from './AionKnowledgeBase';

/**
 * FinancesSpecialistAgent — Agente Especialista en Finanzas y Presupuesto
 *
 * Estructura agéntica completa (igual que los demás agentes):
 * - Procesamiento de entrada en lenguaje natural
 * - Clasificación de transacciones (ingreso/egreso)
 * - Registro en ledger con contabilidad de doble entrada
 * - Respuesta conversacional con expertise financiera
 */
export class FinancesSpecialistAgent {
  private static instance: FinancesSpecialistAgent;
  private memoryStore = AionMemoryStore.getInstance();
  private knowledgeBase = AionKnowledgeBase.getInstance();

  private constructor() {}

  public static getInstance(): FinancesSpecialistAgent {
    if (!FinancesSpecialistAgent.instance) {
      FinancesSpecialistAgent.instance = new FinancesSpecialistAgent();
    }
    return FinancesSpecialistAgent.instance;
  }

  /**
   * Procesa entrada financiera en lenguaje natural.
   * Detecta montos, categorías y tipo de transacción.
   */
  public async processFinanceInput(inputText: string, userName: string): Promise<{
    reply: string;
    transactionRegistered: boolean;
    amount?: number;
    category?: string;
    type?: 'income' | 'expense';
  }> {
    const textLower = (inputText || '').toLowerCase().trim();

    // Extraer monto numérico del texto
    const amountMatch = textLower.match(/(\d[\d.,]*)/);
    const rawAmount = amountMatch ? parseFloat(amountMatch[1].replace(/\./g, '').replace(',', '.')) : 0;

    // Detectar tipo de transacción
    const isIncome = textLower.includes('cobré') || textLower.includes('me pagaron') || textLower.includes('ingreso') || textLower.includes('gané') || textLower.includes('recibí') || textLower.includes('sueldo') || textLower.includes('salario') || textLower.includes('honorarios');
    const isExpense = textLower.includes('gasté') || textLower.includes('pagué') || textLower.includes('compré') || textLower.includes('gasto') || textLower.includes('lucas') || textLower.includes('barras');

    // Detectar categoría
    const category = this.detectCategory(textLower);

    // Si hay un monto y un tipo, registrar la transacción
    if (rawAmount > 0 && (isIncome || isExpense)) {
      const type = isIncome ? 'income' : 'expense';
      const formattedAmount = rawAmount.toLocaleString('es-CO');

      this.memoryStore.addLedgerEntry({
        id: `fin_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: type === 'income' ? 'finance_income' as any : 'finance_expense' as any,
        source: 'user',
        payload: {
          amount: rawAmount,
          currency: 'COP',
          transactionType: type,
          category,
          description: inputText,
        },
        evidence: 'USER_CONFIRMED',
        confidence: 1.0,
      });

      if (type === 'income') {
        return {
          reply: `Registrado tu ingreso de $${formattedAmount} COP en la categoría "${category}", ${userName}. Tu flujo de caja se actualiza automáticamente en la matriz presupuestal.`,
          transactionRegistered: true,
          amount: rawAmount,
          category,
          type: 'income',
        };
      } else {
        return {
          reply: `Registrado tu gasto de $${formattedAmount} COP en "${category}", ${userName}. En contabilidad de doble entrada: Débito a ${category} / Crédito a Efectivo. Tu presupuesto base cero se recalcula automáticamente.`,
          transactionRegistered: true,
          amount: rawAmount,
          category,
          type: 'expense',
        };
      }
    }

    // Si no hay monto pero es conversación financiera
    const knowledge = this.knowledgeBase.findRelevantKnowledge(inputText, 'FINANCES');
    if (knowledge.length > 0) {
      return {
        reply: `${knowledge[0].content}`,
        transactionRegistered: false,
      };
    }

    // Pregunta abierta de finanzas
    if (textLower.includes('presupuesto') || textLower.includes('balance') || textLower.includes('cuánto')) {
      const config = this.memoryStore.getFinanceConfig();
      return {
        reply: `Tu presupuesto mensual está configurado en $${(config.monthlyBudgetCop || 0).toLocaleString('es-CO')} COP, ${userName}. ¿Deseas ver el desglose por categoría o registrar una nueva transacción?`,
        transactionRegistered: false,
      };
    }

    return {
      reply: `Estoy listo para gestionar tus finanzas, ${userName}. Puedes decirme cosas como "gasté 50 mil en almuerzo" o "me pagaron 2 millones" y lo registro automáticamente en tu presupuesto base cero.`,
      transactionRegistered: false,
    };
  }

  /** Detecta la categoría del gasto/ingreso */
  private detectCategory(text: string): string {
    if (text.includes('almuerzo') || text.includes('comida') || text.includes('restaurante') || text.includes('mercado')) return 'Alimentación';
    if (text.includes('transporte') || text.includes('uber') || text.includes('gasolina') || text.includes('bus')) return 'Transporte';
    if (text.includes('arriendo') || text.includes('alquiler') || text.includes('renta')) return 'Vivienda';
    if (text.includes('servicio') || text.includes('luz') || text.includes('agua') || text.includes('internet') || text.includes('celular')) return 'Servicios';
    if (text.includes('gym') || text.includes('ropa') || text.includes('entretenimiento') || text.includes('salida')) return 'Personal';
    if (text.includes('médico') || text.includes('salud') || text.includes('medicina') || text.includes('farmacia')) return 'Salud';
    if (text.includes('sueldo') || text.includes('salario') || text.includes('honorarios') || text.includes('freelance')) return 'Salario';
    return 'General';
  }
}
