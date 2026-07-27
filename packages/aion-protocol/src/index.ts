import { AionEvent } from '@aion/shared-types';

export type EventCallback<T = any> = (event: AionEvent<T>) => void;

export interface RegisteredApp {
  app_id: string;
  name: string;
  version: string;
  status: 'active' | 'inactive';
  lastSync: string;
  capabilities: string[];
}

export class AionEventBus {
  private static instance: AionEventBus;
  private subscribers: Map<string, Set<EventCallback>> = new Map();
  private eventHistory: AionEvent[] = [];
  private registeredApps: Map<string, RegisteredApp> = new Map();

  private constructor() {
    // Registrar AION Aegis por defecto
    this.registerApp({
      app_id: 'aion-aegis',
      name: 'AION Aegis',
      version: '0.1.0',
      status: 'active',
      lastSync: new Date().toISOString(),
      capabilities: ['nutrition', 'pantry', 'metabolism', 'live-plan', 'meal-prep'],
    });
  }

  public static getInstance(): AionEventBus {
    if (!AionEventBus.instance) {
      AionEventBus.instance = new AionEventBus();
    }
    return AionEventBus.instance;
  }

  public registerApp(app: RegisteredApp): void {
    this.registeredApps.set(app.app_id, app);
  }

  public getRegisteredApps(): RegisteredApp[] {
    return Array.from(this.registeredApps.values());
  }

  public subscribe<T = any>(eventType: string, callback: EventCallback<T>): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType)!.add(callback);

    return () => {
      this.subscribers.get(eventType)?.delete(callback);
    };
  }

  public publish<T = any>(event: AionEvent<T>): void {
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > 200) {
      this.eventHistory.pop();
    }

    const callbacks = this.subscribers.get(event.eventType);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(event);
        } catch (err) {
          console.error(`[AION Protocol Error publishing ${event.eventType}]:`, err);
        }
      });
    }
  }

  public getHistory(): AionEvent[] {
    return [...this.eventHistory];
  }
}
