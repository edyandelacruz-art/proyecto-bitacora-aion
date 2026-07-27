import React, { useState } from 'react';
import { DailyReportEngine } from '@aion/agents';
import { DailyTechnicalReport } from '@aion/shared-types';
import { AionMemoryStore } from '@aion/memory';

interface DailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyReportModal: React.FC<DailyReportModalProps> = ({ isOpen, onClose }) => {
  const reportEngine = DailyReportEngine.getInstance();
  const memoryStore = AionMemoryStore.getInstance();

  const [report, setReport] = useState<DailyTechnicalReport>(reportEngine.generateDailyTechnicalReport());
  const [exportedText, setExportedText] = useState<string | null>(null);
  const [driveEmail, setDriveEmail] = useState<string>('edy.delacruz@gmail.com');
  const [isDriveConnected, setIsDriveConnected] = useState<boolean>(
    !!memoryStore.getCoreProfile().driveIntegration?.connected
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleExport = (format: 'markdown' | 'csv' | 'json') => {
    const text = reportEngine.exportFoodMatrix(format);
    setExportedText(text);
    showToast(`✓ Matriz de alimentación exportada en formato ${format.toUpperCase()}`);
  };

  const handleConnectDrive = () => {
    if (!driveEmail.trim()) return;
    reportEngine.syncWithGoogleDrive(driveEmail.trim());
    setIsDriveConnected(true);
    showToast(`☁️ Google Drive conectado exitosamente con (${driveEmail})`);
  };

  return (
    <div className="aion-modal-overlay">
      <div className="aion-modal" style={{ maxWidth: '540px', maxHeight: '85vh', overflowY: 'auto' }}>
        {toastMsg && <div className="aion-toast">{toastMsg}</div>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
              📊 Informe Técnico Diario & Exportación
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--aion-sand)' }}>
              Generación de informes de nutrición, matrices de alimentación y sincronización con Google Drive.
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* 1. Tarjeta Resumen del Informe Técnico */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--aion-lavender)', fontWeight: 800 }}>
              RESUMEN DEL DÍA: {report.date}
            </span>
            <span className="badge badge-available">
              {report.totalKcal} kcal consumidas
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--aion-warm-white)', lineHeight: 1.45, marginBottom: '0.6rem' }}>
            {report.summaryText}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.75rem' }}>
            <div>
              <span style={{ color: 'var(--aion-sand)', display: 'block', fontSize: '0.65rem' }}>PROTEÍNA</span>
              <strong style={{ color: '#34D399' }}>{report.totalProtein}g</strong>
            </div>
            <div>
              <span style={{ color: 'var(--aion-sand)', display: 'block', fontSize: '0.65rem' }}>CARBOHIDRATOS</span>
              <strong style={{ color: 'var(--aion-glucose)' }}>{report.totalCarbs}g</strong>
            </div>
            <div>
              <span style={{ color: 'var(--aion-sand)', display: 'block', fontSize: '0.65rem' }}>LÍPIDOS</span>
              <strong style={{ color: 'var(--aion-fats)' }}>{report.totalFats}g</strong>
            </div>
          </div>
        </div>

        {/* 2. Conexión a Google Drive */}
        <div style={{ background: 'rgba(91, 75, 138, 0.2)', border: '1px solid var(--aion-lavender)', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 800, color: 'var(--aion-lavender)', fontSize: '0.85rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>☁️ CONEXIÓN CON GOOGLE DRIVE</span>
            {isDriveConnected && <span className="badge badge-available">CONECTADO</span>}
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--aion-sand)', marginBottom: '0.6rem' }}>
            Permite sincronizar automáticamente tu Matriz de Alimentación y respaldar tus informes diarios en Google Drive.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              className="aion-input"
              placeholder="correo.google@gmail.com"
              value={driveEmail}
              onChange={(e) => setDriveEmail(e.target.value)}
              style={{ fontSize: '0.75rem' }}
            />
            <button className="aion-btn-primary" style={{ width: 'auto', padding: '0 0.9rem', fontSize: '0.75rem' }} onClick={handleConnectDrive}>
              {isDriveConnected ? 'Re-Sincronizar' : 'Conectar Drive'}
            </button>
          </div>
        </div>

        {/* 3. Exportación de Matriz en Formatos (Markdown, CSV, JSON) */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--aion-lavender)', fontWeight: 800, marginBottom: '0.4rem' }}>
            📥 EXPORTAR MATRIZ DE ALIMENTACIÓN:
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button className="aion-btn-secondary" style={{ flex: 1, padding: '0.45rem', fontSize: '0.75rem' }} onClick={() => handleExport('markdown')}>
              📄 Formato Markdown
            </button>
            <button className="aion-btn-secondary" style={{ flex: 1, padding: '0.45rem', fontSize: '0.75rem' }} onClick={() => handleExport('csv')}>
              📊 Formato CSV (Excel)
            </button>
            <button className="aion-btn-secondary" style={{ flex: 1, padding: '0.45rem', fontSize: '0.75rem' }} onClick={() => handleExport('json')}>
              📦 Formato JSON
            </button>
          </div>
        </div>

        {/* Área de Visualización de Matriz Exportada */}
        {exportedText && (
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--aion-sand)', fontWeight: 700, marginBottom: '0.2rem' }}>
              VISTA PREVIA DE MATRIZ DE EXPORTACIÓN:
            </div>
            <textarea
              readOnly
              value={exportedText}
              rows={8}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.5)',
                color: '#34D399',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '0.6rem',
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                lineHeight: 1.35,
              }}
            />
          </div>
        )}

        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <button className="aion-btn-primary" style={{ width: 'auto', padding: '0.4rem 1.2rem' }} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
