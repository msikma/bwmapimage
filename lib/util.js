// @dada78641/bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import path from 'path'
import os from 'os'

/**
 * Returns the default path where we expect the Brood War graphics to be.
 * 
 * By default this is ~/.config/bwmapimage/. See the readme file for the type of files required.
 */
export function getDefaultBwGraphicsPath() {
  return path.join(os.homedir(), '.config', 'bwmapimage')
}

/**
 * Returns a file extension that's suitable for a generated image based on its format.
 */
export function getRecommendedFileExtension(format) {
  // In practice, only jpeg gets a different file extension.
  switch (format) {
    case 'jpeg':
      return '.jpg'
    default:
      return `.${format}`
  }
}
