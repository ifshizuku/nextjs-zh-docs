---
description: Add client and server runtime configuration to your Next.js app.
---

# Runtime Configuration

> Generally you'll want to use [build-time environment variables](/docs/basic-features/environment-variables) to provide your configuration. The reason for this is that runtime configuration adds rendering / initialization overhead and is incompatible with [Automatic Static Optimization](/docs/advanced-features/automatic-static-optimization).

To add runtime configuration to your app open `next.config.js` and add the `publicRuntimeConfig` and `serverRuntimeConfig` configs:

```js
module.exports = {
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET, // Pass through env variables
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
  },
}
```

Place any server-only runtime config under `serverRuntimeConfig`.

Anything accessible to both client and server-side code should be under `publicRuntimeConfig`.

> A page that relies on `publicRuntimeConfig` **must** use `getInitialProps` or `getServerSideProps` or your application must have a [Custom App](/docs/advanced-features/custom-app) with `getInitialProps` to opt-out of [Automatic Static Optimization](/docs/advanced-features/automatic-static-optimization). Runtime configuration won't be available to any page (or component in a page) without being server-side rendered.

To get access to the runtime configs in your app use `next/config`, like so:

```jsx
import getConfig from 'next/config'
import Image from 'next/image'

// Only holds serverRuntimeConfig and publicRuntimeConfig
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
// Will only be available on the server-side
console.log(serverRuntimeConfig.mySecret)
// Will be available on both server-side and client-side
console.log(publicRuntimeConfig.staticFolder)

function MyImage() {
  return (
    <div>
      <Image
        src={`${publicRuntimeConfig.staticFolder}/logo.png`}
        alt="logo"
        layout="fill"
      />
    </div>
  )
}

export default MyImage
```

## Related

- [Introduction to next.config.js: Learn more about the configuration file used by Next.js.](/docs/api-reference/next-config-js/introduction)
- [Environment Variables: Access environment variables in your Next.js application at build time.](/docs/api-reference/next-config-js/environment-variables)
