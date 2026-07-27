import React, { useState } from 'react';
import { AionMemoryStore } from '@aion/memory';
import { AegisLedgerEntry, MealRecord, PreparedBatch } from '@aion/shared-types';

interface MyDayLedgerTimelineProps {
  onDataChanged?: () => void;
}

export const MyDayLedgerTimeline: React.FC<MyDayLedgerTimelineProps> = ({ onDataChanged }) => {
  const memoryStore = AionMemoryStore.getInstance();
  const [ledgerEntries, setLedgerEntries] = useState<AegisLedgerEntry[]>(memoryStore.getLedgerEntries());
  const [meals, setMeals] = useState<MealRecord[]>(memoryStore.getMeals());
  const [batches, setBatches] = useState<PreparedBatch[]>(memoryStore.getPreparedBatches());
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCompensation = (entry: AegisLedgerEntry) => {
    memoryStore.addLedgerEntry({
      id: `led-corr-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'correction',
      source: 'user',
      payload: { reversedEntryId: entry.id, note: 'Corrección manual realizada por el usuario' },
      evidence: 'USER_CONFIRMED',
      confidence: 1.0,
      reversible: false,
    });
    setLedgerEntries(memoryStore.getLedgerEntries());
    showToast('✓ Transacción compensatoria registrada en el Ledger.');
    if (onDataChanged) onDataChanged();
  };

  const filteredEntries = ledgerEntries.filter((entry) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'meal') return entry.type === 'meal' || entry.type === 'portion_consumed';
    if (selectedFilter === 'recipe') return entry.type === 'recipe_cooked' || entry.type === 'recipe_created';
    if (selectedFilter === 'inventory') return entry.type.includes('inventory') || entry.type === 'ingredient_used';
    if (selectedFilter === 'correction') return entry.type === 'correction';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {toastMsg && <div className="aion-toast">{toastMsg}</div>}

      <div className="aion-card" style={{ background: 'linear-gradient(135deg, rgba(120, 99, 170, 0.25) 0%, rgba(26, 22, 37, 0.95) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>Mi Día & Registro Vivo</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--aion-sand)', margin: '0.2rem 0' }}>
              Línea temporal transversal auditable de todo lo acontecido hoy.
            </p>
          </div>
          <span className="badge badge-available">{ledgerEntries.length} EVENTOS</span>
        </div>

        {/* Filtros por Tipo de Acontecimiento */}
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'meal', label: 'Comidas' },
            { id: 'recipe', label: 'Recetas' },
            { id: 'inventory', label: 'Despensa' },
            { id: 'correction', label: 'Correcciones' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              style={{
                background: selectedFilter === f.id ? 'var(--aion-lavender)' : 'rgba(255,255,255,0.07)',
                color: selectedFilter === f.id ? '#0F0D15' : 'var(--aion-warm-white)',
                border: 'none',
                borderRadius: '20px',
                padding: '0.3rem 0.7rem',
                fontSize: '0.73rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline de Acontecimientos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredEntries.length === 0 ? (
          <div className="aion-card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📜</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--aion-sand)' }}>No hay acontecimientos registrados para este filtro hoy.</span>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const isExpanded = expandedEntryId === entry.id;
            const timeStr = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const isMeal = entry.type === 'meal';
            const isRecipe = entry.type === 'recipe_cooked';

            return (
              <div
                key={entry.id}
                className="aion-card"
                style={{
                  padding: '0.85rem',
                  borderLeft: `4px solid ${isMeal ? '#34D399' : isRecipe ? 'var(--aion-lavender)' : '#F59E0B'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--aion-lavender)', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                      {timeStr}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>
                      {isMeal
                        ? `Comida: ${entry.payload?.preparation?.name || 'Registro Alimento'}`
                        : isRecipe
                        ? `Receta Cocinada: ${entry.payload?.batch?.recipeName || 'Meal Prep'}`
                        : `Acontecimiento: ${entry.type}`}
                    </span>
                  </div>

                  <button
                    onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--aion-sand)', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    {isExpanded ? '▲ Ocultar' : '▼ Auditar'}
                  </button>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--aion-sand)', lineHeight: 1.35 }}>
                  {isMeal
                    ? `Consumido: ${entry.payload?.consumedPortion?.actualKcal || 0} kcal (${entry.payload?.consumedPortion?.fractionText || '100%'})`
                    : isRecipe
                    ? `Preparado: ${entry.payload?.batch?.totalServings} porciones en refrigerador (quedan ${entry.payload?.batch?.servingsRemaining})`
                    : `Evidencia: ${entry.evidence}`}
                </div>

                {/* Explicabilidad Auditable y Compensación */}
                {isExpanded && (
                  <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
                    <div style={{ color: 'var(--aion-lavender)', fontWeight: 700 }}>SISTEMAS AFECTADOS POR ESTE EVENTO:</div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-available">✓ Balance Energético</span>
                      <span className="badge badge-available">✓ Estado Metabólico</span>
                      <span className="badge badge-available">✓ Inventario Despensa</span>
                      <span className="badge badge-available">✓ Plan Vivo</span>
                    </div>

                    <div style={{ marginTop: '0.4rem', color: 'var(--aion-neutral-light)' }}>
                      <strong>Certeza:</strong> {entry.evidence} • <strong>Confianza:</strong> {((entry.confidence || 0.9) * 100).toFixed(0)}%
                    </div>

                    {entry.reversible !== false && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <button
                          onClick={() => handleCompensation(entry)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            color: '#F87171',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '0.72rem',
                          }}
                        >
                          ↩ Registrar Transacción Compensatoria
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
