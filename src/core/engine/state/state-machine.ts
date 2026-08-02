/**
 * Download lifecycle states.
 *
 * Mapping to the module spec's names:
 *   idle → Created, probing → Analyzing, ready → (metadata resolved),
 *   queued → Queued, downloading → Downloading, paused → Paused,
 *   completed → Completed, cancelled → Cancelled, failed → Failed.
 *
 * The lowercase names are kept because the UI and stores already use them.
 */
export type DownloadState =
  | 'idle'
  | 'probing'
  | 'ready'
  | 'queued'
  | 'downloading'
  | 'paused'
  | 'completed'
  | 'cancelled'
  | 'failed';

/**
 * Allowed transitions. A state maps to the set of states reachable from it.
 * Terminal states (`completed`, `cancelled`) map to an empty list.
 */
const TRANSITIONS: Record<DownloadState, readonly DownloadState[]> = {
  idle: ['probing', 'cancelled'],
  probing: ['ready', 'failed', 'cancelled'],
  ready: ['queued', 'cancelled'],
  queued: ['downloading', 'cancelled'],
  downloading: ['paused', 'completed', 'failed', 'cancelled'],
  paused: ['downloading', 'cancelled'],
  failed: ['queued', 'cancelled'],
  completed: [],
  cancelled: [],
};

/** Returns true if moving from `from` to `to` is a valid transition. */
export function canTransition(from: DownloadState, to: DownloadState): boolean {
  return TRANSITIONS[from].includes(to);
}

/** True when no further transitions are possible from this state. */
export function isTerminal(state: DownloadState): boolean {
  return TRANSITIONS[state].length === 0;
}

/**
 * Validates a transition and returns the target state. Throws a plain error
 * on an illegal transition — callers in the controller catch and wrap this,
 * but it should never fire in correct code, so it signals a bug, not a
 * user-facing condition.
 */
export function transition(from: DownloadState, to: DownloadState): DownloadState {
  if (!canTransition(from, to)) {
    throw new Error(`Illegal download transition: ${from} → ${to}`);
  }
  return to;
}
