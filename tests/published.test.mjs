import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { root } from '../scripts/upstream.mjs'

test('published root and deep imports expose the actual TypeScript and Vue template contracts', () => {
  execFileSync(process.execPath, [resolve(root, 'node_modules/vue-tsc/bin/vue-tsc.js'), '--noEmit', '-p', resolve(root, 'tests/types/tsconfig.published.json')], { cwd: root, stdio: 'pipe' })
  for (const directory of ['packages/octicons-vue/dist/__generated__/icons', 'packages/octicons/dist/__generated__/icons']) {
    const declarations = readdirSync(resolve(root, directory)).filter((file) => file.endsWith('.d.ts'))
    assert.equal(declarations.length, 400)
    for (const filename of declarations) {
      const declaration = readFileSync(resolve(root, directory, filename), 'utf8').trim()
      assert.notEqual(declaration, 'export {}', filename)
      if (directory === 'packages/octicons-vue/dist/__generated__/icons') assert.match(declaration, /FunctionalComponent<IconProps>/, filename)
    }
  }
  assert.match(readFileSync(resolve(root, 'packages/octicons-vue/dist/__generated__/index.d.ts'), 'utf8'), /AgentIcon/)
  assert.match(readFileSync(resolve(root, 'packages/octicons/dist/index.d.ts'), 'utf8'), /toSVG/)
  const asset = fileURLToPath(import.meta.resolve('@onlikee/octicons/svg/agent-16.svg'))
  assert.equal(asset, resolve(root, 'packages/octicons/dist/svg/agent-16.svg'))
  assert.equal(readFileSync(asset, 'utf8'), readFileSync(resolve(root, 'icons/agent-16.svg'), 'utf8'))
})
