---
description: Next.js reports TypeScript errors by default. Learn to opt-out of this behavior here.
---

# Ignoring TypeScript Errors

Next.js fails your **production build** (`next build`) when TypeScript errors are present in your project.

If you'd like Next.js to dangerously produce production code even when your application has errors, you can disable the built-in type checking step.

If disabled, be sure you are running type checks as part of your build or deploy process, otherwise this can be very dangerous.

Open `next.config.js` and enable the `ignoreBuildErrors` option in the `typescript` config:

```js
module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}
```

## Related

- [Introduction to next.config.js: Learn more about the configuration file used by Next.js.](/docs/api-reference/next-config-js/introduction)
- [TypeScript: Get started with TypeScript in Next.js.](/docs/basic-features/typescript)
