// @dada78641/bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import {tilesetDefinitions, stripMapString} from '@dada78641/bwtoolsdata'
import {loadBwGraphics} from './lib/gfx.js'
import {mergeDefaultOptions} from './lib/options.js'
import {renderImage} from './lib/render.js'
import {readMapData} from './lib/parse.js'
import {getFileType} from './lib/type.js'
import {getMapHash} from './lib/hash.js'

/**
 * Constructs a BwMapImage object.
 * 
 * This object can then be used to parse a map file, and generate an image based on its data.
 * 
 * In most cases, you'll want to just pass the map file path, and then call renderMapImage().
 */
export function BwMapImage(file, userOptions = {}) {
  const options = mergeDefaultOptions(userOptions)
  const filetype = getFileType(file, options.forceType)
  
  // The map data as parsed by bw-chk.
  let mapData = null

  /**
   * Parses the map data; prerequisite to rendering the image.
   * 
   * There is no need to call this manually; it will be done as needed.
   */
  async function _parseMapData() {
    mapData = await readMapData(file, filetype)
  }

  /**
   * Renders the image and returns both the buffer and the metadata.
   */
  async function renderMapImage() {
    if (!mapData) {
      await _parseMapData()
    }
    const [buffer, metadata] = await renderImage(mapData, filetype, loadBwGraphics(options.bwGraphicsPath), options)
    const mapMetadata = await getMapMetadata()
    return [buffer, {...metadata, ...mapMetadata}]
  }

  /**
   * Returns map metadata.
   * 
   * This is *not* the same as the image metadata. Map metadata is strictly
   * about things relevant to the Brood War engine, such as its name and hash.
   * 
   * This metadata is included alongside the image metadata when calling renderMapImage().
   */
  async function getMapMetadata() {
    if (!mapData) {
      await _parseMapData()
    }

    // If the tileset ID is not listed in the tileset definitions, this is an invalid map.
    // Thus we assume this never results in undefined.
    const tilesetData = tilesetDefinitions[mapData.tileset]

    return {
      mapTitle: mapData.title,
      mapTitleStripped: stripMapString(mapData.title),
      mapDescription: mapData.description,
      mapHash: getMapHash(mapData),
      mapEncoding: mapData._encoding,
      mapTilesetName: tilesetData.name,
      mapTilesetId: mapData.tileset,
      mapTileWidth: mapData.size[0],
      mapTileHeight: mapData.size[1]
    }
  }

  return {
    renderMapImage,
    getMapMetadata
  }
}
