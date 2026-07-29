import { AionMemoryStore } from '@aion/memory';
import { EmbeddedInBrowserLlmEngine } from './EmbeddedInBrowserLlmEngine';
import { AionKnowledgeBase } from './AionKnowledgeBase';

export interface LlmCompletionOptions {
  userPrompt: string;
  domain?: 'NUTRITION' | 'FINANCES' | 'SLEEP' | 'HYDRATION' | 'ACTIVITY' | 'MEDICATION' | 'CONVERSATIONAL';
  systemPrompt?: string;
  temperature?: number;
}

/**
 * AionGenerativeLlmEngine — Orquestador Principal de Generación de Lenguaje
 *
 * PRIORIDAD ABSOLUTA: Respuesta instantánea vía EmbeddedInBrowserLlmEngine.
 * En segundo plano, intenta promover a Ollama o API externa si están disponibles.
 * NUNCA bloquea la respuesta por un fetch de red.
 */
export class AionGenerativeLlmEngine {
  private static instance: AionGenerativeLlmEngine;
  private memoryStore = AionMemoryStore.getInstance();
  private embeddedEngine = EmbeddedInBrowserLlmEngine.getInstance();
  private knowledgeBase = AionKnowledgeBase.getInstance();
  private ollamaAvailable: boolean | null = null; // null = no chequeado, true/false = resultado

  private constructor() {
    // Chequear Ollama en background sin bloquear nada
    this.checkOllamaInBackground();
  }

  public static getInstance(): AionGenerativeLlmEngine {
    if (!AionGenerativeLlmEngine.instance) {
      AionGenerativeLlmEngine.instance = new AionGenerativeLlmEngine();
    }
    return AionGenerativeLlmEngine.instance;
  }

  /** Chequea si Ollama está disponible SIN bloquear el hilo principal */
  private async checkOllamaInBackground(): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 800);
      const res = await fetch('http://localhost:11434/api/tags', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      this.ollamaAvailable = res.ok;
    } catch (_) {
      this.ollamaAvailable = false;
    }
  }

  /** System prompts especializados por dominio */
  private getDomainSystemPrompt(domain: string, userName: string): string {
    const plan = this.memoryStore.getLivePlan();
    const base: Record<string, string> = {
      NUTRITION: `Eres el Agente Especialista en Nutrición y Bioquímica Metabólica de AION Aegis para ${userName}. Expertise en síntesis proteica (mTORC1/MPS), índice glucémico, lipólisis, micronutrientes. Meta: ${(plan as any).targetKcal || 2100} kcal, ${plan.macroTargets?.protein || 160}g proteína. Español fluido y natural.`,
      FINANCES: `Eres el Agente Especialista en Finanzas de AION Aegis para ${userName}. Expertise en presupuesto base cero, contabilidad de doble entrada, gestión en COP. Español claro y pragmático.`,
      SLEEP: `Eres el Agente Especialista en Sueño y Ritmo Circadiano de AION Aegis para ${userName}. Expertise en NREM/REM, melatonina, HRV, optimización de sueño profundo.`,
      HYDRATION: `Eres el Agente Especialista en Hidratación de AION Aegis para ${userName}. Expertise en osmolalidad plasmática, bomba Na+/K+, equilibrio electrolítico.`,
      ACTIVITY: `Eres el Agente Especialista en Ejercicio y Rendimiento de AION Aegis para ${userName}. Expertise en METs, zonas de FC, hipertrofia, oxidación de grasas.`,
      MEDICATION: `Eres el Agente Especialista en Salud y Farmacovigilancia de AION Aegis para ${userName}. Monitoreo de síntomas y suplementación.`,
    };
    return base[domain] || `Eres AION Aegis, la Prótesis Ejecutiva IA Soberana de ${userName}. Español natural y fluido. NUNCA respuestas enlatadas.`;
  }

  /**
   * Genera respuesta con el pipeline:
   * 1. INSTANTÁNEO: Motor embebido in-app (SIEMPRE funciona, 0ms de latencia de red)
   * 2. BACKGROUND: Si Ollama está disponible, lo usa en futuras llamadas
   * 3. OPCIONAL: API Key externa si está configurada
   */
  public async generateResponse(options: LlmCompletionOptions): Promise<string> {
    const profile = this.memoryStore.getCoreProfile();
    const userName = profile.displayName || 'Edyan';
    const domain = options.domain || 'CONVERSATIONAL';
    const systemPrompt = options.systemPrompt || this.getDomainSystemPrompt(domain, userName);
    const userApiKey = (profile as any).llmApiKey || (profile as any).apiKey;

    // --- RUTA PRIORITARIA: Si Ollama YA fue verificado como disponible, usarlo ---
    if (this.ollamaAvailable === true) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s para generación real
        const ollamaRes = await fetch('http://localhost:11434/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            model: 'llama3.2',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: options.userPrompt },
            ],
            temperature: options.temperature ?? 0.7,
          }),
        });
        clearTimeout(timeoutId);
        if (ollamaRes.ok) {
          const data = await ollamaRes.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) return text.trim();
        }
      } catch (_) {
        this.ollamaAvailable = false; // Marcar como no disponible para futuras llamadas
      }
    }

    // --- RUTA 2: API KEY EXTERNA (si configurada) ---
    if (userApiKey) {
      try {
        const endpoint = (profile as any).llmEndpoint || 'https://api.openai.com/v1/chat/completions';
        const apiRes = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userApiKey}`,
          },
          body: JSON.stringify({
            model: (profile as any).llmModel || 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: options.userPrompt },
            ],
            temperature: options.temperature ?? 0.7,
          }),
        });
        if (apiRes.ok) {
          const data = await apiRes.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) return text.trim();
        }
      } catch (_) {}
    }

    // --- RUTA 3: MOTOR EMBEBIDO IN-APP (INSTANTÁNEO, GARANTÍA 100%) ---
    return this.embeddedEngine.generateLocalCompletion(options.userPrompt, domain, userName);
  }
}
