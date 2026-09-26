export type TaskStatus =
  | 'CREATED'
  | 'PLANNING'
  | 'READY'
  | 'QUEUED'
  | 'RUNNING'
  | 'CHECKPOINTED'
  | 'BLOCKED'
  | 'WAITING_AGENT'
  | 'WAITING_EDYAN'
  | 'VERIFYING'
  | 'READY_TO_DEPLOY'
  | 'DEPLOYING'
  | 'DONE'
  | 'FAILED'
  | 'CANCELLED';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type AutonomyMode = 'auto' | 'supervised' | 'manual';
export type WorkerStatus = 'online' | 'busy' | 'offline' | 'degraded';

export interface TaskScope {
  repository?: string;
  baseRef?: string;
  allowedPaths: string[];
  forbiddenPaths: string[];
  allowDelete: boolean;
  allowDependencies: boolean;
  allowDatabaseSchemaChanges: boolean;
  allowProductionDeploy: boolean;
  maxFilesChanged?: number;
}

export interface TaskContract {
  id: string;
  projectId: string;
  title: string;
  goal: string;
  status: TaskStatus;
  risk: RiskLevel;
  autonomy: AutonomyMode;
  scope: TaskScope;
  acceptanceCriteria: string[];
  requiredChecks: string[];
  preferredCapabilities: string[];
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkerDescriptor {
  id: string;
  name: string;
  kind: 'codex' | 'claude-code' | 'gemini' | 'antigravity' | 'local' | 'browser' | 'godot' | 'test' | 'deploy' | 'script';
  status: WorkerStatus;
  capabilities: string[];
  maxConcurrent: number;
  activeTasks: number;
  costTier: 0 | 1 | 2 | 3;
  location: 'cloud' | 'home-pc';
}

export interface PolicyDecision {
  allowed: boolean;
  requiresApproval: boolean;
  reasons: string[];
}

export interface TaskEvent {
  taskId: string;
  type: string;
  at: string;
  actor: string;
  payload?: Record<string, unknown>;
}
