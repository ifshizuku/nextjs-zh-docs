# 页面

> **提示：** 我们正在 Next.js 中引入改进的路由支持。阅读 [Layouts RFC](https://nextjs.org/blog/layouts-rfc) 以了解更多细节并给我们反馈。

在 Next.js 中，一个页面是从 `pages` 目录中的 `.js`、`.jsx`、`.ts` 或 `.tsx` 文件导出的 [React 组件](https://reactjs.org/docs/components-and-props.html)。 每一个页面都通过一个基于它们的文件名的路由访问。

**示例**：如果你创建 `pages/about.js` 并如下导出一个 React 组件，它将可以在 `/about` 中被访问。

```jsx
function About() {
  return <div>About</div>
}

export default About
```

### 含有动态路由的页面

Next.js 支持页面动态路由。例如，如果你创建 `pages/posts/[id].js` 文件， 那么它可以在 `posts/1`、`posts/2` 等位置被访问。

> 查看[动态路由文档](/docs/routing/dynamic-routes)以了解更多有关动态路由的信息。

## 预渲染

默认情况下，Next.js 会**预渲染**每一个页面。这意味着 Next.js 提前为每一个页面生成了 HTML，而不是让这些工作全部通过客户端的 JavaScript 完成。预渲染可以获得更好的性能和 SEO。

每个生成的 HTML 页面都与该页面所需的最小 JavaScript 代码相联系。当一个页面被浏览器加载时，它的 JavaScript 代码就会运行，并使该页面完全交互，这个过程叫做\_水合（hydration）\_。

### 预渲染的两种形式

Next.js 有两种形式的预渲染：**静态生成**和**服务端渲染**。它们的区别在于 **何时**为页面生成 HTML。

- [**静态生成（推荐）**](#static-generation-recommended)：HTML 在**构建时**生成并且将会在每一次请求中复用
- [**服务端渲染**](#server-side-rendering)：HTML 在**每次请求**时生成

重要的是，Next.js 允许你**选择**你想对每个页面使用的预渲染形式。你可以创建一个“混合” Next.js 应用程序，对大多数页面使用静态生成，对其他页面使用服务器端渲染。

出于性能方面的考虑，我们**建议**使用**静态生成**而不是服务器端渲染。静态生成的页面可以被CDN缓存，不需要额外的配置来提高性能。然而，在某些情况下，服务器端渲染可能是唯一的选择。

你也可以在使用静态生成或服务器端渲染的同时使用**客户端渲染**。这意味着一个页面的某些部分可以完全由客户端的JavaScript来渲染。要了解更多，请查看[数据获取](/docs/basic-features/data-fetching/client-side)文档。

## 静态生成（推荐）

<details open>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-wordpress">WordPress Example</a> (<a href="https://next-blog-wordpress.vercel.app">Demo</a>)</li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/blog-starter">Blog Starter using markdown files</a> (<a href="https://next-blog-starter.vercel.app/">Demo</a>)</li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-datocms">DatoCMS Example</a> (<a href="https://next-blog-datocms.vercel.app/">Demo</a>)</li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-takeshape">TakeShape Example</a> (<a href="https://next-blog-takeshape.vercel.app/">Demo</a>)</li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-sanity">Sanity Example</a> (<a href="https://next-blog-sanity.vercel.app/">Demo</a>)</li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-prismic">Prismic Example</a> (<a href="https://next-blog-prismic.vercel.app/">Demo</a>)</li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-contentful">Contentful Example</a> (<a href="https://next-blog-contentful.vercel.app/">Demo</a>)</li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-strapi">Strapi Example</a> (<a href="https://next-blog-strapi.vercel.app/">Demo</a>)</li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-prepr">Prepr Example</a> (<a href="https://next-blog-prepr.vercel.app/">Demo</a>)</li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-agilitycms">Agility CMS Example</a> (<a href="https://next-blog-agilitycms.vercel.app/">Demo</a>)</li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-cosmic">Cosmic Example</a> (<a href="https://next-blog-cosmic.vercel.app/">Demo</a>)</li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-buttercms">ButterCMS Example</a> (<a href="https://next-blog-buttercms.vercel.app/">Demo</a>)</li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-storyblok">Storyblok Example</a> (<a href="https://next-blog-storyblok.vercel.app/">Demo</a>)</li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-graphcms">GraphCMS Example</a> (<a href="https://next-blog-graphcms.vercel.app/">Demo</a>)</li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-kontent">Kontent Example</a> (<a href="https://next-blog-kontent.vercel.app/">Demo</a>)</li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-builder-io">Builder.io Example</a> (<a href="https://cms-builder-io.vercel.app/">Demo</a>)</li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-tina">TinaCMS Example</a> (<a href="https://cms-tina-example.vercel.app/">Demo</a>)</li>
<li><a href="https://static-tweet.vercel.app/">Static Tweet (Demo)</a></li>
  </ul>
</details>

如果一个页面使用了**静态生成**，页面的 HTML 是在**构建时**生成的。这意味着在生产中，页面的HTML是在你运行 `next build` 时生成的。这个 HTML 将在每个请求中被重复使用，它可以被 CDN 缓存。

在Next.js中，你可以静态生成**有或没有数据**的页面。让我们来看看具体情况。

### 无数据静态生成

默认情况下，Next.js 使用“静态生成”预先渲染页面，而不获取数据。下面是一个例子：

```jsx
function About() {
  return <div>About</div>
}

export default About
```

请注意，这个页面不需要获取任何外部数据来进行预渲染。在这样的情况下，Next.js 会在构建时为每个页面生成一个 HTML 文件。

### 含数据静态生成

有些页面需要获取外部数据来进行预渲染。这有两种情况，一种或两种都可能适用。在每种情况下，你都可以使用 Next.js 提供的这些函数：

1. 你的页面**内容**取决于外部数据。使用 `getStaticProps`。
2. 你的页面**路径**取决于外部数据。使用 `getStaticPaths`（通常与 `getStaticProps` 配合使用）。

#### 场景1：你的页面**内容**取决于外部数据

**示例：**你的博客页面可能需要从 CMS（内容管理系统）中获取文章的列表。

```jsx
// TODO: Need to fetch `posts` (by calling some API endpoint)
//       before this page can be pre-rendered.
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

export default Blog
```

为了在预渲染时获取这些数据，Next.js 允许你在同一个文件中 `导出（export）` 一个名为`getStaticProps` 的 `异步（async）` 函数。这个函数在构建时被调用，让你在预渲染时将获取的数据传递给页面的 `props`。

```jsx
function Blog({ posts }) {
  // Render posts...
}

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}

export default Blog
```

查看[数据获取文档](/docs/basic-features/data-fetching/get-static-props)了解更多有关 `getStaticProps` 的工作。

#### 情景2：你的页面**路径**依赖于外部数据

Next.js 允许你创建带有**动态路由**的页面。例如，你可以创建 `pages/posts/[id].js` 文件基于 `id` 来展示单个文章。这将使你在访问 `posts/1` 时显示一个 `id: 1` 的文章。

> 查看[动态路由文档](/docs/routing/dynamic-routes)了解更多有关动态路由的信息。

然而，你想在构建时预渲染哪个 `id` 可能取决于外部数据。

**示例**：假设你只在数据库中添加了一篇文章（编号为 `id: 1`）。此时，你只想在构建时对 `posts/1` 进行预渲染。

接着，你可能会添加编号为 `id: 2` 的另一个文章，然后你也想预渲染 `posts/2`。

所以你的页面**路径**的预渲染取决于外部数据。为了处理这个问题，Next.js让你从动态页面（本例中为 `pages/posts/[id].js` ）中 `导出（export）` 一个名为 `getStaticPaths` 的 `异步（async）` 函数。这个函数在构建时被调用，让你指定你想要预渲染的路径。

```jsx
// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}
```

另外，在 `pages/posts/[id].js` 中，你需要导出 `getStaticProps`，这样你就可以用这个 `id` 来获取对应文章的数据，并使用它来预渲染页面。

```jsx
function Post({ post }) {
  // Render post...
}

export async function getStaticPaths() {
  // ...
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // Pass post data to the page via props
  return { props: { post } }
}

export default Post
```

查看[数据获取文档](/docs/basic-features/data-fetching/get-static-paths)了解更多有关 `getStaticPaths` 的工作。

### 我应该在什么时候使用静态生成？

我们建议尽可能使用**静态生成**（有数据和无数据），因为你的页面可以一次建成并可以由 CDN 加速，这比每次请求都由服务器渲染页面要快得多。

你可以为许多类型的页面使用静态生成，包括。

- 营销网页
- 博客文章和作品集
- 电子商务产品列表
- 帮助和文档

你应该问自己：“我可以在用户的请求**之前**预渲染这个页面吗？”，如果答案是肯定的，那么你应该选择静态生成。

另一方面，如果你**不应该**在用户请求之前预先渲染一个页面，那么静态生成就不是的好主意。也许你的页面显示的是经常更新的数据，而且页面内容在每次请求时都会改变。

在这样的情况下，你可以采取以下措施之一：

- 使用静态生成与**客户端渲染：**你可以跳过预渲染页面的某些部分，然后使用客户端的 JavaScript 来补充它们。查看[数据获取文档](/docs/basic-features/data-fetching/client-side)以了解更多。
- 使用**服务器端渲染：** Next.js 在每次请求时都会预渲染一个页面。这将会比较慢，因为页面不能被 CDN 缓存，但预渲染的页面将始终是最新的。我们将在下面讨论这种方法。

## 服务端渲染

> 也称为 “SSR” 或 “动态渲染”。

如果一个页面使用**服务器端渲染**，页面的  HTML 是在**每个请求**中生成的。

要对一个页面使用服务端渲染，你需要 `导出（export）` 一个名为 `getServerSideProps` 的 `异步（async）` 函数。这个函数将被服务器在每个请求中调用。

例如，假设你的页面需要预先渲染经常更新的数据（从外部 API 获取的）。你可以编写 `getServerSideProps` 来获取这些数据并将其传递给 `Page`，如下所示：

```jsx
function Page({ data }) {
  // Render data...
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export default Page
```

正如你所看到的，`getServerSideProps` 与 `getStaticProps` 相似，但不同的是 `getServerSideProps` 是在每次请求时运行，而不是在构建时运行。

查看[数据获取文档](/docs/basic-features/data-fetching/get-server-side-props)了解更多有关 `getServerSideProps` 的工作。

## 摘要总结

我们已经讨论了Next.js的两种形式的预渲染：

- **静态生成（推荐）：**HTML是在**构建时**生成的，并将在每次请求中重复使用。要使一个页面使用静态生成，要么导出页面组件，要么导出 `getStaticProps`（如果需要的话，还有 `getStaticPaths` ）。这对于那些可以在用户请求前预渲染的页面来说是非常好的。你也可以在客户端渲染中使用它来引入额外的数据。
- **服务器端渲染：**HTML是在**每个请求**中生成的。要使一个页面使用服务器端渲染，请导出 `getServerSideProps`。因为服务器端渲染的性能比静态生成要慢，所以只有在**绝对必要**时才使用。

## 了解更多

我们建议你接下来阅读以下章节：

- [数据获取：了解更多关于 Next.js 中数据获取的信息 ](/docs/basic-features/data-fetching/overview)
- [ 预览模式：了解更多关于 Next.js 的预览模式 ](/docs/advanced-features/preview-mode)
- [ 路由：了解更多关于 Next.js 中的路由的信息 ](/docs/routing/introduction)
- [ TypeScript：将 TypeScript 添加到你的页面 ](/docs/basic-features/typescript#pages)
