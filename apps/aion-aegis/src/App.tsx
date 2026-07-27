import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { YourBodyNow } from './components/YourBodyNow';
import { MealLogger } from './components/MealLogger';
import { WhatCanIEatNow } from './components/WhatCanIEatNow';
import { PantryInventory } from './components/PantryInventory';
import { LivePlanAndMarket } from './components/LivePlanAndMarket';
import { MyDayLedgerTimeline } from './components/MyDayLedgerTimeline';
import { OnboardingModal } from './components/OnboardingModal';

import { NutritionLeadSpecialist } from '@aion/agents';
import { AionMemoryStore } from '@aion/memory';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'body' | 'meal' | 'eat_now' | 'pantry' | 'plan' | 'ledger'>('body');
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
    <div>
      <Header onOpenSettings={() => setIsSettingsOpen(true)} onRefreshAll={refreshData} />

      <main className="aion-container" key={updateKey}>
        {activeTab === 'body' && (
          <YourBodyNow metabolicState={metabolicState} energyBalance={energyBalance} />
        )}

        {activeTab === 'meal' && (
          <MealLogger onMealAdded={refreshData} />
        )}

        {activeTab === 'eat_now' && (
          <WhatCanIEatNow />
        )}

        {activeTab === 'pantry' && (
          <PantryInventory />
        )}

        {activeTab === 'plan' && (
          <LivePlanAndMarket />
        )}

        {activeTab === 'ledger' && (
          <MyDayLedgerTimeline onDataChanged={refreshData} />
        )}
      </main>

      <OnboardingModal isOpen={isSettingsOpen} onClose={() => { setIsSettingsOpen(false); refreshData(); }} />

      {/* Navegación Inferior Mobile First */}
      <nav className="aion-nav">
        <button
          className={`aion-nav-btn ${activeTab === 'body' ? 'active' : ''}`}
          onClick={() => setActiveTab('body')}
        >
          <span>🧬</span>
          <span>Tu Cuerpo</span>
        </button>

        <button
          className={`aion-nav-btn ${activeTab === 'meal' ? 'active' : ''}`}
          onClick={() => setActiveTab('meal')}
        >
          <span>🍎</span>
          <span>Comida</span>
        </button>

        <button
          className={`aion-nav-btn ${activeTab === 'eat_now' ? 'active' : ''}`}
          onClick={() => setActiveTab('eat_now')}
        >
          <span>💡</span>
          <span>¿Qué comer?</span>
        </button>

        <button
          className={`aion-nav-btn ${activeTab === 'pantry' ? 'active' : ''}`}
          onClick={() => setActiveTab('pantry')}
        >
          <span>📦</span>
          <span>Despensa</span>
        </button>

        <button
          className={`aion-nav-btn ${activeTab === 'plan' ? 'active' : ''}`}
          onClick={() => setActiveTab('plan')}
        >
          <span>📅</span>
          <span>Plan Vivo</span>
        </button>

        <button
          className={`aion-nav-btn ${activeTab === 'ledger' ? 'active' : ''}`}
          onClick={() => setActiveTab('ledger')}
        >
          <span>📜</span>
          <span>Mi Día</span>
        </button>
      </nav>
    </div>
  );
};
