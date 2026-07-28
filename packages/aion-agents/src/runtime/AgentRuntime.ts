import {
  AgentMetadata,
  AgentInvocationResult,
  AgentDomain,
  EvidenceLevel,
} from '@aion/shared-types';
import { AionMemoryStore } from '@aion/memory';

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<string, AgentMetadata> = new Map();

  private constructor() {
    this.registerDefaultAgents();
  }

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  public registerAgent(metadata: AgentMetadata): void {
    this.agents.set(metadata.agentId, metadata);
  }

  public getAgent(agentId: string): AgentMetadata | undefined {
    return this.agents.get(agentId);
  }

  public getAgentsByDomain(domain: AgentDomain): AgentMetadata[] {
    return Array.from(this.agents.values()).filter((a) => a.domain === domain);
  }

  public getAllAgents(): AgentMetadata[] {
    return Array.from(this.agents.values());
  }

  private registerDefaultAgents(): void {
    const defaultList: AgentMetadata[] = [
      // Aegis Core
      { agentId: 'aegis-core', name: 'AION Aegis Core', role: 'Orquestador Soberano Interno de Aegis', domain: 'CROSS_DOMAIN', capabilities: ['nlp', 'multimodal', 'orchestration'], acceptedInputs: ['text', 'image', 'audio'], producedOutputs: ['unified_reply'], tools: ['invokeSupervisor', 'consultMemory'], memoryScope: 'universal', writePermissions: ['ledger', 'plan'], readPermissions: ['all'], riskLevel: 'LOW', confirmationPolicy: 'SILENT_AUTO', confidencePolicy: 0.9, version: '1.0.0', status: 'ACTIVE' },

      // Supervisores por Módulo
      { agentId: 'nutrition-supervisor', name: 'Nutrition Supervisor Agent', role: 'Supervisor del Módulo de Alimentación', domain: 'NUTRITION', capabilities: ['meal_interpretation', 'nutrient_summary'], acceptedInputs: ['text', 'image'], producedOutputs: ['meal_record'], tools: ['processMealInput', 'calculateNutrients'], memoryScope: 'nutrition', writePermissions: ['meals'], readPermissions: ['nutrition', 'inventory'], riskLevel: 'LOW', confirmationPolicy: 'ASK_IF_LOW_CONFIDENCE', confidencePolicy: 0.85, version: '1.0.0', status: 'ACTIVE' },
      { agentId: 'metabolism-supervisor', name: 'Metabolism Supervisor Agent', role: 'Supervisor del Módulo de Metabolismo y Fisiología', domain: 'METABOLISM', capabilities: ['phase_estimation', 'biochemical_analysis'], acceptedInputs: ['hours_elapsed', 'last_meal'], producedOutputs: ['metabolic_state'], tools: ['translateMetabolicExplanation'], memoryScope: 'metabolism', writePermissions: ['metabolic_state'], readPermissions: ['meals', 'activity', 'sleep'], riskLevel: 'LOW', confirmationPolicy: 'SILENT_AUTO', confidencePolicy: 0.9, version: '1.0.0', status: 'ACTIVE' },
      { agentId: 'sleep-supervisor', name: 'Sleep Supervisor Agent', role: 'Supervisor del Módulo de Sueño y Recuperación', domain: 'SLEEP', capabilities: ['sleep_tracking', 'circadian_analysis'], acceptedInputs: ['sleep_times', 'quality'], producedOutputs: ['sleep_record'], tools: ['saveSleepRecord'], memoryScope: 'sleep', writePermissions: ['sleep'], readPermissions: ['sleep', 'activity'], riskLevel: 'LOW', confirmationPolicy: 'SILENT_AUTO', confidencePolicy: 0.9, version: '1.0.0', status: 'ACTIVE' },
      { agentId: 'activity-supervisor', name: 'Activity Supervisor Agent', role: 'Supervisor del Módulo de Actividad y Ejercicio', domain: 'ACTIVITY', capabilities: ['exercise_tracking', 'energy_expenditure'], acceptedInputs: ['exercise_text', 'rpe'], producedOutputs: ['activity_record'], tools: ['saveActivityRecord'], memoryScope: 'activity', writePermissions: ['activity'], readPermissions: ['activity', 'symptoms'], riskLevel: 'LOW', confirmationPolicy: 'SILENT_AUTO', confidencePolicy: 0.9, version: '1.0.0', status: 'ACTIVE' },
      { agentId: 'hydration-supervisor', name: 'Hydration Supervisor Agent', role: 'Supervisor del Módulo de Hidratación', domain: 'HYDRATION', capabilities: ['water_tracking', 'fluid_balance'], acceptedInputs: ['fluid_ml'], producedOutputs: ['hydration_record'], tools: ['saveHydrationRecord'], memoryScope: 'hydration', writePermissions: ['hydration'], readPermissions: ['hydration'], riskLevel: 'LOW', confirmationPolicy: 'SILENT_AUTO', confidencePolicy: 0.95, version: '1.0.0', status: 'ACTIVE' },
      { agentId: 'state-supervisor', name: 'State Supervisor Agent', role: 'Supervisor de Energía, Ánimo, Hambre y Foco', domain: 'STATE', capabilities: ['subjective_state_analysis'], acceptedInputs: ['scores_1_to_10'], producedOutputs: ['state_record'], tools: ['saveStateRecord'], memoryScope: 'state', writePermissions: ['state'], readPermissions: ['state'], riskLevel: 'LOW', confirmationPolicy: 'SILENT_AUTO', confidencePolicy: 0.9, version: '1.0.0', status: 'ACTIVE' },
      { agentId: 'medication-supervisor', name: 'Medication Supervisor Agent', role: 'Supervisor de Medicación y Suplementos', domain: 'MEDICATION', capabilities: ['adherence_tracking', 'reminder_management'], acceptedInputs: ['medication_text'], producedOutputs: ['medication_record'], tools: ['saveMedicationRecord'], memoryScope: 'medication', writePermissions: ['medication'], readPermissions: ['medication'], riskLevel: 'MEDIUM', confirmationPolicy: 'ASK_IF_LOW_CONFIDENCE', confidencePolicy: 0.95, version: '1.0.0', status: 'ACTIVE' },
      { agentId: 'symptoms-supervisor', name: 'Symptoms Supervisor Agent', role: 'Supervisor de Dolor y Síntomas', domain: 'SYMPTOMS', capabilities: ['pain_tracking', 'red_flag_alerting'], acceptedInputs: ['pain_text'], producedOutputs: ['symptom_record'], tools: ['saveSymptomRecord'], memoryScope: 'symptoms', writePermissions: ['symptoms'], readPermissions: ['symptoms'], riskLevel: 'HIGH', confirmationPolicy: 'ALWAYS_ASK', confidencePolicy: 0.9, version: '1.0.0', status: 'ACTIVE' },
      { agentId: 'body-supervisor', name: 'Body Supervisor Agent', role: 'Supervisor de Peso, Medidas y Composición Corporal', domain: 'BODY', capabilities: ['measurement_tracking', 'trend_analysis'], acceptedInputs: ['weight_kg', 'waist_cm'], producedOutputs: ['body_record'], tools: ['saveBodyRecord'], memoryScope: 'body', writePermissions: ['body'], readPermissions: ['body'], riskLevel: 'LOW', confirmationPolicy: 'SILENT_AUTO', confidencePolicy: 0.95, version: '1.0.0', status: 'ACTIVE' },
      { agentId: 'habits-supervisor', name: 'Habits Supervisor Agent', role: 'Supervisor de Hábitos y Rutinas', domain: 'HABITS', capabilities: ['routine_discovery', 'adherence_scoring'], acceptedInputs: ['habit_check'], producedOutputs: ['habit_record'], tools: ['saveHabitRecord'], memoryScope: 'habits', writePermissions: ['habits'], readPermissions: ['habits'], riskLevel: 'LOW', confirmationPolicy: 'SILENT_AUTO', confidencePolicy: 0.9, version: '1.0.0', status: 'ACTIVE' },
      { agentId: 'inventory-home-supervisor', name: 'Inventory & Home Supervisor Agent', role: 'Supervisor de Despensa, Compras y Hogar', domain: 'INVENTORY_HOME', capabilities: ['inventory_tracking', 'receipt_parsing'], acceptedInputs: ['item_text', 'receipt_image'], producedOutputs: ['inventory_transaction'], tools: ['addInventoryTransaction'], memoryScope: 'inventory', writePermissions: ['inventory', 'transactions'], readPermissions: ['inventory'], riskLevel: 'LOW', confirmationPolicy: 'SILENT_AUTO', confidencePolicy: 0.9, version: '1.0.0', status: 'ACTIVE' },
      { agentId: 'live-plan-supervisor', name: 'Live Plan Supervisor Agent', role: 'Supervisor de Plan Vivo y Reorganización', domain: 'LIVE_PLAN', capabilities: ['dynamic_replanning', 'constraint_solving'], acceptedInputs: ['event_change'], producedOutputs: ['live_plan'], tools: ['recalculateLivePlan'], memoryScope: 'plan', writePermissions: ['plan'], readPermissions: ['all'], riskLevel: 'LOW', confirmationPolicy: 'SILENT_AUTO', confidencePolicy: 0.9, version: '1.0.0', status: 'ACTIVE' },

      // Shared Expert Layer
      { agentId: 'physiology-expert', name: 'Physiology Expert Agent', role: 'Experto en Fisiología Humana', domain: 'CROSS_DOMAIN', capabilities: ['physiological_reasoning'], acceptedInputs: ['context'], producedOutputs: ['explanation'], tools: ['analyzePhysiology'], memoryScope: 'shared', writePermissions: [], readPermissions: ['all'], riskLevel: 'LOW', confirmationPolicy: 'SILENT_AUTO', confidencePolicy: 0.9, version: '1.0.0', status: 'ACTIVE' },
      { agentId: 'biochemistry-expert', name: 'Biochemistry Expert Agent', role: 'Experto en Rutas Bioquímicas y Enzimas', domain: 'CROSS_DOMAIN', capabilities: ['biochemical_pathways'], acceptedInputs: ['phase'], producedOutputs: ['multi_paragraph_explanation'], tools: ['analyzePathways'], memoryScope: 'shared', writePermissions: [], readPermissions: ['all'], riskLevel: 'LOW', confirmationPolicy: 'SILENT_AUTO', confidencePolicy: 0.95, version: '1.0.0', status: 'ACTIVE' },
      { agentId: 'audit-agent', name: 'Universal Audit Agent', role: 'Auditor Transversal de Evidencia y Transacciones', domain: 'CROSS_DOMAIN', capabilities: ['transaction_auditing', 'rollback'], acceptedInputs: ['ledger_entry'], producedOutputs: ['audit_receipt'], tools: ['verifyLedger'], memoryScope: 'universal', writePermissions: ['ledger'], readPermissions: ['all'], riskLevel: 'LOW', confirmationPolicy: 'SILENT_AUTO', confidencePolicy: 1.0, version: '1.0.0', status: 'ACTIVE' },
    ];

    defaultList.forEach((a) => this.registerAgent(a));
  }
}

export class AgentRuntime {
  private static instance: AgentRuntime;
  private registry = AgentRegistry.getInstance();
  private memoryStore = AionMemoryStore.getInstance();

  private constructor() {}

  public static getInstance(): AgentRuntime {
    if (!AgentRuntime.instance) {
      AgentRuntime.instance = new AgentRuntime();
    }
    return AgentRuntime.instance;
  }

  public async invokeAgent<T = any>(
    agentId: string,
    inputPayload: any,
    evidenceLevel: EvidenceLevel = 'USER_CONFIRMED'
  ): Promise<AgentInvocationResult<T>> {
    const startTime = Date.now();
    const metadata = this.registry.getAgent(agentId);

    if (!metadata) {
      return {
        invocationId: `inv-err-${Date.now()}`,
        agentId,
        timestamp: new Date().toISOString(),
        success: false,
        error: `Agente con ID "${agentId}" no está registrado en AgentRegistry.`,
        confidence: 0,
        evidence: 'UNKNOWN',
        executionTimeMs: Date.now() - startTime,
        toolsUsed: [],
        reasoningSummary: 'Fallo de registro.',
      };
    }

    try {
      // Registrar invocación en Aegis Ledger
      this.memoryStore.addLedgerEntry({
        id: `led-inv-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'recommendation',
        source: 'agent',
        authoritativeModule: metadata.domain,
        agentsInvoked: [agentId],
        toolsInvoked: metadata.tools,
        payload: { inputPayload },
        evidence: evidenceLevel,
        confidence: metadata.confidencePolicy,
      });

      return {
        invocationId: `inv-${Date.now()}`,
        agentId,
        timestamp: new Date().toISOString(),
        success: true,
        output: inputPayload as T,
        confidence: metadata.confidencePolicy,
        evidence: evidenceLevel,
        executionTimeMs: Date.now() - startTime,
        toolsUsed: metadata.tools,
        reasoningSummary: `Ejecución exitosa de ${metadata.name} (${metadata.role}).`,
      };
    } catch (err: any) {
      return {
        invocationId: `inv-err-${Date.now()}`,
        agentId,
        timestamp: new Date().toISOString(),
        success: false,
        error: err.message || 'Error durante la ejecución del agente.',
        confidence: 0,
        evidence: 'UNKNOWN',
        executionTimeMs: Date.now() - startTime,
        toolsUsed: metadata.tools,
        reasoningSummary: `Fallo durante ejecución: ${err.message}`,
      };
    }
  }

  public getRegistry(): AgentRegistry {
    return this.registry;
  }
}
