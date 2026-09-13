/*
 * Canonical site URL — drives the <link rel="canonical">, social-card
 * metadata, robots.txt and sitemap.xml.
 *
 * Set NEXT_PUBLIC_SITE_URL to your domain in Vercel
 * (Settings → Environment Variables), e.g. https://arsh.dev — no trailing
 * slash. Without it, Vercel's own production URL is used, so preview
 * deployments and the very first deploy still work unattended.
 */
export const SITE =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000")
