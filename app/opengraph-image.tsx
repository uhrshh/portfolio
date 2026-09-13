import { ImageResponse } from "next/og"

// Rendered at build time, so there is no binary asset to keep in sync.
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Arsh — Computer Science @ UMass Amherst"

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#08090A",
                    color: "#ECEDEF",
                    position: "relative",
                }}
            >
                {/* echoes the glass ring that encircles the name on the site */}
                <div
                    style={{
                        position: "absolute",
                        width: 430,
                        height: 430,
                        borderRadius: 999,
                        border: "2px solid rgba(255,255,255,0.16)",
                        display: "flex",
                    }}
                />
                <div
                    style={{
                        fontSize: 168,
                        fontWeight: 800,
                        letterSpacing: -8,
                        lineHeight: 1,
                        display: "flex",
                    }}
                >
                    ARSH
                </div>
                <div
                    style={{
                        marginTop: 28,
                        fontSize: 26,
                        letterSpacing: 6,
                        textTransform: "uppercase",
                        color: "#9AA0A6",
                        display: "flex",
                    }}
                >
                    Computer Science · UMass Amherst
                </div>
            </div>
        ),
        size
    )
}
