import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import test from 'node:test'
import { parseSync } from 'svgson'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import * as core from '@onlikee/octicons'
import * as vue from '../packages/octicons-vue/dist/index.js'
import { root, snapshot, pascalCase, readUpstream } from '../scripts/upstream.mjs'

const metadata = JSON.parse(readFileSync(resolve(snapshot, 'icon-metadata.json'), 'utf8'))
const definitions = Object.values(core).filter(
  (value) => value && typeof value === 'object' && value.heights,
)
const normalizeNode = (node) => ({
  tag: node.name,
  attrs: node.attributes,
  children: node.children.map(normalizeNode),
})
const svg = (source) => parseSync(source)
const render = (icon, props = {}) => renderToString(createSSRApp({ render: () => h(icon, props) }))
const css = (style) =>
  Object.fromEntries(
    (style ?? '')
      .split(';')
      .filter(Boolean)
      .map((entry) => {
        const colon = entry.indexOf(':')
        return [entry.slice(0, colon).trim(), entry.slice(colon + 1).trim()]
      }),
  )

test('all upstream drawings and alias SVGs retain geometry and dimensions', () => {
  assert.equal(readdirSync(snapshot).filter((file) => file.endsWith('.svg')).length, 770)
  assert.equal(definitions.length, 400)
  assert.equal(Object.keys(vue).length, 400)
  assert.equal(readdirSync(resolve(root, 'packages/octicons/dist/svg')).length, 774)
  for (const icon of definitions) {
    assert.ok(vue[`${pascalCase(icon.name)}Icon`], icon.name)
    const canonical = icon.aliasOf ?? icon.name
    const expectedHeights = icon.aliasOf
      ? metadata[canonical].aliases[icon.name].heights.map(String).sort()
      : readdirSync(snapshot)
          .filter((file) => file.replace(/-\d+\.svg$/, '') === canonical)
          .map((file) => file.match(/-(\d+)\.svg$/)[1])
          .sort()
    assert.deepEqual(Object.keys(icon.heights).sort(), expectedHeights, icon.name)
    for (const [height, drawing] of Object.entries(icon.heights)) {
      const source = readFileSync(resolve(snapshot, `${canonical}-${height}.svg`), 'utf8')
      const expected = svg(source)
      assert.equal(drawing.width, Number(expected.attributes.width), icon.name)
      assert.equal(drawing.viewBox, expected.attributes.viewBox, icon.name)
      assert.deepEqual(
        drawing.nodes,
        expected.children.map(normalizeNode),
        `${icon.name}-${height}`,
      )
      assert.equal(
        readFileSync(
          resolve(root, 'packages/octicons/dist/svg', `${icon.name}-${height}.svg`),
          'utf8',
        ),
        source,
      )
    }
  }
  for (const name of ['LogoGiteeIcon', 'LogoOnlikeeIcon', 'SpinnerIcon'])
    assert.equal(vue[name], undefined)
})

test('natural size selection covers boundaries, enums, single sizes and aspect ratio', () => {
  for (const [requested, natural] of [
    [8, 12],
    [12, 12],
    [15.9, 12],
    [16, 16],
    [23.9, 16],
    [24, 24],
    [32, 24],
  ]) {
    const resolved = core.resolveIcon(core.AlertFill, requested)
    assert.equal(resolved.naturalHeight, natural)
    assert.equal(resolved.height, requested)
  }
  for (const [requested, height, natural] of [
    ['small', 16, 16],
    ['medium', 32, 24],
    ['large', 64, 48],
    [47, 47, 24],
    [48, 48, 48],
    [95, 95, 48],
    [96, 96, 96],
    [128, 128, 96],
  ]) {
    const resolved = core.resolveIcon(core.Copilot, requested)
    assert.equal(resolved.height, height)
    assert.equal(resolved.naturalHeight, natural)
  }
  assert.equal(core.resolveIcon(core.NoEntryFill).naturalHeight, 12)
  assert.equal(core.resolveIcon(core.GitPullRequestUnlisted, 64).naturalHeight, 16)
  assert.equal(core.resolveIcon(core.BookmarkFill).height, 16)
  assert.equal(core.resolveIcon(core.RepoDelete).height, 16)
  assert.equal(
    core.resolveIcon(core.LogoGithub, 20).width,
    (20 * core.LogoGithub.heights[16].width) / 16,
  )
  for (const icon of [core.BookmarkFilled, core.RepoDeleted]) {
    assert.equal(icon.deprecated, true)
    assert.equal(core.resolveIcon(icon, 64).naturalHeight, 16)
  }
  assert.equal(core.resolveIcon(core.Play, 24).naturalHeight, 24)
  assert.throws(() => core.resolveIcon(core.Agent, '1em'), RangeError)
  for (const size of [NaN, Infinity, -1])
    assert.throws(() => core.resolveIcon(core.Agent, size), RangeError)
  assert.equal(core.resolveIcon(core.Agent, 0).height, 0)
})

test('all Vue SSR drawings and core SVG output agree at natural and display sizes', async () => {
  for (const icon of definitions) {
    const component = vue[`${pascalCase(icon.name)}Icon`]
    for (const size of new Set([undefined, 20, 32, 64, ...Object.keys(icon.heights).map(Number)])) {
      const native = svg(core.toSVG(icon, { size }))
      const adapted = svg(await render(component, { size }))
      delete native.attributes.xmlns
      assert.deepEqual(
        css(native.attributes.style),
        css(adapted.attributes.style),
        `${icon.name}: styles`,
      )
      delete native.attributes.style
      delete adapted.attributes.style
      assert.deepEqual(adapted.attributes, native.attributes, `${icon.name}: ${size}`)
      assert.deepEqual(adapted.children, native.children, `${icon.name}: drawing ${size}`)
    }
  }
})

test('Flag and Vscode paths inherit root fill without changing source data', async () => {
  for (const icon of [core.Flag, core.Vscode]) {
    const original = structuredClone(icon)
    const component = vue[`${pascalCase(icon.name)}Icon`]
    for (const size of [16, 24]) {
      for (const fill of [undefined, 'red', 'none']) {
        const native = svg(core.toSVG(icon, { size, fill }))
        const adapted = svg(await render(component, { size, fill }))
        assert.equal(native.attributes.fill, fill ?? 'currentColor')
        assert.equal(adapted.attributes.fill, native.attributes.fill)
        assert.deepEqual(adapted.children, native.children)
        assert.equal(native.children[0].attributes.fill, 'inherit')
        assert.equal(native.children[0].attributes.d, original.heights[size].nodes[0].attrs.d)
      }
    }
    assert.deepEqual(icon, original)
  }
})

test('nested node rendering preserves none, fixed fills and other source attributes', () => {
  const icon = {
    name: 'nested',
    heights: {
      16: {
        width: 16,
        viewBox: '0 0 16 16',
        nodes: [
          {
            tag: 'g',
            attrs: { opacity: '0.5' },
            children: ['currentColor', 'none', '#123456'].map((fill) => ({
              tag: 'path',
              attrs: { fill, d: 'M0 0h16v16H0z' },
              children: [],
            })),
          },
        ],
      },
    },
  }
  const original = structuredClone(icon)
  const group = svg(core.toSVG(icon, { fill: 'red' })).children[0]
  assert.deepEqual(group.attributes, original.heights[16].nodes[0].attrs)
  assert.deepEqual(
    group.children.map((node) => node.attributes.fill),
    ['inherit', 'none', '#123456'],
  )
  assert.deepEqual(icon, original)
})

test('labels, hidden state, focus, title, color and fallthrough follow the render contract', async () => {
  const cases = [
    [{}, 'true', undefined],
    [{ 'aria-label': 'Agent' }, undefined, 'img'],
    [{ 'aria-labelledby': 'label' }, undefined, 'img'],
    [{ 'aria-label': 'Agent', 'aria-hidden': 'true' }, 'true', undefined],
    [{ 'aria-label': 'Agent', 'aria-hidden': true }, 'true', undefined],
    [{ 'aria-hidden': false }, 'false', undefined],
  ]
  for (const [attrs, hidden, role] of cases) {
    for (const output of [core.toSVG(core.Agent, { attrs }), await render(vue.AgentIcon, attrs)]) {
      const actual = svg(output).attributes
      assert.equal(actual['aria-hidden'], hidden)
      assert.equal(actual.role, role)
    }
  }
  for (const tabindex of [undefined, -1, 0, 2, '0']) {
    const expected = tabindex !== undefined && Number(tabindex) >= 0 ? 'true' : 'false'
    assert.equal(
      svg(core.toSVG(core.Agent, { attrs: { tabindex } })).attributes.focusable,
      expected,
    )
    assert.equal(svg(await render(vue.AgentIcon, { tabindex })).attributes.focusable, expected)
  }
  const title = 'Agent <title> & "quote"'
  const attrs = {
    class: 'custom',
    style: 'vertical-align:middle;color:blue',
    color: 'green',
    'data-component': 'Custom',
    'data-label': '<"&',
  }
  const options = { size: 24, fill: 'red', title, attrs }
  const native = svg(core.toSVG(core.Agent, options))
  const adapted = svg(await render(vue.AgentIcon, { size: 24, fill: 'red', title, ...attrs }))
  for (const actual of [native, adapted]) {
    assert.equal(actual.attributes.fill, 'red')
    assert.equal(actual.attributes.color, 'green')
    assert.equal(actual.attributes.class, 'octicon octicon-agent custom')
    assert.equal(actual.attributes['data-component'], 'Custom')
    assert.equal(actual.attributes['data-octicon'], undefined)
    assert.equal(css(actual.attributes.style)['vertical-align'], 'middle')
    assert.equal(actual.children[0].name, 'title')
  }
  assert.deepEqual(adapted.children, native.children)
  assert.equal(svg(await render(vue.AgentIcon, { color: 'red' })).attributes.fill, 'currentColor')
  assert.equal(
    svg(
      await render(vue.AgentIcon, {
        class: ['one', { two: true }],
        style: { verticalAlign: 'middle' },
        width: 999,
        height: 999,
        viewBox: '0 0 1 1',
      }),
    ).attributes.class,
    'octicon octicon-agent one two',
  )
  assert.equal(svg(await render(vue.AgentIcon, { width: 999 })).attributes.width, '16')
})

test('the core imports in Node without DOM or framework runtime dependencies', () => {
  assert.equal(typeof globalThis.document, 'undefined')
  assert.match(core.toSVG(core.Agent), /^<svg/)
  assert.throws(() => core.createElement(core.Agent), ReferenceError)
  const pkg = JSON.parse(readFileSync(resolve(root, 'packages/octicons/package.json'), 'utf8'))
  assert.equal(pkg.dependencies, undefined)
  assert.equal(pkg.peerDependencies, undefined)
  assert.equal(Object.keys(pkg.exports).includes('./svg/*.svg'), true)
  const result = execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      "import Agent from '@onlikee/octicons/icons/agent'; import { toSVG } from '@onlikee/octicons'; console.log(toSVG(Agent))",
    ],
    { cwd: root, encoding: 'utf8' },
  )
  assert.match(result, /octicon-agent/)
})

test('source validation rejects changed protected drawings and invalid dimensions/aliases', () => {
  const directory = mkdtempSync(resolve(tmpdir(), 'octicons-validation-'))
  try {
    mkdirSync(resolve(directory, 'icons'))
    const source = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M0 0"/></svg>'
    writeFileSync(resolve(directory, 'icons/example-16.svg'), source)
    writeFileSync(resolve(directory, 'icon-metadata.json'), '{}')
    assert.equal(
      readUpstream(resolve(directory, 'icons'), resolve(directory, 'icon-metadata.json')).icons
        .size,
      1,
    )
    writeFileSync(
      resolve(directory, 'icons/example-16.svg'),
      source.replace('height="16"', 'height="24"'),
    )
    assert.throws(
      () => readUpstream(resolve(directory, 'icons'), resolve(directory, 'icon-metadata.json')),
      /Invalid dimensions/,
    )
    writeFileSync(resolve(directory, 'icons/example-16.svg'), source)
    writeFileSync(
      resolve(directory, 'icon-metadata.json'),
      JSON.stringify({ example: { aliases: { old: { heights: [24] } } } }),
    )
    assert.throws(
      () => readUpstream(resolve(directory, 'icons'), resolve(directory, 'icon-metadata.json')),
      /Invalid alias/,
    )
    writeFileSync(
      resolve(directory, 'icon-metadata.json'),
      JSON.stringify({ example: { protectedGeometry: { 16: '0'.repeat(64) } } }),
    )
    assert.throws(
      () => readUpstream(resolve(directory, 'icons'), resolve(directory, 'icon-metadata.json')),
      /Protected geometry differs/,
    )
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})
