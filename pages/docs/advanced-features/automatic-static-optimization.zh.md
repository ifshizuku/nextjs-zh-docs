# 自动静态优化

页面中如果没有 `getServerSideProps` 和 `getInitialProps` ，Next.js 将认为页面是静态的（可以预渲染）。

此功能允许 Next.js 生成包含**服务端渲染**和**静态生成**的混合应用程序。

> 静态生成的页面仍然是响应式的：Next.js 将水合你的客户端应用程序，使其具有完全的交互性

此功能的主要优点之一是，优化的页面不需要服务端计算，并且可以从多个 CDN 传输给用户。

最终为用户提供 *超快的加载体验*。

## 工作原理

如果页面中存在 `getServerSideProps` 或 `getInitialProps`，则 Next.js 将切换到按需、按请求渲染（即：[服务端渲染](/docs/basic-features/pages#server-side-rendering)）。

如果不是上述情况，Next.js 将通过将页面预渲染为静态 HTML 来自动**静态优化**您的页面。

在预渲染期间，路由器的 `query` 对象将为空，因为我们在此阶段没有要提供的 `query` 信息。水合后，Next.js 将触发对应用程序的更新，在 `query` 对象中提供路由参数。

在水合后，query 将被更新，会触发另一次渲染的情况是：

- 该页面是一个[动态路由](/docs/routing/dynamic-routes).
- 网页在网址中具有查询（query）值.
- 你的 `next.config.js` 中配置了[重写（rewrites）](/docs/api-reference/next-config-js/rewrites) ，因为它们可能需要在 `query` 中解析和提供的参数。

为了能够区分 query 是否已完全更新并可供使用，您可以利用 [`next/router`](/docs/api-reference/next/router#router-object) 上的 `isReady` 字段。

>**注意:** 通过 [动态路由](/docs/routing/dynamic-routes) 添加到使用 [`getStaticProps`](/docs/basic-features/data-fetching/get-static-props) 的页面的参数在 `query` 对象中始终可用。

`next build` 将生成静态优化页面的 `.html` 文件。

例如，页面 `pages/about.js` 的结果将是：

```bash
.next/server/pages/about.html
```
如果你将 `getServerSideProps` 添加到页面中，它将是 JavaScript，如下所示：

```bash
.next/server/pages/about.js
```

## 注意事项

- 如果你有一个带有 `getInitialProps` 的 [自定义 `App`](/docs/advanced-features/custom-app)，那么这个优化将在没有 [静态生成](/docs/basic-features/data-fetching/get-static-props) 的页面中关闭。

- 如果你有一个带有 `getInitialProps` 的 [自定义 `Document`](/docs/advanced-features/custom-document)，请确保你在假设该页面是服务端渲染之前检查是否定义了 `ctx.req`，对于预渲染的页面，`ctx.req` 将是 `undefined`。

- 在渲染树中的 [`next/router`](/docs/api-reference/next/router#router-object)  上避免使用 `asPath` 值，直到路由的 `isReady` 字段为 `true`。静态优化的页面只知道客户端上的路径，而不知道服务器上的路径，因此将其用作 `prop` 可能会导致不匹配错误。[`active-class-name` 示例](https://github.com/vercel/next.js/tree/canary/examples/active-class-name) 演示了将 `asPath` 用作 `prop` 的一种方法。