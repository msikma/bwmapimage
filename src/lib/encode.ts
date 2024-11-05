// @dada78641/bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import sharp, {type Sharp, OutputInfo} from 'sharp'
import type {MapImageOptions} from './options.ts'
import type {BitmapData} from './render.ts'

export type ImageMetadata = {
  originalWidth: number
  originalHeight: number
} & OutputInfo

export interface EncodedImageData {
  buffer: Buffer
  metadata: ImageMetadata
}

/**
 * Runs a given compression algorithm on the image object.
 */
function applyImageCompression(image: Sharp, encoderType: MapImageOptions['encoderType'], encoderOptions: MapImageOptions['encoderOptions']): Sharp {
  // Fall back to png as default if nothing is set.
  const useEncoderType = encoderType == null ? 'png' : encoderType
  const useEncoderOptions = encoderOptions == null ? {} : encoderOptions
  return image[useEncoderType](useEncoderOptions)
}

/**
 * Resizes the image object, if at least one of width/height is set.
 */
function applyImageScaling(image: Sharp, fit: MapImageOptions['targetFit'], width?: number | null, height?: number | null): Sharp {
  // If no width and height is set, we're not doing any scaling.
  if (!width && !height) {
    return image
  }
  if (fit == null) {
    throw new Error(`invalid fit value: ${fit}`)
  }
  const newWidth = width ?? height ?? undefined
  const newHeight = height ?? width ?? undefined
  return image.resize({width: newWidth, height: newHeight, fit})
}

/**
 * Returns an object of metadata for the encoded image.
 */
function collectMetadata(encodedImageMetadata: OutputInfo, originalWidth: number, originalHeight: number): ImageMetadata {
  return {
    ...encodedImageMetadata,
    originalWidth,
    originalHeight,
  }
}

/**
 * Encodes the previously rendered bitmap to a more efficient format.
 * 
 * This also performs all additional processing, namely scaling and the pre-encode hook.
 */
export async function encodeImage(bitmapData: BitmapData, options: MapImageOptions): Promise<EncodedImageData> {
  const {buffer, width, height} = bitmapData
  const {targetWidth, targetHeight, targetFit, encoderType, encoderOptions, preEncodeHook} = options

  // Initialize an image object from the raw bitmap data.
  const image = sharp(buffer, {raw: {width, height, channels: 3}})

  // If the user passed on a custom callback, execute it now with the full bitmap data.
  // This is the point where the user can e.g. boost the brightness of the output image.
  if (preEncodeHook) {
    await preEncodeHook(image)
  }

  applyImageScaling(image, targetFit, targetWidth, targetHeight)
  applyImageCompression(image, encoderType, encoderOptions)

  // Resolve with the generated image buffer and its metadata.
  const {data, info} = await image.toBuffer({resolveWithObject: true})

  return {
    buffer: data,
    metadata: collectMetadata(info, width, height)
  }
}
