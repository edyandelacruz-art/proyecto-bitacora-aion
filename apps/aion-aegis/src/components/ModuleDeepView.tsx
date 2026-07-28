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

  const getTitle = () => {
    switch (activeModuleId) {
      case 'metabolism': return '🧬 Metabolismo & Fisiología';
      case 'nutrition': return '🍎 Alimentación & Nutrición';
      case 'recipes': return '💡 Recetas & Preparaciones';
      case 'pantry': return '📦 Despensa, Compras & Inventario';
      case 'sleep': return '😴 Sueño & Recuperación';
      case 'activity': return '🏃 Actividad & Ejercicio';
      case 'hydration': return '💧 Hidratación';
      case 'state': return '⚡ Energía, Ánimo & Foco';
      case 'medication': return '💊 Medicación & Suplementos';
      case 'symptoms': return '🩺 Dolor & Síntomas';
      case 'body': return '📐 Peso & Medidas';
      case 'habits': return '🔄 Hábitos & Rutinas';
      case 'plan': return '📅 Plan Vivo';
      case 'day':
      case 'audit': return '📜 Mi Día (Bitácora & Ledger)';
      case 'reports': return '📊 Reportes & Exportaciones';
      default: return '⚙️ Módulo';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
      {/* HEADER NAVEGACIÓN PROFUNDA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2B2338', paddingBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={onBackToCore}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid #2B2338',
              color: '#C4B5FD',
              borderRadius: '6px',
              padding: '0.3rem 0.6rem',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            ← Volver a Aegis Core
          </button>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', margin: 0 }}>{getTitle()}</h2>
        </div>
      </div>

      {/* RENDERIZADO DEL MÓDULO PROFUNDO */}
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
