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
  items: { id: string; label: string; icon: string }[];
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentActive,
  onSelectNav,
  isCollapsed,
  onToggleCollapse,
}) => {
  // Accordion state: open one or more sections
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
      title: 'MI ESTADO',
      items: [
        { id: 'metabolism', label: 'Metabolismo & Fisiología', icon: '🧬' },
        { id: 'state', label: 'Energía, Ánimo & Foco', icon: '⚡' },
        { id: 'symptoms', label: 'Dolor & Síntomas', icon: '🩺' },
        { id: 'body', label: 'Peso & Medidas', icon: '📐' },
      ],
    },
    {
      id: 'cuidado',
      title: 'CUIDADO DIARIO',
      items: [
        { id: 'sleep', label: 'Sueño & Recuperación', icon: '😴' },
        { id: 'activity', label: 'Actividad & Ejercicio', icon: '🏃' },
        { id: 'hydration', label: 'Hidratación', icon: '💧' },
        { id: 'habits', label: 'Hábitos & Rutinas', icon: '🔄' },
        { id: 'medication', label: 'Medicación', icon: '💊' },
      ],
    },
    {
      id: 'alimentacion',
      title: 'ALIMENTACIÓN & HOGAR',
      items: [
        { id: 'nutrition', label: 'Alimentación / Nutrición', icon: '🍎' },
        { id: 'pantry', label: 'Despensa / Compras', icon: '📦' },
        { id: 'recipes', label: 'Recetas / Preparaciones', icon: '💡' },
      ],
    },
    {
      id: 'planificacion',
      title: 'PLANIFICACIÓN',
      items: [
        { id: 'plan', label: 'Plan Vivo', icon: '📅' },
        { id: 'alerts', label: 'Alertas & Seguimiento', icon: '⚠️' },
      ],
    },
    {
      id: 'informacion',
      title: 'INFORMACIÓN',
      items: [
        { id: 'reports', label: 'Reportes & Exportación', icon: '📊' },
        { id: 'audit', label: 'Auditoría Aegis Ledger', icon: '📜' },
      ],
    },
    {
      id: 'sistema',
      title: 'SISTEMA',
      items: [{ id: 'settings', label: 'Perfil & Ajustes', icon: '⚙️' }],
    },
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? '64px' : '260px',
        minWidth: isCollapsed ? '64px' : '260px',
        background: '#0D0B12',
        borderRight: '1px solid #2B2338',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        zIndex: 100,
        position: 'sticky',
        top: 0,
      }}
    >
      {/* BRAND & COLLAPSE HEADER */}
      <div
        style={{
          padding: '1rem',
          borderBottom: '1px solid #2B2338',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
        }}
      >
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#7C3AED', boxShadow: '0 0 8px #7C3AED' }} />
            <span style={{ fontWeight: 800, letterSpacing: '0.08em', color: 'white', fontSize: '1rem' }}>AION AEGIS</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          style={{ background: 'transparent', border: 'none', color: '#C4B5FD', cursor: 'pointer', fontSize: '1rem' }}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* NAV SCROLLABLE BODY */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.6rem 0.4rem' }}>
        {/* DESTINOS PRINCIPALES */}
        <div style={{ marginBottom: '0.8rem' }}>
          {[
            { id: 'core', label: 'Aegis Core', icon: '🤖' },
            { id: 'day', label: 'Mi Día (Bitácora)', icon: '📜' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectNav(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                border: 'none',
                background: currentActive === item.id ? '#7C3AED' : 'transparent',
                color: currentActive === item.id ? 'white' : '#F4F4F5',
                fontWeight: currentActive === item.id ? 800 : 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                marginBottom: '0.2rem',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </div>

        {!isCollapsed && <div style={{ height: '1px', background: '#2B2338', margin: '0.5rem 0' }} />}

        {/* ACCORDION GROUPS */}
        {navGroups.map((group) => {
          const isOpen = !!openGroups[group.id];
          return (
            <div key={group.id} style={{ marginBottom: '0.4rem' }}>
              {!isCollapsed && (
                <button
                  onClick={() => toggleGroup(group.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.35rem 0.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#C4B5FD',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                  }}
                >
                  <span>{group.title}</span>
                  <span>{isOpen ? '▾' : '▸'}</span>
                </button>
              )}

              {(isOpen || isCollapsed) && (
                <div>
                  {group.items.map((item) => {
                    const isActive = currentActive === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelectNav(item.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.45rem 0.7rem',
                          borderRadius: '6px',
                          border: 'none',
                          background: isActive ? 'rgba(124, 58, 237, 0.25)' : 'transparent',
                          color: isActive ? '#C4B5FD' : 'var(--aion-sand)',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          marginBottom: '0.15rem',
                          justifyContent: isCollapsed ? 'center' : 'flex-start',
                        }}
                      >
                        <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                        {!isCollapsed && <span>{item.label}</span>}
                      </button>
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
