import {defineConfig} from 'tsup'

export default defineConfig({
  entry: {index: 'src/index.ts'},
  outDir: 'dist',
  format: ['cjs', 'esm'],
  sourcemap: true,
  dts: true,
  splitting: false,
  minify: false,
  clean: true,
  shims: true,
})
