// @dada78641/bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import type {Sharp, JpegOptions, JxlOptions, AvifOptions, PngOptions} from 'sharp'

export type InputType = 'map' | 'replay'

interface MapImageBaseOptions {
  targetWidth?: number | null
  targetHeight?: number | null
  targetFit?: 'cover' | 'contain' | 'inside' | 'outside' | null
  tileSize?: 32 | 16 | 8
  forceType?: InputType
  bwGraphicsPath?: string
  useInputDirectory?: boolean
  preEncodeHook?: (image: Sharp) => Promise<any> | any
}

interface NullEncoderOptions {
  encoderType?: null
  encoderOptions?: null | {}
}

interface PngEncoderOptions {
  encoderType: 'png'
  encoderOptions?: PngOptions | null
}

interface JpegEncoderOptions {
  encoderType: 'jpeg'
  encoderOptions?: JpegOptions | null
}

interface AvifEncoderOptions {
  encoderType: 'avif'
  encoderOptions?: AvifOptions | null
}

interface JxlEncoderOptions {
  encoderType: 'jxl'
  encoderOptions?: JxlOptions | null
}

export type MapImageOptions =
  | (MapImageBaseOptions & NullEncoderOptions)
  | (MapImageBaseOptions & PngEncoderOptions)
  | (MapImageBaseOptions & JpegEncoderOptions)
  | (MapImageBaseOptions & AvifEncoderOptions)
  | (MapImageBaseOptions & JxlEncoderOptions)

export const defaultOptions: MapImageOptions = {
  targetWidth: null,
  targetHeight: null,
  targetFit: 'contain',
  tileSize: 32,
  useInputDirectory: false,
}

/**
 * Merges the default options into those supplied by the user.
 */
export function mergeDefaultOptions(options: MapImageOptions): MapImageOptions {
  return {...defaultOptions, ...options}
}
