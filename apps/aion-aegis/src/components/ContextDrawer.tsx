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
  const finConfig = store.getFinanceConfig();
  const sleep = store.getSleepRecords() || [];
  const activity = store.getActivityRecords() || [];
  const hydration = store.getHydrationRecords() || [];
  const ledger = store.getLedgerEntries() || [];

  const latestSleep = sleep[0] || { hoursInBed: 7.5, subjectiveQualityScore: 9, remHours: 1.8, deepSleepHours: 2.1, efficiencyPercentage: 92 };
  const totalWater = hydration.reduce((acc, h) => acc + (h?.amountMl || 0), 0);
  const totalActivityMin = activity.reduce((acc, a) => acc + (a?.durationMinutes || 0), 0);

  const contextUpper = (context || 'NUTRICIONAL').toUpperCase();

  const getDrawerDetails = () => {
    switch (contextUpper) {
      case 'SUEÑO':
        return {
          title: 'RECUPERACIÓN & SUEÑO',
          subtitle: 'CIRCADIAN ARCHITECTURE • LIVE',
          mainValue: `${latestSleep.hoursInBed}h`,
          mainLabel: `Calidad ${latestSleep.subjectiveQualityScore}/10`,
          agentName: 'SleepSupervisorAgent',
          recommendation: 'Excelente fase de sueño ligero y profundo. Mantén la ventilación fresca y evita cafeína tras las 4:00 PM.',
          glossary: [
            { term: 'Sueño REM', desc: 'Fase de movimiento ocular rápido vital para la consolidación de la memoria y regulación emocional.' },
            { term: 'Sueño Profundo (NREM)', desc: 'Fase de ondas lentas donde se secreta el 80% de la Hormona del Crecimiento (GH).' },
            { term: 'Ritmo Circadiano', desc: 'Reloj biológico interno regulado por el núcleo supraquiasmático y la luz solar.' },
          ],
        };
      case 'ACTIVIDAD':
        return {
          title: 'ACTIVIDAD & EJERCICIO',
          subtitle: 'NEUROMUSCULAR EFFORT • LIVE',
          mainValue: `${totalActivityMin || 45} min`,
          mainLabel: 'Minutos hoy en Zona 2/4',
          agentName: 'ActivitySupervisorAgent',
          recommendation: 'Dominio de esfuerzo neuromuscular óptimo. Se sugiere mantener buena recuperación glucogénica.',
          glossary: [
            { term: 'METs (Equivalente Metabólico)', desc: 'Unidad de medida de la tasa de gasto metabólico durante la actividad física.' },
            { term: 'Zona 2 Aeróbica', desc: 'Intensidad de ejercicio óptima para maximizar la oxidación de ácidos grasos y biogénesis mitocondrial.' },
            { term: 'Depleción de Glucógeno', desc: 'Vaciado metabólico de las reservas intramusculares tras esfuerzo intenso.' },
          ],
        };
      case 'HIDRATACIÓN':
        return {
          title: 'HIDRATACIÓN & ELECTROLITOS',
          subtitle: 'CELLULAR OSMOLALITY • LIVE',
          mainValue: `${totalWater || 1850} ml`,
          mainLabel: 'Meta: 2500 ml',
          agentName: 'HydrationSupervisorAgent',
          recommendation: 'Nivel hídrico celular balanceado. Recuerda añadir una pizca de sal marina o sodio en el termo post-entrenamiento.',
          glossary: [
            { term: 'Osmolalidad Plasmática', desc: 'Concentración de partículas disueltas (electrolitos) en el plasma sanguíneo.' },
            { term: 'Bomba Sodio-Potasio', desc: 'Mecanismo de transporte activo celular que mantiene el potencial de membrana.' },
            { term: 'Espacio Intersticial', desc: 'Compartimento de fluido que rodea las células de los tejidos corporales.' },
          ],
        };
      case 'FINANZAS':
        return {
          title: 'FINANZAS & PRESUPUESTO',
          subtitle: 'AEGIS LEDGER COST TRACKING',
          mainValue: `$${(finConfig.monthlyBudgetCop || 2500000).toLocaleString()} COP`,
          mainLabel: 'Presupuesto Mensual Base',
          agentName: 'FinancesAgent',
          recommendation: 'Todas las transacciones están sincronizadas con la adición de existencias en Despensa y compras en farmacia.',
          glossary: [
            { term: 'Ledger Universal', desc: 'Libro contable inmutable con sello de tiempo para auditar cada transacción.' },
            { term: 'Ejecución Presupuestaria', desc: 'Porcentaje gastado en tiempo real frente al límite fijado para el mes.' },
            { term: 'Sincronización Cloud', desc: 'Respaldo automático en formato Excel (.xlsx) hacia Google Drive.' },
          ],
        };
      case 'METABOLISMO':
        return {
          title: 'ESTADO METABÓLICO',
          subtitle: 'BIOMARKER TRACKING • LIVE',
          mainValue: metabolicState.currentPhase || 'Lipólisis',
          mainLabel: 'Fase biológica actual',
          agentName: 'MetabolismSupervisorAgent',
          recommendation: 'La tasa de oxidación de grasas se mantiene estable. Sensibilidad a la insulina en pico favorable.',
          glossary: [
            { term: 'Lipólisis', desc: 'Degradación de triacilglicéridos en ácidos grasos libres y glicerol para producción de energía.' },
            { term: 'Glucemia Posprandial', desc: 'Concentración de glucosa en plasma después de la ingesta de alimentos.' },
            { term: 'Sensibilidad a la Insulina', desc: 'Eficiencia de las células musculares para captar glucosa libre.' },
          ],
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
          glossary: [
            { term: 'Síntesis Proteica (MPS)', desc: 'Proceso biológico de construcción de nuevo tejido muscular modulado por la L-Leucina.' },
            { term: 'Gasto Basal (BMR)', desc: 'Calorías mínimas necesarias para mantener las funciones vitales en reposo (1,780 kcal).' },
            { term: 'Vía mTORC1', desc: 'Complejo enzimático regulador maestro del crecimiento celular y recambio proteico.' },
          ],
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
          className="p-2.5 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white transition-all border border-white/10 cursor-pointer"
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

        {/* CONTENIDO ESPECÍFICO ISOLADO POR DOMINIO (SIN MEZCLAR PROTEÍNA EN SUEÑO/FINANZAS) */}
        <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Métricas Específicas de {details.title}</h3>

          {contextUpper === 'SUEÑO' && (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-[#C4B5FD]">Sueño REM (Movimiento Ocular Rápido)</span>
                <span className="text-white">{(latestSleep as any).remHours || 1.8} h / 2.0 h</span>
              </div>
              <div className="w-full h-2 bg-[#070709] rounded-full overflow-hidden">
                <div className="h-full bg-[#7C3AED] rounded-full w-[90%]"></div>
              </div>

              <div className="flex justify-between font-bold pt-2">
                <span className="text-indigo-400">Sueño Profundo (Reparador NREM)</span>
                <span className="text-white">{(latestSleep as any).deepSleepHours || 2.1} h / 2.2 h</span>
              </div>
              <div className="w-full h-2 bg-[#070709] rounded-full overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full w-[95%]"></div>
              </div>
            </div>
          )}

          {contextUpper === 'ACTIVIDAD' && (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-[#D6B36A]">Entrenamiento de Fuerza</span>
                <span className="text-white">45 min (320 kcal)</span>
              </div>
              <div className="w-full h-2 bg-[#070709] rounded-full overflow-hidden">
                <div className="h-full bg-[#D6B36A] rounded-full w-[80%]"></div>
              </div>
            </div>
          )}

          {contextUpper === 'HIDRATACIÓN' && (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-sky-400">Volumen Hídrico Ingerido</span>
                <span className="text-white">{totalWater || 1850} ml / 2500 ml</span>
              </div>
              <div className="w-full h-2 bg-[#070709] rounded-full overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full w-[74%]"></div>
              </div>
            </div>
          )}

          {contextUpper === 'FINANZAS' && (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-emerald-400">Presupuesto Ejecutado</span>
                <span className="text-white">40% ($1.000.000 / $2.500.000 COP)</span>
              </div>
              <div className="w-full h-2 bg-[#070709] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full w-[40%]"></div>
              </div>
            </div>
          )}

          {(contextUpper === 'NUTRICIONAL' || contextUpper === 'METABOLISMO') && (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-[#D6B36A]">Proteína Sintetizada</span>
                <span className="text-white">{plan.macroConsumed.protein}g / {plan.macroTargets.protein}g</span>
              </div>
              <div className="w-full h-2 bg-[#070709] rounded-full overflow-hidden">
                <div className="h-full bg-[#D6B36A] rounded-full" style={{ width: `${Math.min(100, (plan.macroConsumed.protein / plan.macroTargets.protein) * 100)}%` }}></div>
              </div>
            </div>
          )}
        </div>

        {/* GLOSARIO TÉCNICO EXCLUSIVO DEL DOMINIO */}
        <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-[#D6B36A] uppercase tracking-wider">Glosario & Conceptos Clave de {details.title}</h3>
          <div className="space-y-3">
            {details.glossary.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#070709] border border-white/10 space-y-1 text-xs">
                <span className="font-bold text-white block">{item.term}</span>
                <p className="text-[11px] text-[#CCC3D8]/80 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* REGISTROS RECIENTES DEL LEDGER EN ESTE MÓDULO */}
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

      </div>

      {/* DRAWER FOOTER STITCH 1:1 */}
      <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#7C3AED] text-white font-bold text-xs rounded-2xl hover:bg-[#6D28D9] transition-all shadow-lg cursor-pointer"
        >
          CERRAR ANÁLISIS LATERAL
        </button>
      </div>
    </aside>
  );
};
