import React, { useState } from 'react';
import { NutritionLeadSpecialist } from '@aion/agents';
import { AionMemoryStore } from '@aion/memory';
import { RecipeOption } from '@aion/shared-types';

export const WhatCanIEatNow: React.FC = () => {
  const specialist = new NutritionLeadSpecialist();
  const memoryStore = AionMemoryStore.getInstance();

  const [activeFilter, setActiveFilter] = useState<string>('Todas');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const options = specialist.getWhatCanIEatNowOptions();

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAcceptRecipe = async (opt: RecipeOption) => {
    // Procesar aceptación de receta
    await specialist.processMealInput(opt.title, undefined, 1.0);
    triggerToast(`✓ Receta "${opt.title}" planificada y registrada`);
  };

  const filteredOptions = activeFilter === 'Todas' ? options : options.filter((o) => o.category === activeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {toastMessage && <div className="aion-toast">{toastMessage}</div>}

      <div className="aion-card" style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.25) 0%, rgba(26, 22, 37, 0.95) 100%)' }}>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--aion-lavender)', fontWeight: 700 }}>
          ACCIÓN PRINCIPAL INTERACTIVA
        </div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.2rem 0', color: 'white' }}>
          ¿Qué puedo comer ahora?
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--aion-sand)', lineHeight: 1.4 }}>
          Cruzando tu despensa real, calorías restantes y estado metabólico actual:
        </p>

        {/* Filtros de Categoría */}
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
          {['Todas', 'MEJOR OPCIÓN', 'MÁS RÁPIDA', 'MÁS SACIANTE'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                background: activeFilter === f ? 'var(--aion-lavender)' : 'rgba(255,255,255,0.08)',
                color: activeFilter === f ? '#0F0D15' : 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredOptions.map((opt) => (
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
              <span style={{ fontSize: '0.72rem', color: 'var(--aion-lavender)', fontWeight: 700, display: 'block' }}>¿POR QUÉ ESTA OPCIÓN?</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--aion-neutral-light)', lineHeight: 1.3 }}>{opt.reasonToRecommend}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--aion-warm-white)' }}>
                {opt.kcal} kcal • P: {opt.proteinGrams}g C: {opt.carbsGrams}g
              </span>
              <button
                className="aion-btn-primary"
                style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.75rem' }}
                onClick={() => handleAcceptRecipe(opt)}
              >
                ✓ Aceptar & Cocinar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
