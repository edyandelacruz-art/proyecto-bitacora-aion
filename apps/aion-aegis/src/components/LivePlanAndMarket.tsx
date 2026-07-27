import React from 'react';
import { AionMemoryStore } from '@aion/memory';

export const LivePlanAndMarket: React.FC = () => {
  const memoryStore = AionMemoryStore.getInstance();
  const plan = memoryStore.getLivePlan();
  const inventory = memoryStore.getInventory();

  // Generar lista de compras deduciendo inventario
  const alreadyHave = inventory.filter((i) => i.availability === 'DISPONIBLE');
  const runningLow = inventory.filter((i) => i.availability === 'BAJO' || i.availability === 'PRÓXIMO A VENCER');
  const needToBuy = [
    { name: 'Huevos campesinos', amount: '12 unidades', reason: 'Para proteína matutina' },
    { name: 'Aguacate hass', amount: '3 unidades', reason: 'Grasas saludables' },
    { name: 'Verduras mixtas (brócoli, zanahoria)', amount: '500g', reason: 'Para Meal Prep de 3 días' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Tarjeta Plan Vivo */}
      <div className="aion-card" style={{ background: 'linear-gradient(135deg, rgba(91, 75, 138, 0.3) 0%, rgba(26, 22, 37, 0.9) 100%)' }}>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--aion-lavender)', fontWeight: 700 }}>
          CONCEPTO FUNDAMENTAL
        </div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.2rem 0', color: 'white' }}>
          Plan Vivo Alimentario
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--aion-sand)', lineHeight: 1.4 }}>
          {plan.adaptiveNote}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.75rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--aion-neutral-light)' }}>OBJETIVO</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>{plan.dailyTargetKcal} kcal</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--aion-neutral-light)' }}>CONSUMIDO</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34D399' }}>{plan.consumedKcal} kcal</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--aion-neutral-light)' }}>RESTANTE</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--aion-lavender)' }}>{plan.remainingKcal} kcal</div>
          </div>
        </div>
      </div>

      {/* Meal Prep Section */}
      <div className="aion-card">
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>
          🍱 Planificación Meal Prep (3 Días)
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--aion-sand)', marginBottom: '0.75rem' }}>
          AION consolidó los ingredientes de tu despensa para sugerir una sesión eficiente de cocina de 45 minutos:
        </p>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.8rem', color: 'var(--aion-neutral-light)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div>1. Cocinar 500g de pechuga de pollo al vapor con tomillo y ajo.</div>
          <div>2. Hervir 6 papas sabaneras y dividir en recipientes herméticos.</div>
          <div>3. Porcionar en 3 porciones futuras para almuerzos listos.</div>
        </div>
      </div>

      {/* Mercado Inteligente */}
      <div className="aion-card">
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>
          🛒 Mercado Inteligente (Lista Deduciendo Inventario)
        </h3>

        {/* COMPRAR */}
        <div style={{ margin: '0.5rem 0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F87171' }}>COMPRAR (FALTANTES PARA EL PLAN)</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.3rem' }}>
            {needToBuy.map((nb, i) => (
              <div key={i} style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>{nb.name} ({nb.amount})</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--aion-neutral-light)' }}>{nb.reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* POR TERMINARSE */}
        <div style={{ margin: '0.75rem 0 0.5rem 0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FBBF24' }}>POR TERMINARSE / RENOVAR</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.3rem' }}>
            {runningLow.map((rl) => (
              <div key={rl.id} style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                {rl.name} ({rl.amount} {rl.unit})
              </div>
            ))}
          </div>
        </div>

        {/* YA TIENES */}
        <div style={{ marginTop: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34D399' }}>YA TIENES (NO RECOMPRAR)</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.3rem' }}>
            {alreadyHave.map((ah) => (
              <span key={ah.id} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34D399', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>
                ✓ {ah.name} ({ah.amount} {ah.unit})
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
