/** Package-owned invariant companion for deep research. */

import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

/**
 * No runtime invariant: the storage domain owns persistence and the prompt,
 * tool, and Remote registries own every cross-plugin contribution.
 */
const install: InvariantInstaller = () => {}

/** Companion name. */
export const name = 'deepresearch-invariant'
/** Required registry. */
export const inject = ['invariants']
/** Reserve this package's invariant ownership. */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register('@deepseek-ai/dsh-deepresearch', install))
