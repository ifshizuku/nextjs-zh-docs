# ESLint

从 **11.0.0** 版本开始，Next.js 提供了开箱即用的集成 [ESLint](https://eslint.org/) 体验。将 `next lint` 作为一个脚本添加到 `package.json` 中：

```json
"scripts": {
  "lint": "next lint"
}
```

然后运行 `npm run lint` 或 `yarn lint` 或 `pnpm lint`：

```bash
yarn lint
```

如果你还没有在你的应用程序中配置 ESLint，你将被引导完成安装和配置的过程：

```bash
yarn lint

# You'll see a prompt like this:
#
# ? How would you like to configure ESLint?
#
# ❯   Base configuration + Core Web Vitals rule-set (recommended)
#     Base configuration
#     None
```

有以下三个选项可供选择：

- **严格（Strict）**：包括 Next.js 的基本 ESLint 配置，以及更严格的 [Core Web Vitals 规则集](/docs/basic-features/eslint#core-web-vitals)。这是为首次设置 ESLint 的开发者推荐的配置。

```json
{
  "extends": "next/core-web-vitals"
}
```

- **基本（Base）**：包含 Next.js 基本的 ESLint 配置。

```json
{
  "extends": "next"
}
```

- **无（None）**：不包括任何 ESLint 配置，只有当你打算设置你自己的自定义 ESLint 配置时才选择这个选项。

如果选择了这两个配置选项中的任何一个，Next.js 将自动安装 `eslint` 和 `eslint-config-next` 作为你的应用程序的开发依赖（devDependencies），并在你的项目根部创建一个 `.eslintrc.json` 文件包含你选择的配置。

现在你可以在每次要运行 ESLint 的时候运行  来捕获错误。一旦 ESLint 被设置好，它也会在每次构建时自动运行（`next build`）。错误（Error）会导致构建失败，而警告（Warning）则不会。

> 如果你不希望 ESLint 在 `next lint` 时运行，请参考 [忽略 ESLint](/docs/api-reference/next-config-js/ignoring-eslint) 文档。

我们建议在开发过程中使用适当的[集成](https://eslint.org/docs/user-guide/integrations#editors)，以此直接在你的代码编辑器中查看警告和错误。

## ESLint 配置

默认配置（`eslint-config-next`）包括了你在 Next.js 中获得最佳开箱即用的提示体验所需的一切。如果你的应用程序中没有配置 ESLint，我们建议使用 `next lint` 来设置 ESLint 并完成配置。

> 如果你想把 `eslint-config-next` 和其他 ESLint 配置一起使用，请参考[附加配置](/docs/basic-features/eslint#additional-configurations)部分，了解如何在不引起任何冲突的情况下做到。

以下 ESLint 插件的推荐规则集（recommended）都在 `eslint-config-next` 中使用：

- [`eslint-plugin-react`](https://www.npmjs.com/package/eslint-plugin-react)
- [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [`eslint-plugin-next`](https://www.npmjs.com/package/@next/eslint-plugin-next)

这将优先于 `next.config.js` 的配置。

## ESLint 插件

Next.js 提供了一个 ESLint 插件，[`eslint-plugin-next`]()，已经捆绑在基本配置（Base）中，可以捕获 Next.js 应用程序中的常见问题。整套规则如下：

- ✔：已在推荐的配置（recommended）中启用

|     | 规则                                                                                                                       | 描述                                                                       |
| :-: | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| ✔️  | [@next/next/google-font-display](/docs/messages/google-font-display)                                                     | 用谷歌字体强制执行字体显示行为                                                          |
| ✔️  | [@next/next/google-font-preconnect](/docs/messages/google-font-preconnect)                                               | 确保 `preconnect` 被用于谷歌字体                                                  |
| ✔️  | [@next/next/inline-script-id](/docs/messages/inline-script-id)                                                           | 在有内联内容的 `next/script` 组件上强制包含 `id` 属性                                    |
| ✔️  | [@next/next/next-script-for-ga](/docs/messages/next-script-for-ga)                                                       | 当使用谷歌分析（GA）的内联脚本时，首选 `next/script` 组件                                    |
| ✔️  | [@next/next/no-assign-module-variable](/docs/messages/no-assign-module-variable)                                         | 防止向 `module` 变量赋值                                                        |
| ✔️  | [@next/next/no-before-interactive-script-outside-document](/docs/messages/no-before-interactive-script-outside-document) | 防止在 `pages/_document.js` 之外使用 `next/script` 的 `beforeInteractive` 策略     |
| ✔️  | [@next/next/no-css-tags](/docs/messages/no-css-tags)                                                                     | 防止手动加入的样式表标签                                                             |
| ✔️  | [@next/next/no-document-import-in-page](/docs/messages/no-document-import-in-page)                                       | 防止在 `pages/_document.js` 之外导入 `next/document`                            |
| ✔️  | [@next/next/no-duplicate-head](/docs/messages/no-duplicate-head)                                                         | 防止在 `pages/_document.js` 中重复使用 `<Head>`                                  |
| ✔️  | [@next/next/no-head-element](/docs/messages/no-head-element)                                                             | 防止使用 `<head>` 元素                                                         |
| ✔️  | [@next/next/no-head-import-in-document](/docs/messages/no-head-import-in-document)                                       | 防止在 `pages/_document.js` 中使用 `next/head`                                 |
| ✔️  | [@next/next/no-html-link-for-pages](/docs/messages/no-html-link-for-pages)                                               | 防止使用 `<a>` 元素导航到 Next.js 内部页面                                            |
| ✔️  | [@next/next/no-img-element](/docs/messages/no-img-element)                                                               | 防止使用 `<img>` 元素导致布局偏移                                                    |
| ✔️  | [@next/next/no-page-custom-font](/docs/messages/no-page-custom-font)                                                     | 防止只针对页面的自定义字体                                                            |
| ✔️  | [@next/next/no-script-component-in-head](/docs/messages/no-script-component-in-head)                                     | 防止在 `next/head` 组件中使用 `next/script`                                      |
| ✔️  | [@next/next/no-styled-jsx-in-document](/docs/messages/no-styled-jsx-in-document)                                         | 防止在 `pages/_document.js` 中使用 `styled-jsx`                                |
| ✔️  | [@next/next/no-sync-scripts](/docs/messages/no-sync-scripts)                                                             | 防止同步脚本（script）                                                           |
| ✔️  | [@next/next/no-title-in-document-head](/docs/messages/no-title-in-document-head)                                         | 防止在 `next/document` 中使用 `<title>` 和 `Head` 组件                            |
| ✔️  | @next/next/no-typos                                                                                                      | 防止 [Next.js 数据获取函数](/docs/basic-features/data-fetching/overview) 中的常见错别字 |
| ✔️  | [@next/next/no-unwanted-polyfillio](/docs/messages/no-unwanted-polyfillio)                                               | 防止 Polyfill.io 重复导入 polyfills                                            |

如果你已经在你的应用程序中配置了 ESLint，我们建议直接从这个插件扩展，而不是引入 `eslint-config-next`，除非满足几个条件。请参考[推荐的插件规则集](/docs/basic-features/eslint#recommended-plugin-ruleset)以了解更多。

### 自定义设置

#### `rootDir`

如果你在一个项目中使用 `eslint-plugin-next`，而 Next.js 并没有安装在你的根目录中（比如 monorepo），你可以用 `.eslintrc` 中的 `settings` 属性告诉 `eslint-plugin-next` 在哪里可以找到你的 Next.js 程序：

```json
{
  "extends": "next",
  "settings": {
    "next": {
      "rootDir": "packages/my-app/"
    }
  }
}
```

`rootDir` 可以是一个路径（相对或绝对），一个 glob（即`"packages/"`），或一个路径和（或）glob 的列表。

## 自定义目录和文件的提示

默认情况下，Next.js会对 `pages/`、`components/` 和 `lib/` 目录下的所有文件运行 ESLint。然而，你可以使用 `next.config.js` 中的 `eslint` 配置中的 `dirs` 选项来指定哪些目录用于生产构建：

```js
module.exports = {
  eslint: {
    dirs: ['pages', 'utils'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
}
```

同样，`--dir` 和 `--file` 标志可以用于 `next lint`，以对特定的目录和文件进行检测。

```bash
next lint --dir pages --dir utils --file bar.js
```

## 缓存

为了提高性能，ESLint 处理的文件信息默认被缓存，存储在 `.next/cache` 或你定义的[构建目录](/docs/api-reference/next-config-js/setting-a-custom-build-directory)中。如果你引入任何 ESLint 规则，而这些规则依赖不止一个源文件的内容，并且需要禁用缓存，请在 `next lint` 中使用 `--no-cache` 标志。

```bash
next lint --no-cache
```

## 禁用规则

如果你想修改或禁用任何由支持的插件（`react`、`react-hooks` 和 `next`）提供的规则，你可以直接使用 `.eslintrc` 中的 `rules` 属性修改它们：

```json
{
  "extends": "next",
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off"
  }
}
```

### 网络核心指标（Core Web Vitals）

当第一次运行 `next lint` 并选择**strict**选项时，`next/core-web-vitals ` 规则集将被启用。

```json
{
  "extends": "next/core-web-vitals"
}
```

`next/core-web-vitals` 调整了一些本来在 `eslint-plugin-next` 默认为警告（Warning），但影响到 [Core Web Vitals](https://web.dev/vitals/) 的规则为报错（Error）。

> 对于用 [Create Next App]() 创建的新应用程序，`next/core-web-vitals` 将被自动引入。

## 和其他工具一起使用

### Prettier

ESLint也包含代码格式化规则，这可能与你现有的 [Prettier](https://prettier.io/) 配置相冲突。我们建议在你的 ESLint 配置中引入 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) 以使 ESLint 和 Prettier 一起工作。

首先，安装需要的依赖：

```bash
npm install --save-dev eslint-config-prettier
# or
yarn add --dev eslint-config-prettier
```

接着，在你的 ESLint 配置中添加 `prettier`：

```json
{
  "extends": ["next", "prettier"]
}
```

### lint-staged

如果你想同时使用 `next lint` 并借助 [lint-staged]() 来运行 git 暂存区文件的 `linter`，你必须在项目根部的 `.lintstagedrc.js` 文件中添加以下内容，以指定使用 `--file` 标志。

```js
const path = require('path')

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
```

## 从现有的配置迁移

### 建议的规则集

如果你已经在你的应用程序中配置了ESLint，并且满足以下任何条件：

- 你已经安装了以下一个或多个插件（单独安装或通过不同的配置，如`airbnb`或`react-app`）：
  - `react`
  - `react-hooks`
  - `jsx-a11y`
  - `import`
- 你定义了特定与 Next.js 中 Babel 配置不同的 `parserOptions`（不建议这样做，除非你已经[自定义 Babel 配置](/docs/advanced-features/customizing-babel-config)）
- 你已经安装了 `eslint-plugin-import`，并定义了 Node.js 和（或）TypeScript 的[解析器](https://github.com/benmosher/eslint-plugin-import#resolvers)来处理导入

那么我们建议，如果你喜欢这些属性在 [`eslint-config-next`]() 中的配置方式，就删除这些设置，或者直接从 Next.js ESLint 插件中扩展。**（本句有歧义，欢迎提供翻译建议）**

```js
module.exports = {
  extends: [
    //...
    'plugin:@next/next/recommended',
  ],
}
```

插件可以正常安装在你的项目中，而不需要运行 `next lint`：

```bash
npm install --save-dev @next/eslint-plugin-next
# or
yarn add --dev @next/eslint-plugin-next
```

这消除了在多个配置中导入相同的插件或分析器而可能出现的冲突或错误的风险。

### 其他配置

如果你已经使用了一个单独的 ESLint 配置，并且想引入 `eslint-config-next`，请确保它在其他配置之后（最后）引入。例如：

```
{
  "extends": ["eslint:recommended", "next"]
}
```

`next` 配置已经设置了 `parser`、`plugins` 和 `settings` 属性的默认值。没有必要手动重新声明这些属性，除非你需要一个不同的配置来满足你的使用情况。如果你引入任何其他可共享的配置，**你将需要确保这些属性不被覆盖或修改**。否则，我们建议删除任何与 `next` 配置共享行为的配置，或如上所述直接从 Next.js ESLint 插件中扩展。
