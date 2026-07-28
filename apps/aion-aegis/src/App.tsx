import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { YourBodyNow } from './components/YourBodyNow';
import { MealLogger } from './components/MealLogger';
import { WhatCanIEatNow } from './components/WhatCanIEatNow';
import { PantryInventory } from './components/PantryInventory';
import { LivePlanAndMarket } from './components/LivePlanAndMarket';
import { MyDayLedgerTimeline } from './components/MyDayLedgerTimeline';
import { OnboardingModal } from './components/OnboardingModal';
import {
  SleepDashboard,
  ActivityDashboard,
  HydrationDashboard,
  StateDashboard,
  MedicationDashboard,
  SymptomsDashboard,
  BodyDashboard,
  HabitsDashboard,
} from './components/ModuleDashboards';

import { NutritionLeadSpecialist } from '@aion/agents';
import { AionMemoryStore } from '@aion/memory';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'body'
    | 'meal'
    | 'eat_now'
    | 'pantry'
    | 'plan'
    | 'ledger'
    | 'sleep'
    | 'activity'
    | 'hydration'
    | 'state'
    | 'medication'
    | 'symptoms'
    | 'body_meas'
    | 'habits'
  >('body');

  const [updateKey, setUpdateKey] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const memoryStore = AionMemoryStore.getInstance();
  const specialist = new NutritionLeadSpecialist();

  const metabolicState = specialist.getCurrentMetabolicState();
  const energyBalance = specialist.getCurrentEnergyBalance();

  useEffect(() => {
    const facts = memoryStore.getFacts();
    const isConfigured = facts.some((f) => f.key === 'user_profile_configured');
    if (!isConfigured) {
      setIsSettingsOpen(true);
    }
  }, []);

  const refreshData = () => {
    setUpdateKey((prev) => prev + 1);
  };

  return (
    <div style={{ background: '#070709', minHeight: '100vh', color: '#F4F4F5', paddingBottom: '70px' }}>
      <Header onOpenSettings={() => setIsSettingsOpen(true)} onRefreshAll={refreshData} />

      {/* Píldoras de Navegación de Módulos Universales AION Aegis */}
      <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', padding: '0.6rem 0.8rem', background: '#0D0B12', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {[
          { id: 'body', label: '🧬 Metabolismo' },
          { id: 'meal', label: '🍎 Comida' },
          { id: 'eat_now', label: '💡 Recetas' },
          { id: 'pantry', label: '📦 Despensa' },
          { id: 'sleep', label: '😴 Sueño' },
          { id: 'activity', label: '🏃 Actividad' },
          { id: 'hydration', label: '💧 Agua' },
          { id: 'state', label: '⚡ Ánimo' },
          { id: 'medication', label: '💊 Medicación' },
          { id: 'symptoms', label: '🩺 Síntomas' },
          { id: 'body_meas', label: '📐 Cuerpo' },
          { id: 'habits', label: '🔄 Hábitos' },
          { id: 'plan', label: '📅 Plan' },
          { id: 'ledger', label: '📜 Mi Día' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            style={{
              background: activeTab === t.id ? '#7C3AED' : 'rgba(255,255,255,0.06)',
              color: activeTab === t.id ? 'white' : 'var(--aion-sand)',
              border: 'none',
              borderRadius: '16px',
              padding: '0.3rem 0.7rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <main className="aion-container" key={updateKey} style={{ marginTop: '0.8rem' }}>
        {activeTab === 'body' && <YourBodyNow metabolicState={metabolicState} energyBalance={energyBalance} />}
        {activeTab === 'meal' && <MealLogger onMealAdded={refreshData} />}
        {activeTab === 'eat_now' && <WhatCanIEatNow />}
        {activeTab === 'pantry' && <PantryInventory />}
        {activeTab === 'sleep' && <SleepDashboard onRefresh={refreshData} />}
        {activeTab === 'activity' && <ActivityDashboard onRefresh={refreshData} />}
        {activeTab === 'hydration' && <HydrationDashboard onRefresh={refreshData} />}
        {activeTab === 'state' && <StateDashboard onRefresh={refreshData} />}
        {activeTab === 'medication' && <MedicationDashboard onRefresh={refreshData} />}
        {activeTab === 'symptoms' && <SymptomsDashboard onRefresh={refreshData} />}
        {activeTab === 'body_meas' && <BodyDashboard onRefresh={refreshData} />}
        {activeTab === 'habits' && <HabitsDashboard onRefresh={refreshData} />}
        {activeTab === 'plan' && <LivePlanAndMarket />}
        {activeTab === 'ledger' && <MyDayLedgerTimeline onDataChanged={refreshData} />}
      </main>

      <OnboardingModal isOpen={isSettingsOpen} onClose={() => { setIsSettingsOpen(false); refreshData(); }} />

      {/* Navegación Inferior Móvil Principal */}
      <nav className="aion-nav">
        <button className={`aion-nav-btn ${activeTab === 'body' ? 'active' : ''}`} onClick={() => setActiveTab('body')}>
          <span>🧬</span>
          <span>Cuerpo</span>
        </button>

        <button className={`aion-nav-btn ${activeTab === 'meal' ? 'active' : ''}`} onClick={() => setActiveTab('meal')}>
          <span>🍎</span>
          <span>Comida</span>
        </button>

        <button className={`aion-nav-btn ${activeTab === 'pantry' ? 'active' : ''}`} onClick={() => setActiveTab('pantry')}>
          <span>📦</span>
          <span>Despensa</span>
        </button>

        <button className={`aion-nav-btn ${activeTab === 'plan' ? 'active' : ''}`} onClick={() => setActiveTab('plan')}>
          <span>📅</span>
          <span>Plan</span>
        </button>

        <button className={`aion-nav-btn ${activeTab === 'ledger' ? 'active' : ''}`} onClick={() => setActiveTab('ledger')}>
          <span>📜</span>
          <span>Mi Día</span>
        </button>
      </nav>
    </div>
  );
};
