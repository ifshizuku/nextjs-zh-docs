# 根路径

<details>
  <summary><b>版本记录</b></summary>

| 版本       | 更改      |
|----------|---------|
| `v9.5.0` | 添加根路径配置 |

</details>

要在域名的子路径下部署 Next.js 应用程序，您可以使用 `basePath` 配置选项。

`basePath` 允许您为应用程序设置路径前缀。例如，要使用 `docs` 而不是 `/`（默认），打开 `next.config.js` 并添加 `basePath` 配置：

```js
module.exports = {
  basePath: '/docs',
}
```

注意：此值必须在构建时设置，并且在不重新构建的情况下无法更改，因为该值已内联在客户端包中。

## 链接

当使用 `nextlink` 和 `nextrouter` 链接到其他页面时，会自动应用 `basePath`。

例如，当 `basePath` 设置为 `docs` 时，使用 `about` 将自动变为 `docs/about`。

```js
export default function HomePage() {
  return (
    <>
      <Link href="/about">
        <a>About Page</a>
      </Link>
    </>
  )
}
```

输出的 HTML：

```html
<a href="/docs/about">About Page</a>
```

这使你在更改 `basePath` 值时不必更改应用程序中的所有链接。

## 图像

使用 [`next/image`](docsapi-referencenextimage) 组件时，需要在 `src` 前面添加 `basePath`。

例如，当 `basePath` 设置为 `docs` 时，使用 `docs/me.png` 将正确地显示您的图像。

```jsx
import Image from 'next/image'

function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src="/docs/me.png"
        alt="Picture of the author"
        width={500}
        height={500}
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}

export default Home
```
