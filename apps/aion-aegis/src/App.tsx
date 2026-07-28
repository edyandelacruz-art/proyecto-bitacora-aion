import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GlobalDashboard } from './components/GlobalDashboard';
import { MealLogger } from './components/MealLogger';
import { PantryInventory } from './components/PantryInventory';
import { LivePlanAndMarket } from './components/LivePlanAndMarket';
import { MyDayLedgerTimeline } from './components/MyDayLedgerTimeline';
import { OnboardingModal } from './components/OnboardingModal';
import { AionCoreOmniModal } from './components/AionCoreOmniModal';
import { AionMemoryStore } from '@aion/memory';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'meal' | 'pantry' | 'plan' | 'ledger'>('home');
  const [updateKey, setUpdateKey] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOmniModalOpen, setIsOmniModalOpen] = useState(false);

  const memoryStore = AionMemoryStore.getInstance();

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
    <div style={{ background: '#070709', minHeight: '100vh', color: '#F4F4F5', paddingBottom: '80px' }}>
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      <main className="aion-container" key={updateKey} style={{ marginTop: '1rem' }}>
        {activeTab === 'home' && <GlobalDashboard onRefreshAll={refreshData} />}
        {activeTab === 'meal' && <MealLogger onMealAdded={refreshData} />}
        {activeTab === 'pantry' && <PantryInventory />}
        {activeTab === 'plan' && <LivePlanAndMarket />}
        {activeTab === 'ledger' && <MyDayLedgerTimeline onDataChanged={refreshData} />}
      </main>

      {/* BOTÓN FLOTANTE EJECUTIVO SUPER-IA (FAB) */}
      <button
        onClick={() => setIsOmniModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          background: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)',
          color: 'white',
          border: '1px solid rgba(196, 181, 253, 0.4)',
          borderRadius: '28px',
          padding: '0.65rem 1.1rem',
          fontSize: '0.82rem',
          fontWeight: 800,
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          zIndex: 999,
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>🤖</span>
        <span>AION Core Super-IA</span>
      </button>

      {/* OVERLAY CONVERSACIONAL FLOTANTE DE AION CORE SUPER-IA */}
      <AionCoreOmniModal
        isOpen={isOmniModalOpen}
        onClose={() => setIsOmniModalOpen(false)}
        onRefreshAll={refreshData}
      />

      <OnboardingModal isOpen={isSettingsOpen} onClose={() => { setIsSettingsOpen(false); refreshData(); }} />

      {/* NAVEGACIÓN INFERIOR EJECUTIVA LIMPIA */}
      <nav className="aion-nav">
        <button className={`aion-nav-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <span>🏠</span>
          <span>Inicio</span>
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
