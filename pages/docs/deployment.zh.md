# 部署

恭喜你，你已经准备好将你的 Next.js 应用程序部署到生产环境中。本文将介绍如何使用 [Next.js 构建 API](#nextjs-build-api) 进行服务商托管或自托管的部署。

## Next.js 构建 API

`next build` 为你的应用程序生成一个优化的生产版本。这个标准输出包括：

- 使用 `getStaticProps` 或[自动静态优化](/docs/advanced-features/automatic-static-optimization)的页面的 HTML 文件
- 用于全局样式或单独范围样式的 CSS 文件
- 用于在 Next.js 服务端预渲染动态内容的 JavaScript
- 用于通过 React 在客户端进行交互的 JavaScript

输出的文件将在 `.next` 文件夹中：

- `.next/static/chunks/pages` - 这个文件夹中的每个 JavaScript 文件都与同名的路由有关。例如，`.next/static/chunks/pages/about.js` 是在你的应用程序中访问 `/about` 路由时加载的 JavaScript 文件。
- `.next/static/media` - 使用 `next/image` 静态导入的图片被散列并复制到这里。
- `.next/static/css` - 你的应用程序适用于所有页面的全局 CSS 文件
- `.next/server/pages` - 服务器预渲染的 HTML 和 JavaScript 入点。`.nft.json` 文件是在启用[输出文件追踪](/docs/advanced-features/output-file-tracing)时创建的，它包含所有依赖于特定页面的文件路径。
- `.next/server/chunks` - 在整个应用程序中多处使用的共享 JavaScript  块（chunks）
- `.next/cache` - 来自 Next.js 服务器的构建缓存以及缓存的图像、响应和页面的输出。使用缓存有助于减少构建时间，提高加载图像的性能。

`.next` 内的所有 JavaScript 代码已被**编译（compiled）**，浏览器捆绑（bundles）已被**最小化（minified）**，以实现最佳的性能并支持[所有现代浏览器](/docs/basic-features/supported-browsers-features)。

## 使用 Vercel 托管 Next.js 程序 

[Vercel](https://vercel.com?utm_source=github.com&utm_medium=referral&utm_campaign=deployment) 是你部署 Next.js 程序最快的途径，并且不需要任何额外配置。

当部署到 Vercel 时，平台[自动检测到 Next.js](https://vercel.com/solutions/nextjs?utm_source=github.com&utm_medium=referral&utm_campaign=deployment)，运行 `next build`，并为你优化构建输出，包括：

- 如果没有发生改变，在每一次部署时保留缓存资源
- 对于每一个提交都有一个[不可改变](https://vercel.com/features/previews)的具有唯一 URL 的部署（记录）
- 只要可能，[页面](/docs/basic-features/pages)将会自动静态优化
- 已压缩的资源（JavaScript、CSS、图片和字体）从[全球边缘网络](https://vercel.com/features/infrastructure)提供服务
- [API 路由](/docs/api-routes/introduction)将被优化成可无限扩展的[无服务器函数（Serverless Functions）](https://vercel.com/features/infrastructure) 功能
- [中间件](/docs/middleware)将作为具有零冷启动时间并可以即时启动的[边缘函数（Edge Functions）](https://vercel.com/features/edge-functions)被优化

此外，Vercel 还提供了如下功能：

- 通过 [Next.js Analytics](https://vercel.com/analytics) 进行自动性能分析
- 自动 HTTPS 与 SSL 证书生成与维护
- 自动 CI/CD（适用于 GitHub、GitLab、Bitbucket 等）
- [环境变量](https://vercel.com/docs/environment-variables)支持
- [自定义域名](https://vercel.com/docs/custom-domains)支持
- 借助 `next/image` 以支持[图像优化](/docs/basic-features/image-optimization)
- 通过 `git push` 进行即时全球部署

免费[在 Vercel 上部署 Next.js 程序](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/hello-world&project-name=hello-world&repository-name=hello-world&utm_source=github.com&utm_medium=referral&utm_campaign=deployment)

## 自托管

你可以使用 Node.js 或 Docker 对 Next.js 进行自我托管并支持所有功能。你也可以使用静态 HTML 导出，虽然[有一些限制](/docs/advanced-features/static-html-export)。

### Node.js 服务器

Next.js 可以被部署到任何支持 Node.js 的服务商，例如，[AWS EC2](https://aws.amazon.com/ec2/) 或 [DigitalOcean Droplet](https://www.digitalocean.com/products/droplets/) （国内如 [阿里云 ECS](https://www.alibabacloud.com/zh/product/ecs) 和 [腾讯云 CVM](https://cloud.tencent.com/product/cvm)）等。

首先，确保你的 `package.json` 含有 `"build"` 和 `"start"` 脚本：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

然后，运行 `next build` 来构建你的应用程序。最后，运行 `next start` 来启动 Node.js 服务器。这个服务器支持 Next.js 的所有功能。

> 如果你正在使用 [`next/image`](/docs/basic-features/image-optimization)，考虑在你的生产环境中添加 `sharp`，通过在你的项目目录中运行 `npm install sharp` 来获得更高性能的[图像优化](/docs/basic-features/image-optimization)。在 Linux 平台上，`sharp` 可能需要[额外的配置](https://sharp.pixelplumbing.com/install#linux-memory-allocator)以防止过多的内存使用。

### Docker 镜像

Next.js 可以被部署到任何支持 [Docker](https://www.docker.com/) 容器的主机提供商。在部署到 [Kubernetes](https://kubernetes.io/) 或 [HashiCorp Nomad](https://www.nomadproject.io/) 等容器编排器时，或者在任何云提供商的单个节点内运行时，都可以使用这种方法。

1. 在你的机器上[安装 Docker](https://docs.docker.com/get-docker/)
2. 克隆 [with-docker](https://github.com/vercel/next.js/tree/canary/examples/with-docker) 示例
3. 构建你的容器：`docker build -t nextjs-docker .`
4. 运行你的容器：`docker run -p 3000:3000 nextjs-docker`

如果你需要在多个环境中使用不同的环境变量，请查看我们的 [with-docker-multi-env](https://github.com/vercel/next.js/tree/canary/examples/with-docker-multi-env) 示例。

### 静态 HTML 导出

如果你想对你的 Next.js 应用程序进行静态 HTML 导出，请按照我们的[静态 HTML 导出文档](/docs/advanced-features/static-html-export)上的指示进行。

## 其他服务

以下服务支持 Next.js `v12+`。并且，你会得到将 Next.js 部署到以下服务的例子或指南。

### 托管服务器

- [AWS Copilot](https://aws.github.io/copilot-cli/)
- [Digital Ocean App Platform](https://docs.digitalocean.com/tutorials/app-nextjs-deploy/)
- [Google Cloud Run](https://github.com/vercel/next.js/tree/canary/examples/with-docker)
- [Heroku](https://elements.heroku.com/buildpacks/mars/heroku-nextjs)
- [Railway](https://railway.app/new/starters/nextjs-prisma)
- [Render](https://render.com/docs/deploy-nextjs-app)

> **注意** ：也有一些管理平台允许你使用 Dockerfile，如[上面的例子](/docs/deployment#docker-image)所示。

### 纯静态

以下服务支持使用 [`next export`](/docs/advanced-features/static-html-export) 部署 Next.js。

- [Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/deploy-nextjs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/)
- [Firebase](https://github.com/vercel/next.js/tree/canary/examples/with-firebase-hosting)
- [GitHub Pages](https://github.com/vercel/next.js/tree/canary/examples/github-pages)

你也可以手动将 [`next export`]() 输出部署到任何静态托管提供商，一般情况下你可以通过你的 CI/CD 实现，如 GitHub Actions、Jenkins、AWS CodeBuild、Circle CI、Azure Pipelines 等。

### 无服务器（Serverless）

- [AWS Serverless](https://github.com/serverless-nextjs/serverless-next.js)
- [Terraform](https://github.com/milliHQ/terraform-aws-next-js)
- [Netlify](https://docs.netlify.com/integrations/frameworks/next-js)

> **注意** ：并非所有的无服务器提供商都从 `next start` 实现了 [Next.js 构建 API]()，请向提供商询问有哪些功能被支持。

## 自动更新

当你部署 Next.js 应用程序时，你想不重新加载看到最新的版本。

Next.js 会在路由时在后台自动加载你的应用程序的最新版本。对于客户端导航来说，`next/link` 将暂时作为一个正常的 `<a>` 标签来使用。

**注意** ：如果一个新的页面（有一个旧的版本）被 `next/link` 预获取，Next.js 将使用旧版本。导航到一个没有被预获取的页面（也没有在 CDN 层面上被缓存）将加载最新的版本。

## 优雅地手动关机

有时你可能想对进程信号（signal）运行一些清理（cleanup）代码，如 `SIGTERM` 或 `SIGINT`。

你可以通过设置环境变量 `NEXT_MANUAL_SIG_HANDLE` 为 `true`，然后在你的 `_document.js` 文件中为该信号注册一个处理器（handler）。

```js
// pages/_document.js

if (process.env.NEXT_MANUAL_SIG_HANDLE) {
  // this should be added in your custom _document
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM: ', 'cleaning up')
    process.exit(0)
  })

  process.on('SIGINT', () => {
    console.log('Received SIGINT: ', 'cleaning up')
    process.exit(0)
  })
}
```

## 相关

关于下一步该做什么的更多信息，我们推荐以下章节：

- [**面向生产环境** / 确保最佳的性能和用户体验](/docs/going-to-production)
