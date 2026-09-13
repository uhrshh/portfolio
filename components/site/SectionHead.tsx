import Reveal from "./Reveal"

export default function SectionHead({ num, title }: { num: string; title: string }) {
    return (
        <Reveal>
            <div className="section__head">
                <span className="section__num">{num}</span>
                <h2 className="section__title">{title}</h2>
            </div>
        </Reveal>
    )
}
