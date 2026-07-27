import React, { useState } from 'react';
import { Header } from './components/Header';
import { YourBodyNow } from './components/YourBodyNow';
import { MealLogger } from './components/MealLogger';
import { WhatCanIEatNow } from './components/WhatCanIEatNow';
import { PantryInventory } from './components/PantryInventory';
import { LivePlanAndMarket } from './components/LivePlanAndMarket';

import { NutritionLeadSpecialist } from '@aion/agents';
import { AionMemoryStore } from '@aion/memory';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'body' | 'meal' | 'eat_now' | 'pantry' | 'plan'>('body');
  const [updateKey, setUpdateKey] = useState(0);

  const specialist = new NutritionLeadSpecialist();
  const memoryStore = AionMemoryStore.getInstance();

  const metabolicState = specialist.getCurrentMetabolicState();
  const energyBalance = specialist.getCurrentEnergyBalance();

  const refreshData = () => {
    setUpdateKey((prev) => prev + 1);
  };

  return (
    <div>
      <Header />

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
      </main>

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
      </nav>
    </div>
  );
};
