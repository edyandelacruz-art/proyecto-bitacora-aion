import React from 'react';
import { AionMemoryStore } from '@aion/memory';

interface HeaderProps {
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const memoryStore = AionMemoryStore.getInstance();
  const profile = memoryStore.getCoreProfile();

  return (
    <header className="aion-header">
      <div className="aion-brand-badge">
        <div className="aion-logo-dot" />
        <span>AION AEGIS</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--aion-neutral-light)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }}></span>
          <span>{profile.city || 'Bogotá'}, {profile.country || 'CO'}</span>
        </div>

        <button
          onClick={onOpenSettings}
          style={{
            background: 'rgba(167, 139, 250, 0.15)',
            border: '1px solid rgba(167, 139, 250, 0.3)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: 'var(--aion-lavender)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
          title="Configuración de Perfil AION"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
};
