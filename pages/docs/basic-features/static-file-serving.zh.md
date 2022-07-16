# 静态文件服务

Next.js 可以提供根目录下名为 `public` 的文件夹下静态文件，如图片的服务。 `public` 中的文件可以被你的代码从根URL（`/`）引用。

例如，如果你在 `public/me.png` 中添加一个图片，下面的代码将访问该图片：

```jsx
import Image from 'next/image'

function Avatar() {
  return <Image src="/me.png" alt="me" width="64" height="64" />
}

export default Avatar
```

> 注意：`next/image` 需要 Next.js 10 或更高版本。

这个文件夹对 `robots.txt`、`favicon.ico`、Google Site Verification 和任何其他静态文件（包括 `.html` ）也是很有用的！

> **注意**：不要给 `public` 目录起任何其他名字。这个名字不能被改变，它是唯一用于提供静态资源的目录。

> **注意**：确保没有一个静态文件与 `pages/` 目录中的文件同名，因为这将导致一个错误。
> 
> 了解更多[公共文件与页面冲突](https://nextjs.org/docs/messages/conflicting-public-file-page)

> **注意**：只有[构建时](/docs/api-reference/cli#build)在 `public` 目录下的资源才能被 Next.js 提供。在运行时添加的文件将无法使用。我们建议使用第三方服务，如 [AWS S3](https://aws.amazon.com/s3/)（国内可以使用[阿里云 OSS](https://www.aliyun.com/product/oss)、[腾讯云 COS](https://cloud.tencent.com/product/cos) 等）进行持久化文件存储。
