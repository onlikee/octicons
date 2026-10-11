import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pascalCase, readUpstream, root, snapshot } from './upstream.mjs'

const check = process.argv.includes('--check')
const { icons, raw } = readUpstream()
const files = new Map()
const header = '// Generated from icons/. Run npm run generate; do not edit.\n'
const coreExports = [],
  vueExports = []
for (const [name, icon] of icons) {
  const symbol = pascalCase(name)
  const deprecation = icon.deprecated
    ? `/** @deprecated Use ${pascalCase(icon.aliasOf)}Icon instead. */\n`
    : ''
  const coreDeprecation = icon.deprecated
    ? `/** @deprecated Use ${pascalCase(icon.aliasOf)} instead. */\n`
    : ''
  files.set(
    `packages/octicons/src/__generated__/icons/${name}.ts`,
    `${header}import type { IconDefinition } from '../../types.js'\n\n${coreDeprecation}const icon: IconDefinition = ${JSON.stringify(icon, null, 2)}\n\nexport default icon\n`,
  )
  files.set(
    `packages/octicons-vue/src/__generated__/icons/${name}.ts`,
    `${header}import type { FunctionalComponent } from 'vue'\nimport icon from '@onlikee/octicons/icons/${name}'\nimport { createIconComponent } from '../../createIconComponent.js'\nimport type { IconProps } from '../../createIconComponent.js'\n\n${deprecation}const ${symbol}Icon: FunctionalComponent<IconProps> = /* @__PURE__ */ createIconComponent(icon)\n\nexport default ${symbol}Icon\n`,
  )
  coreExports.push(`${coreDeprecation}export { default as ${symbol} } from './icons/${name}.js'`)
  vueExports.push(`${deprecation}export { default as ${symbol}Icon } from './icons/${name}.js'`)
}
files.set('packages/octicons/src/__generated__/index.ts', `${header}${coreExports.join('\n')}\n`)
files.set('packages/octicons-vue/src/__generated__/index.ts', `${header}${vueExports.join('\n')}\n`)
files.set(
  'packages/octicons/LICENSE.octicons',
  readFileSync(resolve(snapshot, 'LICENSE.octicons'), 'utf8'),
)
files.set('packages/octicons/SOURCE.json', readFileSync(resolve(snapshot, 'upstream.json'), 'utf8'))
const obsolete = []
function collectObsolete(directory) {
  const absolute = resolve(root, directory)
  if (!existsSync(absolute)) return
  for (const entry of readdirSync(absolute, { withFileTypes: true })) {
    const relative = `${directory}/${entry.name}`
    if (entry.isDirectory()) collectObsolete(relative)
    else if (!files.has(relative)) obsolete.push(relative)
  }
}
for (const directory of [
  'packages/octicons/src/__generated__',
  'packages/octicons-vue/src/__generated__',
])
  collectObsolete(directory)
// Git may check out LF files as CRLF on Windows. Compare content without
// rewriting the checkout's line endings, and preserve them when regenerating.
const normalize = (content) => content.replace(/\r\n/g, '\n')
const changed = [...files].filter(
  ([file, content]) =>
    !existsSync(resolve(root, file)) ||
    normalize(readFileSync(resolve(root, file), 'utf8')) !== normalize(content),
)
if (check) {
  if (changed.length || obsolete.length)
    throw new Error(
      `Generated files differ: ${[...changed.map(([file]) => file), ...obsolete].join(', ')}`,
    )
  console.log(`Generated files current: ${icons.size} icons, ${raw.size} SVGs`)
} else {
  for (const file of obsolete) unlinkSync(resolve(root, file))
  for (const [file, content] of changed) {
    const absolute = resolve(root, file)
    const existing = existsSync(absolute) ? readFileSync(absolute, 'utf8') : undefined
    mkdirSync(dirname(absolute), { recursive: true })
    writeFileSync(
      absolute,
      existing === undefined
        ? content
        : normalize(content).replace(/\n/g, existing.includes('\r\n') ? '\r\n' : '\n'),
      'utf8',
    )
  }
  console.log(
    `Generated ${icons.size} icons, ${raw.size} SVGs; updated ${changed.length} files, removed ${obsolete.length}`,
  )
}
