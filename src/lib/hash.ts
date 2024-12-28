// @dada78641/bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import XXH from 'xxhashjs'
import {type ChkInstance} from 'bw-chk'

// To ensure our hashes are unique.
const HASH_MAGIC = 0xDADA

/**
 * Returns a 64-bit xxHash hash value for the given parsed map.
 * 
 * This hash is designed to be used for caching purposes.
 */
export function getMapHash(mapMetadata: ChkInstance): string {
  const hash = XXH.h64(HASH_MAGIC)
  hash.update(mapMetadata._tiles)
  for (const unit of mapMetadata.units) {
    const buffer = new ArrayBuffer(20)
    const view = new Uint32Array(buffer)
    view[0] = unit.x
    view[1] = unit.y
    view[2] = unit.unitId
    view[3] = unit.player
    view[4] = unit.resourceAmt ?? 0
    hash.update(buffer)
  }
  for (const sprite of mapMetadata.sprites) {
    const buffer = new ArrayBuffer(12)
    const view = new Uint32Array(buffer)
    view[0] = sprite.x
    view[1] = sprite.y
    view[2] = sprite.spriteId
    hash.update(buffer)
  }
  return hash.digest().toString(16)
}
