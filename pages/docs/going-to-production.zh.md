# 面向生产环境

在将你的 Next.js 应用程序投入生产环境之前，这里有一些建议，确保最佳的用户体验。

## 一般情况下

- 尽可能使用[缓存](#caching)
- 尽可能将你的数据库和后端部署在同源（或同一地区）
- 尽可能少地发送 JavaScript
- 推迟加载繁杂的 JavaScript 包，直到需要时再加载
- 确保[日志记录](#logging)正确设置
- 确保[错误处理](#error-handling)正确设置
- 配置 [404](/docs/advanced-features/custom-error-page#404-page)（Not Found）和 [500](/docs/advanced-features/custom-error-page#500-page)（Error）页面
- 确保你进行[性能测试](/docs/advanced-features/measuring-performance)
- 运行 [Lighthouse](https://developers.google.com/web/tools/lighthouse) 以检查性能、最佳实践、可访问性和 SEO。为了获得最佳效果，请使用 Next.js 的生产版本，并在浏览器中使用隐身模式（In Private），这样结果就不会受到扩展程序的影响
- 回顾[受支持的浏览器和功能](/docs/basic-features/supported-browsers-features)
- 通过以下方式提高性能：
  - [`next/image` 组件与自动图像优化](/docs/basic-features/image-optimization)
  - [自动字体优化](/docs/basic-features/font-optimization)
  - [脚本（Script）优化](/docs/basic-features/script)
- 改善[加载性能](#loading-performance)

## 缓存

<details open>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/ssr-caching">ssr-caching</a></li>
  </ul>
</details>

缓存改善了响应时间，减少了对外部服务的请求数。Next.js 会自动为 `/_next/static` 提供的固定资源添加缓存标头，包括 JavaScript、CSS、静态图片和其他媒体。

```
Cache-Control: public, max-age=31536000, immutable
```

在 `next.config.js` 中设置的 `Cache-Control` 标头信息将在生产构建中被覆盖，以确保静态资产能够被有效地缓存。如果你需要重新验证一个已经[静态生成](/docs/basic-features/pages#static-generation-recommended)的页面的缓存，你可以通过在页面的 [`getStaticProps`](/docs/basic-features/data-fetching/get-static-props) 函数中设置 `revalidate` 来实现。如果你使用 `next/image`，也有默认的图像优化加载器的[特定缓存规则](/docs/basic-features/image-optimization#caching)。

**注意** ：当用 `next dev` 在本地运行你的应用程序时，你的标头会被覆盖以防止本地缓存。

```
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
```

你也可以在 `getServerSideProps` 和 API 路由中使用缓存头以获得动态响应，例如，使用 [`stale-while-revalidate`](https://web.dev/stale-while-revalidate/)。

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

默认情况下，`Cache-Control` 标头的设置将根据你的页面获取数据的方式而有所不同。

- 如果页面使用 `getServerSideProps` 或 `getInitialProps`，它将使用 `next start` 设置的默认 `Cache-Control` 标头，以防止意外缓存了不该缓存的响应。如果你想在使用 `getServerSideProps` 时有不同的缓存行为，请在函数内部使用 `res.setHeader('Cache-Control', 'value_you_prefer')`，如上所示。
- 如果页面使用 `getStaticProps`，它将有一个 `Cache-Control` 为 `s-maxage=REVALIDATE_SECONDS, stale-while-revalidate` 的标头，如果*不*使用 `revalidate`，`s-maxage=31536000, stale-while-revalidate` 将被用来尽可能地缓存。

> **注意** ：你的部署供应商必须支持动态响应的缓存。如果你是自托管，你将需要自己使用像 Redis 这样的键/值存储来添加这个逻辑。 如果你使用 Vercel，[边缘缓存将免配置运行](https://vercel.com/docs/edge-network/caching)。

## 减少 JavaScript 大小

<details open>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-dynamic-import">with-dynamic-import</a></li>
  </ul>
</details>

为了减少发送到浏览器的 JavaScript 量，你可以使用以下工具来了解每个 JavaScript 包内包含的内容：

- [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost) – 在 VSCode 内显示导入包的大小
- [Package Phobia](https://packagephobia.com/) – 分析在你的项目中添加一个新的开发依赖的成本
- [Bundle Phobia](https://bundlephobia.com/) - 分析一个依赖可以增加多少捆绑（bundle）的大小
- [Webpack Bundle Analyzer](https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer) – 通过一个交互式的、可缩放的树状图来可视化 webpack 输出文件的大小

在你的 `pages/` 目录下的每个文件都会在 `next build` 时自动被代码分割成自己的 JavaScript 捆绑包。你也可以使用[动态导入](/docs/advanced-features/dynamic-import)来懒加载组件和库。例如，你可能想推迟加载你的模态（modal）代码，直到用户点击打开按钮。

## 日志记录

<details open>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/Logflare/next-pino-logflare-logging-example">with-logging</a></li>
  </ul>
</details>

由于 Next.js 同时支持在客户端和服务端上运行，因此支持多种形式的日志记录：

- 浏览器上的 `console.log`
- 服务器上的 `stdout`

如果你想要一个结构化的日志包，我们推荐 [Pino](https://www.npmjs.com/package/pino)。如果你使用 Vercel，有与Next.js 兼容的[预构建日志集成](https://vercel.com/integrations#logging)。

## 错误处理

<details open>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-sentry">with-sentry</a></li>
  </ul>
</details>

当一个未处理的异常发生时，你可以用 [500 错误页](/docs/advanced-features/custom-error-page#500-page) 来告知你的用户。我们建议根据你的品牌定制这个，而不是默认的 Next.js 主题。

你也可以用 Sentry 这样的工具来记录和跟踪异常。[这个例子](https://github.com/vercel/next.js/tree/canary/examples/with-sentry)展示了如何使用 Next.js 的 Sentry SDK，在客户端和服务器端捕捉和报告错误。还有一个 [Vercel 的 Sentry 集成](https://vercel.com/integrations/sentry)。

## 加载性能

为了提高加载性能，你首先需要确定测量什么数据以及如何测量该数据。[Core Web Vitals](https://vercel.com/blog/core-web-vitals) 是一个很好的行业标准，可以用你自己的浏览器来测量。如果你不熟悉 Core Web Vitals 的指标，请查看这篇[博文](https://vercel.com/blog/core-web-vitals)，并确定哪些具体指标将是你的加载性能的首要因素。理想情况下，你希望在以下环境中测量加载性能：

- 在实验，使用你自己的计算机或模拟器
- 在现场，使用来自实际访问者的真实世界数据
- 本地，使用在你的设备上运行的测试
- 远程，使用在云中运行的测试

一旦你能够测量加载性能，使用以下的策略来迭代改进，以便你应用一个策略，测量新的性能并继续调整，直到改进逐渐变小。然后，你就可以转到下一个策略。

- 使用接近你的数据库或 API 部署区域的缓存区域
- 正如[缓存](#caching)部分所描述的，使用一个不会使你的后端过载的 `stale-while-revalidate` 值
- 使用[增量静态再生](/docs/basic-features/data-fetching#incremental-static-regeneration)来减少对你的后端请求的数量
- 删除未使用的 JavaScript。回顾这篇[博文](https://calibreapp.com/blog/bundle-size-optimization)，了解 Core Web Vitals 如何度量包的大小影响，以及你可以使用什么策略来减少它，例如：
  - 设置你的代码编辑器以查看导入成本和大小
  - 寻找其他更小的软件包
  - 动态加载组件和依赖
  - 了解更深入的信息，请查看此[指南](https://papyrus.dev/@PapyrusBlog/how-we-reduced-next.js-page-size-by-3.5x-and-achieved-a-98-lighthouse-score)和此[性能检查表](https://dev.to/endymion1818/nextjs-performance-checklist-5gjb)

## 相关

关于下一步该做什么的更多信息，我们推荐以下章节：

- [**部署** / 将你的 Next.js 应用程序部署到生产环境](/docs/deployment)
