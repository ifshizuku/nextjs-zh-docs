# 受支持的浏览器和功能

Next.js支持 **IE11 和所有现代浏览器**（Edge、Firefox、Chrome、Safari、Opera等），无需配置。

## Polyfills

我们注入 IE11 兼容性所需的 polyfills。此外，我们还注入了广泛使用的 polyfills，包括：

- [**fetch()**](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) — 代替 `whatwg-fetch` 和 `unfetch`
- [**URL**](https://developer.mozilla.org/en-US/docs/Web/API/URL) — 代替 [`url` 包 (Node.js API)](https://nodejs.org/api/url.html)
- [**Object.assign()**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) — 代替 `object-assign`、`object.assign` 和 `core-js/object/assign`

如果你的任何依赖包含这些 polyfills，它们将在生产构建中自动移除避免重复。

此外，为了减少包的大小，Next.js 将只为需要的浏览器加载这些 polyfills。全球大部分的网络流量不会下载这些 polyfills。

### 服务端 Polyfills

除了客户端的 `fetch()`，Next.js 还在 Node.js 环境下对 `fetch()` 进行了 polyfills。你可以在你的服务器代码中使用 `fetch()`（比如在 `getStaticProps` / `getServerSideProps`），而不需要使用诸如 `isomorphic-unfetch` 或 `node-fetch` 等 polyfills。

### 自定义 Polyfills

如果你自己的代码或任何外部 npm 依赖项需要你的目标浏览器不支持的功能，你需要自己添加 polyfills。

在这种情况下，你应该在你的 [自定义 `<App>`](/docs/advanced-features/custom-app) 或单个组件中为你需要的**特定的 polyfill** 添加一个最高级导入。

## JavaScript 功能

Next.js 允许你使用最新的 JavaScript 功能，开箱即用。除了 [ES6 功能](https://github.com/lukehoban/es6features)，Next.js  还支持：

- [Async / await](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)（ES2017）
- [对象占位 / 展开属性](https://github.com/tc39/proposal-object-rest-spread)（ES2018）
- [动态 `import()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import)（ES2020）
- [ 可选链操作符 ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining)（ES2020）
- [ 空值合并运算符 ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)（ES2020）
- [类](https://github.com/tc39/proposal-class-fields) 和 [静态属性](https://github.com/tc39/proposal-static-class-features)（阶段 3 提议的一部分）
- 更多！

### TypeScript 功能

Next.js 具有内建 TypeScript 支持，[了解更多](/docs/basic-features/typescript)。

### 自定义 Babel 配置（高级）

你可以自定义 Babel 的配置，[了解更多](/docs/advanced-features/customizing-babel-config)。
