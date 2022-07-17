# API 路由

<details open>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/api-routes">Basic API Routes</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware">API Routes with middleware</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/api-routes-graphql">API Routes with GraphQL</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/api-routes-rest">API Routes with REST</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/api-routes-cors">API Routes with CORS</a></li>
  </ul>
</details>

API 路由提供了使用 Next.js 构建 **API** 的解决方案。

`pages/api` 文件夹内的任何文件都将被映射到 `/api/*`，并将被视为一个 API 端点，而不是 `页面（page）`。它们只是服务端的包，不会增加你的客户端包的大小。

例如，下面的 API 路由 `pages/api/user.js` 返回一个 `json` 响应，状态码为`200`：

```js
export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
```

> **注意**：API Routes 将会受到 `next.config.js` 中 [`pageExtensions` 配置](/docs/api-reference/next-config-js/custom-page-extensions) 的影响。

为了使 API 路由工作，你需要将一个函数作为默认导出（又称**请求处理程序**），然后接收以下参数：

- `req`：一个 [http.IncomingMessage](https://nodejs.org/api/http.html#class-httpincomingmessage) 实例，以及一些 [预构建的中间件](/docs/api-routes/api-middlewares)
- `res`：一个 [http.ServerResponse](https://nodejs.org/api/http.html#class-httpserverresponse) 实例，以及一些 [帮助（helper）函数](/docs/api-routes/response-helpers)

要在一个 API 路由中处理不同的 HTTP 方法，你可以在你的请求处理程序中使用 `req.method`，例如：

```js
export default function handler(req, res) {
  if (req.method === 'POST') {
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}
```

要获取 API 端点，请查看本节开头任何一个例子。

## 使用情况

对于新项目，你可以用 API 路由构建你的整个 API。如果你有一个现有的 API，你不需要通过 API 路由转发对 API 的调用。API 路由的一些其他使用情况是：

- 掩盖外部服务的 URL（例如，`/api/secret` 而不是 `https://company.com/secret-url`）
- 在服务器上使用[环境变量](/docs/basic-features/environment-variables)安全地访问外部服务

## 注意事项

- API路由[不指定 CORS 标头](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)，意味着它们默认是**仅同源**的。你可以通过使用 [CORS 中间件](/docs/api-routes/api-middlewares#connectexpress-middleware-support) 包装请求处理程序来自定义这个行为。
- API 路由不能在 [`next export`](/docs/advanced-features/static-html-export) 中使用。

## 相关

关于下一步该做什么的更多信息，我们推荐以下章节：

- [**API 中间件** / 了解适用于请求的内建中间件](/docs/api-routes/api-middlewares)
- [**响应辅助（Helpers）** / 了解内建的响应方式](/docs/api-routes/response-helpers)
- [**TypeScript** / 在 API 路由中使用 TypeScript](/docs/basic-features/typescript#api-routes)
