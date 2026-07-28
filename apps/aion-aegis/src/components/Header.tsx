import React, { useState } from 'react';
import { DailyReportModal } from './DailyReportModal';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const [showPurposeInfo, setShowPurposeInfo] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="flex justify-between items-center w-full px-6 h-20 sticky top-0 bg-[#070709]/90 backdrop-blur-2xl z-40 border-b border-white/5">
      {/* BRAND / LOGO */}
      <div className="flex items-center gap-6">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowPurposeInfo(!showPurposeInfo)}
        >
          <span className="material-symbols-outlined text-[#7C3AED] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield
          </span>
          <h2 className="font-['Hanken_Grotesk'] text-[13px] text-white font-bold tracking-[0.2em] uppercase">
            AION AEGIS CORE
          </h2>
          <span className="text-[10px] text-[#C4B5FD] font-bold">ℹ️</span>
        </div>
      </div>

      {/* RIGHT TOP ACTIONS */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/15 text-[#C4B5FD] font-['Manrope'] text-xs font-bold hover:bg-[#7C3AED]/30 transition-all"
        >
          <span className="material-symbols-outlined text-sm">summarize</span> Informes & Exportar
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-full bg-white/5 text-white/70 hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 transition-all"
          title="Ajustes"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>

        {/* PROFILE POPOVER */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10 hover:border-[#7C3AED]/50 transition-all"
          >
            <div className="h-7 w-7 rounded-full bg-[#7C3AED]/30 flex items-center justify-center text-xs font-bold text-white">
              EA
            </div>
            <span className="text-xs font-semibold text-white">Edyan</span>
            <span className="material-symbols-outlined text-sm text-white/40">expand_more</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#111017] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 space-y-1">
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Edyan de la Cruz</p>
                <p className="text-xs font-semibold text-white">AION Aegis Sovereign</p>
              </div>
              <button onClick={onOpenSettings} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-xs text-left">
                <span className="material-symbols-outlined text-base">person</span> Perfil & Objetivos
              </button>
              <button onClick={() => setIsReportModalOpen(true)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-xs text-left">
                <span className="material-symbols-outlined text-base">download</span> Exportar (.xlsx 24p)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* POPUP PROPÓSITO AION AEGIS */}
      {showPurposeInfo && (
        <div className="absolute top-20 left-6 max-w-md bg-[#111017] border border-[#7C3AED] rounded-2xl p-4 shadow-2xl z-50 space-y-2">
          <p className="text-xs font-bold text-[#C4B5FD] uppercase tracking-widest">📌 AION AEGIS — CENTRO DE MANDO ORGANICO</p>
          <p className="text-xs text-white/80 leading-relaxed">
            Tu Bitácora Inteligente Multidominio. Aegis monitorea tu estado metabólico en vivo, gestiona tu alimentación, sueñó, actividad, despensa e informes diarios.
          </p>
        </div>
      )}

      {/* MODAL INFORME TÉCNICO DIARIO */}
      <DailyReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </header>
  );
};
