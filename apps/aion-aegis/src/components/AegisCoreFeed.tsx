import React, { useState } from 'react';
import { NutritionLeadSpecialist, AionCoreSuperAgent, OmniDispatchResult } from '@aion/agents';
import { AionMemoryStore } from '@aion/memory';
import { SatelliteModuleConfig } from '@aion/shared-types';

interface AegisCoreFeedProps {
  onRefreshAll: () => void;
  onOpenModuleDeepView: (moduleId: string) => void;
  onOpenInspector: (topic: string) => void;
}

export const AegisCoreFeed: React.FC<AegisCoreFeedProps> = ({
  onRefreshAll,
  onOpenModuleDeepView,
  onOpenInspector,
}) => {
  const store = AionMemoryStore.getInstance();
  const specialist = new NutritionLeadSpecialist();
  const coreAgent = AionCoreSuperAgent.getInstance();

  const metabolicState = specialist.getCurrentMetabolicState();
  const energyBalance = specialist.getCurrentEnergyBalance();
  const plan = store.getLivePlan();
  const inventory = store.getInventory() || [];
  const sleep = store.getSleepRecords() || [];
  const activity = store.getActivityRecords() || [];
  const hydration = store.getHydrationRecords() || [];

  const currentWater = (hydration || []).reduce((acc, h) => acc + (h?.amountMl || 0), 0);
  const totalActivityMin = (activity || []).reduce((acc, a) => acc + (a?.durationMinutes || 0), 0);
  const expiringItems = (inventory || []).filter((i) => i && (i.availability === 'PRÓXIMO A VENCER' || i.availability === 'BAJO'));

  const [omniInput, setOmniInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastDispatch, setLastDispatch] = useState<OmniDispatchResult | null>(null);

  // Módulos Satélite Configurables
  const [satellites, setSatellites] = useState<SatelliteModuleConfig[]>([
    { moduleId: 'nutrition', title: 'Nutrición & Balance', category: 'Alimentación & Hogar', visibility: 'pinned', order: 1 },
    { moduleId: 'metabolism', title: 'Estado Metabólico', category: 'Mi Estado', visibility: 'pinned', order: 2 },
    { moduleId: 'sleep', title: 'Sueño & Recuperación', category: 'Cuidado Diario', visibility: 'normal', order: 3 },
    { moduleId: 'activity', title: 'Actividad & RPE', category: 'Cuidado Diario', visibility: 'normal', order: 4 },
    { moduleId: 'hydration', title: 'Hidratación', category: 'Cuidado Diario', visibility: 'normal', order: 5 },
    { moduleId: 'pantry', title: 'Despensa & Compras', category: 'Alimentación & Hogar', visibility: 'normal', order: 6 },
    { moduleId: 'plan', title: 'Plan Vivo', category: 'Planificación', visibility: 'normal', order: 7 },
  ]);

  const togglePin = (moduleId: string) => {
    setSatellites((prev) =>
      prev.map((s) => (s.moduleId === moduleId ? { ...s, visibility: s.visibility === 'pinned' ? 'normal' : 'pinned' } : s))
    );
  };

  const toggleMinimize = (moduleId: string) => {
    setSatellites((prev) =>
      prev.map((s) => (s.moduleId === moduleId ? { ...s, visibility: s.visibility === 'minimized' ? 'normal' : 'minimized' } : s))
    );
  };

  const hideModule = (moduleId: string) => {
    setSatellites((prev) => prev.map((s) => (s.moduleId === moduleId ? { ...s, visibility: 'hidden' } : s)));
  };

  const restoreModule = (moduleId: string) => {
    setSatellites((prev) => prev.map((s) => (s.moduleId === moduleId ? { ...s, visibility: 'normal' } : s)));
  };

  const handleSendPrompt = async (textToSend?: string) => {
    const input = (textToSend || omniInput).trim();
    if (!input) return;

    setOmniInput('');
    setIsProcessing(true);

    try {
      const res = await coreAgent.processOmniInput(input);
      setLastDispatch(res);
      onRefreshAll();
    } catch (e) {
      console.error('Error al procesar entrada:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      {/* 1. COMPOSER CONVERSACIONAL GOOGLE STITCH */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="font-['Manrope'] text-xs text-white/50 flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Sistemas activos • Aegis Core
            </p>
            <h1 className="font-['Hanken_Grotesk'] text-2xl lg:text-3xl text-white font-semibold tracking-tight">
              Estado actual, ¿qué reportamos?
            </h1>
          </div>
          <button
            onClick={() => onOpenInspector('biochemistry')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/10 text-[#C4B5FD] font-['Manrope'] text-[10px] hover:bg-[#7C3AED]/20 transition-all font-bold tracking-widest uppercase"
          >
            ANÁLISIS BIOQUÍMICO <span className="material-symbols-outlined text-sm">auto_graph</span>
          </button>
        </div>

        {/* GLASS COMPOSER SURFACE */}
        <div className="glass-surface p-6 rounded-[32px] focus-within:ring-2 focus-within:ring-[#7C3AED]/30 transition-all shadow-2xl relative overflow-hidden">
          <textarea
            className="bg-transparent border-none focus:ring-0 w-full resize-none font-['Manrope'] text-base text-white placeholder:text-white/20 min-h-[90px] outline-none"
            placeholder="Describe síntomas, ingestas, compras o eventos..."
            value={omniInput}
            onChange={(e) => setOmniInput(e.target.value)}
          />

          {/* SUGERENCIAS RÁPIDAS EN CHIPS */}
          <div className="flex gap-2 flex-wrap mt-2">
            {[
              '🍗 "Comí 200g de pollo salteado con papa"',
              '😴 "Dormí 7.5h y me siento renovado"',
              '💧 "Tomé 500ml de agua"',
              '💸 "Gasté 20.000 COP en la tienda"',
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(chip.replace(/^[^"]*"|"$|"/g, ''))}
                className="bg-white/5 border border-white/10 text-white/70 hover:text-white rounded-full px-3 py-1 text-[11px] font-medium transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-full text-white/60 hover:bg-[#7C3AED]/10 hover:text-[#C4B5FD] transition-all" title="Voz">
                <span className="material-symbols-outlined">mic</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full text-white/60 hover:bg-[#7C3AED]/10 hover:text-[#C4B5FD] transition-all" title="Cámara">
                <span className="material-symbols-outlined">photo_camera</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full text-white/60 hover:bg-[#7C3AED]/10 hover:text-[#C4B5FD] transition-all" title="Archivos">
                <span className="material-symbols-outlined">clinical_notes</span>
              </button>
            </div>
            <button
              onClick={() => handleSendPrompt()}
              disabled={isProcessing || !omniInput.trim()}
              className="bg-[#7C3AED] text-white px-8 py-3 rounded-full flex items-center gap-2 hover:bg-[#6D28D9] hover:shadow-[0_8px_25px_rgba(124,58,237,0.4)] transition-all font-['Manrope'] text-[11px] tracking-widest font-bold uppercase disabled:opacity-50"
            >
              {isProcessing ? 'PROCESANDO...' : 'REGISTRAR EVENTO'} <span className="material-symbols-outlined text-sm">bolt</span>
            </button>
          </div>
        </div>

        {/* RECIBO DE ACCIÓN OMNICANAL */}
        {lastDispatch && (
          <div className="bg-[#111017] border border-[#7C3AED]/40 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-emerald-400">
              <span>✓ RESPUESTA PROCESADA POR AEGIS CORE</span>
              <span className="text-white/40">Confiabilidad: 95%</span>
            </div>
            <p className="text-sm text-white">{lastDispatch.coreReply}</p>
          </div>
        )}
      </section>

      {/* 2. SÍNTESIS DEL DÍA GOOGLE STITCH */}
      <section className="dashboard-card rounded-[36px] p-6 lg:p-8 relative overflow-hidden space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Síntesis del Día <span className="material-symbols-outlined text-[#D6B36A] animate-pulse">auto_awesome</span>
            </h3>
            <p className="text-xs text-white/50">{metabolicState.naturalExplanation}</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7C3AED]"></span>
              <span className="text-[10px] text-white font-bold tracking-widest">ENERGÍA</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D6B36A]"></span>
              <span className="text-[10px] text-white font-bold tracking-widest">ACTIVIDAD</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-surface p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Balance Energético</p>
            <p className="text-2xl font-bold text-[#D6B36A] mt-1">{energyBalance.consumedKcal - energyBalance.targetKcal} <span className="text-xs font-normal opacity-60">kcal</span></p>
            <p className="text-[10px] text-emerald-400 font-bold uppercase mt-1">Estado: {energyBalance.state}</p>
          </div>

          <div className="glass-surface p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Gasto Calórico Est.</p>
            <p className="text-2xl font-bold text-white mt-1">≈{activity.reduce((acc, a) => acc + a.estimatedKcalBurned, 0)} <span className="text-xs font-normal opacity-60">kcal</span></p>
            <p className="text-[10px] text-[#C4B5FD] font-bold uppercase mt-1">{totalActivityMin} min ejercicio</p>
          </div>

          <div className="glass-surface p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Proteína acumulada</p>
            <p className="text-2xl font-bold text-white mt-1">{plan.macroConsumed.protein} <span className="text-xs font-normal opacity-60">/ {plan.macroTargets.protein}g</span></p>
            <p className="text-[10px] text-emerald-400 font-bold uppercase mt-1">Preservación magra</p>
          </div>
        </div>
      </section>

      {/* 3. AEGIS DETECTA (ALERTAS INTELLIGENTES) */}
      {expiringItems.length > 0 && (
        <div className="bg-[#D6B36A]/10 border border-[#D6B36A]/30 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#D6B36A]">warning</span>
            <div>
              <p className="text-xs font-bold text-[#D6B36A]">AEGIS DETECTA: Alimentos próximos a vencer</p>
              <p className="text-[11px] text-white/60">{expiringItems.map((i) => i.name).join(', ')} en refrigerador.</p>
            </div>
          </div>
          <button
            onClick={() => onOpenModuleDeepView('recipes')}
            className="px-3 py-1.5 rounded-lg border border-[#D6B36A] text-[#D6B36A] text-[11px] font-bold hover:bg-[#D6B36A]/20 transition-colors"
          >
            💡 Ver Recetas
          </button>
        </div>
      )}

      {/* 4. MÓDULOS SATÉLITE CONFIGURABLES (MIS MÓDULOS) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-[#C4B5FD] tracking-widest uppercase">MIS MÓDULOS SATÉLITE</h3>
          <span className="text-[11px] text-white/40">Fijar (📌) | Minimizar (_) | Ocultar (✕)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {satellites
            .filter((s) => s.visibility !== 'hidden')
            .map((s) => {
              const isMinimized = s.visibility === 'minimized';
              const isPinned = s.visibility === 'pinned';

              return (
                <div
                  key={s.moduleId}
                  className={`dashboard-card rounded-2xl p-5 space-y-3 transition-all ${
                    isPinned ? 'border-[#7C3AED]/40 bg-[#7C3AED]/5' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{s.title}</span>
                    <div className="flex gap-1">
                      <button onClick={() => togglePin(s.moduleId)} className={`p-1 text-xs hover:text-white ${isPinned ? 'text-[#7C3AED]' : 'text-white/40'}`} title="Fijar">
                        <span className="material-symbols-outlined text-sm">push_pin</span>
                      </button>
                      <button onClick={() => toggleMinimize(s.moduleId)} className="p-1 text-xs text-white/40 hover:text-white" title="Minimizar">
                        <span className="material-symbols-outlined text-sm">{isMinimized ? 'expand_more' : 'remove'}</span>
                      </button>
                      <button onClick={() => hideModule(s.moduleId)} className="p-1 text-xs text-white/40 hover:text-white" title="Ocultar">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                      <button onClick={() => onOpenModuleDeepView(s.moduleId)} className="p-1 text-xs text-[#C4B5FD] hover:text-white" title="Profundidad">
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </button>
                    </div>
                  </div>

                  {!isMinimized && (
                    <div className="text-xs text-white/60 space-y-1">
                      {s.moduleId === 'nutrition' && (
                        <p>Kcal: <strong className="text-white">{energyBalance.consumedKcal}</strong> / {energyBalance.targetKcal} • Proteína: <strong className="text-emerald-400">{plan.macroConsumed.protein}g</strong></p>
                      )}
                      {s.moduleId === 'metabolism' && (
                        <p>Fase: <strong className="text-white">{metabolicState.currentPhase}</strong> ({metabolicState.hoursElapsedSinceLastMeal?.toFixed(1)}h ayuno)</p>
                      )}
                      {s.moduleId === 'sleep' && (
                        <p>Sueño: <strong className="text-white">{sleep[0]?.hoursInBed || 7.5}h</strong> (Calidad: {sleep[0]?.subjectiveQualityScore || 8}/10)</p>
                      )}
                      {s.moduleId === 'activity' && (
                        <p>Ejercicio: <strong className="text-white">{totalActivityMin} min</strong> acumulados</p>
                      )}
                      {s.moduleId === 'hydration' && (
                        <p>Agua: <strong className="text-sky-400">{currentWater} / 2500 ml</strong></p>
                      )}
                      {s.moduleId === 'pantry' && (
                        <p>Existencias: <strong className="text-white">{inventory.length} alimentos</strong> en despensa</p>
                      )}
                      {s.moduleId === 'plan' && (
                        <p>Próximo: <strong className="text-white">{plan.plannedItems[0]?.title || 'Almuerzo'}</strong> ({plan.plannedItems[0]?.scheduledTime || '14:00'})</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* RESTAURAR OCULTOS */}
        {satellites.some((s) => s.visibility === 'hidden') && (
          <div className="flex gap-2 items-center flex-wrap pt-2">
            <span className="text-[11px] text-white/40">Módulos ocultos:</span>
            {satellites
              .filter((s) => s.visibility === 'hidden')
              .map((s) => (
                <button
                  key={s.moduleId}
                  onClick={() => restoreModule(s.moduleId)}
                  className="px-2.5 py-1 rounded-lg border border-dashed border-white/10 text-[#C4B5FD] text-[11px] hover:border-[#7C3AED]"
                >
                  + Restaurar {s.title}
                </button>
              ))}
          </div>
        )}
      </section>
    </div>
  );
};
