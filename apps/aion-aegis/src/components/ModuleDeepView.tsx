import React from 'react';
import { YourBodyNow } from './YourBodyNow';
import { MealLogger } from './MealLogger';
import { WhatCanIEatNow } from './WhatCanIEatNow';
import { PantryInventory } from './PantryInventory';
import { LivePlanAndMarket } from './LivePlanAndMarket';
import { MyDayLedgerTimeline } from './MyDayLedgerTimeline';
import { DailyReportModal } from './DailyReportModal';
import { TopModuleTabs } from './TopModuleTabs';
import { AionGlossaryLibrary } from './AionGlossaryLibrary';
import { AionAgentsAndAnalytics } from './AionAgentsAndAnalytics';
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
  onSelectModule: (id: string) => void;
  onRefreshAll: () => void;
  onBackToCore: () => void;
}

export const ModuleDeepView: React.FC<ModuleDeepViewProps> = ({
  activeModuleId,
  onSelectModule,
  onRefreshAll,
  onBackToCore,
}) => {
  const specialist = new NutritionLeadSpecialist();
  const metabolicState = specialist.getCurrentMetabolicState();
  const energyBalance = specialist.getCurrentEnergyBalance();

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-16">
      {/* PESTAÑAS HORIZONTALES SUPERIORES DEL GRUPO DE MÓDULOS */}
      <TopModuleTabs
        activeModuleId={activeModuleId}
        onSelectModule={onSelectModule}
        onBackToCore={onBackToCore}
      />

      {/* RENDERIZADO DEL SUBMÓDULO SELECCIONADO */}
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
      {activeModuleId === 'glossary' && <AionGlossaryLibrary />}
      {activeModuleId === 'analytics' && <AionAgentsAndAnalytics />}
    </div>
  );
};
