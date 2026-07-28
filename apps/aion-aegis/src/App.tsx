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

  // Right Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerContext, setDrawerContext] = useState<string>('NUTRICIONAL');

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

  const handleOpenDrawer = (context: string) => {
    setDrawerContext(context);
    setIsDrawerOpen(true);
  };

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-[#070709] text-[#E5E1E5]">
      {/* 1. SIDEBAR NAV RAIL STITCH 1:1 */}
      <SidebarNav
        currentActive={activeNav}
        onSelectNav={(id) => {
          setActiveNav(id);
          if (id === 'audit') handleOpenDrawer('METABOLISMO');
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. MAIN WORKSPACE AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#070709] relative transition-all">
        <Header onOpenSettings={() => setIsSettingsOpen(true)} />

        {/* SCROLLABLE WORKSPACE CONTENT */}
        <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col pb-20" key={updateKey}>
          {activeNav === 'core' ? (
            <AegisCoreFeed
              onRefreshAll={refreshData}
              onOpenModuleDeepView={(moduleId) => setActiveNav(moduleId)}
              onOpenDrawer={handleOpenDrawer}
            />
          ) : (
            <div className="max-w-[1400px] w-full mx-auto px-6 py-6">
              <ModuleDeepView
                activeModuleId={activeNav}
                onRefreshAll={refreshData}
                onBackToCore={() => setActiveNav('core')}
              />
            </div>
          )}
        </div>
      </main>

      {/* 3. INTELLIGENT RIGHT DRAWER STITCH 1:1 */}
      <ContextDrawer
        isOpen={isDrawerOpen}
        context={drawerContext}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* 4. FLOATING ACTION BUTTON STITCH 1:1 */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => handleOpenDrawer('NUTRICIONAL')}
          className="w-14 h-14 rounded-full bg-[#111017] text-[#7C3AED] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group border border-[#7C3AED]/30"
          title="Módulos Extendidos"
        >
          <span className="material-symbols-outlined text-2xl">grid_view</span>
        </button>
      </div>

      <OnboardingModal isOpen={isSettingsOpen} onClose={() => { setIsSettingsOpen(false); refreshData(); }} />
    </div>
  );
};
