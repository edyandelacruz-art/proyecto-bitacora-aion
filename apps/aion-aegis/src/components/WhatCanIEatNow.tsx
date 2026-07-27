import React from 'react';
import { NutritionLeadSpecialist } from '@aion/agents';

export const WhatCanIEatNow: React.FC = () => {
  const specialist = new NutritionLeadSpecialist();
  const options = specialist.getWhatCanIEatNowOptions();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="aion-card" style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(26, 22, 37, 0.9) 100%)' }}>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--aion-lavender)', fontWeight: 700 }}>
          ACCIÓN PRINCIPAL
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.2rem 0', color: 'white' }}>
          ¿Qué puedo comer ahora?
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--aion-sand)', lineHeight: 1.4 }}>
          AION cruzó tus 1220 kcal restantes, tu meta de proteína, tu despensa disponible y tu digestión actual para sugerirte estas opciones:
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {options.map((opt) => (
          <div key={opt.id} className="aion-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                className="badge"
                style={{
                  background: opt.category === 'MEJOR OPCIÓN' ? 'rgba(16, 185, 129, 0.2)' : opt.category === 'MÁS RÁPIDA' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                  color: opt.category === 'MEJOR OPCIÓN' ? '#34D399' : opt.category === 'MÁS RÁPIDA' ? '#60A5FA' : '#C4B5FD',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {opt.category}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--aion-neutral-light)' }}>⏱ {opt.prepTimeMinutes} min prep</span>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>{opt.title}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--aion-sand)' }}>{opt.subtitle}</p>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '0.6rem', margin: '0.2rem 0' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--aion-lavender)', fontWeight: 600, display: 'block' }}>¿POR QUÉ ESTA OPCIÓN?</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--aion-neutral-light)', lineHeight: 1.3 }}>{opt.reasonToRecommend}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--aion-warm-white)' }}>
                {opt.kcal} kcal • P: {opt.proteinGrams}g C: {opt.carbsGrams}g G: {opt.fatsGrams}g
              </span>
              <button className="aion-btn-primary" style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                Aceptar & Planificar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
