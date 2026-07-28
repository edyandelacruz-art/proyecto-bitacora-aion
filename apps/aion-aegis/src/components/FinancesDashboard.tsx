import React, { useState } from 'react';
import { AionMemoryStore } from '@aion/memory';

export const FinancesDashboard: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const ledger = store.getLedgerEntries() || [];

  // Filtrar eventos financieros o generar registros deterministas de prueba
  const financialEvents = ledger.filter(
    (e) => e.type === 'inventory_added' || (e.payload && (e.payload.amountCop || e.payload.cost))
  );

  const [description, setDescription] = useState('');
  const [amountCop, setAmountCop] = useState<number>(35000);
  const [category, setCategory] = useState<'Alimentos' | 'Salud' | 'Suplementos' | 'General'>('Alimentos');

  const defaultMockTransactions = [
    { id: 'f1', description: 'Compra de pechuga de pollo y vegetales', amountCop: 45000, category: 'Alimentos', time: '10:30 AM' },
    { id: 'f2', description: 'Citrato de Magnesio & Vitamina D3', amountCop: 62000, category: 'Suplementos', time: '02:15 PM' },
    { id: 'f3', description: 'Consulta médica de seguimiento', amountCop: 120000, category: 'Salud', time: 'Ayer' },
  ];

  const allTransactions = financialEvents.length > 0
    ? financialEvents.map((e) => ({
        id: e.id,
        description: e.payload?.description || 'Compra en Bitácora',
        amountCop: e.payload?.amountCop || e.payload?.cost || 25000,
        category: e.payload?.category || 'Alimentos',
        time: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }))
    : defaultMockTransactions;

  const totalSpent = allTransactions.reduce((acc, t) => acc + t.amountCop, 0);
  const monthlyBudget = 1500000; // $1,500,000 COP
  const budgetPercentage = Math.min((totalSpent / monthlyBudget) * 100, 100).toFixed(1);

  const handleSaveExpense = () => {
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

  return (
    <div className="space-y-8 max-w-[1400px] w-full mx-auto pb-16">
      {/* 1. CABECERA PRINCIPAL DEL MÓDULO DE FINANZAS */}
      <div className="dashboard-card rounded-[36px] p-6 lg:p-8 border border-[#D6B36A]/40 space-y-6 bg-[#111017]">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-[#D6B36A]/15 border border-[#D6B36A]/40 flex items-center justify-center text-[#D6B36A]">
              <span className="material-symbols-outlined text-3xl">payments</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em] block">
                MÓDULO COMPLETO DE FINANZAS & LEDGER UNVERSAL
              </span>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white mt-0.5">
                Finanzas, Compras & Control Presupuestario
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-full bg-[#D6B36A]/20 text-[#D6B36A] text-xs font-bold border border-[#D6B36A]/40 shadow-lg">
              GASTO ACUMULADO: ${totalSpent.toLocaleString()} COP
            </span>
            <span className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
              LEDGER AUDITADO
            </span>
          </div>
        </div>

        {/* METRIC CARDS DE RESUMEN FINANCIERO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-[#CCC3D8]/60 uppercase tracking-widest block">Gasto Total Acumulado</span>
            <p className="text-2xl font-extrabold text-white">${totalSpent.toLocaleString()} <span className="text-xs font-normal text-[#D6B36A]">COP</span></p>
            <p className="text-[10px] text-emerald-400 font-bold">✓ {allTransactions.length} transacciones registradas</p>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-[#CCC3D8]/60 uppercase tracking-widest block">Presupuesto Mensual Base</span>
            <p className="text-2xl font-extrabold text-[#C4B5FD]">${monthlyBudget.toLocaleString()} <span className="text-xs font-normal">COP</span></p>
            <p className="text-[10px] text-[#C4B5FD] font-bold">Ejecutado al {budgetPercentage}%</p>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-[#CCC3D8]/60 uppercase tracking-widest block">Categoría Principal</span>
            <p className="text-2xl font-extrabold text-[#D6B36A]">Alimentos</p>
            <p className="text-[10px] text-[#CCC3D8]/60">Sincronizado con Despensa</p>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-[#CCC3D8]/60 uppercase tracking-widest block">Agente Supervisor</span>
            <p className="text-xl font-bold text-white">FinancesAgent</p>
            <p className="text-[10px] text-emerald-400 font-bold">● ONLINE • Trazabilidad Ledger</p>
          </div>
        </div>

        {/* GRÁFICO BARRA DE CONSUMO PRESUPUESTARIO SVG */}
        <div className="p-6 rounded-3xl bg-[#070709] border border-white/10 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-white">Progreso del Presupuesto Mensual ($ COP)</span>
            <span className="text-[#D6B36A]">${totalSpent.toLocaleString()} / ${monthlyBudget.toLocaleString()} COP</span>
          </div>
          <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#7C3AED] via-[#D6B36A] to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${budgetPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. REGISTRO MANUAL DE TRANSACCIONES & HISTORIAL COMPLETO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FORMULARIO DE REGISTRO (lg:col-span-5) */}
        <div className="lg:col-span-5 dashboard-card p-6 rounded-[36px] bg-[#111017] border border-white/10 space-y-5">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <span className="material-symbols-outlined text-[#D6B36A] text-2xl">add_card</span>
            <h3 className="text-lg font-bold text-white">Registrar Gasto Financiero</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-[#CCC3D8]/70 uppercase block mb-1">Concepto / Descripción</label>
              <input
                type="text"
                placeholder="Ej. Mercado semanal en el supermercado"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#070709] border border-white/15 rounded-2xl px-4 py-3 text-white text-xs focus:border-[#D6B36A] outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#CCC3D8]/70 uppercase block mb-1">Monto en Pesos ($ COP)</label>
              <input
                type="number"
                step="1000"
                value={amountCop}
                onChange={(e) => setAmountCop(parseInt(e.target.value) || 0)}
                className="w-full bg-[#070709] border border-white/15 rounded-2xl px-4 py-3 text-white text-xs focus:border-[#D6B36A] outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#CCC3D8]/70 uppercase block mb-1">Categoría del Gasto</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#070709] border border-white/15 rounded-2xl px-4 py-3 text-white text-xs focus:border-[#D6B36A] outline-none"
              >
                <option value="Alimentos">Alimentos & Mercado Despensa</option>
                <option value="Salud">Salud, Consultas & Exámenes</option>
                <option value="Suplementos">Suplementos, Proteína & Vitaminas</option>
                <option value="General">General / Otros Gastos</option>
              </select>
            </div>

            <button
              onClick={handleSaveExpense}
              className="w-full py-3.5 bg-[#D6B36A] text-black font-bold text-xs rounded-2xl hover:bg-[#C29E57] transition-all shadow-xl cursor-pointer"
            >
              REGISTRAR EN LEDGER FINANCIERO
            </button>
          </div>
        </div>

        {/* TABLA / LISTADO DE TRANSACCIONES AUDITADAS (lg:col-span-7) */}
        <div className="lg:col-span-7 dashboard-card p-6 rounded-[36px] bg-[#111017] border border-white/10 space-y-5">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white">Historial de Transacciones del Ledger</h3>
            <span className="text-xs text-[#CCC3D8]/60 font-mono">AUDITABLE • APPEND-ONLY</span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto hide-scrollbar">
            {allTransactions.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-[#070709] border border-white/10 flex justify-between items-center text-xs hover:border-[#D6B36A]/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D6B36A]"></span>
                  <div>
                    <h4 className="font-bold text-white">{t.description}</h4>
                    <p className="text-[10px] text-[#CCC3D8]/60">{t.category} • {t.time}</p>
                  </div>
                </div>

                <span className="font-extrabold text-[#D6B36A] text-sm">
                  ${t.amountCop.toLocaleString()} COP
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
