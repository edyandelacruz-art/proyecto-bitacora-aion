import type { TaskStatus } from './types';

const transitions: Record<TaskStatus, readonly TaskStatus[]> = {
  CREATED: ['PLANNING', 'CANCELLED'],
  PLANNING: ['READY', 'BLOCKED', 'CANCELLED'],
  READY: ['QUEUED', 'WAITING_EDYAN', 'CANCELLED'],
  QUEUED: ['RUNNING', 'WAITING_AGENT', 'CANCELLED'],
  RUNNING: ['CHECKPOINTED', 'BLOCKED', 'VERIFYING', 'FAILED', 'CANCELLED'],
  CHECKPOINTED: ['QUEUED', 'RUNNING', 'BLOCKED', 'CANCELLED'],
  BLOCKED: ['READY', 'QUEUED', 'WAITING_EDYAN', 'FAILED', 'CANCELLED'],
  WAITING_AGENT: ['QUEUED', 'CANCELLED'],
  WAITING_EDYAN: ['READY', 'QUEUED', 'READY_TO_DEPLOY', 'CANCELLED'],
  VERIFYING: ['RUNNING', 'READY_TO_DEPLOY', 'DONE', 'FAILED', 'WAITING_EDYAN'],
  READY_TO_DEPLOY: ['DEPLOYING', 'WAITING_EDYAN', 'DONE', 'CANCELLED'],
  DEPLOYING: ['VERIFYING', 'DONE', 'FAILED'],
  DONE: [],
  FAILED: ['PLANNING', 'READY', 'CANCELLED'],
  CANCELLED: []
};

export function canTransition(from: TaskStatus, to: TaskStatus): boolean {
  return transitions[from].includes(to);
}

export function assertTransition(from: TaskStatus, to: TaskStatus): void {
  if (!canTransition(from, to)) {
    throw new Error(`Illegal AION Forge task transition: ${from} -> ${to}`);
  }
}

export function nextStates(status: TaskStatus): readonly TaskStatus[] {
  return transitions[status];
}
