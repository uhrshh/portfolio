import { nav, profile } from "./content"

export default function SiteHeader() {
    return (
        <div className="site-header">
            <a className="site-header__mark" href="#top">
                {profile.name}
            </a>

            <nav className="site-nav" aria-label="Sections">
                {nav.map((n, i) => (
                    <a
                        key={n.href}
                        href={n.href}
                        /* the middle links collapse first on narrow screens */
                        className={i > 0 && i < nav.length - 1 ? "site-nav__wide" : undefined}
                    >
                        {n.label}
                    </a>
                ))}
            </nav>
        </div>
    )
}
