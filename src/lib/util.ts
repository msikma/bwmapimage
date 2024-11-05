// @dada78641/bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import stripAnsi from 'strip-ansi'
import filenamify from 'filenamify'
import mime from 'mime-types'
import path from 'node:path'
import {fileURLToPath} from 'url'
import {promises as fs, constants} from 'node:fs'
import {type ChkMetadata} from './meta.ts'

/**
 * Returns a target filename based on the user's supplied value.
 * 
 * If the target filename is not absolute, useInputDirectory is relevant.
 */
export function parseTargetFilename(targetFilename: string, input: string | Buffer, useInputDirectory: boolean | undefined): ReturnType<typeof path.parse> {
  // Case 1: user passed an absolute filename, so we'll use that verbatim.
  if (path.isAbsolute(targetFilename)) {
    return path.parse(path.resolve(targetFilename))
  }
  // Case 2: the input is a filename string, and we need to use its directory.
  if (typeof input === 'string' && useInputDirectory) {
    const parsedInput = path.parse(path.resolve(input))
    const parsedOutput = path.parse(targetFilename)
    return path.parse(path.join(parsedInput.dir, parsedOutput.base))
  }
  // Case 3: we have no input directory and need to resolve the target filename.
  return path.parse(path.resolve(targetFilename))
}

/**
 * Returns a recommended full path for the output file.
 * 
 * If useInputDirectory is true, this will use the input file directory.
 * Otherwise, the current working directory is used.
 */
export function getRecommendedPath(recommendedFilename: string, input: string | Buffer, useInputDirectory: boolean | undefined): string {
  const cwd = process.cwd()
  if (typeof input === 'string') {
    // If we're using a filename as input, we'll prepend either the current working directory,
    // or the input file's location.
    const parsed = path.parse(input)
    const base = useInputDirectory ? parsed.dir : cwd
    return path.join(base, recommendedFilename)
  }
  if (Buffer.isBuffer(input)) {
    // For buffer input we don't have an input file location, so we'll always use the cwd instead.
    return path.join(cwd, recommendedFilename)
  }
  throw new Error('invalid input type')
}

/**
 * Returns a recommended file basename.
 * 
 * This does not include a file extension.
 */
export function getRecommendedBasename(input: string | Buffer, mapMetadata: ChkMetadata): string {
  if (Buffer.isBuffer(input)) {
    // Since we don't have an input filename, use the map title.
    const mapTitle = stripAnsi(mapMetadata.title).trim()
    const resolvedMapTitle = mapTitle === '' ? 'unnamed' : mapTitle
    return sanitizeFilename(resolvedMapTitle)
  }

  const parsed = path.parse(input)
  return sanitizeFilename(parsed.name)
}

/**
 * Returns a sanitized filename.
 */
export function sanitizeFilename(filename: string): string {
  return filenamify(stripAnsi(filename.trim()), {replacement: '_'})
}

/**
 * Returns a file extension that's suitable for a generated image based on its format.
 */
export function getRecommendedExtension(format: string) {
  if (format == null) {
    throw new Error(`invalid format string`)
  }

  // This function really exists for a single case: jpeg files should be saved as .jpg.
  switch (format) {
    case 'jpeg':
      return '.jpg'
    default:
      return `.${format}`
  }
}

/**
 * Returns an appropriate MIME type for the given extension.
 */
export function getMimeType(extension: string): string {
  const mimeType = mime.lookup(extension)
  return mimeType === false ? 'application/octet-stream' : mimeType
}

/**
 * Returns the tile size; throws if it's anything but a valid number.
 */
export function getValidatedTileSize(tileSize: number | null | undefined): number {
  if (tileSize !== 32 && tileSize !== 16 && tileSize !== 8) {
    throw new Error(`invalid tile size`)
  }
  return tileSize
}

/**
 * Returns whether a given path exists and is readable.
 */
export async function isFileReadable(filepath: string): Promise<boolean> {
  try {
    await fs.access(filepath, constants.F_OK | constants.R_OK)
    return true
  }
  catch {
    return false
  }
}

/**
 * Writes an image file to disk.
 */
export async function writeImageFile(filepath: string, data: Buffer): Promise<string> {
  await fs.writeFile(filepath, data, null)
  return path.resolve(filepath)
}

/**
 * Returns the path to the package root directory.
 */
export function getPackageRoot(): string {
  const thisDir = path.dirname(fileURLToPath(import.meta.url))
  const pkgDir = path.join(thisDir, '..', '..')
  return pkgDir
}
