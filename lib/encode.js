// bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import sharp from 'sharp'

/**
 * Runs a given compression algorithm on the image object.
 */
function applyImageCompression(image, encoderOptions = {}) {
  const options = encoderOptions.options ?? {}
  return image[encoderOptions.type](options)
}

/**
 * Resizes the image object, if at least one of width/height is set.
 */
function applyImageScaling(image, width, height, fit) {
  if (!width && !height) {
    return
  }
  return image.resize({width: width ?? height, height: height ?? width, fit})
}

/**
 * Encodes an image from the generated raw map bitmap image.
 * 
 * This creates the final buffer that we can actaully output to the user.
 * It also resizes and compresses the image.
 */
export async function encodeImageData(bitmap, fullWidth, fullHeight, options) {
  const {encoderOptions, targetWidth, targetHeight = null, targetFit = 'inside', preHook} = options
  
  // Initialize an image object from the raw bitmap data returned by bw-chk.
  const image = sharp(bitmap, {raw: {width: fullWidth, height: fullHeight, channels: 3}})

  // If the user passed on a custom callback, execute it now with the full bitmap data.
  // This is the point where the user can e.g. boost the brightness of the output image.
  if (preHook) {
    await preHook(image)
  }

  // Resize the image, if required.
  await applyImageScaling(image, targetWidth, targetHeight, targetFit)

  // Apply image compression.
  await applyImageCompression(image, encoderOptions)

  // Resolve with the generated image buffer and its metadata.
  const {data, info} = await image.toBuffer({resolveWithObject: true})

  return [data, info]
}
