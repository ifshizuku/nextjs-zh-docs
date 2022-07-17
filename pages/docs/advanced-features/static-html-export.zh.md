---
description: 将 Next.js 应用导出为静态 HTML，并独立运行，无需 Node.js 服务器。
---

# 静态 HTML 导出

<details>
  <summary><b>示例</b></summary>
  <ul>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-static-export">Static Export</a></li>
  </ul>
</details>

`next export` 允许您将 Next.js 应用程序导出为静态 HTML，该 HTML 可以独立运行，无需 Node.js 服务器。建议仅在不需要 [不受支持的功能](#unsupported-features) 时才使用 `next export`。

如果您希望构建一个混合站点，其中只有一些页面预渲染为静态HTML，那么 Next.js 已经自动做到了。了解有关 [自动静态优化](/docs/advanced-features/automatic-static-optimization) 和 [增量静态再生](/docs/basic-features/data-fetching/incremental-static-regeneration) 的更多信息。

## `next export`

在 `package.json` 中修改 build 脚本：

```json
"scripts": {
  "build": "next build && next export"
}
```

运行 `npm run build` 将生成一个 `out` 目录。

`next export` 会构建应用的 HTML 版本。在 `next build` 期间，[`getStaticProps`](/docs/basic-features/data-fetching/get-static-props) 和 [`getStaticPaths`](/docs/basic-features/data-fetching/get-static-paths) 将为 `pages` 目录中的每个页面生成一个HTML文件（对于 [动态路由](/docs/routing/dynamic-routes) 生成更多）。然后，`next export` 会将已导出的文件复制到正确的目录中。`getInitialProps` 将在 `next export` 期间生成HTML文件，而不是 `next build`。

对于更高级的方案，您可以在 [`next.config.js`](/docs/api-reference/next-config-js/introduction) 文件中定义一个名为 [`exportPathMap`](/docs/api-reference/next-config-js/exportPathMap) 的参数，以准确配置将生成哪些页面。

## 支持的功能

支持构建静态站点所需的大多数核心 Next.js 功能，包括：

- [ 使用 `getStaticPaths` 时的动态路由](/docs/routing/dynamic-routes)
- 使用 `next/link` 预取
- 预加载 JavaScript
- [动态导入](/docs/advanced-features/dynamic-import)
- 任何样式选项 (例如： CSS Modules, styled-jsx)
- [客户端数据提取](/docs/basic-features/data-fetching/client-side)
- [`getStaticProps`](/docs/basic-features/data-fetching/get-static-props)
- [`getStaticPaths`](/docs/basic-features/data-fetching/get-static-paths)
- 使用 [自定义 loader](/docs/basic-features/image-optimization#loader) 来 [优化图像](/docs/basic-features/image-optimization)

## 不支持的功能

不支持需要 Node.js 服务器或在生成过程中无法计算的动态逻辑的功能：

- [图像优化](/docs/basic-features/image-optimization) (默认 loader)
- [国际化路由](/docs/advanced-features/i18n-routing)
- [API 路由](/docs/api-routes/introduction)
- [覆写](/docs/api-reference/next-config-js/rewrites)
- [重定向](/docs/api-reference/next-config-js/redirects)
- [Headers](/docs/api-reference/next-config-js/headers)
- [中间件](/docs/middleware)
- [增量静态再生](/docs/basic-features/data-fetching/incremental-static-regeneration)
- [`fallback: true`](/docs/api-reference/data-fetching/get-static-paths#fallback-true)
- [`getServerSideProps`](/docs/basic-features/data-fetching/get-server-side-props)

### `getInitialProps`

可以使用 [`getInitialProps`](/docs/api-reference/data-fetching/get-initial-props) 而不是 `getStaticProps`，但它附带了一些注意事项：

- 在任何给定的页面上，`getInitialProps` 不能与 `getStaticProps` 或 `getStaticPaths` 一起使用。如果你有动态路由，而不是使用`getStaticPaths` ，你需要在你的[`next.config.js`](/docs/api-reference/next-config-js/introduction) 文件中配置 [`exportPathMap`](/docs/api-reference/next-config-js/exportPathMap) 参数，让导出者知道它应该输出哪些HTML文件。

- 当在导出过程中调用 `getInitialProps` 时，其 [`context`](/docs/api-reference/data-fetching/get-initial-props#context-object) 参数的 `req` 和 `res` 字段将是空对象，因为在导出过程中没有服务器在运行。

- `getInitialProps` **will be called on every client-side navigation**, if you'd like to only fetch data at build-time, switch to `getStaticProps`.

- `getInitialProps` **将在每次客户端导航**上调用，如果您只想在构建时获取数据，请切换到 `getStaticProps`。

- `getInitialProps` 应该从API获取，不能使用 Node.js 特定的库或文件系统， `getStaticProps`可以。

我们建议尽可能迁移到 `getStaticProps`，而不是 `getInitialProps`。