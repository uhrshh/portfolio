import type { MetadataRoute } from "next"
import { SITE } from "@/site.config"

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: SITE,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
    ]
}
