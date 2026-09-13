import Reveal from "./Reveal"
import { profile } from "./content"

export default function Contact() {
    return (
        <section className="contact" id="contact">
            <div className="contact__inner shell">
                <Reveal>
                    <div className="section__head" style={{ marginBottom: 0 }}>
                        <span className="section__num">05</span>
                        <h2 className="section__title">Contact</h2>
                    </div>
                </Reveal>

                <div>
                    <Reveal>
                        <p className="contact__lede">
                            I&rsquo;m looking for Summer 2026 internships in AI and software
                            engineering. If you&rsquo;re building something that has to be
                            right, I&rsquo;d like to hear about it.
                        </p>
                    </Reveal>

                    <Reveal delay={0.08}>
                        <a className="contact__mail" href={`mailto:${profile.email}`}>
                            {profile.email}
                        </a>
                    </Reveal>
                </div>

                <Reveal delay={0.14}>
                    <div className="contact__links">
                        <a
                            className="is-github"
                            href={profile.github}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub
                        </a>
                        <a
                            className="is-linkedin"
                            href={profile.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            LinkedIn
                        </a>
                        <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                            Résumé
                        </a>
                        <a href={`mailto:${profile.altEmail}`}>Personal email</a>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}
