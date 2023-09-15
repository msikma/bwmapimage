// bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import {encodeImageData} from './encode.js'
import {wrapMetadata} from './metadata.js'

/** The only valid tile sizes for generating a map image. */
const VALID_TILE_SIZE = [32, 16, 8]

/**
 * Generates a map image stream from a bw-chk map object.
 * 
 * The generated image is an uncompressed bitmap (like a .bmp file).
 * 
 * The given tile size must be one of {32, 16, 8}. The default, 32, denotes a fully zoomed in image.
 */
async function renderBitmapData(gfxObj, mapObj, tileSize = 32) {
  if (!VALID_TILE_SIZE.includes(tileSize)) {
    throw new Error(`Invalid tile size: must be one of {${VALID_TILE_SIZE.join(', ')}}`)
  }
  const bitmap = await mapObj.image(gfxObj, mapObj.size[0] * tileSize, mapObj.size[1] * tileSize)
  const bitmapWidth = mapObj.size[0] * tileSize
  const bitmapHeight = mapObj.size[1] * tileSize
  return [bitmap, {width: bitmapWidth, height: bitmapHeight, tilesetId: mapObj.tileset}]
}

/**
 * Renders an image of a given map.
 * 
 * The filetype is either "map" or "replay", which affects how we obtain the chk data.
 */
export async function renderImage(mapData, filetype, gfxObj, options) {
  const [bitmap, bmpMetadata] = await renderBitmapData(gfxObj, mapData, options.tileSize)
  const [imgBuffer, imgMetadata] = await encodeImageData(bitmap, bmpMetadata.width, bmpMetadata.height, options)
  return [imgBuffer, wrapMetadata(imgMetadata, bmpMetadata, filetype, options)]
}
