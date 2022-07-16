# 内建 CSS 支持

<details open>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/basic-css">Basic CSS Example</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss">With Tailwind CSS</a></li>
  </ul>
</details>

Next.js 允许你从一个 JavaScript 文件中导入 CSS 文件。这之所以能够实现，是因为 Next.js 将 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 的概念扩展到了 JavaScript 之外。

## 添加全局样式表

要在你的整个应用程序中添加一个样式表，需要在 `pages/_app.js` 中导入 CSS 文件。

例如，考虑以下名为 `styles.css` 的样式表：

```css
body {
  font-family: 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica',
    'Arial', sans-serif;
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

创建 [`pages/_app.js`文件](/docs/advanced-features/custom-app) 如果不存在的话，然后[`导入（import）`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 这个 `styles.css` 文件。

```jsx
import '../styles.css'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

这些样式（`styles.css`）将应用于你的应用程序中的**所有**页面和组件。由于该样式表的全局性，为了避免冲突，你**只能在 [`pages/_app.js`](/docs/advanced-features/custom-app) 内导入**。

在开发过程中，以这种方式导入样式表允许你在编辑样式时热重载，这意味着你可以保持应用的状态。

在生产环境中，所有的 CSS 文件将被自动合并成一个的最小化的 `.css` 文件。

### 从 `node_modules` 导入样式

从 Next.js **9.5.4** 开始，在你的应用程序的任何地方从 `node_modules` 导入 CSS 文件是允许的。

对于全局样式表，如 `bootstrap` 或 `nprogress`，你应该在 `pages/_app.js` 中导入该文件。例如：

```jsx
// pages/_app.js
import 'bootstrap/dist/css/bootstrap.css'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

对于导入第三方组件所需的 CSS，你可以在你的组件中这样做：

```tsx
// components/ExampleDialog.js
import { useState } from 'react'
import { Dialog } from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'
import '@reach/dialog/styles.css'

function ExampleDialog(props) {
  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  return (
    <div>
      <button onClick={open}>Open Dialog</button>
      <Dialog isOpen={showDialog} onDismiss={close}>
        <button className="close-button" onClick={close}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>×</span>
        </button>
        <p>Hello there. I am a dialog</p>
      </Dialog>
    </div>
  )
}
```

## 添加组件级 CSS

Next.js 支持使用 `[名称].module.css` 文件命名的 [CSS 模块](https://github.com/css-modules/css-modules)。

CSS 模块通过自动创建一个独特的类名来对 CSS 进行局部范围划分。这使得你可以在不同的文件中使用相同的 CSS 类名，而不必担心冲突问题。

这种行为使 CSS 模块成为包含组件级 CSS 的理想方式。CSS 模块文件**可以在你的应用程序中的任何地方导入**。

例如，考虑 `components/` 文件夹中的一个可重复使用的 `Button` 组件。

首先，创建 `components/Button.module.css`，内容如下：

```css
/*
You do not need to worry about .error {} colliding with any other `.css` or
`.module.css` files!
*/
.error {
  color: white;
  background-color: red;
}
```

然后，创建 `components/Button.js`，导入并使用上述 CSS 文件：

```jsx
import styles from './Button.module.css'

export function Button() {
  return (
    <button
      type="button"
      // Note how the "error" class is accessed as a property on the imported
      // `styles` object.
      className={styles.error}
    >
      Destroy
    </button>
  )
}
```

CSS模块是一个*可选*的功能，并且**只对扩展名为 `.module.css` 的文件启用**。常规的 `<link>` 样式表和全局 CSS 文件仍然被支持。

在生产环境中，所有的 CSS 模块文件将会自动生成**多个最小化且代码分割的**  `.css` 文件。这些 `.css` 文件代表了你的应用程序中的热执行路径，确保你的应用程序加载最小量的 CSS 来绘制（paint）。

## Sass 支持

Next.js 允许你使用 `.scss` 和 `.sass` 扩展名导入 Sass。你可以通过 CSS  Modules 的 `.module.scss` 或 `.module.sass` 扩展名使用组件级的 Sass。

在你使用 Next.js 内建的 Sass 支持之前，确保你已经安装了 [`sass`](https://github.com/sass/sass)：

```bash
npm install --save-dev sass
```

内建的 Sass 支持与上面详述的内置 CSS 支持具有同样的好处和限制。

> **注意**：Sass 支持[两种不同的语法](https://sass-lang.com/documentation/syntax)，每种语法都有自己的扩展名，`.scss` 扩展要求你使用 [SCSS语法](https://sass-lang.com/documentation/syntax#scss)，而 `.sass` 扩展要求你使用[缩进语法（“Sass”）](https://sass-lang.com/documentation/syntax#the-indented-syntax)
> 
> 如果你不确定选择哪个，可以从 `.scss` 扩展开始，它是 CSS 的超集，不需要学习额外的缩进语法（“Sass”）

### 自定义 Sass 选项

如果你想配置 Sass 编译器，你可以通过在 `next.config.js` 中使用 `sassOptions` 来实现。

例如，添加 `includePaths`：

```js
const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}
```

### Sass 变量

Next.js 支持从 CSS 模块文件导出的 Sass 变量。

例如，使用导出的 `primaryColor` Sass 变量：

```scss
/* variables.module.scss */
$primary-color: #64ff00;

:export {
  primaryColor: $primary-color;
}
```

```js
// pages/_app.js
import variables from '../styles/variables.module.scss'

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout color={variables.primaryColor}>
      <Component {...pageProps} />
    </Layout>
  )
}
```

## CSS-in-JS

<details>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-styled-jsx">Styled JSX</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-styled-components">Styled Components</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-emotion">Emotion</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-linaria">Linaria</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss-emotion">Tailwind CSS + Emotion</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-styletron">Styletron</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-cxs">Cxs</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-aphrodite">Aphrodite</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-fela">Fela</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-stitches">Stitches</a></li>
  </ul>
</details>

可以使用任何现有的 CSS-in-JS 解决方案。最简单的是内联样式：

```jsx
function HiThere() {
  return <p style={{ color: 'red' }}>hi there</p>
}

export default HiThere
```

我们捆绑了 [styled-jsx](https://github.com/vercel/styled-jsx)，以提供对独立的范围内 CSS 的支持。其目的是支持类似于 Web 组件的“shadow CSS”，遗憾的是，Web 组件[不支持服务器渲染，只支持 JS](https://github.com/w3c/webcomponents/issues/71)。

关于其他流行的 CSS-in-JS 解决方案（如 Styled Components），请参见上面的例子。

一个使用 `styled-jsx` 的组件看起来像这样：

```jsx
function HelloWorld() {
  return (
    <div>
      Hello world
      <p>scoped!</p>
      <style jsx>{`
        p {
          color: blue;
        }
        div {
          background: red;
        }
        @media (max-width: 600px) {
          div {
            background: blue;
          }
        }
      `}</style>
      <style global jsx>{`
        body {
          background: black;
        }
      `}</style>
    </div>
  )
}

export default HelloWorld
```

查看 [styled-jsx 文档](https://github.com/vercel/styled-jsx) 获取更多示例。

## FAQ

### 是否支持禁用 JavaScript ？

是的，如果你禁用了 JavaScript，CSS 仍然会在生产构建中加载（`next start`）。在开发过程中，我们要求启用 JavaScript，以提供[快速刷新](https://nextjs.org/blog/next-9-4#fast-refresh)的最佳开发者体验。

## 相关

关于下一步该做什么的更多信息，我们推荐以下章节：

- [**自定义 PostCSS 配置** / 用你自己的配置和 Next.js 添加的插件来扩展PostCSS 的配置和插件](/docs/advanced-features/customizing-postcss-config)
