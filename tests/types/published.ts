import { Agent, toSVG, type IconSize } from '@onlikee/octicons'
import DeepAgent from '@onlikee/octicons/icons/agent'
import { AgentIcon, type IconProps } from '@onlikee/octicons-vue'
import DeepAgentIcon from '@onlikee/octicons-vue/icons/agent'

const size: IconSize = 'medium'
const props: IconProps = { size, fill: 'red' }
// @ts-expect-error Published types must reject CSS lengths.
const invalid: IconSize = '1em'
toSVG(Agent, { size })
void [DeepAgent, AgentIcon, DeepAgentIcon, props, invalid]
