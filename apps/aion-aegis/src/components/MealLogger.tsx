import React, { useState } from 'react';
import { NutritionLeadSpecialist, DesignAndVisualAgent } from '@aion/agents';
import { MealRecord, VisionAnalysis } from '@aion/shared-types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'specialist';
  text: string;
  timestamp: string;
  visionAnalysis?: VisionAnalysis;
  showFractionSelector?: boolean;
  generatedImagePrompt?: string;
}

interface MealLoggerProps {
  onMealAdded: () => void;
}

export const MealLogger: React.FC<MealLoggerProps> = ({ onMealAdded }) => {
  const specialist = new NutritionLeadSpecialist();
  const visualAgent = DesignAndVisualAgent.getInstance();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'specialist',
      text: '¡Hola! Soy tu Especialista de Alimentación AION. Cuéntame qué comiste, sube una foto de tu plato o hazme cualquier consulta sobre nutrición y metabolismo.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pendingFraction, setPendingFraction] = useState<number>(0.2);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');

    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAnalyzing(true);

    try {
      const result = await specialist.processMealInput(userText, undefined, pendingFraction);

      // Invocación a DesignAndVisualAgent para síntesis de infografía
      const visualPrompt = visualAgent.generateVisualPrompt(userText, 'metabolic_chart');

      const agentMsg: ChatMessage = {
        id: `msg-a-${Date.now()}`,
        sender: 'specialist',
        text: result.agentReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        visionAnalysis: result.visionAnalysis,
        showFractionSelector: !!result.mealRecord,
        generatedImagePrompt: visualPrompt.suggestedPrompt,
      };

      setMessages((prev) => [...prev, agentMsg]);

      if (result.mealRecord) {
        onMealAdded();
      }
    } catch (e) {
      console.error('Error al procesar comida:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="dashboard-card rounded-[36px] p-6 lg:p-8 border border-[#7C3AED]/30 space-y-6 bg-[#111017]">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#7C3AED] text-3xl">restaurant</span>
          <div>
            <h2 className="text-xl font-bold text-white">Nutrición & Registro de Ingesta</h2>
            <p className="text-xs text-[#CCC3D8]/60">Especialista Líder en Nutrición Bioquímica</p>
          </div>
        </div>
        <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
          DESIGN & VISUAL AGENT ONLINE
        </span>
      </div>

      {/* HISTORIAL DE CONVERSACIÓN CON EL ESPECIALISTA */}
      <div className="space-y-4 max-h-[380px] overflow-y-auto hide-scrollbar p-4 rounded-3xl bg-[#070709] border border-white/5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-4 rounded-3xl text-xs leading-relaxed shadow-lg ${
                m.sender === 'user'
                  ? 'bg-[#7C3AED] text-white rounded-br-none font-medium'
                  : 'bg-white/10 text-[#E5E1E5] border border-white/10 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>

              {/* VISTA INFOGRÁFICA GENERADA POR DESIGN AND VISUAL AGENT */}
              {m.generatedImagePrompt && (
                <div className="mt-3 p-3 rounded-2xl bg-[#070709] border border-[#7C3AED]/30 space-y-2">
                  <div className="flex items-center gap-2 text-[#D6B36A] font-bold text-[10px]">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    <span>Infografía Bioquímica Generada por DesignAndVisualAgent</span>
                  </div>
                  <img
                    src="/images/aion_metabolic_chart.jpg"
                    alt="Generación Metabólica AION"
                    className="w-full h-36 object-cover rounded-xl border border-white/10"
                  />
                  <p className="text-[9px] text-[#CCC3D8]/50 italic">{m.generatedImagePrompt}</p>
                </div>
              )}

              <span className="text-[9px] opacity-50 block text-right mt-1">{m.timestamp}</span>
            </div>
          </div>
        ))}
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-xs text-[#C4B5FD] font-bold p-3 bg-white/5 rounded-2xl">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-ping"></span>
            Calculando densidad de macronutrientes y generando síntesis visual...
          </div>
        )}
      </div>

      {/* ENTRADA DE MENSAJE */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ej. Comí 180g de pechuga de pollo a la plancha con papa sabanera..."
          disabled={isAnalyzing}
          className="flex-1 bg-[#070709] border border-white/15 rounded-full px-6 py-3.5 text-xs text-white placeholder:text-[#CCC3D8]/40 focus:border-[#7C3AED] outline-none transition-all"
        />
        <button
          onClick={handleSendMessage}
          disabled={isAnalyzing || !inputText.trim()}
          className="bg-[#7C3AED] text-white px-7 py-3.5 rounded-full flex items-center gap-2 hover:bg-[#6D28D9] transition-all font-bold text-xs shadow-xl disabled:opacity-50"
        >
          <span>Registrar</span>
          <span className="material-symbols-outlined text-sm">send</span>
        </button>
      </div>
    </div>
  );
};
