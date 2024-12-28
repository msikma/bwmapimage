// @dada78641/bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'jssuh'
declare module 'scm-extractor'
declare module 'bw-chk' {
  namespace Chk {
    export function createStream(
      callback: (err: Error | null, chk: any) => void,
    ): ChkInstance
    export function fsFileAccess(val: any): FileAccess
  }
  export type FileAccess = {
    tileset: (id: number) => Promise<Buffer>
    unit: (id: number) => Promise<Buffer>
    sprite: (id: number) => Promise<Buffer>
  }
  export type ChkInstance = {
    title: string
    description: string
    size: [number, number]
    tileset: number
    encoding: () => string
    _tiles: Buffer
    units: [{
      x: number
      y: number
      unitId: number
      player: number
      resourceAmt?: number
    }]
    sprites: [{
      x: number
      y: number
      spriteId: number
    }]
    image: (fileAccess: FileAccess, width: number, height: number, options?: object) => Promise<Buffer>
  }
  export default Chk
}
