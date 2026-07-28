import React, { useState } from 'react';
import { AionMemoryStore } from '@aion/memory';

// ==========================================
// 1. SUEÑO & RECUPERACIÓN DASHBOARD 1:1 STITCH
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
      <div className="flex justify-between items-center bg-[#111017] p-6 rounded-3xl border border-white/5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#7C3AED] text-3xl">nights_stay</span>
          <div>
            <h2 className="text-xl font-bold text-white">Sueño & Arquitectura del Descanso</h2>
            <p className="text-xs text-[#CCC3D8]/60">Monitoreo circadiano y eficiencia de recuperación</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#7C3AED]/15 text-[#C4B5FD] text-xs font-bold border border-[#7C3AED]/30">
          EFICIENCIA 92%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-surface p-5 rounded-2xl space-y-1">
          <p className="text-[10px] font-bold text-[#CCC3D8]/40 uppercase tracking-widest">Horas en Cama</p>
          <p className="text-2xl font-bold text-white">{latest.hoursInBed} <span className="text-xs font-normal opacity-60">h</span></p>
          <p className="text-[10px] text-emerald-400 font-bold">Duración Óptima</p>
        </div>

        <div className="glass-surface p-5 rounded-2xl space-y-1">
          <p className="text-[10px] font-bold text-[#CCC3D8]/40 uppercase tracking-widest">Calidad Subjetiva</p>
          <p className="text-2xl font-bold text-[#D6B36A]">{latest.subjectiveQualityScore} <span className="text-xs font-normal opacity-60">/10</span></p>
          <p className="text-[10px] text-[#D6B36A] font-bold">Sensación Renovada</p>
        </div>

        <div className="glass-surface p-5 rounded-2xl space-y-1">
          <p className="text-[10px] font-bold text-[#CCC3D8]/40 uppercase tracking-widest">Fase REM Estimada</p>
          <p className="text-2xl font-bold text-white">110 <span className="text-xs font-normal opacity-60">min</span></p>
          <p className="text-[10px] text-[#C4B5FD] font-bold">Consolidación Memoria</p>
        </div>

        <div className="glass-surface p-5 rounded-2xl space-y-1">
          <p className="text-[10px] font-bold text-[#CCC3D8]/40 uppercase tracking-widest">Sueño Profundo</p>
          <p className="text-2xl font-bold text-white">95 <span className="text-xs font-normal opacity-60">min</span></p>
          <p className="text-[10px] text-emerald-400 font-bold">Reparación Celular</p>
        </div>
      </div>

      <div className="dashboard-card p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-[#7C3AED]">add_circle</span>
          Registrar Noche de Sueño
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Horas Totales</label>
            <input
              type="number"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value))}
              className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-[#7C3AED]"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Calidad (1-10)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-[#7C3AED]"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSaveSleep}
              className="w-full py-2.5 bg-[#7C3AED] text-white font-bold text-xs rounded-xl hover:bg-[#6D28D9] transition-all"
            >
              GUARDAR REGISTRO EN MEMORIA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. ACTIVIDAD & EJERCICIO DASHBOARD
// ==========================================
export const ActivityDashboard: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const activities = store.getActivityRecords() || [];
  const totalMin = activities.reduce((acc, a) => acc + (a?.durationMinutes || 0), 0);

  const [type, setType] = useState<'caminata' | 'trote' | 'gimnasio' | 'movilidad' | 'deporte' | 'otro'>('caminata');
  const [duration, setDuration] = useState(45);
  const [rpe, setRpe] = useState(7);

  const handleSaveActivity = () => {
    store.addActivityRecord({
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString(),
      activityName: type,
      activityType: type,
      durationMinutes: duration,
      intensity: 'moderada',
      rpeScore: rpe,
      estimatedKcalBurned: Math.round(duration * 6.5),
      source: 'USER_REPORTED',
      evidenceLevel: 'USER_CONFIRMED',
    });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#111017] p-6 rounded-3xl border border-white/5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#D6B36A] text-3xl">directions_run</span>
          <div>
            <h2 className="text-xl font-bold text-white">Actividad & Esfuerzo Físico</h2>
            <p className="text-xs text-[#CCC3D8]/60">Monitoreo de RPE, gasto calórico y estímulo muscular</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#D6B36A]/15 text-[#D6B36A] text-xs font-bold border border-[#D6B36A]/30">
          {totalMin} MIN HOY
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-surface p-5 rounded-2xl space-y-1">
          <p className="text-[10px] font-bold text-[#CCC3D8]/40 uppercase tracking-widest">Minutos de Ejercicio</p>
          <p className="text-2xl font-bold text-white">{totalMin} <span className="text-xs font-normal opacity-60">min</span></p>
          <p className="text-[10px] text-emerald-400 font-bold">Estímulo Saludable</p>
        </div>

        <div className="glass-surface p-5 rounded-2xl space-y-1">
          <p className="text-[10px] font-bold text-[#CCC3D8]/40 uppercase tracking-widest">Esfuerzo RPE Promedio</p>
          <p className="text-2xl font-bold text-[#D6B36A]">7.5 <span className="text-xs font-normal opacity-60">/10</span></p>
          <p className="text-[10px] text-[#D6B36A] font-bold">Zona 2 / Aeróbico</p>
        </div>

        <div className="glass-surface p-5 rounded-2xl space-y-1">
          <p className="text-[10px] font-bold text-[#CCC3D8]/40 uppercase tracking-widest">Gasto Estimado</p>
          <p className="text-2xl font-bold text-white">≈{Math.round(totalMin * 6.5)} <span className="text-xs font-normal opacity-60">kcal</span></p>
          <p className="text-[10px] text-[#C4B5FD] font-bold">Deficit Asistido</p>
        </div>
      </div>

      <div className="dashboard-card p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-[#D6B36A]">fitness_center</span>
          Registrar Sesión de Ejercicio
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Tipo</label>
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
// 3. HIDRATACIÓN DASHBOARD
// ==========================================
export const HydrationDashboard: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const hydration = store.getHydrationRecords() || [];
  const currentWater = hydration.reduce((acc, h) => acc + (h?.amountMl || 0), 0);

  const handleAddWater = (ml: number) => {
    store.addHydrationRecord({
      id: `hyd_${Date.now()}`,
      timestamp: new Date().toISOString(),
      amountMl: ml,
      fluidType: 'agua',
      dailyAccumulatedMl: currentWater + ml,
      dailyGoalMl: 2500,
      evidenceLevel: 'USER_CONFIRMED',
    });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#111017] p-6 rounded-3xl border border-white/5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-sky-400 text-3xl">water_drop</span>
          <div>
            <h2 className="text-xl font-bold text-white">Hidratación & Balance Hídrico</h2>
            <p className="text-xs text-[#CCC3D8]/60">Monitoreo de volumen de agua e ingesta de electrolitos</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-sky-400/15 text-sky-400 text-xs font-bold border border-sky-400/30">
          {currentWater} / 2500 ML
        </span>
      </div>

      <div className="dashboard-card p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-white">Añadir Ingesta de Agua Rápida</h3>
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

export const StateDashboard: React.FC<{ onRefresh: () => void }> = () => (
  <div className="p-6 bg-[#111017] rounded-3xl border border-white/5 space-y-3">
    <h3 className="text-lg font-bold text-white flex items-center gap-2">
      <span className="material-symbols-outlined text-[#7C3AED]">psychology</span> Energía, Ánimo & Foco
    </h3>
    <p className="text-xs text-[#CCC3D8]/60">Estado bioenergético registrado: Enfoque Alto, Ánimo Estable.</p>
  </div>
);

export const MedicationDashboard: React.FC<{ onRefresh: () => void }> = () => (
  <div className="p-6 bg-[#111017] rounded-3xl border border-white/5 space-y-3">
    <h3 className="text-lg font-bold text-white flex items-center gap-2">
      <span className="material-symbols-outlined text-[#D6B36A]">medication</span> Medicación & Suplementación
    </h3>
    <p className="text-xs text-[#CCC3D8]/60">Multivitamínico, Magnesio y Omega 3 registrados al día.</p>
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
