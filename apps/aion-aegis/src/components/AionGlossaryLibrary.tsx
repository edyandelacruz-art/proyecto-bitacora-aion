import React, { useState } from 'react';

export interface GlossaryTerm {
  id: string;
  term: string;
  category: 'Bioquímica' | 'Nutrición' | 'Fisiología' | 'Circadiano' | 'Agentes AI' | 'Antropometría';
  shortDefinition: string;
  detailedExplanation: string;
  clinicalRelevance: string;
  authoritativeAgent: string;
  relatedTerms: string[];
  imageUrl?: string;
}

export const AionGlossaryLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);

  const terms: GlossaryTerm[] = [
    {
      id: 'lipolisis',
      term: 'Lipólisis & Beta-Oxidación',
      category: 'Bioquímica',
      shortDefinition: 'Proceso metabólico de degradación de triacilgliceroles en ácidos grasos libres y glicerol para la producción de ATP.',
      detailedExplanation: 'Durante periodos de ayuno o déficit de glucógeno hepático (generalmente >12h sin ingesta), la hormona lipasa sensible (HSL) y la triglicérido lipasa adiposa (ATGL) se activan por caída de insulina y aumento de glucagón/adrenalina, liberando ácidos grasos a la circulación para su beta-oxidación mitocondrial.',
      clinicalRelevance: 'Indicador clave de flexibilidad metabólica y utilización de grasas como sustrato energético principal.',
      authoritativeAgent: 'MetabolismSupervisorAgent',
      relatedTerms: ['Glucogenólisis', 'Cetogénesis', 'Insulina', 'Glucagón'],
      imageUrl: '/images/aion_metabolic_chart.jpg',
    },
    {
      id: 'rpe',
      term: 'Escala RPE (Rate of Perceived Exertion)',
      category: 'Fisiología',
      shortDefinition: 'Escala Borg de esfuerzo percibido (1 a 10) que mide la intensidad subjetiva del ejercicio físico.',
      detailedExplanation: 'Permite autorregular el entrenamiento evaluando el estrés neuromuscular y cardiorrespiratorio sin depender únicamente de la frecuencia cardíaca.',
      clinicalRelevance: 'Evita el sobreentrenamiento y permite programar cargas óptimas en Zona 2 (RPE 6-7) o HIIT (RPE 9-10).',
      authoritativeAgent: 'ActivitySupervisorAgent',
      relatedTerms: ['Zona 2', 'VO2 Max', 'Gasto Calórico'],
    },
    {
      id: 'aegis_ledger',
      term: 'Aegis Universal Ledger (Append-Only)',
      category: 'Agentes AI',
      shortDefinition: 'Registro inmutable de trazabilidad que almacena cada evento, deducción e ingesta con nivel de evidencia.',
      detailedExplanation: 'Cada acción reportada por el usuario o deducida por los agentes especialistas genera una entrada inalterable con timestamp, firma del agente responsable y nivel de confiabilidad (MEASURED, USER_CONFIRMED, MODEL_ESTIMATE).',
      clinicalRelevance: 'Garantiza auditoría estricta y reproducibilidad total para exportaciones a profesionales de la salud.',
      authoritativeAgent: 'UniversalAuditAgent',
      relatedTerms: ['EvidenceLevel', 'AgentRuntime', 'AegisCoreAgent'],
      imageUrl: '/images/aion_agent_architecture.jpg',
    },
    {
      id: 'ritmo_circadiano',
      term: 'Arquitectura Circadiana del Sueño',
      category: 'Circadiano',
      shortDefinition: 'Sincronización biológica de 24 horas regulada por el núcleo supraquiasmático y receptores de luz melanopsínicos.',
      detailedExplanation: 'La liberación de melatonina por la glándula pineal al anochecer reduce la temperatura corporal central e inicia las fases de sueño No-REM (Profundo) y REM.',
      clinicalRelevance: 'La interrupción lumínica nocturna altera la sensibilidad a la insulina y la secreción de leptina/grelina.',
      authoritativeAgent: 'SleepSupervisorAgent',
      relatedTerms: ['Melatonina', 'Sueño REM', 'Sueño Profundo'],
    },
    {
      id: 'tef',
      term: 'Efecto Térmico de los Alimentos (TEF)',
      category: 'Nutrición',
      shortDefinition: 'Porcentaje de energía consumida utilizado para digerir, absorber y metabolizar los macronutrientes.',
      detailedExplanation: 'La proteína presenta el mayor TEF (~20-30%), mientras que los carbohidratos (5-10%) y grasas (0-3%) requieren menor costo metabólico para su asimilación.',
      clinicalRelevance: 'Optimiza la saciedad y el gasto calórico total diario (TDEE).',
      authoritativeAgent: 'NutritionSupervisorAgent',
      relatedTerms: ['TDEE', 'Balance Calórico', 'Proteína'],
    },
    {
      id: 'antropometria',
      term: 'Antropometría & Masa Magra',
      category: 'Antropometría',
      shortDefinition: 'Evaluación cuantitativa de proporciones corporales, composición libre de grasa y masa esquelética.',
      detailedExplanation: 'Combina pliegues cutáneos, perímetros corporales y bioimpedancia para diferenciar entre fluctuaciones hídricas y masa muscular real.',
      clinicalRelevance: 'Métrica soberana para evaluar recomposición corporal sin caer en la ilusión del peso total en báscula.',
      authoritativeAgent: 'BodySupervisorAgent',
      relatedTerms: ['IMC', 'Masa Libre de Grasa', 'Bioimpedancia'],
    },
  ];

  const categories = ['Todos', 'Bioquímica', 'Nutrición', 'Fisiología', 'Circadiano', 'Agentes AI', 'Antropometría'];

  const filteredTerms = terms.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.detailedExplanation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* HEADER DE LA BIBLIOTECA */}
      <div className="bg-[#111017] p-6 lg:p-8 rounded-[36px] border border-[#7C3AED]/40 shadow-2xl space-y-4">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.3em]">
              BIBLIOTECA & GLOSARIO TÉCNICO AION
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mt-1 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#7C3AED] text-3xl">menu_book</span>
              Enciclopedia Metabólica & Agentes
            </h2>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-[#7C3AED]/15 text-[#C4B5FD] text-xs font-bold border border-[#7C3AED]/30">
            {terms.length} TERMINOS DOCUMENTADOS
          </span>
        </div>

        {/* BARRA DE BÚSQUEDA CENTRAL */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar término bioquímico, síntoma, parámetro o agente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#070709] border border-white/15 rounded-full px-12 py-3.5 text-sm text-white placeholder:text-[#CCC3D8]/40 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] outline-none transition-all shadow-inner"
          />
          <span className="material-symbols-outlined absolute left-4 top-3.5 text-[#CCC3D8]">search</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3.5 text-[#CCC3D8] hover:text-white"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* CHIPS DE FILTRO POR CATEGORÍA */}
        <div className="flex gap-2 flex-wrap pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/30'
                  : 'bg-white/5 border border-white/10 text-[#CCC3D8]/70 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* LISTADO DE TÉRMINOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map((term) => {
          const isExpanded = expandedTermId === term.id;
          return (
            <div
              key={term.id}
              className="dashboard-card rounded-3xl p-6 space-y-4 border border-white/5 hover:border-[#7C3AED]/40 transition-all cursor-pointer"
              onClick={() => setExpandedTermId(isExpanded ? null : term.id)}
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[9px] font-bold text-[#D6B36A] uppercase tracking-widest">
                    {term.category} • Supervisor: {term.authoritativeAgent}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{term.term}</h3>
                </div>
                <span className="material-symbols-outlined text-[#7C3AED]">
                  {isExpanded ? 'expand_less' : 'expand_more'}
                </span>
              </div>

              <p className="text-xs text-[#CCC3D8] leading-relaxed">{term.shortDefinition}</p>

              {isExpanded && (
                <div className="pt-3 border-t border-white/10 space-y-3 text-xs">
                  <div>
                    <h4 className="text-[10px] font-bold text-[#C4B5FD] uppercase tracking-wider mb-1">Mecanismo Fisiológico / Detalle</h4>
                    <p className="text-white/80 leading-relaxed">{term.detailedExplanation}</p>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-wider mb-1">Relevancia Clínica</h4>
                    <p className="text-white/80 leading-relaxed">{term.clinicalRelevance}</p>
                  </div>

                  {term.imageUrl && (
                    <div className="rounded-2xl overflow-hidden border border-white/10 mt-2">
                      <img src={term.imageUrl} alt={term.term} className="w-full h-48 object-cover" />
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap pt-2">
                    {term.relatedTerms.map((rel) => (
                      <span key={rel} className="px-2.5 py-0.5 rounded-md bg-white/5 text-[10px] text-[#CCC3D8] border border-white/5">
                        #{rel}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
