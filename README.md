# Onlikee Octicons

Framework-independent SVG data and a Vue 3 adapter for GitHub Primer Octicons.

English | [简体中文](./README.zh-CN.md)

## Packages

| Package | Description | Documentation |
| --- | --- | --- |
| `@onlikee/octicons` | SVG data, string and native DOM rendering, original SVG assets | [Core](./packages/octicons/README.md) |
| `@onlikee/octicons-vue` | Vue 3.3+ icon components | [Vue](./packages/octicons-vue/README.md) |

Install the package you use:

```sh
npm install @onlikee/octicons
npm install @onlikee/octicons-vue
```

The display height defaults to 16. Sizes accept numbers or `small`, `medium`, `large` (16, 32, 64). Rendering selects the largest available natural drawing at or below the requested height, or the smallest drawing for smaller requests; width scales proportionally.

## Repository layout

```text
icons/                             Original SVGs, metadata, source record and upstream license
scripts/                           Synchronization, validation, generation and SVG asset build
packages/
  octicons/
    src/                           Types, size selection and native rendering
    src/__generated__/             Generated icon data and exports
    dist/                          Published JavaScript, declarations and SVG assets
  octicons-vue/
    src/                           Vue component factory and types
    src/__generated__/             Generated components and exports
    dist/                          Published JavaScript and declarations
tests/                             Runtime, template types, consumer bundles and browser checks
```

The root package is private and manages npm workspaces. Generated TypeScript modules in `src/__generated__/`, package attribution copies and `dist/` are ignored by Git. Builds and type checks generate the required source automatically; tests build both packages first. `npm run generate:check` compares existing generated files without rewriting them. Public root and `icons/<name>` imports remain available in both packages; the core also exports `svg/<name>-<height>.svg` assets.

## Development

Use Node 22.12 or later for the Vite 7 development tools. Run commands from the repository root:

```sh
npm install
npm run typecheck
npm run build
npm test
```

Refresh the upstream snapshot explicitly, then regenerate:

```sh
npm run sync:octicons -- --source <octicons checkout>
npm run generate
npm run generate:check
```

`icons/icon-metadata.json` defines aliases and protected geometry. `icons/upstream.json` records the source version and commit; `icons/LICENSE.octicons` contains the upstream MIT license. The snapshot contains 397 canonical names and three aliases from Octicons 19.40.0, commit `97825f832c98f817867f770d084c08e3edc6f78c`.

Run `npm run test:browser` and open the printed URL for browser verification. Build the core before building the Vue package separately. To inspect each publishable package:

```sh
npm pack --dry-run --workspace=@onlikee/octicons
npm pack --dry-run --workspace=@onlikee/octicons-vue
```

## License and attribution

MIT licensed. Icon graphics originate from [GitHub Primer Octicons](https://github.com/primer/octicons). See `LICENSE`, `icons/LICENSE.octicons` and `NOTICE`.
