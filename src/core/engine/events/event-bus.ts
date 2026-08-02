import type { EngineEventMap, EngineEventName, EngineEventListener } from './events';

/**
 * A minimal strongly-typed publish/subscribe bus. Listeners registered for an
 * event receive exactly that event's payload type; emitting requires the
 * matching payload. A listener throwing never affects other listeners.
 */
export class EventBus {
  private readonly listeners = new Map<EngineEventName, Set<(payload: unknown) => void>>();

  /**
   * Subscribes to an event. Returns an unsubscribe function; call it on
   * cleanup to avoid leaks.
   */
  on<E extends EngineEventName>(event: E, listener: EngineEventListener<E>): () => void {
    const set = this.listeners.get(event) ?? new Set();
    set.add(listener as (payload: unknown) => void);
    this.listeners.set(event, set);
    return () => set.delete(listener as (payload: unknown) => void);
  }

  /** Emits an event to all current listeners. Errors are isolated per listener. */
  emit<E extends EngineEventName>(event: E, payload: EngineEventMap[E]): void {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const listener of set) {
      try {
        listener(payload);
      } catch {
        // A faulty listener must never break event dispatch for the others.
      }
    }
  }

  /** Removes all listeners. Use on engine teardown. */
  clear(): void {
    this.listeners.clear();
  }
}

/** Shared engine-wide bus instance. */
export const engineBus = new EventBus();
