import React, { useState } from 'react';
import { AionMemoryStore } from '@aion/memory';
import { AionUserProfile, AegisProfile } from '@aion/shared-types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const memoryStore = AionMemoryStore.getInstance();
  const currentCore = memoryStore.getCoreProfile();
  const currentAegis = memoryStore.getAegisProfile();

  const [activeTab, setActiveTab] = useState<'biometrics' | 'goals' | 'dietary' | 'integrations'>('biometrics');

  // Estados Core & Biométricos
  const [displayName, setDisplayName] = useState(currentCore.displayName || 'Edyan De La Cruz');
  const [country, setCountry] = useState(currentCore.country || 'Colombia');
  const [city, setCity] = useState(currentCore.city || 'Bogotá');
  const [timezone, setTimezone] = useState(currentCore.timezone || 'America/Bogota');
  const [weightKg, setWeightKg] = useState<number>(currentAegis.optionalBodyMetrics?.weightKg || 81.5);
  const [heightCm, setHeightCm] = useState<number>(currentAegis.optionalBodyMetrics?.heightCm || 178);
  const [age, setAge] = useState<number>(currentAegis.optionalBodyMetrics?.age || 28);
  const [sex, setSex] = useState<'M' | 'F' | 'other'>(currentAegis.optionalBodyMetrics?.sex || 'M');

  // Estados de Metas Bioquímicas
  const [goalType, setGoalType] = useState<'deficit' | 'maintenance' | 'surplus' | 'health'>('deficit');
  const [targetKcal, setTargetKcal] = useState<number>(currentAegis.goals?.[0]?.targetKcal || 2100);
  const [targetProtein, setTargetProtein] = useState<number>(currentAegis.goals?.[0]?.targetProteinG || 160);
  const [targetCarbs, setTargetCarbs] = useState<number>(180);
  const [targetFats, setTargetFats] = useState<number>(65);
  const [targetWaterMl, setTargetWaterMl] = useState<number>(2500);

  // Estados Preferencias Alimentarias
  const [prepTime, setPrepTime] = useState<number>(currentAegis.typicalPrepTimeMinutes || 20);
  const [allergies, setAllergies] = useState<string>(currentAegis.allergies?.join(', ') || 'Ninguna');
  const [intolerances, setIntolerances] = useState<string>(currentAegis.intolerances?.join(', ') || 'Lactosa leve');
  const [preferredFoods, setPreferredFoods] = useState<string>(currentAegis.preferredFoods?.join(', ') || 'Pollo, Arroz, Huevos, Aguacate, Atún, Avena');
  const [dislikedFoods, setDislikedFoods] = useState<string>(currentAegis.dislikedFoods?.join(', ') || 'Hígado, Mariscos crudos');

  // Integraciones
  const [driveEmail, setDriveEmail] = useState<string>('edyan.aegis@drive.aion');
  const [autoSync, setAutoSync] = useState<boolean>(true);

  const handleSaveAll = () => {
    const coreUpdates: Partial<AionUserProfile> = {
      displayName: displayName.trim() || 'Usuario AION',
      country,
      city,
      timezone,
      unitSystem: 'metric',
    };

    const aegisUpdates: Partial<AegisProfile> = {
      goals: [{ type: goalType, targetKcal, targetProteinG: targetProtein }],
      typicalPrepTimeMinutes: prepTime,
      allergies: allergies.split(',').map((s) => s.trim()).filter(Boolean),
      intolerances: intolerances.split(',').map((s) => s.trim()).filter(Boolean),
      preferredFoods: preferredFoods.split(',').map((s) => s.trim()).filter(Boolean),
      dislikedFoods: dislikedFoods.split(',').map((s) => s.trim()).filter(Boolean),
      optionalBodyMetrics: { weightKg, heightCm, age, sex },
    };

    memoryStore.updateCoreProfile(coreUpdates);
    memoryStore.updateAegisProfile(aegisUpdates);

    // Guardar hecho en la memoria de AION
    memoryStore.addFact({
      key: 'user_profile_configured',
      value: { core: coreUpdates, aegis: aegisUpdates, targets: { targetKcal, targetProtein, targetCarbs, targetFats, targetWaterMl } },
      evidence: 'USER_CONFIRMED',
      source: 'user',
      createdAt: new Date().toISOString(),
      scope: 'core',
      userEditable: true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      {/* VENTANA EMERGENTE SÓLIDA 1:1 ORGANIC INTELLIGENCE STITCH */}
      <div className="bg-[#111017] border-2 border-[#7C3AED] rounded-[36px] w-full max-w-4xl max-h-[92vh] shadow-[0_0_70px_rgba(124,58,237,0.35)] flex flex-col overflow-hidden">
        
        {/* HEADER MODAL */}
        <div className="p-6 lg:p-8 bg-[#070709] border-b border-white/10 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.3em]">
              PROTESIS EJECUTIVA • CONFIGURACIÓN SOBERANA DE EDYAN
            </span>
            <h2 className="text-2xl font-bold text-white mt-1 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#7C3AED] text-3xl">tune</span>
              Perfil del Usuario & Metas Bioquímicas
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

        {/* TABS NAVEGABLES DENTRO DEL MODAL */}
        <div className="flex border-b border-white/10 bg-[#070709]/50 px-6 gap-2 overflow-x-auto hide-scrollbar">
          {[
            { id: 'biometrics', label: '1. Datos & Biometría', icon: 'person' },
            { id: 'goals', label: '2. Metas Bioquímicas', icon: 'target' },
            { id: 'dietary', label: '3. Nutrición & Restricciones', icon: 'restaurant' },
            { id: 'integrations', label: '4. Respaldo & Drive', icon: 'cloud_sync' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? 'border-[#7C3AED] text-[#C4B5FD] bg-[#7C3AED]/10'
                  : 'border-transparent text-[#CCC3D8]/60 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* BODY DEL MODAL */}
        <div className="p-6 lg:p-8 flex-1 overflow-y-auto hide-scrollbar space-y-6">
          
          {/* TAB 1: BIOMETRÍA */}
          {activeTab === 'biometrics' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7C3AED]">badge</span>
                Identidad & Antropometría
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#7C3AED] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Ubicación / Ciudad</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#7C3AED] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Peso Actual (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                    className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#7C3AED] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Altura (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseInt(e.target.value))}
                    className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#7C3AED] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Edad (Años)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#7C3AED] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Sexo Biológico</label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value as any)}
                    className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#7C3AED] outline-none"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: METAS BIOQUÍMICAS */}
          {activeTab === 'goals' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[#D6B36A]">flag</span>
                Metas Metabólicas & Distribución de Macronutrientes
              </h3>

              <div>
                <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Estrategia Metabólica Principal</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: 'deficit', label: 'Déficit Calórico' },
                    { id: 'maintenance', label: 'Mantenimiento' },
                    { id: 'surplus', label: 'Superávit Magro' },
                    { id: 'health', label: 'Recomposición' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoalType(g.id as any)}
                      className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all ${
                        goalType === g.id
                          ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-lg'
                          : 'bg-[#070709] text-[#CCC3D8]/70 border-white/10 hover:text-white'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Meta Calórica Diaria (kcal)</label>
                  <input
                    type="number"
                    value={targetKcal}
                    onChange={(e) => setTargetKcal(parseInt(e.target.value))}
                    className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#7C3AED] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Meta Proteína (gramos)</label>
                  <input
                    type="number"
                    value={targetProtein}
                    onChange={(e) => setTargetProtein(parseInt(e.target.value))}
                    className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#7C3AED] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Meta Carbohidratos (gramos)</label>
                  <input
                    type="number"
                    value={targetCarbs}
                    onChange={(e) => setTargetCarbs(parseInt(e.target.value))}
                    className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#7C3AED] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Meta Grasas Saludables (gramos)</label>
                  <input
                    type="number"
                    value={targetFats}
                    onChange={(e) => setTargetFats(parseInt(e.target.value))}
                    className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#7C3AED] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Meta Hidratación (ml/día)</label>
                  <input
                    type="number"
                    step="100"
                    value={targetWaterMl}
                    onChange={(e) => setTargetWaterMl(parseInt(e.target.value))}
                    className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#7C3AED] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PREFERENCIAS ALIMENTARIAS */}
          {activeTab === 'dietary' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400">restaurant_menu</span>
                Filtros Nutricionales & Hábitos
              </h3>

              <div>
                <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Alimentos Favoritos (separados por coma)</label>
                <input
                  type="text"
                  value={preferredFoods}
                  onChange={(e) => setPreferredFoods(e.target.value)}
                  className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#7C3AED] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Alimentos Rechazados</label>
                <input
                  type="text"
                  value={dislikedFoods}
                  onChange={(e) => setDislikedFoods(e.target.value)}
                  className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#7C3AED] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Alergias Conocidas</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#7C3AED] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Intolerancias</label>
                  <input
                    type="text"
                    value={intolerances}
                    onChange={(e) => setIntolerances(e.target.value)}
                    className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#7C3AED] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RESPALDO & INTEGRACIONES */}
          {activeTab === 'integrations' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-sky-400">cloud</span>
                Google Drive & Trazabilidad
              </h3>

              <div>
                <label className="text-[11px] font-bold text-[#CCC3D8]/60 uppercase block mb-1">Cuenta de Google Drive para Backup</label>
                <input
                  type="email"
                  value={driveEmail}
                  onChange={(e) => setDriveEmail(e.target.value)}
                  className="w-full bg-[#070709] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#7C3AED] outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Sincronización Automática Diaria</p>
                  <p className="text-[10px] text-[#CCC3D8]/60">Sincroniza el libro Excel XLSX en tu Drive privado a medianoche.</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="w-5 h-5 accent-[#7C3AED] rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER MODAL */}
        <div className="p-6 bg-[#070709] border-t border-white/10 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full bg-white/5 text-[#CCC3D8] font-bold text-xs hover:bg-white/10 transition-all"
          >
            CANCELAR
          </button>
          <button
            onClick={handleSaveAll}
            className="px-8 py-3 rounded-full bg-[#7C3AED] text-white font-bold text-xs tracking-widest hover:bg-[#6D28D9] transition-all shadow-xl flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            GUARDAR CONFIGURACIÓN SOBERANA
          </button>
        </div>
      </div>
    </div>
  );
};
