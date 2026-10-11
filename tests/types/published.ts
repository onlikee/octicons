import { Agent, toSVG, type IconSize } from '@onlikee/octicons'
import DeepAgent from '@onlikee/octicons/icons/agent'
import { AgentIcon, type IconProps } from '@onlikee/octicons-vue'
import DeepAgentIcon from '@onlikee/octicons-vue/icons/agent'

const size: IconSize = 'medium'
const props: IconProps = { size, fill: 'red' }
// @ts-expect-error Published types must reject CSS lengths.
const invalid: IconSize = '1em'
// @ts-expect-error Deep icon data must retain its definition type.
const invalidName: number = DeepAgent.name
// @ts-expect-error Deep component props must reject CSS lengths.
const invalidDeepProps: Parameters<typeof DeepAgentIcon>[0] = { size: '1em' }
// @ts-expect-error Root component props must reject CSS lengths.
const invalidRootProps: Parameters<typeof AgentIcon>[0] = { size: '1em' }
toSVG(Agent, { size })
void [
  DeepAgent,
  AgentIcon,
  DeepAgentIcon,
  props,
  invalid,
  invalidName,
  invalidDeepProps,
  invalidRootProps,
]
