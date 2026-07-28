import React from 'react';
import { YourBodyNow } from './YourBodyNow';
import { MealLogger } from './MealLogger';
import { WhatCanIEatNow } from './WhatCanIEatNow';
import { PantryInventory } from './PantryInventory';
import { LivePlanAndMarket } from './LivePlanAndMarket';
import { MyDayLedgerTimeline } from './MyDayLedgerTimeline';
import { DailyReportModal } from './DailyReportModal';
import {
  SleepDashboard,
  ActivityDashboard,
  HydrationDashboard,
  StateDashboard,
  MedicationDashboard,
  SymptomsDashboard,
  BodyDashboard,
  HabitsDashboard,
} from './ModuleDashboards';
import { NutritionLeadSpecialist } from '@aion/agents';

interface ModuleDeepViewProps {
  activeModuleId: string;
  onRefreshAll: () => void;
  onBackToCore: () => void;
}

export const ModuleDeepView: React.FC<ModuleDeepViewProps> = ({
  activeModuleId,
  onRefreshAll,
  onBackToCore,
}) => {
  const specialist = new NutritionLeadSpecialist();
  const metabolicState = specialist.getCurrentMetabolicState();
  const energyBalance = specialist.getCurrentEnergyBalance();

  const getModuleHeader = () => {
    switch (activeModuleId) {
      case 'metabolism': return { title: 'Metabolismo & Fisiología', icon: 'bolt', subtitle: 'Fase Metabólica & Sustratos Bioquímicos' };
      case 'nutrition': return { title: 'Nutrición & Balance Ingesta', icon: 'restaurant', subtitle: 'Conteo de Calorías, Macros & Micronutrientes' };
      case 'recipes': return { title: 'Recetas & Preparaciones', icon: 'auto_awesome', subtitle: 'Sugerencias Inteligentes según Despensa' };
      case 'pantry': return { title: 'Despensa, Compras & Inventario', icon: 'inventory_2', subtitle: 'Control de Existencias & Alimentos Críticos' };
      case 'sleep': return { title: 'Sueño & Recuperación', icon: 'nights_stay', subtitle: 'Eficiencia Circadiana & Fases REM/Profundo' };
      case 'activity': return { title: 'Actividad & Esfuerzo Físico', icon: 'directions_run', subtitle: 'RPE, Calorías Quemadas & Ejercicio' };
      case 'hydration': return { title: 'Hidratación & Electrolitos', icon: 'water_drop', subtitle: 'Volumen Hídrico & Estado de Hidratación' };
      case 'state': return { title: 'Energía, Ánimo & Foco', icon: 'psychology', subtitle: 'Estado Bioenergético & Salud Mental' };
      case 'medication': return { title: 'Medicación & Suplementos', icon: 'medication', subtitle: 'Posología, Fármacos & Vitaminas' };
      case 'symptoms': return { title: 'Dolor & Síntomas', icon: 'medical_services', subtitle: 'Registro Clínico & Alertas Agudas' };
      case 'body': return { title: 'Peso & Medidas Corporal', icon: 'straighten', subtitle: 'Antropometría & Composición Magra' };
      case 'habits': return { title: 'Hábitos & Rutinas', icon: 'published_with_changes', subtitle: 'Seguimiento de Racha & Objetivos' };
      case 'plan': return { title: 'Plan Vivo Interactivo', icon: 'event_repeat', subtitle: 'Programación Inteligente del Día' };
      case 'day':
      case 'audit': return { title: 'Mi Día & Ledger Inmutable', icon: 'terminal', subtitle: 'Trazabilidad Universal Raw Stream' };
      case 'reports': return { title: 'Reportes & Exportaciones', icon: 'summarize', subtitle: 'Generador de Libro Excel & Informes PDF' };
      default: return { title: 'Módulo Canónico', icon: 'grid_view', subtitle: 'Panel de Control Interactivo' };
    }
  };

  const header = getModuleHeader();

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-16">
      {/* HEADER DE NAVEGACIÓN PROFUNDA STITCH 1:1 */}
      <div className="flex justify-between items-center bg-[#111017] p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToCore}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[#C4B5FD] text-xs font-bold hover:bg-[#7C3AED]/20 transition-all"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Volver a Aegis Core
          </button>
          <div className="h-6 w-px bg-white/10"></div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#7C3AED] text-2xl">{header.icon}</span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{header.title}</h2>
              <p className="text-xs text-[#CCC3D8]/60">{header.subtitle}</p>
            </div>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#7C3AED]/15 text-[#C4B5FD] text-xs font-bold border border-[#7C3AED]/30 uppercase">
          MODULO ACTIVO
        </span>
      </div>

      {/* RENDERIZADO DEL DASHBOARD PROFUNDO */}
      {(activeModuleId === 'metabolism' || activeModuleId === 'body_met') && (
        <YourBodyNow metabolicState={metabolicState} energyBalance={energyBalance} />
      )}
      {activeModuleId === 'nutrition' && <MealLogger onMealAdded={onRefreshAll} />}
      {activeModuleId === 'recipes' && <WhatCanIEatNow />}
      {activeModuleId === 'pantry' && <PantryInventory />}
      {activeModuleId === 'sleep' && <SleepDashboard onRefresh={onRefreshAll} />}
      {activeModuleId === 'activity' && <ActivityDashboard onRefresh={onRefreshAll} />}
      {activeModuleId === 'hydration' && <HydrationDashboard onRefresh={onRefreshAll} />}
      {activeModuleId === 'state' && <StateDashboard onRefresh={onRefreshAll} />}
      {activeModuleId === 'medication' && <MedicationDashboard onRefresh={onRefreshAll} />}
      {activeModuleId === 'symptoms' && <SymptomsDashboard onRefresh={onRefreshAll} />}
      {activeModuleId === 'body' && <BodyDashboard onRefresh={onRefreshAll} />}
      {activeModuleId === 'habits' && <HabitsDashboard onRefresh={onRefreshAll} />}
      {activeModuleId === 'plan' && <LivePlanAndMarket />}
      {(activeModuleId === 'day' || activeModuleId === 'audit') && (
        <MyDayLedgerTimeline onDataChanged={onRefreshAll} />
      )}
      {activeModuleId === 'reports' && (
        <DailyReportModal isOpen={true} onClose={onBackToCore} />
      )}
    </div>
  );
};
