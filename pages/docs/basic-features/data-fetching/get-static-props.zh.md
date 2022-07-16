# getStaticProps

如果你在一个页面中导出 `getStaticProps`（静态站点生成），Next.js 将会使用 `getStaticProps` 在构建时返回的 `props` 预渲染这个页面。

```jsx
export async function getStaticProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}
```

> 请注意，无论渲染方式如何，任何 `props` 都将被传递给页面组件，并且可以在客户端的初始 HTML 中查看。这是为了让页面能够正确地被[注水](https://reactjs.org/docs/react-dom.html#hydrate)。请确保不要在 `props` 中传递任何不应该在客户端出现的敏感信息。

## 何时使用 getStaticProps ？

如果满足以下条件之一，你应该使用 `getStaticProps`：

- 渲染页面所需的数据在用户**请求之前**的构建时间就已经存在
- 数据来自一个**无头 CMS（Headless CMS）**
- 页面**必须**预渲染（为了SEO），并且需要非常快 - `getStaticProps` 生成 `HTML` 和 `JSON` 文件，这两个文件可以由 CDN 缓存以提高性能
- 数据可以被**公开缓存**（不针对用户）- 在某些特定情况下，可以通过**使用中间件重写路径**来绕过这个条件

## getStaticProps 运行的时间

`getStaticProps` 只在服务器上运行，且永远不会在客户端运行。你可以[用这个工具](https://next-code-elimination.vercel.app/)验证写在 `getStaticProps` 内的代码是否从客户端捆绑中移除。

- `getStaticProps` 总是在 `next build` 时运行
- 当使用 `revalidate` 时，`getStaticProps` 在后台运行
- 当使用 [`revalidate()`](/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation) 时，`getStaticProps` **按需**在后台运行

在实现[静态增量再生](/docs/basic-features/data-fetching/incremental-static-regeneration)时，`getStaticProps` 将在后台运行，同时对陈旧的页面进行重新验证（revalidate），并将新的页面提供给浏览器。

`getStaticProps` 不能访问入站的请求（如查询参数或 HTTP 标头），因为它生成的是静态 HTML。如果你需要访问你的页面的请求，需要考虑在 `getStaticProps` 之外使用[中间件](/docs/middleware)。

## 使用 getStaticProps 从一个 CMS 中获取数据

以下示例展示了如何从一个 CMS 中获取一个文章的列表：

```jsx
// posts will be populated at build time by getStaticProps()
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}

export default Blog
```

[`getStaticProps` API 参考](/docs/api-reference/data-fetching/get-static-props)包含了所有 `getStaticProps` 可用的参数和属性。

## 直接编写服务端代码

由于 `getStaticProps` 只在服务器端运行，且永远不会在客户端运行，它甚至不会被包含在浏览器的 JavaScript 捆绑包中，所以你可以直接编写数据库查询，而不会被发送到浏览器上。

这意味着你可以直接在 `getStaticProps` 中编写服务端代码，而不是从 `getStaticProps` 中获取**API路由**的数据（该路由本身从外部获取数据）。

以下面的例子为例，一个 API 路由被用来从一个 CMS 中获取一些数据。然后直接从 `getStaticProps` 调用该 API 路由，这产生了一个额外的调用，降低了性能。相反，从 CMS 获取数据的逻辑可以通过使用 `lib/` 目录（其实目录名字随意）来共享，然后在 `getStaticProps` 中使用。

```jsx
// lib/load-posts.js

// The following function is shared
// with getStaticProps and API routes
// from a `lib/` directory
export async function loadPosts() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts/')
  const data = await res.json()

  return data
}

// pages/blog.js
import { loadPosts } from '../lib/load-posts'

// This function runs only on the server side
export async function getStaticProps() {
  // Instead of fetching your `/api` route you can call the same
  // function directly in `getStaticProps`
  const posts = await loadPosts()

  // Props returned will be passed to the page component
  return { props: { posts } }
}
```

另一方面，如果你**不**使用 API 路由来获取数据，[`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API 也*可以* 直接在 `getStaticProps` 中用来获取数据。

你可以[用这个工具](https://next-code-elimination.vercel.app/)查看什么代码从客户端捆绑中被移除。

## 静态生成 HTML 和 JSON

当一个带有 `getStaticProps` 的页面在构建时被预渲染时，除了页面的 HTML 文件外，Next.js 还会生成一个 JSON 文件，保存 `getStaticProps` 的结果。

这个 JSON 文件将会在通过 [`next/link`](/docs/api-reference/next/link) 或 [`next/router`](/docs/api-reference/next/router) 在客户端路由中使用。当你导航到一个使用 `getStaticProps` 预渲染的页面，Next.js 会获取相应的 JSON 文件（在构建时预先计算好的）并将它们用作这个页面组件的 `props`。这意味着客户端的页面过渡**不会**调用 `getStaticProps` 而只是使用了导出的 JSON 文件。

当使用增量静态生成时，`getStaticProps` 将在后台执行以生成客户端导航所需的 JSON。你可能会看到这种情况：对同一页面提出多个请求，但是，这是有意为之，对最终用户的性能没有影响。

## getStaticProps 可用的位置

`getStaticProps` 只可以从**页面**中导出，你**不可以**在非页面文件、`_app`、`_document` 以及 `_error` 中导出它。

这种限制的原因之一是，React 需要在页面渲染之前拥有所有需要的数据。

另外，你必须把导出的 `getStaticProps` 作为一个独立的函数来使用，如果你把 `getStaticProps` 作为页面组件的一个属性，它将**不会**工作。

> 注意：如果你已经创建了一个[自定义 `App`](/docs/advanced-features/custom-app)，请确保你将 `pageProps` 传递给页面组件，如链接文档中所示，否则 `props` 将是空的（没有数据）。

## 开发环境响应

在开发环境中（`next dev`），`getStaticPaths` 将在**每次请求**时运行。

## 预览模式

你可以暂时绕过静态生成，使用[**预览模式**](/docs/advanced-features/preview-mode)在**请求时间**而不是构建时间渲染页面。例如，你可能正在使用一个无头 CMS（Headless CMS），并希望在发布前预览草稿。

## 相关

关于下一步该做什么的更多信息，我们建议阅读以下章节：

- [**getStaticProps API 参考**](/docs/api-reference/data-fetching/get-static-props)
