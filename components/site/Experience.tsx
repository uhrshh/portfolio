import EntryList from "./EntryList"
import Marquee from "./Marquee"
import SectionHead from "./SectionHead"
import { experience, skills } from "./content"

export default function Experience() {
    return (
        <>
            <section className="section shell" id="experience">
                <SectionHead num="03" title="Experience" />
                <EntryList entries={experience} />
            </section>

            <Marquee items={skills} />
        </>
    )
}
