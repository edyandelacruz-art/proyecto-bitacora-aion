import React, { useState } from 'react';
import { AionCoreSuperAgent, OmniDispatchResult } from '@aion/agents';

interface AionCoreOmniModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshAll: () => void;
}

export const AionCoreOmniModal: React.FC<AionCoreOmniModalProps> = ({ isOpen, onClose, onRefreshAll }) => {
  const coreAgent = AionCoreSuperAgent.getInstance();

  const [omniInput, setOmniInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dispatchHistory, setDispatchHistory] = useState<
    { id: string; userText: string; result: OmniDispatchResult; timestamp: string }[]
  >([]);

  if (!isOpen) return null;

  const handleSendOmniPrompt = async () => {
    if (!omniInput.trim()) return;

    const userText = omniInput.trim();
    setOmniInput('');
    setIsProcessing(true);

    try {
      const result = await coreAgent.processOmniInput(userText);
      setDispatchHistory((prev) => [
        {
          id: `disp-${Date.now()}`,
          userText,
          result,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ]);
      onRefreshAll();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="aion-modal-overlay">
      <div className="aion-modal" style={{ maxWidth: '580px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
        {/* Encabezado AION CORE Super-IA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--aion-violet) 0%, #7C3AED 100%)', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 0 12px rgba(124, 58, 237, 0.6)' }}>
              🤖
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', margin: 0 }}>
                AION CORE — Superadministrador Soberano
              </h2>
              <span style={{ fontSize: '0.72rem', color: 'var(--aion-lavender)' }}>
                Orquestador Inteligente del Ecosistema Multidominio
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--aion-sand)', lineHeight: 1.4, marginBottom: '0.8rem' }}>
          Háblale directamente a AION Core. Puedes decir cualquier cosa (ej. <em>"Joda, hoy me gasté 20.000 pesos en pechuga de pollo y tomates"</em> o subir una foto). AION Core enrutará automáticamente a Finanzas, Despensa y Nutrición.
        </p>

        {/* Historial de Despachos Multidominio en Tiempo Real */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingRight: '0.3rem', marginBottom: '0.8rem' }}>
          {dispatchHistory.length === 0 ? (
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '10px', textAlign: 'center', color: 'var(--aion-neutral-light)', fontSize: '0.8rem' }}>
              💬 Escribe o habla cualquier mensaje. AION Core se encarga de todo sin que tengas que abrir módulos individuales.
            </div>
          ) : (
            dispatchHistory.map((item) => (
              <div key={item.id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--aion-lavender)', fontWeight: 700 }}>
                  <span>Tú: "{item.userText}"</span>
                  <span>{item.timestamp}</span>
                </div>

                {/* Dominios Detectados y Enrutados */}
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {item.result.detectedDomains.map((dom) => (
                    <span key={dom} className="badge badge-available" style={{ fontSize: '0.65rem' }}>
                      {dom === 'FINANCES' ? '💰 Finanzas ($ COP)' : dom === 'NUTRITION' ? '🍎 Nutrición & Despensa' : dom}
                    </span>
                  ))}
                </div>

                <div style={{ fontSize: '0.82rem', color: 'white', lineHeight: 1.45, whiteSpace: 'pre-line' }}>
                  {item.result.coreReply}
                </div>
              </div>
            ))
          )}
          {isProcessing && (
            <div style={{ color: 'var(--aion-lavender)', fontSize: '0.78rem', fontStyle: 'italic' }}>
              🤖 AION Core está analizando tu intención y enrutando eventos entre aplicaciones...
            </div>
          )}
        </div>

        {/* Input Bar Omnicanal de AION Core */}
        <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <input
            className="aion-input"
            placeholder='Ej: "Joda, me gasté 20.000 pesos en pollo y tomates"'
            value={omniInput}
            onChange={(e) => setOmniInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendOmniPrompt()}
          />
          <button className="aion-btn-primary" style={{ width: 'auto', padding: '0 1.2rem', whiteSpace: 'nowrap' }} onClick={handleSendOmniPrompt}>
            Procesar Omni
          </button>
        </div>
      </div>
    </div>
  );
};
