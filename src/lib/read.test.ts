// @dada78641/bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import fs from 'node:fs/promises'
import path from 'node:path'
import {describe, it, expect} from 'vitest'
import {getPackageRoot} from './util.ts'
import {readMapData} from './read.ts'

const testDir = path.join(getPackageRoot(), 'test')

describe('readMapData', async () => {
  const testMapBuffer = await fs.readFile(path.join(testDir, 'misc', 'metadata.scm'), null)
  it('parses valid map files', async () => {
    const res = await readMapData(testMapBuffer)
    expect(res.title).toBe('MapTitleTest')
    expect(res.description).toBe('MapDescriptionTest')
    expect(res.tileset).toBe(2)
    expect(res.size).toStrictEqual([4, 4])
  })
  it('throws an error when a non-map/non-replay buffer is passed', async () => {
    await expect(readMapData(Buffer.from('invalid'), undefined)).rejects.toThrow('Not a replay file')
  })
})
