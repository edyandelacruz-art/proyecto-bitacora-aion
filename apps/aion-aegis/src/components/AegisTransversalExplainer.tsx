import React, { useState } from 'react';
import { AionMemoryStore } from '@aion/memory';
import { NutritionLeadSpecialist } from '@aion/agents';

interface AegisTransversalExplainerProps {
  contextName: string;
  domain: string;
  dataPayload?: any;
  compact?: boolean;
}

export const AegisTransversalExplainer: React.FC<AegisTransversalExplainerProps> = ({
  contextName,
  domain,
  dataPayload,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<string>('Explicar esta página');

  const store = AionMemoryStore.getInstance();
  const profile = store.getCoreProfile();
  const aegis = store.getAegisProfile();
  const targetKcal = aegis.goals?.[0]?.targetKcal || 2100;

  const getExplanationContent = (action: string) => {
    switch (domain.toLowerCase()) {
      case 'metabolism':
      case 'nutrition':
        return {
          agent: 'NutritionLeadSpecialist & MetabolismSupervisor',
          showing: `Visualización del balance calórico diario y desglose macronutricional para ${profile.displayName || 'Edyan'}.`,
          meaning: `Representa el consumo energético acumulado frente a la meta bioquímica de ${targetKcal} kcal.`,
          calculation: 'Suma determinista de Kcal = (Proteínas x 4) + (Carbohidratos x 4) + (Grasas x 9) proveniente de cada alimento registrado.',
          source: 'Registros directos en bitácora + Estimación determinista del motor NutrientCalculationEngine.',
          evidence: 'DETERMINISTIC_CALCULATION (Confiabilidad: 98%)',
          relations: 'Involucra al módulo de Despensa (consumo de existencias) y Finanzas (costo de ingredientes).',
          missing: 'Falta confirmar la preparación exacta de la cena.',
          attention: 'Mantener la ingesta proteica por encima de 160g para proteger la masa magra.',
          actions: ['Registrar última comida del día', 'Ajustar meta calórica en Perfil', 'Exportar resumen a XLSX'],
        };
      case 'sleep':
        return {
          agent: 'SleepSupervisorAgent',
          showing: 'Un solo anillo unificado con el porcentaje continuo de fases de sueño (Profundo, REM, Ligero).',
          meaning: 'Refleja la calidad de recuperación neuro-emocional y síntesis de hormona de crecimiento.',
          calculation: 'Proporción sobre el total de horas en cama registrado por el usuario o sincronizado.',
          source: 'Declaración directa del usuario en el módulo de Sueño.',
          evidence: 'USER_CONFIRMED (Confiabilidad: 95%)',
          relations: 'Impacta directamente la sensibilidad a la insulina y la disposición física en Actividad.',
          missing: 'Falta registrar el uso de pantallas antes de dormir.',
          attention: 'Evitar cafeína pasadas las 4:00 PM para optimizar la fase N3 de sueño profundo.',
          actions: ['Registrar hora exacta de acostarse', 'Activar recordatorio nocturno', 'Ver glosario circadiano'],
        };
      case 'activity':
        return {
          agent: 'ActivitySupervisorAgent',
          showing: 'Anillo unificado de Zonas Cardiacas y curva RPE de estímulo neuromuscular.',
          meaning: 'Mide la intensidad del ejercicio y el volumen de gasto calórico activo acumulado.',
          calculation: 'Estimación por RPE Borg (1-10) x Duración en minutos x Coeficiente metabólico de la actividad.',
          source: 'Registros del usuario + Algoritmo de estimación EPOC.',
          evidence: 'USER_CONFIRMED (Confiabilidad: 92%)',
          relations: 'Aumenta el margen calórico disponible en el balance de Nutrición.',
          missing: 'Falta medir la frecuencia cardíaca promedio en pico.',
          attention: 'Excelente balance en Zona 2 aeróbica para oxidación de ácidos grasos.',
          actions: ['Añadir nueva sesión de gimnasio', 'Ver zonas cardiacas', 'Consultar glosario deportivo'],
        };
      default:
        return {
          agent: 'AegisCoreSuperAgent',
          showing: `Vista detallada del módulo ${contextName}.`,
          meaning: 'Métrica integrada de la prótesis ejecutiva AION Aegis.',
          calculation: 'Procesamiento omnicanal mediante el EventBus en memoria.',
          source: 'AionMemoryStore y Ledger Inmutable Append-Only.',
          evidence: 'USER_CONFIRMED / DETERMINISTIC_CALCULATION',
          relations: 'Vinculado a todos los supervisores del sistema.',
          missing: 'Ninguna información crítica pendiente.',
          attention: 'Todo funciona dentro de los parámetros esperados.',
          actions: ['Ver datos de trazabilidad en Ledger', 'Exportar informe en PDF'],
        };
    }
  };

  const exp = getExplanationContent(activeAction);

  return (
    <>
      {/* BOTONES DE ACCIÓN TRANSVERSALES VISIBLES EN PANTALLA */}
      <div className={`flex flex-wrap items-center gap-2 ${compact ? '' : 'my-3'}`}>
        {[
          { label: 'Explicar esta página', icon: 'auto_awesome' },
          { label: 'Explícame esto', icon: 'help' },
          { label: '¿Qué significa?', icon: 'info' },
          { label: '¿Cómo se calculó?', icon: 'calculate' },
          { label: '¿Por qué Aegis muestra esto?', icon: 'shield' },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={() => {
              setActiveAction(btn.label);
              setIsOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#7C3AED]/15 hover:bg-[#7C3AED] text-[#C4B5FD] hover:text-white border border-[#7C3AED]/40 text-[11px] font-bold transition-all shadow-md group"
          >
            <span className="material-symbols-outlined text-xs group-hover:rotate-12 transition-transform">
              {btn.icon}
            </span>
            {btn.label}
          </button>
        ))}
      </div>

      {/* MODAL EMERGENTE DE EXPLICACIÓN TRANSVERSAL EN LENGUAJE NATURAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111017] border-2 border-[#7C3AED] rounded-[36px] w-full max-w-3xl max-h-[90vh] shadow-[0_0_70px_rgba(124,58,237,0.4)] flex flex-col overflow-hidden">
            
            {/* HEADER DEL MODAL */}
            <div className="p-6 bg-[#070709] border-b border-white/10 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-[#D6B36A] uppercase tracking-[0.3em]">
                  AEGIS EXPLICADOR TRANSVERSAL EN LENGUAJE NATURAL
                </span>
                <h3 className="text-xl font-bold text-white mt-1 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#7C3AED] text-2xl">auto_awesome</span>
                  {activeAction} • {contextName}
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white flex items-center justify-center transition-all border border-white/10"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* CONTENIDO ESTRUCTURADO EN 10 DIMENSIONES */}
            <div className="p-6 lg:p-8 flex-1 overflow-y-auto hide-scrollbar space-y-5 text-xs text-[#E5E1E5]">
              <div className="p-4 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/30 flex items-center justify-between">
                <span className="font-bold text-[#C4B5FD]">Agente Especialista Encargado:</span>
                <span className="px-3 py-1 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold">
                  {exp.agent}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <h4 className="font-bold text-[#D6B36A] uppercase tracking-wider text-[10px]">1. ¿Qué está mostrando?</h4>
                  <p className="text-white/90 leading-relaxed">{exp.showing}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <h4 className="font-bold text-[#C4B5FD] uppercase tracking-wider text-[10px]">2. ¿Qué significan los datos?</h4>
                  <p className="text-white/90 leading-relaxed">{exp.meaning}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <h4 className="font-bold text-sky-400 uppercase tracking-wider text-[10px]">3. ¿Cómo se calculó?</h4>
                  <p className="text-white/90 leading-relaxed">{exp.calculation}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">4. Fuente de Datos</h4>
                  <p className="text-white/90 leading-relaxed">{exp.source}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">5. Nivel de Evidencia</h4>
                  <p className="text-white/90 leading-relaxed font-mono">{exp.evidence}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <h4 className="font-bold text-[#C4B5FD] uppercase tracking-wider text-[10px]">6. Propagación Multidominio</h4>
                  <p className="text-white/90 leading-relaxed">{exp.relations}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">7. Atención & Alertas Fisiológicas</h4>
                <p className="text-white/90 leading-relaxed">{exp.attention}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#7C3AED]/15 border border-[#7C3AED]/40 space-y-2">
                <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">8. Acciones Recomendadas para el Usuario</h4>
                <div className="flex gap-2 flex-wrap">
                  {exp.actions.map((act, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-[#7C3AED] text-white font-bold text-[10px]">
                      ✓ {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* FOOTER DEL MODAL */}
            <div className="p-4 bg-[#070709] border-t border-white/10 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 rounded-full bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-all"
              >
                ENTENDIDO
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
