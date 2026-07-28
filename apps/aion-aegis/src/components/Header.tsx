import React, { useState } from 'react';
import { DailyReportModal } from './DailyReportModal';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const [showPurposeInfo, setShowPurposeInfo] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <header className="aion-header" style={{ background: '#0D0B12', borderBottom: '1px solid #2B2338', padding: '0.85rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="aion-brand-badge" onClick={() => setShowPurposeInfo(!showPurposeInfo)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="aion-logo-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: '#7C3AED', boxShadow: '0 0 8px #7C3AED' }} />
          <span style={{ fontWeight: 800, letterSpacing: '0.08em', color: 'white', fontSize: '1.05rem' }}>AION AEGIS</span>
          <span style={{ fontSize: '0.68rem', color: '#C4B5FD', marginLeft: '0.2rem' }}>[Misión ℹ️]</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setIsReportModalOpen(true)}
            style={{
              background: 'rgba(124, 58, 237, 0.15)',
              border: '1px solid rgba(196, 181, 253, 0.25)',
              color: '#C4B5FD',
              borderRadius: '8px',
              padding: '0.35rem 0.7rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            📊 Informes & Exportar
          </button>

          <button
            onClick={onOpenSettings}
            style={{
              background: 'transparent',
              border: '1px solid #2B2338',
              color: '#F4F4F5',
              borderRadius: '8px',
              padding: '0.35rem 0.7rem',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            ⚙️ Ajustes
          </button>
        </div>
      </div>

      {/* Tarjeta de Presentación / Misión AION Aegis */}
      {showPurposeInfo && (
        <div style={{ background: 'rgba(23, 19, 31, 0.95)', border: '1px solid #7C3AED', borderRadius: '10px', padding: '0.85rem', fontSize: '0.78rem', color: '#F4F4F5', lineHeight: 1.45, marginTop: '0.3rem' }}>
          <div style={{ fontWeight: 800, color: '#C4B5FD', marginBottom: '0.3rem' }}>
            📌 AION AEGIS — CENTRO DE MANDO UNIFICADO
          </div>
          <div>
            Tu Bitácora Inteligente Multidominio. Aegis monitorea tu estado metabólico en vivo, gestiona tu alimentación, sueñó, actividad, despensa e informes diarios.
          </div>
        </div>
      )}

      {/* Modal de Informe Técnico Diario & Conexión Google Drive */}
      <DailyReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </header>
  );
};
