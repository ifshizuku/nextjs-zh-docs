import "../styles/globals.css"
import "nextra-theme-docs/style.css"

import Head from "next/head"
import React from "react"
import useSystemTheme from "use-system-theme"

export default function Nextra({ Component, pageProps }) {
    const systemTheme = useSystemTheme()
    const getLayout = Component.getLayout || ((page) => page)
    return getLayout(
        <>
            <Head>
                <>
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="256x256"
                        href={`/favicons/nextjs-icon-${systemTheme}.png`}
                    />
                    <link
                        rel="shortcut icon"
                        href={`/favicons/nextjs-icon-${systemTheme}.png`}
                    />
                </>
            </Head>
            <Component {...pageProps} />
        </>
    )
}
