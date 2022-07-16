# getStaticPaths

如果一个页面具有[动态路由](/docs/routing/dynamic-routes)并使用了 `getStaticProps`，这时你需要定义一个**路径的列表**来进行静态生成。

当你从一个使用动态路由的页面导出一个名为 `getStaticPaths`（静态站点生成）的函数时，Next.js 将静态地预渲染 `getStaticPaths` 指定的所有路径。

```jsx
export async function getStaticPaths() {
  return {
    paths: [
      { params: { ... } }
    ],
    fallback: true // false or 'blocking'
  };
}
```

`getStaticPaths` **必须**与 `getStaticProps` 配合使用。你**不可以**将它与 [`getServerSideProps`](/docs/basic-features/data-fetching/get-server-side-props) 一起使用。

[`getStaticPaths` API 参考](/docs/api-reference/data-fetching/get-static-paths)包含了所有 `getStaticPaths` 可用的参数和属性。

## 何时使用 getStaticPaths ？

如果你需要静态地预渲染使用动态路由的页面，你应该使用 `getStaticPaths`：

- 数据来自于**无头 CMS（Headless CMS）**
- 数据来自于一个**数据库**
- 数据来自于**文件系统**
- 数据可以**被公开缓存**（不针对用户）
- 页面**必须**预渲染（为了SEO），并且需要非常快 - `getStaticProps` 生成 `HTML` 和 `JSON` 文件，这两个文件可以被 CDN 缓存以提高性能

## getStaticPaths 运行的时间

`getStaticPaths` 只在生产中的构建过程运行，在运行时不会被调用。你可以[用这个工具](https://next-code-elimination.vercel.app/)验证写在 `getStaticPaths` 内的代码是否从客户端捆绑中移除。

### getStaticProps 与 getStaticPaths 的关系

- `getStaticProps` 在 `next build` 时运行，用于构建过程返回的所有 `paths`
- 当定义 `fallback: true` 时，`getStaticProps` 在后台运行
- 当定义 `fallback: blocking` 时，`getStaticProps` 在初始渲染前被调用

##  getStaticPaths 可用的位置

`getStaticPaths` 只能从同时使用 `getStaticProps` 的[动态路由](/docs/routing/dynamic-routes)页面中导出。你**不能**从非页面文件中导出，例如从你的 `components` 文件夹中。

注意，你必须将 `getStaticProps ` 作为一个独立的函数导出，如果你将 `getStaticProps` 作为页面组件的一个属性，那么它将**不会**工作。

## 开发环境响应

在开发环境中（`next dev`），`getStaticPaths` 将在**每次请求**时运行。

## 相关

关于下一步该做什么的更多信息，我们建议阅读以下章节：

- [**getStaticPaths API 参考**](/docs/api-reference/data-fetching/get-static-paths)
