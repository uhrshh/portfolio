import Reveal from "./Reveal"
import SectionHead from "./SectionHead"
import { work } from "./content"

export default function Work() {
    return (
        <section className="section shell" id="work">
            <SectionHead num="03" title="Selected Work" />

            <div className="work">
                {work.map((p, i) => (
                    <Reveal key={p.name} delay={i * 0.08}>
                        <article className="work__item">
                            <span className="work__index">
                                {String(i + 1).padStart(2, "0")}
                            </span>

                            <div className="work__headline">
                                <h3 className="work__name">{p.name}</h3>
                                <p className="work__kicker">{p.kicker}</p>
                                <p className="work__kicker mono" style={{ marginTop: "0.6rem" }}>
                                    {p.year}
                                </p>
                            </div>

                            <div className="work__body">
                                <p className="work__desc">{p.desc}</p>

                                <dl className="work__stat">
                                    {p.stats.map((s) => (
                                        <div key={s.label}>
                                            <dt>{s.label}</dt>
                                            <dd>{s.value}</dd>
                                        </div>
                                    ))}
                                </dl>

                                <ul className="work__tags">
                                    {p.tags.map((t) => (
                                        <li key={t}>{t}</li>
                                    ))}
                                </ul>

                                {p.links && p.links.length > 0 && (
                                    <div className="work__links">
                                        {p.links.map((l) => (
                                            <a
                                                key={l.href}
                                                href={l.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {l.label}
                                                <span aria-hidden="true"> ↗</span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </article>
                    </Reveal>
                ))}
            </div>
        </section>
    )
}
