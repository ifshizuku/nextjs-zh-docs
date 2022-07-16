# Script 组件

<details>
  <summary><b>示例</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/script-component">Script Component</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-google-tag-manager">Google Tag Manager</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-google-analytics">Google Analytics</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-facebook-pixel">Facebook Pixel</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-clerk">Clerk</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-segment-analytics">Segment Analytics</a></li>
  </ul>
</details>

<details>
  <summary><b>版本记录</b></summary>

| 版本        | 更改               |
| --------- | ---------------- |
| `v11.0.0` | `next/script` 引入 |

</details>

Next.js 脚本（Script）组件，[`next/script`](/docs/api-reference/next/script)，是 HTML `<script>` 元素的一个扩展。它使开发者能够在其应用程序的任何地方，在 `next/head` 之外，设置第三方脚本的加载优先级，在提高加载性能的同时节省开发者的时间。

```jsx
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script src="https://www.google-analytics.com/analytics.js" />
    </>
  )
}
```

## 概览

我们经常使用第三方脚本（Script）将不同类型的功能引入其网站，如分析、广告、客户支持小部件等。然而，这可能会带来影响用户和开发者体验的问题：

- 一些第三方脚本对加载性能要求很高，可能会**拖累用户体验**，特别是如果它们是渲染阻断的，会**延迟**任何页面内容的加载
- 开发人员往往**难以决定**将第三方脚本放置在应用程序中的哪个位置，以确保**最佳的加载**

脚本组件使开发者更容易将第三方脚本放置在其应用程序的任何地方，同时照顾到其加载策略的优化。

## 用法

要在你的应用程序中添加一个第三方脚本，请导入 `next/script` 组件：

```jsx
import Script from 'next/script'
```

### 策略

使用 `next/script`，你可以通过 `strategy` 属性决定何时加载你的第三方脚本：

```jsx
<Script src="https://connect.facebook.net/en_US/sdk.js" strategy="lazyOnload" />
```

有三种不同的加载策略可供使用：

- `beforeInteractive`：在页面可交互之前加载
- `afterInteractive`：（**默认**）在页面可交互后立即加载
- `lazyOnload `：在空闲时间内加载
- `worker`：（实验性的）在一个 Web Worker 中加载

#### beforeInteractive

使用 `beforeInteractive` 策略加载的脚本会被注入到服务器的初始 HTML 中，并在自捆绑的 JavaScript 执行之前运行。这个策略应该用于任何需要在页面可交互之前获取和执行的关键脚本。这个策略只在 **`_document.js`** 内起作用，旨在加载整个网站需要的脚本（也就是说，这个脚本将会在应用程序的任何页面被服务端加载时加载）。

`beforeInteractive` 只能在 `_document.js` 内工作的原因是为了支持流（Streaming）和 Suspense 功能。在 `_document` 之外，不可能保证 `beforeInteractive` 脚本的时间或顺序。

```jsx
// In _document.js
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js"
          strategy="beforeInteractive"
        ></Script>
      </body>
    </Html>
  )
}
```

> **注意**：带有 `beforeInteractive` 的脚本总是被注入到 HTML 文档的  `head` 内，无论它被放在 `_document.js` 的什么位置。

采用这种策略应尽快加载的脚本的例子包括：

- 机器检测器
- Cookie 同意管理器

#### afterInteractive

使用 `afterInteractive` 策略的脚本将被注入客户端，并在 Next.js 为页面注水后运行。这个策略应该用于那些不需要尽快加载的脚本，可以在页面可交互后立即获取并执行。

```jsx
<Script
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', 'GTM-XXXXXX');
  `,
  }}
/>
```

在页面变得可交互后立即加载的良好的脚本例子包括：

- 标签管理器
- 分析

#### lazyOnload

使用 `lazyOnload` 策略的脚本在所有资源被获取后，在空闲时间内被延迟加载。这个策略应该用于后台或低优先级的脚本，这些脚本不需要在页面变得可交互之前或之后立即加载。

```jsx
<Script src="https://connect.facebook.net/en_US/sdk.js" strategy="lazyOnload" />
```

不需要立即加载，可以懒加载的脚本的例子包括：

- 聊天支持插件
- 社交媒体小工具

### 将脚本放在 Web Worker 中加载

> **注意：`worker` 策略还不稳定，可能会在你的应用程序中引起意外的问题，请慎重使用。**

使用 `worker` 策略的脚本被重定位并在具有 [Partytown](https://partytown.builder.io/) 的 Web Worker 中执行。这可以通过将主线程专用于你的应用程序代码的其余部分来提高你的网站的性能。

这个策略仍然是实验性的，只有在 `next.config.js` 中启用 `nextScriptWorkers` 标志时才能使用：

```js
module.exports = {
  experimental: {
    nextScriptWorkers: true,
  },
}
```

然后，运行 `next`（通常是 `npm run dev` 或 `yarn dev`），Next.js 将指导你安装所需的软件包，完成设置：

```bash
npm run dev

# You'll see instructions like these:
#
# Please install Partytown by running:
#
#         npm install @builder.io/partytown
#
# ...
```

一旦设置完成，`strategy="worker"` 定义将自动在你的应用程序中实例化 Partytown，并将脚本加载到一个 Web Worker。

```jsx
<Script src="https://example.com/analytics.js" strategy="worker" />
```

在 Web Worker 中加载第三方脚本时，需要权衡一些因素。请参阅 Partytown 的 [Trade-Offs](https://partytown.builder.io/trade-offs) 文档以了解更多信息。

#### 配置

尽管 `worker` 策略不需要任何额外的配置来工作，但 Partytown 支持使用配置对象来修改它的一些设置，包括启用 `debug` 模式及转发事件和触发器。

如果你想添加额外的配置选项，你可以在 [自定义 `_document.js`](/docs/advanced-features/custom-document) 中使用的 `<Head />` 组件中包含它：

```jsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          data-partytown-config
          dangerouslySetInnerHTML={{
            __html: `
              partytown = {
                lib: "/_next/static/~partytown/",
                debug: true
              };
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

为了修改 Partytown 的配置，必须满足以下条件：

1. 必须使用 `data-partytown-config` 属性，以覆盖 Next.js 使用的默认配置
2. 除非你决定将 Partytown 的库文件保存在一个单独的目录中，否则 `lib: "/_next/static/~partytown/"` 属性和值必须包含在配置对象中，以便让 Partytown 知道 Next.js 存储必要静态文件的位置

> **注意**：如果你使用[资源前缀](/docs/api-reference/next-config-js/cdn-support-with-asset-prefix)并想修改 Partytown 的默认配置，你必须把它作为 `lib` 路径的一部分。

查看 Partytown 的[配置选项](https://partytown.builder.io/configuration)，了解可以添加的其他属性的完整列表。

### 行内脚本（Script）

脚本组件也支持内联脚本，或者不是从外部文件加载的脚本。它们可以通过将 JavaScript 放在大括号内来编写：

```jsx
<Script id="show-banner" strategy="lazyOnload">
  {`document.getElementById('banner').classList.remove('hidden')`}
</Script>
```

或者通过使用 `dangerouslySetInnerHTML` 属性：

```jsx
<Script
  id="show-banner"
  dangerouslySetInnerHTML={{
    __html: `document.getElementById('banner').classList.remove('hidden')`,
  }}
/>
```

为了让 Next.js 跟踪和优化脚本，**内联脚本**需要 `id` 属性。

### 加载后执行代码（`onLoad`）

> **注意：`onLoad` 和 `onError` 不能与 `beforeInteractive` 加载策略一起使用。**

一些第三方脚本要求用户在脚本加载完毕后运行 JavaScript 代码，以便实例化内容或调用一个函数。如果你使用 `afterInteractive` 或 `lazyOnload` 作为加载策略来加载脚本，你可以使用 `onLoad` 属性在加载后执行代码：

```jsx
import { useState } from 'react'
import Script from 'next/script'

export default function Home() {
  const [stripe, setStripe] = useState(null)

  return (
    <>
      <Script
        id="stripe-js"
        src="https://js.stripe.com/v3/"
        onLoad={() => {
          setStripe({ stripe: window.Stripe('pk_test_12345') })
        }}
      />
    </>
  )
}
```

有时，当一个脚本加载失败时，捕获它是很有帮助的。这些错误可以通过 `onError` 属性来处理：

```jsx
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script
        id="will-fail"
        src="https://example.com/non-existant-script.js"
        onError={(e) => {
          console.error('Script failed to load', e)
        }}
      />
    </>
  )
}
```

### 额外的属性

有许多 DOM 属性可以分配给 `<script>` 元素，这些属性不被脚本组件使用，如 [`nonce`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) 或 [自定义数据属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*)。包括任何额外的属性将自动转发到最终的、优化的 `<script>` 元素，并输出到页面。

```jsx
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script
        src="https://www.google-analytics.com/analytics.js"
        id="analytics"
        nonce="XUENAJFW"
        data-test="analytics"
      />
    </>
  )
}
```
