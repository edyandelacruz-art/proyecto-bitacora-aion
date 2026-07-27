import React, { useState } from 'react';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const [showPurposeInfo, setShowPurposeInfo] = useState(false);

  return (
    <header className="aion-header" style={{ flexDirection: 'column', gap: '0.6rem', alignItems: 'stretch' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="aion-brand-badge" onClick={() => setShowPurposeInfo(!showPurposeInfo)} style={{ cursor: 'pointer' }}>
          <div className="aion-logo-dot" />
          <span style={{ fontWeight: 800, letterSpacing: '0.08em' }}>AION AEGIS</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--aion-lavender)', marginLeft: '0.3rem' }}>[¿Qué es esto? ℹ️]</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--aion-sand)', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
            ● Protocolo Activo
          </span>
          <button
            onClick={onOpenSettings}
            style={{
              background: 'transparent',
              border: '1px solid var(--aion-border-card)',
              color: 'var(--aion-warm-white)',
              borderRadius: '8px',
              padding: '0.3rem 0.6rem',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            ⚙️ Ajustes
          </button>
        </div>
      </div>

      {/* Tarjeta de Presentación / Misión AION Aegis (Pedagógica) */}
      {showPurposeInfo && (
        <div style={{ background: 'rgba(91, 75, 138, 0.25)', border: '1px solid var(--aion-lavender)', borderRadius: '10px', padding: '0.75rem', fontSize: '0.78rem', color: 'var(--aion-warm-white)', lineHeight: 1.45 }}>
          <div style={{ fontWeight: 800, color: 'var(--aion-lavender)', marginBottom: '0.3rem' }}>
            📌 ¿PARA QUÉ SIRVE AION AEGIS?
          </div>
          <div>
            AION Aegis es tu **Especialista de Nutrición y Acompañamiento Inteligente**:
          </div>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <li><strong>Análisis por Foto:</strong> Estima porciones en gramos y macronutrientes de tus platos.</li>
            <li><strong>Monitoreo Metabólico:</strong> Predice en qué fase energética (posprandial, postabsortivo, quema de grasa) está tu cuerpo.</li>
            <li><strong>Despensa Inteligente:</strong> Administra tu inventario y genera recetas aprovechando lo que tienes.</li>
            <li><strong>Registro Auditable:</strong> Cada ingrediente y comida queda guardado en tu bitácora inmutable.</li>
          </ul>
        </div>
      )}
    </header>
  );
};
