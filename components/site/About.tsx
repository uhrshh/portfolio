"use client"

import GlobeStudy from "../GlobeStudy"
import LazyMount from "./LazyMount"
import Reveal from "./Reveal"
import RichText from "./RichText"
import SectionHead from "./SectionHead"
import { about } from "./content"
import { themeColors, useTheme } from "./ThemeProvider"

export default function About() {
    const { theme } = useTheme()
    const c = themeColors(theme)

    return (
        <section className="section shell" id="about">
            <SectionHead num="01" title="About" />

            <div className="about__layout">
                <div className="about__body">
                    {about.map((para, i) => (
                        <Reveal key={i} delay={i * 0.06}>
                            <p>
                                <RichText text={para} />
                            </p>
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={0.12}>
                    <div className="about__globe">
                        <LazyMount>
                            <GlobeStudy
                                background="transparent"
                                baseColor={c.globeInk}
                                phrase="arsh"
                                /* India and the contiguous USA are painted in
                                   their flag colours; the white bands fall
                                   through to baseColor so they stay legible
                                   in both themes */
                                flags
                                /* Denser than the default so the tricolour and
                                   the US bands have enough dots to read: at
                                   115 India got only 11 coloured dots, at 170
                                   it gets ~160 (see components/flagTint.test.ts
                                   and the density sweep in the README). */
                                density={170}
                                glyphSize={44}
                                speed={100}
                                hover={100}
                                globe={{ radius: 104, drift: 190, letters: 55 }}
                                /* zoom:0 matters — it's the flag that stops the
                                   component calling preventDefault on wheel
                                   events, which would otherwise trap page
                                   scrolling whenever the cursor is over the globe. */
                                pointer={{ zoom: 0, light: 120, pins: 7 }}
                                style={{
                                    minWidth: 0,
                                    minHeight: 0,
                                    width: "100%",
                                    height: "100%",
                                    background: "transparent",
                                }}
                            />
                        </LazyMount>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}
