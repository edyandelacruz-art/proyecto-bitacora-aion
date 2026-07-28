import { AionMemoryStore } from '@aion/memory';

export interface AdaptiveNotification {
  id: string;
  timestamp: string;
  type: 'eating_pattern' | 'commitment_reminder' | 'circadian_alert' | 'hydration_reminder';
  title: string;
  message: string;
  stage: '24h_before' | '5h_before' | 'at_time' | 'pattern_detected';
  targetTime?: string;
  enabled: boolean;
}

export class AdaptiveUserBehaviorAgent {
  private static instance: AdaptiveUserBehaviorAgent;
  private memoryStore = AionMemoryStore.getInstance();
  private notificationsEnabled: boolean = true;

  private constructor() {}

  public static getInstance(): AdaptiveUserBehaviorAgent {
    if (!AdaptiveUserBehaviorAgent.instance) {
      AdaptiveUserBehaviorAgent.instance = new AdaptiveUserBehaviorAgent();
    }
    return AdaptiveUserBehaviorAgent.instance;
  }

  public isEnabled(): boolean {
    return this.notificationsEnabled;
  }

  public setEnabled(enabled: boolean): void {
    this.notificationsEnabled = enabled;
  }

  /**
   * Analiza el comportamiento del usuario y genera notificaciones adaptativas
   */
  public analyzeAndGenerateNotifications(): AdaptiveNotification[] {
    if (!this.notificationsEnabled) return [];

    const meals = this.memoryStore.getMeals() || [];
    const notifications: AdaptiveNotification[] = [];

    // 1. Detección de patrón de cena tardía (>8:00 PM)
    const lateMeals = meals.filter((m) => {
      if (!m.timestamp) return false;
      const hour = new Date(m.timestamp).getHours();
      return hour >= 20;
    });

    if (lateMeals.length >= 1) {
      notifications.push({
        id: `notif_late_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'eating_pattern',
        title: 'Patrón de Ingesta Nocturna Detectado (8:00 PM)',
        message: 'AION notó que sueles cenar cerca de las 8:00 PM. Te recomendamos limitar carbohidratos simples a esa hora para optimizar el sueño profundo.',
        stage: 'pattern_detected',
        enabled: true,
      });
    }

    // 2. Recordatorios adaptativos para compromisos agendados (24h antes, 5h antes, al ejecutar)
    const plan = this.memoryStore.getLivePlan();
    if (plan && plan.scheduledBlocks) {
      plan.scheduledBlocks.forEach((block) => {
        notifications.push({
          id: `notif_24h_${block.id}`,
          timestamp: new Date().toISOString(),
          type: 'commitment_reminder',
          title: `Recordatorio de Compromiso: ${block.title}`,
          message: `Mañana a las ${block.startTime} tienes programado: ${block.title}. (Aviso 24h antes)`,
          stage: '24h_before',
          targetTime: block.startTime,
          enabled: true,
        });

        notifications.push({
          id: `notif_5h_${block.id}`,
          timestamp: new Date().toISOString(),
          type: 'commitment_reminder',
          title: `Próximo Compromiso: ${block.title}`,
          message: `En 5 horas (${block.startTime}) se ejecutará: ${block.title}.`,
          stage: '5h_before',
          targetTime: block.startTime,
          enabled: true,
        });
      });
    }

    return notifications;
  }
}
