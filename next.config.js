// next.config.js
const withNextra = require("nextra")({
    theme: "nextra-theme-docs",
    themeConfig: "./theme.config.js",
    // optional: add `unstable_staticImage: true` to enable Nextra's auto image import
})
module.exports = withNextra({
    i18n: {
        locales: ["zh", "en"],
        defaultLocale: "zh",
    },
    redirects: () => {
        return [
            {
                source: "/docs",
                destination: "/docs/getting-started",
                statusCode: 301,
            },
        ]
    },
})
