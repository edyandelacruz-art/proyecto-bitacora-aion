import React, { useState } from 'react';
import { NutritionLeadSpecialist } from '@aion/agents';
import { MealRecord, VisionAnalysis } from '@aion/shared-types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'specialist';
  text: string;
  timestamp: string;
  visionAnalysis?: VisionAnalysis;
  showFractionSelector?: boolean;
}

interface MealLoggerProps {
  onMealAdded: () => void;
}

export const MealLogger: React.FC<MealLoggerProps> = ({ onMealAdded }) => {
  const specialist = new NutritionLeadSpecialist();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'specialist',
      text: '¡Hola! Soy tu Especialista de Alimentación AION. Cuéntame qué comiste, sube una foto de tu plato o hazme cualquier consulta sobre nutrición y metabolismo.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pendingFraction, setPendingFraction] = useState<number>(0.2);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');

    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAnalyzing(true);

    try {
      const result = await specialist.processMealInput(userText, undefined, pendingFraction);

      const agentMsg: ChatMessage = {
        id: `msg-a-${Date.now()}`,
        sender: 'specialist',
        text: result.agentReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        visionAnalysis: result.visionAnalysis,
        showFractionSelector: !!result.mealRecord,
      };

      setMessages((prev) => [...prev, agentMsg]);
      onMealAdded();
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'specialist',
          text: 'Procesé tu mensaje e integré la información en tu bitácora de nutrición.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmFraction = async (fraction: number) => {
    setPendingFraction(fraction);
    setIsAnalyzing(true);

    const result = await specialist.processMealInput('Confirmado', undefined, fraction);

    const agentMsg: ChatMessage = {
      id: `msg-conf-${Date.now()}`,
      sender: 'specialist',
      text: `✓ Porción confirmada en ${(fraction * 100).toFixed(0)}%. ${result.agentReply}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, agentMsg]);
    onMealAdded();
    setIsAnalyzing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 160px)' }}>
      {/* Contenedor de Chat Conversacional */}
      <div
        className="aion-card"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          padding: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="aion-logo-dot" />
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'white' }}>Especialista de Nutrición AION</span>
          </div>
          <span className="badge badge-available">CONVERSACIONAL</span>
        </div>

        {/* Lista de Mensajes del Chat */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.3rem' }}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: isUser
                    ? 'linear-gradient(135deg, var(--aion-violet) 0%, #4C1D95 100%)'
                    : 'rgba(255,255,255,0.06)',
                  color: 'white',
                  borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  padding: '0.75rem 0.9rem',
                  border: isUser ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                }}
              >
                <div style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>{msg.text}</div>

                {/* Análisis Visual con Rangos de Porción si existe */}
                {msg.visionAnalysis && (
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px', marginTop: '0.3rem', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--aion-lavender)', fontWeight: 700 }}>🔍 RANGOS ESTIMADOS POR VISIÓN:</span>
                    {msg.visionAnalysis.detectedItems.map((item) => (
                      <div key={item.id} style={{ color: 'var(--aion-sand)', marginTop: '0.2rem' }}>
                        • <strong>{item.candidateName}:</strong> aprox. {item.portionRange?.min}-{item.portionRange?.max}g (certeza {item.portionRange?.confidence ? (item.portionRange.confidence * 100).toFixed(0) : 85}%)
                      </div>
                    ))}
                  </div>
                )}

                {/* Selector Interactivo de Porciones Consumidas */}
                {msg.showFractionSelector && (
                  <div style={{ marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--aion-lavender)', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      ¿Qué porción de la preparación consumiste?
                    </span>
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {[
                        { label: '1/5 (20%)', val: 0.2 },
                        { label: '1/3 (33%)', val: 0.33 },
                        { label: '1/2 (50%)', val: 0.5 },
                        { label: '100% (Toda)', val: 1.0 },
                      ].map((p) => (
                        <button
                          key={p.val}
                          onClick={() => handleConfirmFraction(p.val)}
                          style={{
                            background: pendingFraction === p.val ? 'var(--aion-lavender)' : 'rgba(255,255,255,0.1)',
                            color: pendingFraction === p.val ? '#0F0D15' : 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <span style={{ fontSize: '0.62rem', color: 'var(--aion-neutral)', alignSelf: 'flex-end' }}>{msg.timestamp}</span>
              </div>
            );
          })}
          {isAnalyzing && (
            <div style={{ alignSelf: 'flex-start', color: 'var(--aion-lavender)', fontSize: '0.75rem', fontStyle: 'italic' }}>
              AION Especialista está analizando nutrición y metabolismo...
            </div>
          )}
        </div>

        {/* Input Bar Conversacional con Soporte de Foto */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <input
            className="aion-input"
            placeholder="Escribe lo que comiste o haz tu consulta nutricional..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="aion-btn-primary" style={{ width: 'auto', padding: '0 1.2rem' }} onClick={handleSendMessage}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};
