import EntryList from "./EntryList"
import Reveal from "./Reveal"
import SectionHead from "./SectionHead"
import { certifications, education } from "./content"

export default function Education() {
    return (
        <section className="section shell" id="education">
            <SectionHead num="04" title="Education" />
            <EntryList entries={education} />

            <Reveal delay={0.1}>
                <div style={{ marginTop: "clamp(2rem, 5vw, 3.25rem)" }}>
                    <p className="mono" style={{ marginBottom: "1rem" }}>
                        Certifications
                    </p>
                    <ul className="work__tags">
                        {certifications.map((c) => (
                            <li key={c.name}>
                                <a
                                    href={c.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="tag-link"
                                >
                                    {c.name} — {c.issuer}
                                    <span aria-hidden="true"> ↗</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </Reveal>
        </section>
    )
}
