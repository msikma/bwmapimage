// @dada78641/bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import type {ChkInstance} from 'bw-chk'
import type {MapImageOptions} from './options.ts'
import {loadBwGraphics} from './gfx.ts'
import {getValidatedTileSize} from './util.ts'

export interface BitmapData {
  buffer: Buffer
  width: number
  height: number
}

/**
 * Renders the parsed map data to a raw pixel buffer.
 */
export async function renderBitmapData(chkData: ChkInstance, options: MapImageOptions): Promise<BitmapData> {
  const {bwGraphicsPath} = options
  const tileSize = getValidatedTileSize(options.tileSize)
  const bwGfxSet = loadBwGraphics(bwGraphicsPath)
  const bitmap = await chkData.image(bwGfxSet, chkData.size[0] * tileSize, chkData.size[1] * tileSize)
  const width = chkData.size[0] * tileSize
  const height = chkData.size[1] * tileSize
  
  return {
    buffer: bitmap,
    width,
    height,
  }
}
