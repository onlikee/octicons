import type { IconProps, IconSize } from '../../packages/octicons-vue/src'
import type { IconOptions } from '@onlikee/octicons'

const sizes: IconSize[] = [16, 'small', 'medium', 'large']
const props: IconProps = { size: sizes[0], fill: 'red', color: 'green', tabindex: 0 }
const options: IconOptions = { size: 24, attrs: { 'aria-label': 'Agent' } }
// @ts-expect-error CSS lengths are not supported.
const invalid: IconSize = '1.25em'
void [props, options, invalid]
