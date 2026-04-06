
## 1. 总体约定

### 1.1 目标运行环境

* **HTML**：HTML5
* **CSS**：CSS3（现代浏览器）
* **JavaScript**：ECMAScript 2022+（建议以 ES2023 语法为上限，但避免实验性提案）
* **类型体系**：优先 **JSDoc + `// @ts-check`** 实现“强类型体验”（无需 TypeScript 也能做静态类型检查）

### 1.2 格式与风格

* 缩进：**2 空格**（HTML/CSS/JS 全部统一；避免 2/4 混用）
* 行宽：建议 **100**（超长字符串用模板字符串分段）
* 文件换行：文件末尾必须有换行
* 编码：UTF-8
* 命名：

  * JS 变量/函数：`camelCase`
  * JS 类：`PascalCase`
  * 常量：`UPPER_SNAKE_CASE`
  * CSS 类：推荐 `kebab-case` 或 `BEM`（见 CSS 章节）
  * HTML `id`：`kebab-case`，且页面内唯一

### 1.3 质量门槛（“零警告”导向）

* JS：启用 ESLint（recommended + import + promise + jsdoc 方向），并开启类型检查（见 4.1）
* CSS：Stylelint（standard）
* 格式化：Prettier（统一风格，避免团队内争议）
* 任何 PR / 提交：不得引入 lint warning / type warning

---

## 2. 文件头部“文档字符串”规范（Web 版）

你在 Python 里用模块 docstring；Web 里用标准注释块，内容字段保持一致。

### 2.1 HTML 文件头

放在 `<!doctype html>` 之后或之前均可，但建议紧跟在 `<!doctype html>` 后。

```html
<!--
文件功能描述, 使用中文

:file: templates/game/index.html
:author: 大师
:time: 2026-01-03
-->
```

### 2.2 CSS 文件头

```css
/*
文件功能描述, 使用中文

:file: static/css/game.css
:author: 大师
:time: 2026-01-03
*/
```

### 2.3 JS 文件头

```js
/**
 * 文件功能描述, 使用中文
 *
 * @file static/js/game.js
 * @author 大师
 * @date 2026-01-03
 */
```

---

## 3. HTML 编码规范

### 3.1 结构与语义

* 必须声明：`<!doctype html>`
* 必须包含：`<html lang="zh-CN">`（或你实际语言）
* 使用语义化标签：`header/nav/main/section/article/footer`
* 表单控件必须配套 `<label for="">`
* 图片必须有 `alt`（纯装饰图可 `alt=""`）

### 3.2 属性与数据绑定

* JS 绑定优先使用 `data-*`：`data-role="fight-window"`、`data-action="open"`
* 避免在 HTML 上写 `onclick="..."`（可维护性差、难做类型检查）
* ID 仅用于锚点或必要唯一定位；样式选择器不要依赖 ID

### 3.3 可访问性与交互

* 可点击元素必须可聚焦：按钮用 `<button>`，链接用 `<a>`
* 自定义组件必须补 ARIA（如 `role="dialog"`、`aria-modal="true"` 等）

---

## 4. JavaScript 编码规范（强类型 + 现代写法）

### 4.1 类型与静态检查（核心要求）

* 每个 JS 文件顶部必须加：

  * `// @ts-check`
* 使用 **JSDoc** 写类型：

  * `@typedef` 定义对象结构
  * `@param` / `@returns` 约束函数签名
  * `@throws` 描述异常语义
* 所有导出/公共函数必须有 JSDoc；模块内关键私有函数也建议有

示例（你可以把它当作 JS 的“函数 docstring”标准）：

```js
// @ts-check

/**
 * 计算玩家修复进度百分比。
 * @param {number} doneCount 已完成数量
 * @param {number} totalCount 总数量
 * @returns {number} 百分比（0-100）
 * @throws {RangeError} 当 totalCount 小于等于 0
 */
function calcProgress(doneCount, totalCount) {
  if (totalCount <= 0) {
    throw new RangeError("totalCount 必须大于 0");
  }
  return Math.min(100, Math.max(0, (doneCount / totalCount) * 100));
}
```

### 4.2 语言特性与禁用项

* 必须使用：`const` / `let`，禁止 `var`
* 必须使用严格模式（若非 ES module）：

  * 内联脚本推荐 IIFE 包裹：`(() => { "use strict"; ... })();`
* 推荐使用：

  * 可选链：`obj?.a?.b`
  * 空值合并：`x ?? defaultValue`
  * 解构：`const { a, b } = obj`
  * 模板字符串：`` `${name}` ``
  * `Array.prototype.map/filter/reduce`
* 避免使用：

  * 隐式类型转换（例如 `==`），统一用 `===`
  * 过度嵌套回调（优先 async/await）
  * 随意的全局变量（必须封装在模块/IIFE）

### 4.3 错误处理与可观测性

* 允许失败的操作（网络/存储/解析）必须：

  * 明确 `try/catch`
  * 抛出**语义化错误**或返回明确错误对象（不要静默失败）
* 只在“边界层”做 `console.*`（例如调试入口），业务逻辑层不要散落日志

### 4.4 DOM 操作规范

* DOM 查询必须缓存：重复使用的节点不要重复 `querySelector`
* 事件绑定优先事件委托（特别是列表/动态节点）
* 严禁拼接不可信 HTML：不要 `innerHTML = userInput`
* UI 状态变化必须可追踪：推荐统一 `render(state)` 或最小化状态机

---

## 5. CSS 编码规范（与你“尽量简单”兼容）

### 5.1 命名与组织

* 推荐 BEM（适合小游戏/弹窗组件化）：

  * `dialog`（Block）
  * `dialog__header`（Element）
  * `dialog--open`（Modifier）
* 或统一 `kebab-case`，但必须保持一致

### 5.2 变量与主题

* 必须使用 CSS 变量管理主题与尺寸（像素风尤其需要统一尺度）：

  * `--ui-scale`
  * `--color-bg`
  * `--color-fg`
  * `--px`（像素风基准）
* 颜色、间距、层级（z-index）必须集中定义，禁止散落魔法数

### 5.3 布局与响应式

* 优先 Flex / Grid
* 移动端优先：使用 `@media (max-width: ...)`
* 触控区域：按钮最小点击区域建议 >= 44px（移动端）

### 5.4 禁止项

* 禁止 `!important`（除非第三方样式覆盖且不可控，并必须写明原因在文档字符串里）
* 禁止使用过深选择器链（>3 层通常就是维护风险）
* 禁止依赖 DOM 层级结构做关键样式（易碎）

---

## 6. 安全规范（Web 必备底线）

* **XSS**：不可信内容禁止进入 `innerHTML`；必须使用 `textContent`
* **CSRF**：Django 表单提交必须 `{% csrf_token %}`
* **存储**：

  * `localStorage` 仅存非敏感状态（进度、设置）
  * 敏感令牌不落地或使用 HttpOnly Cookie（若你走服务端会话）

## 多端支持

游戏需要支持PC Web端和手机移动端, 并自动识别
