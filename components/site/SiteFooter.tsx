import { profile } from "./content"

export default function SiteFooter() {
    const year = new Date().getFullYear()

    return (
        <footer className="shell">
            <div className="site-footer">
                <span className="mono">
                    © {year} {profile.name}
                </span>
                <a className="mono" href="#top">
                    Back to top ↑
                </a>
            </div>
        </footer>
    )
}
