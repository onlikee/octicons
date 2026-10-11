# Octicons

GitHub Primer Octicons 的框架无关 SVG 数据与 JavaScript 工具。导入包和生成 SVG 字符串不需要框架或 DOM。

[English](./README.md) | 简体中文

## 安装与使用

```sh
npm install @onlikee/octicons
```

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

`toSVG(icon, options?)` 返回正确转义属性值和标题的 SVG 字符串。`createElement(icon, options?, document?)` 返回 `SVGSVGElement`，可传入其他文档；没有 DOM 时使用 `toSVG()`。

| 选项            | 类型                                                | 默认值         |
| --------------- | --------------------------------------------------- | -------------- |
| `size`          | `number \| 'small' \| 'medium' \| 'large'`          | `16`           |
| `fill`          | `string`                                            | `currentColor` |
| `title`         | `string`                                            | 无             |
| `verticalAlign` | `string`                                            | `text-bottom`  |
| `attrs`         | SVG 属性值：字符串、数字、布尔值、null 或 undefined | 无             |

`attrs` 使用标准 SVG 属性名，例如 `tabindex`、`aria-label`。null、undefined 不输出；`style` 使用 CSS 文本，可覆盖默认垂直对齐。尺寸计算得到的宽高和 viewBox 优先于 `attrs`，填充色通过 `fill` 选项设置。事件使用 `addEventListener()` 绑定。

`fill` 选项与根 SVG 的 CSS `fill` 控制图标填充色；CSS `fill` 优先于属性。未覆盖填充色时，默认 `currentColor` 跟随 CSS `color`。Flag、Vscode 等带有显式 `fill="currentColor"` 的路径在渲染输出中使用 `fill="inherit"`，从而继承根 SVG 的填充色。原始 SVG 资源和导出的图标数据保留源属性；子节点的 `none` 与固定填充色保持不变。

默认向辅助技术隐藏图标。提供 `aria-label` 或 `aria-labelledby` 后取消默认隐藏并设置 `role="img"`，但显式隐藏设置优先。仅提供标题不改变隐藏状态。非负 tabindex 会设置 `focusable="true"`。

## 尺寸与数据

`small`、`medium`、`large` 分别为 16、32、64，数字尺寸必须为有限非负值。`size` 表示显示高度；选择不超过它的最大原始高度，若比所有原始高度都小，则选择最小图稿。宽度按比例计算。对于具有 16/24 图稿的图标，size 23 使用 16 图稿，size 24 使用 24 图稿。

`IconDefinition` 包含 `name`、`heights`；每个原始高度包含 `width`、`viewBox`、`nodes`，节点包含 `tag`、`attrs`、`children`。`resolveIcon(icon, size?)` 返回选中的节点、viewBox、naturalHeight 和显示宽高，不进行渲染。所有图标默认显示高度均为 16。

包含 Octicons 19.40.0 的 397 个正式名称和三个别名。`bookmark-filled`、`repo-deleted` 为已弃用的 16 单尺寸别名；`play` 保留 `triangle-circle` 的 16/24 图稿。

原始 SVG 通过 `@onlikee/octicons/svg/accessibility-inset-24.svg` 等路径提供，具体资源加载方式取决于构建工具。单图标数据导入和静态根导入支持 tree shaking；为运行时查找引用完整图标命名空间会包含相应全部图标。

## 来源与许可

仓库保存 [Primer Octicons](https://github.com/primer/octicons) 19.40.0 的源码快照，提交为 `97825f832c98f817867f770d084c08e3edc6f78c`。仓库原始 SVG 位于根目录 `icons/`，目录内的 `icon-metadata.json`、`upstream.json` 与 `LICENSE.octicons` 分别保存元数据、来源记录与上游许可证。生成数据保留 SVG 路径和属性。采用 MIT 许可，详见 `LICENSE`、`LICENSE.octicons`、`NOTICE` 与 `SOURCE.json`。
