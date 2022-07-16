# getServerSideProps

如果你在一个页面中导出 `getServerSideProps`（服务端渲染），Next.js 将会使用 `getServerSideProps` 返回的数据在每一次请求中预渲染这个页面。

```js
export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}
```

> 请注意，无论渲染方式如何，任何 `props` 都将被传递给页面组件，并且可以在客户端的初始 HTML 中查看。这是为了让页面能够正确地被[注水](https://reactjs.org/docs/react-dom.html#hydrate)。请确保不要在 `props` 中传递任何不应该在客户端出现的敏感信息。

## getServerSideProps 运行的时间

`getServerSideProps` 只会在服务端运行，且永远不会在浏览器中运行。如果一个页面使用了 `getServerSideProps` 那么：

- 当你直接请求这个页面时，`getServerSideProps` 在请求时运行，这个页面将用返回的 `props` 进行预渲染
- 当你通过 [`next/link`](/docs/api-reference/next/link) 或 [`next/router`](/docs/api-reference/next/router) 在客户端页面转换中请求这个页面，Next.js 会向服务器发送一个 API 请求来运行 `getServerSideProps`

`getServerSideProps` 返回 JSON 数据用于渲染页面。所有这些工作将由 Next.js 自动处理，所以只要你定义了 `getServerSideProps`，就不需要做任何额外的事情。

你可以使用 [next-code-elimination tool](https://next-code-elimination.vercel.app/) 来验证 Next.js 在客户端的捆绑中移除了什么。

`getServerSideProps` 只能从**页面**中导出，**你不可以在非页面文件中导出它。**

注意，你必须将 `getServerSideProps` 作为一个独立的函数导出，如果你将 `getServerSideProps` 作为页面组件的一个属性，那么它将**不会**工作。

[`getServerSideProps` API 参考](/docs/api-reference/data-fetching/get-server-side-props) 包含了所有 `getServerSideProps` 可用的参数和属性。

## 何时使用 getServerSideProps ？

只有当你需要渲染一个必须在请求时获取数据的页面时，你才应该使用 `getServerSideProps`，这可能是由于数据的性质或请求的属性（如 `身份验证` 标头或地理位置）。使用 `getServerSideProps` 的页面将会在每次请求时通过服务端渲染，只有在[配置缓存控制标头](/docs/going-to-production#caching)的情况下才会被缓存。

如果你不需要在请求时渲染数据，那么你应该考虑在[客户端](#fetching-data-on-the-client-side)获取数据或使用 [`getStaticProps`](/docs/basic-features/data-fetching/get-static-props)。

### getServerSideProps 与 API 路由

当你想从服务器上获取数据时，你可能很想去创建一个 [API 路由](/docs/api-routes/introduction)，然后从 `getServerSideProps` 中调用该 API 路由。这是一个不必要且低效的方法，因为它将导致一个额外的请求，因为 `getServerSideProps` 和 API Routes 都在服务器上运行。

以下面的例子为例，一个 API 路由被用来从一个 CMS 中获取一些数据。然后直接从 `getServerSideProps` 调用该 API 路由，这产生了一个额外的调用，降低了性能。相反，直接将你的 API 路由中使用的逻辑导入到 `getServerSideProps` 中。这可能意味着直接通过 `getServerSideProps` 调用 CMS、数据库或其他 API。

## 在客户端获取数据

如果你的页面包含频繁更新的数据，并且你不需要预先渲染数据，你可以在[客户端](/docs/basic-features/data-fetching/client-side)上获取数据，比如获取用户特定的数据：

- 首先，立即显示无数据页面，页面的部分内容可以使用静态生成进行预渲染，你可以为缺失的数据显示加载状态
- 然后，在客户端获取数据，并在准备好后显示

这种方法对用户仪表盘页面很有效。因为仪表盘是一个私人的、针对用户的页面，SEO 并不重要，而且页面不需要预先渲染。数据是经常更新的，这就需要在请求时获取数据。

## 使用 getServerSideProps 在请求时获取数据

下面的例子显示了如何在请求时获取数据并对结果进行预渲染：

```jsx
function Page({ data }) {
  // Render data...
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export default Page
```

## 服务端渲染 （SSR）缓存

你可以在 `getServerSideProps` 中使用缓存标头（`Cache-Control`）来缓存动态的响应。例如，使用 [`stale-while-revalidate`](https://web.dev/stale-while-revalidate/)。

```jsx
// This value is considered fresh for ten seconds (s-maxage=10).
// If a request is repeated within the next 10 seconds, the previously
// cached value will still be fresh. If the request is repeated before 59 seconds,
// the cached value will be stale but still render (stale-while-revalidate=59).
//
// In the background, a revalidation request will be made to populate the cache
// with a fresh value. If you refresh the page, you will see the new value.
export async function getServerSideProps({ req, res }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {},
  }
}
```

了解更多有关[缓存](/docs/going-to-production)的信息

## getServerSideProps 错误页渲染

如果 `getServerSideProps` 里抛出一个错误，它将渲染 `pages/500.js` 文件。查看 [500 Page](/docs/advanced-features/custom-error-page#500-page) 的文档，了解如何创建它的信息。在开发（development）过程中，这个文件将不会被使用，而会显示开发提示层。

## 相关

关于下一步该做什么的更多信息，我们建议阅读以下章节：

- [ **getServerSideProps API 参考**](/docs/api-reference/data-fetching/get-server-side-props)
