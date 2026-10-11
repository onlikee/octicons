# Octicons

Framework-independent SVG data and JavaScript utilities for GitHub Primer Octicons. No framework or DOM is required to import the package or generate SVG strings.

English | [简体中文](./README.zh-CN.md)

## Install

```sh
npm install @onlikee/octicons
```

## Usage

```ts
import { AccessibilityInset, toSVG, createElement } from '@onlikee/octicons'
import Agent from '@onlikee/octicons/icons/agent'

const markup = toSVG(AccessibilityInset, { size: 24, fill: '#cf222e' })
const element = createElement(Agent, {
  size: 32,
  title: 'Agent',
  attrs: { 'aria-label': 'Agent', class: 'custom' },
})
document.body.appendChild(element)
```

`toSVG(icon, options?)` returns a string with escaped attribute values and title text. `createElement(icon, options?, document?)` returns an `SVGSVGElement`; supply a document explicitly when using another document. Without a DOM, use `toSVG()` instead.

| Option | Type | Default |
| --- | --- | --- |
| `size` | `number \| 'small' \| 'medium' \| 'large'` | `16` |
| `fill` | `string` | `currentColor` |
| `title` | `string` | none |
| `verticalAlign` | `string` | `text-bottom` |
| `attrs` | SVG attribute values: string, number, boolean, null or undefined | none |

Use standard SVG names in `attrs`, such as `tabindex` and `aria-label`. Attribute values of null or undefined are omitted. Pass `style` as CSS text; it overrides the default vertical alignment. Size-derived width, height and viewBox take precedence over `attrs`. Use the `fill` option for fill, and attach events with `addEventListener()`.

Icons default to hidden from assistive technology. `aria-label` or `aria-labelledby` removes the default hidden attribute and sets `role="img"`, unless explicitly hidden. A title alone does not change this behavior. A nonnegative tabindex sets `focusable="true"`.

## Sizes and data

`small`, `medium` and `large` mean 16, 32 and 64 pixels. Numeric sizes must be finite and nonnegative. The requested size is the display height. Select the largest available natural height at or below that value, or the smallest drawing if the requested value is smaller than every available drawing. Width scales proportionally. For a 16/24 icon, size 23 uses the 16 drawing and size 24 uses the 24 drawing.

Each `IconDefinition` contains `name` and `heights`. Each natural-height entry contains `width`, `viewBox` and SVG `nodes`; nodes contain `tag`, `attrs` and `children`. `resolveIcon(icon, size?)` returns the selected nodes, viewBox, naturalHeight and display width/height without rendering. The default display height is always 16, including icons with a different upstream Node helper default.

All 397 canonical names and three aliases from Octicons 19.40.0 are included. `bookmark-filled` and `repo-deleted` are deprecated 16-only aliases; `play` retains both 16 and 24 drawings of `triangle-circle`.

Original SVG files are available through paths such as `@onlikee/octicons/svg/accessibility-inset-24.svg`. Asset loading depends on your bundler. Single-icon data imports and static root imports support tree shaking; importing a complete namespace for runtime lookup includes all referenced icons.

## Source and license

The repository keeps a checked-in snapshot of [Primer Octicons](https://github.com/primer/octicons), version 19.40.0, commit `97825f832c98f817867f770d084c08e3edc6f78c`. Repository source SVGs live in the root `icons/` directory, alongside `icon-metadata.json`, `upstream.json` and `LICENSE.octicons` within that directory. Generated data preserves the SVG paths and attributes. MIT licensed; see `LICENSE`, `LICENSE.octicons`, `NOTICE` and `SOURCE.json`.
