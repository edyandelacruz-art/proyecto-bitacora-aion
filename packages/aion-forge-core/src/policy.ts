import type { PolicyDecision, RiskLevel, TaskContract } from './types';

export type Action =
  | 'read_repo'
  | 'write_worktree'
  | 'run_tests'
  | 'create_pr'
  | 'deploy_preview'
  | 'deploy_production'
  | 'modify_db_schema'
  | 'delete_data'
  | 'change_secrets'
  | 'browser_submit';

const alwaysApproval = new Set<Action>([
  'deploy_production',
  'modify_db_schema',
  'delete_data',
  'change_secrets',
  'browser_submit'
]);

export function evaluateAction(task: TaskContract, action: Action): PolicyDecision {
  const reasons: string[] = [];

  if (action === 'deploy_production' && !task.scope.allowProductionDeploy) {
    return { allowed: false, requiresApproval: true, reasons: ['Production deployment is outside task scope.'] };
  }
  if (action === 'modify_db_schema' && !task.scope.allowDatabaseSchemaChanges) {
    return { allowed: false, requiresApproval: true, reasons: ['Database schema changes are outside task scope.'] };
  }
  if (action === 'delete_data' && !task.scope.allowDelete) {
    return { allowed: false, requiresApproval: true, reasons: ['Destructive actions are disabled for this task.'] };
  }

  const requiresApproval =
    task.autonomy !== 'auto' ||
    alwaysApproval.has(action) ||
    task.risk === 'high' ||
    task.risk === 'critical';

  if (requiresApproval) reasons.push('Human approval required by autonomy/risk policy.');
  return { allowed: true, requiresApproval, reasons };
}

export function riskWeight(risk: RiskLevel): number {
  return { low: 1, medium: 2, high: 4, critical: 8 }[risk];
}
