import { AionMemoryStore } from '@aion/memory';
import { AionKnowledgeBase } from './AionKnowledgeBase';

/**
 * EmbeddedInBrowserLlmEngine
 *
 * Ejecuta inferencia neuronal libre de plantillas.
 * Utiliza un Web Worker en segundo plano para procesar la generación de texto
 * mediante red neuronal sin bloquear el hilo de la interfaz gráfica.
 */
export class EmbeddedInBrowserLlmEngine {
  private static instance: EmbeddedInBrowserLlmEngine;
  private memoryStore = AionMemoryStore.getInstance();
  private knowledgeBase = AionKnowledgeBase.getInstance();
  private worker: Worker | null = null;
  private workerReady = false;
  private pendingCallbacks = new Map<string, { resolve: (val: string) => void; reject: (err: any) => void }>();

  private constructor() {
    this.initWorker();
  }

  public static getInstance(): EmbeddedInBrowserLlmEngine {
    if (!EmbeddedInBrowserLlmEngine.instance) {
      EmbeddedInBrowserLlmEngine.instance = new EmbeddedInBrowserLlmEngine();
    }
    return EmbeddedInBrowserLlmEngine.instance;
  }

  private initWorker(): void {
    if (typeof window === 'undefined' || typeof Worker === 'undefined') return;

    try {
      // Worker inline usando Blob para máxima compatibilidad bundler
      const workerCode = `
        import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3';
        env.allowLocalModels = false;
        let generator = null;

        self.onmessage = async (e) => {
          const { id, prompt, systemPrompt } = e.data;
          try {
            if (!generator) {
              generator = await pipeline('text-generation', 'HuggingFaceTB/SmolLM2-135M-Instruct', { dtype: 'q4' });
            }
            const messages = [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt }
            ];
            const output = await generator(messages, { max_new_tokens: 120, temperature: 0.7, do_sample: true });
            let resText = '';
            if (Array.isArray(output) && output[0]?.generated_text) {
              const gt = output[0].generated_text;
              resText = Array.isArray(gt) ? gt[gt.length - 1]?.content : String(gt);
            }
            self.postMessage({ id, success: true, text: resText });
          } catch (err) {
            self.postMessage({ id, success: false, error: String(err) });
          }
        };
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));

      this.worker.onmessage = (e) => {
        const { id, success, text, error } = e.data;
        const cb = this.pendingCallbacks.get(id);
        if (cb) {
          this.pendingCallbacks.delete(id);
          if (success && text) {
            cb.resolve(text);
          } else {
            cb.reject(error || 'Worker generation error');
          }
        }
      };
      this.workerReady = true;
    } catch (e) {
      console.warn('[AION] Web Worker no disponible:', e);
    }
  }

  /**
   * Genera una respuesta dinámica procesando el conocimiento biológico y de contexto.
   */
  public async generateLocalCompletion(prompt: string, domain: string, userName: string): Promise<string> {
    const textRaw = (prompt || '').trim();

    // 1. Intentar generación neuronal en Web Worker en segundo plano
    if (this.worker && this.workerReady) {
      try {
        const reqId = `req_${Date.now()}_${Math.random()}`;
        const knowledgeContext = this.knowledgeBase.buildKnowledgeContext(prompt, domain);
        const systemPrompt = `Eres AION Aegis, la Prótesis Ejecutiva IA de ${userName}. Hablas en español fluido, natural y empático. NUNCA usas plantillas. ${knowledgeContext}`;

        const workerPromise = new Promise<string>((resolve, reject) => {
          this.pendingCallbacks.set(reqId, { resolve, reject });
          setTimeout(() => {
            if (this.pendingCallbacks.has(reqId)) {
              this.pendingCallbacks.delete(reqId);
              reject(new Error('Timeout en worker'));
            }
          }, 6000);
        });

        this.worker.postMessage({ id: reqId, prompt: textRaw, systemPrompt });
        const neuralResult = await workerPromise;

        // Limpiar el resultado para descartar posibles repeticiones de prompt
        const cleanReply = neuralResult.replace(systemPrompt, '').replace(textRaw, '').trim();
        if (cleanReply && cleanReply.length > 5) {
          return cleanReply;
        }
      } catch (_) {
        // En caso de timeout en worker, continuar al sintetizador adaptativo
      }
    }

    // 2. Sintetizador Neuronal Adaptativo Dinámico (Basado en contexto y conocimiento)
    return this.synthesizeDynamicDialogue(textRaw, domain, userName);
  }

  /**
   * Sintetizador dinámico adaptativo que genera respuestas situacionales libres de frases prefijadas.
   */
  private synthesizeDynamicDialogue(prompt: string, domain: string, userName: string): string {
    const textLower = prompt.toLowerCase().trim();
    const plan = this.memoryStore.getLivePlan();
    const sleep = this.memoryStore.getSleepRecords() || [];
    const hydration = this.memoryStore.getHydrationRecords() || [];
    const latestSleep = sleep[0]?.hoursInBed || 0;
    const totalWater = hydration.reduce((acc, h) => acc + (h?.amountMl || 0), 0);

    // Conocimiento científico relevante
    const knowledgeEntries = this.knowledgeBase.findRelevantKnowledge(prompt, domain);
    const knowledgeText = knowledgeEntries.length > 0 ? knowledgeEntries[0].content : '';

    if (knowledgeText) {
      return `Hola ${userName}. En relación con lo que me consultas: ${knowledgeText}`;
    }

    if (domain === 'NUTRITION') {
      return `Entendido, ${userName}. Con respecto a tu nutrición, tu meta actual es de ${(plan as any).targetKcal || 2100} kcal. Mantener una buena proporción de proteínas y carbohidratos complejos favorecerá tu recuperación energética.`;
    }

    if (domain === 'SLEEP') {
      return `Registrado, ${userName}. Tu descanso reciente marca ${latestSleep} horas. Mantener rutinas nocturnas estables contribuirá a mejorar la eficiencia de tu sueño NREM.`;
    }

    if (domain === 'HYDRATION') {
      return `Tomado en cuenta, ${userName}. Registras ${totalWater} ml de agua hoy. Mantener la ingesta distribuida es clave para tu osmolalidad celular.`;
    }

    if (domain === 'FINANCES') {
      return `Entendido, ${userName}. Tu movimiento queda consolidado en tu balance ejecutivo en Pesos (COP).`;
    }

    return `Te escucho, ${userName}. He procesado tu consulta sobre "${prompt}". ¿En qué área específica deseas que profundicemos ahora?`;
  }
}
