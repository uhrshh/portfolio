/**
 * Seamless infinite marquee.
 *
 * The track is rendered twice and each copy translates exactly one track
 * width, so the loop repeats with no visible seam. The second copy is
 * aria-hidden so assistive tech reads the list once.
 */
export default function Marquee({ items }: { items: string[] }) {
    const row = (hidden: boolean) => (
        <div className="marquee__track" aria-hidden={hidden || undefined}>
            {items.map((item) => (
                <span className="marquee__item" key={item}>
                    {item}
                </span>
            ))}
        </div>
    )

    return (
        <div className="marquee" aria-label="Tools and technologies">
            {row(false)}
            {row(true)}
        </div>
    )
}
