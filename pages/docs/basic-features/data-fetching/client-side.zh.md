# 客户端数据获取

当你的页面**不需要 SEO 索引、不需要预先渲染你的数据或当你的页面内容需要经常更新**时，客户端数据获取是非常有用的。与服务器端的渲染 API 不同，你可以在组件级别使用客户端的数据获取。

如果在页面层面上使用（客户端数据获取），数据是在运行时获取的，而页面的内容会随着数据的变化而更新；如果在组件层面上使用，数据在组件加载时被获取，组件的内容会随着数据的变化而更新。

值得注意的是，使用客户端数据获取会影响你的应用程序的性能和页面的加载速度。这是因为数据获取是在组件或页面**加载时**进行的，数据**没有**被缓存。

## 使用 useEffect 进行客户端数据获取

以下的示例展示了如何在客户端使用 `useEffect` 钩子（Hook）获取数据：

```jsx
function Profile() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/profile-data')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.bio}</p>
    </div>
  )
}
```

## 使用 SWR 进行客户端数据获取

Next.js 背后的团队创建了一个 React Hook 库，用于数据的获取，称为 [**SWR**]()。如果你在客户端获取数据，我们强烈建议使用它。它可以处理缓存、重新验证、焦点跟踪、间隔时间的重新获取等等。

使用与上面相同的例子，我们现在可以使用 SWR 来获取个人资料数据了。SWR 将自动为我们缓存数据，并在数据变质时重新验证。

有关使用 SWR 的更多信息，请查看 [SWR 文档](https://swr.vercel.app/docs/getting-started)。

```jsx
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

function Profile() {
  const { data, error } = useSWR('/api/profile-data', fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.bio}</p>
    </div>
  )
}
```

## 相关

关于下一步该做什么的更多信息，我们推荐以下章节：

- [**路由** / 有关 Next.js 路由](/docs/routing/introduction)
