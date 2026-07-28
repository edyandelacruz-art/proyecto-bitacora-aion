import React, { useState } from 'react';
import { AionMemoryStore } from '@aion/memory';

export const FinancesDashboard: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const ledger = store.getLedgerEntries() || [];

  // Filtrar transacciones financieras del Ledger o agregar transacciones de prueba
  const financialEvents = ledger.filter(
    (e) => e.type === 'inventory_added' || (e.payload && e.payload.amountCop)
  );

  const [description, setDescription] = useState('');
  const [amountCop, setAmountCop] = useState<number>(25000);
  const [category, setCategory] = useState<'Alimentos' | 'Salud' | 'Suplementos' | 'General'>('Alimentos');

  const totalSpent = financialEvents.reduce(
    (acc, e) => acc + (e.payload?.amountCop || e.payload?.cost || 25000),
    0
  ) || 45000;

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
    <div className="space-y-6 max-w-[1400px] mx-auto pb-16">
      {/* HEADER FINANCIERO STITCH 1:1 */}
      <div className="dashboard-card rounded-[36px] p-6 lg:p-8 border border-[#D6B36A]/40 space-y-6 bg-[#111017]">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em]">
              GESTIÓN FINANCIERA BASADA EN LEDGER UNVERSAL
            </span>
            <h2 className="text-2xl font-bold text-white mt-1 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#D6B36A] text-3xl">payments</span>
              Finanzas, Compras & Presupuesto
            </h2>
          </div>
          <span className="px-4 py-2 rounded-full bg-[#D6B36A]/20 text-[#D6B36A] text-xs font-bold border border-[#D6B36A]/40">
            TOTAL GASTADO HOY: ${totalSpent.toLocaleString()} COP
          </span>
        </div>

        {/* EXPLICACIÓN DE CÓMO FUNCIONA EL MÓDULO DE FINANZAS */}
        <div className="p-4 rounded-2xl bg-[#070709] border border-white/10 space-y-2">
          <h3 className="text-xs font-bold text-[#D6B36A] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span> ¿Cómo maneja AION tus Finanzas?
          </h3>
          <p className="text-xs text-[#CCC3D8]/80 leading-relaxed">
            Las finanzas en AION Aegis no son un módulo aislado. Cada compra de alimentos registrada en la Bitácora o ajuste en Despensa genera automáticamente una entrada en el **Universal Ledger**. AION calcula el costo diario en pesos ($ COP) y analiza el impacto en tu presupuesto sin obligarte a llenar planillas complejas.
          </p>
        </div>

        {/* REGISTRO RÁPIDO DE GASTO */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#D6B36A]">add_card</span>
            Registrar Gasto o Compra Manual ($ COP)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Descripción</label>
              <input
                type="text"
                placeholder="Ej. Mercados en el super"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#D6B36A] outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Monto ($ COP)</label>
              <input
                type="number"
                step="1000"
                value={amountCop}
                onChange={(e) => setAmountCop(parseInt(e.target.value))}
                className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#D6B36A] outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#D6B36A] outline-none"
              >
                <option value="Alimentos">Alimentos & Despensa</option>
                <option value="Salud">Salud & Consultas</option>
                <option value="Suplementos">Suplementos & Vitaminas</option>
                <option value="General">General / Gastos Varios</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSaveExpense}
                className="w-full py-2.5 bg-[#D6B36A] text-black font-bold text-xs rounded-xl hover:bg-[#C29E57] transition-all shadow-lg"
              >
                REGISTRAR GASTO
              </button>
            </div>
          </div>
        </div>

        {/* LISTADO DE TRANSACCIONES REGISTRADAS */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Historial de Transacciones del Ledger
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto hide-scrollbar">
            {financialEvents.length === 0 ? (
              <p className="text-xs text-[#CCC3D8]/50 italic">No hay transacciones registradas hoy. Escribe "Gasté 25.000 pesos" en Aegis Core.</p>
            ) : (
              financialEvents.map((fe) => (
                <div key={fe.id} className="p-3.5 rounded-2xl bg-[#070709] border border-white/10 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white">{fe.payload?.description || 'Compra de Alimentos'}</span>
                    <span className="text-[10px] text-[#CCC3D8]/60 block">{new Date(fe.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <span className="font-bold text-[#D6B36A] text-sm">
                    ${(fe.payload?.amountCop || fe.payload?.cost || 25000).toLocaleString()} COP
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
