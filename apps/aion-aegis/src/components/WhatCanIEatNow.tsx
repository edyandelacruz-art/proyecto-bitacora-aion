import React, { useState } from 'react';
import { NutritionLeadSpecialist, RecipeSkill } from '@aion/agents';
import { RecipeOption, Recipe } from '@aion/shared-types';

export const WhatCanIEatNow: React.FC = () => {
  const specialist = new NutritionLeadSpecialist();
  const recipeSkill = RecipeSkill.getInstance();

  const [searchPrompt, setSearchPrompt] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [customTitle, setCustomTitle] = useState('');
  const [customIngredients, setCustomIngredients] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const [options, setOptions] = useState<RecipeOption[]>(specialist.getWhatCanIEatNowOptions());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCook = (option: RecipeOption) => {
    const recipe: Recipe = {
      id: `rec-custom-${Date.now()}`,
      name: option.title,
      description: option.subtitle,
      servings: 1,
      prepTimeMin: option.prepTimeMinutes,
      ingredients: option.ingredientsNeeded.map((i) => ({ name: i.name, amount: 150, unit: 'g' })),
      instructions: option.steps.map((s, idx) => ({ stepNumber: idx + 1, instruction: s })),
      totalNutrition: { kcal: option.kcal, protein: option.proteinGrams, carbs: option.carbsGrams, fats: option.fatsGrams },
      source: 'aion_generated',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = recipeSkill.cookRecipe(recipe, 3, 1);
    triggerToast(`✓ Cocinado: "${result.batch.recipeName}". Quedan ${result.batch.servingsRemaining} porciones en refrigerador.`);
  };

  const handleAddCustomRecipe = () => {
    if (!customTitle.trim()) return;

    const newOpt: RecipeOption = {
      id: `rec-usr-${Date.now()}`,
      title: customTitle.trim(),
      subtitle: 'Receta personalizada definida por ti.',
      kcal: 420,
      proteinGrams: 30,
      carbsGrams: 35,
      fatsGrams: 12,
      prepTimeMinutes: 15,
      category: 'MEJOR OPCIÓN',
      reasonToRecommend: 'Receta personalizada configurada con tus propios ingredientes.',
      ingredientsNeeded: (customIngredients || 'Ingredientes definidos por ti')
        .split(',')
        .map((ing) => ({ name: ing.trim(), amount: 'al gusto', availableInPantry: true })),
      steps: ['Preparar ingredientes y cocinar al gusto.'],
    };

    setOptions((prev) => [newOpt, ...prev]);
    setCustomTitle('');
    setCustomIngredients('');
    setShowCustomModal(false);
    triggerToast(`+ Opciones personalizadas actualizadas: "${newOpt.title}"`);
  };

  const filteredOptions = options.filter((opt) => {
    const matchesSearch =
      !searchPrompt.trim() ||
      opt.title.toLowerCase().includes(searchPrompt.toLowerCase()) ||
      opt.reasonToRecommend.toLowerCase().includes(searchPrompt.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'fast') return opt.prepTimeMinutes <= 15;
    if (selectedFilter === 'protein') return opt.proteinGrams >= 25;
    if (selectedFilter === 'expiring') return opt.category === 'APROVECHA LO QUE VA A VENCER' || opt.title.toLowerCase().includes('tomate');

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {toastMessage && <div className="aion-toast">{toastMessage}</div>}

      <div className="aion-card" style={{ background: 'linear-gradient(135deg, rgba(91, 75, 138, 0.4) 0%, rgba(26, 22, 37, 0.95) 100%)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>¿Qué puedo comer ahora?</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--aion-sand)', margin: '0.2rem 0 0.8rem 0' }}>
          Busca tus propias apetencias, filtra por tiempo o agrega una receta personalizada.
        </p>

        {/* Buscador de Opciones e Insumos */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            className="aion-input"
            placeholder="Ej. Quiero algo rápido, pollo, ensalada o dulce..."
            value={searchPrompt}
            onChange={(e) => setSearchPrompt(e.target.value)}
          />
          <button className="aion-btn-primary" style={{ width: 'auto', padding: '0 0.9rem' }} onClick={() => setShowCustomModal(true)}>
            + Personalizada
          </button>
        </div>

        {/* Filtros Rápido */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Todas' },
            { id: 'fast', label: '⚡ < 15 min' },
            { id: 'protein', label: '🍗 Alta Proteína' },
            { id: 'expiring', label: '🥑 Próximos a vencer' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              style={{
                background: selectedFilter === f.id ? 'var(--aion-lavender)' : 'rgba(255,255,255,0.07)',
                color: selectedFilter === f.id ? '#0F0D15' : 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '0.3rem 0.7rem',
                fontSize: '0.73rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modal de Creación de Receta Personalizada del Usuario */}
      {showCustomModal && (
        <div className="aion-card" style={{ border: '1px solid var(--aion-lavender)', background: 'rgba(26,22,37,0.98)' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--aion-lavender)', marginBottom: '0.5rem' }}>Añadir tu Propia Opción de Comida</h3>
          <input
            className="aion-input"
            placeholder="Nombre de tu plato (ej. Ensalada César con Pollo)"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            style={{ marginBottom: '0.5rem' }}
          />
          <input
            className="aion-input"
            placeholder="Ingredientes (separados por coma: pollo, lechuga, crutones)"
            value={customIngredients}
            onChange={(e) => setCustomIngredients(e.target.value)}
            style={{ marginBottom: '0.8rem' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="aion-btn-primary" onClick={handleAddCustomRecipe}>
              Guardar Opción
            </button>
            <button className="aion-btn-secondary" onClick={() => setShowCustomModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Opciones Recomendadas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredOptions.map((opt) => (
          <div key={opt.id} className="aion-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-available">{opt.category}</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginTop: '0.2rem' }}>{opt.title}</h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--aion-sand)' }}>{opt.subtitle}</div>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--aion-lavender)', fontWeight: 700 }}>
                {opt.prepTimeMinutes} min
              </span>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--aion-neutral-light)', background: 'rgba(255,255,255,0.04)', padding: '0.5rem', borderRadius: '6px' }}>
              💡 <strong>Por qué AION recomienda esto:</strong> {opt.reasonToRecommend}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.3rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34D399' }}>
                {opt.kcal} kcal • {opt.proteinGrams}g P • {opt.carbsGrams}g C • {opt.fatsGrams}g G
              </span>
              <button className="aion-btn-primary" style={{ width: 'auto', padding: '0.4rem 0.9rem' }} onClick={() => handleCook(opt)}>
                ✓ Aceptar & Cocinar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
