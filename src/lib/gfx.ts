// @dada78641/bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import path from 'node:path'
import Chk, {type FileAccess} from 'bw-chk'
import {getBwGraphicsPath} from '@dada78641/bwmapgfx'
import {isFileReadable} from './util.ts'

// Cached graphics objects produced by bw-chk.
const cachedBwGraphics = new Map()

/**
 * Adds a default fallback and resolves the path.
 */
function resolveGfxPath(userGfxPath?: string | null) {
  return path.resolve(userGfxPath == null ? getBwGraphicsPath() : userGfxPath)
}

/**
 * Unloads a cached graphics object by its path.
 */
export function unloadBwGraphics(userGfxPath?: string | null) {
  const gfxPath = resolveGfxPath(userGfxPath)
  cachedBwGraphics.delete(gfxPath)
}

/**
 * Unloads all cached graphics objects.
 */
export function unloadAllBwGraphics() {
  for (const gfxPath of cachedBwGraphics.keys()) {
    cachedBwGraphics.delete(gfxPath)
  }
}

/**
 * Opens the Brood War graphics needed to render map files.
 * 
 * All loaded graphics objects are cached for future reuse.
 */
export function loadBwGraphics(userGfxPath?: string | null): FileAccess {
  // If the user supplies a path, use that; otherwise, have our package provide it.
  const gfxPath = resolveGfxPath(userGfxPath)

  if (!isFileReadable(gfxPath)) {
    throw new Error(`graphics path is not readable: ${gfxPath}`)
  }

  // Don't load objects multiple times.
  if (cachedBwGraphics.has(gfxPath)) {
    return cachedBwGraphics.get(gfxPath)
  }
  
  const gfxData = Chk.fsFileAccess(gfxPath)
  cachedBwGraphics.set(gfxPath, gfxData)
  return gfxData
}
