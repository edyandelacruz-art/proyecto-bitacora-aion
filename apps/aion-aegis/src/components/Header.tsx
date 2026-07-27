import React, { useState } from 'react';
import { DailyReportModal } from './DailyReportModal';
import { AionCoreOmniModal } from './AionCoreOmniModal';

interface HeaderProps {
  onOpenSettings: () => void;
  onRefreshAll?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onRefreshAll }) => {
  const [showPurposeInfo, setShowPurposeInfo] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isCoreOmniOpen, setIsCoreOmniOpen] = useState(false);

  const handleRefresh = () => {
    if (onRefreshAll) onRefreshAll();
  };

  return (
    <header className="aion-header" style={{ flexDirection: 'column', gap: '0.6rem', alignItems: 'stretch' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="aion-brand-badge" onClick={() => setShowPurposeInfo(!showPurposeInfo)} style={{ cursor: 'pointer' }}>
          <div className="aion-logo-dot" />
          <span style={{ fontWeight: 800, letterSpacing: '0.08em' }}>AION AEGIS</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--aion-lavender)', marginLeft: '0.3rem' }}>[Misión ℹ️]</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {/* Botón AION CORE Super-IA (Superadministrador Soberano) */}
          <button
            onClick={() => setIsCoreOmniOpen(true)}
            style={{
              background: 'linear-gradient(135deg, var(--aion-violet) 0%, #7C3AED 100%)',
              border: '1px solid var(--aion-lavender)',
              color: 'white',
              borderRadius: '8px',
              padding: '0.3rem 0.6rem',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(124, 58, 237, 0.4)',
            }}
          >
            🤖 AION Core Super-IA
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--aion-border-card)',
              color: 'var(--aion-warm-white)',
              borderRadius: '8px',
              padding: '0.3rem 0.5rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            📊 Informes
          </button>

          <button
            onClick={onOpenSettings}
            style={{
              background: 'transparent',
              border: '1px solid var(--aion-border-card)',
              color: 'var(--aion-warm-white)',
              borderRadius: '8px',
              padding: '0.3rem 0.5rem',
              fontSize: '0.72rem',
              cursor: 'pointer',
            }}
          >
            ⚙️ Ajustes
          </button>
        </div>
      </div>

      {/* Tarjeta de Presentación / Misión AION Aegis */}
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
            <li><strong>AION Core Super-IA:</strong> Procesa mensajes naturales (ej. <em>"Gasté 20.000 pesos en pollo"</em>) y actualiza módulos autónomamente.</li>
          </ul>
        </div>
      )}

      {/* Modal AION CORE Super-IA */}
      <AionCoreOmniModal isOpen={isCoreOmniOpen} onClose={() => setIsCoreOmniOpen(false)} onRefreshAll={handleRefresh} />

      {/* Modal de Informe Técnico Diario & Conexión Google Drive */}
      <DailyReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </header>
  );
};
