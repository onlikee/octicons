import { createApp, h, nextTick, ref } from 'vue'
import { Agent, AccessibilityInset, createElement, toSVG } from '@onlikee/octicons'
import { AccessibilityInsetIcon } from '@onlikee/octicons-vue'

const results: string[] = []
const check = (condition: boolean, name: string) => {
  if (!condition) throw new Error(name)
  results.push(`PASS ${name}`)
  document.querySelector('#results')!.textContent = results.join('\n')
}

const title = '<Agent> & "quoted"'
const native = createElement(Agent, { size: 24, title, attrs: { 'aria-label': 'Agent', tabindex: 0 } })
document.querySelector('#native')!.appendChild(native)
check(native instanceof SVGSVGElement && native.namespaceURI === 'http://www.w3.org/2000/svg', 'native SVG namespace')
check(native.viewBox.baseVal.height === 24 && native.height.baseVal.value === 24, 'native natural size')
check(native.querySelector('title')!.textContent === title, 'native title is text')
check(native.getAttribute('role') === 'img' && native.getAttribute('focusable') === 'true', 'native label and focus')
const parsed = new DOMParser().parseFromString(toSVG(Agent, { title, attrs: { 'data-value': '<"&' } }), 'image/svg+xml')
check(parsed.querySelector('parsererror') === null && parsed.querySelector('title')!.textContent === title, 'string SVG escaping')
check(parsed.documentElement.getAttribute('data-value') === '<"&', 'string attribute escaping')
const otherDocument = document.implementation.createHTMLDocument('Other document')
check(createElement(Agent, {}, otherDocument).ownerDocument === otherDocument, 'injected document')

const size = ref(16)
const labelled = ref(false)
const element = ref<SVGSVGElement>()
let clicks = 0
createApp({
  setup: () => () => h(AccessibilityInsetIcon, {
    ref: element,
    size: size.value,
    class: ['custom', { active: true }],
    style: { verticalAlign: 'middle', color: 'blue' },
    'aria-label': labelled.value ? 'Accessibility' : undefined,
    tabindex: labelled.value ? 0 : -1,
    onClick: () => { clicks += 1 },
  }),
}).mount('#vue')
document.querySelector('#resize')!.addEventListener('click', () => { size.value = 24 })
document.querySelector('#label')!.addEventListener('click', () => { labelled.value = true })
await nextTick()
const adapted = document.querySelector<SVGSVGElement>('#vue svg')!
check(element.value === adapted, 'Vue functional component ref is SVG')
check(adapted.viewBox.baseVal.height === 16 && adapted.getAttribute('aria-hidden') === 'true', 'Vue initial size and hidden state')
check(adapted.classList.contains('custom') && adapted.classList.contains('active'), 'Vue class fallthrough')
check(getComputedStyle(adapted).verticalAlign === 'middle' && getComputedStyle(adapted).color === 'rgb(0, 0, 255)', 'Vue style override')
adapted.dispatchEvent(new MouseEvent('click', { bubbles: true }))
check(clicks === 1, 'Vue event delivered once')
document.querySelector<HTMLButtonElement>('#resize')!.click()
await nextTick()
check(adapted.viewBox.baseVal.height === 24 && adapted.height.baseVal.value === 24, 'Vue reactive drawing switch')
check(adapted.querySelector('path')!.getAttribute('d') === AccessibilityInset.heights[24].nodes[0].attrs.d, 'Vue 24 artwork')
document.querySelector<HTMLButtonElement>('#label')!.click()
await nextTick()
check(!adapted.hasAttribute('aria-hidden') && adapted.getAttribute('role') === 'img', 'Vue reactive accessibility')
adapted.focus()
check(document.activeElement === adapted && adapted.getAttribute('focusable') === 'true', 'Vue SVG focus')
results.push('All browser checks passed')
document.querySelector('#results')!.textContent = results.join('\n')
