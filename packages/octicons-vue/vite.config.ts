import { readdirSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vite'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const srcDir = resolve(rootDir, 'src')
const iconsDir = resolve(srcDir, '__generated__/icons')

const iconEntries = Object.fromEntries(
  readdirSync(iconsDir)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => [`icons/${basename(file, '.ts')}`, resolve(iconsDir, file)]),
)

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: resolve(rootDir, 'tsconfig.build.json'),
      entryRoot: srcDir,
      include: ['src'],
    }),
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        index: resolve(srcDir, 'index.ts'),
        ...iconEntries,
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: (id) => id === 'vue' || id === '@onlikee/octicons' || id.startsWith('@onlikee/octicons/'),
      output: {
        exports: 'named',
      },
    },
    sourcemap: true,
    target: 'es2018',
  },
})
