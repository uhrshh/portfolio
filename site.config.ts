/*
 * Canonical site URL — drives <link rel="canonical">, the social-card
 * metadata, robots.txt and sitemap.xml.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL  — set this once you attach a custom domain
 *      (Vercel → Settings → Environment Variables), e.g. https://arsh.dev
 *      with no trailing slash.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — your stable *.vercel.app domain, set
 *      automatically, so the first deploy is correct with no configuration.
 *   3. VERCEL_URL — the per-deployment URL, so preview builds resolve too.
 *   4. localhost, for `npm run dev`.
 *
 * Only ever read on the server (layout, robots, sitemap), so the Vercel
 * variables are available and nothing leaks into the client bundle.
 */
const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL

export const SITE =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (fromVercel ? `https://${fromVercel}` : "http://localhost:3000")
