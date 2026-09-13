"use client"

import * as React from "react"
import { useRef } from "react"
import { useInView } from "./useInView"

type Props = {
    children: React.ReactNode
    /** stagger, in seconds */
    delay?: number
    as?: "div" | "section" | "li" | "article"
    className?: string
    id?: string
}

/** Fades content up the first time it reaches the viewport. */
export default function Reveal({ children, delay = 0, as = "div", className = "", id }: Props) {
    const ref = useRef<HTMLDivElement | null>(null)
    const shown = useInView(ref, "-8%")

    // `as` is a union of intrinsic tags; `any` keeps the polymorphic ref simple.
    const Tag = as as any

    return (
        <Tag
            ref={ref}
            id={id}
            className={`reveal ${shown ? "is-in" : ""} ${className}`.trim()}
            style={{ transitionDelay: delay ? `${delay}s` : undefined }}
        >
            {children}
        </Tag>
    )
}
