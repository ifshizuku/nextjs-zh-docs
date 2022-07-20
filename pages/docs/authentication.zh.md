# 身份验证

身份验证可以验证用户的身份，而授权则控制用户可以访问的内容。Next.js 支持多种验证模式，每种模式都是为不同的使用情况设计的。本页将介绍每种情况，以便你能根据你的条件进行选择。

## 验证模式

确定你需要哪种验证模式的第一步是了解你想要使用的[数据获取策略](/docs/basic-features/data-fetching/overview)。然后我们可以确定哪些验证提供商支持这种策略。有两种主要模式：

- 使用[静态生成](/docs/basic-features/pages#static-generation-recommended)在服务器上渲染一个加载状态，然后在客户端获取用户数据
- [服务端](/docs/basic-features/pages#server-side-rendering)获取用户数据以消除未经验证的内容闪现（flash）

### 验证静态生成的页面

如果没有阻塞数据要求，Next.js 会自动判断一个页面是否是静态的。这意味着页面中没有 [`getServerSideProps`](/docs/basic-features/data-fetching/get-server-side-props) 和 `getInitialProps`。相反，你的页面可以从服务器渲染一个加载状态，然后再获取用户客户端。

这种模式的一个好处是，它允许从全球 CDN 提供页面，并使用 [`next/link`](/docs/api-reference/next/link) 预加载。在实践中，这将会使 TTI（[交互时间](https://web.dev/interactive/)）更快。

让我们看一个个人资料页的例子。最初将呈现一个加载的骨架，一旦一个用户的请求完成，它将显示用户的名字。

```jsx
// pages/profile.js

import useUser from '../lib/useUser'
import Layout from '../components/Layout'

const Profile = () => {
  // Fetch the user client-side
  const { user } = useUser({ redirectTo: '/login' })

  // Server-render loading state
  if (!user || user.isLoggedIn === false) {
    return <Layout>Loading...</Layout>
  }

  // Once the user request finishes, show the user
  return (
    <Layout>
      <h1>Your Profile</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </Layout>
  )
}

export default Profile
```

你可以查看这个[例子](https://iron-session-example.vercel.app/)的 Demo，或 [`with-iron-session`](https://github.com/vercel/next.js/tree/canary/examples/with-iron-session) 示例了解它是如何工作的。

### 验证服务端渲染的页面

如果你从一个页面导出一个名为 [`getServerSideProps`](/docs/basic-features/data-fetching/get-server-side-props) 的 `async` 函数，Next.js 将在每次请求时使用 `getServerSideProps` 返回的数据对这个页面进行预渲染。

```jsx
export async function getServerSideProps(context) {
  return {
    props: {}, // Will be passed to the page component as props
  }
}
```

让我们修改用户页面例子来使用[服务端渲染](/docs/basic-features/pages#server-side-rendering)。如果有一个会话，`user` 将作为 `props` 返回给页面中的 `Profile` 组件，注意在[这个例子](https://iron-session-example.vercel.app/)中没有加载骨架。

```jsx
// pages/profile.js

import withSession from '../lib/session'
import Layout from '../components/Layout'

export const getServerSideProps = withSession(async function ({ req, res }) {
  const { user } = req.session

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { user },
  }
})

const Profile = ({ user }) => {
  // Show the user. No loading state is required
  return (
    <Layout>
      <h1>Your Profile</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </Layout>
  )
}

export default Profile
```

这种模式的好处是防止在重定向前出现未经验证的内容。值得注意的是，在  `getServerSideProps` 中获取用户数据将阻止渲染，直到验证提供商的请求完成。为了防止产生瓶颈和增加你的 TTFB（[Time to First Byte](https://web.dev/time-to-first-byte/)），你应该确保你的验证查询是快速的。否则，可以考虑[静态生成](#authenticating-statically-generated-pages)。

## 验证提供商

现在我们已经讨论了验证模式，让我们看看具体的提供商，并探讨它们如何与 Next.js 一起使用。

### 使用你自己的数据库

<details open>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-iron-session">with-iron-session</a></li>
<li><a href="https://github.com/nextauthjs/next-auth-example">next-auth-example</a></li>
  </ul>
</details>

如果你有一个包含用户数据的现有数据库，你可能想利用一个与供应商无关的开源解决方案。

- 如果你想要一个低级的、加密的、无状态的会话工具，请使用 [`iron-session`](https://github.com/vercel/next.js/tree/canary/examples/with-iron-session)
- 如果你想要一个全功能的验证系统，并包含其他内置的提供商（Google、Facebook、GitHub 等）、JWT、JWE、电子邮件 / 密码登录、魔力链接（magic links）等，请使用 [`next-auth`](https://github.com/nextauthjs/next-auth-example)

这两个库都支持两种验证模式，如果你对 [Passport](http://www.passportjs.org/) 感兴趣，我们也有使用安全加密的 cookies 的例子：

- [with-passport](https://github.com/vercel/next.js/tree/canary/examples/with-passport)
- [with-passport-and-next-connect](https://github.com/vercel/next.js/tree/canary/examples/with-passport-and-next-connect)

### 其他提供商

要看其他验证提供商的示例，请查看[examples 文件夹](https://github.com/vercel/next.js/tree/canary/examples)。

<details open>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/auth0">Auth0</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-clerk">Clerk</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-firebase-authentication">Firebase</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-magic">Magic</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-nhost-auth-realtime-graphql">Nhost</a></li>
<li><a href="https://github.com/vercel/examples/tree/main/solutions/auth-with-ory">Ory</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-supabase-auth-realtime-db">Supabase</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-supertokens">Supertokens</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-userbase">Userbase</a></li>
  </ul>
</details>

## 相关

关于下一步该做什么的更多信息，我们推荐以下章节：

- [**页面** / 了解更多有关 Next.js 的页面和不同的预渲染 方式](/docs/basic-features/pages)
- [**数据获取**](/docs/basic-features/data-fetching/overview)
