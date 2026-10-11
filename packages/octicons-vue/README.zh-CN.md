![octicons cover light](https://user-images.githubusercontent.com/54012/138925195-5779c51d-ff8c-4264-a914-e64f4843893d.png#gh-light-mode-only)
![octicons cover dark](https://user-images.githubusercontent.com/54012/138925203-80e1afa1-ba54-4731-9525-3c41186663f9.png#gh-dark-mode-only)
<br>
<br>
<h1 align="center">Octicons-Vue</h1>

<p align="center">
这是 <a href="https://github.com/primer/octicons">Octicons</a> 的 Vue 3 版本图标组件库。<br>
需要 Vue 3.3 或更高版本。
</p>

<p align="center">
<a href="./README.md">English</a> | 简体中文
</p>

## 安装

```sh
npm install @onlikee/octicons-vue
```

## 使用

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

每个图标组件都支持以下属性：

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `size` | `number \| 'small' \| 'medium' \| 'large'` | `16` |
| `fill` | `string` | `currentColor` |
| `title` | `string` | 无 |
| `verticalAlign` | CSS 垂直对齐 | `text-bottom` |

`size` 为显示高度，宽度按比例计算。选择不超过目标高度的最大原始图稿；目标小于所有原始尺寸时使用最小图稿。`small`、`medium`、`large` 分别为 16、32、64，仅选择图标实际提供的尺寸。

支持标准 Vue SVG 属性、类名、样式与事件。默认类名为 `octicon octicon-<名称>`，输出 `data-component="Octicon"`。`aria-label` 或 `aria-labelledby` 决定默认隐藏状态与角色，显式 `aria-hidden` 优先。非负 `tabindex` 使 SVG 可聚焦。`title` 添加标题节点，但不会自动改变隐藏状态。调用方样式可覆盖默认垂直对齐；尺寸计算得到的宽高和 viewBox 优先于传入属性。标准 SVG `color` 设置 CSS 颜色，显式填充色使用 `fill`。

## 导入方式

可以从包根路径按带 `Icon` 后缀的名称进行命名导入：

```ts
import { CheckIcon, XIcon, MarkGithubIcon } from '@onlikee/octicons-vue'
```

也可以按需深度导入单个图标：

```ts
import CheckIcon from '@onlikee/octicons-vue/icons/check'
```

## 框架无关核心包

`@onlikee/octicons` 提供 SVG 数据、`toSVG()`、`createElement()` 和原始 SVG 资源，不依赖框架运行时。详见[核心包文档](https://github.com/onlikee/octicons-vue/blob/main/packages/octicons/README.zh-CN.md)。

## 开发

Vite 7 开发工具需要 Node 22.12 或更高版本。以下开发命令在仓库根目录执行。

```sh
npm install
npm run typecheck
npm run build
npm test
```

运行 `npm run test:browser` 并打开输出的本地地址进行浏览器验证。更新上游快照时运行 `npm run sync:octicons -- --source <octicons checkout>`，随后执行 `npm run generate`。生成模块不纳入 Git；构建和类型检查自动生成源码，测试先构建两个包。`npm run generate:check` 用于只读比较已有生成结果。

原始 SVG 存放在根目录 `icons/`；`icons/icon-metadata.json` 保存别名与受保护图形信息，`icons/upstream.json` 记录来源版本和提交，`icons/LICENSE.octicons` 保存上游许可证。

快照包含 Octicons 19.40.0 的 397 个正式名称和三个别名，来源提交为 `97825f832c98f817867f770d084c08e3edc6f78c`。`BookmarkFilledIcon`、`RepoDeletedIcon` 为已弃用的 16 单尺寸别名；`PlayIcon` 包含 `TriangleCircleIcon` 的 16/24 图稿。

## 贡献

欢迎贡献！你可以添加或更新图标，但请确保新增内容遵循 Octicons 的视觉规范。

如果你觉得哪里有问题，请提交issue。

## 致谢

本项目基于开源的 [Octicons](https://github.com/primer/octicons) 项目构建，全部图标 SVG 来源于 [Octicons/icons](https://github.com/primer/octicons/tree/main/icons)。

在此真诚感谢设计师、GitHub 以及 Primer 团队。他们创造并持续维护了这样一套细致、清晰且可靠的开发者视觉语言，也为本项目提供了坚实的基础。

## 许可证与归属说明

本包基于 MIT 许可证发布。

图标路径数据基于 GitHub Primer Octicons，该项目同样采用 MIT 许可证。更多归属信息请参见 `NOTICE`。
