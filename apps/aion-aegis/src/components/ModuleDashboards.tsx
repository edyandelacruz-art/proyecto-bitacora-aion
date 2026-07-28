import React, { useState } from 'react';
import { AionMemoryStore } from '@aion/memory';

// ==========================================
// 1. SUEÑO & ARQUITECTURA CIRCADIANA (SVG ANILLO CIRCADIANO ORGANIC)
// ==========================================
export const SleepDashboard: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const sleepRecords = store.getSleepRecords() || [];
  const latest = sleepRecords[0] || { hoursInBed: 7.5, subjectiveQualityScore: 9 };

  const [hours, setHours] = useState(7.5);
  const [quality, setQuality] = useState(9);

  const handleSaveSleep = () => {
    store.addSleepRecord({
      id: `sleep_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      hoursInBed: hours,
      sleepStart: '23:00',
      sleepEnd: '06:30',
      subjectiveQualityScore: quality,
      awakeningsCount: 0,
      daytimeSleepinessScore: 2,
      nightScreensUse: false,
      source: 'USER_REPORTED',
      evidenceLevel: 'USER_CONFIRMED',
    });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* TARJETA INFOGRÁFICA HIPER-ORGÁNICA DEL SUEÑO */}
      <div className="dashboard-card rounded-[36px] p-6 lg:p-8 border border-[#7C3AED]/30 space-y-6 bg-[#111017]">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em]">
              ARQUITECTURA BIOLÓGICA CIRCADIANA
            </span>
            <h2 className="text-xl lg:text-2xl font-bold text-white mt-1 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#7C3AED] text-3xl">nights_stay</span>
              Fases de Recuperación Nocturna
            </h2>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-[#7C3AED]/20 text-[#C4B5FD] text-xs font-bold border border-[#7C3AED]/40">
            SINCRO CIRCADIANA 94%
          </span>
        </div>

        {/* VISUALIZACIÓN GRÁFICA CIRCULAR EN SVG (ANILLO DE FASES DE SUEÑO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="relative flex justify-center items-center py-4">
            <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 120 120">
              {/* Círculo base */}
              <circle cx="60" cy="60" r="50" stroke="#1F1D2B" strokeWidth="12" fill="transparent" />
              {/* Anillo Sueño Profundo (Violeta) */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#7C3AED"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="314"
                strokeDashoffset="120"
                strokeLinecap="round"
              />
              {/* Anillo Sueño REM (Dorado) */}
              <circle
                cx="60"
                cy="60"
                r="36"
                stroke="#D6B36A"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="226"
                strokeDashoffset="70"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-white">{latest.hoursInBed}h</span>
              <span className="text-[10px] text-[#C4B5FD] font-bold uppercase tracking-widest">En Cama</span>
            </div>
          </div>

          {/* LEYENDA VISUAL INFOGRÁFICA */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-[#7C3AED] shadow-[0_0_10px_#7C3AED]"></span>
                <div>
                  <p className="text-xs font-bold text-white">Sueño Profundo (Reparación Celular)</p>
                  <p className="text-[10px] text-[#CCC3D8]/60">95 min • Hormona de crecimiento activa</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#C4B5FD]">35%</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-[#D6B36A] shadow-[0_0_10px_#D6B36A]"></span>
                <div>
                  <p className="text-xs font-bold text-white">Sueño REM (Consolidación Neuro)</p>
                  <p className="text-[10px] text-[#CCC3D8]/60">110 min • Memoria & Aprendizaje</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#D6B36A]">40%</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-slate-600"></span>
                <div>
                  <p className="text-xs font-bold text-white">Sueño Ligero & Transición</p>
                  <p className="text-[10px] text-[#CCC3D8]/60">75 min • Ajuste metabólico</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400">25%</span>
            </div>
          </div>
        </div>
      </div>

      {/* FORMULARIO EDITABLE */}
      <div className="dashboard-card p-6 rounded-3xl space-y-4 bg-[#111017] border border-white/10">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-[#7C3AED]">add_circle</span>
          Registrar o Editar Noche de Sueño
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Horas Totales</label>
            <input
              type="number"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value))}
              className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-[#7C3AED] outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Calidad Subjetiva (1-10)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-[#7C3AED] outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSaveSleep}
              className="w-full py-2.5 bg-[#7C3AED] text-white font-bold text-xs rounded-xl hover:bg-[#6D28D9] transition-all shadow-lg"
            >
              ACTUALIZAR DATOS CIRCADIANOS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. ACTIVIDAD FÍSICA & ONDA CARDIACA RPE (SVG ONDA ORGÁNICA)
// ==========================================
export const ActivityDashboard: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const activities = store.getActivityRecords() || [];
  const totalMin = activities.reduce((acc, a) => acc + (a?.durationMinutes || 0), 0);

  const [type, setType] = useState<'caminata' | 'trote' | 'gimnasio' | 'movilidad' | 'deporte' | 'otro'>('gimnasio');
  const [duration, setDuration] = useState(45);
  const [rpe, setRpe] = useState(8);

  const handleSaveActivity = () => {
    store.addActivityRecord({
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString(),
      activityName: type,
      activityType: type,
      durationMinutes: duration,
      intensity: 'alta',
      rpeScore: rpe,
      estimatedKcalBurned: Math.round(duration * 7.5),
      source: 'USER_REPORTED',
      evidenceLevel: 'USER_CONFIRMED',
    });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="dashboard-card rounded-[36px] p-6 lg:p-8 border border-[#D6B36A]/30 space-y-6 bg-[#111017]">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em]">
              ESTÍMULO NEUROMUSCULAR & CARDIOLOGÍA
            </span>
            <h2 className="text-xl lg:text-2xl font-bold text-white mt-1 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#D6B36A] text-3xl">directions_run</span>
              Curva de Esfuerzo RPE & Gasto Físico
            </h2>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-[#D6B36A]/20 text-[#D6B36A] text-xs font-bold border border-[#D6B36A]/40">
            ESTÍMULO ZONA 2 / RPE {rpe}
          </span>
        </div>

        {/* GRAFICA SVG ONDA DE INTENSIDAD RPE */}
        <div className="h-44 w-full bg-[#070709] rounded-3xl p-4 border border-white/10 relative overflow-hidden flex flex-col justify-end">
          <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 500 150">
            <path
              d="M 0 120 Q 75 40, 150 90 T 300 30 T 450 100 L 500 130 L 500 150 L 0 150 Z"
              fill="url(#goldGradient)"
              opacity="0.35"
            />
            <path
              d="M 0 120 Q 75 40, 150 90 T 300 30 T 450 100 L 500 130"
              fill="none"
              stroke="#D6B36A"
              strokeWidth="4"
            />
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D6B36A" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
          <div className="relative z-10 flex justify-between text-xs font-bold text-[#CCC3D8] px-4 pb-2">
            <span>Calentamiento</span>
            <span>Pico de Fuerza (RPE {rpe})</span>
            <span>Enfriamiento</span>
          </div>
        </div>
      </div>

      {/* FORMULARIO EDITABLE */}
      <div className="dashboard-card p-6 rounded-3xl space-y-4 bg-[#111017] border border-white/10">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-[#D6B36A]">fitness_center</span>
          Registrar Sesión Física
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Tipo de Ejercicio</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
            >
              <option value="caminata">Caminata</option>
              <option value="trote">Trote</option>
              <option value="gimnasio">Gimnasio</option>
              <option value="movilidad">Movilidad</option>
              <option value="deporte">Deporte</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Duración (min)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Esfuerzo RPE (1-10)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={rpe}
              onChange={(e) => setRpe(parseInt(e.target.value))}
              className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSaveActivity}
              className="w-full py-2.5 bg-[#D6B36A] text-black font-bold text-xs rounded-xl hover:bg-[#C29E57] transition-all"
            >
              REGISTRAR ACTIVIDAD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. HIDRATACIÓN & LIQUIDO FLUIDO SVG
// ==========================================
export const HydrationDashboard: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const hydration = store.getHydrationRecords() || [];
  const currentWater = hydration.reduce((acc, h) => acc + (h?.amountMl || 0), 0);
  const goal = 2500;
  const fillPercent = Math.min((currentWater / goal) * 100, 100);

  const handleAddWater = (ml: number) => {
    store.addHydrationRecord({
      id: `hyd_${Date.now()}`,
      timestamp: new Date().toISOString(),
      amountMl: ml,
      fluidType: 'agua',
      dailyAccumulatedMl: currentWater + ml,
      dailyGoalMl: goal,
      evidenceLevel: 'USER_CONFIRMED',
    });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="dashboard-card rounded-[36px] p-6 lg:p-8 border border-sky-500/30 space-y-6 bg-[#111017]">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.25em]">
              BALANCE HÍDRICO & ELECTROLITOS
            </span>
            <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-3">
              <span className="material-symbols-outlined text-sky-400 text-3xl">water_drop</span>
              Volumen Celular & Hidratación
            </h2>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold border border-sky-500/40">
            {currentWater} / {goal} ML
          </span>
        </div>

        {/* TANQUE HÍDRICO INTERACTIVO */}
        <div className="h-28 w-full bg-[#070709] rounded-3xl border border-white/10 relative overflow-hidden flex items-end">
          <div
            style={{ height: `${fillPercent}%` }}
            className="w-full bg-gradient-to-t from-sky-600 to-sky-400 transition-all duration-700 opacity-80"
          ></div>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-lg">
            {fillPercent.toFixed(0)}% DEL OBJETIVO DIARIO CUMPLIDO
          </div>
        </div>

        {/* BOTONES RÁPIDOS DE ADICIÓN */}
        <div className="flex gap-4">
          {[250, 500, 750, 1000].map((ml) => (
            <button
              key={ml}
              onClick={() => handleAddWater(ml)}
              className="flex-1 py-3 bg-[#7C3AED]/15 border border-[#7C3AED]/40 text-[#C4B5FD] font-bold rounded-2xl hover:bg-[#7C3AED] hover:text-white transition-all text-xs"
            >
              + {ml} ml
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. MEDICACIÓN & SUPLEMENTOS EDITABLES CON TOGGLES INTERACTIVOS
// ==========================================
export const MedicationDashboard: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const [meds, setMeds] = useState([
    { id: '1', name: 'Multivitamínico Completo', dose: '1 Cápsula', taken: true },
    { id: '2', name: 'Citrato de Magnesio', dose: '400 mg', taken: true },
    { id: '3', name: 'Omega 3 Triglicéridos', dose: '2000 mg', taken: false },
    { id: '4', name: 'Vitamina D3 + K2', dose: '5000 UI', taken: false },
  ]);

  const toggleMed = (id: string) => {
    setMeds((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = !m.taken;
          store.addMedicationRecord({
            id: `med_${Date.now()}`,
            timestamp: new Date().toISOString(),
            name: m.name,
            dose: m.dose,
            reason: 'Suplementación Diaria',
            taken: updated,
            prescribedByDoctor: false,
            reminderEnabled: true,
            evidenceLevel: 'USER_CONFIRMED',
          });
          return { ...m, taken: updated };
        }
        return m;
      })
    );
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="dashboard-card rounded-[36px] p-6 lg:p-8 border border-emerald-500/30 space-y-6 bg-[#111017]">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.25em]">
              FARMACOLOGÍA & SUPLEMENTACIÓN
            </span>
            <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-400 text-3xl">medication</span>
              Control Interactivo de Tomas
            </h2>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
            {meds.filter((m) => m.taken).length} / {meds.length} COMPLETED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meds.map((med) => (
            <div
              key={med.id}
              onClick={() => toggleMed(med.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex justify-between items-center ${
                med.taken
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                  : 'bg-white/5 border-white/10 text-[#CCC3D8]/60 hover:border-white/20'
              }`}
            >
              <div>
                <h4 className="text-sm font-bold text-white">{med.name}</h4>
                <p className="text-xs text-[#CCC3D8]/60">{med.dose}</p>
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  med.taken
                    ? 'bg-emerald-500 border-emerald-400 text-black'
                    : 'border-white/20 text-transparent'
                }`}
              >
                ✓
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const StateDashboard: React.FC<{ onRefresh: () => void }> = () => (
  <div className="p-6 bg-[#111017] rounded-3xl border border-white/5 space-y-3">
    <h3 className="text-lg font-bold text-white flex items-center gap-2">
      <span className="material-symbols-outlined text-[#7C3AED]">psychology</span> Energía, Ánimo & Foco
    </h3>
    <p className="text-xs text-[#CCC3D8]/60">Estado bioenergético registrado: Enfoque Alto, Ánimo Estable.</p>
  </div>
);

export const SymptomsDashboard: React.FC<{ onRefresh: () => void }> = () => (
  <div className="p-6 bg-[#111017] rounded-3xl border border-white/5 space-y-3">
    <h3 className="text-lg font-bold text-white flex items-center gap-2">
      <span className="material-symbols-outlined text-red-400">medical_services</span> Dolor & Síntomas
    </h3>
    <p className="text-xs text-[#CCC3D8]/60">Sin eventos agudos reportados en las últimas 24 horas.</p>
  </div>
);

export const BodyDashboard: React.FC<{ onRefresh: () => void }> = () => (
  <div className="p-6 bg-[#111017] rounded-3xl border border-white/5 space-y-3">
    <h3 className="text-lg font-bold text-white flex items-center gap-2">
      <span className="material-symbols-outlined text-[#7C3AED]">straighten</span> Antropometría & Peso
    </h3>
    <p className="text-xs text-[#CCC3D8]">Peso Actual: <strong>81.5 kg</strong> • Altura: <strong>178 cm</strong></p>
  </div>
);

export const HabitsDashboard: React.FC<{ onRefresh: () => void }> = () => (
  <div className="p-6 bg-[#111017] rounded-3xl border border-white/5 space-y-3">
    <h3 className="text-lg font-bold text-white flex items-center gap-2">
      <span className="material-symbols-outlined text-[#D6B36A]">published_with_changes</span> Rutinas & Hábitos
    </h3>
    <p className="text-xs text-[#CCC3D8]/60">Racha activa: 14 días consecutivos de bitácora registrada.</p>
  </div>
);
