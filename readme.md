[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/) [![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/@dada78641%2Fbwmapimage.svg)](https://badge.fury.io/js/@dada78641%2Fbwmapimage)

# @dada78641/bwmapimage

Library for generating map images for *StarCraft: Brood War* and *Remastered*.

Both **map files** (.scm and .scx) as well as **replay files** (.rep) are supported as input.

This is a wrapper library around the [bw-chk](https://github.com/ShieldBattery/bw-chk), [jssuh](https://github.com/ShieldBattery/jssuh) and [scm-extractor](https://github.com/ShieldBattery/scm-extractor) libraries made by the [Shield Battery](https://shieldbattery.net/) project. All the heavy lifting is done by their code—this library mostly just simplifies the process and passes the result through an image encoder.

This library pulls in the free-to-play Brood War graphics as [dependency](https://github.com/msikma/bwmapgfx). This is sufficient to render any map, old or new. Remastered graphics are not supported.

## License

MIT licensed.
