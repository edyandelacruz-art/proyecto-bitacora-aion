import React from 'react';

export interface ModuleTabItem {
  id: string;
  label: string;
  icon: string;
}

export interface ModuleGroup {
  groupId: string;
  groupTitle: string;
  tabs: ModuleTabItem[];
}

export const MODULE_GROUPS: ModuleGroup[] = [
  {
    groupId: 'state_group',
    groupTitle: 'MI ESTADO & SALUD',
    tabs: [
      { id: 'metabolism', label: 'Metabolismo', icon: 'bolt' },
      { id: 'state', label: 'Energía & Ánimo', icon: 'psychology' },
      { id: 'symptoms', label: 'Dolor & Síntomas', icon: 'medical_services' },
      { id: 'body', label: 'Peso & Medidas', icon: 'straighten' },
    ],
  },
  {
    groupId: 'care_group',
    groupTitle: 'CUIDADO DIARIO',
    tabs: [
      { id: 'sleep', label: 'Sueño & Recuperación', icon: 'nights_stay' },
      { id: 'activity', label: 'Actividad Físico', icon: 'directions_run' },
      { id: 'hydration', label: 'Hidratación', icon: 'water_drop' },
      { id: 'habits', label: 'Hábitos & Rutinas', icon: 'published_with_changes' },
      { id: 'medication', label: 'Medicación', icon: 'medication' },
    ],
  },
  {
    groupId: 'food_group',
    groupTitle: 'ALIMENTACIÓN & HOGAR',
    tabs: [
      { id: 'nutrition', label: 'Nutrición Ingesta', icon: 'restaurant' },
      { id: 'pantry', label: 'Despensa & Compras', icon: 'inventory_2' },
      { id: 'recipes', label: 'Recetas & Sugerencias', icon: 'auto_awesome' },
      { id: 'finances', label: 'Finanzas & Compras', icon: 'payments' },
    ],
  },
  {
    groupId: 'info_group',
    groupTitle: 'AUDITORÍA, REPORTES & CONOCIMIENTO',
    tabs: [
      { id: 'reports', label: 'Reportes & XLSX', icon: 'summarize' },
      { id: 'audit', label: 'Mi Día & Ledger', icon: 'terminal' },
      { id: 'glossary', label: 'Glosario & Biblioteca', icon: 'menu_book' },
      { id: 'analytics', label: 'Analítica & Agentes', icon: 'bar_chart' },
    ],
  },
];

interface TopModuleTabsProps {
  activeModuleId: string;
  onSelectModule: (id: string) => void;
  onBackToCore: () => void;
}

export const TopModuleTabs: React.FC<TopModuleTabsProps> = ({
  activeModuleId,
  onSelectModule,
  onBackToCore,
}) => {
  const currentGroup = MODULE_GROUPS.find((g) =>
    g.tabs.some((t) => t.id === activeModuleId)
  ) || MODULE_GROUPS[0];

  return (
    <div className="bg-[#111017] p-4 lg:p-6 rounded-[32px] border border-white/10 shadow-2xl space-y-4 mb-6">
      {/* BARRA SUPERIOR DE NAVEGACIÓN HIERÁRQUICA */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCore}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#C4B5FD] text-xs font-bold hover:bg-[#7C3AED]/20 transition-all"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Aegis Core Feed
          </button>
          <div className="h-5 w-px bg-white/10"></div>
          <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em]">
            {currentGroup.groupTitle}
          </span>
        </div>

        {/* SELECTOR DE GRUPOS RÁPIDO */}
        <div className="flex gap-2">
          {MODULE_GROUPS.map((grp) => {
            const isGroupActive = grp.groupId === currentGroup.groupId;
            return (
              <button
                key={grp.groupId}
                onClick={() => onSelectModule(grp.tabs[0].id)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                  isGroupActive
                    ? 'bg-[#7C3AED]/20 text-[#C4B5FD] border border-[#7C3AED]/50'
                    : 'bg-white/5 text-[#CCC3D8]/50 hover:text-white'
                }`}
              >
                {grp.groupTitle.split('&')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* PESTAÑAS HORIZONTALES DEL GRUPO ACTIVO */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar border-t border-white/10 pt-4">
        {currentGroup.tabs.map((tab) => {
          const isActive = tab.id === activeModuleId;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectModule(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-lg shadow-[#7C3AED]/30 scale-[1.02]'
                  : 'bg-white/5 text-[#CCC3D8]/70 border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
