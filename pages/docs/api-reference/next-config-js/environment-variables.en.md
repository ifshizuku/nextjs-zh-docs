# Environment Variables

> Since the release of [Next.js 9.4](https://nextjs.org/blog/next-9-4) we now have a more intuitive and ergonomic experience for [adding environment variables](/docs/basic-features/environment-variables). Give it a try!

<details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-env-from-next-config-js">With env</a></li>
  </ul>
</details>

To add environment variables to the JavaScript bundle, open `next.config.js` and add the `env` config:

```js
module.exports = {
  env: {
    customKey: 'my-value',
  },
}
```

Now you can access `process.env.customKey` in your code. For example:

```jsx
function Page() {
  return <h1>The value of customKey is: {process.env.customKey}</h1>
}

export default Page
```

Next.js will replace `process.env.customKey` with `'my-value'` at build time. Trying to destructure `process.env` variables won't work due to the nature of webpack [DefinePlugin](https://webpack.js.org/plugins/define-plugin/).

For example, the following line:

```jsx
return <h1>The value of customKey is: {process.env.customKey}</h1>
```

Will end up being:

```jsx
return <h1>The value of customKey is: {'my-value'}</h1>
```

## Related

- [Introduction to next.config.js: Learn more about the configuration file used by Next.js.](/docs/api-reference/next-config-js/introduction)
- [Environment Variables: Learn more about the new support for environment variables.](/docs/basic-features/environment-variables)
