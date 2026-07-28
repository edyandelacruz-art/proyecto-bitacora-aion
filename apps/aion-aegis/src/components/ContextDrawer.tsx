import React from 'react';
import { NutritionLeadSpecialist } from '@aion/agents';
import { AionMemoryStore } from '@aion/memory';

interface ContextDrawerProps {
  isOpen: boolean;
  topic: string;
  onClose: () => void;
}

export const ContextDrawer: React.FC<ContextDrawerProps> = ({ isOpen, topic, onClose }) => {
  if (!isOpen) return null;

  const store = AionMemoryStore.getInstance();
  const specialist = new NutritionLeadSpecialist();

  const metabolicState = specialist.getCurrentMetabolicState('biochemical');
  const ledgerEntries = store.getLedgerEntries().slice(0, 10);
  const meals = store.getMeals();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '380px',
        maxWidth: '90vw',
        background: 'rgba(13, 11, 18, 0.98)',
        borderLeft: '1px solid #7C3AED',
        boxShadow: '-4px 0 30px rgba(0,0,0,0.8)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.2rem',
        overflowY: 'auto',
      }}
    >
      {/* HEADER DRAWER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #2B2338', paddingBottom: '0.6rem' }}>
        <div style={{ fontWeight: 800, color: '#C4B5FD', fontSize: '0.95rem' }}>
          🔍 INSPECTOR CONTEXTUAL & EVIDENCIA
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>
          ✕
        </button>
      </div>

      {/* CONTENIDO SEGÚN TEMA */}
      {topic === 'biochemistry' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'white' }}>
            🔬 DESGLOSE BIOQUÍMICO & RUTAS ENZIMÁTICAS
          </div>
          <div style={{ fontSize: '0.75rem', color: '#DDD6FE', background: '#111017', padding: '0.8rem', borderRadius: '8px', border: '1px solid #2B2338', lineHeight: 1.5 }}>
            {metabolicState.detailedTechnicalExplanation}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'white', fontWeight: 700, marginTop: '0.4rem' }}>
            ESTADO DE SUSTRATOS & REGULACIÓN HORMONAL:
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--aion-sand)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <div>• <strong>Glucosa:</strong> {metabolicState.glucoseStatus}</div>
            <div>• <strong>Lipólisis:</strong> {metabolicState.fatsStatus}</div>
            <div>• <strong>Síntesis Proteica:</strong> {metabolicState.proteinsStatus}</div>
            <div>• <strong>Glucógeno:</strong> {metabolicState.glycogenStatus}</div>
          </div>
        </div>
      )}

      {topic === 'evidence' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'white' }}>
            📸 EVIDENCIA VISUAL & FOTOGRAFÍAS
          </div>
          {meals.filter((m) => m.imageUrl).length === 0 ? (
            <div style={{ fontSize: '0.75rem', color: 'var(--aion-sand)' }}>No hay fotografías de alimentos en el registro actual.</div>
          ) : (
            meals
              .filter((m) => m.imageUrl)
              .map((m) => (
                <div key={m.id} style={{ background: '#111017', padding: '0.6rem', borderRadius: '8px', border: '1px solid #2B2338' }}>
                  <img src={m.imageUrl} alt={m.preparation.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.4rem' }} />
                  <div style={{ fontSize: '0.75rem', color: 'white', fontWeight: 700 }}>{m.preparation.name}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--aion-sand)' }}>{m.evidenceSummary} • Confiabilidad: {m.confidence}</div>
                </div>
              ))
          )}
        </div>
      )}

      {topic === 'audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'white' }}>
            📜 TRAZABILIDAD DEL AEGIS LEDGER
          </div>
          {ledgerEntries.map((lg) => (
            <div key={lg.id} style={{ background: '#111017', padding: '0.55rem', borderRadius: '6px', border: '1px solid #2B2338', fontSize: '0.7rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#C4B5FD', fontWeight: 700 }}>
                <span>{lg.type}</span>
                <span>{new Date(lg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div style={{ color: 'var(--aion-sand)', marginTop: '0.2rem' }}>
                Fuente: {lg.source} • Evidencia: {lg.evidence} • Confiabilidad: {((lg.confidence || 0.9) * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
