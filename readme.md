[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/bwmapimage.svg)](https://badge.fury.io/js/bwmapimage)

# BwMapImage

Library for generating map images for *StarCraft: Brood War* and *Remastered*.

Both **map files** (.scm and .scx) as well as **replay files** (.rep) are supported as input.

This is a wrapper library around the [bw-chk](https://github.com/ShieldBattery/bw-chk), [jssuh](https://github.com/ShieldBattery/jssuh) and [scm-extractor](https://github.com/ShieldBattery/scm-extractor) libraries made by the [Shield Battery](https://shieldbattery.net/) project. All the heavy lifting is done by their code—this library mostly just simplifies the process and passes the result through an image encoder.

## Usage

This library is available via npm.

```bash
npm i --save bwmapimage
```

Basic usage involves passing a filename and getting an image buffer in return:

```js
import fs from 'fs/promises'
import {BwMapImage} from 'bwmapimage'

const bwMapImage = new BwMapImage('(4)Vermeer SE_2.1.scm', {})
const [buffer, metadata] = await bwMapImage.renderMapImage()
await fs.writeFile(`out${metadata.extension}`, buffer, null)
```

By default, the library will generate a full size .png file (which can take a bit of time and be quite large).

### Reference

**Function:**

```js
new BwMapImage(file, options)
```

**Parameters:**

* `file` **string|buffer**\
  Either a path to a .scm, .scx or .rep file; or a buffer of one of such files.
* `options` **object|null**\
  See below.

**Returns:**

A `BwMapImage` object for the given file and options object.

For the source file, you can pass either a string or a buffer. If a string is passed, the file will be read from disk, with the file type assumed from the extension; a buffer will be processed in the same way.

----

**Function:**

```js
await bwMapImage.renderMapImage()
```

**Returns:**

* `buffer` **string**\
  Image buffer that can be directly saved to a file.
* `metadata.type` **string**\
  Either `"map"` or `"replay"`.
* `metadata.extension` **string**\
  A recommended file extension for the given format, e.g. `".jpg"`
* `metadata.format` **string**\
  Image format used.
* `metadata.channels` **number**\
  Number of channels in the output image.
* `metadata.size` **number**\
  Size of the buffer in bytes.
* `metadata.width` **number**\
  Final width of the image buffer after resizing.
* `metadata.height` **number**\
  Final height of the image buffer after resizing.
* `metadata.fullWidth` **number**\
  Full width of the bitmap prior to resizing.
* `metadata.fullHeight` **number**\
  Full height of the bitmap prior to resizing.
* `metadata.mapTitle` **string**\
  Raw title for the map. Contains escape sequences.
* `metadata.mapDescription` **string**\
  Raw description for the map. Contains escape sequences.
* `metadata.mapHash` **string**\
  XXH64 hash of the map data, for caching purposes.
* `metadata.mapTileWidth` **number**\
  Map width in tiles.
* `metadata.mapTileHeight` **number**\
  Map height in tiles.
* `metadata.mapTilesetId` **number**\
  Tileset ID for the map—see [sctoolsdata](https://github.com/msikma/sctoolsdata) for more information.
* `metadata.mapEncoding` **string**\
  Character encoding for the map; typically either `"cp949"`, `"cp1252"` or `"utf8"`.
* `metadata.resolvedOptions` **object**\
  The user's passed options with default options merged in.

Generates an image from a map or replay file.

----

**Function:**

```js
await bwMapImage.getMapMetadata()
```

**Returns:**

* `metadata.mapTitle` **string**\
  Raw title for the map. Contains escape sequences.
* `metadata.mapDescription` **string**\
  Raw description for the map. Contains escape sequences.
* `metadata.mapHash` **string**\
  XXH64 hash of the map data, for caching purposes.
* `metadata.mapTileWidth` **number**\
  Map width in tiles.
* `metadata.mapTileHeight` **number**\
  Map height in tiles.
* `metadata.mapTilesetId` **number**\
  Tileset ID for the map—see [sctoolsdata](https://github.com/msikma/sctoolsdata) for more information.
* `metadata.mapEncoding` **string**\
  Character encoding for the map; typically either `"cp949"`, `"cp1252"` or `"utf8"`.

This returns metadata about the map data itself, before the image is generated. This allows for you to, for example, check the `mapHash` against a cache. Note that the hash is specific to the map data, not to the generated image.

### Options

The following options can be passed:

| Setting | Type | Default | Notes |
|:--------|:-----|:--------|:------|
| bwGraphicsPath | **string\|null** | `null` | If null, this gets set to ~/.config/bwmapimage, where ~ is the user's home directory. |
| forceType | **string\|null** | `null` | Either `"map"` or `"replay"`, but normally autodetected. |
| tileSize | **number** | `32` | Either `32`, `16` or `8`. Base tile size; 32 is full size, anything smaller results in smaller images for much less processing time and memory. |
| encoderType | **string** | `"png"` | E.g. `"png"`, `"jpeg"`, `"avif"`, etc—anything supported by [sharp](https://github.com/lovell/sharp). |
| encoderOptions | **object** | `{}` | Options passed on to [sharp](https://github.com/lovell/sharp) for the given output type. |
| targetWidth | **number\|null** | `null` | Width the image will be resized to. See target size note below. |
| targetHeight | **number\|null** | `null` | Height the image will be resized to. |
| targetFit | **string\|null** | `"inside"` | Resizing fit; typically you want `"inside"`. See the [sharp api](https://sharp.pixelplumbing.com/api-resize) for other options. |
| preHook | **function\|null** | `null` | Callback for manually utilizing the [sharp](https://github.com/lovell/sharp) object with the full size map image buffer (prior to resizing). |

Note that, by default, this library will create a lossless .png file at full size. This is extremely time consuming (on a fast machine it can take 3-5 seconds) and results in *huge* files (10–15 MB, 4096×4096 for a 128×128 tile map). It will also take a lot of memory to generate the initial uncompressed bitmap.

To downscale the resulting image, you only need to set one of `targetWidth` or `targetHeight`; if you set one, the final image will be resized within a square by that size. So if you set one of them to `512`, a square map like [Fighting Spirit](https://liquipedia.net/starcraft/Fighting_Spirit) will end up being 512×512, and a slightly thinner map like [Invader](https://liquipedia.net/starcraft/Invader) will be 512×448.

The `preHook` value can be used to manually do something with the [sharp](https://github.com/lovell/sharp) object before the image is finalized and returned. For example, here's a function that boosts the brightness of the generated images:

```js
/** Converts Photoshop style levels to linear multiplier/offset values. */
function levelsToLinear(min, max) {
  const a = 255 / (max - min)
  const b = -min * a
  return [a, b]
}

await makeBwMapImage('map.scm', {
  // see: https://sharp.pixelplumbing.com/api-operation#linear
  preHook: image => image.linear(...levelsToLinear(0, 150))
})
```

The callback runs prior to resizing and compression.

### Graphics

To be able to generate map images, you'll need to extract the required graphics from StarCraft.

**[A copy of the required graphics can be found here](https://archive.org/details/StarCraftMapGraphics)** (18.5M), provided for convenience reasons.

You can also extract them from the game files directly using a program such as [CascView](http://www.zezula.net/en/casc/main.html).

The following files are needed:

* all files listed in [units.js](https://github.com/ShieldBattery/bw-chk/blob/master/units.js) and [sprites.js](https://github.com/ShieldBattery/bw-chk/blob/master/sprites.js) files from [bw-chk](https://github.com/ShieldBattery/bw-chk);
* for all tilesets `['badlands', 'platform', 'install', 'ashworld', 'jungle', 'desert', 'ice', 'twilight']`, all files of extension `['.cv5', '.vx4', '.vr4', '.wpe', '.vx4ex']`.

All filenames should be lowercase, as that's how bw-chk expects them to be (although on case insensitive filesystems this doesn't matter).

By default, the library will look for the graphics in the **~/.config/bwmapimage** directory.

## External links

* [bw-chk](https://github.com/ShieldBattery/bw-chk), [jssuh](https://github.com/ShieldBattery/jssuh) and [scm-extractor](https://github.com/ShieldBattery/scm-extractor) – libraries that do most of the work
* [sharp](https://github.com/lovell/sharp) – library used for final image generation
* [StarCraft map graphics](https://archive.org/details/StarCraftMapGraphics) package

## License

MIT license.
