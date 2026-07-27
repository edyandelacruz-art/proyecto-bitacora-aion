import React, { useState } from 'react';
import { NutritionLeadSpecialist } from '@aion/agents';
import { MealRecord } from '@aion/shared-types';

interface MealLoggerProps {
  onMealAdded: () => void;
}

export const MealLogger: React.FC<MealLoggerProps> = ({ onMealAdded }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<
    { sender: 'user' | 'agent'; text: string; mealRecord?: MealRecord; missingQuestion?: boolean }[]
  >([
    {
      sender: 'agent',
      text: '¡Hola! Soy tu Especialista de Alimentación AION Aegis. Puedes escribirme lo que comiste, subir una foto de tu plato o describir una preparación.',
    },
  ]);
  const [selectedFraction, setSelectedFraction] = useState<number>(0.2); // 1/5 por defecto
  const [showFractionPrompt, setShowFractionPrompt] = useState(false);
  const specialist = new NutritionLeadSpecialist();

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setInputText('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);

    // Procesar con el Especialista de Nutrición
    const res = await specialist.processMealInput(userMsg, undefined, showFractionPrompt ? selectedFraction : undefined);

    if (res.missingInfoQuestion && !showFractionPrompt) {
      setShowFractionPrompt(true);
      setMessages((prev) => [
        ...prev,
        { sender: 'agent', text: res.agentReply, missingQuestion: true },
      ]);
    } else {
      setShowFractionPrompt(false);
      setMessages((prev) => [
        ...prev,
        { sender: 'agent', text: res.agentReply, mealRecord: res.mealRecord },
      ]);
      onMealAdded();
    }
  };

  const handleConfirmFraction = async (fraction: number) => {
    setSelectedFraction(fraction);
    setShowFractionPrompt(false);
    const fractionLabel = fraction === 0.2 ? '1/5 de la preparación' : fraction === 0.33 ? '1/3 de la preparación' : fraction === 0.5 ? '1/2 de la preparación' : '100% (Toda la preparación)';
    
    setMessages((prev) => [...prev, { sender: 'user', text: `Comí ${fractionLabel}` }]);

    const res = await specialist.processMealInput('Confirmado', undefined, fraction);
    setMessages((prev) => [
      ...prev,
      { sender: 'agent', text: res.agentReply, mealRecord: res.mealRecord },
    ]);
    onMealAdded();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="aion-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '420px', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--aion-lavender)' }}>
          ESPECIALISTA DE ALIMENTACIÓN AION
        </h3>

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
              background: m.sender === 'user' ? 'rgba(91, 75, 138, 0.4)' : 'rgba(255, 255, 255, 0.05)',
              border: m.sender === 'user' ? '1px solid var(--aion-violet)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '0.75rem 0.9rem',
              fontSize: '0.85rem',
              color: 'var(--aion-warm-white)',
              lineHeight: 1.4,
            }}
          >
            {m.text}

            {/* Tarjeta de comida si fue confirmada */}
            {m.mealRecord && (
              <div style={{ marginTop: '0.75rem', padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
                <div style={{ fontWeight: 700, color: 'var(--aion-lavender)', fontSize: '0.8rem' }}>
                  {m.mealRecord.mealType.toUpperCase()} REGISTRADO
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, margin: '0.2rem 0' }}>
                  {m.mealRecord.consumedPortion.actualKcal} kcal estimadas
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--aion-sand)' }}>
                  Prot: {m.mealRecord.consumedPortion.actualProtein}g • Carb: {m.mealRecord.consumedPortion.actualCarbs}g • Grasas: {m.mealRecord.consumedPortion.actualFats}g
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--aion-neutral-light)', marginTop: '0.3rem' }}>
                  Porción consumida: {m.mealRecord.consumedPortion.fractionText}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Prompt para seleccionar Porción Consumida */}
        {showFractionPrompt && (
          <div style={{ background: 'rgba(167, 139, 250, 0.15)', border: '1px dashed var(--aion-lavender)', borderRadius: '12px', padding: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--aion-lavender)', display: 'block', marginBottom: '0.5rem' }}>
              DISTINCIÓN: PREPARACIÓN TOTAL VS PORCIÓN CONSUMIDA
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              <button className="aion-btn-primary" style={{ padding: '0.5rem', fontSize: '0.75rem' }} onClick={() => handleConfirmFraction(0.2)}>
                1/5 (20%) de la preparación
              </button>
              <button className="aion-btn-primary" style={{ padding: '0.5rem', fontSize: '0.75rem' }} onClick={() => handleConfirmFraction(0.33)}>
                1/3 (33%) de la preparación
              </button>
              <button className="aion-btn-primary" style={{ padding: '0.5rem', fontSize: '0.75rem' }} onClick={() => handleConfirmFraction(0.5)}>
                1/2 (50%) de la preparación
              </button>
              <button className="aion-btn-primary" style={{ padding: '0.5rem', fontSize: '0.75rem' }} onClick={() => handleConfirmFraction(1.0)}>
                100% (Toda la comida)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input conversacional */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          className="aion-input"
          placeholder="Escribe lo que comiste o saluda..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="aion-btn-primary" style={{ width: 'auto', padding: '0 1.25rem' }} onClick={handleSend}>
          Enviar
        </button>
      </div>
    </div>
  );
};
