import React, { useState } from 'react';

export interface GlossaryTerm {
  id: string;
  term: string;
  category: 'Fisiología' | 'Hormonas' | 'Vías Bioquímicas' | 'Nutrición';
  humanSummary: string;
  biochemicalDetail: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'insulina',
    term: 'Insulina',
    category: 'Hormonas',
    humanSummary: 'Hormona producida por el páncreas tras comer. Abre las células para que entre el azúcar de los alimentos.',
    biochemicalDetail: 'Hormona anabólica peptídica producida por células beta de los islotes de Langerhans. Estimula traslocación de GLUT4 y activa la glucógeno sintasa vía Akt.',
  },
  {
    id: 'glucagon',
    term: 'Glucagón',
    category: 'Hormonas',
    humanSummary: 'Hormona del ayuno. Cuando llevas horas sin comer, le ordena al hígado liberar energía guardada.',
    biochemicalDetail: 'Hormona catabólica secretada por células alfa pancreáticas. Incrementa AMPc intracelular y activa PKA, estimulando glucogenólisis y gluconeogénesis.',
  },
  {
    id: 'posprandial',
    term: 'Fase Posprandial',
    category: 'Fisiología',
    humanSummary: 'Etapa de 0 a 4 horas después de comer mientras digieres y usas la comida reciente.',
    biochemicalDetail: 'Período de absorción entérica con predominancia insulínica, captación tisular de glucosa y lipogénesis de triglicéridos.',
  },
  {
    id: 'postabsortivo',
    term: 'Fase Postabsortiva',
    category: 'Fisiología',
    humanSummary: 'Etapa de 4 a 8 horas sin comer. Terminaste de digerir y tu cuerpo empieza a liberar reservas.',
    biochemicalDetail: 'Estado de transición metabólica sostenido por la degradación del glucógeno hepático para normoglucemia basal.',
  },
  {
    id: 'lipolisis',
    term: 'Lipólisis',
    category: 'Vías Bioquímicas',
    humanSummary: 'Proceso por el cual tu cuerpo rompe las grasas almacenadas para usarlas como combustible.',
    biochemicalDetail: 'Hidrólisis enzimática de triglicéridos en adipocitos por la Lipasa Sensible a Hormonas (HSL) libre a glicerol y 3 ácidos grasos.',
  },
  {
    id: 'beta_oxidacion',
    term: 'Beta-oxidación',
    category: 'Vías Bioquímicas',
    humanSummary: 'Quema real de grasa dentro de las mitocondrias de las células para generar energía ATP.',
    biochemicalDetail: 'Ruta catabólica espiral en la matriz mitocondrial que descompone acil-CoA en moléculas de acetil-CoA, NADH y FADH2.',
  },
  {
    id: 'ampk',
    term: 'AMPK',
    category: 'Vías Bioquímicas',
    humanSummary: 'Sensor principal de energía celular. Se activa cuando necesitas quemar reservas o haces ejercicio.',
    biochemicalDetail: 'Proteína quinasa activada por AMP. Sensor maestro de carga energética celular que estimula catabolismo e inhibe anabolismo.',
  },
  {
    id: 'mtor',
    term: 'mTORC1',
    category: 'Vías Bioquímicas',
    humanSummary: 'Interruptor de crecimiento muscular. Se activa con proteína (leucina) y comida para reparar tejidos.',
    biochemicalDetail: 'Target of Rapamycin Complex 1. Complejo quinasa sensible a aminoácidos e insulina que estimula la síntesis proteica tisular.',
  },
  {
    id: 'glut4',
    term: 'GLUT4',
    category: 'Vías Bioquímicas',
    humanSummary: 'Puertas de entrada de azúcar en los músculos y tejido graso.',
    biochemicalDetail: 'Transportador de glucosa facilitado dependiente de insulina presente en vesículas del tejido muscular estriado y adiposo.',
  },
  {
    id: 'glucogenolisis',
    term: 'Glucogenólisis',
    category: 'Vías Bioquímicas',
    humanSummary: 'Descomposición del azúcar almacenado en el hígado para mantener estable tu glucosa.',
    biochemicalDetail: 'Ruptura enzimática de enlaces alfa-1,4-glucosídicos del glucógeno mediada por glucógeno fosforilasa a.',
  },
];

export const TechnicalGlossary: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);

  const filteredTerms = GLOSSARY_TERMS.filter(
    (t) =>
      t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.humanSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.biochemicalDetail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Botón Flotante Lateral en el Borde Derecho de la Pantalla */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          right: isOpen ? '310px' : '0px',
          top: '40%',
          transform: 'translateY(-50%)',
          zIndex: 9999,
          background: 'linear-gradient(135deg, var(--aion-violet) 0%, #4C1D95 100%)',
          color: 'var(--aion-warm-white)',
          border: '1px solid var(--aion-lavender)',
          borderRight: 'none',
          borderRadius: '12px 0 0 12px',
          padding: '0.6rem 0.4rem',
          writingMode: 'vertical-rl',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontSize: '0.72rem',
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.5)',
          transition: 'right 0.3s ease',
        }}
      >
        📚 Glosario Técnico {isOpen ? '▶' : '◀'}
      </button>

      {/* Drawer Desplegable Lateral Derecho */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            width: '300px',
            zIndex: 9998,
            background: 'rgba(20, 16, 32, 0.98)',
            backdropFilter: 'blur(16px)',
            borderLeft: '1px solid var(--aion-border-card)',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.2rem 1rem',
            gap: '1rem',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--aion-lavender)' }}>
              📚 GLOSARIO TÉCNICO
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--aion-sand)', cursor: 'pointer', fontSize: '1.1rem' }}
            >
              ✕
            </button>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--aion-sand)', lineHeight: 1.35 }}>
            Explicación transparente de términos metabólicos, hormonas y rutas bioquímicas del ecosistema.
          </p>

          <input
            className="aion-input"
            placeholder="Buscar término (ej. Insulina, AMPK...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ fontSize: '0.75rem', padding: '0.5rem 0.7rem' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {filteredTerms.map((term) => {
              const isExpanded = expandedTermId === term.id;

              return (
                <div
                  key={term.id}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '0.65rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => setExpandedTermId(isExpanded ? null : term.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'white' }}>{term.term}</span>
                    <span className="badge badge-available" style={{ fontSize: '0.6rem' }}>{term.category}</span>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--aion-sand)', marginTop: '0.35rem', lineHeight: 1.35 }}>
                    {term.humanSummary}
                  </p>

                  {isExpanded && (
                    <div style={{ marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.72rem', color: 'var(--aion-lavender)' }}>
                      <strong>Detalle Bioquímico:</strong>
                      <p style={{ color: 'var(--aion-neutral-light)', marginTop: '0.2rem', lineHeight: 1.3 }}>{term.biochemicalDetail}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
