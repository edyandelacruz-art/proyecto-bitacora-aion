import React, { useState } from 'react';
import { AionCoreSuperAgent, OmniDispatchResult } from '@aion/agents';
import { GlobalDashboard } from './GlobalDashboard';

interface AionCoreCentralHubProps {
  onRefreshAll: () => void;
}

export const AionCoreCentralHub: React.FC<AionCoreCentralHubProps> = ({ onRefreshAll }) => {
  const coreAgent = AionCoreSuperAgent.getInstance();

  const [omniInput, setOmniInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastDispatchResult, setLastDispatchResult] = useState<OmniDispatchResult | null>(null);

  const handleSendOmniPrompt = async (textToSend?: string) => {
    const input = (textToSend || omniInput).trim();
    if (!input) return;

    setOmniInput('');
    setIsProcessing(true);

    try {
      const result = await coreAgent.processOmniInput(input);
      setLastDispatchResult(result);
      onRefreshAll();
    } catch (err) {
      console.error('Error procesando entrada omnicanal:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. NÚCLEO CENTRAL CONVERSACIONAL Y DE PROCESAMIENTO — AION CORE SUPER-IA */}
      <div
        className="aion-card"
        style={{
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(13, 11, 18, 0.98) 100%)',
          border: '1.5px solid #7C3AED',
          boxShadow: '0 0 25px rgba(124, 58, 237, 0.25)',
          padding: '1.4rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🤖</span>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', margin: 0, letterSpacing: '0.04em' }}>
              AION CORE SUPER-IA — ORQUESTADOR SOBERANO
            </h1>
            <p style={{ fontSize: '0.8rem', color: '#C4B5FD', margin: 0 }}>
              Escribe o habla en lenguaje natural. AION sabrá qué hacer, actualizará tus módulos y registrará todo en el Ledger.
            </p>
          </div>
        </div>

        {/* PROMPT DE ENTRADA OMNICANAL CENTRAL */}
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ position: 'relative' }}>
            <textarea
              className="aion-input"
              rows={3}
              placeholder="Ejemplo: 'Joda, imagínate que hoy me gasté 20.000 pesos en la tienda' o 'Me comí una pechuga de pollo salteada con papa y tomé 2 vasos de agua'..."
              value={omniInput}
              onChange={(e) => setOmniInput(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(196, 181, 253, 0.3)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                fontSize: '0.88rem',
                color: 'white',
                resize: 'none',
              }}
            />
          </div>

          {/* CHIPS DE SUGERENCIA RÁPIDA */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              '🍗 "Comí 200g de pechuga con papa sabanera"',
              '💸 "Gasté 20.000 COP en la tienda"',
              '😴 "Dormí 7.5 horas y desperté descansado"',
              '💧 "Tomé 500ml de agua"',
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendOmniPrompt(chip.replace(/^[^"]*"|"$|"/g, ''))}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'var(--aion-sand)',
                  borderRadius: '16px',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
            <button
              className="aion-btn-primary"
              style={{ width: 'auto', padding: '0.55rem 1.4rem', fontSize: '0.85rem', fontWeight: 800 }}
              onClick={() => handleSendOmniPrompt()}
              disabled={isProcessing || !omniInput.trim()}
            >
              {isProcessing ? '⚡ Procesando con AION Core...' : '🚀 Enviar a AION Core'}
            </button>
          </div>
        </div>

        {/* RECIBO DE ACCIÓN OMNICANAL EN VIVO */}
        {lastDispatchResult && (
          <div
            style={{
              marginTop: '1.2rem',
              background: 'rgba(17, 16, 23, 0.95)',
              border: '1px solid #7C3AED',
              borderRadius: '10px',
              padding: '0.9rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34D399' }}>
                ✓ RESPUESTA Y ACCIONES DE AION CORE
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--aion-sand)' }}>
                Procesado exitosamente
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'white', lineHeight: 1.4, margin: '0 0 0.6rem 0' }}>
              {lastDispatchResult.coreReply}
            </p>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {lastDispatchResult.detectedDomains.map((domain, idx) => (
                <span key={idx} className="badge badge-available">
                  MÓDULO: {domain}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. TABLERO DE MÉTRICAS Y ESTADO DE MÓDULOS EN VIVO */}
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#C4B5FD', letterSpacing: '0.06em', marginBottom: '0.8rem' }}>
          📊 ESTADO DE TUS 12 MÓDULOS Y CENTRO DE MANDO EN VIVO
        </h3>
        <GlobalDashboard onRefreshAll={onRefreshAll} />
      </div>
    </div>
  );
};
