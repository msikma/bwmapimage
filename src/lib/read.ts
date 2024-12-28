// @dada78641/bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import {createReadStream, type ReadStream} from 'fs'
import {type Transform} from 'stream'
import stream from 'stream'
import Chk, {type ChkInstance} from 'bw-chk'
import ReplayParser from 'jssuh'
import scmExtractor from 'scm-extractor'
import {determineInputFormat} from './input.ts'
import type {InputType} from './options.ts'

/**
 * Returns an extractor and pipe method for obtaining the Chk data from a file.
 */
export function makeChkExtractor(filetype: InputType) {
  if (filetype === 'map') {
    return [scmExtractor(), 'pipe']
  }
  if (filetype === 'replay') {
    return [new ReplayParser(), 'pipeChk']
  }
  throw new Error(`File type "${filetype}" must be "map" or "replay"`)
}

/**
 * Returns a ReadStream for the given file.
 */
export function getReadStream(input: string | Buffer): ReadStream | Transform {
  // Use a regular file stream if this is a file path instead.
  if (typeof input === 'string') {
    return createReadStream(input)
  }
  // If this is a buffer, create a passthrough stream for it.
  if (Buffer.isBuffer(input)) {
    const bufferStream = new stream.PassThrough()
    bufferStream.end(input)
    return bufferStream
  }
  throw new Error(`invalid input type`)
}

/**
 * Reads a file or buffer and resolves with extracted Chk data.
 */
export async function readMapData(input: string | Buffer, forceType?: InputType | undefined): Promise<ChkInstance> {
  const format = determineInputFormat(input, forceType)
  return new Promise((resolve, reject) => {
    const stream = getReadStream(input)
    const [extractor, method] = makeChkExtractor(format)
    const mpq = stream.pipe(extractor)
    mpq[method](Chk.createStream((err: Error | null, chk: ChkInstance) => {
      if (err) {
        return reject(err)
      }
      resolve(chk)
    }))
    mpq.on('error', (err: Error) => {
      reject(err)
    })
    stream.on('error', (err: Error) => {
      reject(err)
    })
  })
}
