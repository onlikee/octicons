import assert from 'node:assert/strict'
import { gzipSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import test from 'node:test'

for (const target of ['core', 'vue']) {
  test(`${target} single-icon consumer excludes unrelated icon modules`, async () => {
    const root = fileURLToPath(new URL('../', import.meta.url))
    const result = await build({
      configFile: false,
      root,
      logLevel: 'silent',
      build: {
        write: false,
        minify: true,
        lib: { entry: `${root}tests/bundle/${target}.ts`, formats: ['es'] },
        rollupOptions: { external: ['vue'] },
      },
    })
    const outputs = (Array.isArray(result) ? result : [result]).flatMap((item) => item.output).filter((item) => item.type === 'chunk')
    const modules = outputs.flatMap((item) => Object.keys(item.modules)).map((id) => id.replaceAll('\\', '/'))
    assert.ok(modules.some((id) => id.includes('/icons/accessibility-inset')), 'selected icon is present')
    assert.equal(modules.some((id) => /\/icons\/(?!accessibility-inset(?:[.-]|$))/.test(id)), false, modules.filter((id) => id.includes('/icons/')).join('\n'))
    const code = outputs.map((item) => item.code).join('\n')
    assert.equal(code.includes('octicon-agent'), false)
    assert.equal(code.includes('octicon-copilot'), false)
    console.log(`${target}: ${Buffer.byteLength(code)} bytes, gzip ${gzipSync(code).length} bytes`)
  })
}
