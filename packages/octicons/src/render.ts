import type { IconDefinition, IconNode, IconOptions, IconSize, SvgAttributes } from './types.js'

const namespace = 'http://www.w3.org/2000/svg'
const sizes = { small: 16, medium: 32, large: 64 }

export function resolveIcon(icon: IconDefinition, size: IconSize = 16) {
  const height = typeof size === 'number' ? size : sizes[size]
  if (!Number.isFinite(height) || height < 0)
    throw new RangeError('size must be a nonnegative finite number or small/medium/large')
  const heights = Object.keys(icon.heights)
    .map(Number)
    .sort((a, b) => a - b)
  const naturalHeight = heights.reduce(
    (selected, current) => (current <= height ? current : selected),
    heights[0],
  )
  const natural = icon.heights[naturalHeight]
  return { ...natural, height, width: (height * natural.width) / naturalHeight, naturalHeight }
}

function attributes(icon: IconDefinition, options: IconOptions): SvgAttributes {
  const resolved = resolveIcon(icon, options.size)
  const attrs = options.attrs ?? {}
  const labelled = attrs['aria-label'] || attrs['aria-labelledby']
  const hidden =
    attrs['aria-hidden'] === undefined ? (labelled ? undefined : 'true') : attrs['aria-hidden']
  return {
    xmlns: namespace,
    'data-component': 'Octicon',
    ...attrs,
    'aria-hidden': hidden,
    role: labelled && hidden !== 'true' && hidden !== true ? 'img' : undefined,
    focusable: attrs.tabindex != null && Number(attrs.tabindex) >= 0 ? 'true' : 'false',
    class: `octicon octicon-${icon.name}${attrs.class ? ` ${attrs.class}` : ''}`,
    viewBox: resolved.viewBox,
    width: resolved.width,
    height: resolved.height,
    fill: options.fill ?? 'currentColor',
    display: 'inline-block',
    overflow: 'visible',
    style: `vertical-align:${options.verticalAlign ?? 'text-bottom'};${attrs.style ?? ''}`,
  }
}

function nodeAttributes(node: IconNode) {
  return node.attrs.fill === 'currentColor' ? { ...node.attrs, fill: 'inherit' } : node.attrs
}

const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!,
  )
const serializeAttributes = (attrs: SvgAttributes) =>
  Object.entries(attrs)
    .filter(([, value]) => value != null)
    .map(([name, value]) => ` ${name}="${escape(String(value))}"`)
    .join('')
const serializeNode = (node: IconNode): string =>
  `<${node.tag}${serializeAttributes(nodeAttributes(node))}>${node.children.map(serializeNode).join('')}</${node.tag}>`

export function toSVG(icon: IconDefinition, options: IconOptions = {}): string {
  const { nodes } = resolveIcon(icon, options.size)
  const title = options.title ? `<title>${escape(options.title)}</title>` : ''
  return `<svg${serializeAttributes(attributes(icon, options))}>${title}${nodes.map(serializeNode).join('')}</svg>`
}

export function createElement(
  icon: IconDefinition,
  options: IconOptions = {},
  ownerDocument: Document = document,
): SVGSVGElement {
  const createNode = (node: IconNode): Element => {
    const element = ownerDocument.createElementNS(namespace, node.tag)
    for (const [name, value] of Object.entries(nodeAttributes(node)))
      element.setAttribute(name, value)
    for (const child of node.children) element.appendChild(createNode(child))
    return element
  }
  const svg = ownerDocument.createElementNS(namespace, 'svg')
  for (const [name, value] of Object.entries(attributes(icon, options))) {
    if (value != null) svg.setAttribute(name, String(value))
  }
  if (options.title) {
    const title = ownerDocument.createElementNS(namespace, 'title')
    title.textContent = options.title
    svg.appendChild(title)
  }
  for (const node of resolveIcon(icon, options.size).nodes) svg.appendChild(createNode(node))
  return svg
}
