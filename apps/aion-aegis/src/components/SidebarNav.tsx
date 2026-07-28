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
    sistema: true,
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
        { id: 'glossary', label: 'Glosario & Biblioteca' },
      ],
    },
    {
      id: 'sistema',
      title: 'SISTEMA & AGENTES',
      icon: 'settings_suggest',
      items: [
        { id: 'analytics', label: 'Analítica & Agentes' },
        { id: 'settings', label: 'Perfil & Configuración' },
      ],
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
            <div className="leading-none whitespace-nowrap">
              <span className="font-['Hanken_Grotesk'] text-base font-extrabold tracking-wider text-white">
                AION <span className="text-[#7C3AED]">AEGIS</span>
              </span>
              <p className="text-[9px] font-bold text-[#D6B36A] uppercase tracking-[0.25em] mt-0.5">
                PROTESIS EJECUTIVA
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#C4B5FD] flex items-center justify-center transition-all border border-white/10 shrink-0"
          title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          <span className="material-symbols-outlined text-lg">
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      {/* CORE HOME LINK */}
      <div className="p-3 border-b border-white/5">
        <button
          onClick={() => onSelectNav('core')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-['Manrope'] text-xs font-bold transition-all ${
            currentActive === 'core'
              ? 'bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/30'
              : 'text-[#C4B5FD] hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-lg shrink-0">dashboard</span>
          {!isCollapsed && <span>Aegis Core Feed</span>}
        </button>
      </div>

      {/* NAVIGATION ACCORDION GROUPS */}
      <div className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-4">
        {navGroups.map((group) => {
          const isOpen = openGroups[group.id];
          const hasActiveChild = group.items.some((item) => item.id === currentActive);

          return (
            <div key={group.id} className="space-y-1">
              {/* GROUP HEADER */}
              <button
                onClick={() => toggleGroup(group.id)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-colors ${
                  hasActiveChild ? 'text-[#D6B36A]' : 'text-[#CCC3D8]/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">{group.icon}</span>
                  {!isCollapsed && <span>{group.title}</span>}
                </div>
                {!isCollapsed && (
                  <span className="material-symbols-outlined text-xs opacity-60">
                    {isOpen ? 'expand_less' : 'expand_more'}
                  </span>
                )}
              </button>

              {/* GROUP SUB-ITEMS */}
              {(isOpen || isCollapsed) && (
                <div className="space-y-0.5 pl-2 border-l border-white/5">
                  {group.items.map((item) => {
                    const isActive = currentActive === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelectNav(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                          isActive
                            ? 'bg-[#7C3AED]/20 text-[#C4B5FD] font-bold border border-[#7C3AED]/50'
                            : 'text-[#CCC3D8]/80 hover:bg-white/5 hover:text-white'
                        }`}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <span className="truncate">{isCollapsed ? item.label[0] : item.label}</span>
                        {isActive && !isCollapsed && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* USER PROFILE FOOTER */}
      <div className="p-3 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#D6B36A] flex items-center justify-center text-white text-xs font-bold shrink-0">
            E
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden leading-tight">
              <p className="text-xs font-bold text-white truncate">EDYAN DE LA CRUZ</p>
              <p className="text-[9px] text-[#CCC3D8]/60 truncate">Soberano • Protesis Ejecutiva</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
