import { h } from 'vue'
import type { CSSProperties, FunctionalComponent, SVGAttributes, VNode } from 'vue'
import { resolveIcon } from '@onlikee/octicons'
import type { IconDefinition, IconNode, IconSize } from '@onlikee/octicons'

export type IconProps = Omit<SVGAttributes, 'size'> & {
  size?: IconSize
  title?: string
  verticalAlign?: CSSProperties['verticalAlign']
}

function renderNode(node: IconNode): VNode {
  return h(node.tag, node.attrs, node.children.map(renderNode))
}

export function createIconComponent(icon: IconDefinition): FunctionalComponent<IconProps> {
  const Icon: FunctionalComponent<IconProps> = (props, { attrs }) => {
    const resolved = resolveIcon(icon, props.size)
    const labelled = attrs['aria-label'] || attrs['aria-labelledby']
    const hidden = attrs['aria-hidden'] === undefined ? labelled ? undefined : 'true' : attrs['aria-hidden']
    return h('svg', {
      'data-component': 'Octicon',
      ...attrs,
      'aria-hidden': hidden,
      role: labelled && hidden !== 'true' && hidden !== true ? 'img' : undefined,
      focusable: attrs.tabindex != null && Number(attrs.tabindex) >= 0 ? 'true' : 'false',
      class: [`octicon octicon-${icon.name}`, attrs.class],
      viewBox: resolved.viewBox,
      width: resolved.width,
      height: resolved.height,
      fill: props.fill ?? 'currentColor',
      display: 'inline-block',
      overflow: 'visible',
      style: [{ verticalAlign: props.verticalAlign ?? 'text-bottom' }, attrs.style],
    }, [
      ...(props.title ? [h('title', props.title)] : []),
      ...resolved.nodes.map(renderNode),
    ])
  }
  Icon.props = ['size', 'fill', 'title', 'verticalAlign']
  Icon.inheritAttrs = false
  return Icon
}
