import React, { useState } from 'react';
import { AionCoreSuperAgent } from '@aion/agents';

interface ModuleAgentChatWidgetProps {
  moduleId: string;
  agentName: string;
  agentRole: string;
  agentIcon: string;
  placeholderText: string;
  onRefreshAll: () => void;
}

export const ModuleAgentChatWidget: React.FC<ModuleAgentChatWidgetProps> = ({
  moduleId,
  agentName,
  agentRole,
  agentIcon,
  placeholderText,
  onRefreshAll,
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; timestamp: string }>>([
    {
      sender: 'agent',
      text: `Hola, soy ${agentName} (${agentRole}). ¿En qué puedo asistirte o evaluar en este módulo de ${moduleId}?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const superAgent = AionCoreSuperAgent.getInstance();

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userMsg = inputText.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: userMsg, timestamp: timeStr }]);
    setInputText('');
    setIsProcessing(true);

    try {
      // Invocación completa a la arquitectura multiagente AION
      const result = await superAgent.processOmniInput(userMsg);
      const agentReply = result.coreReply || (result as any).agentReply || 'Registro procesado exitosamente por el supervisor especializado.';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: agentReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      onRefreshAll();
    } catch (e) {
      console.error('Error al procesar consulta de agente:', e);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: 'Error de comunicación con el Runtime de Agentes. Intenta nuevamente.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="dashboard-card rounded-[32px] p-6 space-y-4 border border-[#7C3AED]/30 shadow-xl bg-[#111017]">
      {/* HEADER DEL AGENTE ESPECIALISTA */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#C4B5FD]">
            <span className="material-symbols-outlined">{agentIcon}</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {agentName}
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-bold border border-emerald-500/30">
                AGENTE ASIGNADO
              </span>
            </h3>
            <p className="text-[11px] text-[#CCC3D8]/60">{agentRole}</p>
          </div>
        </div>

        <span className="text-[10px] text-[#D6B36A] font-bold tracking-widest uppercase">
          AEGIS CONTEXTUAL ASSISTANT
        </span>
      </div>

      {/* HISTORIAL DE CHAT */}
      <div className="space-y-3 max-h-[220px] overflow-y-auto hide-scrollbar p-3 rounded-2xl bg-[#070709] border border-white/5">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                m.sender === 'user'
                  ? 'bg-[#7C3AED] text-white rounded-br-none'
                  : 'bg-white/10 text-[#E5E1E5] border border-white/10 rounded-bl-none'
              }`}
            >
              <p className="leading-relaxed">{m.text}</p>
              <span className="text-[9px] opacity-50 block text-right mt-1">{m.timestamp}</span>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-[#C4B5FD] font-bold p-2">
            <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-ping"></span>
            Procesando consulta con la arquitectura multiagente...
          </div>
        )}
      </div>

      {/* CAMPO DE ENTRADA Y ENVÍO */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={placeholderText}
          disabled={isProcessing}
          className="flex-1 bg-[#070709] border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-[#CCC3D8]/40 focus:border-[#7C3AED] outline-none transition-all"
        />
        <button
          onClick={handleSendMessage}
          disabled={isProcessing}
          className="px-5 py-2.5 rounded-2xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-all flex items-center gap-1 shadow-lg"
        >
          <span className="material-symbols-outlined text-base">send</span>
          Enviar
        </button>
      </div>
    </div>
  );
};
