// bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import Chk from 'bw-chk'
import {getDefaultBwGraphicsPath} from './util.js'

/**
 * Opens the Brood War graphics needed to render map files.
 * 
 * Returns an object usable by bw-chk.
 */
export function loadBwGraphics(gfxpath) {
  return Chk.fsFileAccess(gfxpath === null ? getDefaultBwGraphicsPath() : gfxpath)
}
