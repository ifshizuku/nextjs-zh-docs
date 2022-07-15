---
description: Next.js will add the `x-powered-by` header by default. Learn to opt-out of it here.
---

# Disabling x-powered-by

By default Next.js will add the `x-powered-by` header. To opt-out of it, open `next.config.js` and disable the `poweredByHeader` config:

```js
module.exports = {
  poweredByHeader: false,
}
```

## Related

- [Introduction to next.config.js: Learn more about the configuration file used by Next.js.](/docs/api-reference/next-config-js/introduction)
