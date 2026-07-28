import React, { useState, useEffect } from 'react';
import { SidebarNav } from './components/SidebarNav';
import { AegisCoreFeed } from './components/AegisCoreFeed';
import { ContextDrawer } from './components/ContextDrawer';
import { ModuleDeepView } from './components/ModuleDeepView';
import { Header } from './components/Header';
import { OnboardingModal } from './components/OnboardingModal';
import { AionMemoryStore } from '@aion/memory';

export const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState<string>('core');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [updateKey, setUpdateKey] = useState<number>(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Context Drawer state (Right panel opened on demand)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerTopic, setDrawerTopic] = useState<string>('biochemistry');

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

  const handleOpenInspector = (topic: string) => {
    setDrawerTopic(topic);
    setIsDrawerOpen(true);
  };

  return (
    <div style={{ display: 'flex', background: '#070709', minHeight: '100vh', color: '#F4F4F5' }}>
      {/* 1. LEFT SIDEBAR / RAIL NAV HIERARCHICAL */}
      <SidebarNav
        currentActive={activeNav}
        onSelectNav={(id) => {
          setActiveNav(id);
          if (id === 'audit') handleOpenInspector('audit');
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. MAIN CONTENT AREA (AEGIS CORE FEED OR DEEP MODULE VIEW) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, paddingBottom: '70px' }}>
        <Header onOpenSettings={() => setIsSettingsOpen(true)} />

        <main className="aion-container" key={updateKey} style={{ marginTop: '1rem', flex: 1 }}>
          {activeNav === 'core' ? (
            <AegisCoreFeed
              onRefreshAll={refreshData}
              onOpenModuleDeepView={(moduleId) => setActiveNav(moduleId)}
              onOpenInspector={handleOpenInspector}
            />
          ) : (
            <ModuleDeepView
              activeModuleId={activeNav}
              onRefreshAll={refreshData}
              onBackToCore={() => setActiveNav('core')}
            />
          )}
        </main>
      </div>

      {/* 3. RIGHT CONTEXT DRAWER (OPENED ON DEMAND FOR INSPECTOR / EVIDENCE / AUDIT) */}
      <ContextDrawer
        isOpen={isDrawerOpen}
        topic={drawerTopic}
        onClose={() => setIsDrawerOpen(false)}
      />

      <OnboardingModal isOpen={isSettingsOpen} onClose={() => { setIsSettingsOpen(false); refreshData(); }} />

      {/* NAVEGACIÓN INFERIOR MÓVIL TÁCTIL */}
      <nav className="aion-nav">
        <button className={`aion-nav-btn ${activeNav === 'core' ? 'active' : ''}`} onClick={() => setActiveNav('core')}>
          <span>🤖</span>
          <span>Aegis Core</span>
        </button>

        <button className={`aion-nav-btn ${activeNav === 'nutrition' ? 'active' : ''}`} onClick={() => setActiveNav('nutrition')}>
          <span>🍎</span>
          <span>Comida</span>
        </button>

        <button className={`aion-nav-btn ${activeNav === 'pantry' ? 'active' : ''}`} onClick={() => setActiveNav('pantry')}>
          <span>📦</span>
          <span>Despensa</span>
        </button>

        <button className={`aion-nav-btn ${activeNav === 'plan' ? 'active' : ''}`} onClick={() => setActiveNav('plan')}>
          <span>📅</span>
          <span>Plan</span>
        </button>

        <button className={`aion-nav-btn ${activeNav === 'day' ? 'active' : ''}`} onClick={() => setActiveNav('day')}>
          <span>📜</span>
          <span>Mi Día</span>
        </button>
      </nav>
    </div>
  );
};
