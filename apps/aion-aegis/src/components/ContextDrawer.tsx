import React from 'react';
import { NutritionLeadSpecialist } from '@aion/agents';
import { AionMemoryStore } from '@aion/memory';
import { AegisTransversalExplainer } from './AegisTransversalExplainer';

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
  const meals = store.getMeals() || [];
  const sleep = store.getSleepRecords() || [];
  const activity = store.getActivityRecords() || [];
  const hydration = store.getHydrationRecords() || [];
  const ledger = store.getLedgerEntries() || [];

  const latestSleep = sleep[0] || { hoursInBed: 7.5, subjectiveQualityScore: 9 };
  const totalWater = hydration.reduce((acc, h) => acc + (h?.amountMl || 0), 0);
  const totalActivityMin = activity.reduce((acc, a) => acc + (a?.durationMinutes || 0), 0);

  const getDrawerDetails = () => {
    switch (context.toUpperCase()) {
      case 'SUEÑO':
        return {
          title: 'RECUPERACIÓN & SUEÑO',
          subtitle: 'CIRCADIAN ARCHITECTURE • LIVE',
          mainValue: `${latestSleep.hoursInBed}h`,
          mainLabel: `Calidad ${latestSleep.subjectiveQualityScore}/10`,
          agentName: 'SleepSupervisorAgent',
          recommendation: 'Excelente fase de sueño ligero y profundo. Mantén la ventilación fresca y evita cafeína tras las 4:00 PM.',
        };
      case 'ACTIVIDAD':
        return {
          title: 'ACTIVIDAD & EJERCICIO',
          subtitle: 'NEUROMUSCULAR EFFORT • LIVE',
          mainValue: `${totalActivityMin} m`,
          mainLabel: 'Minutos hoy en Zona 2',
          agentName: 'ActivitySupervisorAgent',
          recommendation: 'Dominio de esfuerzo aeróbico óptimo. Se sugiere complementar con 15 minutos de trabajo de movilidad de cadera.',
        };
      case 'HIDRATACIÓN':
        return {
          title: 'HIDRATACIÓN & ELECTROLITOS',
          subtitle: 'CELLULAR OSMOLALITY • LIVE',
          mainValue: `${totalWater} ml`,
          mainLabel: 'Meta: 2500 ml',
          agentName: 'HydrationSupervisorAgent',
          recommendation: 'Nivel hídrico celular balanceado. Recuerda añadir una pizca de sal marina o sodio en el termo post-entrenamiento.',
        };
      case 'FINANZAS':
        return {
          title: 'FINANZAS & LEDGER',
          subtitle: 'AEGIS LEDGER COST TRACKING',
          mainValue: '$45.000 COP',
          mainLabel: 'Gastos de hoy',
          agentName: 'FinancesAgent',
          recommendation: 'Todas las transacciones están sincronizadas con la adición de existencias en Despensa y compras en farmacia.',
        };
      case 'METABOLISMO':
        return {
          title: 'ESTADO METABÓLICO',
          subtitle: 'BIOMARKER TRACKING • LIVE',
          mainValue: metabolicState.currentPhase || 'Lipólisis',
          mainLabel: 'Fase biológica actual',
          agentName: 'MetabolismSupervisorAgent',
          recommendation: 'La tasa de oxidación de grasas se mantiene estable. Sensibilidad a la insulina en pico favorable.',
        };
      case 'NUTRICIONAL':
      default:
        return {
          title: 'ANÁLISIS NUTRICIONAL',
          subtitle: 'BIOCHEMICAL MACROS • LIVE',
          mainValue: `${plan.macroConsumed.protein}g`,
          mainLabel: `Meta: ${plan.macroTargets.protein}g Proteína`,
          agentName: 'NutritionLeadSpecialist',
          recommendation: 'Estás a 20g de proteína de cumplir el objetivo bioquímico diario para mantener la síntesis proteica muscular.',
        };
    }
  };

  const details = getDrawerDetails();

  return (
    <aside className="fixed inset-y-0 right-0 w-[460px] max-w-[95vw] bg-[#111017] border-l-2 border-[#7C3AED]/50 z-[200] drawer-transition shadow-[-25px_0_70px_rgba(0,0,0,0.9)] flex flex-col p-6 lg:p-8">
      {/* DRAWER HEADER STITCH 1:1 */}
      <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.3em]">
            {details.subtitle}
          </span>
          <h2 className="text-xl lg:text-2xl font-bold text-white mt-1">{details.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white transition-all border border-white/10"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      {/* DRAWER BODY STITCH 1:1 */}
      <div className="flex-1 overflow-y-auto hide-scrollbar space-y-6">
        {/* RESUMEN DESTACADO */}
        <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-[#C4B5FD] uppercase tracking-wider">Atendido por: {details.agentName}</p>
            <span className="material-symbols-outlined text-[#D6B36A]">verified</span>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-4xl font-extrabold text-white">{details.mainValue}</span>
            <span className="text-xs text-[#CCC3D8]/70 mb-1">{details.mainLabel}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#070709] border border-white/10 space-y-1">
            <p className="text-[11px] font-bold text-[#D6B36A] uppercase">Recomendación del Agente:</p>
            <p className="text-xs text-[#E5E1E5]/90 leading-relaxed">{details.recommendation}</p>
          </div>
        </div>

        {/* BARRAS DE PROGRESO DE MACROS / ESTADO */}
        <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Desglose de Parámetros Fisiológicos</h3>
          
          {/* PROTEÍNA */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#CCC3D8]/60">PROTEÍNA SINTETIZADA</span>
              <span className="text-[#D6B36A]">{plan.macroConsumed.protein}g / {plan.macroTargets.protein}g</span>
            </div>
            <div className="w-full h-2 bg-[#070709] rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-[#D6B36A] rounded-full"
                style={{ width: `${Math.min(100, (plan.macroConsumed.protein / plan.macroTargets.protein) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* CARBOHIDRATOS */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#CCC3D8]/60">CARBOHIDRATOS RESERVA</span>
              <span className="text-[#7C3AED]">{plan.macroConsumed.carbs}g / {plan.macroTargets.carbs}g</span>
            </div>
            <div className="w-full h-2 bg-[#070709] rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-[#7C3AED] rounded-full"
                style={{ width: `${Math.min(100, (plan.macroConsumed.carbs / plan.macroTargets.carbs) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* GRASAS */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#CCC3D8]/60">GRASAS ESENCIALES</span>
              <span className="text-sky-400">{plan.macroConsumed.fats}g / {plan.macroTargets.fats}g</span>
            </div>
            <div className="w-full h-2 bg-[#070709] rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-sky-400 rounded-full"
                style={{ width: `${Math.min(100, (plan.macroConsumed.fats / plan.macroTargets.fats) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* REGISTROS RECIENTES DEL EVENTBUS/LEDGER */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Últimos Eventos del Ledger en este Módulo</h4>
          <div className="space-y-2">
            {ledger.slice(0, 3).map((entry) => (
              <div key={entry.id} className="p-3.5 rounded-2xl bg-[#070709] border border-white/10 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">{entry.type}</span>
                  <span className="text-[10px] text-[#CCC3D8]/50">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#7C3AED]/20 text-[#C4B5FD] text-[10px] font-bold">
                  {entry.evidence}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* EXPLICADOR TRANSVERSAL DENTRO DEL DRAWER */}
        <AegisTransversalExplainer
          contextName={`Barra Lateral de Análisis Contextual: ${details.title}`}
          domain={context}
          compact={true}
        />
      </div>

      {/* DRAWER FOOTER STITCH 1:1 */}
      <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#7C3AED] text-white font-bold text-xs rounded-2xl hover:bg-[#6D28D9] transition-all shadow-lg"
        >
          CERRAR ANÁLISIS LATERAL
        </button>
      </div>
    </aside>
  );
};
