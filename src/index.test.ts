// @dada78641/bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import fs from 'node:fs/promises'
import path from 'node:path'
import {describe, it, expect} from 'vitest'
import fg from 'fast-glob'
import {getPackageRoot} from './lib/util.ts'
import {BwMapImage} from './index.ts'

const testDir = path.join(getPackageRoot(), 'test')
const tilesetsDir = path.join(testDir, 'terrains')

function getExpectedFilename(file: string) {
  const parsed = path.parse(file)
  const expected = path.join(parsed.dir, `${parsed.name}.png`)
  return expected
}

async function getRenderTests(files: string[]) {
  for (const file of files) {
    const expected = await fs.readFile(getExpectedFilename(file), null)
    const res = await new BwMapImage(file, {encoderType: 'png', encoderOptions: {compressionLevel: 9}}).renderMapImage()
    expect(res.buffer).toStrictEqual(expected)
  }
}

async function getTilesetRenderTest(tileset: string, extension: string) {
  return getRenderTests([path.join(tilesetsDir, `${tileset}.${extension}`)])
}

describe('BwMapImage', async () => {
  const filetypes = ['**/*.scm', '**/*.scx']
  const cases = await fg(filetypes, {cwd: path.join(testDir, 'misc'), absolute: true})
  const timeout = {timeout: 100000}

  it('renders map files to image correctly', timeout, () => getRenderTests(cases))
  describe('renders all tilesets correctly', async () => {
    it('renders the ashworld tileset correctly', timeout, () => getTilesetRenderTest('ashworld', 'scm'))
    it('renders the badlands tileset correctly', timeout, () => getTilesetRenderTest('badlands', 'scm'))
    it('renders the desert tileset correctly', timeout, () => getTilesetRenderTest('desert', 'scx'))
    it('renders the ice tileset correctly', timeout, () => getTilesetRenderTest('ice', 'scx'))
    it('renders the install tileset correctly', timeout, () => getTilesetRenderTest('install', 'scm'))
    it('renders the jungle tileset correctly', timeout, () => getTilesetRenderTest('jungle', 'scm'))
    it('renders the platform tileset correctly', timeout, () => getTilesetRenderTest('platform', 'scm'))
    it('renders the twilight tileset correctly', timeout, () => getTilesetRenderTest('twilight', 'scx'))
  })
})
