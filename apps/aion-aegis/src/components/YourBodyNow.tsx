import React, { useState } from 'react';
import { MetabolicState, EnergyBalance } from '@aion/shared-types';

interface YourBodyNowProps {
  metabolicState: MetabolicState;
  energyBalance: EnergyBalance;
}

export const YourBodyNow: React.FC<YourBodyNowProps> = ({ metabolicState, energyBalance }) => {
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null);

  const bubbles = [
    {
      id: 'glucose',
      tag: 'Glucosa',
      title: metabolicState.glucoseStatus,
      simple: 'Tu cuerpo está procesando la energía proveniente de los carbohidratos de la comida.',
      detail: 'Absorción intestinal activa de glucosa. Insulina circulante elevada promoviendo la entrada celular y almacenamiento como glucógeno.',
      color: 'var(--aion-glucose)',
    },
    {
      id: 'fats',
      tag: 'Grasas',
      title: metabolicState.fatsStatus,
      simple: 'Las grasas dietarias se están digiriendo y transportando para nutrición celular.',
      detail: 'Los lípidos están siendo empacados en quilomicrones e ingresando a la circulación linfática para su posterior utilización o reserva.',
      color: 'var(--aion-fats)',
    },
    {
      id: 'protein',
      tag: 'Proteínas',
      title: metabolicState.proteinsStatus,
      simple: 'Los aminoácidos del atún y queso están listos para síntesis y recambio muscular.',
      detail: 'Pool de aminoácidos plasmáticos enriquecido. Estimulación del complejo mTOR y síntesis proteica de mantenimiento y reparación.',
      color: 'var(--aion-protein)',
    },
    {
      id: 'glycogen',
      tag: 'Glucógeno',
      title: metabolicState.glycogenStatus,
      simple: 'Se están recargando tus depósitos energéticos en hígado y músculos.',
      detail: 'Glucogenogénesis activa mediada por la enzima glucógeno sintasa activada por la insulina posprandial.',
      color: 'var(--aion-glycogen)',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Banner Principal "TU CUERPO AHORA" */}
      <div className="aion-card" style={{ background: 'linear-gradient(135deg, rgba(91, 75, 138, 0.4) 0%, rgba(26, 22, 37, 0.9) 100%)' }}>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--aion-lavender)', fontWeight: 700 }}>
          TU CUERPO AHORA
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.25rem 0 0.5rem 0', color: 'white' }}>
          {metabolicState.phaseTitle}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--aion-sand)', lineHeight: 1.4 }}>
          {metabolicState.naturalExplanation}
        </p>

        <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: 'var(--aion-neutral)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.5rem' }}>
          💡 Estimación fisiológica basada en tu comida y contexto; no es una medición clínica.
        </div>
      </div>

      {/* Tarjeta de Balance Energético + Estado Metabólico */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="aion-card" style={{ padding: '0.9rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--aion-neutral-light)', fontWeight: 600 }}>BALANCE DE HOY</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34D399', margin: '0.2rem 0' }}>
            {energyBalance.state}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--aion-sand)' }}>
            {energyBalance.consumedKcal} / {energyBalance.targetKcal} kcal
          </span>
        </div>

        <div className="aion-card" style={{ padding: '0.9rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--aion-neutral-light)', fontWeight: 600 }}>QUEMA DE GRASA</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--aion-lavender)', margin: '0.2rem 0' }}>
            {metabolicState.fatBurnRate === 'menor_temporalmente' ? '↓ Menor temp.' : '↑ Activa'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--aion-sand)' }}>
            Normal tras ingerir alimentos
          </span>
        </div>
      </div>

      {/* Burbujas Interactivas Nutrientes / Metabolismo */}
      <div>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--aion-sand)', marginBottom: '0.5rem' }}>
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
                boxShadow: selectedBubble === b.id ? `0 0 16px ${b.color}40` : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="bubble-tag" style={{ color: b.color }}>{b.tag}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--aion-neutral)' }}>Tocar para detalle</span>
              </div>
              <div className="bubble-title">{b.title}</div>
              <div className="bubble-desc">
                {selectedBubble === b.id ? b.detail : b.simple}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Metabólico */}
      <div className="aion-card">
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--aion-warm-white)', marginBottom: '0.75rem' }}>
          TIMELINE METABÓLICO ADAPTATIVO
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', paddingLeft: '1rem', borderLeft: '2px solid var(--aion-violet)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--aion-lavender)' }}>11:15 • DESAYUNO REGISTRADO</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--aion-sand)' }}>Ensalada de Atún con Papa y Queso (580 kcal)</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34D399' }}>11:30 - 14:00 • DIGESTIÓN Y ABSORCIÓN</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--aion-sand)' }}>Estado Posprandial activo (Absorción de carbohidratos y proteínas)</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--aion-neutral-light)' }}>14:30 EST. • TRANSICIÓN POSTABSORTIVA</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--aion-neutral)' }}>Estabilización de glucemia y cambio gradual hacia oxidación de grasa</p>
          </div>
        </div>
      </div>
    </div>
  );
};
