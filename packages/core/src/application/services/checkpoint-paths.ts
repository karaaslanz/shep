import { homedir } from 'node:os';
import { join } from 'node:path';

/**
 * Resolve the directory that owns LangGraph checkpoint databases.
 *
 * SHEP_HOME is the process-wide isolation boundary for Shep-owned state.
 * Keeping checkpoint resolution in the application layer lets both application
 * cleanup and infrastructure workers share the same policy without introducing
 * an application -> infrastructure dependency.
 */
export function getShepCheckpointDir(): string {
  const shepHome = process.env.SHEP_HOME ?? join(homedir(), '.shep');
  return join(shepHome, 'checkpoints');
}

/** Resolve a feature-agent checkpoint database path. */
export function getFeatureCheckpointPath(checkpointId: string): string {
  return join(getShepCheckpointDir(), `${checkpointId}.db`);
}

/** Resolve a cluster-agent checkpoint database path. */
export function getClusterCheckpointPath(checkpointId: string): string {
  return join(getShepCheckpointDir(), `cluster-${checkpointId}.db`);
}
