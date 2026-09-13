import { project, unproject, rot, tangentAngle } from "./globeProjection.ts"

const D = Math.PI / 180
let pass = 0, fail = 0
const check = (name: string, ok: boolean, detail = "") => {
    ok ? pass++ : fail++
    console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  " + detail : ""}`)
}

// ---- 1. orientation: east must be to the RIGHT ----
// spin 0 centres longitude 0 (Greenwich)
const r0 = rot(0, 0)
const east = project(0, 20 * D, r0)
const west = project(0, -20 * D, r0)
check("20°E is right of centre", east.x > 0, `x=${east.x.toFixed(3)}`)
check("20°W is left of centre", west.x < 0, `x=${west.x.toFixed(3)}`)
check("east is right of west", east.x > west.x)

// real cities, Atlantic facing us
const nyc = project(40.7 * D, -74.0 * D, r0)
const ldn = project(51.5 * D, -0.1 * D, r0)
const cai = project(30.0 * D, 31.2 * D, r0)
check("New York left of London", nyc.x < ldn.x, `${nyc.x.toFixed(2)} < ${ldn.x.toFixed(2)}`)
check("London left of Cairo", ldn.x < cai.x, `${ldn.x.toFixed(2)} < ${cai.x.toFixed(2)}`)
check("all three on the visible face", nyc.z > 0 && ldn.z > 0 && cai.z > 0)

// ---- 2. north must be UP ----
const north = project(60 * D, 0, r0)
const south = project(-60 * D, 0, r0)
check("60°N above 60°S", north.y > south.y, `${north.y.toFixed(2)} > ${south.y.toFixed(2)}`)

// ---- 3. rotation direction: Earth turns eastward ----
// a point on the visible face must travel RIGHT as spin advances
const before = project(0, 10 * D, rot(0, 0))
const after = project(0, 10 * D, rot(0.05, 0))
check("point drifts right as spin advances", after.x > before.x,
    `${before.x.toFixed(3)} → ${after.x.toFixed(3)}`)
// and the centre longitude should move WEST (sub-viewer point drifts west)
const centreLon = (s: number) => {
    const u = unproject(0, 0, rot(s, 0))
    return u ? u.lon / D : NaN
}
check("centre longitude moves west", centreLon(0.05) < centreLon(0),
    `${centreLon(0).toFixed(1)}° → ${centreLon(0.05).toFixed(1)}°`)

// ---- 4. round trip through unproject ----
let worst = 0
for (let i = 0; i < 4000; i++) {
    const lat = (Math.random() * 160 - 80) * D
    const lon = (Math.random() * 360 - 180) * D
    const r = rot(Math.random() * 7 - 3.5, Math.random() * 2 - 1)
    const p = project(lat, lon, r)
    if (p.z <= 0.1) continue // back face, or too near the limb to invert stably
    const back = unproject(p.x, p.y, r)
    if (!back) { fail++; console.log("FAIL  unproject returned null for a visible point"); break }
    const dLat = Math.abs(back.lat - lat)
    let dLon = Math.abs(back.lon - lon) % (2 * Math.PI)
    if (dLon > Math.PI) dLon = 2 * Math.PI - dLon
    worst = Math.max(worst, dLat + dLon)
}
check("project → unproject round trip", worst < 1e-9, `worst error ${worst.toExponential(2)} rad`)

// ---- 5. tangent angle stays sane ----
const flat = tangentAngle(project(0, 0, rot(0, 0)), 0)
check("tangent is horizontal with no tilt", Math.abs(flat) < 1e-12, `${flat.toFixed(6)} rad`)

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
