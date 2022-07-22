# Environment Variables

> 自 [Next.js 9.4](https://nextjs.org/blog/next-9-4) 发布，我们现在对 [添加环境变量](/docs/basic-features/environment-variables) 有了更直观和符合人体工程学的体验。尝试一下！

<details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-env-from-next-config-js">With env</a></li>
  </ul>
</details>

要将环境变量添加到 JavaScript 捆绑包，打开 `next.config.js` 并添加 `env` 配置：

```js
module.exports = {
  env: {
    customKey: 'my-value',
  },
}
```

现在您可以在代码中访问 `process.env.customKey`。例如：

```jsx
function Page() {
  return <h1>The value of customKey is: {process.env.customKey}</h1>
}

export default Page
```

Next.js 将在构建时将 `process.env.customKey` 替换为 `'my-value'`。由于 Webpack [插件定义](https://webpack.js.org/plugins/define-plugin/) 的性质，尝试解构 `process.env` 变量将不起作用。

例如，如下行：

```jsx
return <h1>The value of customKey is: {process.env.customKey}</h1>
```

最终将是：

```jsx
return <h1>The value of customKey is: {'my-value'}</h1>
```

## 相关

- [**next.config.js 介绍** / 了解更多关于 Next.js 使用的配置文件](/docs/api-reference/next-config-js/introduction)
- [**环境变量** / 了解有关对环境变量的新支持的更多信息](/docs/basic-features/environment-variables)
