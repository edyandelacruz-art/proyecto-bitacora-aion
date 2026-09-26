import type { WorkerDescriptor } from './types';

export class WorkerRegistry {
  private workers = new Map<string, WorkerDescriptor>();

  upsert(worker: WorkerDescriptor): void {
    this.workers.set(worker.id, { ...worker });
  }

  get(id: string): WorkerDescriptor | undefined {
    const worker = this.workers.get(id);
    return worker ? { ...worker } : undefined;
  }

  list(): WorkerDescriptor[] {
    return [...this.workers.values()].map((worker) => ({ ...worker }));
  }

  remove(id: string): boolean {
    return this.workers.delete(id);
  }
}
