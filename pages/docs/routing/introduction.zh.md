# 路由

Next.js 有一个基于文件系统的路由，建立在[页面的概念](/docs/basic-features/pages)上。

当一个文件被添加到 `pages` 目录中时，它就会自动作为一个路由。

`pages` 目录内的文件可以用来定义最常见的模式。

#### 索引路由

路由器将自动把名为 `index` 的文件路由到目录的根部。

- `pages/index.js` → `/`
- `pages/blog/index.js` → `/blog`

#### 嵌套路由

路由支持嵌套文件。如果你创建了一个嵌套的文件夹结构，文件仍将自动以同样的方式被路由。

- `pages/blog/first-post.js` → `/blog/first-post`
- `pages/dashboard/settings/username.js` → `/dashboard/settings/username`

#### 动态路由段

为了匹配一个动态字段，你可以使用中括号语法，这使你可以匹配命名的参数。

- `pages/blog/[slug].js` → `/blog/:slug` (`/blog/hello-world`)
- `pages/[username]/settings.js` → `/:username/settings` (`/foo/settings`)
- `pages/post/[...all].js` → `/post/*` (`/post/2020/id/title`)

> 查看[动态路由文档](/docs/routing/dynamic-routes)了解更多它的工作

## 页面之间的链接

Next.js 路由允许你在页面之间进行客户端路由转换，类似于单页应用程序（SPA）。

我们提供了一个名为 `Link` 的 React 组件来完成这种客户端的路由转换。

```jsx
import Link from 'next/link'

function Home() {
  return (
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/about">
          <a>About Us</a>
        </Link>
      </li>
      <li>
        <Link href="/blog/hello-world">
          <a>Blog Post</a>
        </Link>
      </li>
    </ul>
  )
}

export default Home
```

上面的例子使用了多个链接。每一个都是将一个路径（`href`）映射到一个已知的页面：

- `/` → `pages/index.js`
- `/about` → `pages/about.js`
- `/blog/hello-world` → `pages/blog/[slug].js`

对于使用[静态生成](/docs/basic-features/data-fetching/get-static-props)的页面，视口（viewport）中的任何 `<Link/>`（初始化的或通过滚动进入视口的）将被默认预获取（包括其相应的数据）。而[服务端渲染](/docs/basic-features/data-fetching/get-server-side-props)的路由的相应数据时*不*进行预获取的。

### 链接到动态路径

你也可以使用插值（interpolation）来创建路径，这对[动态路由段](#dynamic-route-segments)很有帮助。例如，要显示一个已经作为 `props` 传递给组件的文章列表：

```jsx
import Link from 'next/link'

function Posts({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${encodeURIComponent(post.slug)}`}>
            <a>{post.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Posts
```

> 在这个例子中，为了保证路径的 UTF-8 兼容，使用了 [`encodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)。

或者，使用一个 URL 对象：

```jsx
import Link from 'next/link'

function Posts({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link
            href={{
              pathname: '/blog/[slug]',
              query: { slug: post.slug },
            }}
          >
            <a>{post.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Posts
```

现在，我们不使用插值（interpolation）来创建路径，而是在 `href` 中使用一个 URL 对象，其中：

- `pathname` 是 `pages` 目录下的页面名称，本例中为 `/blog/[slug]`
- `query` 是一个具有动态字段的对象，本例中为 `slug`

## 注入路由

<details>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/dynamic-routing">Dynamic Routing</a></li>
  </ul>
</details>

要在 React 组件中访问 [`router` 对象](/docs/api-reference/next/router#router-object) 你可以使用 [`useRouter`](/docs/api-reference/next/router#useRouter) 或 [`withRouter`](/docs/api-reference/next/router#withRouter)。

一般情况下，我们推荐使用 [`useRouter`](/docs/api-reference/next/router#useRouter)。

## 了解更多

路由被分为多个部分：

- [**`next/link`** / 处理客户端导航](/docs/api-reference/next/link)
- [**`next/router`** / 在你的页面中使用路由 API](/docs/api-reference/next/router)
