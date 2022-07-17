# 动态路由

<details>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/dynamic-routing">Dynamic Routing</a></li>
  </ul>
</details>

对于复杂的应用程序来说，通过使用预先定义路径来定义路由并不总是足够。在 Next.js 中，你可以在一个页面上添加中括号（`[param]`）来创建一个动态路由（又称 url slugs、pretty urls 等）。

考虑如下页面 `pages/post/[pid].js`：

```jsx
import { useRouter } from 'next/router'

const Post = () => {
  const router = useRouter()
  const { pid } = router.query

  return <p>Post: {pid}</p>
}

export default Post
```

任何像 `/post/1`，`/post/abc` 这样的路径将被 `pages/post/[pid].js` 匹配，匹配的路径参数将作为查询参数发送到页面，它将与其他查询参数合并。

例如，路由 `/post/abc` 将包含以下 `query` 对象：

```json
{ "pid": "abc" }
```

类似的，路由 `/post/abc?foo=bar` 将包含以下 `query` 对象：

```json
{ "foo": "bar", "pid": "abc" }
```

值得注意的是，路由参数将**覆盖**具有相同名称的查询参数。例如，路由 `/post/abc?pid=123` 将包含以下 `query`对象：

```json
{ "pid": "abc" }
```

多个动态路由段的工作方式是一样的。页面 `pages/post/[pid]/[comment].js` 将匹配路由 `/post/abc/a-comment`，其 `query` 对象将是：

```json
{ "pid": "abc", "comment": "a-comment" }
```

客户端对动态路由的导航是用 [`next/link`](/docs/api-reference/next/link) 处理的。如果我们想链接到上面提到的地址，它将看起来像这样：

```jsx
import Link from 'next/link'

function Home() {
  return (
    <ul>
      <li>
        <Link href="/post/abc">
          <a>Go to pages/post/[pid].js</a>
        </Link>
      </li>
      <li>
        <Link href="/post/abc?foo=bar">
          <a>Also goes to pages/post/[pid].js</a>
        </Link>
      </li>
      <li>
        <Link href="/post/abc/a-comment">
          <a>Go to pages/post/[pid]/[comment].js</a>
        </Link>
      </li>
    </ul>
  )
}

export default Home
```

阅读[页面之间的链接](/docs/routing/introduction#linking-between-pages)了解更多。

### 泛路由（catch all routes）

<details>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/catch-all-routes">Catch All Routes</a></li>
  </ul>
</details>

动态路由可以通过在括号内添加三个点（`...`）来扩展到所有路径，例如：

- `pages/post/[...slug].js` 会匹配 `/post/a`，但也会匹配 `/post/a/b`、`/post/a/b/c`，以此类推。

> **注意**：你可以使用 `slug` 以外的名称，如 `[...param]`。

匹配的参数将作为查询参数（例子中的 `slug`）发送到页面，它总是一个数组，因此，路径 `/post/a` 将包含以下 `query` 对象：

```json
{ "slug": ["a"] }
```

而在 `/post/a/b` 以及其他任何匹配的路径下，新的参数将被添加到数组中，例如：

```json
{ "slug": ["a", "b"] }
```

### 选择性泛路由

泛路由可以通过在双中括号中加入参数（`[[...slug]]`）来实现选择性。

例如，`pages/post/[[...slug]].js` 将匹配 `/post`、`/post/a`、`/post/a/b` 等等。

泛路由和选择性泛路由的主要区别是，对于选择性的泛路由，没有参数的路由也会被匹配（上面的例子中是 `/post`）。

它的 `query` 对象如下：

```json
{ } // GET `/post` (empty object)
{ "slug": ["a"] } // `GET /post/a` (single-element array)
{ "slug": ["a", "b"] } // `GET /post/a/b` (multi-element array)
```

## 注意事项

- 预先定义的路由优先于动态路由，动态路由优先于泛路由。如下所示：
  - `pages/post/create.js` - 将匹配 `/post/create`
  - `pages/post/[pid].js` - 将匹配 `/post/1`、`/post/abc` 等，但不包括 `/post/create`
  - `pages/post/[...slug].js` - 将匹配 `/post/1/2`、`/post/a/b/c` 等，但不能匹配 `/post/create` 和 `/post/abc`
- 通过[自动静态优化](/docs/advanced-features/automatic-static-optimization)进行静态优化的页面将在不提供路由参数的情况下被注水，即其 `query` 是一个空对象（`{}`）。

水合后，Next.js 将触发应用程序进行更新，进而在 `query` 对象中提供路由的参数。

## 相关

关于下一步该做什么的更多信息，我们推荐以下章节：

- [**`next/link`** / 通过 `next/link` 进行客户端转换（transition）](/docs/api-reference/next/link)
- [**路由**](/docs/routing/introduction)
