import type { TaskContract, WorkerDescriptor } from './types';

export interface WorkerScore {
  worker: WorkerDescriptor;
  score: number;
  missingCapabilities: string[];
}

export function scoreWorker(task: TaskContract, worker: WorkerDescriptor): WorkerScore {
  const missing = task.preferredCapabilities.filter((cap) => !worker.capabilities.includes(cap));
  let score = 100;

  score -= missing.length * 25;
  score -= worker.costTier * 4;
  score -= worker.activeTasks * 8;
  if (worker.status !== 'online') score -= 100;
  if (worker.activeTasks >= worker.maxConcurrent) score -= 100;
  if (worker.location === 'home-pc' && task.preferredCapabilities.includes('local-gpu')) score += 20;
  if (worker.kind === 'script' && task.preferredCapabilities.includes('deterministic')) score += 25;

  return { worker, score, missingCapabilities: missing };
}

export function selectWorker(task: TaskContract, workers: WorkerDescriptor[]): WorkerDescriptor | null {
  const ranked = workers.map((worker) => scoreWorker(task, worker)).sort((a, b) => b.score - a.score);
  const best = ranked[0];
  return best && best.score > 0 ? best.worker : null;
}
