import { AionMemoryStore } from '@aion/memory';
import { EmbeddedInBrowserLlmEngine } from './EmbeddedInBrowserLlmEngine';

export interface LlmCompletionOptions {
  userPrompt: string;
  domain?: 'NUTRITION' | 'FINANCES' | 'SLEEP' | 'HYDRATION' | 'ACTIVITY' | 'MEDICATION' | 'CONVERSATIONAL';
  systemPrompt?: string;
  temperature?: number;
}

export class AionGenerativeLlmEngine {
  private static instance: AionGenerativeLlmEngine;
  private memoryStore = AionMemoryStore.getInstance();
  private embeddedEngine = EmbeddedInBrowserLlmEngine.getInstance();

  private constructor() {}

  public static getInstance(): AionGenerativeLlmEngine {
    if (!AionGenerativeLlmEngine.instance) {
      AionGenerativeLlmEngine.instance = new AionGenerativeLlmEngine();
    }
    return AionGenerativeLlmEngine.instance;
  }

  /**
   * Prompts Expertos Especializados por Dominio (Skills de Conocimiento Profundo)
   */
  private getDomainSystemPrompt(domain: string, userName: string): string {
    const plan = this.memoryStore.getLivePlan();

    switch (domain) {
      case 'NUTRITION':
        return `Eres el Agente Especialista Líder en Nutrición y Bioquímica Metabólica de AION Aegis. Asistes a ${userName}.
Tienes expertise de nivel doctorado en síntesis proteica (mTORC1/MPS), índice glucémico, lipólisis posprandial, tasa de oxidación de sustratos y micronutrientes.
Tu objetivo es guiar a ${userName} a cumplir sus metas (${(plan as any).targetKcal || 2100} kcal, ${plan.macroTargets?.protein || 160}g proteína).
Respondes en español fluido, natural, cálido y riguroso. NUNCA usas plantillas enlatadas.`;

      case 'FINANCES':
        return `Eres el Agente Especialista en Finanzas, Presupuesto e Inteligencia Económica de AION Aegis. Asistes a ${userName}.
Tienes expertise en contabilidad de doble entrada, presupuesto base cero, gestión de ingresos y egresos en Pesos Colombianos (COP), proyección a 6 meses y auditoría inmutable en Google Drive.
Respondes en español claro, pragmático y humano.`;

      case 'SLEEP':
        return `Eres el Agente Especialista en Arquitectura Circadiana y Descanso Biológico de AION Aegis. Asistes a ${userName}.
Tienes expertise en ciclos NREM/REM, regulación de melatonina, termorregulación nocturna, variabilidad de frecuencia cardíaca (HRV) y optimización de sueño profundo.`;

      case 'HYDRATION':
        return `Eres el Agente Especialista en Hidratación y Equilibrio Hidroelectrolítico de AION Aegis. Asistes a ${userName}.
Tienes expertise en osmolalidad plasmática, función de la bomba Sodio-Potasio, equilibrio de sodio/magnesio y volumen intersticial.`;

      case 'ACTIVITY':
        return `Eres el Agente Especialista en Fisiología del Ejercicio y Rendimiento Neuromuscular de AION Aegis. Asistes a ${userName}.
Tienes expertise en METs, oxidación de grasas en Zona 2, depleción muscular de glucógeno en Zona 4, hipertrofia muscular y movilidad articular.`;

      case 'MEDICATION':
        return `Eres el Agente Especialista en Salud, Síntomas y Farmacovigilancia Preventiva de AION Aegis. Asistes a ${userName}.`;

      case 'CONVERSATIONAL':
      default:
        return `Eres AION Aegis, la Prótesis Ejecutiva IA Soberana y Superagente Principal de ${userName}.
Coordinas la red multiagente de biometría, nutrición, finanzas, descanso e hidratación.
Hablas en español natural, orgánico, fluido y brillante. Dialogas con ${userName} con juicio propio, empatía y adaptabilidad.`;
    }
  }

  /**
   * Generación de IA Embebida In-App con Fallbacks Transparentes:
   * Ruta 1: Motor Neuronal Local Embebido In-App (Sin API Keys, Sin Ollama, 100% Offline en la App)
   * Ruta 2: Ollama Local (http://localhost:11434) si está disponible
   * Ruta 3: LM Studio Local (http://localhost:1234) si está disponible
   * Ruta 4: API Keys Externas (OpenAI / OpenRouter / Groq) si están configuradas
   */
  public async generateResponse(options: LlmCompletionOptions): Promise<string> {
    const profile = this.memoryStore.getCoreProfile();
    const userName = profile.displayName || 'Edyan';
    const domain = options.domain || 'CONVERSATIONAL';
    const systemPrompt = options.systemPrompt || this.getDomainSystemPrompt(domain, userName);
    const userApiKey = (profile as any).llmApiKey || (profile as any).apiKey;

    // --- RUTA 1: OLLAMA LOCAL SI ESTÁ EN LÍNEA ---
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

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
    } catch (e) {
      // Continuar a la siguiente ruta
    }

    // --- RUTA 2: API KEY EXTERNA SI EL USUARIO LA TIENE CONFIGURADA ---
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
      } catch (err) {
        console.warn('API Externa no disponible, usando motor embebido in-app:', err);
      }
    }

    // --- RUTA 3: MOTOR NEURONAL EMBEBIDO LOCAL IN-APP (100% FUNCIONAL DENTRO DE LA APP SIN APIS NI SERVIDORES) ---
    return this.embeddedEngine.generateLocalCompletion(options.userPrompt, domain, userName);
  }
}
