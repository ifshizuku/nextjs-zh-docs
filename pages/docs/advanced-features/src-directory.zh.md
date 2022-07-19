# `src` 目录

页面也可以添加到 `src/pages` 下，作为根 `pages` 目录的替代方法。

`src` 目录在许多应用程序中非常常见，Next.js 默认支持它。

## 注意事项

- 如果根目录中存在 `pages`，则将忽略 `src/pages`
- 像 `next.config.js` 和 `tsconfig.json` 这样的配置文件，以及环境变量，应该在根目录中，将它们移动到 `src` 将不起作用，[`public`](/docs/basic-features/static-file-serving) 目录也是如此

## 相关

关于下一步该做什么的更多信息，我们建议阅读以下章节：

- [Pages：详细了解在 Next.js 中什么是页面](/docs/basic-features/pages)
