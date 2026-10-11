# Onlikee Octicons

GitHub Primer Octicons 的框架无关 SVG 数据与 Vue 3 适配包。

[English](./README.md) | 简体中文

## 发布包

| 包 | 用途 | 文档 |
| --- | --- | --- |
| `@onlikee/octicons` | SVG 数据、字符串与原生 DOM 渲染、原始 SVG 资源 | [核心包](./packages/octicons/README.zh-CN.md) |
| `@onlikee/octicons-vue` | Vue 3.3 及以上版本的图标组件 | [Vue 包](./packages/octicons-vue/README.zh-CN.md) |

安装需要使用的包：

```sh
npm install @onlikee/octicons
npm install @onlikee/octicons-vue
```

默认显示高度为 16。尺寸接受数字或 `small`、`medium`、`large`（16、32、64）。选择不超过目标高度的最大原始图稿，若目标更小则选择最小图稿；宽度按比例计算。

## 仓库布局

```text
icons/                             原始 SVG、元数据、来源记录与上游许可证
scripts/                           同步、校验、生成与 SVG 资源构建
packages/
  octicons/
    src/                           类型、尺寸选择与原生渲染
    src/__generated__/             生成的图标数据与导出
    dist/                          发布的 JavaScript、声明与 SVG 资源
  octicons-vue/
    src/                           Vue 组件工厂与类型
    src/__generated__/             生成的组件与导出
    dist/                          发布的 JavaScript 与声明
tests/                             运行时、模板类型、消费端打包与浏览器验证
```

根包为私有包，统一管理 npm workspaces。Git 忽略 `src/__generated__/` 中的生成模块、包内归属文件副本与 `dist/`。构建和类型检查自动生成所需源码；测试先构建两个包。`npm run generate:check` 只读比较已有生成结果。两个包均保留根导入与 `icons/<名称>` 深度导入；核心包另提供 `svg/<名称>-<高度>.svg` 资源。

## 开发

Vite 7 开发工具需要 Node 22.12 或更高版本。在仓库根目录执行：

```sh
npm install
npm run typecheck
npm run build
npm test
```

显式更新上游快照，再重新生成：

```sh
npm run sync:octicons -- --source <octicons checkout>
npm run generate
npm run generate:check
```

`icons/icon-metadata.json` 保存别名与受保护图形信息；`icons/upstream.json` 记录来源版本和提交；`icons/LICENSE.octicons` 保存上游 MIT 许可证。快照包含 Octicons 19.40.0 的 397 个正式名称与三个别名，来源提交为 `97825f832c98f817867f770d084c08e3edc6f78c`。

运行 `npm run test:browser` 并打开输出的地址进行浏览器验证。分别构建包时，先构建核心包，再构建 Vue 包。检查发布内容：

```sh
npm pack --dry-run --workspace=@onlikee/octicons
npm pack --dry-run --workspace=@onlikee/octicons-vue
```

## 许可证与归属

采用 MIT 许可证，图稿来源于 [GitHub Primer Octicons](https://github.com/primer/octicons)。详见 `LICENSE`、`icons/LICENSE.octicons` 与 `NOTICE`。
