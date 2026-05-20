![octicons cover light](https://user-images.githubusercontent.com/54012/138925195-5779c51d-ff8c-4264-a914-e64f4843893d.png#gh-light-mode-only)
![octicons cover dark](https://user-images.githubusercontent.com/54012/138925203-80e1afa1-ba54-4731-9525-3c41186663f9.png#gh-dark-mode-only)
<br>
<br>
<h1 align="center">Octicons-Vue3</h1>

<p align="center">
This icon component library is the Vue 3 version of <a href="https://github.com/primer/octicons">Octicons</a>.<br>
Requires Vue 3.3 or later.
</p>

<p align="center">
English | <a href="./README.zh-CN.md">简体中文</a>
</p>

## Install

```sh
npm install octicons-vue3
```

## Usage

```vue
<script setup lang="ts">
import { MarkGithubIcon, XIcon } from 'octicons-vue3'
import AccessibilityIcon from 'octicons-vue3/icons/accessibility'
</script>

<template>
  <MarkGithubIcon />
  <XIcon :size="20" color="#cf222e" />
  <AccessibilityIcon size="1.25em" />
</template>
```

Each icon accepts:

| Prop | Type | Default |
| --- | --- | --- |
| `size` | `number \| string` | `16` |
| `color` | `string` | `currentColor` |

## Imports

Named imports with the `Icon` suffix are available from the package root:

```ts
import { CheckIcon, XIcon, MarkGithubIcon } from 'octicons-vue3'
```

Deep imports are available for individual icons:

```ts
import CheckIcon from 'octicons-vue3/icons/check'
```

## Contributing

Contributions are welcome! Feel free to add or update icons, but please ensure that any additions follow the Octicons visual guidelines.

If you notice anything that could be improved, please open an issue.

## Thanks

This project is built upon the open-source [Octicons](https://github.com/primer/octicons) project, with approximately 98% of the icon SVGs sourced from [Octicons/icons](https://github.com/primer/octicons/tree/main/icons).

I would like to sincerely thank the designers, GitHub, and the Primer team for their incredible work in creating and maintaining such a thoughtful, clear, and reliable visual language for developers.

## License and attribution

This package is released under the MIT license.

The icon path data is based on GitHub Primer Octicons, which is MIT licensed. See `NOTICE` for attribution details.
