# 动态 API 路由

<details open>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/api-routes">Basic API Routes</a></li>
  </ul>
</details>

API 路由支持[动态路由](/docs/routing/dynamic-routes)，与 `页面（pages）` 使用一样的命名规则。

例如，API 路由 `pages/api/post/[pid].js` 包含如下代码：

```js
export default function handler(req, res) {
  const { pid } = req.query
  res.end(`Post: ${pid}`)
}
```

现在，对 `/api/post/abc` 的请求将以文本形式响应：`Post: abc`。

### 索引路由与动态 API 路由

一个非常常见的 RESTful 路由设置模式如下：

- `GET api/posts` - 得到一个文章的列表，可能是分页的
- `GET api/posts/12345` - 获取 ID 为 12345 的文章

我们可以通过两种方式来建立模型：

- 方式 1：
  - `/api/posts.js`
  - `/api/posts/[postId].js`
- 方式 2：
  - `/api/posts/index.js`
  - `/api/posts/[postId].js`

两者都是等同的。第三种只使用 `/api/posts/[postId].js` 的方案是无效的，因为动态路由（包括泛路由）没有 `undefined` 状态，`GET api/posts` 在任何情况下都不会匹配 `/api/posts/[postId].js`。

### 泛 API 路由

API 路由可以通过在括号内添加三个点（`...`）来扩展到所有路径。例如：

- `pages/api/post/[...slug].js` 将不仅会匹配 `/api/post/a` 还会匹配人 `/api/post/a/b`、`/api/post/a/b/c` 等。

> **注意**：你可以使用 `slug` 以外的名称，例如 `[...param]`。

匹配的参数将作为查询参数（例子中的 `slug`）发送到页面，它总是一个数组，因此，路径 `/api/post/a` 将包含以下 `query` 对象：

```json
{ "slug": ["a"] }
```

而在 `/api/post/a/b` 的情况下，以及其他任何匹配的路径下，新的参数将被添加到数组中。如：

```json
{ "slug": ["a", "b"] }
```

`pages/api/post/[...slug].js` 的 API 路由可以是这样的：

```js
export default function handler(req, res) {
  const { slug } = req.query
  res.end(`Post: ${slug.join(', ')}`)
}
```

现在，对 `/api/post/a/b/c` 的请求将以文本形式响应：`Post：a, b, c`。

### 选择性泛 API 路由

泛路由可以通过在双中括号中加入参数（`[[...slug]]`）来实现选择性。

例如，`pages/api/post/[[...lug]].js` 将匹配 `/api/post`、`/api/post/a`、`/api/post/a/b`，以此类推。

泛路由和选择性泛路由的主要区别是，对于选择性泛路由，没有参数的路由也会被匹配（上面的例子中是 `/api/post`）。

`query` 对象如下：

```json
{ } // GET `/api/post` (empty object)
{ "slug": ["a"] } // `GET /api/post/a` (single-element array)
{ "slug": ["a", "b"] } // `GET /api/post/a/b` (multi-element array)
```

## 注意事项

- 预先定义的 API 路由优先于动态 API 路由，动态 API 路由优先于泛 API 路由。如下所示：
  - `pages/api/post/create.js` - 将匹配 `/api/post/create`
  - `pages/api/post/[pid].js` - 将匹配 `/api/post/1`、`/api/post/abc` 等，但不包括 `/api/post/create`
  - `pages/api/post/[...slug].js` - 将匹配 `/api/post/1/2`、`/api/post/a/b/c` 等，但不包括 `/api/post/create` 和 `/api/post/abc`

## 相关

关于下一步该做什么的更多信息，我们推荐以下章节：

- [**动态路由**](/docs/routing/dynamic-routes)
