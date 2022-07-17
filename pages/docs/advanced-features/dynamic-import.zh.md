# 动态导入

<details open>
  <summary><b>示例</b></summary>
  <ul>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-dynamic-import">Dynamic Import</a></li>
  </ul>
</details>

Next.js 支持使用 `import()` 延迟加载外部库，使用 `next/dynamic` 延迟加载 React 组件。

延迟加载通过减少渲染页面所需 JavaScript 的量来帮助提高初始加载性能。组件或库只有在使用时才会被导入并包含在 JavaScript 包中。

`next/dynamic` 是 [`React.lazy`](https://reactjs.org/docs/code-splitting.html#reactlazy) 的扩展。当与 [`Suspense`](https://reactjs.org/docs/react-api.html#reactsuspense) 一起使用时，组件可以延迟水合，直到 Suspense 边界得到解决。

## 示例

通过使用 `next/dynamic`，`Header` 组件将不会包含在页面的初始 JavaScript 包中。在解决 `Suspense` 边界时，页面将首先呈现 Suspense 的 `fallback`，然后是 `Header` 组件。

```jsx
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const DynamicHeader = dynamic(() => import('../components/header'), {
  suspense: true,
})

export default function Home() {
  return (
    <Suspense fallback={`Loading...`}>
      <DynamicHeader />
    </Suspense>
  )
}
```
> **注意**：在 `import('path/to/component')` 中，必须显式写入路径。它不能是模板字符串，也不能是变量。此外，`import()` 必须位于 Next.js 的 `dynamic()` 调用内，能够将 webpack 模块 ID 与特定的 `dynamic()` 调用相匹配，并在呈现之前预加载它们。`dynamic()` 不能在 React 渲染中使用，因为它需要在模块的顶层进行标记，以便预加载工作，类似于 `React.lazy`

如果你没有使用 React 18，你可以使用 `loading` 属性来代替 Suspense `fallback`。

```jsx
const DynamicHeader = dynamic(() => import('../components/header'), {
  loading: () => <header />,
})
```

## 使用带有命名的导出

要动态导入带有命名的导出，可以从 `import()` 返回的 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 中返回它：

```jsx
// components/hello.js
export function Hello() {
  return <p>Hello!</p>
}

// pages/index.js
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() =>
  import('../components/hello').then((mod) => mod.Hello)
)
```

## 不使用 SSR

要在客户端动态加载组件，可以使用 `ssr` 选项禁用服务端渲染。如果外部依赖项或组件依赖于浏览器 API（如 `window` ），这将非常有用。

```jsx
import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(() => import('../components/header'), {
  ssr: false,
})
```

## 使用外部库

本例使用外部库 `fuse.js` 用于模糊搜索，该模块仅在用户输入搜索后加载到浏览器中。

```jsx
import { useState } from 'react'

const names = ['Tim', 'Joe', 'Bel', 'Lee']

export default function Page() {
  const [results, setResults] = useState()

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        onChange={async (e) => {
          const { value } = e.currentTarget
          // 动态加载 fuse.js
          const Fuse = (await import('fuse.js')).default
          const fuse = new Fuse(names)

          setResults(fuse.search(value))
        }}
      />
      <pre>Results: {JSON.stringify(results, null, 2)}</pre>
    </div>
  )
}
```
