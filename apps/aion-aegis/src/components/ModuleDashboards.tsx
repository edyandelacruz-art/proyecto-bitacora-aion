import React, { useState } from 'react';
import { AionMemoryStore } from '@aion/memory';
import {
  SleepRecord,
  ActivityRecord,
  HydrationRecord,
  StateRecord,
  MedicationRecord,
  SymptomRecord,
  BodyMeasurementRecord,
  HabitRecord,
} from '@aion/shared-types';

export interface ModuleDashboardProps {
  onRefresh: () => void;
}

// ----------------------------------------------------------------------
// 1. DASHBOARD DE SUEÑO & RECUPERACIÓN
// ----------------------------------------------------------------------
export const SleepDashboard: React.FC<ModuleDashboardProps> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const records = store.getSleepRecords();

  const [hours, setHours] = useState('7.5');
  const [quality, setQuality] = useState(8);
  const [sleepiness, setSleepiness] = useState(3);
  const [screens, setScreens] = useState(false);

  const handleAdd = () => {
    const rec: SleepRecord = {
      id: `sleep-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      sleepStart: '23:00',
      sleepEnd: '06:30',
      hoursInBed: parseFloat(hours) || 7.5,
      subjectiveQualityScore: quality,
      awakeningsCount: 1,
      daytimeSleepinessScore: sleepiness,
      nightScreensUse: screens,
      source: 'USER_REPORTED',
      evidenceLevel: 'USER_CONFIRMED',
    };
    store.addSleepRecord(rec);
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="aion-card" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(17,16,23,0.95) 100%)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>😴 Sueño & Recuperación Circadiana</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--aion-sand)', margin: '0.2rem 0 0.8rem 0' }}>
          Monitorea horas en cama, despertares, higiene del sueño y recuperación del Sistema Nervioso Central.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.8rem' }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--aion-lavender)', fontWeight: 700 }}>Horas Dormidas:</label>
            <input className="aion-input" value={hours} onChange={(e) => setHours(e.target.value)} type="number" step="0.5" />
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--aion-lavender)', fontWeight: 700 }}>Calidad (1-10):</label>
            <input className="aion-input" value={quality} onChange={(e) => setQuality(parseInt(e.target.value, 10))} type="number" min="1" max="10" />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={screens} onChange={(e) => setScreens(e.target.checked)} />
            Pantallas antes de dormir
          </label>
          <button className="aion-btn-primary" style={{ width: 'auto', padding: '0.4rem 1rem' }} onClick={handleAdd}>
            + Registrar Sueño
          </button>
        </div>
      </div>

      <div className="aion-card">
        <h3 style={{ fontSize: '0.9rem', color: 'var(--aion-lavender)', marginBottom: '0.6rem' }}>HISTORIAL DE SUEÑO</h3>
        {records.length === 0 ? (
          <span style={{ fontSize: '0.78rem', color: 'var(--aion-sand)' }}>No hay registros de sueño. Agrega tu primer descanso arriba.</span>
        ) : (
          records.map((r) => (
            <div key={r.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.6rem', borderRadius: '8px', marginBottom: '0.4rem', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{r.date}</strong>: {r.hoursInBed}h (Calidad {r.subjectiveQualityScore}/10)
                <div style={{ fontSize: '0.68rem', color: 'var(--aion-neutral)' }}>Pantallas: {r.nightScreensUse ? 'SÍ' : 'NO'} • Fuente: {r.evidenceLevel}</div>
              </div>
              <span className="badge badge-available">OK</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 2. DASHBOARD DE ACTIVIDAD & EJERCICIO
// ----------------------------------------------------------------------
export const ActivityDashboard: React.FC<ModuleDashboardProps> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const records = store.getActivityRecords();

  const [name, setName] = useState('Caminata rápida');
  const [minutes, setMinutes] = useState('40');
  const [rpe, setRpe] = useState(6);

  const handleAdd = () => {
    const rec: ActivityRecord = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      activityName: name,
      activityType: 'caminata',
      durationMinutes: parseInt(minutes, 10) || 30,
      intensity: rpe > 7 ? 'alta' : 'moderada',
      rpeScore: rpe,
      estimatedKcalBurned: (parseInt(minutes, 10) || 30) * 6,
      source: 'USER_REPORTED',
      evidenceLevel: 'USER_CONFIRMED',
    };
    store.addActivityRecord(rec);
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="aion-card" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(17,16,23,0.95) 100%)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>🏃 Actividad, Ejercicio & RPE</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--aion-sand)', margin: '0.2rem 0 0.8rem 0' }}>
          Registra actividades físicas, esfuerzo percibido RPE (1-10) y gasto calórico estimado.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.8rem' }}>
          <input className="aion-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Trote, pesas" />
          <input className="aion-input" value={minutes} onChange={(e) => setMinutes(e.target.value)} type="number" placeholder="Minutos" />
          <input className="aion-input" value={rpe} onChange={(e) => setRpe(parseInt(e.target.value, 10))} type="number" min="1" max="10" placeholder="RPE 1-10" />
        </div>

        <button className="aion-btn-primary" onClick={handleAdd}>
          + Registrar Actividad
        </button>
      </div>

      <div className="aion-card">
        <h3 style={{ fontSize: '0.9rem', color: 'var(--aion-lavender)', marginBottom: '0.6rem' }}>ACTIVIDADES RECIENTES</h3>
        {records.map((a) => (
          <div key={a.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.6rem', borderRadius: '8px', marginBottom: '0.4rem', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>{a.activityName}</strong> ({a.durationMinutes} min) - RPE {a.rpeScore}/10
              <div style={{ fontSize: '0.68rem', color: 'var(--aion-neutral)' }}>Gasto est: ≈{a.estimatedKcalBurned} kcal</div>
            </div>
            <span className="badge badge-available">+{a.estimatedKcalBurned} kcal</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 3. DASHBOARD DE HIDRATACIÓN
// ----------------------------------------------------------------------
export const HydrationDashboard: React.FC<ModuleDashboardProps> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const records = store.getHydrationRecords();
  const currentTotal = records.reduce((acc, r) => acc + r.amountMl, 0);

  const handleAddWater = (ml: number) => {
    const rec: HydrationRecord = {
      id: `hyd-${Date.now()}`,
      timestamp: new Date().toISOString(),
      amountMl: ml,
      fluidType: 'agua',
      dailyAccumulatedMl: currentTotal + ml,
      dailyGoalMl: 2500,
      evidenceLevel: 'USER_CONFIRMED',
    };
    store.addHydrationRecord(rec);
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="aion-card" style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(17,16,23,0.95) 100%)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>💧 Hidratación Diaria</h2>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38BDF8', margin: '0.4rem 0' }}>
          {currentTotal} / 2,500 ml
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[250, 500, 750].map((ml) => (
            <button key={ml} className="aion-btn-secondary" onClick={() => handleAddWater(ml)}>
              + {ml} ml
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 4. DASHBOARD DE ENERGÍA, ÁNIMO, HAMBRE & FOCO
// ----------------------------------------------------------------------
export const StateDashboard: React.FC<ModuleDashboardProps> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const records = store.getStateRecords();

  const [energy, setEnergy] = useState(7);
  const [hunger, setHunger] = useState(4);
  const [focus, setFocus] = useState(8);

  const handleAdd = () => {
    const rec: StateRecord = {
      id: `st-${Date.now()}`,
      timestamp: new Date().toISOString(),
      energyScore: energy,
      moodScore: 8,
      hungerScore: hunger,
      anxietyScore: 2,
      focusScore: focus,
      irritabilityScore: 1,
      mentalLoadScore: 3,
      evidenceLevel: 'USER_CONFIRMED',
    };
    store.addStateRecord(rec);
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="aion-card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>⚡ Energía, Ánimo & Foco Cognitivo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', margin: '0.8rem 0' }}>
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--aion-sand)' }}>Energía (1-10)</label>
            <input className="aion-input" value={energy} onChange={(e) => setEnergy(parseInt(e.target.value, 10))} type="number" min="1" max="10" />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--aion-sand)' }}>Hambre (1-10)</label>
            <input className="aion-input" value={hunger} onChange={(e) => setHunger(parseInt(e.target.value, 10))} type="number" min="1" max="10" />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--aion-sand)' }}>Foco (1-10)</label>
            <input className="aion-input" value={focus} onChange={(e) => setFocus(parseInt(e.target.value, 10))} type="number" min="1" max="10" />
          </div>
        </div>
        <button className="aion-btn-primary" onClick={handleAdd}>+ Registrar Estado</button>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 5. DASHBOARD DE MEDICACIÓN & SUPLEMENTOS
// ----------------------------------------------------------------------
export const MedicationDashboard: React.FC<ModuleDashboardProps> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const records = store.getMedicationRecords();

  const [name, setName] = useState('Omega 3 / Vitamina D3');
  const [dose, setDose] = useState('1 cápsula');

  const handleAdd = () => {
    const rec: MedicationRecord = {
      id: `med-${Date.now()}`,
      timestamp: new Date().toISOString(),
      name,
      dose,
      reason: 'Salud cardiovascular y suplementación',
      taken: true,
      prescribedByDoctor: false,
      reminderEnabled: true,
      evidenceLevel: 'USER_CONFIRMED',
    };
    store.addMedicationRecord(rec);
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="aion-card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>💊 Medicación & Suplementos</h2>
        <div style={{ display: 'flex', gap: '0.5rem', margin: '0.8rem 0' }}>
          <input className="aion-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Suplemento / Medicamento" />
          <input className="aion-input" value={dose} onChange={(e) => setDose(e.target.value)} placeholder="Dosis" />
        </div>
        <button className="aion-btn-primary" onClick={handleAdd}>+ Marcar Tomado</button>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 6. DASHBOARD DE DOLOR & SÍNTOMAS
// ----------------------------------------------------------------------
export const SymptomsDashboard: React.FC<ModuleDashboardProps> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const records = store.getSymptomRecords();

  const [zone, setZone] = useState('Espalda baja');
  const [intensity, setIntensity] = useState(3);

  const handleAdd = () => {
    const rec: SymptomRecord = {
      id: `sym-${Date.now()}`,
      timestamp: new Date().toISOString(),
      bodyZone: zone,
      intensityScore: intensity,
      painType: 'sordo',
      isRedFlagAlert: intensity >= 8,
      evidenceLevel: 'USER_CONFIRMED',
    };
    store.addSymptomRecord(rec);
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="aion-card" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(17,16,23,0.95) 100%)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>🩺 Dolor & Síntomas Corporales</h2>
        <div style={{ display: 'flex', gap: '0.5rem', margin: '0.8rem 0' }}>
          <input className="aion-input" value={zone} onChange={(e) => setZone(e.target.value)} placeholder="Zona (ej. Espalda)" />
          <input className="aion-input" value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value, 10))} type="number" min="0" max="10" placeholder="0-10" />
        </div>
        <button className="aion-btn-primary" onClick={handleAdd}>+ Registrar Síntoma</button>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 7. DASHBOARD DE PESO & CUERPO
// ----------------------------------------------------------------------
export const BodyDashboard: React.FC<ModuleDashboardProps> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const records = store.getBodyRecords();

  const [weight, setWeight] = useState('74.5');
  const [waist, setWaist] = useState('82');

  const handleAdd = () => {
    const w = parseFloat(weight) || 74.5;
    const rec: BodyMeasurementRecord = {
      id: `body-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      weightKg: w,
      waistCm: parseFloat(waist) || 82,
      bmiCalculated: Math.round((w / (1.75 * 1.75)) * 10) / 10,
      source: 'USER_REPORTED',
      evidenceLevel: 'USER_CONFIRMED',
    };
    store.addBodyRecord(rec);
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="aion-card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>📐 Peso, Medidas & Composición</h2>
        <div style={{ display: 'flex', gap: '0.5rem', margin: '0.8rem 0' }}>
          <input className="aion-input" value={weight} onChange={(e) => setWeight(e.target.value)} type="number" placeholder="Peso (kg)" />
          <input className="aion-input" value={waist} onChange={(e) => setWaist(e.target.value)} type="number" placeholder="Cintura (cm)" />
        </div>
        <button className="aion-btn-primary" onClick={handleAdd}>+ Registrar Medición</button>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 8. DASHBOARD DE HÁBITOS & RUTINAS
// ----------------------------------------------------------------------
export const HabitsDashboard: React.FC<ModuleDashboardProps> = ({ onRefresh }) => {
  const store = AionMemoryStore.getInstance();
  const records = store.getHabitRecords();

  const handleAdd = () => {
    const rec: HabitRecord = {
      id: `hab-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      waterTargetMet: true,
      mobilitySessionDone: true,
      homeCookedMealsCount: 2,
      fastingFulfilled: true,
      petWalkDone: true,
      nightScreenCurfewMet: false,
      overallAdherenceScore: 90,
      evidenceLevel: 'USER_CONFIRMED',
    };
    store.addHabitRecord(rec);
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="aion-card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>🔄 Hábitos & Adherencia a Rutinas</h2>
        <button className="aion-btn-primary" style={{ marginTop: '0.8rem' }} onClick={handleAdd}>
          ✓ Confirmar Hábitos de Hoy
        </button>
      </div>
    </div>
  );
};
