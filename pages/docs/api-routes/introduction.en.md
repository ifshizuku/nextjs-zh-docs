# API Routes

<details open>
  <summary><b>Examples</b></summary>
  <ul>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/api-routes">Basic API Routes</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware">API Routes with middleware</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/api-routes-graphql">API Routes with GraphQL</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/api-routes-rest">API Routes with REST</a></li>
<li><a href="https://github.com/vercel/next.js/tree/canary/examples/api-routes-cors">API Routes with CORS</a></li>
  </ul>
</details>

API routes provide a solution to build your **API** with Next.js.

Any file inside the folder `pages/api` is mapped to `/api/*` and will be treated as an API endpoint instead of a `page`. They are server-side only bundles and won't increase your client-side bundle size.

For example, the following API route `pages/api/user.js` returns a `json` response with a status code of `200`:

```js
export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
```

> **Note**: API Routes will be affected by [`pageExtensions` configuration](/docs/api-reference/next-config-js/custom-page-extensions) in `next.config.js`.

For an API route to work, you need to export a function as default (a.k.a **request handler**), which then receives the following parameters:

- `req`: An instance of [http.IncomingMessage](https://nodejs.org/api/http.html#class-httpincomingmessage), plus some [pre-built middlewares](/docs/api-routes/api-middlewares)
- `res`: An instance of [http.ServerResponse](https://nodejs.org/api/http.html#class-httpserverresponse), plus some [helper functions](/docs/api-routes/response-helpers)

To handle different HTTP methods in an API route, you can use `req.method` in your request handler, like so:

```js
export default function handler(req, res) {
  if (req.method === 'POST') {
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}
```

To fetch API endpoints, take a look into any of the examples at the start of this section.

## Use Cases

For new projects, you can build your entire API with API Routes. If you have an existing API, you do not need to forward calls to the API through an API Route. Some other use cases for API Routes are:

- Masking the URL of an external service (e.g. `/api/secret` instead of `https://company.com/secret-url`)
- Using [Environment Variables](/docs/basic-features/environment-variables) on the server to securely access external services.

## Caveats

- API Routes [do not specify CORS headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), meaning they are **same-origin only** by default. You can customize such behavior by wrapping the request handler with the [CORS middleware](/docs/api-routes/api-middlewares#connectexpress-middleware-support).
- API Routes can't be used with [`next export`](/docs/advanced-features/static-html-export)

## Related

For more information on what to do next, we recommend the following sections:

- [API Middlewares: Learn about the built-in middlewares for the request.](/docs/api-routes/api-middlewares)
- [Response Helpers: Learn about the built-in methods for the response.](/docs/api-routes/response-helpers)
- [TypeScript: Add TypeScript to your API Routes.](/docs/basic-features/typescript#api-routes)
