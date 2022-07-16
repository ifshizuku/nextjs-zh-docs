# 字体优化

自 **10.2** 以后，Next.js 带有内建的 Web 字体优化。

默认情况下，Next.js 会在构建时自动内联字体 CSS，省去了获取字体声明的额外往返过程。这改进了[首次内容绘制（FCP）](https://web.dev/fcp/)和[最大内容的绘制（LCP）](https://web.dev/lcp/)的性能。例如：

```js
// Before
<link
  href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
  rel="stylesheet"
/>

// After
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<style data-href="https://fonts.googleapis.com/css2?family=Inter&display=optional">
  @font-face{font-family:'Inter';font-style:normal...
</style>
```

## 用法

要在你的 Next.js 应用程序中添加 Web 字体，向 [自定义 `Document`](/docs/advanced-features/custom-document) 中添加需要的字体：

```js
// pages/_document.js

import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
```

请注意，我们不建议用 `next/head` 来添加字体，因为这只适用于特定页面的字体，不会在流架构下工作。

自动网络字体优化目前支持谷歌字体和 Typekit，对其他字体供应商的支持即将到来。我们还计划增加对[加载策略](https://github.com/vercel/next.js/issues/21555)和 `font-display` 值的控制。

查看[谷歌字体显示](https://nextjs.org/docs/messages/google-font-display)了解更多。

> **注意**：字体优化目前不支持自托管的字体

## 关闭优化

如果你不希望Next.js优化你的字体，你可以选择关闭：

```js
// next.config.js

module.exports = {
  optimizeFonts: false,
}
```

## 相关

关于下一步该做什么的更多信息，我们推荐以下章节：

- [**自定义 `Document`** / 了解如何增强你的应用程序的 `html` 和 `body` 标签。 ](/docs/advanced-features/custom-document)
