---
description: Next.js provides gzip compression to compress rendered content and static files, it only works with the server target. Learn more about it here.
---

# Compression

Next.js provides [**gzip**](https://tools.ietf.org/html/rfc6713#section-3) compression to compress rendered content and static files. In general you will want to enable compression on a HTTP proxy like [nginx](https://www.nginx.com/), to offload load from the `Node.js` process.

To disable **compression**, open `next.config.js` and disable the `compress` config:

```js
module.exports = {
  compress: false,
}
```

## Related

- [Introduction to next.config.js: Learn more about the configuration file used by Next.js.](/docs/api-reference/next-config-js/introduction)
