# API 中间件

<details open>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware">API Routes with middleware</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/api-routes-cors">API Routes with CORS</a></li>
  </ul>
</details>

API路由提供了内置的中间件，用于解析传入的请求（`req`），包含：

- `req.cookies` - 一个包含请求发送的 cookies 的对象。默认为 `{}`
- `req.query` - 一个包含[查询字符串](https://en.wikipedia.org/wiki/Query_string)的对象。默认为 `{}`
- `req.body` - 一个包含由 `content-type` 解析的正文（body）的对象，如果没有发送正文，则为 `null`

## 自定义配置

每个 API 路由都可以导出一个 `config` 对象来改变默认配置，如下所示：

```js
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
```

`api` 对象包括所有可用于 API 路由的配置。

`bodyParser` 被自动启用。如果你想以 `流（Stream）` 的形式或以 [`raw-body'`](https://www.npmjs.com/package/raw-body) 的形式使用主体（body），你可以将其设置为 `false`。

禁用自动 `bodyParsing` 的一个用例是验证 **Webhook** 请求的原始主体，例如 [来自 GitHub](https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks#validating-payloads-from-github)。

```js
export const config = {
  api: {
    bodyParser: false,
  },
}
```

`bodyParser.sizeLimit` 是被解析的主体允许的最大大小，通过 [bytes 库](https://github.com/visionmedia/bytes.js) 支持使用任何格式，如下所示：

```js
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500kb',
    },
  },
}
```

`externalResolver` 是一个很明确的标识，它告诉服务器这个路由是由外部解析器处理的，比如 *express* 或 *connect*。启用这个选项可以禁止对未处理的请求发出警告。

```js
export const config = {
  api: {
    externalResolver: true,
  },
}
```

`responseLimit` 被自动启用，当 API 路由的响应超过 4MB 时发出警告。

如果你不是在无服务器环境中使用 Next.js，并且了解不使用 CDN 或专用媒体主机对性能的影响，你可以将此限制设置为`false`。

```js
export const config = {
  api: {
    responseLimit: false,
  },
}
```

`responseLimit` 也可以取字节数或 `bytes 库` 支持的任何字符串格式，例如 `1000`、`500kb` 或 `3mb`。
这个值将是显示警告的阈值响应大小，默认是 4MB。

```js
export const config = {
  api: {
    responseLimit: '8mb',
  },
}
```

## Connect 或 Express 中间件支持

你可以使用 [Connect](https://github.com/senchalabs/connect) 兼容的中间件。

例如，可以使用 [cors](https://www.npmjs.com/package/cors) 包为你的 API 端点[配置 CORS 策略](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)。

首先，安装 `cors`：

```bash
npm i cors
# or
yarn add cors
```

现在，让我们向 API 路由添加 `cors`： 

```js
import Cors from 'cors'

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors)

  // Rest of the API logic
  res.json({ message: 'Hello Everyone!' })
}

export default handler
```

> 查看 [API Routes with CORS](https://github.com/vercel/next.js/tree/canary/examples/api-routes-cors) 示例以获取完成的应用程序。

## 使用 TypeScript 拓展 `req`/`res` 对象

为了更好地保证类型安全，不建议直接扩展 `req` 和 `res` 对象。相反，使用函数来处理它们：

```ts
// utils/cookies.ts

import { serialize, CookieSerializeOptions } from 'cookie'
import { NextApiResponse } from 'next'

/**
 * This sets `cookie` using the `res` object
 */

export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

  if (typeof options.maxAge === 'number') {
    options.expires = new Date(Date.now() + options.maxAge * 1000)
  }

  res.setHeader('Set-Cookie', serialize(name, stringValue, options))
}

// pages/api/cookies.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from '../../utils/cookies'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // Calling our pure function using the `res` object, it will add the `set-cookie` header
  setCookie(res, 'Next.js', 'api-middleware!')
  // Return the `set-cookie` header so we can display it in the browser and show that it works!
  res.end(res.getHeader('Set-Cookie'))
}

export default handler
```

如果你不能避免这些对象被扩展，你必须创建你自己的类型来包括额外的属性：

```ts
// pages/api/foo.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { withFoo } from 'external-lib-foo'

type NextApiRequestWithFoo = NextApiRequest & {
  foo: (bar: string) => void
}

const handler = (req: NextApiRequestWithFoo, res: NextApiResponse) => {
  req.foo('bar') // we can now use `req.foo` without type errors
  res.end('ok')
}

export default withFoo(handler)
```

这并不安全，因为即使你把 `withFoo()` 从导出中删除，代码仍然会被编译。
