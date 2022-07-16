# 布局

<details open>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/layout-component">layout-component</a></li>
  </ul>
</details>

> **注意**：我们正在 Next.js 中引入改进的路由支持。阅读 [Layouts RFC](https://nextjs.org/blog/layouts-rfc) 以了解更多细节并给我们反馈。

React 模型允许我们将一个[页面](/docs/basic-features/pages)解构为一系列的组件。这些组件中有许多经常在页面之间重复使用。例如，你可能在每个页面都有相同的导航栏和页脚。

```jsx
// components/layout.js

import Navbar from './navbar'
import Footer from './footer'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

## 示例

### 带有自定义 `App` 的单一共享布局

如果你的整个应用程序只有一个布局，你可以创建一个[自定义 `App`](/docs/advanced-features/custom-app)，并用该布局来包装你的应用程序。

由于 `<Layout />` 组件在改变页面时被重新使用，其组件状态将被保留（如输入值）。

```jsx
// pages/_app.js

import Layout from '../components/layout'

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
```

### 每个页面的布局

如果你需要多个布局，你可以给你的页面添加一个属性 `getLayout`，允许你返回一个布局的 React 组件。这允许你在*每页的基础*上定义布局。由于我们返回的是一个函数，如果需要的话，我们可以有复杂的嵌套布局。

```jsx
// pages/index.js

import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'

export default function Page() {
  return {
    /** Your content */
  }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  )
}
```

```jsx
// pages/_app.js

export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
```

当在页面之间导航时，我们希望*持久化*页面状态（输入值、滚动位置等），以获得单页面应用（SPA）的体验。

这种布局模式实现了状态的持久性，因为 React 组件树在页面转换之间被维护。有了组件树，React 可以了解哪些元素发生了变化，以保留状态。

> **注意**：这个过程被称为[协调](https://zh-hans.reactjs.org/docs/reconciliation.html)，这使 React 了解哪些元素发生了变化

### 使用 TypeScript

当使用 TypeScript 时，你必须首先为你的页面创建一个新的类型，包括一个 `getLayout` 函数。然后，你必须为你的 `AppProps` 创建一个新的类型，重写  `Component` 属性以使用先前创建的类型。

```tsx
// pages/index.tsx

import type { ReactElement } from 'react'
import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'
import type { NextPageWithLayout } from './_app'

const Page: NextPageWithLayout = () => {
  return <p>hello world</p>
}

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  )
}

export default Page
```

```tsx
// pages/_app.tsx

import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
```

### 数据获取

在你的布局中，你可以使用 `useEffect` 或类似 [SWR](https://swr.vercel.app/) 的库在客户端获取数据。 因为这个文件不是[页面](/docs/basic-features/pages)，所以你不能使用 `getStaticProps` 或 `getServerSideProps`。

```jsx
// components/layout.js

import useSWR from 'swr'
import Navbar from './navbar'
import Footer from './footer'

export default function Layout({ children }) {
  const { data, error } = useSWR('/api/navigation', fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <>
      <Navbar links={data.links} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

## 相关

关于下一步该做什么的更多信息，我们推荐以下章节：

- [**页面**](/docs/basic-features/pages)
- [**自定义 `App`** / 了解 Next.js 初始化页面](/docs/advanced-features/custom-app)
