# 开始

欢迎来到 Next.js 文档！

如果你是第一次使用 Next.js，我们建议你从[学习课程（英文）](https://nextjs.org/learn/basics/create-nextjs-app)开始。

带有测验的互动课程将指导你学习使用 Next.js 所需的一切知识。

如果你有一些关于 Next.js 的疑问，随时欢迎你在我们的[GitHub Discussions](https://github.com/vercel/next.js/discussions)社区里提问。

#### 系统要求

- [Node.js 12.22.0](https://nodejs.org/) 或者更新版本
- 支持 macOS、Windows（包括 WSL）和 Linux

## 自动配置（安装）

我们建议使用 `create-next-app` 来创建一个新的 Next.js 应用程序，它将为你自动设置好目前需要的一切。创建一个项目，执行：

```bash
npx create-next-app@latest
# 或
yarn create next-app
# 或
pnpm create next-app
```

如果你想以一个 TypeScript 项目开始，你可以加上 `--typescript` 标识：

```bash
npx create-next-app@latest --typescript
# 或
yarn create next-app --typescript
# 或
pnpm create next-app --typescript
```

在安装完成之后：

- 运行 `npm run dev` 或 `yarn dev` 或 `pnpm dev` 在 `http://localhost:3000` 上启动一个开发服务器
- 访问 `http://localhost:3000` 查看你的应用程序
- 编辑 `pages/index.js` 并在浏览器中看到更新的结果

了解 `create-next-app` 的更多信息，你可以查看 [`create-next-app` 文档](/docs/api-reference/create-next-app)。

## 手动设置（安装）

在你的项目中安装 `next`、`react`、`react-dom`：

```bash
npm install next react react-dom
# 或
yarn add next react react-dom
# 或
pnpm add next react react-dom
```

打开 `package.json` 并将如下内容添加进 `scripts`：

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

这些命令代表了开发一个应用程序的不同阶段：

- `dev` - 运行 [`next dev`](/docs/api-reference/cli#development) 启动 Next.js 开发模式
- `build` - 运行 [`next build`](/docs/api-reference/cli#build) 构建生产环境应用程序
- `start` - 运行 [`next start`](/docs/api-reference/cli#production) 启动 Next.js 生产环境服务器
- `lint` - 运行 [`next lint`](/docs/api-reference/cli#lint) 配置 Next.js 内建的ESLint

在你的根目录创建 `pages` 和 `public` 两个文件夹：

- `pages` - 通过它们的文件名与路由相关联。如文件 `pages/about.js` 会被映射到 `/about`
- `public` - 存放类似图片、字体等静态资源。`public` 文件夹中的文件可以被代码从根 URL（`/`）直接引用

Next.js 是围绕[页面](/docs/basic-features/pages)的概念建立的。一个页面是从 `pages` 目录中的 `.js`、`.jsx`、`.ts`或`.tsx` 文件导出的[React 组件](https://reactjs.org/docs/components-and-props.html)。你甚至可以在文件名中添加[动态路由](/docs/routing/dynamic-routes)参数。

在 `pages` 目录中添加文件 `index.js` 以开始。这是你的用户访问这个应用程序根地址时被渲染的页面。

在 `pages/index.js` 中添加如下内容：

```jsx
function HomePage() {
  return <div>Welcome to Next.js!</div>
}

export default HomePage
```

在配置完成之后：

- 运行 `npm run dev` 或 `yarn dev` 或 `pnpm dev` 在 `http://localhost:3000` 上启动一个开发服务器
- 访问 `http://localhost:3000` 查看你的应用程序
- 编辑 `pages/index.js` 并在浏览器中看到更新的结果

目前为止，我们得到了：

- 自动编译和[捆绑（bundling）](/docs/advanced-features/compiler)
- [React 快速刷新（Fast Refresh）](https://nextjs.org/blog/next-9-4#fast-refresh)
- [`pages/`](/docs/basic-features/pages) 目录的[静态生成和服务端渲染](/docs/basic-features/data-fetching/overview)
- 通过 `public/` 目录映射到根 URL（`/`）的[静态文件服务](/docs/basic-features/static-file-serving)

此外，任何 Next.js 程序从一开始就随时准备进入生产环境。在[部署文档](/docs/deployment)中阅读更多有关内容。

## 相关

关于下一步该做什么的更多信息，我们建议阅读以下章节：

- [页面：了解更多关于 Next.js 中页面的信息](/docs/basic-features/pages)
- [CSS 支持：内建 CSS 支持，为你的应用程序添加自定义样式](/docs/basic-features/built-in-css-support)
- [CLI：了解更多有关 Next.js 的命令行工具](/docs/api-reference/cli)
