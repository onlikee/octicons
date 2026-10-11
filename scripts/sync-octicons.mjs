import { execFileSync } from 'node:child_process'
import { cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { readUpstream, root, snapshot } from './upstream.mjs'

const args = process.argv.slice(2)
if (args.length !== 2 || args[0] !== '--source') throw new Error('Usage: npm run sync:octicons -- --source <octicons checkout>')
const source = resolve(args[1])
if (source === resolve(root)) throw new Error('Source must be an external Octicons checkout')
const { icons } = readUpstream(resolve(source, 'icons'), resolve(source, 'icon-metadata.json'))
const version = JSON.parse(readFileSync(resolve(source, 'lib/octicons_node/package.json'), 'utf8')).version
const commit = execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const dirty = execFileSync('git', ['-C', source, 'status', '--porcelain', '--', 'icons', 'icon-metadata.json', 'LICENSE', 'lib/octicons_node/package.json'], { encoding: 'utf8' }).trim()
if (dirty) throw new Error('Upstream snapshot inputs have uncommitted changes')
// The destination is fixed inside this workspace, never supplied by the caller.
rmSync(resolve(root, 'icons'), { recursive: true, force: true })
cpSync(resolve(source, 'icons'), resolve(root, 'icons'), { recursive: true })
cpSync(resolve(source, 'icon-metadata.json'), resolve(snapshot, 'icon-metadata.json'))
cpSync(resolve(source, 'LICENSE'), resolve(snapshot, 'LICENSE.octicons'))
writeFileSync(resolve(snapshot, 'upstream.json'), JSON.stringify({ repository: 'https://github.com/primer/octicons', version, commit }, null, 2) + '\n', 'utf8')
console.log(`Synced Octicons ${version} (${commit}), ${icons.size} icon names`)
