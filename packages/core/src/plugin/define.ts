import type { Plugin } from './types';

/**
 * definePlugin — thin wrapper that preserves types and gives authors
 * an ergonomic entry point. No runtime side-effects.
 */
export function definePlugin<const P extends Plugin>(plugin: P): P & Plugin {
  return plugin;
}
