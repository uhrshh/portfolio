"use client"

import { useEffect, useState, type RefObject } from "react"

/**
 * Reports when an element first reaches the viewport, and never un-reports.
 *
 * Deliberately belt-and-braces. IntersectionObserver is the fast path, but it
 * is not guaranteed to deliver: an occluded or throttled tab can leave
 * callbacks permanently undelivered even while document.visibilityState reads
 * "visible". Anything gated on it alone can then stay hidden forever — so a
 * geometry check on mount and a passive scroll fallback back it up. Both are
 * torn down the moment the element is in.
 */
export function useInView(ref: RefObject<Element | null>, rootMargin = "0px") {
    const [inView, setInView] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el || inView) return

        let done = false
        const show = () => {
            if (done) return
            done = true
            setInView(true)
        }

        // margin only needs parsing for the top/bottom padding of the fallback
        const pad = parseFloat(rootMargin) || 0
        const nearViewport = () => {
            const r = el.getBoundingClientRect()
            if (r.width === 0 && r.height === 0) return false
            return r.top < window.innerHeight + pad && r.bottom > -pad
        }

        // 1. already there on mount? don't wait for anything
        if (nearViewport()) {
            show()
            return
        }

        // 2. the normal path
        let io: IntersectionObserver | null = null
        if (typeof IntersectionObserver !== "undefined") {
            io = new IntersectionObserver(
                (entries) => {
                    if (entries.some((e) => e.isIntersecting)) show()
                },
                { rootMargin }
            )
            io.observe(el)
        }

        // 3. fallback for when the observer never delivers
        const onScroll = () => {
            if (nearViewport()) show()
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll, { passive: true })

        return () => {
            io?.disconnect()
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
        }
    }, [ref, rootMargin, inView])

    return inView
}
