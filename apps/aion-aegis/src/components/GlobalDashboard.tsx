import React, { useState } from 'react';
import { NutritionLeadSpecialist } from '@aion/agents';
import { AionMemoryStore } from '@aion/memory';
import { YourBodyNow } from './YourBodyNow';
import { MealLogger } from './MealLogger';
import { WhatCanIEatNow } from './WhatCanIEatNow';
import { PantryInventory } from './PantryInventory';
import { LivePlanAndMarket } from './LivePlanAndMarket';
import { MyDayLedgerTimeline } from './MyDayLedgerTimeline';
import {
  SleepDashboard,
  ActivityDashboard,
  HydrationDashboard,
  StateDashboard,
  MedicationDashboard,
  SymptomsDashboard,
  BodyDashboard,
  HabitsDashboard,
} from './ModuleDashboards';

interface GlobalDashboardProps {
  onRefreshAll: () => void;
}

export const GlobalDashboard: React.FC<GlobalDashboardProps> = ({ onRefreshAll }) => {
  const store = AionMemoryStore.getInstance();
  const specialist = new NutritionLeadSpecialist();

  const metabolicState = specialist.getCurrentMetabolicState();
  const energyBalance = specialist.getCurrentEnergyBalance();
  const plan = store.getLivePlan();
  const inventory = store.getInventory();
  const sleep = store.getSleepRecords();
  const activity = store.getActivityRecords();
  const hydration = store.getHydrationRecords();

  const currentWater = hydration.reduce((acc, h) => acc + h.amountMl, 0);
  const totalActivityMin = activity.reduce((acc, a) => acc + a.durationMinutes, 0);
  const expiringItems = inventory.filter((i) => i.availability === 'PRÓXIMO A VENCER' || i.availability === 'BAJO');

  const [activeModuleModal, setActiveModuleModal] = useState<string | null>(null);

  const closeModal = () => {
    setActiveModuleModal(null);
    onRefreshAll();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingBottom: '2rem' }}>
      {/* 1. SECCIÓN HERO "AHORA" — RESUMEN EN VIVO DE FISIOLOGÍA */}
      <div
        className="aion-card"
        style={{
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(17, 16, 23, 0.98) 100%)',
          border: '1px solid #7C3AED',
          padding: '1.2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C4B5FD', fontWeight: 800 }}>
            AHORA • ESTADO METABÓLICO EN VIVO
          </span>
          <span className="badge badge-available">
            {metabolicState.hoursElapsedSinceLastMeal?.toFixed(1) || 0}h desde comida
          </span>
        </div>

        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', margin: '0.2rem 0 0.4rem 0' }}>
          {metabolicState.phaseTitle}
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#DDD6FE', lineHeight: 1.5, margin: 0 }}>
          {metabolicState.naturalExplanation}
        </p>

        <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveModuleModal('body')}
            style={{
              background: '#7C3AED',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.4rem 0.9rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🔬 Explicación Bioquímica Detallada
          </button>
        </div>
      </div>

      {/* 2. BANNER "AEGIS DETECTA" — ALERTAS INTELIGENTES */}
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
            <span style={{ fontSize: '1.1rem' }}>⚠️</span>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F59E0B' }}>
                AEGIS DETECTA: Alimentos que deberías consumir pronto
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--aion-sand)' }}>
                {expiringItems.map((i) => i.name).join(', ')} en tu refrigerador.
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveModuleModal('eat_now')}
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

      {/* 3. PARRILLA EJECUTIVA DE DASHBOARDS DE MÓDULOS (2x2 / 3x3 GRID) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* TARJETA NUTRICIÓN */}
        <div className="aion-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#C4B5FD' }}>🍎 NUTRICIÓN & BALANCE</span>
              <span className="badge badge-available">{energyBalance.state}</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
              {energyBalance.consumedKcal} / {energyBalance.targetKcal} <span style={{ fontSize: '0.75rem', color: 'var(--aion-sand)' }}>kcal</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 700, marginTop: '0.2rem' }}>
              Proteína: {plan.macroConsumed.protein} / {plan.macroTargets.protein}g
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.9rem' }}>
            <button className="aion-btn-primary" style={{ fontSize: '0.72rem', padding: '0.35rem' }} onClick={() => setActiveModuleModal('meal')}>
              + Registrar Comida
            </button>
            <button className="aion-btn-secondary" style={{ fontSize: '0.72rem', padding: '0.35rem' }} onClick={() => setActiveModuleModal('eat_now')}>
              💡 ¿Qué comer?
            </button>
          </div>
        </div>

        {/* TARJETA SUEÑO */}
        <div className="aion-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#C4B5FD' }}>😴 SUEÑO & RECUPERACIÓN</span>
              <span className="badge badge-available">CIRCADIANO</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
              {sleep[0]?.hoursInBed || 7.5} <span style={{ fontSize: '0.75rem', color: 'var(--aion-sand)' }}>horas en cama</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--aion-sand)', marginTop: '0.2rem' }}>
              Calidad: {sleep[0]?.subjectiveQualityScore || 8}/10 • Pantallas: {sleep[0]?.nightScreensUse ? 'SÍ' : 'NO'}
            </div>
          </div>
          <button className="aion-btn-secondary" style={{ fontSize: '0.72rem', padding: '0.35rem', marginTop: '0.9rem' }} onClick={() => setActiveModuleModal('sleep')}>
            ⚙️ Gestionar Sueño
          </button>
        </div>

        {/* TARJETA ACTIVIDAD */}
        <div className="aion-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#C4B5FD' }}>🏃 ACTIVIDAD & RPE</span>
              <span className="badge badge-available">ESFUERZO</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
              {totalActivityMin} <span style={{ fontSize: '0.75rem', color: 'var(--aion-sand)' }}>minutos hoy</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 700, marginTop: '0.2rem' }}>
              Gasto est: ≈{activity.reduce((acc, a) => acc + a.estimatedKcalBurned, 0)} kcal
            </div>
          </div>
          <button className="aion-btn-secondary" style={{ fontSize: '0.72rem', padding: '0.35rem', marginTop: '0.9rem' }} onClick={() => setActiveModuleModal('activity')}>
            + Registrar Actividad
          </button>
        </div>

        {/* TARJETA HIDRATACIÓN */}
        <div className="aion-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#C4B5FD' }}>💧 HIDRATACIÓN</span>
              <span className="badge badge-available">AGUA</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38BDF8' }}>
              {currentWater} / 2,500 <span style={{ fontSize: '0.75rem', color: 'var(--aion-sand)' }}>ml</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.9rem' }}>
            <button className="aion-btn-secondary" style={{ fontSize: '0.72rem', padding: '0.35rem', flex: 1 }} onClick={() => setActiveModuleModal('hydration')}>
              + 250 ml
            </button>
            <button className="aion-btn-secondary" style={{ fontSize: '0.72rem', padding: '0.35rem', flex: 1 }} onClick={() => setActiveModuleModal('hydration')}>
              + 500 ml
            </button>
          </div>
        </div>

        {/* TARJETA DESPENSA & COMPRAS */}
        <div className="aion-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#C4B5FD' }}>📦 DESPENSA & HOGAR</span>
              <span className="badge badge-available">{inventory.length} ÍTEMS</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>
              {expiringItems.length > 0 ? `⚠️ ${expiringItems.length} ítems en atención o bajo stock` : '✓ Despensa surtida y en orden'}
            </div>
          </div>
          <button className="aion-btn-secondary" style={{ fontSize: '0.72rem', padding: '0.35rem', marginTop: '0.9rem' }} onClick={() => setActiveModuleModal('pantry')}>
            📦 Ver Inventario Completo
          </button>
        </div>

        {/* TARJETA PLAN VIVO */}
        <div className="aion-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#C4B5FD' }}>📅 PLAN VIVO</span>
              <span className="badge badge-available">DINÁMICO</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--aion-sand)' }}>
              Próximo: {plan.plannedItems[0]?.title || 'Almuerzo saludable'} ({plan.plannedItems[0]?.scheduledTime || '14:00'})
            </div>
          </div>
          <button className="aion-btn-secondary" style={{ fontSize: '0.72rem', padding: '0.35rem', marginTop: '0.9rem' }} onClick={() => setActiveModuleModal('plan')}>
            📅 Reorganizar Plan
          </button>
        </div>
      </div>

      {/* 4. MODAL DETALLE DE MÓDULO (SLIDE-OVER / OVERLAY LIMPIO) */}
      {activeModuleModal && (
        <div className="aion-modal-overlay">
          <div className="aion-modal" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #2B2338', paddingBottom: '0.6rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', margin: 0 }}>
                {activeModuleModal === 'body' && '🔬 Metabolismo & Fisiología'}
                {activeModuleModal === 'meal' && '🍎 Registro de Comida'}
                {activeModuleModal === 'eat_now' && '💡 ¿Qué puedo comer ahora?'}
                {activeModuleModal === 'pantry' && '📦 Despensa, Compras & Inventario'}
                {activeModuleModal === 'sleep' && '😴 Sueño & Recuperación'}
                {activeModuleModal === 'activity' && '🏃 Actividad & Ejercicio'}
                {activeModuleModal === 'hydration' && '💧 Hidratación'}
                {activeModuleModal === 'state' && '⚡ Energía & Ánimo'}
                {activeModuleModal === 'medication' && '💊 Medicación'}
                {activeModuleModal === 'symptoms' && '🩺 Síntomas'}
                {activeModuleModal === 'body_meas' && '📐 Peso & Cuerpo'}
                {activeModuleModal === 'habits' && '🔄 Hábitos'}
                {activeModuleModal === 'plan' && '📅 Plan Vivo'}
                {activeModuleModal === 'ledger' && '📜 Mi Día'}
              </h2>
              <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            {activeModuleModal === 'body' && <YourBodyNow metabolicState={metabolicState} energyBalance={energyBalance} />}
            {activeModuleModal === 'meal' && <MealLogger onMealAdded={closeModal} />}
            {activeModuleModal === 'eat_now' && <WhatCanIEatNow />}
            {activeModuleModal === 'pantry' && <PantryInventory />}
            {activeModuleModal === 'sleep' && <SleepDashboard onRefresh={closeModal} />}
            {activeModuleModal === 'activity' && <ActivityDashboard onRefresh={closeModal} />}
            {activeModuleModal === 'hydration' && <HydrationDashboard onRefresh={closeModal} />}
            {activeModuleModal === 'state' && <StateDashboard onRefresh={closeModal} />}
            {activeModuleModal === 'medication' && <MedicationDashboard onRefresh={closeModal} />}
            {activeModuleModal === 'symptoms' && <SymptomsDashboard onRefresh={closeModal} />}
            {activeModuleModal === 'body_meas' && <BodyDashboard onRefresh={closeModal} />}
            {activeModuleModal === 'habits' && <HabitsDashboard onRefresh={closeModal} />}
            {activeModuleModal === 'plan' && <LivePlanAndMarket />}
            {activeModuleModal === 'ledger' && <MyDayLedgerTimeline onDataChanged={closeModal} />}
          </div>
        </div>
      )}
    </div>
  );
};
