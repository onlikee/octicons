import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseSync } from 'svgson'

export const root = fileURLToPath(new URL('../', import.meta.url))
export const snapshot = resolve(root, 'icons')
export const pascalCase = (name) =>
  name.replace(/(^|-)([a-z])/g, (_, separator, letter) => letter.toUpperCase())

// Match upstream's protected-geometry fingerprint, including attribute ordering.
function geometryFingerprint(ast) {
  const normalize = (node) => ({
    name: node.name,
    type: node.type,
    value: node.value.trim(),
    attributes: Object.fromEntries(
      Object.keys(node.attributes)
        .sort()
        .map((key) => [key, node.attributes[key]]),
    ),
    children: node.children
      .filter((child) => child.type === 'element' || child.value.trim().length > 0)
      .map(normalize),
  })
  return createHash('sha256')
    .update(JSON.stringify(normalize(ast)))
    .digest('hex')
}

function iconNode(node) {
  if (node.type !== 'element') throw new Error(`Unsupported SVG node: ${node.type}`)
  return { tag: node.name, attrs: node.attributes, children: node.children.map(iconNode) }
}

export function readUpstream(
  directory = snapshot,
  metadataFile = resolve(directory, 'icon-metadata.json'),
) {
  const icons = new Map()
  const raw = new Map()
  const fingerprints = new Map()
  for (const filename of readdirSync(directory).sort()) {
    if (!filename.endsWith('.svg')) continue
    const match = filename.match(/^([a-z0-9]+(?:-[a-z0-9]+)*)-(\d+)\.svg$/)
    if (!match) throw new Error(`Invalid SVG filename: ${filename}`)
    const [, name, heightText] = match
    const height = Number(heightText)
    const source = readFileSync(resolve(directory, filename), 'utf8')
    const ast = parseSync(source)
    const width = Number(ast.attributes.width)
    if (
      ast.name !== 'svg' ||
      !Number.isInteger(width) ||
      width <= 0 ||
      height <= 0 ||
      Number(ast.attributes.height) !== height ||
      ast.attributes.viewBox !== `0 0 ${width} ${height}`
    ) {
      throw new Error(`Invalid dimensions or viewBox: ${filename}`)
    }
    if (!icons.has(name)) icons.set(name, { name, heights: {} })
    const icon = icons.get(name)
    if (icon.heights[height]) throw new Error(`Duplicate natural height: ${filename}`)
    icon.heights[height] = {
      width,
      viewBox: ast.attributes.viewBox,
      nodes: ast.children.map(iconNode),
    }
    raw.set(filename, source)
    fingerprints.set(filename, geometryFingerprint(parseSync(source, { camelcase: true })))
  }
  const metadata = JSON.parse(readFileSync(metadataFile, 'utf8'))
  for (const [name, config] of Object.entries(metadata)) {
    const icon = icons.get(name)
    if (!icon) throw new Error(`Metadata target has no SVG: ${name}`)
    for (const key of Object.keys(config)) {
      if (!['defaultHeight', 'aliases', 'protectedGeometry'].includes(key))
        throw new Error(`Unknown metadata: ${name}.${key}`)
    }
    if (
      config.defaultHeight !== undefined &&
      (!Number.isInteger(config.defaultHeight) || !icon.heights[config.defaultHeight])
    ) {
      throw new Error(`Invalid defaultHeight: ${name}`)
    }
    for (const [height, fingerprint] of Object.entries(config.protectedGeometry ?? {})) {
      if (fingerprints.get(`${name}-${height}.svg`) !== fingerprint)
        throw new Error(`Protected geometry differs: ${name}-${height}`)
    }
    for (const [alias, options] of Object.entries(config.aliases ?? {})) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(alias) || icons.has(alias))
        throw new Error(`Invalid or duplicate alias: ${alias}`)
      for (const key of Object.keys(options)) {
        if (!['heights', 'deprecated'].includes(key))
          throw new Error(`Unknown alias metadata: ${alias}.${key}`)
      }
      if (
        !Array.isArray(options.heights) ||
        !options.heights.length ||
        new Set(options.heights).size !== options.heights.length ||
        options.heights.some((height) => !Number.isInteger(height) || !icon.heights[height]) ||
        (options.deprecated !== undefined && typeof options.deprecated !== 'boolean')
      ) {
        throw new Error(`Invalid alias heights or deprecation: ${alias}`)
      }
      icons.set(alias, {
        name: alias,
        heights: Object.fromEntries(
          options.heights.map((height) => [height, icon.heights[height]]),
        ),
        aliasOf: name,
        ...(options.deprecated ? { deprecated: true } : {}),
      })
      for (const height of options.heights)
        raw.set(`${alias}-${height}.svg`, raw.get(`${name}-${height}.svg`))
    }
  }
  return { icons: new Map([...icons].sort(([a], [b]) => a.localeCompare(b, 'en'))), raw }
}
