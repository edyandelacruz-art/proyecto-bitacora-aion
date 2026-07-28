import React, { useState } from 'react';
import { AionMemoryStore, FinancialProjectionRow } from '@aion/memory';

export const FinancesDashboard: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const financeConfig = store.getFinanceConfig();
  const ledger = store.getLedgerEntries() || [];

  const [activeTab, setActiveTab] = useState<'summary' | 'spreadsheet' | 'config'>('spreadsheet');

  // Estados editables de configuración
  const [monthlyBudgetCop, setMonthlyBudgetCop] = useState<number>(financeConfig.monthlyBudgetCop || 2500000);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>(
    financeConfig.categoryBudgets || {
      Alimentos: 800000,
      Salud: 400000,
      Suplementos: 300000,
      Vivienda: 600000,
      General: 400000,
    }
  );

  // Estado editable de la matriz de proyección (Hoja de cálculo)
  const [projections, setProjections] = useState<FinancialProjectionRow[]>(
    financeConfig.projections || []
  );

  // Registro rápido de gasto
  const [description, setDescription] = useState('');
  const [amountCop, setAmountCop] = useState<number>(35000);
  const [category, setCategory] = useState<string>('Alimentos');

  const financialEvents = ledger.filter(
    (e) => e.type === 'inventory_added' || (e.payload && (e.payload.amountCop || e.payload.cost))
  );

  const allTransactions = financialEvents.length > 0
    ? financialEvents.map((e) => ({
        id: e.id,
        description: e.payload?.description || 'Compra en Bitácora',
        amountCop: e.payload?.amountCop || e.payload?.cost || 25000,
        category: e.payload?.category || 'Alimentos',
        time: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }))
    : [
        { id: 'f1', description: 'Compra de pechuga de pollo y vegetales', amountCop: 45000, category: 'Alimentos', time: '10:30 AM' },
        { id: 'f2', description: 'Citrato de Magnesio & Vitamina D3', amountCop: 62000, category: 'Suplementos', time: '02:15 PM' },
        { id: 'f3', description: 'Consulta médica de seguimiento', amountCop: 120000, category: 'Salud', time: 'Ayer' },
      ];

  const totalSpent = allTransactions.reduce((acc, t) => acc + t.amountCop, 0);

  const handleSaveConfig = () => {
    store.setFinanceConfig({
      monthlyBudgetCop,
      categoryBudgets,
      projections,
    });
    onRefresh();
  };

  const handleUpdateProjectionCell = (
    index: number,
    field: keyof FinancialProjectionRow,
    value: any
  ) => {
    const updated = [...projections];
    const row = { ...updated[index], [field]: value };

    if (field !== 'month') {
      const inc = Number(row.projectedIncomeCop) || 0;
      const fix = Number(row.fixedExpensesCop) || 0;
      const varE = Number(row.variableExpensesCop) || 0;
      row.savingsCop = inc - (fix + varE);

      // Recalcular balance acumulado
      let prevBal = index > 0 ? updated[index - 1].netBalanceCop : 0;
      row.netBalanceCop = prevBal + row.savingsCop;
    }

    updated[index] = row;
    setProjections(updated);
    store.setFinanceConfig({ projections: updated });
  };

  const handleAddExpense = () => {
    if (!description.trim()) return;

    store.addLedgerEntry({
      id: `fin_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'inventory_added',
      source: 'user',
      evidence: 'USER_CONFIRMED',
      confidence: 1.0,
      payload: {
        description,
        amountCop,
        category,
        cost: amountCop,
      },
    });

    setDescription('');
    onRefresh();
  };

  const handleExportProjectionsCsv = () => {
    const headers = 'Mes,Ingresos Proyectados,Gastos Fijos,Gastos Variables,Ahorro Neto,Balance Acumulado\n';
    const rows = projections
      .map(
        (p) =>
          `${p.month},${p.projectedIncomeCop},${p.fixedExpensesCop},${p.variableExpensesCop},${p.savingsCop},${p.netBalanceCop}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PROYECCION_FINANCIERA_AION_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 max-w-[1400px] w-full mx-auto pb-16">
      
      {/* 1. CABECERA DEL MÓDULO SOBERANO DE FINANZAS */}
      <div className="dashboard-card rounded-[36px] p-6 lg:p-8 border border-[#D6B36A]/40 space-y-6 bg-[#111017]">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-[#D6B36A]/15 border border-[#D6B36A]/40 flex items-center justify-center text-[#D6B36A]">
              <span className="material-symbols-outlined text-3xl">payments</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em] block">
                MÓDULO MAESTRO SOBERANO
              </span>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white mt-0.5">
                Finanzas, Presupuesto & Matriz de Proyección
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleExportProjectionsCsv}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Exportar Matriz (.CSV / XLSX)
            </button>
            <span className="px-4 py-2 rounded-full bg-[#D6B36A]/20 text-[#D6B36A] text-xs font-bold border border-[#D6B36A]/40">
              PRESUPUESTO MES: ${monthlyBudgetCop.toLocaleString()} COP
            </span>
          </div>
        </div>

        {/* NAVEGACIÓN INTERNA DE SUB-VISTAS FINANCIERAS */}
        <div className="flex gap-3 border-t border-white/10 pt-4 overflow-x-auto hide-scrollbar">
          {[
            { id: 'spreadsheet', label: 'Matriz / Hoja de Cálculo Proyectada', icon: 'grid_on' },
            { id: 'summary', label: 'Resumen Presupuestario & Ledger', icon: 'bar_chart' },
            { id: 'config', label: 'Configurar Presupuesto & Categorías', icon: 'tune' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                activeTab === tab.id
                  ? 'bg-[#D6B36A] text-black border-[#D6B36A] shadow-lg shadow-[#D6B36A]/20 scale-[1.02]'
                  : 'bg-white/5 text-[#CCC3D8]/70 border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SUB-VISTA 1: HOJA DE CÁLCULO / MATRIZ DE PROYECCIÓN FINANCIERA */}
      {activeTab === 'spreadsheet' && (
        <div className="dashboard-card p-6 lg:p-8 rounded-[36px] bg-[#111017] border border-white/10 space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em] block">
                MATRIZ INTERACTIVA TIPO EXCEL
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">Hoja de Cálculo de Proyección Financiera (6 Meses)</h2>
            </div>
            <p className="text-xs text-[#CCC3D8]/60">Haz clic en cualquier celda para editar ingresos o gastos proyectados en vivo.</p>
          </div>

          {/* TABLA EDITABLE TIPO SPREADSHEET */}
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#070709]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#111017] border-b border-white/10 text-[#D6B36A] font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Mes</th>
                  <th className="p-4">Ingresos Proyectados ($ COP)</th>
                  <th className="p-4">Gastos Fijos ($ COP)</th>
                  <th className="p-4">Gastos Variables ($ COP)</th>
                  <th className="p-4">Ahorro Neto ($ COP)</th>
                  <th className="p-4">Balance Acumulado ($ COP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[#E5E1E5]">
                {projections.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white font-sans">{row.month}</td>
                    <td className="p-4">
                      <input
                        type="number"
                        step="50000"
                        value={row.projectedIncomeCop}
                        onChange={(e) => handleUpdateProjectionCell(idx, 'projectedIncomeCop', parseInt(e.target.value) || 0)}
                        className="bg-transparent border border-white/10 rounded-xl px-3 py-1.5 w-36 text-emerald-400 font-bold focus:border-[#D6B36A] outline-none"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        step="50000"
                        value={row.fixedExpensesCop}
                        onChange={(e) => handleUpdateProjectionCell(idx, 'fixedExpensesCop', parseInt(e.target.value) || 0)}
                        className="bg-transparent border border-white/10 rounded-xl px-3 py-1.5 w-36 text-red-400 font-bold focus:border-[#D6B36A] outline-none"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        step="50000"
                        value={row.variableExpensesCop}
                        onChange={(e) => handleUpdateProjectionCell(idx, 'variableExpensesCop', parseInt(e.target.value) || 0)}
                        className="bg-transparent border border-white/10 rounded-xl px-3 py-1.5 w-36 text-amber-400 font-bold focus:border-[#D6B36A] outline-none"
                      />
                    </td>
                    <td className="p-4 font-bold text-[#D6B36A]">
                      ${row.savingsCop.toLocaleString()} COP
                    </td>
                    <td className="p-4 font-bold text-sky-400">
                      ${row.netBalanceCop.toLocaleString()} COP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SUB-VISTA 2: CONFIGURACIÓN EDITABLE DEL PRESUPUESTO BASE */}
      {activeTab === 'config' && (
        <div className="dashboard-card p-6 lg:p-8 rounded-[36px] bg-[#111017] border border-white/10 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em] block">
                AJUSTES DE PRESUPUESTO SOBERANO
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">Editar Presupuesto Base & Metas por Categoría</h2>
            </div>
            <button
              onClick={handleSaveConfig}
              className="px-6 py-2.5 rounded-full bg-[#D6B36A] text-black font-bold text-xs hover:bg-[#C29E57] transition-all shadow-lg"
            >
              GUARDAR CONFIGURACIÓN
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-[#070709] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase">Presupuesto Mensual Global ($ COP)</h3>
              <input
                type="number"
                step="100000"
                value={monthlyBudgetCop}
                onChange={(e) => setMonthlyBudgetCop(parseInt(e.target.value) || 0)}
                className="w-full bg-[#111017] border border-white/15 rounded-2xl px-5 py-3 text-lg font-bold text-[#D6B36A] focus:border-[#D6B36A] outline-none"
              />
            </div>

            <div className="p-6 rounded-3xl bg-[#070709] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase">Límites por Categoría ($ COP)</h3>
              <div className="space-y-3">
                {Object.entries(categoryBudgets).map(([catKey, catVal]) => (
                  <div key={catKey} className="flex justify-between items-center gap-4 text-xs font-bold">
                    <span className="text-[#CCC3D8]">{catKey}</span>
                    <input
                      type="number"
                      step="50000"
                      value={catVal}
                      onChange={(e) => setCategoryBudgets({ ...categoryBudgets, [catKey]: parseInt(e.target.value) || 0 })}
                      className="bg-[#111017] border border-white/15 rounded-xl px-4 py-2 w-44 text-right text-white font-mono focus:border-[#D6B36A] outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUB-VISTA 3: RESUMEN PRESUPUESTARIO & REGISTRO DE LEDGER */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 dashboard-card p-6 rounded-[36px] bg-[#111017] border border-white/10 space-y-5">
            <h3 className="text-lg font-bold text-white">Registrar Gasto Manual en Ledger</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#CCC3D8]/70 uppercase block mb-1">Concepto</label>
                <input
                  type="text"
                  placeholder="Ej. Compra de pechuga de pollo"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#070709] border border-white/15 rounded-2xl px-4 py-3 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#CCC3D8]/70 uppercase block mb-1">Monto ($ COP)</label>
                <input
                  type="number"
                  value={amountCop}
                  onChange={(e) => setAmountCop(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#070709] border border-white/15 rounded-2xl px-4 py-3 text-white text-xs"
                />
              </div>
              <button
                onClick={handleAddExpense}
                className="w-full py-3.5 bg-[#D6B36A] text-black font-bold text-xs rounded-2xl hover:bg-[#C29E57] transition-all shadow-xl cursor-pointer"
              >
                REGISTRAR GASTO
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 dashboard-card p-6 rounded-[36px] bg-[#111017] border border-white/10 space-y-5">
            <h3 className="text-lg font-bold text-white">Transacciones Registradas en Ledger</h3>
            <div className="space-y-3 max-h-[380px] overflow-y-auto hide-scrollbar">
              {allTransactions.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-[#070709] border border-white/10 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-white">{t.description}</h4>
                    <p className="text-[10px] text-[#CCC3D8]/60">{t.category} • {t.time}</p>
                  </div>
                  <span className="font-extrabold text-[#D6B36A] text-sm">${t.amountCop.toLocaleString()} COP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
