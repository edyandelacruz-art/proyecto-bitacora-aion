import React, { useState } from 'react';
import { MetabolicState, EnergyBalance } from '@aion/shared-types';

interface YourBodyNowProps {
  metabolicState: MetabolicState;
  energyBalance: EnergyBalance;
}

export const YourBodyNow: React.FC<YourBodyNowProps> = ({ metabolicState, energyBalance }) => {
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null);
  const [simulatedHoursOffset, setSimulatedHoursOffset] = useState<number>(0);

  // Cálculo de simulación dinámica de paso del tiempo
  const hoursElapsed = (metabolicState.hoursElapsedSinceLastMeal || 0.5) + simulatedHoursOffset;

  let currentPhaseTitle = 'Estado Posprandial (Digestión y Absorción Activa)';
  let naturalExp = 'Terminaste de comer recientemente. Tu cuerpo está digiriendo los alimentos y absorbiendo la glucosa y aminoácidos para energía y reparación.';
  let technicalExp = 'Insulina elevada estimulando captación tisular de glucosa vía GLUT4 y síntesis de glucógeno. Lipoproteínas en transporte linfático.';
  let fatBurnText = '↓ Menor temporalmente';
  let fatBurnColor = 'var(--aion-lavender)';

  if (hoursElapsed >= 3.5 && hoursElapsed < 7) {
    currentPhaseTitle = 'Estado Postabsortivo (Transición Energética)';
    naturalExp = `Han transcurrido ${hoursElapsed.toFixed(1)} horas. Tu digestión ha concluido y tu cuerpo ha comenzado a liberar reservas de glucógeno para sostener tu energía.`;
    technicalExp = 'Cociente insulina/glucagón reducido. Activación de glucogenólisis hepática e inicio paulatino de lipólisis.';
    fatBurnText = '→ Moderada en progreso';
    fatBurnColor = '#FBBF24';
  } else if (hoursElapsed >= 7) {
    currentPhaseTitle = 'Ayuno Inicial (Mayor Oxidación de Grasas)';
    naturalExp = `Han pasado ${hoursElapsed.toFixed(1)} horas sin ingesta. Tu cuerpo está utilizando predominantemente grasas almacenadas como combustible primario.`;
    technicalExp = 'Baja insulina y alto glucagón. Activación de lipasa sensible a hormonas (HSL), beta-oxidación de ácidos grasos y gluconeogénesis.';
    fatBurnText = '↑ Alta oxidación';
    fatBurnColor = '#34D399';
  }

  const bubbles = [
    {
      id: 'glucose',
      tag: 'Glucosa',
      title: hoursElapsed < 3.5 ? '↑ Disponible tras la ingesta' : 'Estable en rango basal (85 mg/dL)',
      simple: 'Energía activa proveniente de los carbohidratos consumidos.',
      detail: 'Absorción intestinal y fosforilación por hexocinasa/glucocinasa para almacenamiento o glucólisis.',
      color: 'var(--aion-glucose)',
    },
    {
      id: 'fats',
      tag: 'Grasas',
      title: hoursElapsed < 3.5 ? '→ Procesándose (quilomicrones)' : '↑ Movilización de ácidos grasos',
      simple: 'Lípidos dietarios o almacenados transportándose para energía.',
      detail: 'Hidrólisis de triglicéridos por lipoproteína lipasa y transporte hacia adipocitos y músculo.',
      color: 'var(--aion-fats)',
    },
    {
      id: 'protein',
      tag: 'Proteínas',
      title: '→ Aminoácidos disponibles',
      simple: 'Pool de aminoácidos disponible para recambio muscular.',
      detail: 'Activación del complejo mTORC1 facilitando la síntesis proteica de reparación.',
      color: 'var(--aion-protein)',
    },
    {
      id: 'glycogen',
      tag: 'Glucógeno',
      title: hoursElapsed < 3.5 ? '→ Reposición en hígado/músculo' : '↓ Liberación gradual',
      simple: 'Reserva energética de glucosa almacenada.',
      detail: 'Glucogenogénesis posprandial o glucogenólisis por fosforilasa a.',
      color: 'var(--aion-glycogen)',
    },
  ];

  // Cálculo SVG para el anillo de balance calórico
  const pctConsumed = Math.min(100, Math.round((energyBalance.consumedKcal / energyBalance.targetKcal) * 100));
  const strokeDashoffset = 283 - (283 * pctConsumed) / 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Simulador Interactivo de Paso del Tiempo */}
      <div className="aion-card" style={{ padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--aion-lavender)', fontWeight: 700 }}>
          ⏱ SIMULADOR TEMPORAL:
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

      {/* Banner Principal "TU CUERPO AHORA" */}
      <div className="aion-card" style={{ background: 'linear-gradient(135deg, rgba(91, 75, 138, 0.45) 0%, rgba(26, 22, 37, 0.95) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--aion-lavender)', fontWeight: 700 }}>
            TU CUERPO AHORA • {hoursElapsed.toFixed(1)}h DESDE LA COMIDA
          </div>
          <span className="badge badge-available">EN TIEMPO REAL</span>
        </div>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.3rem 0', color: 'white' }}>
          {currentPhaseTitle}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--aion-sand)', lineHeight: 1.45 }}>
          {naturalExp}
        </p>

        <div style={{ marginTop: '0.75rem', padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', borderLeft: '3px solid var(--aion-lavender)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--aion-lavender)', fontWeight: 700, display: 'block' }}>MECANISMO BIOQUÍMICO:</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--aion-neutral-light)', lineHeight: 1.3 }}>{technicalExp}</span>
        </div>
      </div>

      {/* Anillo de Balance Energético SVG + Medidor de Quema de Grasa */}
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
          <span style={{ fontSize: '0.7rem', color: 'var(--aion-neutral-light)', fontWeight: 600 }}>OXIDACIÓN DE GRASAS</span>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: fatBurnColor, margin: '0.2rem 0' }}>
              {fatBurnText}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--aion-sand)', lineHeight: 1.3 }}>
              {hoursElapsed < 3.5 ? 'Supresión temporal por insulina' : 'Activación progresiva de lipólisis'}
            </p>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--aion-neutral)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.3rem' }}>
            Transición adaptativa activa
          </div>
        </div>
      </div>

      {/* Burbujas Interactivas Nutrientes */}
      <div>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--aion-sand)', marginBottom: '0.4rem' }}>
          COMPONENTES EN PROCESAMIENTO
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
              <div className="bubble-desc">
                {selectedBubble === b.id ? b.detail : b.simple}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
