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
import { ModuleAgentChatWidget } from './ModuleAgentChatWidget';
import { FinancesDashboard } from './FinancesDashboard';
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

  const getAgentInfo = () => {
    switch (activeModuleId) {
      case 'metabolism':
        return { name: 'MetabolismSupervisorAgent', role: 'Supervisor de Fase Metabólica & Sustratos', icon: 'bolt', placeholder: 'Ej. ¿En qué estado de lipólisis me encuentro ahora?' };
      case 'nutrition':
        return { name: 'NutritionLeadSpecialist', role: 'Especialista Líder en Nutrición Bioquímica', icon: 'restaurant', placeholder: 'Ej. Comí 150g de pechuga a la plancha y 100g de arroz' };
      case 'sleep':
        return { name: 'SleepSupervisorAgent', role: 'Supervisor de Arquitectura Circadiana', icon: 'nights_stay', placeholder: 'Ej. Me acosté a las 11:30 pm y me desperté a las 7:00 am' };
      case 'activity':
        return { name: 'ActivitySupervisorAgent', role: 'Supervisor de Ejercicio & Gasto Energético RPE', icon: 'directions_run', placeholder: 'Ej. Hice 45 min de gimnasio con intensidad 8/10' };
      case 'hydration':
        return { name: 'HydrationSupervisorAgent', role: 'Supervisor de Balance Hídrico & Electrolitos', icon: 'water_drop', placeholder: 'Ej. Tomé un termo de 750ml de agua' };
      case 'pantry':
        return { name: 'InventoryHomeSupervisorAgent', role: 'Supervisor de Cadena de Suministro', icon: 'inventory_2', placeholder: 'Ej. Compré 1kg de pechuga de pollo y 2L de leche' };
      case 'recipes':
        return { name: 'RecipeSkillAgent', role: 'Especialista en Preparaciones Inteligentes', icon: 'auto_awesome', placeholder: 'Ej. ¿Qué puedo cocinar rápidamente con lo que hay en mi despensa?' };
      case 'finances':
        return { name: 'FinancesAgent', role: 'Supervisor de Gastos & Ledger Financiero', icon: 'payments', placeholder: 'Ej. Gasté 25.000 pesos en el supermercado' };
      case 'state':
        return { name: 'StateSupervisorAgent', role: 'Supervisor de Energía, Ánimo & Enfoque', icon: 'psychology', placeholder: 'Ej. Me siento con mucha energía y gran concentración' };
      case 'medication':
        return { name: 'MedicationSupervisorAgent', role: 'Supervisor de Farmacología & Suplementos', icon: 'medication', placeholder: 'Ej. Tomé mi multivitamínico y citrato de magnesio' };
      case 'symptoms':
        return { name: 'SymptomsSupervisorAgent', role: 'Supervisor de Registro Clínico & Síntomas', icon: 'medical_services', placeholder: 'Ej. Tengo una leve molestia lumbar tras el entrenamiento' };
      case 'body':
        return { name: 'BodySupervisorAgent', role: 'Supervisor de Antropometría & Composición Magra', icon: 'straighten', placeholder: 'Ej. Mi peso esta mañana fue de 81.2 kg' };
      case 'habits':
        return { name: 'HabitsSupervisorAgent', role: 'Supervisor de Adherencia & Rutinas', icon: 'published_with_changes', placeholder: 'Ej. Cumplí mi rutina de estiramiento matutina' };
      default:
        return null;
    }
  };

  const agentInfo = getAgentInfo();

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-16">
      {/* PESTAÑAS HORIZONTALES SUPERIORES DEL GRUPO DE MÓDULOS */}
      <TopModuleTabs
        activeModuleId={activeModuleId}
        onSelectModule={onSelectModule}
        onBackToCore={onBackToCore}
      />

      {/* ASISTENTE CONVERSACIONAL DEL AGENTE ESPECIALISTA DEL MÓDULO */}
      {agentInfo && (
        <ModuleAgentChatWidget
          moduleId={activeModuleId}
          agentName={agentInfo.name}
          agentRole={agentInfo.role}
          agentIcon={agentInfo.icon}
          placeholderText={agentInfo.placeholder}
          onRefreshAll={onRefreshAll}
        />
      )}

      {/* RENDERIZADO DEL SUBMÓDULO SELECCIONADO */}
      {(activeModuleId === 'metabolism' || activeModuleId === 'body_met') && (
        <YourBodyNow metabolicState={metabolicState} energyBalance={energyBalance} />
      )}
      {activeModuleId === 'nutrition' && <MealLogger onMealAdded={onRefreshAll} />}
      {activeModuleId === 'recipes' && <WhatCanIEatNow />}
      {activeModuleId === 'pantry' && <PantryInventory />}
      {activeModuleId === 'finances' && <FinancesDashboard onRefresh={onRefreshAll} />}
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
