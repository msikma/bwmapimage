// bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import {getRecommendedFileExtension} from './util.js'

/**
 * Combines metadata from the raw bitmap and from the final image into one object.
 */
export function wrapMetadata(imgMetadata, bmpMetadata, filetype, options) {
  return {
    type: filetype,
    extension: getRecommendedFileExtension(options.encoderType),
    format: imgMetadata.format,
    channels: imgMetadata.channels,
    size: imgMetadata.size,
    width: imgMetadata.width,
    height: imgMetadata.height,
    fullWidth: bmpMetadata.width,
    fullHeight: bmpMetadata.height,
    mapTilesetId: bmpMetadata.tilesetId,
    resolvedOptions: options
  }
}
