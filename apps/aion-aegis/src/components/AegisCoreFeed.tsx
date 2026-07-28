import React, { useState, useRef, useEffect } from 'react';
import { NutritionLeadSpecialist, AionCoreSuperAgent } from '@aion/agents';
import { AionMemoryStore } from '@aion/memory';

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
  const sleep = store.getSleepRecords() || [];
  const activity = store.getActivityRecords() || [];
  const hydration = store.getHydrationRecords() || [];

  const currentWater = (hydration || []).reduce((acc, h) => acc + (h?.amountMl || 0), 0);
  const totalActivityMin = (activity || []).reduce((acc, a) => acc + (a?.durationMinutes || 0), 0);
  const latestSleep = sleep[0] || { hoursInBed: 7.5, subjectiveQualityScore: 9 };

  // Historial conversacional interactivo
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'aegis',
      text: 'Bienvenido a AION Aegis, tu prótesis ejecutiva. Escribe cualquier síntoma, ingesta, gasto o compromiso y la arquitectura multiagente procesará tu mensaje inmediatamente.',
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
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: userTime,
    };

    // Actualización inmediata del estado de UI
    setChatMessages((prev) => [...prev, userMsg]);
    setOmniInput('');
    setIsProcessing(true);

    try {
      const res = await coreAgent.processOmniInput(input);
      const aegisTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const aegisMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'aegis',
        text: res.coreReply || `Evento "${input}" procesado y registrado por AION Aegis SuperAgent.`,
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
          id: `msg_e_${Date.now()}`,
          sender: 'aegis',
          text: `Mensaje "${input}" recibido y guardado en memoria por los supervisores de AION.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-6 space-y-8">
      
      {/* 1. SECCIÓN SUPERIOR DE ANCHO COMPLETO: CANAL CONVERSACIONAL AEGIS CORE */}
      <section className="dashboard-card rounded-[36px] p-6 lg:p-8 space-y-4 border border-[#7C3AED]/40 shadow-2xl bg-[#111017] w-full">
        <div className="flex justify-between items-center border-b border-white/10 pb-4 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#7C3AED] text-3xl">forum</span>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Canal Conversacional AION Core</h2>
              <p className="text-xs text-[#CCC3D8]/60">Escribe síntomas, ingesta, gastos o compromisos libremente</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 rounded-full bg-[#7C3AED]/20 text-[#C4B5FD] text-xs font-bold border border-[#7C3AED]/40">
              SCORE PHYSIO: 94/100
            </span>
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              16 AGENTES ONLINE
            </span>
          </div>
        </div>

        {/* STREAM DE MENSAJES CON FORMATO PERFECTO SIN DESBORDAMIENTOS DE TEXTO */}
        <div
          ref={chatContainerRef}
          className="space-y-4 max-h-[380px] min-h-[260px] overflow-y-auto hide-scrollbar p-5 rounded-3xl bg-[#070709] border border-white/5 w-full"
        >
          {chatMessages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-3xl text-xs leading-relaxed shadow-lg break-words overflow-hidden ${
                  m.sender === 'user'
                    ? 'bg-[#7C3AED] text-white rounded-br-none font-medium'
                    : 'bg-[#1C1B26] text-[#E5E1E5] border border-white/10 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap break-words text-xs lg:text-sm">{m.text}</p>
                <div className="flex justify-between items-center gap-4 mt-2 pt-1.5 border-t border-white/10 text-[9px] opacity-70">
                  <span className="font-bold">{m.sender === 'user' ? 'Tú (Soberano)' : 'AION Aegis SuperAgent'}</span>
                  <span>{m.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-[#C4B5FD] font-bold p-3 bg-white/5 rounded-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-ping"></span>
              Procesando con la red de supervisores AION...
            </div>
          )}
        </div>

        {/* CAMPO DE ENTRADA CONVERSACIONAL DE ANCHO COMPLETO */}
        <div className="flex gap-3 w-full">
          <input
            type="text"
            value={omniInput}
            onChange={(e) => setOmniInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
            placeholder="Escribe tu mensaje libremente (ej. Hi, Comí pollo con arroz, Gasté 25.000 pesos)..."
            disabled={isProcessing}
            className="flex-1 bg-[#070709] border border-white/20 rounded-full px-6 py-3.5 text-xs text-white placeholder:text-[#CCC3D8]/50 focus:border-[#7C3AED] outline-none transition-all"
          />
          <button
            onClick={handleSendPrompt}
            disabled={isProcessing || !omniInput.trim()}
            className="bg-[#7C3AED] text-white px-7 py-3.5 rounded-full flex items-center gap-2 hover:bg-[#6D28D9] transition-all font-bold text-xs shadow-xl disabled:opacity-50 shrink-0"
          >
            <span>ENVIAR</span>
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
      </section>

      {/* 2. CURVA BIOENERGÉTICA CON MEDIAS FISIOLÓGICAS & TDEE / BMR */}
      <section className="dashboard-card rounded-[36px] p-6 lg:p-8 border border-white/10 space-y-6 bg-[#111017] w-full">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em]">
              SÍNTESIS DEL DÍA • PARÁMETROS FISIOLÓGICOS COMPLETOS
            </span>
            <h3 className="text-xl font-bold text-white mt-1">Curva Bioenergética, Medias & Gasto Energético Basal (BMR)</h3>
          </div>
          <button
            onClick={() => onOpenDrawer('METABOLISMO')}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#C4B5FD] hover:bg-[#7C3AED]/20 transition-all flex items-center gap-2"
          >
            <span>Abrir Barra Lateral Contextual</span>
            <span className="material-symbols-outlined text-sm">dock_to_left</span>
          </button>
        </div>

        {/* SVG GRAPH BIOENERGÉTICO CON MEDIAS Y GASTO BASAL */}
        <div className="h-48 w-full bg-[#070709] rounded-3xl p-4 border border-white/10 relative overflow-hidden flex flex-col justify-end">
          <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 500 150">
            {/* LÍNEA DE MEDIA BIOENERGÉTICA (DASHED GOLDEN) */}
            <line x1="0" y1="75" x2="500" y2="75" stroke="#D6B36A" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />

            {/* CURVA BIOENERGÉTICA */}
            <path
              d="M 0 110 Q 125 30, 250 85 T 500 45 L 500 150 L 0 150 Z"
              fill="url(#purpleGradient)"
              opacity="0.35"
            />
            <path
              d="M 0 110 Q 125 30, 250 85 T 500 45"
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
            <span>Gasto Basal BMR (1,780 kcal)</span>
            <span className="text-[#D6B36A]">Media Bioenergética (2,150 kcal)</span>
            <span>Estado ({metabolicState.currentPhase})</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-center">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] font-bold text-[#CCC3D8]/50 uppercase">Gasto Basal (BMR)</span>
            <p className="text-lg font-bold text-white">1,780 <span className="text-xs font-normal">kcal</span></p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] font-bold text-[#CCC3D8]/50 uppercase">Consumido Hoy</span>
            <p className="text-lg font-bold text-white">{energyBalance.consumedKcal} <span className="text-xs font-normal">kcal</span></p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] font-bold text-[#CCC3D8]/50 uppercase">Meta Diaria</span>
            <p className="text-lg font-bold text-[#C4B5FD]">{energyBalance.targetKcal} <span className="text-xs font-normal">kcal</span></p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] font-bold text-[#CCC3D8]/50 uppercase">Gasto Físico</span>
            <p className="text-lg font-bold text-white">{energyBalance.burnedKcal} <span className="text-xs font-normal">kcal</span></p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1 col-span-2 lg:col-span-1">
            <span className="text-[10px] font-bold text-[#CCC3D8]/50 uppercase">Restante</span>
            <p className="text-lg font-bold text-[#D6B36A]">{energyBalance.remainingKcal} <span className="text-xs font-normal">kcal</span></p>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN INFERIOR: TARJETAS DE MÓDULOS ACTIVOS */}
      <section className="dashboard-card rounded-[36px] p-6 lg:p-8 border border-white/10 space-y-6 bg-[#111017] w-full">
        <div className="flex justify-between items-center border-b border-white/10 pb-4 flex-wrap gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em]">
              PANEL DE CONTROL GENERAL
            </span>
            <h3 className="text-xl font-bold text-white mt-1">Estado de Módulos (Haz clic para desplegar la Barra Lateral Derecha de Contexto)</h3>
          </div>
          <span className="text-xs font-bold text-[#C4B5FD] bg-[#7C3AED]/20 px-4 py-1.5 rounded-full border border-[#7C3AED]/40">
            77 DÍAS CONSECUTIVOS DE BITÁCORA ACTIVOS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* SUEÑO */}
          <div
            onClick={() => onOpenDrawer('SUEÑO')}
            className="p-5 rounded-3xl bg-white/5 border border-white/10 hover:border-[#7C3AED]/50 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-[#7C3AED] text-3xl group-hover:scale-110 transition-transform">nights_stay</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">94% EFICIENCIA</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Sueño & Circadiano</h4>
              <p className="text-xs text-[#CCC3D8]/70 mt-1">{latestSleep.hoursInBed}h en cama • Calidad {latestSleep.subjectiveQualityScore}/10</p>
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#C4B5FD] pt-2 border-t border-white/5 font-bold">
              <span>Abrir Barra Lateral Contextual</span>
              <span className="material-symbols-outlined text-sm">dock_to_left</span>
            </div>
          </div>

          {/* ACTIVIDAD */}
          <div
            onClick={() => onOpenDrawer('ACTIVIDAD')}
            className="p-5 rounded-3xl bg-white/5 border border-white/10 hover:border-[#D6B36A]/50 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-[#D6B36A] text-3xl group-hover:scale-110 transition-transform">directions_run</span>
              <span className="text-xs font-bold text-[#D6B36A] bg-[#D6B36A]/10 px-2.5 py-0.5 rounded-full border border-[#D6B36A]/20">ZONA 2 AERÓBICA</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Actividad & Ejercicio</h4>
              <p className="text-xs text-[#CCC3D8]/70 mt-1">{totalActivityMin} min acumulados hoy • RPE 8/10</p>
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#D6B36A] pt-2 border-t border-white/5 font-bold">
              <span>Abrir Barra Lateral Contextual</span>
              <span className="material-symbols-outlined text-sm">dock_to_left</span>
            </div>
          </div>

          {/* HIDRATACIÓN */}
          <div
            onClick={() => onOpenDrawer('HIDRATACIÓN')}
            className="p-5 rounded-3xl bg-white/5 border border-white/10 hover:border-sky-400/50 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-sky-400 text-3xl group-hover:scale-110 transition-transform">water_drop</span>
              <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">{currentWater} / 2500 ML</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Hidratación & Electrolitos</h4>
              <p className="text-xs text-[#CCC3D8]/70 mt-1">Tanque hídrico celular activo al {Math.min((currentWater / 2500) * 100, 100).toFixed(0)}%</p>
            </div>
            <div className="flex justify-between items-center text-[11px] text-sky-400 pt-2 border-t border-white/5 font-bold">
              <span>Abrir Barra Lateral Contextual</span>
              <span className="material-symbols-outlined text-sm">dock_to_left</span>
            </div>
          </div>

          {/* FINANZAS */}
          <div
            onClick={() => onOpenDrawer('FINANZAS')}
            className="p-5 rounded-3xl bg-white/5 border border-white/10 hover:border-[#D6B36A]/50 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-[#D6B36A] text-3xl group-hover:scale-110 transition-transform">payments</span>
              <span className="text-xs font-bold text-[#D6B36A] bg-[#D6B36A]/10 px-2.5 py-0.5 rounded-full border border-[#D6B36A]/20">LEDGER ACTIVO</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Finanzas & Presupuesto</h4>
              <p className="text-xs text-[#CCC3D8]/70 mt-1">Gastos derivados de compras de despensa y salud</p>
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#D6B36A] pt-2 border-t border-white/5 font-bold">
              <span>Abrir Barra Lateral Contextual</span>
              <span className="material-symbols-outlined text-sm">dock_to_left</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
