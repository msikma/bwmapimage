// bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import XXH from 'xxhashjs'

/**
 * Returns a 64-bit xxHash hash value for the given parsed map.
 * 
 * This hash should be used only for caching purposes, not for identification purposes.
 */
export function getMapHash(mapData) {
  const hash = XXH.h64(0xDADA)
  hash.update(mapData._tiles)
  for (const unit of mapData.units) {
    const buffer = new ArrayBuffer(20)
    const view = new Uint32Array(buffer)
    view[0] = unit.x
    view[1] = unit.y
    view[2] = unit.unitId
    view[3] = unit.player
    view[4] = unit.resourceAmt
    hash.update(buffer)
  }
  for (const sprite of mapData.sprites) {
    const buffer = new ArrayBuffer(12)
    const view = new Uint32Array(buffer)
    view[0] = sprite.x
    view[1] = sprite.y
    view[2] = sprite.spriteId
    hash.update(buffer)
  }
  return hash.digest().toString(16)
}
