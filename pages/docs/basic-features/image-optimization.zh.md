# Image 组件和图像优化

<details open>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/image-component">Image Component</a></li>
  </ul>
</details>

Next.js 图像组件，[`next/image`](/docs/api-reference/next/image)，是HTML `<img>` 元素的扩展，为现代网络而优化。它包括各种内置的性能优化，以帮助你实现良好的 [Core Web Vitals](https://web.dev/vitals/)。这些分数是衡量你网站用户体验的重要标准，并被[计入谷歌的搜索排名](https://nextjs.org/learn/seo/web-performance/seo-impact)（百度其实不是很在意这个）。

图像组件中的一些优化措施包括：

- **改进性能** - 始终为每个设备提供正确大小的图像，使用现代图像格式
- **视觉稳定性** - 自动防止[累积布局偏移（CLS）](https://web.dev/cls/)
- **更快的页面加载** - 图像只在进入视口时加载，可选择模糊图片占位
- **资源的灵活性**  - 按需调整图像大小，甚至对存储在远程服务器上的图像也是如此

## 使用 `Image` 组件

要在你的应用程序中添加图片，导入 [`next/image`](/docs/api-reference/next/image) 组件：

```jsx
import Image from 'next/image'
```

另外，如果你需要一个更接近原生 `<img>` 元素的组件，你可以导入 [`next/future/image`](/docs/api-reference/next/future/image)：

```jsx
import Image from 'next/future/image'
```

现在，你可以为你的图片定义 `src`（不管是本地还是远程）。

### 本地图片

通过 `导入（import）` `.jpg`、`.png` 或 `.webp` 来使用本地图片：

```jsx
import profilePic from '../public/me.png'
```

不支持动态的 `await import()` 或 `require()`。`import` 必须是静态的，以便在构建时进行分析。

Next.js 将根据导入的文件自动确定你的图片的 `宽度（width）` 和 `高度（height）`。这些值是用来防止你的图像在加载时出现[累积布局偏移](https://web.dev/cls/)。

```js
import Image from 'next/image'
import profilePic from '../public/me.png'

function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src={profilePic}
        alt="Picture of the author"
        // width={500} automatically provided
        // height={500} automatically provided
        // blurDataURL="data:..." automatically provided
        // placeholder="blur" // Optional blur-up while loading
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}
```

### 远程图片

要使用远程图片，`src` 属性应该是一个 URL 字符串，可以是[相对](#loaders)或[绝对](/docs/api-reference/next/image#domains)的。因为 Next.js 在构建过程中无法访问远程文件，你需要手动提供 `宽度（width）`、`高度（height）` 和可选的 [`blurDataURL`](/docs/api-reference/next/image#blurdataurl) 属性：

```jsx
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src="/me.png"
        alt="Picture of the author"
        width={500}
        height={500}
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}
```

> 了解关于 `next/image` 中的[图像尺寸](#image-sizing)

### 域名

有时你可能想访问一个远程图像，但仍然使用内置的 Next.js 图像优化 API。要做到这一点，让 `loader` 处于默认设置，然后为图像的 `src` 输入一个绝对的URL。

为了保护你的应用程序免受恶意用户的侵害，你必须定义一个你打算允许远程访问的远程主机名列表。

> 了解更多[域名](/docs/api-reference/next/image#domains)配置

### 加载器

注意在[前面的例子](#remote-images)中，为一个远程图像提供一个部分 URL（`"/me.png"`）是可能的，因为 `next/image` 的[加载器](/docs/api-reference/next/image#loader)的架构。

加载器是一个为你的图像生成 URL 的函数。它在你提供的 `src` 上附加一个根域，并生成多个 URL 来请求不同尺寸的图像。这些 URL 被用于自动生成 [srcset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset)，这样你的网站的访问者就会得到适合他们视口大小的图片。

Next.js 应用程序的默认加载器使用内置的图像优化 API，它可以优化来自网络上任何地方的图像，然后直接从 Next.js 网络服务器提供这些图像。如果你想直接从 CDN 或图像服务器上提供你的图像，你可以使用其中一个[内置加载器](/docs/api-reference/next/image#built-in-loaders)或用几行 JavaScript 编写你自己的加载器。

加载器可以为每个图像定义，也可以在应用层面定义。

### 优先加载

你应该为每个页面的[最大内容绘画（LCP）元素](https://web.dev/lcp)的图像添加 `priority` 属性。这样做可以让 Next.js 优先加载这个图片（例如通过预加载标签或优先级提示），使 LCP 性能的有效提升。

LCP 元素通常是在页面视口中可见的最大的图像或文本块。当你运行 `next dev` 时，如果 LCP 元素是一个没有 `priority` 属性的 `<Image>`，你会看到一个控制台（console）警告（warning）。

一旦你确定了 LCP 图像，你可以像这样添加属性：

```jsx
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src="/me.png"
        alt="Picture of the author"
        width={500}
        height={500}
        priority
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}
```

更多有关优先加载的信息，请查看 [`next/image` 组件文档](/docs/api-reference/next/image#priority)。

## 图像尺寸

图片最常见的降低性能的原因之一是*布局转移（layout shift)*，即图片在加载时将页面上的其他元素推来推去。这个性能问题对用户来说很烦人，以至于它成为了一个重要的指标，叫做[累积布局偏移](https://web.dev/cls/)。避免基于图像的布局偏移的方法是[始终确定你的图像大小](https://web.dev/optimize-cls/#images-without-dimensions)，这可以让浏览器在图像加载之前为其精确地保留足够的空间。

因为 `next/image` 的设计是为了保证良好的性能，所以它的使用方式不可以导致布局偏移，而且**必须**以如下三种方式之一来确定大小：

1. 自动，使用[静态导入](#local-images)
2. 指定，包括一组 [`width`](/docs/api-reference/next/image#width) 和 [`height`](/docs/api-reference/next/image#height) 属性
3. 隐式，通过使用 [`layout="fill"`](/docs/api-reference/next/image#layout)，使图像扩展到填充其父元素

> ### 如果我不知道图像的尺寸？
> 
> 如果你在不知道图片尺寸的情况下从一个来源访问图片，有几件事你可以做：
> 
> **使用 `layout='fill'`**
> 
> `fill` 布局模式允许你的图像由其父元素决定大小。考虑使用 CSS 给图像的父元素在页面上留出空间，然后将 [`objectFit property`](/docs/api-reference/next/image#objectfit) 与 `fill`、`contain` 或 `cover` 一起使用，以及 [`objectPosition property`](/docs/api-reference/next/image#objectposition) 来定义图像应该如何占据这个空间。
> 
> **规范化你的图像**
> 
> 如果你从一个你自己控制的源头获取图像，考虑修改你的图像管道（pipeline），将图像规范化为一个特定的尺寸。
> 
> **修改你的 API 调用**
> 
> 如果你的应用程序使用 API 调用检索图像的 URL（如 CMS），你可能会修改 API 调用，使其与 URL 一起返回图像尺寸。

如果建议的方法都不能满足你的图片尺寸要求，`next/image` 组件被设计成可以在页面上与标准的 `<img>` 元素一起工作。

## 添加样式

> 注意：以下列出的很多样式问题会在 [`next/future/image`](/docs/api-reference/next/future/image) 中解决

为 Image 组件添加样式与为普通的 `<img>` 元素添加样式没有什么不同，但有一些准则需要记住：

**选择正确的布局模式**

图片组件有几种不同的[布局模式](/docs/api-reference/next/image#layout)，定义它在页面上的大小。如果你的图片样式没有达到你想要的效果，可以考虑尝试使用其他的布局模式。

**用 className 定位图片，而不是基于 DOM 结构**

对于大多数布局模式，`Image` 组件的 DOM 结构是由一个 `<img>` 标签被一个 `<span>` 包裹。对于某些模式，它也可能有一个同级别的 `<span>` 用于间隔。 这些额外的 `<span>` 元素对防止该组件布局偏移至关重要。

给内部 `<img>` 元素添加样式的建议方式是将 `Image` 组件的 `className` 的值设置为一个已经导入的 [CSS 模块](/docs/basic-features/built-in-css-support#adding-component-level-css)。`className` 的值将自动应用于底层的 `<img>` 元素。

或者，你可以导入一个[全局样式表](/docs/basic-features/built-in-css-support#adding-a-global-stylesheet)，并手动设置 `className` 属性为全局样式表中使用的相同名称。

你不能使用 [styled-jsx](/docs/basic-features/built-in-css-support#css-in-js)，因为它针对于当前组件的范围。

**当使用 `layout='fill'` 时，父元素必须有 `position: relative`**

这对于在该布局模式下正确渲染图像元素是必要的。

**当使用 `layout='responsive'` 时，父元素必须有 `display: block`**

这是 `<div>` 元素的默认值，但需要另外指定。

## 属性

[**查看 `next/image` 适用的所有属性**](/docs/api-reference/next/image)

### 样式添加的示例

关于图像组件与各种填充模式的使用示例，参见[图像组件示例应用](https://image-component.nextjs.gallery/)。

## 配置

`next/image` 组件和 Next.js 图像优化 API 可以在 [`next.config.js` 文件](/docs/api-reference/next-config-js/introduction)中进行配置。这些配置允许你[启用远程图像](/docs/api-reference/next/image#domains)、[定义自定义图像断点](/docs/api-reference/next/image#device-sizes)、[改变缓存行为](/docs/api-reference/next/image#caching-behavior)等。

[**阅读完整的配置文档以了解更多信息**](/docs/api-reference/next/image#configuration-options)

## 相关

关于下一步该做什么的更多信息，我们推荐以下章节：

- [**`next/image`** / 查看 `Image` 组件所有可用的属性](/docs/api-reference/next/image)
