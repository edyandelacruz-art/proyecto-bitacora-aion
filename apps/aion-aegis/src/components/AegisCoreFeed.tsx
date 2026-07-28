import React, { useState } from 'react';
import { NutritionLeadSpecialist, AionCoreSuperAgent, OmniDispatchResult } from '@aion/agents';
import { AionMemoryStore } from '@aion/memory';

import { AegisTransversalExplainer } from './AegisTransversalExplainer';

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
    <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* COLUMNA IZQUIERDA: PULSO & COMPOSER (lg:col-span-7) */}
      <div className="lg:col-span-7 space-y-8">
        {/* COMPOSER */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="font-['Manrope'] text-xs text-[#E5E1E5]/50 flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Sistemas activos • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <h1 className="font-['Hanken_Grotesk'] text-2xl lg:text-3xl text-[#E5E1E5] font-semibold tracking-tight">
                Estado actual, ¿qué reportamos?
              </h1>
            </div>
            <button
              onClick={() => onOpenDrawer('METABOLISMO')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 text-[#7C3AED] font-['Manrope'] text-[10px] hover:bg-[#7C3AED]/20 transition-all font-bold tracking-widest uppercase shadow-lg shadow-[#7C3AED]/5"
            >
              ANÁLISIS PROFUNDO <span className="material-symbols-outlined text-sm">auto_graph</span>
            </button>
          </div>

          {/* COMPOSER CARD STITCH 1:1 */}
          <div className="glass-surface p-6 rounded-[40px] focus-within:ring-2 focus-within:ring-[#7C3AED]/20 transition-all shadow-2xl relative overflow-hidden group/composer">
            <textarea
              className="bg-transparent border-none focus:ring-0 w-full resize-none font-['Manrope'] text-base text-[#E5E1E5] placeholder:text-[#CCC3D8]/20 min-h-[90px] outline-none"
              placeholder="Describe síntomas, ingestas o eventos..."
              value={omniInput}
              onChange={(e) => setOmniInput(e.target.value)}
            />

            {/* CHIPS DE ACCIÓN RÁPIDA */}
            <div className="flex gap-2 flex-wrap mt-2">
              {[
                '🍗 "Comí 200g de pollo con papa"',
                '😴 "Dormí 7.5h renovado"',
                '💧 "Tomé 500ml de agua"',
                '💸 "Gasté 20.000 COP"',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(chip.replace(/^[^"]*"|"$|"/g, ''))}
                  className="bg-white/5 border border-white/10 text-[#E5E1E5]/70 hover:text-[#7C3AED] hover:border-[#7C3AED]/40 rounded-full px-3 py-1 text-[11px] font-medium transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5 relative z-10">
              <div className="flex gap-2">
                <button className="w-11 h-11 flex items-center justify-center rounded-full text-[#CCC3D8] hover:bg-[#7C3AED]/10 hover:text-[#7C3AED] transition-all" title="Voz">
                  <span className="material-symbols-outlined">mic</span>
                </button>
                <button className="w-11 h-11 flex items-center justify-center rounded-full text-[#CCC3D8] hover:bg-[#7C3AED]/10 hover:text-[#7C3AED] transition-all" title="Cámara">
                  <span className="material-symbols-outlined">photo_camera</span>
                </button>
                <button className="w-11 h-11 flex items-center justify-center rounded-full text-[#CCC3D8] hover:bg-[#7C3AED]/10 hover:text-[#7C3AED] transition-all" title="Archivos">
                  <span className="material-symbols-outlined">clinical_notes</span>
                </button>
              </div>
              <button
                onClick={() => handleSendPrompt()}
                disabled={isProcessing || !omniInput.trim()}
                className="bg-[#7C3AED] text-white px-8 py-3.5 rounded-full flex items-center gap-3 hover:shadow-[0_12px_30px_rgba(124,58,237,0.4)] hover:scale-105 transition-all font-['Manrope'] text-[11px] tracking-[0.2em] font-bold uppercase disabled:opacity-50"
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

          {/* CAPACIDAD TRANSVERSAL DE EXPLICACIÓN EN LENGUAJE NATURAL */}
          <AegisTransversalExplainer
            contextName="Aegis Core Feed & Metabolismo General"
            domain="metabolism"
          />
        </section>

        {/* SÍNTESIS DEL DÍA CARD STITCH 1:1 WITH SVG GRAPH */}
        <section className="dashboard-card rounded-[48px] p-8 lg:p-10 relative overflow-hidden space-y-6">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-[#E5E1E5] flex items-center gap-2">
                Síntesis del Día
                <span className="material-symbols-outlined text-[#D6B36A] animate-pulse">auto_awesome</span>
              </h3>
              <p className="text-[12px] text-[#CCC3D8]/60 font-medium">{metabolicState.naturalExplanation}</p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7C3AED] shadow-[0_0_8px_#7c3aed]"></span>
                <span className="text-[10px] text-[#E5E1E5] font-bold tracking-widest uppercase">ENERGÍA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D6B36A] shadow-[0_0_8px_#D6B36A]"></span>
                <span className="text-[10px] text-[#E5E1E5] font-bold tracking-widest uppercase">ACTIVIDAD</span>
              </div>
            </div>
          </div>

          {/* VISUAL DATA AREA (SVG GRAPH 1:1 STITCH) */}
          <div className="h-64 w-full relative mb-4">
            <div className="absolute inset-0 flex flex-col justify-between z-10 pointer-events-none">
              <div className="flex justify-between items-start pointer-events-auto">
                <div className="bg-[#111017]/80 backdrop-blur-md p-4 lg:p-5 rounded-3xl border border-white/5 shadow-xl">
                  <p className="text-[9px] font-bold text-[#CCC3D8] uppercase tracking-[0.2em] mb-1">Balance Energético</p>
                  <p className="text-3xl font-bold text-[#D6B36A]">{energyBalance.consumedKcal - energyBalance.targetKcal} <span className="text-sm font-medium opacity-60">kcal</span></p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <p className="text-[10px] text-[#E5E1E5] font-bold uppercase tracking-wider">Estado: {energyBalance.state}</p>
                  </div>
                </div>

                <div className="flex gap-3 pointer-events-auto">
                  <div className="text-right glass-surface px-4 py-2.5 rounded-2xl">
                    <p className="text-[9px] font-bold text-[#CCC3D8]/40 uppercase tracking-widest">Ingesta</p>
                    <p className="text-base font-bold text-[#E5E1E5]">{energyBalance.consumedKcal} kcal</p>
                  </div>
                  <div className="text-right glass-surface px-4 py-2.5 rounded-2xl">
                    <p className="text-[9px] font-bold text-[#CCC3D8]/40 uppercase tracking-widest">Gasto Est.</p>
                    <p className="text-base font-bold text-[#E5E1E5]">{energyBalance.targetKcal} kcal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CURVA SVG STITCH */}
            <div className="absolute inset-0 group cursor-crosshair">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="energyGradMain" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,80 Q25,60 50,75 T100,20 L100,100 L0,100 Z" fill="url(#energyGradMain)" />
                <path d="M0,80 Q25,60 50,75 T100,20" fill="none" stroke="#7c3aed" strokeWidth="2" />
                <path d="M0,90 C30,85 70,55 100,45" fill="none" stroke="#D6B36A" strokeDasharray="4 4" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#CCC3D8]/40 font-bold uppercase tracking-[0.2em] border-t border-white/5 pt-4">
            <span>00:00</span>
            <span className="bg-[#D6B36A]/10 text-[#D6B36A] px-4 py-1 rounded-full text-[9px] tracking-widest">ESTIMACIÓN PROVISIONAL</span>
            <span>AHORA</span>
          </div>
        </section>
      </div>

      {/* COLUMNA DERECHA: ESTADO DE MÓDULOS (lg:col-span-5) */}
      <div className="lg:col-span-5 flex flex-col">
        <div className="sticky top-24 space-y-6">
          <div className="dashboard-card rounded-[32px] p-6 flex flex-col min-h-[720px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-[#E5E1E5]">Estado de Módulos</h3>
              <span className="px-2.5 py-1 rounded bg-[#7C3AED]/10 text-[#7C3AED] text-[9px] font-bold tracking-[0.2em] uppercase">Sincronizado</span>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto hide-scrollbar pr-1">
              {/* CATEGORÍA: VITALES */}
              <div className="space-y-3">
                <p className="text-[9px] font-bold text-[#CCC3D8]/30 uppercase tracking-[0.2em] mb-2 px-1">Vitales</p>

                {/* SUEÑO MODULE CARD STITCH 1:1 */}
                <div
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 cursor-pointer transition-all group"
                  onClick={() => onOpenDrawer('SUEÑO')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#7C3AED]">nights_stay</span>
                      <div>
                        <p className="text-[11px] font-bold text-[#E5E1E5]">Sueño & Recuperación</p>
                        <p className="text-[9px] text-[#CCC3D8]/60 uppercase font-bold tracking-wider">
                          {sleep[0]?.hoursInBed || 7.5}h • Calidad {sleep[0]?.subjectiveQualityScore || 9}/10
                        </p>
                      </div>
                    </div>
                    <div className="flex items-end gap-0.5 h-5">
                      <div className="w-1 bg-[#7C3AED]/30 h-2 rounded-full"></div>
                      <div className="w-1 bg-[#7C3AED]/50 h-4 rounded-full"></div>
                      <div className="w-1 bg-[#7C3AED] h-5 rounded-full"></div>
                      <div className="w-1 bg-[#7C3AED]/70 h-3 rounded-full"></div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[9px] font-bold text-[#CCC3D8]/40 tracking-wider">
                    <div className="flex justify-between"><span>DURACIÓN:</span> <span className="text-[#E5E1E5]">ÓPTIMA</span></div>
                    <div className="flex justify-between"><span>REGULARIDAD:</span> <span className="text-[#E5E1E5]">EXCELENTE</span></div>
                  </div>
                </div>

                {/* METABOLISMO MODULE CARD STITCH 1:1 */}
                <div
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 cursor-pointer transition-all group"
                  onClick={() => onOpenDrawer('METABOLISMO')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#D6B36A]">bolt</span>
                      <div>
                        <p className="text-[11px] font-bold text-[#E5E1E5]">Metabolismo & Fisiología</p>
                        <p className="text-[9px] text-[#CCC3D8]/60 uppercase font-bold tracking-wider">Fase: {metabolicState.currentPhase}</p>
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-[#D6B36A] uppercase">LIPÓLISIS</div>
                  </div>
                  <div className="mt-3 text-[9px] font-bold text-[#CCC3D8]/40 tracking-wider">
                    SUSTRATO: <span className="text-[#D6B36A] ml-1">ÁCIDOS GRASOS</span> • <span className="ml-2 italic text-[#CCC3D8]/30">DETERMINISTA</span>
                  </div>
                </div>

                {/* NUTRICIÓN MODULE CARD STITCH 1:1 WITH DONUT */}
                <div
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 cursor-pointer transition-all group"
                  onClick={() => onOpenDrawer('NUTRICIONAL')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#7C3AED]">restaurant</span>
                      <div>
                        <p className="text-[11px] font-bold text-[#E5E1E5]">Nutrición & Balance</p>
                        <p className="text-[9px] text-[#CCC3D8]/60 uppercase font-bold tracking-wider">
                          P: {plan.macroConsumed.protein}g / C: {plan.macroConsumed.carbs}g / F: {plan.macroConsumed.fats}g
                        </p>
                      </div>
                    </div>
                    <div className="relative w-8 h-8">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" fill="none" r="16" stroke="rgba(214, 179, 106, 0.1)" strokeWidth="3"></circle>
                        <circle cx="18" cy="18" fill="none" r="16" stroke="#D6B36A" strokeDasharray="70, 100" strokeLinecap="round" strokeWidth="3"></circle>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* CATEGORÍA: OPERATIVOS */}
              <div className="space-y-3">
                <p className="text-[9px] font-bold text-[#CCC3D8]/30 uppercase tracking-[0.2em] mb-2 px-1">Operativos</p>

                {/* HIDRATACIÓN */}
                <div
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 cursor-pointer transition-all group"
                  onClick={() => onOpenModuleDeepView('hydration')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#7C3AED]">water_drop</span>
                      <div>
                        <p className="text-[11px] font-bold text-[#E5E1E5]">Hidratación</p>
                        <p className="text-[9px] text-[#CCC3D8]/60 uppercase font-bold tracking-wider">{(currentWater / 1000).toFixed(1)}L / 2.5L OBJETIVO</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-400/10 uppercase">
                      {currentWater >= 2000 ? 'Óptimo' : 'En progreso'}
                    </span>
                  </div>
                </div>

                {/* ACTIVIDAD */}
                <div
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 cursor-pointer transition-all group"
                  onClick={() => onOpenModuleDeepView('activity')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#D6B36A]">directions_run</span>
                      <div>
                        <p className="text-[11px] font-bold text-[#E5E1E5]">Actividad & Ejercicio</p>
                        <p className="text-[9px] text-[#CCC3D8]/60 uppercase font-bold tracking-wider">Intensidad Media • {totalActivityMin}m</p>
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-[#E5E1E5]">8 RPE</div>
                  </div>
                </div>

                {/* ENERGÍA / MOOD */}
                <div
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 cursor-pointer transition-all group"
                  onClick={() => onOpenModuleDeepView('state')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#7C3AED]">psychology</span>
                      <div>
                        <p className="text-[11px] font-bold text-[#E5E1E5]">Energía & Mood</p>
                        <p className="text-[9px] text-[#CCC3D8]/60 uppercase font-bold tracking-wider">Enfoque: Alto • Ánimo: Estable</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-sm text-green-500">trending_up</span>
                  </div>
                </div>

                {/* DESPENSA */}
                <div
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 cursor-pointer transition-all group"
                  onClick={() => onOpenModuleDeepView('pantry')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#D6B36A]">inventory_2</span>
                      <div>
                        <p className="text-[11px] font-bold text-[#E5E1E5]">Despensa & Compras</p>
                        <p className="text-[9px] text-[#CCC3D8]/60 uppercase font-bold tracking-wider">{inventory.length} Alimentos en stock</p>
                      </div>
                    </div>
                    {expiringItems.length > 0 && (
                      <span className="text-[9px] font-bold text-[#D6B36A] px-1.5 py-0.5 rounded bg-[#D6B36A]/10 uppercase">
                        {expiringItems.length} Vencen
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 text-center">
                <p className="text-[9px] text-[#CCC3D8]/30 font-bold tracking-[0.3em] uppercase">AION AEGIS ARCHITECTURE • V3.1.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
