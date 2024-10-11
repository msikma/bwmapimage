// @dada78641/bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import path from 'path'

/**
 * Returns what type of file this is based on its extension.
 */
function getTypeFromFilename(filepath) {
  const parsed = path.parse(filepath)
  if (['.scx', '.scm'].includes(parsed.ext)) {
    return 'map'
  }
  if (['.rep'].includes(parsed.ext)) {
    return 'replay'
  }
  throw new Error(`File "${filepath}" is neither a map nor a replay`)
}

/**
 * Returns what type of file is contained in a given buffer.
 */
function getFileTypeFromBuffer(buffer) {
  // Checking whether we're dealing with a map or a replay is very simple:
  // a map will always start with MPQ, and a replay will not.
  const magic = buffer.subarray(0, 3).toString('ascii')
  return magic === 'MPQ' ? 'map' : 'replay'
}

/**
 * Returns what type of file this is.
 * 
 * The passed data is either a buffer or a string; if it's a string, it's assumed
 * to be a filepath, and we'll attempt to make the determination by file extension.
 * 
 * If it's a buffer, we'll check the buffer itself for a given magic byte sequence.
 * 
 * This returns either "map" or "replay". If forceType is set, the given type must be valid.
 */
export function getFileType(file, forceType = null) {
  if (forceType) {
    // Ensure we passed a real type.
    if (!['map', 'replay'].includes(forceType)) {
      throw new Error(`File type "${forceType}" must be "map" or "replay"`)
    }
    // Skip the check if the caller already knows what type this is.
    return forceType
  }
  if (Buffer.isBuffer(file)) {
    return getFileTypeFromBuffer(file)
  }
  else {
    return getTypeFromFilename(file)
  }
}
