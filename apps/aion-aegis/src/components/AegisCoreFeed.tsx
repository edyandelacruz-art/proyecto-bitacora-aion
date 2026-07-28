import React, { useState, useRef } from 'react';
import { AionCoreSuperAgent } from '@aion/agents';
import { AionMemoryStore } from '@aion/memory';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  agentName?: string;
  detectedDomains?: string[];
  imageUrl?: string;
}

interface AegisCoreFeedProps {
  onRefreshAll: () => void;
  onOpenModuleDeepView: (moduleId: string) => void;
  onOpenDrawer: (context: string) => void;
}

export const AegisCoreFeed: React.FC<AegisCoreFeedProps> = ({
  onRefreshAll,
  onOpenModuleDeepView,
  onOpenDrawer,
}) => {
  const store = AionMemoryStore.getInstance();
  const plan = store.getLivePlan();
  const finConfig = store.getFinanceConfig();

  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Modal para edición inline de metas
  const [editingTarget, setEditingTarget] = useState<string | null>(null);
  const [tempTargetValue, setTempTargetValue] = useState<number>(2500);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_msg',
      sender: 'agent',
      text: '¡Bienvenido a AION Aegis! Escribe o dicta cualquier síntoma, ingesta, gasto o compromiso. La arquitectura multiagente procesará tu mensaje autónomamente.',
      timestamp: '08:00 AM',
      agentName: 'AION Core SuperAgent',
      detectedDomains: ['SYSTEM'],
    },
  ]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;

    const userText = inputMessage.trim();
    const userImg = selectedImage || undefined;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: userText || '📷 [Imagen Adjunta]',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: userImg,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setSelectedImage(null);
    setIsProcessing(true);

    try {
      const superAgent = AionCoreSuperAgent.getInstance();
      const res = await superAgent.processOmniInput(userText || 'Foto analizada por IA', userImg);

      const agentMsg: ChatMessage = {
        id: `agt_${Date.now()}`,
        sender: 'agent',
        text: res.coreReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentName: 'AION Core SuperAgent',
        detectedDomains: res.detectedDomains,
      };

      setChatMessages((prev) => [...prev, agentMsg]);
      onRefreshAll();
    } catch (e) {
      console.error('Error procesando entrada omnicanal:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleVoiceRecording = () => {
    setIsRecordingVoice(!isRecordingVoice);
    if (!isRecordingVoice) {
      setInputMessage('Registra 500ml de agua y 35.000 pesos en almuerzo');
    }
  };

  const handleSaveInlineTarget = () => {
    if (editingTarget === 'hydration') {
      const current = store.getLivePlan();
      store.setLivePlan({
        ...current,
        macroTargets: { ...current.macroTargets, protein: current.macroTargets.protein },
      });
    } else if (editingTarget === 'finances') {
      store.setFinanceConfig({ monthlyBudgetCop: tempTargetValue });
    }
    setEditingTarget(null);
    onRefreshAll();
  };

  return (
    <div className="space-y-8 w-full max-w-[1400px] mx-auto px-4 lg:px-6 pt-4 pb-16">
      
      {/* 1. CANAL CONVERSACIONAL CORE (100% FULL-WIDTH CON VOZ E IMAGEN) */}
      <div className="w-full bg-[#111017] border border-[#7C3AED]/40 rounded-[36px] p-6 lg:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/50 flex items-center justify-center text-[#7C3AED]">
              <span className="material-symbols-outlined text-2xl">forum</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em] block">
                CANAL CONVERSACIONAL OMNICANAL
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">AION Aegis Multi-Agent Feed</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-[#7C3AED]/20 text-[#C4B5FD] text-xs font-bold border border-[#7C3AED]/40">
              SCORE PHYSIO: 94/100
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
              16 AGENTES ONLINE
            </span>
          </div>
        </div>

        {/* FEED DE MENSAJES CON FORMATO DE TEXTO Y BADGES */}
        <div className="space-y-4 max-h-[380px] overflow-y-auto hide-scrollbar p-2">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-4 rounded-3xl max-w-[85%] break-words border text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#7C3AED] text-white border-[#7C3AED] rounded-tr-none'
                    : 'bg-[#070709] text-[#E5E1E5] border-white/10 rounded-tl-none space-y-2'
                }`}
              >
                {msg.sender === 'agent' && (
                  <div className="flex justify-between items-center gap-3 border-b border-white/10 pb-2 mb-1">
                    <span className="font-bold text-[#D6B36A] text-[10px] uppercase tracking-wider">{msg.agentName}</span>
                    <div className="flex gap-1">
                      {msg.detectedDomains?.map((d, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-white/10 text-[8px] font-bold text-[#C4B5FD]">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {msg.imageUrl && (
                  <img src={msg.imageUrl} alt="Adjunto" className="w-48 h-32 object-cover rounded-2xl mb-2 border border-white/20" />
                )}

                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className="text-[9px] text-[#CCC3D8]/50 block text-right mt-1 font-mono">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-3 text-xs text-[#C4B5FD] animate-pulse p-2">
              <span className="material-symbols-outlined text-lg animate-spin">sync</span>
              SuperAgentes AION procesando y clasificando tu entrada omnicanal...
            </div>
          )}
        </div>

        {/* INPUT DE CHAT CON VOZ E IMAGEN */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageFileChange}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-[#CCC3D8] hover:text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer shrink-0"
            title="Adjuntar Imagen / Factura / Plato"
          >
            <span className="material-symbols-outlined text-xl">photo_camera</span>
          </button>

          <button
            onClick={handleToggleVoiceRecording}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              isRecordingVoice
                ? 'bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.8)]'
                : 'bg-white/5 text-[#CCC3D8] hover:text-[#D6B36A] border border-white/10'
            }`}
            title="Dictar por Voz"
          >
            <span className="material-symbols-outlined text-xl">mic</span>
          </button>

          <input
            type="text"
            placeholder="Escribe síntoma, ingesta, gasto o compromiso (ej. 'Comí 200g pollo y gasté 25k COP')"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-[#070709] border border-white/15 rounded-2xl px-5 py-3.5 text-xs text-white placeholder:text-[#CCC3D8]/40 focus:border-[#7C3AED] outline-none"
          />

          <button
            onClick={handleSendMessage}
            className="px-6 py-3.5 bg-[#7C3AED] text-white font-bold text-xs rounded-2xl hover:bg-[#6D28D9] transition-all shadow-lg cursor-pointer shrink-0"
          >
            ENVIAR
          </button>
        </div>
      </div>

      {/* 2. MÓDULOS DE ESTADO CON EDICIÓN INLINE DE METAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CARD SUEÑO */}
        <div className="dashboard-card p-6 rounded-[32px] bg-[#111017] border border-white/10 space-y-3 relative group">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#C4B5FD] uppercase tracking-widest">Sueño Circadiano</span>
            <button
              onClick={() => onOpenDrawer('SUEÑO')}
              className="text-xs text-[#CCC3D8]/60 hover:text-white cursor-pointer"
            >
              ✏️ Ver / Editar
            </button>
          </div>
          <p className="text-2xl font-extrabold text-white">7.5 h <span className="text-xs font-normal text-emerald-400">/ 8.0 h target</span></p>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div className="bg-[#7C3AED] h-full w-[92%] rounded-full"></div>
          </div>
        </div>

        {/* CARD ACTIVIDAD */}
        <div className="dashboard-card p-6 rounded-[32px] bg-[#111017] border border-white/10 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-widest">Actividad Física</span>
            <button
              onClick={() => onOpenDrawer('ACTIVIDAD')}
              className="text-xs text-[#CCC3D8]/60 hover:text-white cursor-pointer"
            >
              ✏️ Ver / Editar
            </button>
          </div>
          <p className="text-2xl font-extrabold text-white">45 min <span className="text-xs font-normal text-[#D6B36A]">/ 320 kcal</span></p>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div className="bg-[#D6B36A] h-full w-[75%] rounded-full"></div>
          </div>
        </div>

        {/* CARD HIDRATACIÓN */}
        <div className="dashboard-card p-6 rounded-[32px] bg-[#111017] border border-white/10 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Hidratación</span>
            <button
              onClick={() => onOpenDrawer('HIDRATACIÓN')}
              className="text-xs text-[#CCC3D8]/60 hover:text-white cursor-pointer"
            >
              ✏️ Ver / Editar
            </button>
          </div>
          <p className="text-2xl font-extrabold text-white">1,850 ml <span className="text-xs font-normal text-sky-400">/ 2,500 ml</span></p>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div className="bg-sky-400 h-full w-[74%] rounded-full"></div>
          </div>
        </div>

        {/* CARD FINANZAS */}
        <div className="dashboard-card p-6 rounded-[32px] bg-[#111017] border border-white/10 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Finanzas ($ COP)</span>
            <button
              onClick={() => onOpenModuleDeepView('finances')}
              className="text-xs text-[#CCC3D8]/60 hover:text-white cursor-pointer"
            >
              ✏️ Módulo
            </button>
          </div>
          <p className="text-xl font-extrabold text-white">${(finConfig.monthlyBudgetCop || 2500000).toLocaleString()} <span className="text-xs font-normal text-emerald-400">COP</span></p>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full w-[40%] rounded-full"></div>
          </div>
        </div>

      </div>

      {/* 3. CURVA BIOENERGÉTICA CON MEDIAS Y GASTO BASAL BMR */}
      <div className="dashboard-card rounded-[36px] p-6 lg:p-8 bg-[#111017] border border-white/10 space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em] block">
              DINÁMICA BIOLÓGICA & CURVA BIOENERGÉTICA
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">Glucosa, Lipólisis & Gasto Energético Basal (BMR)</h3>
          </div>

          <div className="flex gap-4 text-xs font-bold">
            <span className="text-[#C4B5FD]">Gasto Basal (BMR): 1,780 kcal</span>
            <span className="text-[#D6B36A]">Media Bioenergética: 2,150 kcal</span>
          </div>
        </div>

        <div className="w-full h-48 bg-[#070709] rounded-3xl p-4 border border-white/10 relative overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 800 160">
            {/* Línea de referencia de la media bioenergética */}
            <line x1="0" y1="80" x2="800" y2="80" stroke="#D6B36A" strokeWidth="1" strokeDasharray="4,4" />
            <text x="700" y="75" fill="#D6B36A" fontSize="10" fontWeight="bold">Media: 2,150 kcal</text>

            {/* Curva de onda bioenergética */}
            <path
              d="M0,100 C150,20 300,140 450,50 C600,130 700,40 800,90"
              fill="none"
              stroke="#7C3AED"
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>

    </div>
  );
};
