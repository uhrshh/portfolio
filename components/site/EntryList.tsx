import Reveal from "./Reveal"
import type { Entry } from "./content"

export default function EntryList({ entries }: { entries: Entry[] }) {
    return (
        <div>
            {entries.map((e, i) => (
                <Reveal key={e.title + e.org} delay={i * 0.08}>
                    <article className="entry">
                        <h3 className="entry__title">
                            {e.title}
                            <span className="entry__org">
                                {" — "}
                                {e.url ? (
                                    <a href={e.url} target="_blank" rel="noopener noreferrer">
                                        {e.org}
                                        <span className="entry__ext" aria-hidden="true">
                                            ↗
                                        </span>
                                    </a>
                                ) : (
                                    e.org
                                )}
                            </span>
                        </h3>

                        <div className="entry__when mono">
                            <span>
                                {e.start} — {e.end}
                            </span>
                            <span>{e.place}</span>
                        </div>

                        <ul className="entry__points">
                            {e.points.map((p, j) => (
                                <li key={j}>{p}</li>
                            ))}
                        </ul>
                    </article>
                </Reveal>
            ))}
        </div>
    )
}
