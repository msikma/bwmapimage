[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/) [![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/@dada78641%2Fbwmapimage.svg)](https://badge.fury.io/js/@dada78641%2Fbwmapimage)

# @dada78641/bwmapimage

Library for generating map images for *StarCraft: Brood War* and *Remastered*.

Both **map files** (.scm and .scx) as well as **replay files** (.rep) are supported as input.

This is a wrapper library around the [bw-chk](https://github.com/ShieldBattery/bw-chk), [jssuh](https://github.com/ShieldBattery/jssuh) and [scm-extractor](https://github.com/ShieldBattery/scm-extractor) libraries made by the [Shield Battery](https://shieldbattery.net/) project. All the heavy lifting is done by their code—this library mostly just simplifies the process and passes the result through [an image encoder](https://sharp.pixelplumbing.com/).

This library pulls in the free-to-play Brood War graphics as [dependency](https://github.com/msikma/bwmapgfx). This is sufficient to render any map, old or new. Remastered graphics are not supported.

## Usage

This library is compatible with CJS and ESM projects.

```bash
npm i @dada78641/bwmapimage
```

Basic usage involves making a new `BwMapImage` object with the input file, and then calling one of its render functions.

```ts
import {BwMapImage} from '@dada78641/bwmapimage'

const bwMapImage = new BwMapImage('Polypoid 1.75.scx')
const res = await bwMapImage.renderMapImageToFile()
```

This example saves an image file named *Polypoid 1.75.png* in the current working directory. By default it's a full size image saved as PNG.

### Other uses

Various other methods are available. Here are some common use cases:

```ts
// Returns the generated image as a buffer instead of saving it.
await new BwMapImage(inputFile).renderMapImage()
// Saves the generated image to the same directory as wherever the input file is.
await new BwMapImage(inputFile, {useInputDirectory: true}).renderMapImageToFile()
// Returns a buffer of uncompressed image data.
await new BwMapImage(inputFile).renderUncompressedBitmap()
// Returns an object of metadata for the given map file without generating an image.
await new BwMapImage(inputFile).getMapMetadata()
// Generates a jpeg file scaled to be within 800x800 px (if not square, one dimension will be smaller).
await new BwMapImage(inputFile, {targetWidth: 800, targetHeight: 800, encoderType: 'jpeg'}).renderMapImage()
```

The return value is an object containing various metadata about the input map file and the generated image.

```js
{
  buffer: <Buffer 89 50 4e 47 ... 6711477 more bytes>,
  metadata: {
    filepath: '/path/to/Radeon 1.0.png',
    filename: 'Radeon 1.0.png',
    basename: 'Radeon 1.0',
    extension: '.png',
    mime: 'image/png',
    format: 'png',
    width: 4096,
    height: 4096,
    channels: 3,
    premultiplied: false,
    size: 6711527,
    originalWidth: 4096,
    originalHeight: 4096
  },
  map: {
    title: '\x07R\x06a\x07d\x06e\x07o\x06n \x051.0',
    description: '스타크래프트 국민맵 만들기 프로젝트 2탄\r\n' +
      '\r\n' +
      'Made by Waldstein\r\n' +
      'Co-worked with Light, JyJ, Mind, herO, SoulKey, Bisu, Snow, and 910\r\n' +
      'Presented by AMD\r\n' +
      'Thanks to LatiAs, Earthattack, and NEMEC',
    hash: '77137785c0694389',
    encoding: 'utf8',
    tilesetId: 1,
    tileWidth: 128,
    tileHeight: 128
  },
  resolvedOptions: {
    targetWidth: null,
    targetHeight: null,
    targetFit: 'contain',
    tileSize: 32,
    useInputDirectory: false
  }
}
```

### Options

The following options can be passed:

| Setting | Type | Default | Notes |
|:--------|:-----|:--------|:------|
| targetWidth | **number \| null** | `null` | Width the image will be resized to after generation. `null` keeps it fulls ize. |
| targetHeight | **number \| null** | `null` | Height the image will be resized to. |
| targetFit | **string \| null** | `"contain"` | Resizing fit; typically you want `"contain"`. See the [sharp api](https://sharp.pixelplumbing.com/api-resize) for other options. |
| tileSize | **number** | `32` | Base tile size; either `32`, `16` or `8`. A smaller value means faster generation of a lower quality image. |
| forceType | **"map" \| "replay"** | – | Normally autodetected, but this lets you force `"map"` or `"replay"`. |
| bwGraphicsPath | **string** | – | Custom path to the Brood War graphics files. Not needed by default. |
| useInputDirectory | **boolean** | `false` | If true, the image is saved relative to the input file's directory. |
| preEncodeHook | **function \| null** | – | Callback for manually utilizing the [sharp](https://github.com/lovell/sharp) object with the full size map image buffer (prior to resizing). |
| encoderType | **string** | `"png"` | One of `"png"`, `"jpeg"`, `"avif"`, `"jxl"`. |
| encoderOptions | **object** | – | Options passed on to [sharp](https://github.com/lovell/sharp) for the given output type. |

All values are optional.

### Pre-encode hook

This is a hook that allows you to manipulate the generated image data before it's resized and then encoded.

For example, here's a function that boosts the gamma curve of the generated images:

```js
function levelsToLinear(min: number, max: number): [number, number] {
  const a = 255 / (max - min)
  const b = -min * a
  return [a, b]
}

const res = await new BwMapImage(inputFile, {
  // see: https://sharp.pixelplumbing.com/api-operation#linear
  preEncodeHook: (image: Sharp) => image.linear(...levelsToLinear(0, 158))
}).renderMapImage()
```

The Brood War map graphics are pretty dark, so boosting their brightness and contrast can help improve their visibility in modern interfaces.

### Caveats

Map generation is pretty slow. If you just need thumbnails, you might want to consider setting the `tileSize` to 16 or 8 instead of the default value of 32. This speeds the process up by reducing the number of pixels copied at the expense of quality.

If you want to use caching, you might want to use the generated map hash (the `res.map.hash` value, which is a string) as the cache key. This is especially useful when generating screenshots from replays. The hash is based exclusively on the visual features in the map content that would affect image generation.

## License

MIT licensed.
