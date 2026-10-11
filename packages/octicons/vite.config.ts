import { readdirSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const srcDir = resolve(rootDir, 'src')
const iconsDir = resolve(srcDir, '__generated__/icons')

export default defineConfig({
  root: rootDir,
  plugins: [
    dts({
      tsconfigPath: resolve(rootDir, 'tsconfig.json'),
      entryRoot: srcDir,
      include: [resolve(srcDir, '**/*.ts')],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(srcDir, 'index.ts'),
        ...Object.fromEntries(
          readdirSync(iconsDir)
            .filter((file) => file.endsWith('.ts'))
            .map((file) => [`icons/${basename(file, '.ts')}`, resolve(iconsDir, file)]),
        ),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    sourcemap: true,
    target: 'es2018',
  },
})
