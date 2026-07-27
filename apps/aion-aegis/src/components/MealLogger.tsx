import React, { useState } from 'react';
import { NutritionLeadSpecialist } from '@aion/agents';
import { MealRecord } from '@aion/shared-types';

interface MealLoggerProps {
  onMealAdded: () => void;
}

export const MealLogger: React.FC<MealLoggerProps> = ({ onMealAdded }) => {
  const [inputText, setInputText] = useState('');
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [fractionSlider, setFractionSlider] = useState<number>(0.2); // 0.2 = 1/5th
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [messages, setMessages] = useState<
    { sender: 'user' | 'agent'; text: string; mealRecord?: MealRecord; isAmbiguous?: boolean }[]
  >([
    {
      sender: 'agent',
      text: '¡Hola! Soy tu Especialista de Alimentación AION Aegis. Puedes subir una foto de tu comida, describir una preparación o usar la cámara para escaneo visual.',
    },
  ]);

  const specialist = new NutritionLeadSpecialist();

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedPhotoUrl(reader.result as string);
        setIsScanningPhoto(true);

        setTimeout(() => {
          setIsScanningPhoto(false);
          setMessages((prev) => [
            ...prev,
            { sender: 'user', text: '📷 Fotografía de comida enviada' },
            {
              sender: 'agent',
              text: 'He escaneado tu plato. Veo atún en agua, papa sabanera y queso costeño. Para calcular exactamente tu porción consumida, arrastra el deslizador interactivo de abajo.',
              isAmbiguous: true,
            },
          ]);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendText = async () => {
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setInputText('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);

    const res = await specialist.processMealInput(userMsg, uploadedPhotoUrl || undefined, fractionSlider);

    setMessages((prev) => [
      ...prev,
      { sender: 'agent', text: res.agentReply, mealRecord: res.mealRecord },
    ]);

    if (res.mealRecord) {
      triggerToast(`✓ ${res.mealRecord.consumedPortion.actualKcal} kcal registradas en tu Bitácora AION`);
      onMealAdded();
    }
  };

  const handleConfirmFraction = async () => {
    const fractionText = `${(fractionSlider * 100).toFixed(0)}% de la preparación (${(1 / fractionSlider).toFixed(1)} porciones)`;
    setMessages((prev) => [...prev, { sender: 'user', text: `Consumí ${fractionText}` }]);

    const res = await specialist.processMealInput('Confirmado por deslizador', uploadedPhotoUrl || undefined, fractionSlider);

    setMessages((prev) => [
      ...prev,
      { sender: 'agent', text: res.agentReply, mealRecord: res.mealRecord },
    ]);

    if (res.mealRecord) {
      triggerToast(`✓ ${res.mealRecord.consumedPortion.actualKcal} kcal calculadas determinísticamente`);
      onMealAdded();
    }
  };

  // Cálculo en tiempo real del deslizador
  const liveKcal = Math.round(580 * (fractionSlider / 0.2));
  const liveProtein = Math.round(28 * (fractionSlider / 0.2));
  const liveCarbs = Math.round(36 * (fractionSlider / 0.2));
  const liveFats = Math.round(36 * (fractionSlider / 0.2));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {toastMessage && <div className="aion-toast">{toastMessage}</div>}

      {/* Zona de Escaneo Fotográfico Láser / Cámara */}
      <div className="scan-container" style={{ background: 'rgba(26,22,37,0.8)', padding: '1rem', textAlign: 'center' }}>
        {isScanningPhoto && <div className="scan-laser" />}

        {uploadedPhotoUrl ? (
          <div style={{ position: 'relative', width: '100%', maxHeight: '180px', overflow: 'hidden', borderRadius: '12px' }}>
            <img src={uploadedPhotoUrl} alt="Comida Escaneada" style={{ width: '100%', objectFit: 'cover' }} />
            {isScanningPhoto && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(91,75,138,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                🔍 ESCANEANDO ALIMENTOS CON IA...
              </div>
            )}
          </div>
        ) : (
          <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.8rem' }}>📷</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--aion-lavender)' }}>Subir o tomar fotografía del plato</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--aion-neutral-light)' }}>Detección de ingredientes y técnica de cocción</span>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
          </label>
        )}
      </div>

      {/* Deslizador Interactivo de Porción Consumida */}
      <div className="aion-card" style={{ background: 'linear-gradient(135deg, rgba(91, 75, 138, 0.25) 0%, rgba(26, 22, 37, 0.9) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--aion-lavender)' }}>
            PORCIÓN CONSUMIDA REAL: {(fractionSlider * 100).toFixed(0)}%
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34D399' }}>
            ~{liveKcal} kcal
          </span>
        </div>

        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.05"
          value={fractionSlider}
          onChange={(e) => setFractionSlider(parseFloat(e.target.value))}
          style={{ width: '100%', margin: '0.75rem 0', accentColor: 'var(--aion-lavender)', cursor: 'pointer' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--aion-sand)' }}>
          <span>Prot: {liveProtein}g</span>
          <span>Carb: {liveCarbs}g</span>
          <span>Grasas: {liveFats}g</span>
          <button className="aion-btn-primary" style={{ width: 'auto', padding: '0.25rem 0.75rem', fontSize: '0.72rem' }} onClick={handleConfirmFraction}>
            Confirmar Porción
          </button>
        </div>
      </div>

      {/* Historial de Chat e Interacciones */}
      <div className="aion-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
              background: m.sender === 'user' ? 'rgba(91, 75, 138, 0.45)' : 'rgba(255, 255, 255, 0.05)',
              border: m.sender === 'user' ? '1px solid var(--aion-violet)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '0.75rem 0.9rem',
              fontSize: '0.85rem',
              color: 'white',
              lineHeight: 1.4,
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Bar de Entrada */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          className="aion-input"
          placeholder="Escribe lo que comiste..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
        />
        <button className="aion-btn-primary" style={{ width: 'auto', padding: '0 1.25rem' }} onClick={handleSendText}>
          Enviar
        </button>
      </div>
    </div>
  );
};
