import React, { useState } from 'react';
import { AionMemoryStore } from '@aion/memory';

// ==========================================
// 1. SUEÑO & ARQUITECTURA CIRCADIANA (UN SOLO CÍRCULO UNIFICADO)
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

  // Porcentajes de fases (Un solo círculo continuo de 314px de circunferencia)
  // Total r=50 -> Circunferencia C = 2 * PI * 50 = 314.15
  // Sueño Profundo: 35% -> 110px
  // Sueño REM: 40% -> 125.6px
  // Sueño Ligero: 25% -> 78.5px

  return (
    <div className="space-y-6">
      {/* TARJETA INFOGRÁFICA DEL SUEÑO (UN SOLO CÍRCULO CON SEGMENTOS) */}
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
            EFICIENCIA CIRCADIANA 94%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* UN SOLO CÍRCULO UNIFICADO CON LOS 3 SEGMENTOS DE FASES */}
          <div className="relative flex justify-center items-center py-4">
            <svg className="w-60 h-60 transform -rotate-90" viewBox="0 0 120 120">
              {/* Círculo base de fondo */}
              <circle cx="60" cy="60" r="50" stroke="#1C1B26" strokeWidth="12" fill="transparent" />

              {/* Segmento 1: Sueño Profundo (Violeta #7C3AED) - 35% */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#7C3AED"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="110 204.15"
                strokeDashoffset="0"
                strokeLinecap="round"
              />

              {/* Segmento 2: Sueño REM (Dorado #D6B36A) - 40% */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#D6B36A"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="125.6 188.55"
                strokeDashoffset="-115"
                strokeLinecap="round"
              />

              {/* Segmento 3: Sueño Ligero (Azul Cielo #38BDF8) - 25% */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#38BDF8"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="78.5 235.65"
                strokeDashoffset="-242"
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-white">{latest.hoursInBed}h</span>
              <span className="text-[10px] text-[#C4B5FD] font-bold uppercase tracking-widest">En Cama</span>
              <span className="text-[9px] text-[#D6B36A] font-bold mt-0.5">Calidad: {latest.subjectiveQualityScore}/10</span>
            </div>
          </div>

          {/* LEYENDA EXPLICATIVA FASES DE SUEÑO */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-[#7C3AED] shadow-[0_0_10px_#7C3AED]"></span>
                <div>
                  <p className="text-xs font-bold text-white">Sueño Profundo (No-REM Fase N3)</p>
                  <p className="text-[10px] text-[#CCC3D8]/60">95 min • Reparación muscular & hormona de crecimiento</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#C4B5FD]">35%</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-[#D6B36A] shadow-[0_0_10px_#D6B36A]"></span>
                <div>
                  <p className="text-xs font-bold text-white">Sueño REM (Rapid Eye Movement)</p>
                  <p className="text-[10px] text-[#CCC3D8]/60">110 min • Consolidación de memoria & salud neuro-emocional</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#D6B36A]">40%</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-sky-400 shadow-[0_0_10px_#38BDF8]"></span>
                <div>
                  <p className="text-xs font-bold text-white">Sueño Ligero (Fases N1/N2)</p>
                  <p className="text-[10px] text-[#CCC3D8]/60">75 min • Ajuste metabólico y transición de ondas</p>
                </div>
              </div>
              <span className="text-xs font-bold text-sky-400">25%</span>
            </div>
          </div>
        </div>

        {/* GLOSARIO CONTEXTUAL DEL MÓDULO DE SUEÑO */}
        <div className="p-4 rounded-2xl bg-[#070709] border border-white/10 space-y-2">
          <h4 className="text-xs font-bold text-[#D6B36A] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">help</span> Glosario Circadiano
          </h4>
          <p className="text-[11px] text-[#CCC3D8]/80 leading-relaxed">
            • <strong>Sueño REM:</strong> Etapa donde ocurren los sueños vívidos. Crucial para la creatividad y aprendizaje.<br/>
            • <strong>Sueño Profundo:</strong> Ocurre al inicio de la noche. La presión arterial disminuye y el cuerpo sintetiza proteínas de reparación.<br/>
            • <strong>Melatonina:</strong> Hormona inducida por la oscuridad que sincroniza el reloj maestro supraquiasmático.
          </p>
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
// 2. ACTIVIDAD FÍSICA & ZONAS CARDIACAS RPE (MEJORADO CON UN SOLO CÍRCULO DE ZONAS Y GLOSARIO)
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
      {/* MÓDULO MEJORADO DE ACTIVIDAD FÍSICA */}
      <div className="dashboard-card rounded-[36px] p-6 lg:p-8 border border-[#D6B36A]/30 space-y-6 bg-[#111017]">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.25em]">
              ESTÍMULO NEUROMUSCULAR & ZONAS METABÓLICAS
            </span>
            <h2 className="text-xl lg:text-2xl font-bold text-white mt-1 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#D6B36A] text-3xl">directions_run</span>
              Análisis Fisiológico de Entrenamiento
            </h2>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-[#D6B36A]/20 text-[#D6B36A] text-xs font-bold border border-[#D6B36A]/40">
            DISPOSICIÓN FÍSICA: 90% (OPTIMO)
          </span>
        </div>

        {/* UN SOLO CÍRCULO UNIFICADO PARA ZONAS CARDIACAS Y DE ESFUERZO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="relative flex justify-center items-center py-4">
            <svg className="w-60 h-60 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" stroke="#1C1B26" strokeWidth="12" fill="transparent" />

              {/* Zona 2 Aeróbica (Esmeralda) - 50% */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#10B981"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="157 157.15"
                strokeDashoffset="0"
                strokeLinecap="round"
              />

              {/* Zona 4 Umbral Láctico (Dorado) - 30% */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#D6B36A"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="94.2 219.95"
                strokeDashoffset="-162"
                strokeLinecap="round"
              />

              {/* Zona 5 Máxima Anaeróbica (Violeta) - 20% */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#7C3AED"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="62.8 251.35"
                strokeDashoffset="-260"
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-white">{totalMin}m</span>
              <span className="text-[10px] text-[#D6B36A] font-bold uppercase tracking-widest">Minutos Hoy</span>
              <span className="text-[9px] text-[#C4B5FD] font-bold mt-0.5">RPE: {rpe}/10</span>
            </div>
          </div>

          {/* DESGLOSE INFOGRÁFICO DE ZONAS */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10B981]"></span>
                <div>
                  <p className="text-xs font-bold text-white">Zona 2 (Oxidación Grasas Base)</p>
                  <p className="text-[10px] text-[#CCC3D8]/60">60-70% FC Max • Flexibilidad mitocondrial</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400">50%</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-[#D6B36A] shadow-[0_0_10px_#D6B36A]"></span>
                <div>
                  <p className="text-xs font-bold text-white">Zona 4 (Umbral de Lactato)</p>
                  <p className="text-[10px] text-[#CCC3D8]/60">80-90% FC Max • Hipertrofia & Fuerza</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#D6B36A]">30%</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-[#7C3AED] shadow-[0_0_10px_#7C3AED]"></span>
                <div>
                  <p className="text-xs font-bold text-white">Zona 5 (Máximo VO2 Max)</p>
                  <p className="text-[10px] text-[#CCC3D8]/60">90-100% FC Max • Potencia neuromuscular</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#C4B5FD]">20%</span>
            </div>
          </div>
        </div>

        {/* GLOSARIO CONTEXTUAL DEL MÓDULO DE ACTIVIDAD FÍSICA */}
        <div className="p-4 rounded-2xl bg-[#070709] border border-white/10 space-y-2">
          <h4 className="text-xs font-bold text-[#D6B36A] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">help</span> Glosario de Fisiología Deportiva
          </h4>
          <p className="text-[11px] text-[#CCC3D8]/80 leading-relaxed">
            • <strong>RPE (Rating of Perceived Exertion):</strong> Escala Borg (1-10) que mide el esfuerzo neuromuscular percibido.<br/>
            • <strong>Zona 2:</strong> Intensidad donde los ácidos grasos son el sustrato energético primario sin acumulación masiva de lactato.<br/>
            • <strong>EPOC:</strong> Consumo excesivo de oxígeno post-ejercicio que mantiene elevado el metabolismo basal tras entrenar.
          </p>
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
// 3. HIDRATACIÓN & LIQUIDO FLUIDO
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

        <div className="h-28 w-full bg-[#070709] rounded-3xl border border-white/10 relative overflow-hidden flex items-end">
          <div
            style={{ height: `${fillPercent}%` }}
            className="w-full bg-gradient-to-t from-sky-600 to-sky-400 transition-all duration-700 opacity-80"
          ></div>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-lg">
            {fillPercent.toFixed(0)}% DEL OBJETIVO DIARIO CUMPLIDO
          </div>
        </div>

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
// 4. MEDICACIÓN & SUPLEMENTOS
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
