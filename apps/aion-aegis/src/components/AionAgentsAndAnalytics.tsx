import React, { useState } from 'react';
import { AionMemoryStore } from '@aion/memory';

export const AionAgentsAndAnalytics: React.FC = () => {
  const store = AionMemoryStore.getInstance();
  const meals = store.getMeals() || [];
  const sleep = store.getSleepRecords() || [];
  const activity = store.getActivityRecords() || [];
  const hydration = store.getHydrationRecords() || [];
  const ledger = store.getLedgerEntries() || [];

  const [activeTab, setActiveTab] = useState<'bar_charts' | 'agent_runtimes'>('bar_charts');

  // Datos para los diagramas de barras
  const weeklyKcalData = [
    { day: 'Lun', kcal: 1950, target: 2100 },
    { day: 'Mar', kcal: 2050, target: 2100 },
    { day: 'Mié', kcal: 1880, target: 2100 },
    { day: 'Jue', kcal: 2150, target: 2100 },
    { day: 'Vie', kcal: 2000, target: 2100 },
    { day: 'Sáb', kcal: 2200, target: 2100 },
    { day: 'Dom', kcal: 1980, target: 2100 },
  ];

  const weeklyProteinData = [
    { day: 'Lun', protein: 140, target: 160 },
    { day: 'Mar', protein: 155, target: 160 },
    { day: 'Mié', protein: 165, target: 160 },
    { day: 'Jue', protein: 150, target: 160 },
    { day: 'Vie', protein: 160, target: 160 },
    { day: 'Sáb', protein: 145, target: 160 },
    { day: 'Dom', protein: 158, target: 160 },
  ];

  const agentsList = [
    { id: 'aegis_core', name: 'Aegis Core SuperAgent', role: 'Orquestación Soberana', status: 'ACTIVO', invocations: 42, icon: 'shield' },
    { id: 'nutrition_supervisor', name: 'Nutrition Supervisor', role: 'Conteo & Balance Bioquímico', status: 'ACTIVO', invocations: 28, icon: 'restaurant' },
    { id: 'metabolism_supervisor', name: 'Metabolism Supervisor', role: 'Fase Metabólica & Cetosis', status: 'ACTIVO', invocations: 19, icon: 'bolt' },
    { id: 'sleep_supervisor', name: 'Sleep Supervisor', role: 'Arquitectura Circadiana', status: 'STANDBY', invocations: 12, icon: 'nights_stay' },
    { id: 'activity_supervisor', name: 'Activity Supervisor', role: 'Gasto Físico & RPE', status: 'ACTIVO', invocations: 15, icon: 'directions_run' },
    { id: 'hydration_supervisor', name: 'Hydration Supervisor', role: 'Volumen Hídrico & Electrolitos', status: 'ACTIVO', invocations: 24, icon: 'water_drop' },
    { id: 'pantry_supervisor', name: 'Inventory & Pantry Agent', role: 'Cadena de Suministro', status: 'STANDBY', invocations: 9, icon: 'inventory_2' },
    { id: 'audit_agent', name: 'Universal Audit Agent', role: 'Ledger Inmutable Append-Only', status: 'ACTIVO', invocations: ledger.length, icon: 'verified' },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-16">
      {/* CABECERA PRINCIPAL */}
      <div className="bg-[#111017] p-6 lg:p-8 rounded-[36px] border border-[#7C3AED]/40 shadow-2xl flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.3em]">
            PROTESIS EJECUTIVA SOBERANA • AION AGENTS & ANALYTICS
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mt-1 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#7C3AED] text-3xl">bar_chart</span>
            Analítica de Barras & Estado de Agentes
          </h2>
        </div>

        {/* TABS DE SECCIÓN */}
        <div className="flex gap-2 bg-[#070709] p-1.5 rounded-full border border-white/10">
          <button
            onClick={() => setActiveTab('bar_charts')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'bar_charts'
                ? 'bg-[#7C3AED] text-white shadow-lg'
                : 'text-[#CCC3D8]/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">equalizer</span>
            Diagramas de Barras
          </button>

          <button
            onClick={() => setActiveTab('agent_runtimes')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'agent_runtimes'
                ? 'bg-[#7C3AED] text-white shadow-lg'
                : 'text-[#CCC3D8]/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">hub</span>
            Red de Agentes en Vivo ({agentsList.length})
          </button>
        </div>
      </div>

      {activeTab === 'bar_charts' && (
        <div className="space-y-6">
          {/* DIAGRAMA DE BARRAS 1: INGESTA CALÓRICA SEMANAL */}
          <div className="dashboard-card rounded-[32px] p-6 lg:p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-widest">
                  SEMANA ACTUAL • METAS BIOQUÍMICAS
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">Balance Calórico Semanal (kcal)</h3>
              </div>
              <span className="text-xs font-bold text-[#C4B5FD] bg-[#7C3AED]/15 px-3 py-1 rounded-full border border-[#7C3AED]/30">
                META: 2,100 kcal/día
              </span>
            </div>

            {/* GRÁFICO SVG DE BARRAS STITCH */}
            <div className="h-64 flex items-end justify-between gap-3 pt-8 px-4 border-b border-white/10 pb-4">
              {weeklyKcalData.map((d) => {
                const heightPercent = Math.min((d.kcal / 2500) * 100, 100);
                const isTargetMet = d.kcal <= d.target + 100;
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* TOOLTIP HOVER */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all absolute -top-10 bg-[#111017] border border-white/20 px-2 py-1 rounded-lg text-[10px] text-white font-bold whitespace-nowrap shadow-xl z-20 pointer-events-none">
                      {d.kcal} kcal ({isTargetMet ? 'En Rango' : 'Superávit'})
                    </div>

                    <div className="w-full max-w-[48px] bg-white/5 rounded-t-xl h-full flex items-end p-1">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isTargetMet
                            ? 'bg-gradient-to-t from-[#7C3AED]/40 to-[#7C3AED]'
                            : 'bg-gradient-to-t from-[#D6B36A]/40 to-[#D6B36A]'
                        }`}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-[#CCC3D8]">{d.day}</span>
                    <span className="text-[10px] text-white/50">{d.kcal}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DIAGRAMA DE BARRAS 2: PROTEÍNA DIARIA (Grams) */}
          <div className="dashboard-card rounded-[32px] p-6 lg:p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  PROTECCIÓN MUSCULAR • MPS
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">Ingesta de Proteína Semanal (gramos)</h3>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
                META: 160g/día
              </span>
            </div>

            <div className="h-64 flex items-end justify-between gap-3 pt-8 px-4 border-b border-white/10 pb-4">
              {weeklyProteinData.map((d) => {
                const heightPercent = Math.min((d.protein / 200) * 100, 100);
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="opacity-0 group-hover:opacity-100 transition-all absolute -top-10 bg-[#111017] border border-white/20 px-2 py-1 rounded-lg text-[10px] text-white font-bold whitespace-nowrap shadow-xl z-20 pointer-events-none">
                      {d.protein}g proteína
                    </div>

                    <div className="w-full max-w-[48px] bg-white/5 rounded-t-xl h-full flex items-end p-1">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600/40 to-emerald-400 transition-all duration-500"
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-[#CCC3D8]">{d.day}</span>
                    <span className="text-[10px] text-white/50">{d.protein}g</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'agent_runtimes' && (
        <div className="space-y-6">
          {/* INFOGRAFÍA DE LA RED MULTIAGENTE */}
          <div className="dashboard-card rounded-[36px] overflow-hidden border border-white/10">
            <img src="/images/aion_agent_architecture.jpg" alt="Arquitectura Multiagente AION Aegis" className="w-full h-64 object-cover" />
            <div className="p-6 bg-[#111017] flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Red Multiagente Soberana Activa</h3>
                <p className="text-xs text-[#CCC3D8]/60">Orquestación paralela determinista con bus de eventos en memoria.</p>
              </div>
              <span className="px-4 py-2 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                100% OPERACIONAL
              </span>
            </div>
          </div>

          {/* LISTADO DE AGENTES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agentsList.map((agent) => (
              <div key={agent.id} className="glass-surface p-5 rounded-3xl space-y-3 border border-white/5 hover:border-[#7C3AED]/40 transition-all">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#C4B5FD]">
                    <span className="material-symbols-outlined">{agent.icon}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${
                    agent.status === 'ACTIVO' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}>
                    {agent.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{agent.name}</h4>
                  <p className="text-[11px] text-[#CCC3D8]/60 mt-0.5">{agent.role}</p>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px]">
                  <span className="text-[#CCC3D8]">Invocaciones hoy:</span>
                  <span className="font-bold text-[#D6B36A]">{agent.invocations} eventos</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
