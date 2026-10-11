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
  <XIcon :size="20" color="#cf222e" />
  <AccessibilityIcon size="1.25em" />
</template>
```

每个图标组件都支持以下属性：

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `size` | `number \| string` | `16` |
| `color` | `string` | `currentColor` |

## 导入方式

可以从包根路径按带 `Icon` 后缀的名称进行命名导入：

```ts
import { CheckIcon, XIcon, MarkGithubIcon } from '@onlikee/octicons-vue'
```

也可以按需深度导入单个图标：

```ts
import CheckIcon from '@onlikee/octicons-vue/icons/check'
```

## 贡献

欢迎贡献！你可以添加或更新图标，但请确保新增内容遵循 Octicons 的视觉规范。

如果你觉得哪里有问题，请提交issue。

## 致谢

本项目基于开源的 [Octicons](https://github.com/primer/octicons) 项目构建，其中约 98% 的图标 SVG 来源于 [Octicons/icons](https://github.com/primer/octicons/tree/main/icons)。

在此真诚感谢设计师、GitHub 以及 Primer 团队。他们创造并持续维护了这样一套细致、清晰且可靠的开发者视觉语言，也为本项目提供了坚实的基础。

## 许可证与归属说明

本包基于 MIT 许可证发布。

图标路径数据基于 GitHub Primer Octicons，该项目同样采用 MIT 许可证。更多归属信息请参见 `NOTICE`。
