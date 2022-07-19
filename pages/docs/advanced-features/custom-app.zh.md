# 自定义 App

Next.js 使用 `App` 组件来初始化页面。您可以覆盖它并控制页面初始化。这可以让你做一些了不起的事情，例如：

- 在页面切换之间保留布局（layout）
- 在切换页面时保持状态（state）
- 使用 `componentDidCatch` 自定义错误处理
- 注入其他数据到页面
- [添加全局 CSS](/docs/basic-features/built-in-css-support#adding-a-global-stylesheet)

要覆盖默认的 `App`，请创建文件 `./pages/_app.js`，如下所示：
```jsx
// import App from 'next/app'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}


// 仅当对应用程序中的每个页面都有阻塞数据要求时，才取消注释此方法。
// 这将禁用执行自动静态优化的功能，从而导致应用中的每个页面都在服务器端渲染。
// MyApp.getInitialProps = async (appContext) => {
//   // 调用页面的 `getInitialProps` 和填充 `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp
```

`Component` 属性是当前的 `page`，因此，每当你在路由之间切换时，`Component` 都会更新为新的 `page`。因此，你传递给 `Component` 的任何属性都会被 `page` 接收到。

`pageProps` 是一个具有初始属性的对象，这些属性是通过我们的 [数据获取方法](/docs/basic-features/data-fetching/overview) 之一为您的页面预加载的，否则它是一个空对象。

`App.getInitialProps` 接收一个名为 `context.ctx` 的参数。它与 `getInitialProps` 中的 [`context`](/docs/api-reference/data-fetching/get-initial-props#context-object) 对象属性相同。

### 注意事项

- 如果你的应用正在运行，并且你添加了自定义的 `App`，则需要重新启动开发服务器。只有当 `pages/_app.js` 以前不存在时才需要。
- 在 `App` 中添加自定义的 [`getInitialProps`](/docs/api-reference/data-fetching/get-initial-props) 将在没有 [静态生成](/docs/basic-features/data-fetching/get-static-props) 的页面中禁用 [自动静态优化](/docs/advanced-features/automatic-static-optimization)。
- 当你在自定义 App 中添加 `getInitialProps` 时，你必须导入 `import App from "next/app"`，在 `getInitialProps` 中调用 `App.getInitialProps(appContext)`，并将返回的对象合并到返回值中。
- `App` 当前不支持 Next.js 的 [数据获取](/docs/basic-features/data-fetching/overview) 方法， 如 [`getStaticProps`](/docs/basic-features/data-fetching/get-static-props) 或 [`getServerSideProps`](/docs/basic-features/data-fetching/get-server-side-props)。

### TypeScript

如果您使用的是 TypeScript，请查看我们的 [TypeScript 文档](/docs/basic-features/typescript#custom-app)。

## 相关

关于下一步该做什么的更多信息，我们建议阅读以下章节：

- [**自动静态优化** / Next.js 会尽可能自动将你的应用优化为静态 HTML，在此处了解其工作原理](/docs/advanced-features/automatic-static-optimization)
- [**自定义错误页面** / 了解有关内置错误页面的详细信息](/docs/advanced-features/custom-error-page)
