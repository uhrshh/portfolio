import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import ThemeProvider from "@/components/site/ThemeProvider"
import { SITE } from "@/site.config"
import "./globals.css"

export const metadata: Metadata = {
    metadataBase: new URL(SITE),
    // metadataBase alone does not emit <link rel="canonical">
    alternates: { canonical: "/" },
    title: "Arsh — Computer Science @ UMass Amherst",
    description:
        "Arsh is a Computer Science student at UMass Amherst building AI systems that cite their sources — retrieval pipelines, computer vision and full-stack software.",
    keywords: [
        "Arsh", "UMass Amherst", "Computer Science", "AI Engineer",
        "RAG", "Retrieval-Augmented Generation", "Machine Learning", "Software Engineer",
    ],
    authors: [{ name: "Arsh" }],
    openGraph: {
        title: "Arsh — Computer Science @ UMass Amherst",
        description:
            "Building AI systems that cite their sources. Retrieval pipelines, computer vision and full-stack software.",
        url: SITE,
        siteName: "Arsh",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Arsh — Computer Science @ UMass Amherst",
        description: "Building AI systems that cite their sources.",
    },
    robots: { index: true, follow: true },
}

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: dark)", color: "#08090A" },
        { media: "(prefers-color-scheme: light)", color: "#F4F4F1" },
    ],
}

/**
 * Runs before first paint so the page never flashes the wrong palette.
 * A stored choice wins; otherwise follow the OS.
 */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("arsh-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        /* the pre-paint script below sets data-theme/color-scheme on this
           element before React hydrates, which is exactly the mismatch this
           suppression is for */
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* Loaded via <link> rather than next/font so an offline or
                    firewalled build still succeeds and simply falls back. */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&family=JetBrains+Mono:wght@400;500&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    )
}
