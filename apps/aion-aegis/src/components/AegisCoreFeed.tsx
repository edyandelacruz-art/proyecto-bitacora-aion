import React, { useState, useRef, useEffect } from 'react';
import { NutritionLeadSpecialist, AionCoreSuperAgent } from '@aion/agents';
import { AionMemoryStore } from '@aion/memory';
import { AegisTransversalExplainer } from './AegisTransversalExplainer';

interface AegisCoreFeedProps {
  onRefreshAll: () => void;
  onOpenModuleDeepView: (moduleId: string) => void;
  onOpenDrawer: (context: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'aegis';
  text: string;
  timestamp: string;
  domain?: string;
}

export const AegisCoreFeed: React.FC<AegisCoreFeedProps> = ({
  onRefreshAll,
  onOpenModuleDeepView,
  onOpenDrawer,
}) => {
  const store = AionMemoryStore.getInstance();
  const specialist = new NutritionLeadSpecialist();
  const coreAgent = AionCoreSuperAgent.getInstance();

  const metabolicState = specialist.getCurrentMetabolicState();
  const energyBalance = specialist.getCurrentEnergyBalance();
  const inventory = store.getInventory() || [];
  const sleep = store.getSleepRecords() || [];
  const activity = store.getActivityRecords() || [];
  const hydration = store.getHydrationRecords() || [];

  const currentWater = (hydration || []).reduce((acc, h) => acc + (h?.amountMl || 0), 0);
  const totalActivityMin = (activity || []).reduce((acc, a) => acc + (a?.durationMinutes || 0), 0);
  const latestSleep = sleep[0] || { hoursInBed: 7.5, subjectiveQualityScore: 9 };

  // Historial dinámico de mensajes conversacionales
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'aegis',
      text: 'Bienvenido a AION Aegis, tu prótesis ejecutiva. Escribe cualquier evento, ingesta, gasto o compromiso y la arquitectura multiagente lo procesará en tiempo real.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [omniInput, setOmniInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isProcessing]);

  const handleSendPrompt = async () => {
    const input = omniInput.trim();
    if (!input || isProcessing) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: userTime,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setOmniInput('');
    setIsProcessing(true);

    try {
      const res = await coreAgent.processOmniInput(input);
      const aegisTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const aegisMsg: ChatMessage = {
        id: `msg_aegis_${Date.now()}`,
        sender: 'aegis',
        text: res.coreReply || 'Evento procesado correctamente por AION Core SuperAgent.',
        timestamp: aegisTime,
        domain: res.detectedDomains?.[0],
      };

      setChatMessages((prev) => [...prev, aegisMsg]);
      onRefreshAll();
    } catch (e) {
      console.error('Error al procesar mensaje en AION Core:', e);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'aegis',
          text: 'Disculpa, ocurrió un inconveniente temporal procesando tu solicitud con el runtime de agentes.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* COLUMNA IZQUIERDA: CANAL CONVERSACIONAL AION CORE (lg:col-span-7) */}
      <div className="lg:col-span-7 space-y-8">
        
        {/* CHAT STREAM CONVERSACIONAL REAL STITCH 1:1 */}
        <section className="dashboard-card rounded-[36px] p-6 space-y-4 border border-[#7C3AED]/40 shadow-2xl bg-[#111017]">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#7C3AED] text-3xl">forum</span>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Canal Conversacional AION Core</h2>
                <p className="text-xs text-[#CCC3D8]/60">Prótesis ejecutiva & Orquestación Multiagente en vivo</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              16 AGENTES ONLINE
            </span>
          </div>

          {/* HISTORIAL STREAM DE MENSAJES */}
          <div
            ref={chatContainerRef}
            className="space-y-4 max-h-[360px] min-h-[260px] overflow-y-auto hide-scrollbar p-4 rounded-3xl bg-[#070709] border border-white/5"
          >
            {chatMessages.map((m) => (
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
                  <div className="flex justify-between items-center gap-4 mt-2 pt-1 border-t border-white/10 text-[9px] opacity-60">
                    <span>{m.sender === 'user' ? 'Tú (Soberano)' : 'AION Aegis SuperAgent'}</span>
                    <span>{m.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-center gap-2 text-xs text-[#C4B5FD] font-bold p-3 bg-white/5 rounded-2xl">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-ping"></span>
                Orquestando respuesta con los supervisores de dominio...
              </div>
            )}
          </div>

          {/* CAMPO DE ENTRADA CONVERSACIONAL */}
          <div className="flex gap-2">
            <input
              type="text"
              value={omniInput}
              onChange={(e) => setOmniInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
              placeholder="Escribe tu mensaje, ingesta, gasto o compromiso libremente..."
              disabled={isProcessing}
              className="flex-1 bg-[#070709] border border-white/15 rounded-full px-6 py-3.5 text-xs text-white placeholder:text-[#CCC3D8]/40 focus:border-[#7C3AED] outline-none transition-all shadow-inner"
            />
            <button
              onClick={() => handleSendPrompt()}
              disabled={isProcessing || !omniInput.trim()}
              className="bg-[#7C3AED] text-white px-7 py-3.5 rounded-full flex items-center gap-2 hover:bg-[#6D28D9] transition-all font-bold text-xs shadow-xl disabled:opacity-50"
            >
              <span>Enviar</span>
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>

          {/* CAPACIDAD TRANSVERSAL DE EXPLICACIÓN */}
          <AegisTransversalExplainer
            contextName="Aegis Core Feed & Conversación Principal"
            domain="metabolism"
            compact={true}
          />
        </section>

        {/* SÍNTESIS DEL DÍA CARD STITCH 1:1 WITH SVG GRAPH */}
        <section className="dashboard-card rounded-[36px] p-6 lg:p-8 border border-white/10 space-y-6 bg-[#111017]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em]">
                SÍNTESIS DEL DÍA • FASE METABÓLICA
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Curva Bioenergética & Balance</h3>
            </div>
            <button
              onClick={() => onOpenModuleDeepView('metabolism')}
              className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#C4B5FD] hover:bg-[#7C3AED]/20 transition-all flex items-center gap-1"
            >
              <span>Profundizar</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </button>
          </div>

          {/* SVG ENERGÍA & GLUCOSA ONDA STITCH */}
          <div className="h-44 w-full bg-[#070709] rounded-3xl p-4 border border-white/10 relative overflow-hidden flex flex-col justify-end">
            <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 500 150">
              <path
                d="M 0 100 Q 125 20, 250 80 T 500 40 L 500 150 L 0 150 Z"
                fill="url(#purpleGradient)"
                opacity="0.4"
              />
              <path
                d="M 0 100 Q 125 20, 250 80 T 500 40"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="4"
              />
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
            <div className="relative z-10 flex justify-between text-xs font-bold text-[#CCC3D8] px-4 pb-2">
              <span>Ayuno Matutino (Lipólisis)</span>
              <span>Postprandial (Glucosa Estable)</span>
              <span>Estado Actual ({metabolicState.currentPhase})</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-[#CCC3D8]/50 uppercase">Consumido</span>
              <p className="text-lg font-bold text-white">{energyBalance.consumedKcal} <span className="text-xs font-normal">kcal</span></p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-[#CCC3D8]/50 uppercase">Meta Diaria</span>
              <p className="text-lg font-bold text-[#C4B5FD]">{energyBalance.targetKcal} <span className="text-xs font-normal">kcal</span></p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-[#CCC3D8]/50 uppercase">Gasto Físico</span>
              <p className="text-lg font-bold text-white">{energyBalance.burnedKcal} <span className="text-xs font-normal">kcal</span></p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-[#CCC3D8]/50 uppercase">Restante</span>
              <p className="text-lg font-bold text-[#D6B36A]">{energyBalance.remainingKcal} <span className="text-xs font-normal">kcal</span></p>
            </div>
          </div>
        </section>
      </div>

      {/* COLUMNA DERECHA: MÓDULOS DE ESTADO (lg:col-span-5) */}
      <div className="lg:col-span-5 space-y-8">
        <section className="dashboard-card rounded-[36px] p-6 lg:p-8 border border-white/10 space-y-6 bg-[#111017]">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white">Estado de Módulos Activos</h3>
            <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-widest">SISTEMA COMPLETO</span>
          </div>

          <div className="space-y-4">
            {/* SUEÑO */}
            <div
              onClick={() => onOpenModuleDeepView('sleep')}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#7C3AED]/40 transition-all cursor-pointer flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#7C3AED] text-2xl">nights_stay</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Sueño & Circadiano</h4>
                  <p className="text-[10px] text-[#CCC3D8]/60">{latestSleep.hoursInBed}h en cama • Calidad {latestSleep.subjectiveQualityScore}/10</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#C4B5FD] text-sm">chevron_right</span>
            </div>

            {/* ACTIVIDAD */}
            <div
              onClick={() => onOpenModuleDeepView('activity')}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D6B36A]/40 transition-all cursor-pointer flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#D6B36A] text-2xl">directions_run</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Actividad & Ejercicio</h4>
                  <p className="text-[10px] text-[#CCC3D8]/60">{totalActivityMin} min hoy • Zona 2 Aeróbica</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#D6B36A] text-sm">chevron_right</span>
            </div>

            {/* HIDRATACIÓN */}
            <div
              onClick={() => onOpenModuleDeepView('hydration')}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-400/40 transition-all cursor-pointer flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-sky-400 text-2xl">water_drop</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Hidratación & Electrolitos</h4>
                  <p className="text-[10px] text-[#CCC3D8]/60">{currentWater} / 2500 ml acumulados</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-sky-400 text-sm">chevron_right</span>
            </div>

            {/* FINANZAS */}
            <div
              onClick={() => onOpenModuleDeepView('finances')}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D6B36A]/40 transition-all cursor-pointer flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#D6B36A] text-2xl">payments</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Finanzas & Ledger</h4>
                  <p className="text-[10px] text-[#CCC3D8]/60">Gastos basados en transacciones del Ledger</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#D6B36A] text-sm">chevron_right</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
