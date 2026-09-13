"use client"

import * as React from "react"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

export type Theme = "light" | "dark"

type Ctx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void }

const ThemeCtx = createContext<Ctx>({ theme: "dark", toggle: () => {}, setTheme: () => {} })

export const useTheme = () => useContext(ThemeCtx)

export const STORAGE_KEY = "arsh-theme"

/**
 * The matching pre-paint script lives in app/layout.tsx — it stamps
 * data-theme on <html> before first paint so the page never flashes the
 * wrong palette. This provider reads whatever that script decided, so the
 * two stay in agreement.
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark")

    // adopt the value the pre-paint script already committed to
    useEffect(() => {
        const attr = document.documentElement.getAttribute("data-theme")
        if (attr === "light" || attr === "dark") setThemeState(attr)
    }, [])

    const setTheme = useCallback((t: Theme) => {
        setThemeState(t)
        document.documentElement.setAttribute("data-theme", t)
        document.documentElement.style.colorScheme = t
        try {
            localStorage.setItem(STORAGE_KEY, t)
        } catch {
            /* private mode / storage disabled — the theme still applies for this visit */
        }
    }, [])

    const toggle = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark")
    }, [theme, setTheme])

    // follow the OS only while the visitor hasn't expressed a preference
    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: light)")
        const onChange = (e: MediaQueryListEvent) => {
            let stored: string | null = null
            try {
                stored = localStorage.getItem(STORAGE_KEY)
            } catch {
                /* ignore */
            }
            if (!stored) setTheme(e.matches ? "light" : "dark")
        }
        mq.addEventListener("change", onChange)
        return () => mq.removeEventListener("change", onChange)
    }, [setTheme])

    return <ThemeCtx.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeCtx.Provider>
}

/** Colours the canvas components need as JS props rather than CSS variables. */
export function themeColors(theme: Theme) {
    return theme === "light"
        ? {
              ink: "#0B0C0E",
              gridText: "#D3D4D0",
              globeInk: "#14161A",
              glassBg: "#F3F3F0",
              /* The shader mixes the tint half-and-half with a bright
                 environment reflection, so a white tint washes the ring out
                 against a pale page. A dark tint lands it at a grey/graphite
                 glass with white specular highlights. */
              glassTint: "#23262B",
          }
        : {
              ink: "#ECEDEF",
              gridText: "#31363D",
              globeInk: "#ECEDEF",
              glassBg: "#08090A",
              glassTint: "#FFFFFF",
          }
}
