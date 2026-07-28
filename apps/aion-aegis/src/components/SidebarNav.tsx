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
    cuidado: false,
    alimentacion: false,
    planificacion: false,
    informacion: false,
    sistema: false,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const navGroups = [
    {
      id: 'estado',
      title: 'Mi Estado',
      icon: 'monitoring',
      items: [
        { id: 'body', label: 'Cuerpo y peso' },
        { id: 'metabolism', label: 'Metabolismo' },
        { id: 'state', label: 'Energía / Ánimo / Hambre' },
        { id: 'symptoms', label: 'Dolor y síntomas' },
      ],
    },
    {
      id: 'cuidado',
      title: 'Cuidado Diario',
      icon: 'vital_signs',
      items: [
        { id: 'sleep', label: 'Sueño y recuperación' },
        { id: 'activity', label: 'Actividad y ejercicio' },
        { id: 'hydration', label: 'Hidratación' },
        { id: 'habits', label: 'Hábitos y rutinas' },
        { id: 'medication', label: 'Medicación y suplementos' },
      ],
    },
    {
      id: 'alimentacion',
      title: 'Alimentación',
      icon: 'restaurant',
      items: [
        { id: 'nutrition', label: 'Nutrición' },
        { id: 'pantry', label: 'Despensa / Compras' },
        { id: 'recipes', label: 'Recetas' },
      ],
    },
    {
      id: 'planificacion',
      title: 'Planificación',
      icon: 'event_note',
      items: [
        { id: 'plan', label: 'Plan Vivo' },
        { id: 'alerts', label: 'Alertas / Seguimiento' },
      ],
    },
    {
      id: 'informacion',
      title: 'Información',
      icon: 'summarize',
      items: [
        { id: 'reports', label: 'Reportes' },
        { id: 'reports', label: 'Exportaciones' },
        { id: 'audit', label: 'Auditoría Aegis' },
      ],
    },
  ];

  return (
    <aside
      id="sidebar"
      className={`sidebar-transition group flex flex-col h-screen bg-[#070709] border-r border-white/10 z-50 fixed lg:relative ${
        isCollapsed ? 'w-[80px] hover:w-[280px]' : 'w-[280px]'
      }`}
      style={{ position: 'sticky', top: 0 }}
    >
      {/* BRAND HEADER */}
      <div className="h-20 flex items-center px-6 overflow-hidden whitespace-nowrap justify-between">
        <div className="flex items-center gap-4 min-w-[40px] cursor-pointer" onClick={() => onSelectNav('core')}>
          <span className="material-symbols-outlined text-[#7C3AED] text-2xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield
          </span>
          <span className="font-['Hanken_Grotesk'] text-lg text-[#7C3AED] tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold uppercase">
            AION Aegis
          </span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="text-[#CCC3D8]/50 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
          title={isCollapsed ? 'Expandir' : 'Colapsar'}
        >
          <span className="material-symbols-outlined text-sm">
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      {/* NAV LIST */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto hide-scrollbar py-4">
        {/* AEGIS CORE ROOT */}
        <div
          onClick={() => onSelectNav('core')}
          className={`flex items-center h-12 rounded-2xl px-4 gap-4 transition-all mb-4 cursor-pointer ${
            currentActive === 'core'
              ? 'text-[#7C3AED] bg-[#7C3AED]/10 border border-[#7C3AED]/30 font-bold'
              : 'text-[#E5E1E5]/80 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined shrink-0 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield
          </span>
          <span className="font-['Manrope'] text-[11px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold uppercase tracking-wider">
            Aegis Core
          </span>
        </div>

        {/* ACCORDION GROUPS STITCH 1:1 */}
        <div className="space-y-4">
          {navGroups.map((group) => {
            const isOpen = !!openGroups[group.id];
            return (
              <div key={group.id} className="nav-group">
                <div
                  onClick={() => toggleGroup(group.id)}
                  className="flex items-center h-8 px-4 gap-4 text-[#CCC3D8]/60 cursor-pointer hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined shrink-0 text-sm">{group.icon}</span>
                  <span className="font-['Manrope'] text-[10px] uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
                    {group.title}
                  </span>
                </div>

                {isOpen && (
                  <div className="space-y-1 pl-12 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {group.items.map((item) => {
                      const isActive = currentActive === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => onSelectNav(item.id)}
                          className={`block py-1.5 text-[11px] cursor-pointer transition-colors ${
                            isActive ? 'text-[#7C3AED] font-bold' : 'text-[#CCC3D8]/80 hover:text-[#7C3AED]'
                          }`}
                        >
                          {item.label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* SYSTEM BOTTOM ITEM */}
      <div className="px-4 pb-8 space-y-1 border-t border-white/5 pt-4">
        <div className="nav-group">
          <div
            onClick={() => onSelectNav('settings')}
            className="flex items-center h-10 px-4 gap-4 text-[#CCC3D8]/60 cursor-pointer hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined shrink-0 text-sm">settings_suggest</span>
            <span className="font-['Manrope'] text-[10px] uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
              Sistema
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
