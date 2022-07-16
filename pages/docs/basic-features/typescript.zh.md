# TypeScript

<details>
  <summary><b>版本记录</b></summary>

| Version   | Changes                                                                                     |
| --------- | ------------------------------------------------------------------------------------------- |
| `v12.0.0` | 默认使用 [SWC](https://nextjs.org/docs/advanced-features/compiler) 来编译 TypeScript 和 TSX，以加快构建速度 |
| `v10.2.1` | 增加了 `tsconfig.json` 中启用[增量类型检查](https://www.typescriptlang.org/tsconfig#incremental)的支持     |

</details>

Next.js 提供了一个集成的 [TypeScript](https://www.typescriptlang.org/) 体验，包括开箱即用的配置和页面、API 等的内置类型。

- [克隆并部署一个 TypeScript 开始例程](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-typescript&project-name=with-typescript&repository-name=with-typescript)
- [查看示例应用程序](https://github.com/vercel/next.js/tree/canary/examples/with-typescript)

## `create-next-app` 支持

你可以通过 [`create-next-app`](https://nextjs.org/docs/api-reference/create-next-app) 创建一个 TypeScript 工程，只需要如下添加 `--ts, --typescript` 标识：

```
npx create-next-app@latest --ts
# or
yarn create next-app --typescript
# or
pnpm create next-app --ts
```

## 现存的工程

要在一个现有的项目中开始，在根目录中创建一个空的 `tsconfig.json` 文件：

```bash
touch tsconfig.json
```

Next.js 会自动用默认值配置这个文件，也允许你提供自己的 `tsconfig.json` 及自定义[编译器选项](https://www.typescriptlang.org/docs/handbook/compiler-options.html)。

你也可以通过在你的 `next.config.js` 文件中设置 `typescript.tsconfigPath` 属性来提供 `tsconfig.json` 文件的相对路径。

从 `v12.0.0` 开始，Next.js 默认使用[SWC](https://nextjs.org/docs/advanced-features/compiler)来编译 TypeScript 和 TSX 以加快构建速度。

> 如果 `.babelrc` 存在，Next.js 将使用 Babel 来处理 TypeScript。了解[注意事项](https://babeljs.io/docs/en/babel-plugin-transform-typescript#caveats)和[编译器选项不同的处理方式](https://babeljs.io/docs/en/babel-plugin-transform-typescript#typescript-compiler-options)。

然后，运行 `next`（通常是 `npm run dev` 或 `yarn dev`），Next.js 将指导你安装所需的软件包，完成设置：

```bash
npm run dev

# You'll see instructions like these:
#
# Please install TypeScript, @types/react, and @types/node by running:
#
#         yarn add --dev typescript @types/react @types/node
#
# ...
```

你现在可以开始将文件从 `.js` 转换为 `.tsx` 并享受 TypeScript 的好处了！

> 一个名为 `next-env.d.ts` 的文件将在你的项目根目录被创建。这个文件确保 Next.js 类型被 TypeScript 编译器接收。**你不能删除它或编辑它**，因为它可能在任何时候改变。**因此，这个文件不应该被提交，而且应该被版本控制所忽略** 。

> TypeScript的 `严格（strict）` 模式默认是关闭的。当你对 TypeScript 感到适应时，建议在你的 `tsconfig.json` 中打开它。

> 不要编辑 `next-env.d.ts`，你可以通过添加一个新的文件，例如 `additional.d.ts`，然后在你的 `tsconfig.json` 中的 [`include`](https://www.typescriptlang.org/tsconfig#include) 数组中引用它来引入额外的类型。

默认情况下，Next.js 将把类型检查作为 `next build` 的一部分进行。我们建议在开发过程中使用代码编辑器进行类型检查。

如果你**不想看到**错误报告，请参考[忽略 TypeScript 错误](/docs/api-reference/next-config-js/ignoring-typescript-errors)的文档。

## 静态生成与服务端渲染

对于 `getStaticProps`、`getStaticPaths` 和 `getServerSideProps`，你可以分别使用 `GetStaticProps`、`GetStaticPaths` 和 `GetServerSideProps` 类型：

```ts
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'

export const getStaticProps: GetStaticProps = async (context) => {
  // ...
}

export const getStaticPaths: GetStaticPaths = async () => {
  // ...
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // ...
}
```

> 如果你使用 `getInitialProps`，你可以[按照本页的指示](/docs/api-reference/data-fetching/get-initial-props#typescript)。

## API 路由

下面是一个如何用内置类型定义 API 路由的例子：

```ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ name: 'John Doe' })
}
```

你也可以为响应的数据定义类型：

```ts
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  res.status(200).json({ name: 'John Doe' })
}
```

## 自定义 `App`

如果你使用一个[自定义 `App`](/docs/advanced-features/custom-app)，你可以使用内置的 `AppProps` 类型并将文件名改为 `./pages/_app.tsx`：

```ts
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

## 路径别名与根 URL

Next.js 自动支持`tsconfig.json` `"paths"` 和 `"baseUrl"` 选项。

在[模块路径别名文档](/docs/advanced-features/module-path-aliases)了解更多有关这个功能的信息。

## next.config.js 类型检查

`next.config.js` 文件必须是一个 JavaScript 文件，因为它不会被 Babel 或 TypeScript 解析，但是你可以在你的 IDE 中使用 JSDoc 来添加一些对它类型检查，如下所示：

```js
// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  /* config options here */
}

module.exports = nextConfig
```

## 增量类型检查

自从 `v10.2.1`，Next.js 支持 `tsconfig.json` 中的[增量类型检查](https://www.typescriptlang.org/tsconfig#incremental)，这可以帮助加快大型应用程序的类型检查。

强烈建议至少使用 TypeScript `v4.3.2`，以便在使用该功能时达到[最佳性能](https://devblogs.microsoft.com/typescript/announcing-typescript-4-3/#lazier-incremental)。

## 忽略 TypeScript 错误

当你的项目中出现 TypeScript 错误时，Next.js 会使你的**生产构建**（`next build`）失败。

如果你希望 Next.js 在你的应用程序出现错误时也能**危险地**生成生产环境代码，你可以禁用内置的类型检查。

如果禁用，请**确保**你在构建或部署过程中运行类型检查，否则这可能是**非常危险的**。

打开 `next.config.js`，在 `typescript` 配置中启用 `ignoreBuildErrors` 选项：

```js
module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}
```
