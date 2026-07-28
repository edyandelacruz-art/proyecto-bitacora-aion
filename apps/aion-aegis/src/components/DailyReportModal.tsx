import React, { useState } from 'react';
import { DailyReportEngine, XlsxExporter } from '@aion/agents';
import { AionMemoryStore } from '@aion/memory';

interface DailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyReportModal: React.FC<DailyReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'raw' | 'xlsx' | 'pdf' | 'json'>('raw');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const reportEngine = DailyReportEngine.getInstance();
  const xlsxExporter = XlsxExporter.getInstance();
  const report = reportEngine.generateDailyTechnicalReport();
  const store = AionMemoryStore.getInstance();
  const ledger = store.getLedgerEntries();

  const handleDownloadXlsx = async () => {
    setIsExporting(true);
    setExportSuccess(null);
    try {
      const buffer = await xlsxExporter.generateFullWorkbookBuffer();
      const uint8Array = new Uint8Array(buffer);
      const blob = new Blob([uint8Array], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SALUD_METABOLISMO_EDYAN_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportSuccess('✓ Libro Excel de 24 Pestañas exportado exitosamente.');
    } catch (e) {
      console.error('Error al exportar XLSX:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPdf = () => {
    setIsExporting(true);
    setExportSuccess(null);
    try {
      const html = reportEngine.generatePdfHtmlReport();
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(html);
        win.document.close();
        win.print();
      }
      setExportSuccess('✓ Vista de impresión PDF generada con éxito.');
    } catch (e) {
      console.error('Error al generar PDF:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AION_AEGIS_DAILY_REPORT_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportSuccess('✓ Archivo JSON exportado exitosamente.');
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      {/* VENTANA EMERGENTE SOLIDA ORGANIC INTELLIGENCE STITCH 1:1 */}
      <div className="bg-[#111017] border-2 border-[#7C3AED] rounded-[36px] w-full max-w-4xl max-h-[90vh] shadow-[0_0_60px_rgba(124,58,237,0.3)] flex flex-col overflow-hidden">
        
        {/* HEADER MODAL */}
        <div className="p-6 lg:p-8 bg-[#070709] border-b border-white/10 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.3em]">
              AEGIS CONTROL CENTER • EXPORT & AUDIT
            </span>
            <h2 className="text-2xl font-bold text-white mt-1 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#7C3AED] text-3xl">terminal</span>
              Raw Stream & Informes Técnicos
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white flex items-center justify-center transition-all border border-white/10"
            title="Cerrar ventana"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* TABS DE NAVEGACIÓN DENTRO DE LA VENTANA */}
        <div className="flex border-b border-white/10 bg-[#070709]/50 px-6 gap-4">
          {[
            { id: 'raw', label: 'Raw Stream (Ledger)', icon: 'terminal' },
            { id: 'xlsx', label: 'Libro XLSX (24 Pestañas)', icon: 'table_view' },
            { id: 'pdf', label: 'Informe PDF', icon: 'picture_as_pdf' },
            { id: 'json', label: 'Exportación JSON/CSV', icon: 'data_object' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3.5 px-4 font-['Manrope'] text-xs font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-[#7C3AED] text-[#C4B5FD] bg-[#7C3AED]/10'
                  : 'border-transparent text-[#CCC3D8]/60 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* BODY MODAL */}
        <div className="p-6 lg:p-8 flex-1 overflow-y-auto hide-scrollbar space-y-6">
          {exportSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              {exportSuccess}
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Trazabilidad Raw Stream del Ledger ({ledger.length} Entradas)
                </h3>
                <span className="text-[10px] text-[#D6B36A] font-bold">APPEND-ONLY INMUTABLE</span>
              </div>
              <div className="bg-[#070709] border border-white/10 rounded-2xl p-4 font-mono text-xs text-[#CCC3D8] space-y-2 max-h-[360px] overflow-y-auto hide-scrollbar">
                {ledger.length === 0 ? (
                  <p className="text-white/40 italic">No hay registros en el Ledger hoy. Registra un evento en el Composer.</p>
                ) : (
                  ledger.map((lg) => (
                    <div key={lg.id} className="p-2.5 rounded-lg bg-white/5 border border-white/5 space-y-1">
                      <div className="flex justify-between text-[11px] text-[#7C3AED] font-bold">
                        <span>[{new Date(lg.timestamp).toLocaleTimeString()}] {lg.type}</span>
                        <span>Confiabilidad: {((lg.confidence || 0.95) * 100).toFixed(0)}%</span>
                      </div>
                      <p className="text-white text-xs">{lg.evidence}</p>
                      <p className="text-[10px] text-white/40">Fuente: {lg.source}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'xlsx' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#7C3AED]/10 border border-[#7C3AED]/30 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#7C3AED] text-3xl">table_view</span>
                  <div>
                    <h3 className="text-base font-bold text-white">Contrato Oficial SALUD_METABOLISMO_EDYAN.xlsx</h3>
                    <p className="text-xs text-[#CCC3D8]/70">Genera el libro Excel de 24 pestañas exacto normado en el Blueprint.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-[10px] text-[#C4B5FD] font-bold pt-2">
                  <div>✓ 1. Datos Clínicos</div>
                  <div>✓ 2. Antropometría</div>
                  <div>✓ 3. Registro Nutricional</div>
                  <div>✓ 4. Balance Calórico</div>
                  <div>✓ 5. Sueño & Circadiano</div>
                  <div>✓ 6. Actividad RPE</div>
                  <div>✓ 7. Hidratación</div>
                  <div>✓ 8. Despensa Crítica</div>
                </div>
              </div>
              <button
                onClick={handleDownloadXlsx}
                disabled={isExporting}
                className="w-full py-4 rounded-full bg-[#7C3AED] text-white font-bold text-xs tracking-widest hover:bg-[#6D28D9] transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                <span className="material-symbols-outlined">download</span>
                {isExporting ? 'GENERANDO LIBRO EXCEL DE 24 PESTAÑAS...' : 'DESCARGAR ARCHIVO XLSX COMPLETO'}
              </button>
            </div>
          )}

          {activeTab === 'pdf' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                <h3 className="text-base font-bold text-white">Informe Técnico Diario de Salud & Metabolismo</h3>
                <p className="text-xs text-[#CCC3D8]/70">Resumen ejecutivo diario listo para guardar en PDF o imprimir.</p>
                <div className="p-4 rounded-2xl bg-[#070709] text-xs text-white/80 space-y-1">
                  <p>• <strong>Fecha:</strong> {report.date}</p>
                  <p>• <strong>Proteína / Calorías:</strong> {report.totalKcal} kcal (Proteína: {report.totalProtein}g)</p>
                  <p>• <strong>Recomendación Aegis Core:</strong> {report.agentRecommendations[0] || 'Estado dentro de parámetros normales'}</p>
                </div>
              </div>
              <button
                onClick={handleDownloadPdf}
                disabled={isExporting}
                className="w-full py-4 rounded-full bg-[#D6B36A] text-black font-bold text-xs tracking-widest hover:bg-[#C29E57] transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                <span className="material-symbols-outlined">print</span>
                GENERAR E IMPRIMIR REPORTE PDF
              </button>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                <h3 className="text-base font-bold text-white">Exportación de Datos Brutos JSON / CSV</h3>
                <p className="text-xs text-[#CCC3D8]/70">Descarga la estructura completa de datos para integración o análisis local.</p>
              </div>
              <button
                onClick={handleDownloadJson}
                className="w-full py-4 rounded-full border border-[#7C3AED] text-[#C4B5FD] font-bold text-xs tracking-widest hover:bg-[#7C3AED]/20 transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">download</span>
                DESCARGAR DATASET COMPLETO (JSON)
              </button>
            </div>
          )}
        </div>

        {/* FOOTER MODAL */}
        <div className="p-6 bg-[#070709] border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-full bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-all"
          >
            CERRAR VENTANA
          </button>
        </div>
      </div>
    </div>
  );
};
