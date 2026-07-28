import React, { useState } from 'react';

export interface SidebarNavProps {
  currentActive: string;
  onSelectNav: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentActive,
  onSelectNav,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    estado: true,
    cuidado: true,
    alimentacion: true,
    planificacion: true,
    informacion: true,
    sistema: false,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const navGroups = [
    {
      id: 'estado',
      title: 'MI ESTADO',
      icon: 'monitoring',
      items: [
        { id: 'metabolism', label: 'Metabolismo & Fisiología' },
        { id: 'state', label: 'Energía / Ánimo / Hambre' },
        { id: 'symptoms', label: 'Dolor y Síntomas' },
        { id: 'body', label: 'Peso & Medidas' },
      ],
    },
    {
      id: 'cuidado',
      title: 'CUIDADO DIARIO',
      icon: 'vital_signs',
      items: [
        { id: 'sleep', label: 'Sueño & Recuperación' },
        { id: 'activity', label: 'Actividad & Ejercicio' },
        { id: 'hydration', label: 'Hidratación' },
        { id: 'habits', label: 'Hábitos & Rutinas' },
        { id: 'medication', label: 'Medicación & Suplementos' },
      ],
    },
    {
      id: 'alimentacion',
      title: 'ALIMENTACIÓN & HOGAR',
      icon: 'restaurant',
      items: [
        { id: 'nutrition', label: 'Nutrición & Balance' },
        { id: 'pantry', label: 'Despensa & Compras' },
        { id: 'recipes', label: 'Recetas & Preparaciones' },
      ],
    },
    {
      id: 'planificacion',
      title: 'PLANIFICACIÓN',
      icon: 'event_note',
      items: [
        { id: 'plan', label: 'Plan Vivo' },
        { id: 'alerts', label: 'Alertas & Seguimiento' },
      ],
    },
    {
      id: 'informacion',
      title: 'INFORMACIÓN & AUDITORÍA',
      icon: 'summarize',
      items: [
        { id: 'reports', label: 'Reportes & Exportación' },
        { id: 'audit', label: 'Auditoría Aegis Ledger' },
      ],
    },
    {
      id: 'sistema',
      title: 'SISTEMA',
      icon: 'settings_suggest',
      items: [{ id: 'settings', label: 'Perfil & Configuración' }],
    },
  ];

  return (
    <aside
      className={`sidebar-transition flex flex-col h-screen bg-[#070709] border-r border-white/10 z-50 fixed lg:relative ${
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
      style={{ position: 'sticky', top: 0 }}
    >
      {/* BRAND HEADER & TOGGLE BUTTON */}
      <div className="h-20 flex items-center px-4 justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3 cursor-pointer overflow-hidden" onClick={() => onSelectNav('core')}>
          <span className="material-symbols-outlined text-[#7C3AED] text-2xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield
          </span>
          {!isCollapsed && (
            <span className="font-['Hanken_Grotesk'] text-base text-[#7C3AED] font-bold tracking-tight uppercase whitespace-nowrap">
              AION Aegis
            </span>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-[#7C3AED]/20 text-[#CCC3D8] hover:text-white transition-all flex items-center justify-center shrink-0"
          title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          <span className="material-symbols-outlined text-base">
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      {/* NAV ITEMS LIST SCROLLABLE */}
      <div className="flex-1 px-3 py-4 space-y-3 overflow-y-auto hide-scrollbar">
        {/* AEGIS CORE MAIN DESTINATION */}
        <div
          onClick={() => onSelectNav('core')}
          className={`flex items-center h-11 rounded-2xl px-3.5 gap-3 cursor-pointer transition-all ${
            currentActive === 'core'
              ? 'bg-[#7C3AED]/20 text-[#C4B5FD] border border-[#7C3AED]/50 font-bold'
              : 'text-[#E5E1E5]/80 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield
          </span>
          {!isCollapsed && (
            <span className="font-['Manrope'] text-[12px] font-bold uppercase tracking-wider whitespace-nowrap">
              Aegis Core
            </span>
          )}
        </div>

        {/* MI DÍA BITÁCORA */}
        <div
          onClick={() => onSelectNav('day')}
          className={`flex items-center h-11 rounded-2xl px-3.5 gap-3 cursor-pointer transition-all ${
            currentActive === 'day'
              ? 'bg-[#7C3AED]/20 text-[#C4B5FD] border border-[#7C3AED]/50 font-bold'
              : 'text-[#E5E1E5]/80 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-xl shrink-0">receipt_long</span>
          {!isCollapsed && (
            <span className="font-['Manrope'] text-[12px] font-bold uppercase tracking-wider whitespace-nowrap">
              Mi Día (Bitácora)
            </span>
          )}
        </div>

        {!isCollapsed && <div className="h-px bg-white/10 my-2" />}

        {/* ACCORDION GROUPS */}
        {navGroups.map((group) => {
          const isOpen = !!openGroups[group.id];
          return (
            <div key={group.id} className="space-y-1">
              <div
                onClick={() => toggleGroup(group.id)}
                className="flex items-center justify-between h-8 px-3 text-[#CCC3D8]/70 hover:text-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="material-symbols-outlined text-base shrink-0 text-[#7C3AED]">{group.icon}</span>
                  {!isCollapsed && (
                    <span className="font-['Manrope'] text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#C4B5FD] whitespace-nowrap">
                      {group.title}
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  <span className="material-symbols-outlined text-xs text-[#CCC3D8]/50">
                    {isOpen ? 'expand_less' : 'expand_more'}
                  </span>
                )}
              </div>

              {(isOpen || isCollapsed) && (
                <div className={`${isCollapsed ? 'pl-0' : 'pl-8'} space-y-1`}>
                  {group.items.map((item) => {
                    const isActive = currentActive === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelectNav(item.id)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold cursor-pointer transition-all whitespace-nowrap ${
                          isActive
                            ? 'text-[#C4B5FD] font-bold bg-[#7C3AED]/25 border-l-2 border-[#7C3AED]'
                            : 'text-[#E5E1E5]/70 hover:text-white hover:bg-white/5'
                        }`}
                        title={isCollapsed ? item.label : undefined}
                      >
                        {!isCollapsed ? item.label : '•'}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
