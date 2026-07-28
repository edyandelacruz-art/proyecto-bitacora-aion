import React, { useState } from 'react';

export interface SidebarNavProps {
  currentActive: string;
  onSelectNav: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavGroup {
  id: string;
  title: string;
  iconSymbol: string;
  items: { id: string; label: string }[];
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentActive,
  onSelectNav,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    estado: true,
    cuidado: false,
    alimentacion: true,
    planificacion: false,
    informacion: false,
    sistema: false,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const navGroups: NavGroup[] = [
    {
      id: 'estado',
      title: 'Mi Estado',
      iconSymbol: 'monitoring',
      items: [
        { id: 'metabolism', label: 'Metabolismo & Fisiología' },
        { id: 'state', label: 'Energía, Ánimo & Foco' },
        { id: 'symptoms', label: 'Dolor & Síntomas' },
        { id: 'body', label: 'Peso & Medidas' },
      ],
    },
    {
      id: 'cuidado',
      title: 'CUIDADO DIARIO',
      iconSymbol: 'vital_signs',
      items: [
        { id: 'sleep', label: 'Sueño & Recuperación' },
        { id: 'activity', label: 'Actividad & Ejercicio' },
        { id: 'hydration', label: 'Hidratación' },
        { id: 'habits', label: 'Hábitos & Rutinas' },
        { id: 'medication', label: 'Medicación' },
      ],
    },
    {
      id: 'alimentacion',
      title: 'ALIMENTACIÓN & HOGAR',
      iconSymbol: 'restaurant',
      items: [
        { id: 'nutrition', label: 'Alimentación / Nutrición' },
        { id: 'pantry', label: 'Despensa / Compras' },
        { id: 'recipes', label: 'Recetas / Preparaciones' },
      ],
    },
    {
      id: 'planificacion',
      title: 'PLANIFICACIÓN',
      iconSymbol: 'event_note',
      items: [
        { id: 'plan', label: 'Plan Vivo' },
        { id: 'alerts', label: 'Alertas & Seguimiento' },
      ],
    },
    {
      id: 'informacion',
      title: 'INFORMACIÓN',
      iconSymbol: 'summarize',
      items: [
        { id: 'reports', label: 'Reportes & Exportaciones' },
        { id: 'audit', label: 'Auditoría Aegis Ledger' },
      ],
    },
    {
      id: 'sistema',
      title: 'SISTEMA',
      iconSymbol: 'settings_suggest',
      items: [{ id: 'settings', label: 'Perfil & Configuración' }],
    },
  ];

  return (
    <aside
      className={`sidebar-transition flex flex-col h-screen bg-[#070709] border-r border-white/5 z-50 fixed lg:relative ${
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
      style={{ position: 'sticky', top: 0 }}
    >
      {/* HEADER LOGO & BRAND */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-white/5 whitespace-nowrap">
        <div className="flex items-center gap-3 overflow-hidden" onClick={() => onSelectNav('core')} style={{ cursor: 'pointer' }}>
          <span className="material-symbols-outlined text-[#7C3AED] text-2xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield
          </span>
          {!isCollapsed && (
            <span className="font-['Hanken_Grotesk'] text-base text-[#7C3AED] font-bold tracking-tight uppercase">
              AION Aegis
            </span>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="text-[#C4B5FD] hover:text-white transition-colors p-1"
          title={isCollapsed ? 'Expandir' : 'Colapsar'}
        >
          <span className="material-symbols-outlined text-sm">
            {isCollapsed ? 'arrow_forward_ios' : 'arrow_back_ios'}
          </span>
        </button>
      </div>

      {/* NAVIGATION ITEMS */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto hide-scrollbar py-4">
        {/* AEGIS CORE PRINCIPAL */}
        <button
          onClick={() => onSelectNav('core')}
          className={`flex items-center h-11 w-full rounded-2xl px-4 gap-3.5 transition-all text-left ${
            currentActive === 'core'
              ? 'bg-[#7C3AED]/20 text-[#C4B5FD] border border-[#7C3AED]/40 font-bold'
              : 'text-white/80 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined shrink-0 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield
          </span>
          {!isCollapsed && (
            <span className="font-['Manrope'] text-[12px] font-bold uppercase tracking-wider">Aegis Core</span>
          )}
        </button>

        {/* MI DÍA BITÁCORA */}
        <button
          onClick={() => onSelectNav('day')}
          className={`flex items-center h-11 w-full rounded-2xl px-4 gap-3.5 transition-all text-left ${
            currentActive === 'day'
              ? 'bg-[#7C3AED]/20 text-[#C4B5FD] border border-[#7C3AED]/40 font-bold'
              : 'text-white/80 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined shrink-0 text-xl">receipt_long</span>
          {!isCollapsed && (
            <span className="font-['Manrope'] text-[12px] font-bold uppercase tracking-wider">Mi Día (Bitácora)</span>
          )}
        </button>

        {!isCollapsed && <div className="h-px bg-white/5 my-3" />}

        {/* GRUPOS ACCORDION */}
        {navGroups.map((group) => {
          const isOpen = !!openGroups[group.id];
          return (
            <div key={group.id} className="space-y-1">
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex items-center justify-between w-full h-8 px-3 gap-3 text-white/40 hover:text-white transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined shrink-0 text-base">{group.iconSymbol}</span>
                  {!isCollapsed && (
                    <span className="font-['Manrope'] text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap">
                      {group.title}
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  <span className="material-symbols-outlined text-xs text-white/30">
                    {isOpen ? 'expand_less' : 'expand_more'}
                  </span>
                )}
              </button>

              {(isOpen || isCollapsed) && (
                <div className={`${isCollapsed ? 'pl-0' : 'pl-9'} space-y-0.5`}>
                  {group.items.map((item) => {
                    const isActive = currentActive === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelectNav(item.id)}
                        className={`block w-full py-1.5 px-2 text-left rounded-lg text-[11px] transition-colors ${
                          isActive
                            ? 'text-[#C4B5FD] font-bold bg-[#7C3AED]/15'
                            : 'text-white/70 hover:text-[#7C3AED]'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
