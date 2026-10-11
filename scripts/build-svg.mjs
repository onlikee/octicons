import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { readUpstream, root } from './upstream.mjs'

// Run after Vite has cleared dist, using the same validated snapshot as generation.
const { raw } = readUpstream()
const directory = resolve(root, 'packages/octicons/dist/svg')
mkdirSync(directory, { recursive: true })
for (const [filename, source] of raw) writeFileSync(resolve(directory, filename), source, 'utf8')
console.log(`Built ${raw.size} original and alias SVG assets`)
