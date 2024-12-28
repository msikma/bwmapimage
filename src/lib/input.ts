// @dada78641/bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import path from 'node:path'
import type {InputType} from './options.ts'

/**
 * Returns what type of file is contained in a given buffer.
 */
function getTypeFromBuffer(buffer: Buffer): InputType {
  // Checking whether we're dealing with a map or a replay is very simple:
  // a map will always start with MPQ, and a replay will not.
  const magic = buffer.subarray(0, 3).toString('ascii')
  return magic === 'MPQ' ? 'map' : 'replay'
}

/**
 * Returns the input filetype from the file extension.
 */
function getTypeFromFilename(filepath: string): InputType {
  const parsed = path.parse(filepath)
  if (['.scx', '.scm'].includes(parsed.ext)) {
    return 'map'
  }
  if (['.rep'].includes(parsed.ext)) {
    return 'replay'
  }
  throw new Error(`file "${filepath}" must be .scm, .scx or .rep`)
}

/**
 * Returns the given input's format.
 */
export function determineInputFormat(input: string | Buffer, forceType: InputType | undefined): InputType {
  if (input == null) {
    throw new Error(`invalid input type`)
  }
  if (forceType !== undefined) {
    if (!['map', 'replay'].includes(forceType)) {
      throw new Error(`file type "${forceType}" must be "map" or "replay"`)
    }
    return forceType
  }
  if (typeof input === 'string') {
    return getTypeFromFilename(input)
  }
  if (Buffer.isBuffer(input)) {
    return getTypeFromBuffer(input)
  }
  throw new Error(`invalid input type`)
}
