import { homedir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  getClusterCheckpointPath,
  getFeatureCheckpointPath,
  getShepCheckpointDir,
} from '@/application/services/checkpoint-paths.js';

const originalShepHome = process.env.SHEP_HOME;

afterEach(() => {
  if (originalShepHome === undefined) {
    delete process.env.SHEP_HOME;
  } else {
    process.env.SHEP_HOME = originalShepHome;
  }
});

describe('checkpoint paths', () => {
  it('uses SHEP_HOME as the checkpoint root when configured', () => {
    process.env.SHEP_HOME = '/tmp/shep-isolated';

    expect(getShepCheckpointDir()).toBe(join('/tmp/shep-isolated', 'checkpoints'));
    expect(getFeatureCheckpointPath('thread-1')).toBe(
      join('/tmp/shep-isolated', 'checkpoints', 'thread-1.db')
    );
    expect(getClusterCheckpointPath('run-1')).toBe(
      join('/tmp/shep-isolated', 'checkpoints', 'cluster-run-1.db')
    );
  });

  it('falls back to ~/.shep/checkpoints when SHEP_HOME is not configured', () => {
    delete process.env.SHEP_HOME;

    expect(getShepCheckpointDir()).toBe(join(homedir(), '.shep', 'checkpoints'));
    expect(getFeatureCheckpointPath('thread-2')).toBe(
      join(homedir(), '.shep', 'checkpoints', 'thread-2.db')
    );
    expect(getClusterCheckpointPath('run-2')).toBe(
      join(homedir(), '.shep', 'checkpoints', 'cluster-run-2.db')
    );
  });
});
