import React, { useState } from 'react';
import { AionMemoryStore } from '@aion/memory';
import { AionUserProfile, AegisProfile } from '@aion/shared-types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const memoryStore = AionMemoryStore.getInstance();
  const currentCore = memoryStore.getCoreProfile();
  const currentAegis = memoryStore.getAegisProfile();

  const [step, setStep] = useState<1 | 2>(1);

  // Estados Core
  const [displayName, setDisplayName] = useState(currentCore.displayName || '');
  const [country, setCountry] = useState(currentCore.country || 'Colombia');
  const [city, setCity] = useState(currentCore.city || 'Bogotá');
  const [timezone, setTimezone] = useState(currentCore.timezone || 'America/Bogota');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>(currentCore.unitSystem || 'metric');

  // Estados Aegis
  const [goalType, setGoalType] = useState<'deficit' | 'maintenance' | 'surplus' | 'health'>('deficit');
  const [prepTime, setPrepTime] = useState<number>(currentAegis.typicalPrepTimeMinutes || 20);
  const [preferredFoods, setPreferredFoods] = useState(currentAegis.preferredFoods?.join(', ') || 'Atún, Papa, Queso, Pollo');

  if (!isOpen) return null;

  const handleSave = () => {
    const coreUpdates: Partial<AionUserProfile> = {
      displayName: displayName.trim() || 'Usuario AION',
      country,
      city,
      timezone,
      unitSystem,
    };

    const aegisUpdates: Partial<AegisProfile> = {
      goals: [{ type: goalType, targetKcal: goalType === 'deficit' ? 1800 : 2200 }],
      typicalPrepTimeMinutes: prepTime,
      preferredFoods: preferredFoods.split(',').map((f) => f.trim()),
    };

    memoryStore.updateCoreProfile(coreUpdates);
    memoryStore.updateAegisProfile(aegisUpdates);

    // Guardar hecho en AION Memory
    memoryStore.addFact({
      key: 'user_profile_configured',
      value: { core: coreUpdates, aegis: aegisUpdates },
      evidence: 'USER_CONFIRMED',
      source: 'user',
      createdAt: new Date().toISOString(),
      scope: 'core',
      userEditable: true,
    });

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div className="aion-card" style={{ maxWidth: '440px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--aion-lavender)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              CONFIGURACIÓN PROGRESIVA • CAPA {step} DE 2
            </span>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
              {step === 1 ? 'Perfil Transversal AION Core' : 'Contexto Alimentario AION Aegis'}
            </h2>
          </div>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--aion-neutral)', cursor: 'pointer', fontSize: '1.2rem' }} onClick={onClose}>
            ✕
          </button>
        </div>

        {step === 1 ? (
          /* CAPA 1: PERFIL CORE */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--aion-sand)', display: 'block', marginBottom: '0.3rem' }}>¿Cómo quieres que AION te llame?</label>
              <input className="aion-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Ej. Juan" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--aion-sand)', display: 'block', marginBottom: '0.3rem' }}>País</label>
                <input className="aion-input" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--aion-sand)', display: 'block', marginBottom: '0.3rem' }}>Ciudad / Región</label>
                <input className="aion-input" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--aion-sand)', display: 'block', marginBottom: '0.3rem' }}>Zona Horaria</label>
              <input className="aion-input" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--aion-sand)', display: 'block', marginBottom: '0.3rem' }}>Sistema de Unidades</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="aion-btn-primary"
                  style={{ opacity: unitSystem === 'metric' ? 1 : 0.4, padding: '0.5rem' }}
                  onClick={() => setUnitSystem('metric')}
                >
                  Métrico (kg, cm, g)
                </button>
                <button
                  className="aion-btn-primary"
                  style={{ opacity: unitSystem === 'imperial' ? 1 : 0.4, padding: '0.5rem' }}
                  onClick={() => setUnitSystem('imperial')}
                >
                  Imperial (lb, in, oz)
                </button>
              </div>
            </div>

            <button className="aion-btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => setStep(2)}>
              Siguiente: Contexto Aegis →
            </button>
          </div>
        ) : (
          /* CAPA 2: PERFIL AEGIS */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--aion-sand)', display: 'block', marginBottom: '0.3rem' }}>Objetivo Principal de Alimentación</label>
              <select
                className="aion-input"
                style={{ background: 'rgba(26,22,37,0.95)' }}
                value={goalType}
                onChange={(e) => setGoalType(e.target.value as any)}
              >
                <option value="deficit">Déficit calórico moderado</option>
                <option value="maintenance">Mantenimiento y rendimiento</option>
                <option value="surplus">Ganancia de masa muscular</option>
                <option value="health">Salud general y energía</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--aion-sand)', display: 'block', marginBottom: '0.3rem' }}>Tiempo típico disponible para cocina</label>
              <input
                type="number"
                className="aion-input"
                value={prepTime}
                onChange={(e) => setPrepTime(Number(e.target.value))}
                placeholder="20 min"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--aion-sand)', display: 'block', marginBottom: '0.3rem' }}>Alimentos o ingredientes preferidos</label>
              <input
                className="aion-input"
                value={preferredFoods}
                onChange={(e) => setPreferredFoods(e.target.value)}
                placeholder="Ej. Atún, Papa, Queso, Pollo"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className="aion-btn-primary" style={{ background: 'transparent', border: '1px solid var(--aion-lavender)' }} onClick={() => setStep(1)}>
                ← Volver
              </button>
              <button className="aion-btn-primary" onClick={handleSave}>
                Guardar Configuración
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
