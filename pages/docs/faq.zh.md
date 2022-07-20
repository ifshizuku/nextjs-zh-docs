# 常见问题

<details>
  <summary>Next.js 可以用于生产环境吗？</summary>
  <p>当然可以！ Next.js 被世界上许多顶级网站使用. 查看
  <a href="https://nextjs.org/showcase">Showcase</a> 获得更多信息。</p>
</details>

<details>
  <summary>如何在 Next.js 中获取数据？</summary>
  Next.js 根据您的使用方案提供了多种方法。你可以使用：
  <ul>
    <li>客户端渲染：在 React 组件内使用 <a href="/docs/basic-features/data-fetching/client-side#client-side-data-fetching-with-useeffect">useEffect</a> 或 <a href="/docs/basic-features/data-fetching/client-side#client-side-data-fetching-with-swr">SWR</a> 获取数据 </li>
    <li>使用 <a href="/docs/basic-features/data-fetching/get-server-side-props">getServerSideProps</a> 进行服务端渲染</li>
    <li>使用 <a href="/docs/basic-features/data-fetching/get-static-props">getStaticProps</a> 生成静态站点</li>
    <li>通过将 <a href="/docs/basic-features/data-fetching/incremental-static-regeneration">`revalidate`</a> 属性添加到 getStaticProps 来增量静态再生</li>
  </ul>
  要了解有关数据获取的更多信息，请访问我们的 <a href="/docs/basic-features/data-fetching/overview">数据获取文档</a>。
</details>

<details>
  <summary>为什么 Next.js 有自己的路由器？</summary>
  Next.js 包含内置路由器，原因如下：
  <ul>
    <li>它使用基于文件系统的路由器，从而减少了配置</li>
    <li>它支持浅层路由，允许您在不运行数据获取方法的情况下更改URL</li>
    <li>路由始终是可延迟加载的</li>
  </ul>
    如果您要从 React Router 迁移, 查看 <a href="/docs/migrating/from-react-router">迁移文档</a>。
</details>

<details>
  <summary>我可以将 Next.js 与我最喜欢的 JavaScript 库一起使用吗？</summary>
  <p>当然可以！在 <a href="https://github.com/vercel/next.js/tree/canary/examples">examples</a> 目录有很多示例。</p>
</details>

<details>
  <summary>我可以将 Next.js 与 GraphQL 一起使用吗？</summary>
  <p>当然可以！这里有 <a href="https://github.com/vercel/next.js/tree/canary/examples/with-apollo">Apollo</a> 和 <a href="https://github.com/vercel/next.js/tree/canary/examples/api-routes-graphql">GraphQL</a> 示例。</p>
</details>

<details>
  <summary>我可以将 Next.js 与 Redux 一起使用吗？</summary>
  <p>当然可以！这里有 <a href="https://github.com/vercel/next.js/tree/canary/examples/with-redux">Redux</a> 和 <a href="https://github.com/vercel/next.js/tree/canary/examples/with-redux-thunk">thunk</a> 示例。</p>
</details>

<details>
  <summary>我可以制作一个 Next.js 渐进式Web应用程序（PWA）吗?</summary>
   <p>当然可以! 这里有 <a href="https://github.com/vercel/next.js/tree/canary/examples/progressive-web-app">PWA</a> 示例。</p>
</details>

<details>
  <summary>我可以将静态资源部署到 CDN 吗？</summary>
  <p>当然可以！当你部署 Next.js 应用到 Vercel，将自动检测你的静态资源并由 Edge Network 提供服务。如果你自己托管 Next.js，你可以在<a href="/docs/api-reference/next-config-js/cdn-support-with-asset-prefix">这里</a>学习如何手动配置资源前缀。</p>
</details>

<details>
  <summary>如何更改内部 webpack 配置？</summary>
  <p>在大多数情况下，不需要手动配置 webpack，因为 Next.js 会自动配置 webpack。对于需要更多控制的高级情况，请查看 <a href="/docs/api-reference/next-config-js/custom-webpack-config">自定义 webpack</a> 文档。</p>
</details>

<details>
  <summary>Next.js 的灵感来源什么?</summary>

  <p>我们设定要实现的许多目标都是 Guillermo Rauch 在 <a href="https://rauchg.com/2014/7-principles-of-rich-web-applications">“7 Principles of Rich Web Applications”</a> 中列出的目标。</p>

  <p>PHP 的易用性是一个很大的灵感。我们认为 Next.js 是许多场景的合适替代品，否则您将使用 PHP 输出 HTML。</p>

  <p>与 PHP 不同的是，我们受益于 ES6 模块系统，每个页面导出一个组件或函数，可以轻松导入以进行延迟评估或测试。</p>

  <p>当我们在研究服务器端渲染 React 并且不涉及大量繁琐步骤的技术时，我们遇到了 <a href="https://github.com/facebookarchive/react-page">react-page</a>（由 Jordan Walke（React 的创建者）创建的一个类似 Next.js 的项目，现已弃用）。</p>
  
</details>
