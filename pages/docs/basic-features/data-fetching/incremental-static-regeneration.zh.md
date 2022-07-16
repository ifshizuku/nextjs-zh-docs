# 增量静态再生（ISR）

<details>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://nextjs.org/commerce">Next.js Commerce</a></li>
<li><a href="https://reactions-demo.vercel.app/">GitHub Reactions Demo</a></li>
<li><a href="https://static-tweet.vercel.app/">Static Tweet Demo</a></li>
  </ul>
</details>

<details>
  <summary><b>版本记录</b></summary>

| 版本        | 更改                                                                       |
| --------- | ------------------------------------------------------------------------ |
| `v12.2.0` | 按需 ISR 稳定版                                                               |
| `v12.1.0` | 按需 ISR 添加（Beta）                                                          |
| `v12.0.0` | [机器友好 ISR 回退](https://nextjs.org/blog/next-12#bot-aware-isr-fallback) 添加 |
| `v9.5.0`  | 根路径添加                                                                    |

</details>

Next.js允许你在建立网站*之后*创建或更新静态页面。增量静态再生（ISR）使你可以在每个页面的基础上使用静态生成，**不需要重建整个网站**。有了ISR，你可以保留静态的好处，同时扩展到数以百万计的页面。

使用 ISR，将 `revalidate` 属性添加到 `getStaticProps`：

```jsx
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  return {
    props: {
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  }
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
}

export default Blog
```

当对一个在构建时已预渲染的页面提出请求时，它最初将显示缓存的页面。

- 在最初的请求之后和 10 秒之前，任何对该页面的请求都是缓存且即时的
- 在 10 秒之后，下一次请求仍然会显示缓存的（陈旧的）页面
- Next.js 会在后台触发页面的再生（regeneration）
- 一旦页面再生成功，Next.js 将使缓存失效并显示更新的页面；如果后台再生失败，旧的页面不会被改变

当对一个尚未生成的路径提出请求时，Next.js 将在第一次请求中对页面进行服务端渲染，之后的请求将从缓存中提供静态文件。Vercel 上的 ISR [ 全局地保存缓存并处理回滚 ](https://vercel.com/docs/concepts/next.js/incremental-static-regeneration) 。

> 注意：检查你的上游数据提供者是否默认启用了缓存。你可能需要禁用它（例如`useCdn: false`），否则重新验证（revalidate）将无法拉取最新数据来更新 ISR 的缓存。当 CDN 返回 `Cache-Control` 标头时，CDN（对于被请求的端点而言）会进行缓存。

## 按需重新验证

如果你设置的 `revalidate` 时间是 `60`，那么所有的访问者都会在一分钟内看到你网站生成的同一版本。使缓存失效的唯一方法是在一分钟后有人访问该页面。

从 `v12.2.0` 开始，Next.js 支持按需增量静态再生（On-Demand ISR），可以手动清除特定页面的 Next.js 缓存。这使你的网站更容易更新，当：

- 你的无头 CMS（Headless CMS）的内容被创建或更新
- 电子商务元数据的变化（价格、描述、类别、评论等）

在 `getStaticProps` 中，你不需要指定 `revalidate` 来使用按需重新验证。如果省略 `revalidate`，Next.js 将使用默认值 `false`（无重新验证），只有在 `revalidate()` 被调用时才按需重新验证页面。

> **注意** [中间件](/docs/advanced-features/middleware)不会为按需 ISR 请求执行。相反，在你想要重新验证的*确切*路径上调用 `revalidate()`。例如，如果你有 `pages/blog/[slug].js`，并且将 `/post-1` 重写（rewrite）到 `/blog/post-1`，你将需要调用的是 `res.revalidate('/blog/post-1')`。

### 使用按需重新验证

首先，创建一个只有你的 Next.js 应用程序知道的密钥令牌。这个密钥将被用来防止未经授权的重新验证的 API 路由访问。你可以通过以下 URL 结构访问该路由（手动或使用 Webhook）：

```bash
https://<your-site.com>/api/revalidate?secret=<token>
```

接着，将你的密钥作为[环境变量](/docs/basic-features/environment-variables)添加到你的应用程序。最后，创建一个重新验证（revalidate）API 路由：

```jsx
// pages/api/revalidate.js

export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    // this should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    await res.revalidate('/path-to-revalidate')
    return res.json({ revalidated: true })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}
```

[查看我们的演示](https://on-demand-isr.vercel.app)以了解按需重新验证的行为与反馈提供。

### 在开发过程中测试按需 ISR

当使用 `next dev` 在本地运行时，`getStaticProps` 会在每次请求时被调用。 为了验证你的按需 ISR 配置是否正确，你将需要创建一个[生产环境构建](/docs/api-reference/cli#build)并启动[生产环境服务器](/docs/api-reference/cli#production)：

```bash
$ next build
$ next start
```

然后，你就可以确认静态页面是否成功地重新验证了。

## 错误处理和重新验证

如果在处理后台再生（regeneration）时，`getStaticProps` 内部出现错误，或者你手动抛出一个错误，**最后一次成功生成的页面**将继续显示。在接下来的请求中，Next.js 将再次调用 `getStaticProps` 以重试：

```jsx
export async function getStaticProps() {
  // If this request throws an uncaught error, Next.js will
  // not invalidate the currently shown page and
  // retry getStaticProps on the next request.
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  if (!res.ok) {
    // If there is a server error, you might want to
    // throw an error instead of returning so that the cache is not updated
    // until the next successful request.
    throw new Error(`Failed to fetch posts, received status ${res.status}`)
  }

  // If the request was successful, return the posts
  // and revalidate every 10 seconds.
  return {
    props: {
      posts,
    },
    revalidate: 10,
  }
}
```

## 自托管 ISR

当你使用 `next start` 时，增量静态再生（ISR）可以在[自托管的 Next.js 网站](/docs/deployment#self-hosting)上开箱即用。

你可以在部署到容器编排工具（如 [Kubernetes](https://kubernetes.io/) 或 [HashiCorp Nomad](https://www.nomadproject.io/) ）时使用这种方法。默认情况下，生成的资源将被存储在每个 `pod` 的内存中。这意味着每个 `pod` 将有自己的静态文件副本。旧的数据可能会被显示出来，直到该特定的 `pod` 收到一个请求。

为了确保所有 `pod` 之间的一致性，你可以禁用内存缓存。这将通知 Next.js 服务器只利用文件系统中由 ISR 生成的资源。

你可以在你的 Kubernetes pods（或类似的设置）中使用共享网络挂载，在不同的容器之间重复使用相同的文件系统缓存。通过共享相同的挂载，包含 `next/image` 缓存的 `.next` 文件夹也将被共享和重复使用。

要禁用内存缓存，请在你的 `next.config.js` 文件中将 `isrMemoryCacheSize` 设置为 `0`：

```js
module.exports = {
  experimental: {
    // Defaults to 50MB
    isrMemoryCacheSize: 0,
  },
}
```

> **注意** ：你可能需要考虑多个 `pod` 试图同时更新缓存的条件，这取决于你的共享挂载是如何配置的。

## 相关

关于下一步该做什么的更多信息，我们推荐以下章节：

- [**动态路由** / 了解更多有关如何在 Next.js 中使用 `getStaticPaths` 配合动态路由](/docs/basic-features/data-fetching/get-static-paths)
