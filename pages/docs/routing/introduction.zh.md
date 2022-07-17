---
description: Next.js 有一个内置的基于文件系统的路由器。您可以在此处了解它的工作原理。
---

# 路由

Next.js 有一个基于文件系统的路由器，基于 [页面的概念](/docs/basic-features/pages) 构建。

将文件添加到 `pages` 目录后，它将自动生成路由。

#### Index 路由

路由器会自动将名为 `index` 的文件，映射到目录的根目录。

- `pages/index.js` → `/`
- `pages/blog/index.js` → `/blog`

#### 嵌套路由

路由器支持嵌套文件。

- `pages/blog/first-post.js` → `/blog/first-post`
- `pages/dashboard/settings/username.js` → `/dashboard/settings/username`

#### 动态路由

匹配动态路由，可以使用 `[]` 括号语法。这允许您匹配命名参数。

- `pages/blog/[slug].js` → `/blog/:slug` (`/blog/hello-world`)
- `pages/[username]/settings.js` → `/:username/settings` (`/foo/settings`)
- `pages/post/[...all].js` → `/post/*` (`/post/2020/id/title`)

> 查看 [动态路由文档](/docs/routing/dynamic-routes) 了解更多信息。

## 页面之间的跳转

Next.js 路由器允许您在页面之间执行客户端路由跳转，类似于单页应用程序。

提供了一个名为 `Link` 的 React 组件，来执行客户端路由跳转。

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

上面的示例使用多个链接。 每个路径（`href`）映射到已知页面：

- `/` → `pages/index.js`
- `/about` → `pages/about.js`
- `/blog/hello-world` → `pages/blog/[slug].js`

对于使用 [静态生成](/docs/basic-features/data-fetching/get-static-props) 的页面，默认情况下将预取视口（最初或通过滚动）中的任何 `<Link />`（包括相应的数据）。

[服务器渲染](/docs/basic-features/data-fetching/get-server-side-props) 路由的相应数据是不预取的。

### 跳转到动态路径

您还可以使用插值来创建路径，这对于 [动态路由](#dynamic-route-segments) 非常方便。

例如，要显示已作为 prop 传递给组件的帖子列表，请执行以下操作：

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

> [`encodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) 在示例中用于保持路径 utf-8 兼容。

或者，使用 URL 对象：

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
现在，我们不是使用插值来创建路径，而是在 `href` 中使用 URL 对象，其中：

- `pathname` 是 `pages` 目录中页面的名称。
- `query` 是具有动态段的对象. 

## 注入路由器

<details>
  <summary><b>示例</b></summary>
  <ul>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/dynamic-routing">Dynamic Routing</a></li>
  </ul>
</details>

要访问 React 组件中的 [`router`](/docs/api-reference/next/router#router-object) 对象，您可以使用 [`useRouter`](/docs/api-reference/next/router#useRouter) 或 [`withRouter`](/docs/api-reference/next/router#withRouter)。

一般来说我们建议使用 [`useRouter`](/docs/api-reference/next/router#useRouter).

## 了解更多信息

路由器分为多个部分：

- [`next/link`: 处理客户端导航。](/docs/api-reference/next/link)
- [`next/router`: 在页面中利用路由器 API。](/docs/api-reference/next/router)
