import { flagTint, inPoly, INDIA_MAIN, USA_MAIN, SAFFRON, INDIA_GREEN, US_RED, US_BLUE } from "./flagTint.ts"

const B = "" // falls through to baseColor
const cases: [string, number, number, string][] = [
    // --- India: tricolour north → south ---
    ["Srinagar (north)",        34.1,   74.8, SAFFRON],
    ["Delhi (north)",           28.6,   77.2, SAFFRON],
    ["Mumbai (middle)",         19.1,   72.9, B],
    ["Kolkata (middle)",        22.6,   88.4, B],
    ["Kochi (south)",            9.9,   76.3, INDIA_GREEN],
    ["Chennai (south)",         13.1,   80.3, INDIA_GREEN],
    ["Guwahati (NE states)",    26.1,   91.7, B],
    // --- neighbours a bounding box would have painted ---
    ["Karachi, PAKISTAN",       24.9,   67.0, B],
    ["Lahore, PAKISTAN",        31.5,   74.3, B],
    ["Islamabad, PAKISTAN",     33.7,   73.1, B],
    ["Dhaka, BANGLADESH",       23.8,   90.4, B],
    ["Kathmandu, NEPAL",        27.7,   85.3, B],
    ["Thimphu, BHUTAN",         27.5,   89.6, B],
    ["Colombo, SRI LANKA",       6.9,   79.9, B],
    // --- USA ---
    ["Seattle (union)",         47.6, -122.3, US_BLUE],
    ["Chicago (union edge)",    41.9,  -87.6, B],
    ["Miami (south band)",      25.8,  -80.2, US_RED],
    ["NW Alaska (union)",       69.0, -160.0, US_BLUE],
    // --- neighbours ---
    ["Tijuana, MEXICO",         32.5, -117.0, B],
    ["Monterrey, MEXICO",       25.7, -100.3, B],
    ["Vancouver, CANADA",       49.3, -123.1, B],
    ["Toronto, CANADA",         43.7,  -79.4, B],
    ["Whitehorse, CANADA",      60.7, -135.1, B],
    ["Havana, CUBA",            23.1,  -82.4, B],
    // --- elsewhere ---
    ["London",                  51.5,   -0.1, B],
    ["Sydney",                 -33.9,  151.2, B],
    ["Tokyo",                   35.7,  139.7, B],
]

let pass = 0, fail = 0
for (const [place, lat, lon, want] of cases) {
    const got = flagTint(lat, lon)
    const ok = got === want
    ok ? pass++ : fail++
    console.log(`${ok ? "PASS" : "FAIL"}  ${place.padEnd(24)} got=${(got || "(base)").padEnd(9)} want=${want || "(base)"}`)
}

// A white band and "outside the country" both return "", so membership is
// asserted against the polygon directly.
const member: [string, number, number, number[][], boolean][] = [
    ["Houston in USA",        29.8,  -95.4, USA_MAIN, true],
    ["Denver in USA",         39.7, -105.0, USA_MAIN, true],
    ["Atlanta in USA",        33.7,  -84.4, USA_MAIN, true],
    ["Monterrey NOT in USA",  25.7, -100.3, USA_MAIN, false],
    ["Toronto NOT in USA",    43.7,  -79.4, USA_MAIN, false],
    ["Nagpur in India",       21.1,   79.1, INDIA_MAIN, true],
    ["Jaipur in India",       26.9,   75.8, INDIA_MAIN, true],
    ["Lahore NOT in India",   31.5,   74.3, INDIA_MAIN, false],
    ["Dhaka NOT in India",    23.8,   90.4, INDIA_MAIN, false],
]
console.log("")
for (const [name, lat, lon, poly, want] of member) {
    const got = inPoly(lon, lat, poly)
    const ok = got === want
    ok ? pass++ : fail++
    console.log(`${ok ? "PASS" : "FAIL"}  ${name.padEnd(24)} got=${String(got).padEnd(9)} want=${want}`)
}

// stripes must actually alternate at the grid's own sampling rate (~2.4°)
const scan: string[] = []
for (let la = 48.5; la > 25; la -= 2.4) {
    const t = flagTint(la, -95)
    scan.push(t === US_RED ? "R" : t === US_BLUE ? "U" : "w")
}
console.log("\nband scan at 95°W, stepping 2.4° N→S:", scan.join(""))
let flips = 0
for (let i = 1; i < scan.length; i++) if (scan[i] !== scan[i - 1]) flips++
console.log(`alternations: ${flips} across ${scan.length} rows`)
if (flips < 3) { console.log("!! bands are not resolving"); fail++ }

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
