import * as React from "react"

/**
 * Minimal **bold** renderer so content.ts can stay plain strings
 * without pulling in a markdown dependency.
 */
export default function RichText({ text }: { text: string }) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return (
        <>
            {parts.map((part, i) =>
                part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
                    <strong key={i}>{part.slice(2, -2)}</strong>
                ) : (
                    <React.Fragment key={i}>{part}</React.Fragment>
                )
            )}
        </>
    )
}
