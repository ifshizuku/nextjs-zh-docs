# 浅层路由

<details>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-shallow-routing">Shallow Routing</a></li>
  </ul>
</details>

浅层路由允许你改变 URL 而不需要再次运行数据获取，包括 [`getServerSideProps`](/docs/basic-features/data-fetching/get-server-side-props)、[`getStaticProps`](/docs/basic-features/data-fetching/get-static-props) 以及 [`getInitialProps`](/docs/api-reference/data-fetching/get-initial-props)。

在不丢失状态的前提下，你将会通过 [`router` 对象](/docs/api-reference/next/router#router-object)（由 [`useRouter`](/docs/api-reference/next/router#useRouter) 或 [`withRouter`](/docs/api-reference/next/router#withRouter) 添加） 收到更新的 `pathname` 和 `query`。

要启用浅层路由，将 `shallow` 选项设置为 `true`。如下所示：

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Current URL is '/'
function Page() {
  const router = useRouter()

  useEffect(() => {
    // Always do navigations after the first render
    router.push('/?counter=10', undefined, { shallow: true })
  }, [])

  useEffect(() => {
    // The counter changed!
  }, [router.query.counter])
}

export default Page
```

URL 将被更新为 `/?counter=10`。而页面不会被替换，只有路由的状态被改变。

你也可以通过 [`componentDidUpdate`](https://zh-hans.reactjs.org/docs/react-component.html#componentdidupdate) 观察URL的变化，如下所示：

```jsx
componentDidUpdate(prevProps) {
  const { pathname, query } = this.props.router
  // verify props have changed to avoid an infinite loop
  if (query.counter !== prevProps.router.query.counter) {
    // fetch data based on the new query
  }
}
```

## 注意事项

浅层路由**只**对当前页面的 URL 起作用。我们假设有另一个叫做 `pages/about.js` 的页面，而你编写这个：

```jsx
router.push('/?counter=10', '/about?counter=10', { shallow: true })
```

由于这是一个新的页面，它将卸载当前的页面，加载新的页面并等待数据获取，尽管我们要求做浅层路由。
