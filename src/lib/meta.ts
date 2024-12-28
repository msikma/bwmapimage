// @dada78641/bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import path from 'node:path'
import type {ChkInstance} from 'bw-chk'
import {type ImageMetadata} from './encode.ts'
import {getMapHash} from './hash.ts'
import type {MapImageOptions} from './options.ts'
import {getRecommendedBasename, getRecommendedPath, parseTargetFilename, getRecommendedExtension, getMimeType} from './util.ts'

export interface ChkMetadata {
  title: string
  description: string
  encoding: string
  hash: string
  tilesetId: number
  tileWidth: number
  tileHeight: number
}

export type OutputMetadata = {
  filepath: string
  filename: string
  basename: string
  extension: string
  mime: string
} & ImageMetadata

/**
 * Returns an object of Chk (map) metadata, such as the map title and description.
 */
export function getChkMetadata(chk: ChkInstance): ChkMetadata {
  return {
    title: chk.title,
    description: chk.description,
    hash: getMapHash(chk),
    encoding: chk.encoding(),
    tilesetId: chk.tileset,
    tileWidth: chk.size[0],
    tileHeight: chk.size[1],
  }
}

/**
 * Adds the given target filename to the image metadata object.
 * 
 * Normally, we return an object of metadata containing a recommended filename.
 * 
 * When the user calls bwMapImage.renderMapImageToFile(), they can choose to provide their own filename.
 * In this case, we reflect this given filename back to the caller, as they have already decided
 * where the file should go. This replaces the recommended filename information we generated earlier.
 * 
 * If useInputDirectory and the caller's provided filename is not an absolute path, the input directory is used.
 * If no target filename is provided at all, the metadata is returned unchanged.
 */
export function replaceTargetFilename(input: string | Buffer, outputMetadata: OutputMetadata, targetFilename: string | undefined, options: MapImageOptions): OutputMetadata {
  if (targetFilename === undefined) {
    // If no target filename is provided, we just reflect the original metadata back.
    // It already contains a generated filename.
    return outputMetadata
  }

  const parsed = parseTargetFilename(targetFilename, input, options.useInputDirectory)
  const basename = parsed.name
  const extension = parsed.ext
  const filename = `${basename}${extension}`
  const filepath = path.join(parsed.dir, filename)
  
  return {
    ...outputMetadata,
    filepath,
    filename,
    basename,
    extension,
  }
}

/**
 * Returns an object of image metadata.
 */
export function addOutputMetadata(input: string | Buffer, imageMetadata: ImageMetadata, mapMetadata: ChkMetadata, options: MapImageOptions): OutputMetadata {
  const basename = getRecommendedBasename(input, mapMetadata)
  const extension = getRecommendedExtension(imageMetadata.format)
  const mime = getMimeType(extension)
  const filename = `${basename}${extension}`
  const filepath = getRecommendedPath(filename, input, options.useInputDirectory)

  return {
    filepath,
    filename,
    basename,
    extension,
    mime,
    ...imageMetadata,
  }
}
