# 环境变量

> 本文档适用于 9.4 及以上版本的 Next.js。如果你使用的是 Next.js 的旧版本，请升级或参考 [next.config.js中的环境变量配置](/docs/api-reference/next-config-js/environment-variables)。

<details open>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/environment-variables">Environment Variables</a></li>
  </ul>
</details>

Next.js 带有内建的环境变量支持，这将允许你：

- [使用 `.env.local` 来加载环境变量](#loading-environment-variables)
- [通过使用 `NEXT_PUBLIC_` 作为前缀向浏览器暴露环境变量 ](#exposing-environment-variables-to-the-browser)

## 加载环境变量

Next.js 支持从 `.env.local` 加载环境变量到 `process.env`。

一个示例 `.env.local` 如下：

```bash
DB_HOST=localhost
DB_USER=myuser
DB_PASS=mypassword
```

这将 `process.env.DB_HOST`、`process.env.DB_USER` 和  `process.env.DB_PASS` 自动加载到 Node.js 环境，并允许你在 [Next.js 数据获取](/docs/basic-features/data-fetching/overview) 和 [API 路由](/docs/api-routes/introduction) 中使用。

例如，使用 [`getStaticProps`](/docs/basic-features/data-fetching/get-static-props)：

```js
// pages/index.js
export async function getStaticProps() {
  const db = await myDB.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  })
  // ...
}
```

> **注意**：为了保持服务器的安全，环境变量在构建时会被分析，所以只有实际使用的环境变量才会被包括在内。这意味着 `process.env` 不是一个标准的 JavaScript 对象，所以你不能使用[对象重构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)。环境变量引用必须为类似 `process.env.PUBLISHABLE_KEY`，而不是 `const { PUBLISHABLE_KEY } = process.env`。

> **注意**：Next.js 会自动扩展你的 `.env*` 文件中的变量（`$VAR`），这允许你引用其他的机密字段，像这样：
> 
> ```bash
> # .env
> HOSTNAME=localhost
> PORT=8080
> HOST=http://$HOSTNAME:$PORT
> ```
> 
> 如果你想使用一个实际值中带有`$`的变量，需要像这样转义，`\$`。
> 
> 例如：
> 
> ```bash
> # .env
> A=abc
> 
> # becomes "preabc"
> WRONG=pre$A
> 
> # becomes "pre$A"
> CORRECT=pre\$A
> ```

> **注意**：如果你使用 `/src` 作为项目文件夹，请注意，Next.js 将**只从父文件夹中**加载 `.env` 文件，而**不是**从 `/src` 文件夹中。

## 将环境变量暴露给浏览器

默认情况下，环境变量只在 Node.js 环境中可用，这意味着它们不会暴露在浏览器中。

为了向浏览器公开一个变量，你必须在变量前加上 `NEXT_PUBLIC_` 前缀。例如：

```bash
NEXT_PUBLIC_ANALYTICS_ID=abcdefghijk
```

这将把 `process.env.NEXT_PUBLIC_ANALYTICS_ID` 自动加载到 Node.js 环境中，允许你在代码中任何地方使用它。由于 `NEXT_PUBLIC_` 的前缀，该值将被内联到发送到浏览器的 JavaScript 中。这种内联发生在构建时，所以你的各种 `NEXT_PUBLIC_` 环境变量需要在项目构建时进行设置。

```js
// pages/index.js
import setupAnalyticsService from '../lib/my-analytics-service'

// 'NEXT_PUBLIC_ANALYTICS_ID' can be used here as it's prefixed by 'NEXT_PUBLIC_'.
// It will be transformed at build time to `setupAnalyticsService('abcdefghijk')`.
setupAnalyticsService(process.env.NEXT_PUBLIC_ANALYTICS_ID)

function HomePage() {
  return <h1>Hello World</h1>
}

export default HomePage
```

请注意，动态查找将*不会*被内联，例如：

```js
// This will NOT be inlined, because it uses a variable
const varName = 'NEXT_PUBLIC_ANALYTICS_ID'
setupAnalyticsService(process.env[varName])

// This will NOT be inlined, because it uses a variable
const env = process.env
setupAnalyticsService(env.NEXT_PUBLIC_ANALYTICS_ID)
```

## 默认环境变量

一般来说，只需要一个 `.env.local` 文件。然而，有时你可能想为 `development`（`next dev`）或 `production`（`next start`）环境添加一些默认值。

Next.js允许你在 `.env`（所有环境）、`.env.development`（开发环境）和 `.env.production`（生产环境）设置默认值。

`.env.local` **总是覆盖**设定的默认值。

> **注意**：`.env`、`.env.development` 和 `.env.production` 文件应该包含在你的版本库中，因为它们定义了默认值。**`.env*.local` 应该被添加到 `.gitignore`**，这个文件应该被忽略。`.env.local` 是可以存储机密的地方。

## Vercel 上的环境变量

在将 Next.js 应用程序部署到 [Vercel](https://vercel.com) 时，可以在[项目设置](https://vercel.com/docs/environment-variables)中配置环境变量。

所有类型的环境变量都应该在这里配置，即使是开发中使用的环境变量 - 事后可以[下载到本地设备](https://vercel.com/docs/environment-variables#development-environment-variables)。

如果你已经配置了[开发环境变量](https://vercel.com/docs/environment-variables#development-environment-variables)，你可以用下面的命令把它们拉到 `.env.local` 中，在你的本地机器上使用：

```bash
vercel env pull .env.local
```

当使用 Vercel CLI 部署时，确保你添加一个 [`.vercelignore`](https://vercel.com/guides/prevent-uploading-sourcepaths-with-vercelignore?query=vercelignore#allowlist)，其中包含不应该被上传的文件，通常这些文件与 `.gitignore` 中包含的文件相同。

## 测试环境（Test ENV）变量

除了 `开发（development）` 和 `生产（production）` 环境外，还有第三个选项可用，`测试（test）`。就像你为开发或生产环境设置默认值一样，你也可以用 `.env.test` 文件为 `test` 环境做同样的事情（尽管这个环境不像前两个环境那样常见）。Next.js不会在 `test` 环境中加载 `.env.development` 或 `.env.production` 的环境变量。

当使用 `jest` 或 `cypress` 等工具运行测试时，这一条很有用，因为你只需要为测试目的设置特定的环境变量。如果 `NODE_ENV` 被设置为 `test`，测试默认值将被加载，尽管你通常不需要手动操作，因为测试工具会帮你解决这个问题。

`test` 环境和 `development` 及 `production` 环境之间有一个小小的区别，你需要记住：`.env.local` **不会被加载**，因为你希望测试对每个人产生相同的结果。这样，每个测试的执行将在不同的执行中使用相同的环境默认值。而忽略你的 `.env.local`（旨在覆盖默认设置）。

> **注意**：与默认环境变量类似，`.env.test` 文件应该包含在你的版本库中，但 `.env.test.local` 不应该，因为 `.env*.local` 是要通过 `.gitignore` 来忽略的。

在运行单元测试时，你可以通过利用 `@next/env` 包中的 `loadEnvConfig` 函数，确保按照 Next.js 的方式加载环境变量。

```js
// The below can be used in a Jest global setup file or similar for your testing set-up
import { loadEnvConfig } from '@next/env'

export default async () => {
  const projectDir = process.cwd()
  loadEnvConfig(projectDir)
}
```

## 环境变量加载顺序

环境变量按顺序在以下地方查找，**一旦找到变量**就会停止：

1. `process.env`
2. `.env.$(NODE_ENV).local`
3. `.env.local` （当 `NODE_ENV` 为 `test` 时忽略）
4. `.env.$(NODE_ENV)`
5. `.env`

例如，如果 `NODE_ENV` 是 `development`，而你在 `.env.development.local` 和 `.env` 中都定义了一个变量，那么将使用 `.env.development.local` 的值。

> **注意** ：`NODE_ENV` 的允许值是 `production`、`development` 和 `test`。
