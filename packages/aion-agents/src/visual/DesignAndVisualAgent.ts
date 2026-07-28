import { AionMemoryStore } from '@aion/memory';

export interface VisualAssetPrompt {
  id: string;
  topic: string;
  suggestedPrompt: string;
  aspectRatio: '1:1' | '16:9' | '4:3' | '9:16';
  category: 'metabolic_chart' | 'biological_diagram' | 'agent_architecture' | 'ui_mockup';
  previewUrl?: string;
}

export class DesignAndVisualAgent {
  private static instance: DesignAndVisualAgent;
  private memoryStore = AionMemoryStore.getInstance();

  private constructor() {}

  public static getInstance(): DesignAndVisualAgent {
    if (!DesignAndVisualAgent.instance) {
      DesignAndVisualAgent.instance = new DesignAndVisualAgent();
    }
    return DesignAndVisualAgent.instance;
  }

  /**
   * Genera una sugerencia de prompt visual inteligente basada en el contexto actual del usuario
   */
  public generateVisualPrompt(topic: string, category: VisualAssetPrompt['category']): VisualAssetPrompt {
    const profile = this.memoryStore.getCoreProfile();
    const aegisProfile = this.memoryStore.getAegisProfile();
    const targetKcal = aegisProfile.goals?.[0]?.targetKcal || 2100;

    let basePrompt = `A sleek, high-tech organic intelligence infographic for ${topic}. Deep black background #070709, glowing bioluminescent violet #7C3AED nodes, metallic gold #D6B36A pathways.`;

    if (category === 'metabolic_chart') {
      basePrompt += ` Featuring human metabolic pathways, glucose oxidation curves, target ${targetKcal} kcal balance readout, clean cybernetic biological vector graphics.`;
    } else if (category === 'agent_architecture') {
      basePrompt += ` Sovereign multi-agent network graph with central Aegis Core node and specialized supervisor agents linked with purple energy beams.`;
    } else if (category === 'ui_mockup') {
      basePrompt += ` Modern mobile glassmorphism UI card layout, rich typography, dark mode interface.`;
    }

    return {
      id: `vis_${Date.now()}`,
      topic,
      suggestedPrompt: basePrompt,
      aspectRatio: '16:9',
      category,
    };
  }

  /**
   * Obtiene la galería de activos gráficos del sistema
   */
  public getSystemVisualAssets(): VisualAssetPrompt[] {
    return [
      {
        id: 'vis_1',
        topic: 'Diagrama Fisiológico Lipólisis & Beta-Oxidación',
        suggestedPrompt: 'Futuristic biological metabolic pathway diagram, deep black #070709, violet #7C3AED and gold #D6B36A.',
        aspectRatio: '16:9',
        category: 'metabolic_chart',
        previewUrl: '/images/aion_metabolic_chart.jpg',
      },
      {
        id: 'vis_2',
        topic: 'Red Multiagente Soberana AION Aegis',
        suggestedPrompt: 'Multi-agent AI system architecture graph diagram, glowing purple violet energy links, glassmorphic UI.',
        aspectRatio: '16:9',
        category: 'agent_architecture',
        previewUrl: '/images/aion_agent_architecture.jpg',
      },
    ];
  }
}
