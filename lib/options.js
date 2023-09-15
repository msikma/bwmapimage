// bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

/** Default options used for generating map images. */
const DEFAULT_OPTIONS = {
  bwGraphicsPath: null,
  encoderType: 'png',
  encoderOptions: {},
  forceType: null,
  preHook: null,
  tileSize: 32,
  targetWidth: null,
  targetHeight: null,
  targetFit: 'inside'
}

/** Default options for each image encoder option. These also override the Sharp default options. */
const ENCODER_DEFAULT_OPTIONS = {
  'jpeg': {
    mozjpeg: true,
    quality: 94,
    progressive: false,
    chromaSubsampling: '4:4:4'
  },
  'png': {
    progressive: false,
    compressionLevel: 6, // 0-9, where 9 is slowest
    palette: false
  },
  'avif': {
    quality: 80,
    lossless: false,
    effort: 3, // 0-9, where 9 is slowest
    chromaSubsampling: '4:4:4'
  }
}

/**
 * Resolves the user's passed encoder type to one we recognize.
 * 
 * In practice this just makes sure "jpg" is an alias for "jpeg".
 */
function resolveEncoderType(type) {
  if (type == null) {
    return type
  }
  switch (type) {
    case 'jpg':
      return 'jpeg'
    default:
      return type
  }
}

/**
 * Adds the default encoder options to our options object.
 */
function addEncoderOptions(options = {}) {
  const type = resolveEncoderType(options.encoderType) ?? DEFAULT_OPTIONS.encoderType
  return {
    ...options,
    encoderOptions: {
      type,
      options: {
        ...ENCODER_DEFAULT_OPTIONS[type] ?? {},
        ...options.encoderOptions.options
      }
    }
  }
}

/**
 * Merges the default options into the user's options object.
 */
export function mergeDefaultOptions(options = {}) {
  return addEncoderOptions({...DEFAULT_OPTIONS, ...options})
}
