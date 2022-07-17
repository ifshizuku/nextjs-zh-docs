# 边缘 API 路由（Beta）

边缘 API 路由使你能够使用 Next.js 构建高性能的 API，通过使用[边缘运行时](/docs/api-reference/edge-runtime)，它们通常比基于 Node.js 的 API 路由更快。这种性能的提高确实伴随着[限制](/docs/api-reference/edge-runtime#unsupported-apis)，比如不能访问本地 Node.js APIs，毕竟边缘 API 路由是建立在标准的 Web APIs 之上。

`pages/api` 文件夹内的任何文件都会被映射到 `/api/*`，并将被视为一个 API 端点，而不是一个页面。它们只是服务器端的包，不会增加你的客户端包的大小。

## 示例

### 基本

```typescript
export const config = {
  runtime: 'experimental-edge',
}

export default (req) => new Response('Hello world!')
```

### JSON 响应

```typescript
import type { NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req: NextRequest) {
  return new Response(
    JSON.stringify({
      name: 'Jim Halpert',
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  )
}
```

### 缓存控制（Cache-Control）

```typescript
import type { NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req: NextRequest) {
  return new Response(
    JSON.stringify({
      name: 'Jim Halpert',
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, s-maxage=1200, stale-while-revalidate=600',
      },
    }
  )
}
```

### 查询参数

```typescript
import type { NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  return new Response(email)
}
```

### 标头（Headers）转发

```typescript
import { type NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req: NextRequest) {
  const authorization = req.cookies.get('authorization')
  return fetch('https://backend-api.com/api/protected', {
    method: req.method,
    headers: {
      authorization,
    },
    redirect: 'manual',
  })
}
```

## 与 API 路由的不同点

边缘 API 路由使用[边缘运行时](/docs/api-reference/edge-runtime)，而 API 路由使用 [Node.js 运行时](/docs/advanced-features/react-18/switchable-runtime)。

边缘 API 路由可以从服务器进行[流响应（stream responses ）](/docs/api-reference/edge-runtime#web-stream-apis)，并在缓存文件（如 HTML、CSS、JavaScript）被访问后运行。 服务端流（streaming）可以通过更快的[第一字节时间（TTFB）](https://web.dev/ttfb/)帮助提高性能。

查看边缘运行时 [支持的 APIs](/docs/api-reference/edge-runtime) 和 [不支持的 APIs](/docs/api-reference/edge-runtime#unsupported-apis)。
