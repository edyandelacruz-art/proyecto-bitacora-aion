import React from 'react';

interface HowAionWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowAionWorksModal: React.FC<HowAionWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-6 overflow-hidden">
      {/* VENTANA EMERGENTE CENTRADA 1:1 STITCH */}
      <div className="relative bg-[#111017] border-2 border-[#7C3AED] rounded-[32px] w-full max-w-2xl max-h-[85vh] shadow-[0_0_80px_rgba(124,58,237,0.6)] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* HEADER MODAL */}
        <div className="p-6 bg-[#070709] border-b border-white/10 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#7C3AED] text-3xl">help</span>
            <div>
              <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em] block">
                ARQUITECTURA SOBERANA AION
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">¿Cómo funciona AION Aegis?</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white flex items-center justify-center transition-all border border-white/10 shrink-0"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* CONTENIDO CENTRADO Y SCROLLABLE */}
        <div className="p-6 flex-1 overflow-y-auto hide-scrollbar space-y-5 text-xs text-[#E5E1E5]">
          <div className="p-4 rounded-2xl bg-[#7C3AED]/15 border border-[#7C3AED]/40 space-y-2">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7C3AED]">shield</span>
              AION Aegis: Prótesis Ejecutiva de Integración Multiagente
            </h3>
            <p className="text-white/80 leading-relaxed">
              AION Aegis opera como tu sistema operativo biológico y personal. Una red de 16 supervisores coordinados procesa tu nutrición, descanso circadiano, gasto físico, finanzas y compromisos en tiempo real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="text-xs font-bold text-[#D6B36A] block">1. Canal Conversacional Omnicanal</span>
              <p className="text-[#CCC3D8]/80 leading-relaxed">
                Escribe en lenguaje natural lo que sea (ej. <em>"Comí pollo con arroz"</em>, <em>"Dormí 7h"</em>, <em>"Gasté 25.000 pesos"</em>). El SuperAgente central clasifica y enruta la información al agente correspondiente.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="text-xs font-bold text-emerald-400 block">2. Propagación Multidominio</span>
              <p className="text-[#CCC3D8]/80 leading-relaxed">
                Un solo registro activa múltiples supervisores a la vez: registrar una comida descuenta ingredientes de tu Despensa, actualiza tu Balance Calórico y anota el gasto en Finanzas.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="text-xs font-bold text-sky-400 block">3. Universal Ledger Inmutable</span>
              <p className="text-[#CCC3D8]/80 leading-relaxed">
                Cada evento se almacena como una entrada de auditoría con fecha, hora, fuente y nivel de confiabilidad (MEASURED, USER_CONFIRMED, MODEL_ESTIMATE).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="text-xs font-bold text-[#C4B5FD] block">4. Exportación XLSX de 24 Pestañas</span>
              <p className="text-[#CCC3D8]/80 leading-relaxed">
                Genera en un clic el libro de Excel profesional `SALUD_METABOLISMO_EDYAN.xlsx` o guarda informes en PDF para tus médicos o entrenadores.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-[#070709] border-t border-white/10 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#7C3AED] text-white font-bold text-xs hover:bg-[#6D28D9] transition-all shadow-lg"
          >
            ENTENDIDO
          </button>
        </div>
      </div>
    </div>
  );
};
