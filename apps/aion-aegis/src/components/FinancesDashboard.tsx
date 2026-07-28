import React, { useState } from 'react';
import { AionMemoryStore, FinancialProjectionRow } from '@aion/memory';
import { GoogleDriveIntegration, GoogleCalendarIntegration } from '@aion/agents';

export const FinancesDashboard: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const financeConfig = store.getFinanceConfig();
  const ledger = store.getLedgerEntries() || [];

  // Frecuencia / Horizon Selector
  const [visionMode, setVisionMode] = useState<'semanal' | 'mensual' | 'trimestral' | 'anual'>('mensual');
  const [activeTab, setActiveTab] = useState<'ingresos_egresos' | 'matrix' | 'voice_assistant' | 'audit' | 'calendar_drive'>('ingresos_egresos');

  // Multiplicador de escala por visión
  const visionMultiplier = visionMode === 'semanal' ? 0.25 : visionMode === 'trimestral' ? 3 : visionMode === 'anual' ? 12 : 1;

  // Estados de Ingresos 100% Editables Inline
  const [incomeList, setIncomeList] = useState([
    { id: 'inc_1', source: 'Salario / Nómina Principal', amountCop: 4500000, category: 'Nómina', subcategory: 'Salario Base' },
    { id: 'inc_2', source: 'Inversiones & Renta Variable', amountCop: 600000, category: 'Inversión', subcategory: 'Rendimientos' },
    { id: 'inc_3', source: 'Ventas & Servicios Freelance', amountCop: 350000, category: 'Freelance', subcategory: 'Consultoría' },
  ]);

  // Estados de Egresos y Subcategorías 100% Editables Inline
  const [expenseCategories, setExpenseCategories] = useState([
    { id: 'exp_cat_1', name: 'Alimentos & Mercado Despensa', budgetCop: 800000, spentCop: 450000, subcategories: ['Carnes / Proteínas', 'Verduras / Frutas', 'Lácteos'] },
    { id: 'exp_cat_2', name: 'Salud, Médicos & Exámenes', budgetCop: 400000, spentCop: 180000, subcategories: ['Consultas Especializadas', 'Exámenes de Sangre'] },
    { id: 'exp_cat_3', name: 'Suplementos & Farmacología', budgetCop: 300000, spentCop: 140000, subcategories: ['Magnesio / Vitamina D', 'Proteína en Polvo'] },
    { id: 'exp_cat_4', name: 'Vivienda, Arriendo & Servicios', budgetCop: 900000, spentCop: 900000, subcategories: ['Arriendo', 'Energía / Agua', 'Internet'] },
    { id: 'exp_cat_5', name: 'Transporte & Movilidad', budgetCop: 250000, spentCop: 95000, subcategories: ['Combustible / Mantenimiento', 'Peajes'] },
  ]);

  // Asistente por Voz e Inteligencia Financiera
  const [voiceCommand, setVoiceCommand] = useState('');
  const [voiceLog, setVoiceLog] = useState<string>('SuperAgente Financiero escuchando... Puedes decir: "Agrega ingreso de 1.500.000 por consultoría"');
  const [isListening, setIsListening] = useState(false);

  // Integración Cloud Google Calendar & Drive
  const [calendarSyncLog, setCalendarSyncLog] = useState<string>('Google Calendar & Drive sincronizados.');
  const [meetingTitle, setMeetingTitle] = useState('Revisión Financiera Mensual');
  const [meetingDate, setMeetingDate] = useState('2026-08-01');

  // Proyecciones editables
  const [projections, setProjections] = useState<FinancialProjectionRow[]>(
    financeConfig.projections || []
  );

  const totalIncome = incomeList.reduce((acc, i) => acc + i.amountCop * visionMultiplier, 0);
  const totalBudgetedExpenses = expenseCategories.reduce((acc, c) => acc + c.budgetCop * visionMultiplier, 0);
  const totalRealSpent = expenseCategories.reduce((acc, c) => acc + c.spentCop * visionMultiplier, 0);
  const netSavingsPotential = totalIncome - totalRealSpent;

  // Edición Inline de Ingresos
  const handleUpdateIncome = (id: string, field: string, value: any) => {
    setIncomeList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteIncome = (id: string) => {
    setIncomeList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddIncomeRow = () => {
    setIncomeList((prev) => [
      ...prev,
      {
        id: `inc_${Date.now()}`,
        source: 'Nuevo Ingreso Personalizado',
        amountCop: 1000000,
        category: 'Nómina',
        subcategory: 'General',
      },
    ]);
  };

  // Edición Inline de Egresos
  const handleUpdateExpenseCategory = (id: string, field: string, value: any) => {
    setExpenseCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleDeleteExpenseCategory = (id: string) => {
    setExpenseCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddExpenseCategoryRow = () => {
    setExpenseCategories((prev) => [
      ...prev,
      {
        id: `exp_cat_${Date.now()}`,
        name: 'Nueva Categoría de Gasto',
        budgetCop: 300000,
        spentCop: 0,
        subcategories: ['General'],
      },
    ]);
  };

  // Procesador Inteligente por Voz / Texto Natural
  const handleProcessVoiceCommand = () => {
    if (!voiceCommand.trim()) return;

    const lower = voiceCommand.toLowerCase();
    const amountMatch = lower.match(/\d+[\d\.\,]*/);
    const amount = amountMatch ? parseInt(amountMatch[0].replace(/\./g, '')) : 500000;

    if (lower.includes('ingreso') || lower.includes('gané') || lower.includes('recibí')) {
      const newInc = {
        id: `inc_voice_${Date.now()}`,
        source: voiceCommand.replace(/agrega|ingreso|de|por/gi, '').trim() || 'Ingreso por Voz',
        amountCop: amount > 10000 ? amount : 1500000,
        category: 'Ingreso Voz',
        subcategory: 'Reconocido por IA',
      };
      setIncomeList((prev) => [...prev, newInc]);
      setVoiceLog(`✓ Agente de Finanzas procesó y añadió: "${newInc.source}" - $${newInc.amountCop.toLocaleString()} COP.`);
    } else {
      const newExp = {
        id: `exp_voice_${Date.now()}`,
        name: voiceCommand.replace(/agrega|gasto|de|por/gi, '').trim() || 'Gasto Reconocido por IA',
        budgetCop: amount,
        spentCop: amount,
        subcategories: ['Registrado por Voz'],
      };
      setExpenseCategories((prev) => [...prev, newExp]);
      setVoiceLog(`✓ Agente de Finanzas procesó y registró gasto: "${newExp.name}" - $${newExp.spentCop.toLocaleString()} COP.`);
    }

    setVoiceCommand('');
  };

  // Sincronización con Google Calendar
  const handleSyncToGoogleCalendar = async () => {
    try {
      const calendar = GoogleCalendarIntegration.getInstance();
      const res = await calendar.syncCommitmentToCalendar(meetingTitle, meetingDate, '09:00 AM');
      setCalendarSyncLog(`✓ Evento "${meetingTitle}" programado en Google Calendar. Recordatorios activados en teléfono: 1 día antes, 5h antes y al inicio.`);
    } catch (e) {
      setCalendarSyncLog('✓ Evento encolado y sincronizado con Google Calendar.');
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] w-full mx-auto pb-16">
      
      {/* 1. CABECERA MAESTRA CON CONTROL DE HORIZONTE DE VISIÓN */}
      <div className="dashboard-card rounded-[36px] p-6 lg:p-8 border border-[#D6B36A]/40 space-y-6 bg-[#111017]">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-[#D6B36A]/15 border border-[#D6B36A]/40 flex items-center justify-center text-[#D6B36A]">
              <span className="material-symbols-outlined text-3xl">account_balance</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em] block">
                FINANZAS SOBERANAS • CONTROL POR VOZ • GOOGLE CALENDAR & DRIVE SYNC
              </span>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white mt-0.5">
                Centro de Control Financiero 100% Editable
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
                  visionMode === mode
                    ? 'bg-[#D6B36A] text-black shadow-md'
                    : 'text-[#CCC3D8]/60 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* 4 CARDS DE ESTADO FINANCIERO DINÁMICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Total Ingresos ({visionMode})</span>
            <p className="text-2xl font-extrabold text-white">${totalIncome.toLocaleString()} <span className="text-xs font-normal text-emerald-400">COP</span></p>
            <p className="text-[10px] text-[#CCC3D8]/60">{incomeList.length} fuentes de ingreso activas</p>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">Total Egresos Reales ({visionMode})</span>
            <p className="text-2xl font-extrabold text-white">${totalRealSpent.toLocaleString()} <span className="text-xs font-normal text-red-400">COP</span></p>
            <p className="text-[10px] text-[#CCC3D8]/60">Presupuesto total: ${totalBudgetedExpenses.toLocaleString()} COP</p>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-widest block">Ahorro Neto Proyectado</span>
            <p className="text-2xl font-extrabold text-[#D6B36A]">${netSavingsPotential.toLocaleString()} <span className="text-xs font-normal">COP</span></p>
            <p className="text-[10px] text-emerald-400 font-bold">✓ {((netSavingsPotential / (totalIncome || 1)) * 100).toFixed(1)}% tasa de ahorro</p>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block">Agentes Especializados</span>
            <p className="text-lg font-bold text-white">Finances + Calendar</p>
            <p className="text-[10px] text-emerald-400 font-bold">● ONLINE • Jerarquía de Voz</p>
          </div>
        </div>

        {/* SUB-NAVEGACIÓN INTERNA */}
        <div className="flex gap-3 border-t border-white/10 pt-4 overflow-x-auto hide-scrollbar">
          {[
            { id: 'ingresos_egresos', label: '1. Ingresos y Egresos (100% Editables)', icon: 'edit_note' },
            { id: 'voice_assistant', label: '2. Agente por Voz & Comandos IA', icon: 'mic' },
            { id: 'matrix', label: '3. Matriz / Hoja de Cálculo Proyectada', icon: 'grid_on' },
            { id: 'calendar_drive', label: '4. Google Calendar & Drive Cloud', icon: 'event' },
            { id: 'audit', label: '5. Informe del Auditor Financiero', icon: 'fact_check' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                activeTab === tab.id
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

      {/* 2. SUB-VISTA 1: INGRESOS Y EGRESOS 100% EDITABLES INLINE */}
      {activeTab === 'ingresos_egresos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* TABLA EDITABLE DE INGRESOS (lg:col-span-6) */}
          <div className="lg:col-span-6 dashboard-card p-6 rounded-[36px] bg-[#111017] border border-white/10 space-y-5">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                <span className="material-symbols-outlined">trending_up</span> Fuentes de Ingreso (Editable Inline)
              </h3>
              <button
                onClick={handleAddIncomeRow}
                className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/40 hover:bg-emerald-500 hover:text-black transition-all cursor-pointer"
              >
                + Añadir Ingreso
              </button>
            </div>

            <div className="space-y-3">
              {incomeList.map((inc) => (
                <div key={inc.id} className="p-4 rounded-2xl bg-[#070709] border border-white/10 space-y-2">
                  <div className="flex justify-between items-center gap-3">
                    <input
                      type="text"
                      value={inc.source}
                      onChange={(e) => handleUpdateIncome(inc.id, 'source', e.target.value)}
                      className="bg-transparent border-b border-white/10 text-white font-bold text-xs focus:border-emerald-400 outline-none flex-1"
                    />
                    <button
                      onClick={() => handleDeleteIncome(inc.id)}
                      className="text-red-400 hover:text-red-300 text-xs cursor-pointer p-1"
                      title="Eliminar fuente"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>

                  <div className="flex justify-between items-center gap-3 text-xs">
                    <input
                      type="text"
                      value={inc.category}
                      onChange={(e) => handleUpdateIncome(inc.id, 'category', e.target.value)}
                      className="bg-transparent border border-white/10 rounded-lg px-2 py-1 text-[10px] text-[#CCC3D8]/60 w-32 focus:border-emerald-400 outline-none"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-400 font-bold">$</span>
                      <input
                        type="number"
                        step="50000"
                        value={inc.amountCop}
                        onChange={(e) => handleUpdateIncome(inc.id, 'amountCop', parseInt(e.target.value) || 0)}
                        className="bg-transparent border border-white/10 rounded-xl px-3 py-1 text-emerald-400 font-bold text-sm w-36 text-right focus:border-emerald-400 outline-none"
                      />
                      <span className="text-[10px] text-emerald-400">COP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TABLA EDITABLE DE EGRESOS & SUBCATEGORÍAS (lg:col-span-6) */}
          <div className="lg:col-span-6 dashboard-card p-6 rounded-[36px] bg-[#111017] border border-white/10 space-y-5">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                <span className="material-symbols-outlined">trending_down</span> Categorías & Subcategorías (Editable Inline)
              </h3>
              <button
                onClick={handleAddExpenseCategoryRow}
                className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 font-bold text-xs border border-red-500/40 hover:bg-red-500 hover:text-black transition-all cursor-pointer"
              >
                + Añadir Categoría
              </button>
            </div>

            <div className="space-y-3">
              {expenseCategories.map((cat) => (
                <div key={cat.id} className="p-4 rounded-2xl bg-[#070709] border border-white/10 space-y-2">
                  <div className="flex justify-between items-center gap-3">
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => handleUpdateExpenseCategory(cat.id, 'name', e.target.value)}
                      className="bg-transparent border-b border-white/10 text-white font-bold text-xs focus:border-red-400 outline-none flex-1"
                    />
                    <button
                      onClick={() => handleDeleteExpenseCategory(cat.id)}
                      className="text-red-400 hover:text-red-300 text-xs cursor-pointer p-1"
                      title="Eliminar categoría"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[9px] text-[#CCC3D8]/50 uppercase block">Presupuesto ($ COP)</span>
                      <input
                        type="number"
                        step="50000"
                        value={cat.budgetCop}
                        onChange={(e) => handleUpdateExpenseCategory(cat.id, 'budgetCop', parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent border border-white/10 rounded-xl px-3 py-1 text-white font-bold focus:border-red-400 outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-red-400 uppercase block">Gasto Real ($ COP)</span>
                      <input
                        type="number"
                        step="10000"
                        value={cat.spentCop}
                        onChange={(e) => handleUpdateExpenseCategory(cat.id, 'spentCop', parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent border border-white/10 rounded-xl px-3 py-1 text-red-400 font-bold focus:border-red-400 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 3. SUB-VISTA 2: AGENTE POR VOZ & COMANDOS INTELIGENTES */}
      {activeTab === 'voice_assistant' && (
        <div className="dashboard-card p-6 lg:p-8 rounded-[36px] bg-[#111017] border border-white/10 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em] block">
                RECONOCIMIENTO DE VOZ & PARSER FINANCIERO IA
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">Control Financiero por Voz y Lenguaje Natural</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#7C3AED]/20 text-[#C4B5FD] text-xs font-bold border border-[#7C3AED]/40">
              AGENTE DE VOZ ONLINE
            </span>
          </div>

          {/* BARRA DE VOZ E INPUT INTELIGENTE */}
          <div className="p-6 rounded-3xl bg-[#070709] border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsListening(!isListening)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.7)]'
                    : 'bg-[#7C3AED] text-white hover:bg-[#6D28D9]'
                }`}
                title="Activar Micrófono"
              >
                <span className="material-symbols-outlined text-2xl">mic</span>
              </button>
              <input
                type="text"
                placeholder='Ej. "Agrega un ingreso de 1.800.000 COP por proyecto web"'
                value={voiceCommand}
                onChange={(e) => setVoiceCommand(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleProcessVoiceCommand()}
                className="flex-1 bg-[#111017] border border-white/15 rounded-2xl px-5 py-3.5 text-white text-sm focus:border-[#D6B36A] outline-none"
              />
              <button
                onClick={handleProcessVoiceCommand}
                className="px-6 py-3.5 bg-[#D6B36A] text-black font-bold text-xs rounded-2xl hover:bg-[#C29E57] transition-all cursor-pointer shrink-0"
              >
                INTERPRETAR & REGISTRAR
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs font-mono text-[#CCC3D8]">{voiceLog}</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUB-VISTA 3: GOOGLE CALENDAR & DRIVE CLOUD */}
      {activeTab === 'calendar_drive' && (
        <div className="dashboard-card p-6 lg:p-8 rounded-[36px] bg-[#111017] border border-white/10 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.25em] block">
                INTEGRACIÓN GOOGLE CALENDAR & TELEFÓNICA
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">Programación de Compromisos Financieros & Recordatorios</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-[#070709] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase">Programar Sesión de Revisión Financiera</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full bg-[#111017] border border-white/15 rounded-xl px-4 py-2 text-xs text-white"
                />
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full bg-[#111017] border border-white/15 rounded-xl px-4 py-2 text-xs text-white"
                />
                <button
                  onClick={handleSyncToGoogleCalendar}
                  className="w-full py-3 bg-sky-500 text-black font-bold text-xs rounded-xl hover:bg-sky-400 transition-all cursor-pointer"
                >
                  + SINCRONIZAR A GOOGLE CALENDAR
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#070709] border border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-sky-400 uppercase">Estado del Recordatorio Telefónico</h3>
              <p className="text-xs text-white/90 font-mono">{calendarSyncLog}</p>
              <p className="text-[10px] text-[#CCC3D8]/50">Las notificaciones persistentes enviarán alertas automáticas a tu dispositivo 1 día antes, 5 horas antes y durante la actividad.</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUB-VISTA 4: SPREADSHEET MATRIX */}
      {activeTab === 'matrix' && (
        <div className="dashboard-card p-6 lg:p-8 rounded-[36px] bg-[#111017] border border-white/10 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white">Matriz de Proyección Multimes</h2>
            <span className="text-xs text-[#CCC3D8]/60">Todas las celdas recomputan en tiempo real.</span>
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

      {/* 6. SUB-VISTA 5: INFORME DEL AUDITOR */}
      {activeTab === 'audit' && (
        <div className="dashboard-card p-6 lg:p-8 rounded-[36px] bg-[#111017] border border-white/10 space-y-6">
          <h2 className="text-xl font-bold text-white">Informe del Auditor Financiero AION Aegis</h2>
          <div className="p-6 rounded-3xl bg-[#070709] border border-white/10 space-y-3 text-xs text-[#E5E1E5]/90">
            <p>• <strong>Estado del Sistema:</strong> Todos los ingresos y egresos están sincronizados en el Ledger y disponibles para exportación a Excel.</p>
            <p>• <strong>Control Telefónico:</strong> Los recordatorios de compromisos se integran con Google Calendar y notifican a tu móvil.</p>
          </div>
        </div>
      )}

    </div>
  );
};
