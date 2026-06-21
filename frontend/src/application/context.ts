import type { FestivalRepositories } from '../domain/ports';
import { SEED_ACTIVITY_LOG } from '../infrastructure/repositories/mock/seedData';

export type DataChangeListener = () => void;

export class ActivityLog {
  private entries: string[];

  constructor(initial: string[] = SEED_ACTIVITY_LOG) {
    this.entries = [...initial];
  }

  add(message: string): void {
    this.entries.unshift(message);
    if (this.entries.length > 20) {
      this.entries = this.entries.slice(0, 20);
    }
  }

  getRecent(limit = 10): string[] {
    return this.entries.slice(0, limit);
  }
}

export class ApplicationContext {
  readonly repositories: FestivalRepositories;
  readonly activityLog: ActivityLog;
  private listeners = new Set<DataChangeListener>();

  constructor(repositories: FestivalRepositories) {
    this.repositories = repositories;
    this.activityLog = new ActivityLog();
  }

  subscribe(listener: DataChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyChange(): void {
    this.listeners.forEach((listener) => listener());
  }
}
