import React from 'react';
import { NutritionLeadSpecialist } from '@aion/agents';
import { AionMemoryStore } from '@aion/memory';

interface ContextDrawerProps {
  isOpen: boolean;
  context: string;
  onClose: () => void;
}

export const ContextDrawer: React.FC<ContextDrawerProps> = ({ isOpen, context, onClose }) => {
  if (!isOpen) return null;

  const store = AionMemoryStore.getInstance();
  const specialist = new NutritionLeadSpecialist();

  const metabolicState = specialist.getCurrentMetabolicState('biochemical');
  const plan = store.getLivePlan();
  const meals = store.getMeals();

  const getDrawerDetails = () => {
    switch (context) {
      case 'METABOLISMO':
        return {
          title: 'ESTADO METABÓLICO',
          subtitle: 'BIOMARKER TRACKING • LIVE',
          mainValue: metabolicState.currentPhase || 'Lipólisis',
          mainLabel: 'Estado actual',
        };
      case 'SUEÑO':
        return {
          title: 'RECUPERACIÓN & SUEÑO',
          subtitle: 'SLEEP ARCHITECTURE',
          mainValue: '92%',
          mainLabel: 'Calidad global',
        };
      case 'NUTRICIONAL':
      default:
        return {
          title: 'ANÁLISIS NUTRICIONAL',
          subtitle: 'AEGIS ANALYTICS • LIVE',
          mainValue: `${plan.macroConsumed.protein}g`,
          mainLabel: 'Proteína hoy',
        };
    }
  };

  const details = getDrawerDetails();

  return (
    <aside className="fixed inset-y-0 right-0 w-[420px] max-w-[90vw] bg-[#111017] border-l border-white/10 z-[100] drawer-transition shadow-[-20px_0_60px_rgba(0,0,0,0.85)] flex flex-col p-6 lg:p-8">
      {/* DRAWER HEADER STITCH 1:1 */}
      <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.3em]">
            {details.subtitle}
          </span>
          <h2 className="text-xl lg:text-2xl font-bold text-[#E5E1E5] mt-1">{details.title}</h2>
        </div>
        <button className="p-2 rounded-full hover:bg-white/5 transition-colors text-white" onClick={onClose}>
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      {/* DRAWER BODY STITCH 1:1 */}
      <div className="flex-1 overflow-y-auto hide-scrollbar space-y-6">
        <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-[#E5E1E5]">Resumen Detallado</p>
            <span className="material-symbols-outlined text-[#D6B36A]">check_circle</span>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-white">{details.mainValue}</span>
            <span className="text-sm text-[#CCC3D8]/60 mb-1">{details.mainLabel}</span>
          </div>

          <div className="space-y-4 pt-4">
            {/* PROTEÍNA */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-[#CCC3D8]/40">PROTEÍNA</span>
                <span className="text-[#D6B36A]">{plan.macroConsumed.protein}g / {plan.macroTargets.protein}g</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D6B36A]"
                  style={{ width: `${Math.min(100, (plan.macroConsumed.protein / plan.macroTargets.protein) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* CARBOHIDRATOS */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-[#CCC3D8]/40">CARBOHIDRATOS</span>
                <span className="text-[#7C3AED]">{plan.macroConsumed.carbs}g / {plan.macroTargets.carbs}g</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7C3AED]"
                  style={{ width: `${Math.min(100, (plan.macroConsumed.carbs / plan.macroTargets.carbs) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* GRASAS */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-[#CCC3D8]/40">GRASAS</span>
                <span className="text-white">{plan.macroConsumed.fats}g / {plan.macroTargets.fats}g</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#CCC3D8]/40"
                  style={{ width: `${Math.min(100, (plan.macroConsumed.fats / plan.macroTargets.fats) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* AJUSTES & REGISTROS */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold text-[#CCC3D8]/40 uppercase tracking-widest">Confirmar Registros Recientes</h4>
          <div className="space-y-2">
            {meals.length === 0 ? (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-[#CCC3D8]/60">
                No hay comidas registradas hoy. Expresa tu comida en el Composer.
              </div>
            ) : (
              meals.slice(0, 3).map((m) => (
                <div key={m.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center group cursor-pointer hover:border-[#7C3AED]/50 transition-all">
                  <span className="text-sm text-white">{m.preparation.name}</span>
                  <span className="material-symbols-outlined text-[#CCC3D8] group-hover:text-[#7C3AED] transition-colors">edit</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* DRAWER FOOTER STITCH 1:1 */}
      <div className="pt-6 border-t border-white/5 space-y-2">
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-full bg-[#7C3AED] text-white font-bold text-[11px] tracking-[0.2em] hover:shadow-[0_10px_30px_rgba(124,58,237,0.4)] transition-all flex items-center justify-center gap-2 uppercase"
        >
          CONFIRMAR Y SINCRONIZAR <span className="material-symbols-outlined text-sm">sync</span>
        </button>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-full border border-white/5 text-[#CCC3D8] font-bold text-[11px] tracking-[0.2em] hover:bg-white/5 transition-all uppercase"
        >
          DESCARTAR CAMBIOS
        </button>
      </div>
    </aside>
  );
};
