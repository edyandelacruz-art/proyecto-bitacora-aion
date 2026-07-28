import React, { useState } from 'react';
import { NutritionLeadSpecialist, AionCoreSuperAgent, OmniDispatchResult } from '@aion/agents';
import { AionMemoryStore } from '@aion/memory';
import { SatelliteModuleConfig } from '@aion/shared-types';

interface AegisCoreFeedProps {
  onRefreshAll: () => void;
  onOpenModuleDeepView: (moduleId: string) => void;
  onOpenInspector: (topic: string) => void;
}

export const AegisCoreFeed: React.FC<AegisCoreFeedProps> = ({
  onRefreshAll,
  onOpenModuleDeepView,
  onOpenInspector,
}) => {
  const store = AionMemoryStore.getInstance();
  const specialist = new NutritionLeadSpecialist();
  const coreAgent = AionCoreSuperAgent.getInstance();

  const metabolicState = specialist.getCurrentMetabolicState();
  const energyBalance = specialist.getCurrentEnergyBalance();
  const plan = store.getLivePlan();
  const inventory = store.getInventory() || [];
  const sleep = store.getSleepRecords() || [];
  const activity = store.getActivityRecords() || [];
  const hydration = store.getHydrationRecords() || [];
  const stateRecs = store.getStateRecords() || [];

  const currentWater = (hydration || []).reduce((acc, h) => acc + (h?.amountMl || 0), 0);
  const totalActivityMin = (activity || []).reduce((acc, a) => acc + (a?.durationMinutes || 0), 0);
  const expiringItems = (inventory || []).filter((i) => i && (i.availability === 'PRÓXIMO A VENCER' || i.availability === 'BAJO'));

  const [omniInput, setOmniInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastDispatch, setLastDispatch] = useState<OmniDispatchResult | null>(null);

  // Módulos Satélite Configurables (Pin, Minimizar, Ocultar)
  const [satellites, setSatellites] = useState<SatelliteModuleConfig[]>([
    { moduleId: 'nutrition', title: '🍎 Nutrición & Balance', category: 'Alimentación & Hogar', visibility: 'pinned', order: 1 },
    { moduleId: 'metabolism', title: '🧬 Estado Metabólico', category: 'Mi Estado', visibility: 'pinned', order: 2 },
    { moduleId: 'sleep', title: '😴 Sueño & Recuperación', category: 'Cuidado Diario', visibility: 'normal', order: 3 },
    { moduleId: 'activity', title: '🏃 Actividad & RPE', category: 'Cuidado Diario', visibility: 'normal', order: 4 },
    { moduleId: 'hydration', title: '💧 Hidratación', category: 'Cuidado Diario', visibility: 'normal', order: 5 },
    { moduleId: 'pantry', title: '📦 Despensa & Compras', category: 'Alimentación & Hogar', visibility: 'normal', order: 6 },
    { moduleId: 'plan', title: '📅 Plan Vivo', category: 'Planificación', visibility: 'normal', order: 7 },
  ]);

  const togglePin = (moduleId: string) => {
    setSatellites((prev) =>
      prev.map((s) =>
        s.moduleId === moduleId
          ? { ...s, visibility: s.visibility === 'pinned' ? 'normal' : 'pinned' }
          : s
      )
    );
  };

  const toggleMinimize = (moduleId: string) => {
    setSatellites((prev) =>
      prev.map((s) =>
        s.moduleId === moduleId
          ? { ...s, visibility: s.visibility === 'minimized' ? 'normal' : 'minimized' }
          : s
      )
    );
  };

  const hideModule = (moduleId: string) => {
    setSatellites((prev) =>
      prev.map((s) => (s.moduleId === moduleId ? { ...s, visibility: 'hidden' } : s))
    );
  };

  const restoreModule = (moduleId: string) => {
    setSatellites((prev) =>
      prev.map((s) => (s.moduleId === moduleId ? { ...s, visibility: 'normal' } : s))
    );
  };

  const handleSendPrompt = async (textToSend?: string) => {
    const input = (textToSend || omniInput).trim();
    if (!input) return;

    setOmniInput('');
    setIsProcessing(true);

    try {
      const res = await coreAgent.processOmniInput(input);
      setLastDispatch(res);
      onRefreshAll();
    } catch (e) {
      console.error('Error al procesar entrada:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingBottom: '2rem' }}>
      {/* 1. HEADER CONTEXTUAL MÍNIMO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', margin: 0 }}>
            AEGIS CORE
          </h1>
          <span style={{ fontSize: '0.75rem', color: '#C4B5FD' }}>
            Pulso Vivo: {metabolicState.phaseTitle} • {metabolicState.hoursElapsedSinceLastMeal?.toFixed(1) || 0}h desde comida
          </span>
        </div>

        <button
          className="aion-btn-secondary"
          style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.72rem' }}
          onClick={() => onOpenInspector('biochemistry')}
        >
          🔬 Inspector Bioquímico
        </button>
      </div>

      {/* 2. COMPOSER CONVERSACIONAL MULTIMODAL + ACCIONES RÁPIDAS */}
      <div
        className="aion-card"
        style={{
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(13, 11, 18, 0.98) 100%)',
          border: '1.5px solid #7C3AED',
          padding: '1.2rem',
        }}
      >
        <textarea
          className="aion-input"
          rows={3}
          placeholder="Expresa cualquier hecho en lenguaje natural: 'Me comí una pechuga con papa', 'Dormí 8 horas', 'Gasté 20.000 pesos'..."
          value={omniInput}
          onChange={(e) => setOmniInput(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(196, 181, 253, 0.3)',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            fontSize: '0.88rem',
            color: 'white',
            resize: 'none',
          }}
        />

        {/* ACCIONES RÁPIDAS CONTEXTUALES */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
          {[
            '🍗 "Comí 200g de pollo salteado con papa"',
            '😴 "Dormí 7.5h y me siento renovado"',
            '💧 "Tomé 500ml de agua"',
            '🏃 "Caminé 45 minutos"',
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(chip.replace(/^[^"]*"|"$|"/g, ''))}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'var(--aion-sand)',
                borderRadius: '16px',
                padding: '0.3rem 0.65rem',
                fontSize: '0.72rem',
                cursor: 'pointer',
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.6rem' }}>
          <button
            className="aion-btn-primary"
            style={{ width: 'auto', padding: '0.5rem 1.3rem', fontSize: '0.82rem', fontWeight: 800 }}
            onClick={() => handleSendPrompt()}
            disabled={isProcessing || !omniInput.trim()}
          >
            {isProcessing ? '⚡ Procesando en Aegis Core...' : '🚀 Enviar a Aegis Core'}
          </button>
        </div>

        {/* ÚLTIMO RECIBO DE ACCIÓN */}
        {lastDispatch && (
          <div
            style={{
              marginTop: '1rem',
              background: 'rgba(17, 16, 23, 0.95)',
              border: '1px solid #7C3AED',
              borderRadius: '10px',
              padding: '0.8rem',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 800, marginBottom: '0.3rem' }}>
              ✓ RESPUESTA DE AEGIS CORE
            </div>
            <div style={{ fontSize: '0.85rem', color: 'white' }}>{lastDispatch.coreReply}</div>
          </div>
        )}
      </div>

      {/* 3. PULSO DE HOY (ESTADO VIVO) */}
      <div className="aion-card" style={{ background: '#111017' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C4B5FD', letterSpacing: '0.08em' }}>
            PULSO DE HOY
          </span>
          <span className="badge badge-available">EN VIVO</span>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: 700 }}>
          {metabolicState.naturalExplanation}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--aion-sand)', marginTop: '0.3rem' }}>
          Glucosa: {metabolicState.glucoseStatus} • Lípidos: {metabolicState.fatsStatus}
        </div>
      </div>

      {/* 4. AEGIS DETECTA (ALERTAS INTELLIGENTES) */}
      {expiringItems.length > 0 && (
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>⚠️</span>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F59E0B' }}>
                AEGIS DETECTA: Ingredientes próximos a vencer
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--aion-sand)' }}>
                {expiringItems.map((i) => i.name).join(', ')} en tu refrigerador.
              </div>
            </div>
          </div>
          <button
            onClick={() => onOpenModuleDeepView('recipes')}
            style={{
              background: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid #F59E0B',
              color: '#F59E0B',
              borderRadius: '6px',
              padding: '0.3rem 0.65rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            💡 Ver Recetas
          </button>
        </div>
      )}

      {/* 5. MÓDULOS SATÉLITE CONFIGURABLES (MIS MÓDULOS) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#C4B5FD', letterSpacing: '0.06em' }}>
            MIS MÓDULOS SATÉLITE
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--aion-sand)' }}>
            📌 Fijado | _ Minimizado | ✕ Ocultar
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
          {satellites
            .filter((s) => s.visibility !== 'hidden')
            .map((s) => {
              const isMinimized = s.visibility === 'minimized';
              const isPinned = s.visibility === 'pinned';

              return (
                <div
                  key={s.moduleId}
                  className="aion-card"
                  style={{
                    border: isPinned ? '1px solid #7C3AED' : '1px solid #2B2338',
                    background: isPinned ? 'rgba(124, 58, 237, 0.1)' : '#111017',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'white' }}>{s.title}</span>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button onClick={() => togglePin(s.moduleId)} title="Fijar / Desfijar al feed" style={{ background: 'transparent', border: 'none', color: isPinned ? '#7C3AED' : 'var(--aion-sand)', cursor: 'pointer' }}>
                        📌
                      </button>
                      <button onClick={() => toggleMinimize(s.moduleId)} title="Minimizar" style={{ background: 'transparent', border: 'none', color: 'var(--aion-sand)', cursor: 'pointer' }}>
                        {isMinimized ? '□' : '_'}
                      </button>
                      <button onClick={() => hideModule(s.moduleId)} title="Ocultar de Core" style={{ background: 'transparent', border: 'none', color: 'var(--aion-sand)', cursor: 'pointer' }}>
                        ✕
                      </button>
                      <button onClick={() => onOpenModuleDeepView(s.moduleId)} title="Abrir profundidad" style={{ background: 'transparent', border: 'none', color: '#C4B5FD', cursor: 'pointer' }}>
                        ↗
                      </button>
                    </div>
                  </div>

                  {!isMinimized && (
                    <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: 'var(--aion-sand)' }}>
                      {s.moduleId === 'nutrition' && (
                        <div>
                          Calorías: <strong>{energyBalance.consumedKcal}</strong> / {energyBalance.targetKcal} kcal • Proteína: <strong>{plan.macroConsumed.protein}g</strong>
                        </div>
                      )}
                      {s.moduleId === 'metabolism' && (
                        <div>
                          Fase: <strong>{metabolicState.currentPhase}</strong> ({metabolicState.hoursElapsedSinceLastMeal?.toFixed(1)}h ayuno)
                        </div>
                      )}
                      {s.moduleId === 'sleep' && (
                        <div>
                          Sueño: <strong>{sleep[0]?.hoursInBed || 7.5}h</strong> en cama (Calidad: {sleep[0]?.subjectiveQualityScore || 8}/10)
                        </div>
                      )}
                      {s.moduleId === 'activity' && (
                        <div>
                          Ejercicio: <strong>{totalActivityMin} min</strong> acumulados hoy
                        </div>
                      )}
                      {s.moduleId === 'hydration' && (
                        <div>
                          Agua: <strong style={{ color: '#38BDF8' }}>{currentWater} / 2500 ml</strong>
                        </div>
                      )}
                      {s.moduleId === 'pantry' && (
                        <div>
                          Existencias: <strong>{inventory.length} alimentos</strong> en despensa
                        </div>
                      )}
                      {s.moduleId === 'plan' && (
                        <div>
                          Próximo: <strong>{plan.plannedItems[0]?.title || 'Almuerzo'}</strong> ({plan.plannedItems[0]?.scheduledTime || '14:00'})
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* RESTAURAR MÓDULOS OCULTOS */}
        {satellites.some((s) => s.visibility === 'hidden') && (
          <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--aion-sand)' }}>Módulos no visibles:</span>
            {satellites
              .filter((s) => s.visibility === 'hidden')
              .map((s) => (
                <button
                  key={s.moduleId}
                  onClick={() => restoreModule(s.moduleId)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px dashed #2B2338',
                    color: '#C4B5FD',
                    borderRadius: '6px',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                  }}
                >
                  + Restaurar {s.title}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
