# 响应辅助（Helpers）

[服务端响应对象](https://nodejs.org/api/http.html#http_class_http_serverresponse)（通常缩写为 `res`）包含了一组形似 Express.js 的辅助（Helper）方法来提升开发者体验并提升创建新 API 端点的速度。

包含的辅助（Helpers）如下：

- `res.status(code)` - 一个设置状态码（status code）的函数，`code` 必须是一个合规的 [HTTP状态码](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
- `res.json(body)` - 发送一个 JSON 响应，`body` 必须是一个 [可序列化的对象](https://developer.mozilla.org/zh-CN/docs/Glossary/Serialization)
- `res.send(body)` - 发送一个 HTTP 响应。`body` 可以是 `string`、`object` 或者是一个 `Buffer`
- `res.redirect([status,] path)` - 重定向到一个指定的路径或 URL， `status` 必须是一个合规的 [HTTP状态码](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)。如果没有指定，`status` 默认为 `307` 临时重定向
- `res.revalidate(urlPath)` - 使用 `getStaticProps` [按需重新验证一个页面](/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation)， `urlPath` 必须是一个 `string`

## 设置响应状态码

在向客户端发送响应时，你可以设置响应的状态码。

下面的例子将响应的状态码设置为 `200`（`OK`），并返回一个 `message` 属性，其值为 `Hello from Next.js!`，作为一个 JSON 响应：

```js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```

## 发送 JSON 响应

当向客户端发送响应时，你可以发送一个 JSON 响应，这必须是一个[可序列化的对象](https://developer.mozilla.org/zh-CN/docs/Glossary/Serialization)。在现实世界的应用中，你可能想让客户端知道请求的状态，这取决于所请求的端点的结果。

下面的例子发送了一个 JSON 响应，状态代码为 `200`（`OK`），包含一个异步操作的结果。它包含在一个 `try catch` 块中，以处理任何可能发生的错误，适当的状态代码和错误信息被捕获并发回给客户端。

```js
export default async function handler(req, res) {
  try {
    const result = await someAsyncOperation()
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}
```

## 发送 HTTP 响应

发送 HTTP 响应的方式与发送 JSON 响应相同。唯一不同的是，响应体可以是一个  `string`、`object` 或一个 `Buffer`。

下面的例子发送了一个 HTTP 响应，状态码为 `200`（`OK`），包含一个异步操作的结果：

```js
export default async function handler(req, res) {
  try {
    const result = await someAsyncOperation()
    res.status(200).send({ result })
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
```

## 重定向到指定的路径或 URL

以一个表单为例，你可能想在客户端提交表单后将其重定向到一个指定的路径或 URL。

下面的例子是在表单成功提交后将客户端重定向到 `/`：

```js
export default async function handler(req, res) {
  const { name, message } = req.body
  try {
    await handleFormInputAsync({ name, message })
    res.redirect(307, '/')
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
```

## 添加 TypeScript 类型

你可以通过从 `next` 中导入 `NextApiRequest` 和 `NextApiResponse` 类型，使你的响应处理程序类型安全，除了这些，你还可以对你的响应数据进行类型化：

```ts
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```

获取更多类型的用例，查看 [TypeScript 文档](/docs/basic-features/typescript#api-routes)。

如果你喜欢在一个真实的项目结构中查看例子，你可以查看我们的示例：

- [Basic API Routes](https://github.com/vercel/next.js/tree/canary/examples/api-routes)
- [API Routes with REST](https://github.com/vercel/next.js/tree/canary/examples/api-routes-rest)
