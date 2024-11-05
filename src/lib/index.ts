// @dada78641/bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import type {ChkInstance, FileAccess} from 'bw-chk'
import {mergeDefaultOptions, type MapImageOptions} from './options.ts'
import {renderBitmapData, type BitmapData} from './render.ts'
import {loadBwGraphics, unloadBwGraphics, unloadAllBwGraphics} from './gfx.ts'
import {replaceTargetFilename, addOutputMetadata, type OutputMetadata} from './meta.ts'
import {encodeImage} from './encode.ts'
import {readMapData} from './read.ts'
import {getChkMetadata, type ChkMetadata} from './meta.ts'
import {writeImageFile} from './util.ts'

interface BwMapImageBaseResult {
  metadata: OutputMetadata
  map: ChkMetadata
  resolvedOptions: MapImageOptions
}
export type BwMapImageResult = BwMapImageBaseResult & {buffer: Buffer}
export type BwMapImageResultFile = BwMapImageBaseResult & {target: string}

export class BwMapImage {
  private input: string | Buffer
  private options: MapImageOptions
  private chkData: ChkInstance | null

  constructor(input: string | Buffer, options: MapImageOptions = {}) {
    this.input = input
    this.options = mergeDefaultOptions(options)
    this.chkData = null

    Object.defineProperty(this, 'chkData', {enumerable: false})
  }

  /**
   * Loads the Brood War graphics into memory for processing.
   * 
   * This does not need to be called; it's done automatically the first time
   * a map image is generated, and the data is always cached for future use.
   */
  public static preloadBwGraphics(gfxPath?: string | null): FileAccess {
    return loadBwGraphics(gfxPath)
  }

  /**
   * Unloads previously loaded Brood War graphics from memory by path.
   */
  public static unloadBwGraphics(gfxPath?: string | null) {
    return unloadBwGraphics(gfxPath)
  }

  /**
   * Unloads all previously loaded Brood War graphics.
   */
  public static unloadAllBwGraphics() {
    return unloadAllBwGraphics()
  }
  
  /**
   * Parses the map data in the provided input file.
   */
  private async parseMapData() {
    if (this.chkData === null) {
      this.chkData = await readMapData(this.input, this.options.forceType)
    }
  }

  /**
   * Renders and encodes a map image from the given input file.
   * 
   * This returns the buffer and an object of map metadata.
   */
  public async renderMapImage(): Promise<BwMapImageResult> {
    await this.parseMapData()
    if (this.chkData === null) {
      throw new Error(`map data is not parsed`)
    }

    const bitmapData = await renderBitmapData(this.chkData, this.options)
    const imageData = await encodeImage(bitmapData, this.options)
    const mapData = await this.getMapMetadata()

    return {
      buffer: imageData.buffer,
      metadata: addOutputMetadata(this.input, imageData.metadata, mapData, this.options),
      map: mapData,
      resolvedOptions: {...this.options},
    }
  }

  /**
   * Renders and encodes a map image from the given input file, and saves the file to disk.
   * 
   * This returns the path of the written file and an object of map metadata.
   */
  public async renderMapImageToFile(targetFilename?: string | undefined): Promise<BwMapImageResultFile> {
    const mapImage = await this.renderMapImage()
    const metadata = replaceTargetFilename(this.input, mapImage.metadata, targetFilename, this.options)
    const target = await writeImageFile(metadata.filepath, mapImage.buffer)

    return {
      target,
      metadata,
      map: mapImage.map,
      resolvedOptions: mapImage.resolvedOptions,
    }
  }

  /**
   * Renders an uncompressed bitmap of raw pixel data.
   * 
   * The pixel data will have 3 channels (RGB) and can be further processed with an image encoder.
   */
  public async renderUncompressedBitmap(): Promise<BitmapData> {
    await this.parseMapData()
    if (this.chkData === null) {
      throw new Error(`map data is not parsed`)
    }

    const bitmapData = await renderBitmapData(this.chkData, this.options)
    return bitmapData
  }

  /**
   * Returns an object of map metadata extracted from the input file.
   */
  public async getMapMetadata(): Promise<ChkMetadata> {
    await this.parseMapData()
    if (this.chkData === null) {
      throw new Error(`map data is not parsed`)
    }

    return getChkMetadata(this.chkData)
  }
}
