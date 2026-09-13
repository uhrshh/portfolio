"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import KineticTextGrid from "../KineticTextGrid"
import LiquidGlassButton from "../LiquidGlassButton"
import LiquidGlassCluster from "../LiquidGlassCluster"
import LazyMount from "./LazyMount"
import { profile } from "./content"
import { themeColors, useTheme } from "./ThemeProvider"

/** Torus tube thickness, as the component's `depth` percentage. */
const RING_DEPTH = 17

/* Shared look for the two glass buttons in the hero. */
const glassButton = {
    padding: "13px 24px",
    rounded: 100,
    gap: 10,
    colors: { fill: "#FFFFFF", textColor: "#ECEDEF" },
    font: {
        fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
        fontWeight: 500,
        fontSize: 11,
        letterSpacing: "0.2em",
        textTransform: "uppercase" as const,
    },
    stroke: {
        type: "gradient" as const,
        angle: 180,
        width: 1,
        colorA: "rgba(255,255,255,0.34)",
        colorB: "rgba(255,255,255,0.10)",
        color: "rgba(255,255,255,0.24)",
    },
    light: {
        size: 62,
        color: "rgba(255,255,255,0.40)",
        intensity: 100,
        smoothness: 70,
    },
    style: { boxShadow: "none" as const },
}

/**
 * The ring is sized from the rendered width of the headline so it always
 * encircles the name rather than crashing into it.
 *
 * LiquidGlassCluster's `size` is a percentage of HALF THE VIEWPORT HEIGHT
 * (its projection scales x by the aspect ratio), so on a tall narrow phone a
 * fixed value would push the ring wider than the screen — hence the clamp
 * against viewport width too.
 */
function useRingSize(titleRef: React.RefObject<HTMLHeadingElement | null>) {
    const [size, setSize] = useState(56)

    useEffect(() => {
        const measure = () => {
            const el = titleRef.current
            const vh = window.innerHeight
            const vw = window.innerWidth
            if (!el || !vh) return

            const range = document.createRange()
            range.selectNodeContents(el)
            const textWidth = range.getBoundingClientRect().width || el.clientWidth * 0.3
            range.detach?.()

            const wanted = textWidth * 0.82 // ring radius vs. the whole word
            const maxByWidth = vw * 0.44 // never wider than the viewport
            const maxByHeight = vh * 0.42 // and never taller than it either
            const radius = Math.max(24, Math.min(wanted, maxByWidth, maxByHeight))
            setSize(Math.max(18, Math.min(96, (radius / (vh / 2)) * 100)))
        }

        measure()
        // fonts change the measured width, so re-measure once they land
        document.fonts?.ready.then(measure).catch(() => {})
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [titleRef])

    return size
}

export default function Hero() {
    const { theme, toggle } = useTheme()
    const c = themeColors(theme)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const ringSize = useRingSize(titleRef)

    const nextLabel = theme === "dark" ? "light" : "dark"

    return (
        <header className="hero" id="top">
            {/* the name, repeated into a wall that wipes and resolves on a loop */}
            <div className="hero__grid" aria-hidden="true">
                <KineticTextGrid
                    text={profile.name.toUpperCase()}
                    /* dim on purpose: the wall is texture, the <h1> is the
                       thing you actually read */
                    textColor={c.gridText}
                    backgroundColor="transparent"
                    rowCount={9}
                    repeatCount={7}
                    rowGap={6}
                    wordGap={26}
                    expandDurationSec={1.2}
                    holdDurationSec={1.2}
                    horizontalShiftPx={70}
                    zoomScalePct={108}
                    font={{
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                        fontWeight: 800,
                        fontSize: "clamp(1.5rem, 4.4vw, 3.75rem)",
                        letterSpacing: "-0.04em",
                        lineHeight: "1em",
                    }}
                />
            </div>

            <div className="hero__vignette" aria-hidden="true" />

            {/* glass ring, centred on the same point the wall resolves to */}
            <div className="hero__ring" aria-hidden="true">
                <LazyMount rootMargin="0px">
                    <LiquidGlassCluster
                        background="transparent"
                        shape="Torus"
                        depth={RING_DEPTH}
                        size={ringSize}
                        /* speed 0 keeps it face-on as a halo; the component still
                           breathes via its idle float and pointer tilt */
                        speed={0}
                        backdrop={{ type: "None" }}
                        /* no backdrop plate means frost would blur nothing while
                           still costing 24 texture taps per pixel */
                        glass={{ tint: c.glassTint, chromatic: 34, frost: 0 }}
                        orient={{ angleX: 0, angleY: 0, angleZ: 0, offsetX: 0, offsetY: 0 }}
                        style={{ touchAction: "pan-y" }}
                    />
                </LazyMount>
            </div>

            {/* outside .hero__overlay so it stacks below the toggle disc */}
            <h1 className="hero__title" ref={titleRef}>
                {profile.name}
            </h1>

            <div className="hero__overlay">
                <hr className="hero__rule" />
                <div className="hero__foot">
                    <div className="hero__cta">
                        <LiquidGlassButton
                            {...glassButton}
                            label="Résumé"
                            link={profile.resume}
                            newTab
                        />
                        <LiquidGlassButton
                            {...glassButton}
                            label="Get in touch"
                            link="#contact"
                            newTab={false}
                        />
                        <a className="hero__scroll mono" href="#about">
                            <span className="hero__scroll-line" aria-hidden="true" />
                            Scroll
                        </a>
                    </div>
                </div>
            </div>

            <ThemeRing
                size={ringSize}
                depth={RING_DEPTH}
                onToggle={toggle}
                nextLabel={nextLabel}
            />
        </header>
    )
}

/**
 * Click target for the glass ring.
 *
 * An SVG circle laid over the torus: the stroke traces the ring the viewer can
 * see, and `pointer-events: all` (set in globals.css) makes the enclosed disc
 * hit-testable too, so a click anywhere inside the ring toggles the theme.
 * useRingSize keeps the disc clear of the CTA row beneath it.
 */
function ThemeRing({
    size,
    depth,
    onToggle,
    nextLabel,
}: {
    size: number
    depth: number
    onToggle: () => void
    nextLabel: string
}) {
    const [box, setBox] = useState({ w: 0, h: 0 })

    useEffect(() => {
        const measure = () => setBox({ w: window.innerWidth, h: window.innerHeight })
        measure()
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [])

    if (!box.w || !box.h) return null

    /*
     * Mirror the component's own geometry so the hit area traces the ring the
     * viewer can actually see. Internally the torus has a centreline radius of
     * 0.8 and a tube of depth/100/2, and `size` is a percentage of half the
     * viewport height applied to the OUTER bound (centreline + tube).
     */
    const outer = (size / 100) * (box.h / 2)
    const tubeObj = Math.max(0.02, (depth / 100) * 0.5)
    const radius = outer * (0.8 / (0.8 + tubeObj)) // centreline, in px
    const tube = outer * (tubeObj / (0.8 + tubeObj))

    return (
        <svg
            className="theme-toggle"
            viewBox={`0 0 ${box.w} ${box.h}`}
            width={box.w}
            height={box.h}
            role="presentation"
        >
            <circle
                cx={box.w / 2}
                cy={box.h / 2}
                r={radius}
                strokeWidth={Math.max(22, tube * 2 + 12)}
                /* the visible ring is the stroke, but the hit area is the whole
                   disc — see .theme-toggle circle in globals.css */
                role="button"
                tabIndex={0}
                aria-label={`Switch to ${nextLabel} mode`}
                onClick={onToggle}
                /* Stops the pointer from focusing the circle at all, so the
                   :focus stroke never shows for mouse users — no lingering
                   outline after a click. The click event still fires. */
                onMouseDown={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        onToggle()
                    }
                }}
            />
            <text
                className="theme-toggle__hint"
                x={box.w / 2}
                y={box.h / 2 + radius + Math.max(26, tube) + 14}
                textAnchor="middle"
            >
                {nextLabel} mode
            </text>
        </svg>
    )
}
