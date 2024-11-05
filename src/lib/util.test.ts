// @dada78641/bwmapimage <https://github.com/msikma/bwmapimage>
// © MIT license

import {describe, it, expect} from 'vitest'
import {getValidatedTileSize, getRecommendedBasename, parseTargetFilename} from './util.ts'
import type {ChkMetadata} from './meta.ts'

const mockMetadata: ChkMetadata = {
  title: 'Untitled Scenario',
  description: 'Destroy all enemy buildings.',
  encoding: 'cp949',
  hash: '11ab5d6abc2b73ab',
  tilesetId: 0,
  tileWidth: 64,
  tileHeight: 64,
}

describe('getValidatedTileSize', () => {
  it('returns the input verbatim if it is 32, 16 or 8', () => {
    expect(getValidatedTileSize(32)).toBe(32)
    expect(getValidatedTileSize(16)).toBe(16)
    expect(getValidatedTileSize(8)).toBe(8)
  })

  it('throws an error for invalid tile sizes', () => {
    expect(() => getValidatedTileSize(10)).toThrow('invalid tile size')
    expect(() => getValidatedTileSize(64)).toThrow('invalid tile size')
    expect(() => getValidatedTileSize(-1)).toThrow('invalid tile size')
  })

  it('throws an error if tile size is null or undefined', () => {
    expect(() => getValidatedTileSize(null)).toThrow('invalid tile size')
    expect(() => getValidatedTileSize(undefined)).toThrow('invalid tile size')
  })
})

describe('getRecommendedBasename', () => {
  it('returns the file name without extension when input is a string', () => {
    const input = '/path/to/map.scx'
    const result = getRecommendedBasename(input, mockMetadata)
    expect(result).toBe('map')
  })

  it('returns the map title from metadata when input is a Buffer', () => {
    const input = Buffer.from('some map data')
    const result = getRecommendedBasename(input, mockMetadata)
    expect(result).toBe('Untitled Scenario')
  })

  it('returns "unnamed" if the map title in metadata is empty when input is a Buffer', () => {
    const input = Buffer.from('some map data')
    const mockMetadataWithEmptyTitle = {...mockMetadata, title: ''}
    const result = getRecommendedBasename(input, mockMetadataWithEmptyTitle)
    expect(result).toBe('unnamed')
  })

  it('returns the sanitized map title if the title contains ANSI codes', () => {
    const input = Buffer.from('some map data')
    const mockMetadataWithAnsiTitle = {...mockMetadata, title: '\u001b[31mRed Map\u001b[0m'}
    const result = getRecommendedBasename(input, mockMetadataWithAnsiTitle)
    expect(result).toBe('Red Map')
  })

  it('returns the sanitized map title with whitespace trimmed', () => {
    const input = Buffer.from('some map data')
    const metadataWithWhitespacedTitle = {...mockMetadata, title: '   Map with spaces   '}
    const result = getRecommendedBasename(input, metadataWithWhitespacedTitle)
    expect(result).toBe('Map with spaces')
  })
})

describe('parseTargetFilename', () => {
  it('returns the target filename if it\'s an absolute path or if useInputDirectory is false', () => {
    const cwd = process.cwd()
    expect(parseTargetFilename('/path/to/file.png', 'input.scx', false)).toEqual({
      base: 'file.png',
      dir: '/path/to',
      ext: '.png',
      name: 'file',
      root: '/',
    })
    expect(parseTargetFilename('file.png', 'input.scx', false)).toEqual({
      base: 'file.png',
      dir: `${cwd}`,
      ext: '.png',
      name: 'file',
      root: '/',
    })
  })
  it('combines the target filename and input file path if useInputDirectory is true', () => {
    expect(parseTargetFilename('file.png', '/starcraft/input.scx', true)).toEqual({
      base: 'file.png',
      dir: '/starcraft',
      ext: '.png',
      name: 'file',
      root: '/',
    })
  })
})
