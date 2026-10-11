![octicons cover light](https://user-images.githubusercontent.com/54012/138925195-5779c51d-ff8c-4264-a914-e64f4843893d.png#gh-light-mode-only)
![octicons cover dark](https://user-images.githubusercontent.com/54012/138925203-80e1afa1-ba54-4731-9525-3c41186663f9.png#gh-dark-mode-only)
<br>
<br>
<h1 align="center">Octicons-Vue</h1>

<p align="center">
This icon component library is the Vue 3 version of <a href="https://github.com/primer/octicons">Octicons</a>.<br>
Requires Vue 3.3 or later.
</p>

<p align="center">
English | <a href="./README.zh-CN.md">简体中文</a>
</p>

## Install

```sh
npm install @onlikee/octicons-vue
```

## Usage

```vue
<script setup lang="ts">
import { MarkGithubIcon, XIcon } from '@onlikee/octicons-vue'
import AccessibilityIcon from '@onlikee/octicons-vue/icons/accessibility'
</script>

<template>
  <MarkGithubIcon />
  <XIcon :size="20" fill="#cf222e" />
  <AccessibilityIcon size="medium" aria-label="Accessibility" />
</template>
```

Each icon accepts:

| Prop            | Type                                       | Default        |
| --------------- | ------------------------------------------ | -------------- |
| `size`          | `number \| 'small' \| 'medium' \| 'large'` | `16`           |
| `fill`          | `string`                                   | `currentColor` |
| `title`         | `string`                                   | none           |
| `verticalAlign` | CSS vertical alignment                     | `text-bottom`  |

Size is the display height; width scales proportionally. Select the largest available natural drawing at or below the requested height, or the smallest drawing for smaller requests. `small`, `medium` and `large` mean 16, 32 and 64. Only actual available drawings are selected.

Standard Vue SVG attributes, classes, styles and events are supported. The default class is `octicon octicon-<name>`; output includes `data-component="Octicon"`. Labels (`aria-label` or `aria-labelledby`) control the default hidden state and role; explicit `aria-hidden` takes precedence. A nonnegative `tabindex` makes the SVG focusable. `title` adds a title element without automatically labelling the icon. Styles override the default vertical alignment. Size-derived width, height and viewBox take precedence over passed attributes. Standard SVG `color` sets CSS color; use `fill` to set fill explicitly.

The `fill` prop and CSS `fill` on the root SVG control the icon's fill; CSS `fill` takes precedence over the attribute. Without an override, the default `currentColor` follows CSS `color`. Paths with an explicit `fill="currentColor"`, including FlagIcon and VscodeIcon, render with `fill="inherit"` so they follow the root fill. Original SVG assets and exported icon data retain their source attributes; `none` and fixed child fill colors remain unchanged.

## Imports

Named imports with the `Icon` suffix are available from the package root:

```ts
import { CheckIcon, XIcon, MarkGithubIcon } from '@onlikee/octicons-vue'
```

Deep imports are available for individual icons:

```ts
import CheckIcon from '@onlikee/octicons-vue/icons/check'
```

## Framework-independent core

`@onlikee/octicons` provides SVG data, `toSVG()`, `createElement()` and original SVG assets without framework runtime dependencies. See the [core package documentation](https://github.com/onlikee/octicons/tree/main/packages/octicons).

## Development

Use Node 22.12 or later to run the Vite 7 development tools. Run the following development commands from the repository root.

```sh
npm install
npm run typecheck
npm run build
npm test
```

Run `npm run test:browser` and open the printed local URL for browser verification. Generated modules are ignored by Git. Builds and type checks generate them automatically; tests build both packages first. Use `npm run generate:check` to compare existing generated files without rewriting them.

Original SVGs are stored in the root `icons/` directory. `icons/icon-metadata.json` defines aliases and protected geometry, `icons/upstream.json` records the source version and commit, and `icons/LICENSE.octicons` contains the upstream license.

The snapshot contains 397 canonical names and three aliases from Octicons 19.40.0, commit `97825f832c98f817867f770d084c08e3edc6f78c`. `BookmarkFilledIcon` and `RepoDeletedIcon` are deprecated 16-only aliases; `PlayIcon` includes the 16 and 24 drawings of `TriangleCircleIcon`.

## Contributing

Contributions are welcome! Feel free to add or update icons, but please ensure that any additions follow the Octicons visual guidelines.

If you notice anything that could be improved, please open an issue.

## Thanks

This project is built upon the open-source [Octicons](https://github.com/primer/octicons) project, with all icon SVGs sourced from [Octicons/icons](https://github.com/primer/octicons/tree/main/icons).

I would like to sincerely thank the designers, GitHub, and the Primer team for their incredible work in creating and maintaining such a thoughtful, clear, and reliable visual language for developers.

## License and attribution

This package is released under the MIT license.

The icon path data is based on GitHub Primer Octicons, which is MIT licensed. See `NOTICE` for attribution details.
