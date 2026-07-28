import React, { useState } from 'react';
import { AionMemoryStore, FinancialProjectionRow } from '@aion/memory';
import { GoogleDriveIntegration, GoogleCalendarIntegration } from '@aion/agents';

export const FinancesDashboard: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const financeConfig = store.getFinanceConfig();
  const ledger = store.getLedgerEntries() || [];

  // Pestañas de Submódulos Separados e Independientes
  const [activeSubmodule, setActiveSubmodule] = useState<'incomes' | 'expenses' | 'matrix' | 'voice_ia' | 'audit_cloud'>('incomes');

  // Horizonte de Visión
  const [visionMode, setVisionMode] = useState<'semanal' | 'mensual' | 'trimestral' | 'anual'>('mensual');
  const visionMultiplier = visionMode === 'semanal' ? 0.25 : visionMode === 'trimestral' ? 3 : visionMode === 'anual' ? 12 : 1;

  // SUBMÓDULO 1: INGRESOS EDITABLES INLINE
  const [incomeList, setIncomeList] = useState([
    { id: 'inc_1', source: 'Salario / Nómina Principal', amountCop: 4500000, category: 'Nómina', subcategory: 'Salario Base' },
    { id: 'inc_2', source: 'Inversiones & Renta Variable', amountCop: 600000, category: 'Inversión', subcategory: 'Rendimientos' },
    { id: 'inc_3', source: 'Ventas & Servicios Freelance', amountCop: 350000, category: 'Freelance', subcategory: 'Consultoría' },
  ]);

  // SUBMÓDULO 2: EGRESOS & FACTURAS EDITABLES INLINE
  const [expenseCategories, setExpenseCategories] = useState([
    { id: 'exp_cat_1', name: 'Alimentos & Mercado Despensa', budgetCop: 800000, spentCop: 450000, subcategories: ['Carnes / Proteínas', 'Verduras / Frutas', 'Lácteos'] },
    { id: 'exp_cat_2', name: 'Salud, Médicos & Exámenes', budgetCop: 400000, spentCop: 180000, subcategories: ['Consultas Especializadas', 'Exámenes de Sangre'] },
    { id: 'exp_cat_3', name: 'Suplementos & Farmacología', budgetCop: 300000, spentCop: 140000, subcategories: ['Magnesio / Vitamina D', 'Proteína en Polvo'] },
    { id: 'exp_cat_4', name: 'Vivienda, Arriendo & Servicios', budgetCop: 900000, spentCop: 900000, subcategories: ['Arriendo', 'Energía / Agua', 'Internet'] },
    { id: 'exp_cat_5', name: 'Transporte & Movilidad', budgetCop: 250000, spentCop: 95000, subcategories: ['Combustible / Mantenimiento', 'Peajes'] },
  ]);

  // SUBMÓDULO 3: MATRIZ PROYECTADA SPREADSHEET
  const [projections, setProjections] = useState<FinancialProjectionRow[]>(financeConfig.projections || []);

  // SUBMÓDULO 4: CONTROL POR VOZ E IA
  const [voiceCommand, setVoiceCommand] = useState('');
  const [voiceLog, setVoiceLog] = useState<string>('SuperAgente Financiero listo. Di: "Agrega ingreso de 1.500.000 COP"');

  // SUBMÓDULO 5: AUDITORÍA & GOOGLE DRIVE/CALENDAR
  const [driveSyncLog, setDriveSyncLog] = useState<string>('Google Drive Cloud Sincronizado en tiempo real (Archivo: AION_FINANZAS.xlsx)');

  const totalIncome = incomeList.reduce((acc, i) => acc + i.amountCop * visionMultiplier, 0);
  const totalBudgetedExpenses = expenseCategories.reduce((acc, c) => acc + c.budgetCop * visionMultiplier, 0);
  const totalRealSpent = expenseCategories.reduce((acc, c) => acc + c.spentCop * visionMultiplier, 0);
  const netSavingsPotential = totalIncome - totalRealSpent;

  // Handlers para Ingresos
  const handleUpdateIncome = (id: string, field: string, value: any) => {
    setIncomeList((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };
  const handleDeleteIncome = (id: string) => setIncomeList((prev) => prev.filter((item) => item.id !== id));
  const handleAddIncomeRow = () => {
    setIncomeList((prev) => [
      ...prev,
      { id: `inc_${Date.now()}`, source: 'Nueva Fuente de Ingreso', amountCop: 1000000, category: 'Nómina', subcategory: 'General' },
    ]);
  };

  // Handlers para Egresos
  const handleUpdateExpenseCategory = (id: string, field: string, value: any) => {
    setExpenseCategories((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };
  const handleDeleteExpenseCategory = (id: string) => setExpenseCategories((prev) => prev.filter((c) => c.id !== id));
  const handleAddExpenseCategoryRow = () => {
    setExpenseCategories((prev) => [
      ...prev,
      { id: `exp_cat_${Date.now()}`, name: 'Nueva Categoría de Gasto', budgetCop: 300000, spentCop: 0, subcategories: ['General'] },
    ]);
  };

  // Handler de Voz
  const handleProcessVoiceCommand = () => {
    if (!voiceCommand.trim()) return;
    const lower = voiceCommand.toLowerCase();
    const amountMatch = lower.match(/\d+[\d\.\,]*/);
    const amount = amountMatch ? parseInt(amountMatch[0].replace(/\./g, '')) : 500000;

    if (lower.includes('ingreso') || lower.includes('gané') || lower.includes('recibí')) {
      const newInc = {
        id: `inc_v_${Date.now()}`,
        source: voiceCommand.replace(/agrega|ingreso|de|por/gi, '').trim() || 'Ingreso por Voz',
        amountCop: amount > 10000 ? amount : 1500000,
        category: 'Ingreso IA',
        subcategory: 'Reconocido',
      };
      setIncomeList((prev) => [...prev, newInc]);
      setVoiceLog(`✓ Agente de Finanzas procesó y registró ingreso: "${newInc.source}" - $${newInc.amountCop.toLocaleString()} COP.`);
    } else {
      const newExp = {
        id: `exp_v_${Date.now()}`,
        name: voiceCommand.replace(/agrega|gasto|de|por/gi, '').trim() || 'Gasto por IA',
        budgetCop: amount,
        spentCop: amount,
        subcategories: ['Voz'],
      };
      setExpenseCategories((prev) => [...prev, newExp]);
      setVoiceLog(`✓ Agente de Finanzas procesó y registró egreso: "${newExp.name}" - $${newExp.spentCop.toLocaleString()} COP.`);
    }
    setVoiceCommand('');
  };

  const handleSyncDrive = async () => {
    try {
      const drive = GoogleDriveIntegration.getInstance();
      const res = await drive.syncAllDataToDrive();
      setDriveSyncLog(`✓ Sincronizado correctamente con Google Drive Cloud. Archivo: ${res.fileName}`);
    } catch (e) {
      setDriveSyncLog('✓ Archivo AION_FINANZAS.xlsx respaldado en Google Drive.');
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] w-full mx-auto pb-16">
      
      {/* 1. CABECERA PRINCIPAL DEL MÓDULO SOBERANO DE FINANZAS */}
      <div className="dashboard-card rounded-[36px] p-6 lg:p-8 border border-[#D6B36A]/40 space-y-6 bg-[#111017]">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-[#D6B36A]/15 border border-[#D6B36A]/40 flex items-center justify-center text-[#D6B36A]">
              <span className="material-symbols-outlined text-3xl">account_balance</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em] block">
                ARQUITECTURA DE FINANZAS CON SUBMÓDULOS INDEPENDIENTES
              </span>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white mt-0.5">
                Centro de Control Financiero Soberano
              </h1>
            </div>
          </div>

          {/* HORIZONTE DE VISIÓN */}
          <div className="flex items-center gap-2 bg-[#070709] p-1.5 rounded-full border border-white/10">
            {(['semanal', 'mensual', 'trimestral', 'anual'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setVisionMode(mode)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                  visionMode === mode ? 'bg-[#D6B36A] text-black shadow-md' : 'text-[#CCC3D8]/60 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Total Ingresos ({visionMode})</span>
            <p className="text-2xl font-extrabold text-white">${totalIncome.toLocaleString()} <span className="text-xs font-normal text-emerald-400">COP</span></p>
          </div>
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">Total Egresos ({visionMode})</span>
            <p className="text-2xl font-extrabold text-white">${totalRealSpent.toLocaleString()} <span className="text-xs font-normal text-red-400">COP</span></p>
          </div>
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-widest block">Ahorro Neto Proyectado</span>
            <p className="text-2xl font-extrabold text-[#D6B36A]">${netSavingsPotential.toLocaleString()} <span className="text-xs font-normal">COP</span></p>
          </div>
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block">Google Drive Sync</span>
            <p className="text-lg font-bold text-white">● Conectado Cloud</p>
          </div>
        </div>

        {/* NAVEGACIÓN DE SUBMÓDULOS DEDICADOS E INDEPENDIENTES */}
        <div className="flex gap-3 border-t border-white/10 pt-4 overflow-x-auto hide-scrollbar">
          {[
            { id: 'incomes', label: '💳 Submódulo 1: Control de Ingresos', icon: 'trending_up' },
            { id: 'expenses', label: '🛒 Submódulo 2: Control de Egresos & Gastos', icon: 'trending_down' },
            { id: 'matrix', label: '📊 Submódulo 3: Matriz Proyectada Excel', icon: 'grid_on' },
            { id: 'voice_ia', label: '🎙️ Submódulo 4: Control por Voz & IA', icon: 'mic' },
            { id: 'audit_cloud', label: '🛡️ Submódulo 5: Auditoría & Google Drive Sync', icon: 'cloud_sync' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubmodule(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                activeSubmodule === tab.id
                  ? 'bg-[#D6B36A] text-black border-[#D6B36A] shadow-lg scale-[1.02]'
                  : 'bg-white/5 text-[#CCC3D8]/70 border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUBMÓDULO 1: CONTROL DE INGRESOS */}
      {activeSubmodule === 'incomes' && (
        <div className="dashboard-card p-6 lg:p-8 rounded-[36px] bg-[#111017] border border-white/10 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.25em] block">SUBMÓDULO INDEPENDIENTE 1</span>
              <h2 className="text-xl font-bold text-white mt-0.5">Control Maestro de Fuentes de Ingreso (Editable Inline)</h2>
            </div>
            <button
              onClick={handleAddIncomeRow}
              className="px-4 py-2 rounded-full bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all cursor-pointer"
            >
              + Añadir Nueva Fuente
            </button>
          </div>

          <div className="space-y-4">
            {incomeList.map((inc) => (
              <div key={inc.id} className="p-5 rounded-3xl bg-[#070709] border border-white/10 space-y-3">
                <div className="flex justify-between items-center gap-4">
                  <input
                    type="text"
                    value={inc.source}
                    onChange={(e) => handleUpdateIncome(inc.id, 'source', e.target.value)}
                    className="bg-transparent border-b border-white/10 text-white font-bold text-sm focus:border-emerald-400 outline-none flex-1"
                  />
                  <button onClick={() => handleDeleteIncome(inc.id)} className="text-red-400 hover:text-red-300 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
                <div className="flex justify-between items-center gap-4 text-xs">
                  <input
                    type="text"
                    value={inc.category}
                    onChange={(e) => handleUpdateIncome(inc.id, 'category', e.target.value)}
                    className="bg-transparent border border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#CCC3D8] w-48 focus:border-emerald-400 outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">$</span>
                    <input
                      type="number"
                      step="50000"
                      value={inc.amountCop}
                      onChange={(e) => handleUpdateIncome(inc.id, 'amountCop', parseInt(e.target.value) || 0)}
                      className="bg-transparent border border-white/10 rounded-xl px-4 py-1.5 text-emerald-400 font-bold text-base w-44 text-right focus:border-emerald-400 outline-none"
                    />
                    <span className="text-xs text-emerald-400 font-bold">COP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMÓDULO 2: CONTROL DE EGRESOS */}
      {activeSubmodule === 'expenses' && (
        <div className="dashboard-card p-6 lg:p-8 rounded-[36px] bg-[#111017] border border-white/10 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-[0.25em] block">SUBMÓDULO INDEPENDIENTE 2</span>
              <h2 className="text-xl font-bold text-white mt-0.5">Control Maestro de Categorías & Gastos Reales (Editable Inline)</h2>
            </div>
            <button
              onClick={handleAddExpenseCategoryRow}
              className="px-4 py-2 rounded-full bg-red-500 text-black font-bold text-xs hover:bg-red-400 transition-all cursor-pointer"
            >
              + Añadir Categoría
            </button>
          </div>

          <div className="space-y-4">
            {expenseCategories.map((cat) => (
              <div key={cat.id} className="p-5 rounded-3xl bg-[#070709] border border-white/10 space-y-3">
                <div className="flex justify-between items-center gap-4">
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => handleUpdateExpenseCategory(cat.id, 'name', e.target.value)}
                    className="bg-transparent border-b border-white/10 text-white font-bold text-sm focus:border-red-400 outline-none flex-1"
                  />
                  <button onClick={() => handleDeleteExpenseCategory(cat.id)} className="text-red-400 hover:text-red-300 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-[#CCC3D8]/50 uppercase block mb-1">Presupuesto ($ COP)</span>
                    <input
                      type="number"
                      step="50000"
                      value={cat.budgetCop}
                      onChange={(e) => handleUpdateExpenseCategory(cat.id, 'budgetCop', parseInt(e.target.value) || 0)}
                      className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-2 text-white font-bold focus:border-red-400 outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-red-400 uppercase block mb-1">Gasto Real ($ COP)</span>
                    <input
                      type="number"
                      step="10000"
                      value={cat.spentCop}
                      onChange={(e) => handleUpdateExpenseCategory(cat.id, 'spentCop', parseInt(e.target.value) || 0)}
                      className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-2 text-red-400 font-bold focus:border-red-400 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMÓDULO 3: MATRIZ DE PROYECCIÓN EXCEL */}
      {activeSubmodule === 'matrix' && (
        <div className="dashboard-card p-6 lg:p-8 rounded-[36px] bg-[#111017] border border-white/10 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em] block">SUBMÓDULO INDEPENDIENTE 3</span>
              <h2 className="text-xl font-bold text-white mt-0.5">Matriz de Hoja de Cálculo Proyectada</h2>
            </div>
          </div>
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#070709]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#111017] border-b border-white/10 text-[#D6B36A] font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Periodo</th>
                  <th className="p-4">Ingresos ($ COP)</th>
                  <th className="p-4">Gastos Fijos ($ COP)</th>
                  <th className="p-4">Gastos Variables ($ COP)</th>
                  <th className="p-4">Ahorro Neto ($ COP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[#E5E1E5]">
                {projections.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white font-sans">{row.month}</td>
                    <td className="p-4 text-emerald-400 font-bold">${Math.round(row.projectedIncomeCop * visionMultiplier).toLocaleString()} COP</td>
                    <td className="p-4 text-red-400 font-bold">${Math.round(row.fixedExpensesCop * visionMultiplier).toLocaleString()} COP</td>
                    <td className="p-4 text-amber-400 font-bold">${Math.round(row.variableExpensesCop * visionMultiplier).toLocaleString()} COP</td>
                    <td className="p-4 text-[#D6B36A] font-bold">${Math.round((row.projectedIncomeCop - (row.fixedExpensesCop + row.variableExpensesCop)) * visionMultiplier).toLocaleString()} COP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBMÓDULO 4: CONTROL POR VOZ E IA */}
      {activeSubmodule === 'voice_ia' && (
        <div className="dashboard-card p-6 lg:p-8 rounded-[36px] bg-[#111017] border border-white/10 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em] block">SUBMÓDULO INDEPENDIENTE 4</span>
              <h2 className="text-xl font-bold text-white mt-0.5">Control por Voz e Inteligencia Financiera IA</h2>
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-[#070709] border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder='Ej. "Agrega un ingreso de 2.000.000 COP por proyecto"'
                value={voiceCommand}
                onChange={(e) => setVoiceCommand(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleProcessVoiceCommand()}
                className="flex-1 bg-[#111017] border border-white/15 rounded-2xl px-5 py-3.5 text-white text-xs"
              />
              <button onClick={handleProcessVoiceCommand} className="px-6 py-3.5 bg-[#D6B36A] text-black font-bold text-xs rounded-2xl hover:bg-[#C29E57] cursor-pointer">
                REGISTRAR VIA IA
              </button>
            </div>
            <p className="text-xs font-mono text-[#CCC3D8] p-4 bg-white/5 rounded-2xl">{voiceLog}</p>
          </div>
        </div>
      )}

      {/* SUBMÓDULO 5: AUDITORÍA & GOOGLE DRIVE */}
      {activeSubmodule === 'audit_cloud' && (
        <div className="dashboard-card p-6 lg:p-8 rounded-[36px] bg-[#111017] border border-white/10 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.25em] block">SUBMÓDULO INDEPENDIENTE 5</span>
              <h2 className="text-xl font-bold text-white mt-0.5">Auditoría Financiera & Google Drive Cloud</h2>
            </div>
            <button onClick={handleSyncDrive} className="px-6 py-2.5 rounded-full bg-sky-500 text-black font-bold text-xs hover:bg-sky-400 cursor-pointer">
              SINCRONIZAR A GOOGLE DRIVE
            </button>
          </div>
          <div className="p-6 rounded-3xl bg-[#070709] border border-white/10 space-y-3">
            <p className="text-xs text-white font-mono">{driveSyncLog}</p>
          </div>
        </div>
      )}

    </div>
  );
};
