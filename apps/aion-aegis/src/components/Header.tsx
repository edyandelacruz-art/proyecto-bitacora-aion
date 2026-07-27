import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="aion-header">
      <div className="aion-brand-badge">
        <div className="aion-logo-dot" />
        <span>AION AEGIS</span>
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--aion-neutral-light)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }}></span>
        <span>AION Protocol v1.0</span>
      </div>
    </header>
  );
};
