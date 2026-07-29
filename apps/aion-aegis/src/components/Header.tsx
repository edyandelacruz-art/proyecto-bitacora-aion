import React, { useState } from 'react';
import { DailyReportModal } from './DailyReportModal';
import { HowAionWorksModal } from './HowAionWorksModal';
import { AionMemoryStore } from '@aion/memory';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const store = AionMemoryStore.getInstance();
  const profile = store.getCoreProfile();
  const userName = profile.displayName || 'EDYAN DE LA CRUZ';

  return (
    <header className="flex justify-between items-center w-full px-8 h-20 sticky top-0 bg-[#070709]/90 backdrop-blur-2xl z-40 border-b border-white/5">
      {/* LEFT SECTION STITCH 1:1 */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <img
            src="/images/aion_aegis_logo.jpg"
            alt="AION Aegis Logo"
            className="h-10 w-auto object-contain mix-blend-screen"
          />
          <h2 className="font-['Manrope'] text-[12px] text-[#E5E1E5] font-bold tracking-[0.2em] uppercase">
            AION AEGIS CORE
          </h2>
        </div>
        <div className="h-4 w-px bg-white/10"></div>
        <nav className="flex gap-6 items-center">
          <span className="font-['Manrope'] text-[11px] text-[#7C3AED] border-b-2 border-[#7C3AED] py-1 px-1 font-bold">
            Control Central
          </span>
          <span
            onClick={() => setIsReportModalOpen(true)}
            className="font-['Manrope'] text-[11px] text-[#CCC3D8]/60 hover:text-white transition-colors cursor-pointer px-1"
          >
            Reportes & Raw Stream
          </span>
          <button
            onClick={() => setIsHowItWorksOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C3AED]/15 text-[#C4B5FD] hover:bg-[#7C3AED] hover:text-white transition-all text-[11px] font-bold border border-[#7C3AED]/30"
          >
            <span className="material-symbols-outlined text-sm">help</span>
            ¿Cómo funciona AION?
          </button>
        </nav>
      </div>

      {/* RIGHT SECTION STITCH 1:1 */}
      <div className="flex items-center gap-6">
        {/* SEARCH INPUT */}
        <div className="relative flex items-center group/search">
          <input
            className="bg-[#111017]/80 border-none rounded-full h-10 w-10 group-hover/search:w-64 transition-all duration-500 pl-10 pr-4 text-sm focus:ring-1 focus:ring-[#7C3AED]/40 placeholder:text-transparent group-hover/search:placeholder:text-[#CCC3D8]/30 outline-none"
            placeholder="Buscar en Aegis..."
            type="text"
          />
          <span className="material-symbols-outlined absolute left-3 text-[#CCC3D8] cursor-pointer">search</span>
        </div>

        {/* NOTIFICATIONS */}
        <div className="relative group">
          <div className="p-2.5 rounded-full bg-[#111017]/80 text-[#CCC3D8] hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </div>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#D6B36A] rounded-full ring-2 ring-[#070709] animate-pulse"></span>
        </div>

        {/* PROFILE BUTTON STITCH 1:1 */}
        <div className="relative group/profile">
          <div
            onClick={onOpenSettings}
            className="flex items-center gap-3 p-1.5 px-3 rounded-full bg-[#111017]/80 border border-white/10 hover:border-[#7C3AED]/50 transition-all cursor-pointer"
          >
            <div className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-[#7C3AED]/20 bg-[#7C3AED] flex items-center justify-center text-xs font-bold text-white">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <span className="text-xs font-bold text-white">{userName}</span>
            <span className="material-symbols-outlined text-sm text-[#CCC3D8]">expand_more</span>
          </div>

          {/* POPOVER MENU STITCH 1:1 */}
          <div className="absolute right-0 top-full mt-3 w-64 bg-[#111017] border border-white/10 rounded-[32px] shadow-2xl opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-300 z-50 p-3 translate-y-2 group-hover/profile:translate-y-0 origin-top-right">
            <div className="px-5 py-4 mb-2 border-b border-white/5">
              <p className="text-[10px] text-[#CCC3D8] font-bold uppercase tracking-widest mb-1">Usuario Soberano</p>
              <p className="text-sm font-semibold text-[#E5E1E5]">{userName}</p>
            </div>
            <div className="space-y-0.5">
              <div onClick={onOpenSettings} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl hover:bg-white/5 text-[11px] font-medium transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-lg">person</span> Perfil & Metas Bioquímicas
              </div>
              <div onClick={() => setIsReportModalOpen(true)} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl hover:bg-white/5 text-[11px] font-medium transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-lg">download</span> Exportar (.xlsx 24p)
              </div>
            </div>
          </div>
        </div>
      </div>

      <DailyReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
      <HowAionWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
    </header>
  );
};
