// bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import {createReadStream} from 'fs'
import stream from 'stream'
import Chk from 'bw-chk'
import ReplayParser from 'jssuh'
import scmExtractor from 'scm-extractor'

/**
 * Returns an extractor and pipe method for obtaining the Chk data from a file.
 */
function getChkExtractor(filetype) {
  if (filetype === 'map') {
    return [scmExtractor(), 'pipe']
  }
  if (filetype === 'replay') {
    return [new ReplayParser(), 'pipeChk']
  }
}

/**
 * Returns a ReadStream for the given file.
 */
function getReadStream(file) {
  // If this is a buffer, create a passthrough stream for it.
  if (Buffer.isBuffer(file)) {
    const bufferStream = new stream.PassThrough()
    bufferStream.end(file)
    return bufferStream
  }
  // Use a regular file stream if this is a file path instead.
  return createReadStream(file)
}

/**
 * Reads a file stream and resolves with extracted Chk data.
 */
export async function readMapData(file, filetype) {
  return new Promise((resolve, reject) => {
    const stream = getReadStream(file)
    const [extractor, method] = getChkExtractor(filetype)
    const mpq = stream.pipe(extractor)
    mpq[method](Chk.createStream((err, chk) => {
      if (err) {
        return reject(err)
      }
      resolve(chk, file)
    }))
    mpq.on('error', err => {
      reject(err)
    })
    stream.on('error', err => {
      reject(err)
    })
  })
}
