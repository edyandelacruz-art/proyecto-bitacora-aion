import React, { useState } from 'react';
import { MetabolicState, EnergyBalance, ResponseLanguageProfile } from '@aion/shared-types';
import { NutritionLeadSpecialist, LanguageEngine } from '@aion/agents';
import { AionMemoryStore } from '@aion/memory';
import { TechnicalGlossary } from './TechnicalGlossary';

interface YourBodyNowProps {
  metabolicState: MetabolicState;
  energyBalance: EnergyBalance;
}

export const YourBodyNow: React.FC<YourBodyNowProps> = ({ energyBalance }) => {
  const memoryStore = AionMemoryStore.getInstance();
  const specialist = new NutritionLeadSpecialist();
  const languageEngine = LanguageEngine.getInstance();

  const [selectedBubble, setSelectedBubble] = useState<string | null>(null);
  const [simulatedHoursOffset, setSimulatedHoursOffset] = useState<number>(0);
  const [showTechnicalDetail, setShowTechnicalDetail] = useState<boolean>(false);
  const [languageMode, setLanguageMode] = useState<ResponseLanguageProfile['mode']>(
    memoryStore.getCoreProfile().languageProfile?.mode || 'human'
  );

  const handleLanguageChange = (newMode: ResponseLanguageProfile['mode']) => {
    setLanguageMode(newMode);
    memoryStore.setLanguageMode(newMode);
  };

  const currentState = specialist.getCurrentMetabolicState(languageMode);
  const hoursElapsed = (currentState.hoursElapsedSinceLastMeal || 0.5) + simulatedHoursOffset;

  const bubbles = languageEngine.getNutrientBubbles(currentState.currentPhase, languageMode);

  const pctConsumed = Math.min(100, Math.round((energyBalance.consumedKcal / energyBalance.targetKcal) * 100));
  const strokeDashoffset = 283 - (283 * pctConsumed) / 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TechnicalGlossary />

      {/* Banner Principal "TU CUERPO AHORA" con Título Siempre Humano y Selector Integrado */}
      <div className="aion-card" style={{ background: 'linear-gradient(135deg, rgba(91, 75, 138, 0.45) 0%, rgba(26, 22, 37, 0.95) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--aion-lavender)', fontWeight: 800 }}>
            TU CUERPO AHORA • {hoursElapsed.toFixed(1)}h DESDE LA COMIDA
          </div>

          {/* Selector Elegante de Modo de Lenguaje */}
          <select
            value={languageMode}
            onChange={(e) => handleLanguageChange(e.target.value as any)}
            style={{
              background: 'rgba(26,22,37,0.95)',
              color: 'var(--aion-lavender)',
              border: '1px solid var(--aion-border-card)',
              borderRadius: '8px',
              padding: '0.25rem 0.5rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="human">Modo Humano (Cotidiano)</option>
            <option value="simple">Modo Simple (Directo)</option>
            <option value="technical">Modo Técnico (Fisiológico)</option>
            <option value="biochemical">Modo Bioquímico (Multipárrafo)</option>
            <option value="clinical">Modo Clínico (Evaluación Médica)</option>
            <option value="adaptive">Modo Adaptativo (IA)</option>
          </select>
        </div>

        {/* Título SIEMPRE simple, limpio y humano */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.2rem 0 0.5rem 0', color: 'white' }}>
          {currentState.phaseTitle}
        </h2>

        <div style={{ fontSize: '0.88rem', color: 'var(--aion-warm-white)', lineHeight: 1.5, marginBottom: '0.6rem' }}>
          {currentState.naturalExplanation}
        </div>

        {/* Exposición Bioquímica / Clínica Multipárrafo Desplegable */}
        <div style={{ marginTop: '0.6rem' }}>
          <button
            onClick={() => setShowTechnicalDetail(!showTechnicalDetail)}
            style={{
              background: 'rgba(167, 139, 250, 0.15)',
              border: '1px solid rgba(167, 139, 250, 0.4)',
              color: 'var(--aion-lavender)',
              borderRadius: '6px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.73rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {showTechnicalDetail ? '▲ Ocultar Desglose Bioquímico Avanzado' : '▼ [ Ver Desglose Bioquímico Multipárrafo ]'}
          </button>

          {showTechnicalDetail && (
            <div style={{ marginTop: '0.75rem', padding: '0.85rem', background: 'rgba(15, 12, 25, 0.85)', borderRadius: '10px', borderLeft: '4px solid var(--aion-lavender)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.73rem', color: 'var(--aion-lavender)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🔬 ANÁLISIS ENZIMÁTICO Y FISIOLÓGICO DE ALTO RIGOR:
              </span>
              <div style={{ fontSize: '0.78rem', color: 'var(--aion-neutral-light)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {currentState.detailedTechnicalExplanation}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Anillo de Balance Energético y Quema de Grasa */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="aion-card" style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--aion-neutral-light)', fontWeight: 600 }}>BALANCE DE HOY</span>
          <div style={{ position: 'relative', width: 90, height: 90, margin: '0.4rem 0' }}>
            <svg width="90" height="90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#34D399"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'white' }}>{pctConsumed}%</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--aion-sand)' }}>meta</span>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 700 }}>
            {energyBalance.consumedKcal} / {energyBalance.targetKcal} kcal
          </span>
        </div>

        <div className="aion-card" style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--aion-neutral-light)', fontWeight: 600 }}>USO DE GRASAS</span>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--aion-lavender)', margin: '0.2rem 0' }}>
              {currentState.fatBurnRate === 'menor_temporalmente' ? '↓ Menor temp.' : '↑ Activa'}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--aion-sand)', lineHeight: 1.3 }}>
              {hoursElapsed < 3.5 ? 'Supresión por digestión activa' : 'Activación progresiva de lipólisis'}
            </p>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--aion-neutral)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.3rem' }}>
            Ajustado a: {languageMode}
          </div>
        </div>
      </div>

      {/* Burbujas Interactivas Nutrientes Traducidas Dinámicamente */}
      <div>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--aion-sand)', marginBottom: '0.4rem' }}>
          COMPONENTES EN PROCESAMIENTO ({languageMode.toUpperCase()})
        </h3>
        <div className="bubbles-grid">
          {bubbles.map((b) => (
            <div
              key={b.id}
              className="bubble-card"
              onClick={() => setSelectedBubble(selectedBubble === b.id ? null : b.id)}
              style={{
                borderColor: selectedBubble === b.id ? b.color : 'rgba(255,255,255,0.08)',
                boxShadow: selectedBubble === b.id ? `0 0 16px ${b.color}50` : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="bubble-tag" style={{ color: b.color }}>{b.tag}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--aion-neutral)' }}>Tocar</span>
              </div>
              <div className="bubble-title">{b.title}</div>
              <div className="bubble-desc" style={{ lineHeight: 1.4 }}>
                {selectedBubble === b.id ? b.detail : b.simple}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulador Temporal Interactivo (Ubicado al Final como Herramienta de Exploración) */}
      <div className="aion-card" style={{ padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', border: '1px border rgba(255,255,255,0.08)' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--aion-sand)', fontWeight: 700 }}>
          ⏱ SIMULAR PASO DEL TIEMPO (EXPLORACIÓN):
        </span>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {[0, 3, 6, 10].map((hrs) => (
            <button
              key={hrs}
              onClick={() => setSimulatedHoursOffset(hrs)}
              style={{
                background: simulatedHoursOffset === hrs ? 'var(--aion-lavender)' : 'rgba(255,255,255,0.08)',
                color: simulatedHoursOffset === hrs ? '#0F0D15' : 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '0.3rem 0.6rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              +{hrs}h
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
