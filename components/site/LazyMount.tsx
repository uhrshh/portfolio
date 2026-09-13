"use client"

import * as React from "react"
import { useRef } from "react"
import { useInView } from "./useInView"

type Props = {
    children: React.ReactNode
    /** how far ahead of the viewport to start mounting */
    rootMargin?: string
    className?: string
    /** shown until the real thing mounts */
    placeholder?: React.ReactNode
}

/**
 * Defers mounting an expensive canvas/WebGL child until it is near the
 * viewport, then keeps it mounted.
 *
 * It intentionally never unmounts: LiquidGlassCluster creates a WebGL context
 * per mount and never calls loseContext(), so repeatedly remounting it would
 * march towards the browser's per-page context limit.
 */
export default function LazyMount({
    children,
    rootMargin = "300px",
    className,
    placeholder = null,
}: Props) {
    const ref = useRef<HTMLDivElement | null>(null)
    const mounted = useInView(ref, rootMargin)

    return (
        <div ref={ref} className={className} style={{ width: "100%", height: "100%" }}>
            {mounted ? children : placeholder}
        </div>
    )
}
