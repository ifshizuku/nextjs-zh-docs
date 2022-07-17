# 手动导航（useRouter）

<details>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/using-router">Using Router</a></li>
  </ul>
</details>

[`next/link`](/docs/api-reference/next/link) 应该能够涵盖你需要的大部分路由，但你也可以不使用它来实现客户端的导航，查看 [`next/router`](/docs/api-reference/next/router) 的文档了解更多。

以下例子展示了如何使用 [`useRouter`](/docs/api-reference/next/router#useRouter) 实现基本的页面导航：

```jsx
import { useRouter } from 'next/router'

export default function ReadMore() {
  const router = useRouter()

  return (
    <button onClick={() => router.push('/about')}>
      Click here to read more
    </button>
  )
}
```
