/*
 * Flag tinting for the two countries that matter on this map.
 *
 * Two deliberate compromises, both forced by the dot grid:
 *
 * 1. Outlines, not bounding boxes. A box around India also swallows Pakistan,
 *    Nepal, Bhutan and Bangladesh; a box around the USA bites into northern
 *    Mexico.
 *
 *    These rings only ever gate dots that the land mask already accepted, so
 *    they are drawn TIGHT against neighbouring countries and deliberately
 *    GENEROUS offshore — bulging into the sea costs nothing and stops coastal
 *    cities (Miami, Houston, Kochi, Chennai) falling outside a coarse ring.
 *
 * 2. Five stripes, not thirteen. Real stripes are 25.5°/13 ≈ 1.96° tall, finer
 *    than the grid samples, so they alias into red/white noise instead of
 *    reading as stripes. Five bands (~5.1°) survive the sampling and still read
 *    unmistakably as the flag, especially next to the union.
 *
 * A "" tint means "fall through to baseColor", which is how the white bands of
 * both flags are drawn: literal #FFFFFF would vanish against a light
 * background, whereas the base ink stays legible in either theme.
 */

export const SAFFRON = "#FF9933"
export const INDIA_GREEN = "#138808"
export const US_RED = "#B22234"
export const US_BLUE = "#3C3B6E"

/** Stripes on the rendered flag (see note 2 above). */
const STRIPES = 5
/** Union height as a fraction of the flag, matching the real 7/13. */
const UNION_V = 3 / 5
/** Union width as a fraction of the flag. */
const UNION_H = 0.4

/** [lon, lat] rings. Coarse, but country-shaped. */
export const INDIA_MAIN: number[][] = [
    // Pakistan border (tight)
    [68.0, 23.5], [68.2, 24.3], [69.5, 25.7], [70.6, 27.7], [72.5, 28.0],
    [73.9, 29.9], [74.6, 31.8], [75.3, 32.5], [74.0, 34.7],
    // China / Himalaya (tight)
    [76.2, 35.5], [78.5, 34.6], [79.3, 32.5], [81.0, 30.4],
    // south of Nepal, then west of Bangladesh (tight)
    [80.1, 28.8], [81.5, 28.2], [83.5, 27.3], [85.5, 26.5], [87.2, 26.4],
    [88.2, 26.8], [88.2, 25.0], [88.9, 24.2], [88.2, 22.0],
    // Bay of Bengal, offshore
    [87.0, 20.5], [84.0, 18.5], [81.0, 15.0], [80.6, 12.0], [79.5, 9.0],
    [77.0, 7.8],
    // Arabian Sea, offshore
    [75.0, 11.5], [73.5, 15.0], [72.0, 19.0], [71.5, 21.0], [69.0, 22.0],
]

/** The north-eastern states, separated from the mainland by Bangladesh. */
const INDIA_NE: number[][] = [
    [89.8, 26.0], [92.1, 24.5], [93.4, 24.0], [94.7, 25.5], [96.0, 27.2],
    [97.3, 28.1], [95.2, 29.2], [92.0, 27.9], [90.0, 27.0],
]

export const USA_MAIN: number[][] = [
    // Pacific, offshore
    [-127.0, 48.4], [-127.0, 40.0], [-124.0, 35.0], [-122.0, 32.6],
    // Mexico border (tight)
    [-117.1, 32.53], [-114.7, 32.72], [-111.0, 31.33], [-108.2, 31.33],
    [-106.5, 31.78], [-104.9, 30.6], [-103.1, 29.0], [-102.3, 29.9],
    [-101.4, 29.8], [-99.5, 27.5], [-97.4, 25.84],
    // Gulf of Mexico, offshore — kept north of Cuba
    [-97.5, 24.8], [-94.0, 27.5], [-90.0, 28.0], [-87.0, 29.0], [-84.0, 28.5],
    [-82.5, 24.0],
    // Atlantic, offshore — kept west of the Bahamas
    [-79.8, 24.9], [-79.0, 31.0], [-75.0, 34.0], [-73.0, 39.0], [-69.5, 41.0],
    [-66.5, 44.0],
    // Canada border (tight)
    [-67.8, 47.1], [-69.2, 47.45], [-70.3, 45.9], [-71.5, 45.0], [-74.7, 45.0],
    [-76.8, 44.0], [-79.2, 43.3], [-82.4, 41.7], [-83.1, 42.3], [-82.5, 45.3],
    [-84.4, 46.5], [-88.4, 48.3], [-89.6, 48.0], [-95.2, 49.0], [-123.3, 49.0],
]

/** Alaska is clean as a box — its eastern border is the 141°W meridian. */
const ALASKA = { minLat: 54.5, maxLat: 71.5, minLon: -168, maxLon: -141 }

/** Ray casting; none of these rings straddle the antimeridian. */
export function inPoly(lon: number, lat: number, poly: number[][]): boolean {
    let inside = false
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i][0]
        const yi = poly[i][1]
        const xj = poly[j][0]
        const yj = poly[j][1]
        if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
            inside = !inside
        }
    }
    return inside
}

/** Banded stripes with the union in the top-left, over a given span. */
function usaFlag(
    lat: number,
    lon: number,
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number
): string {
    const v = (maxLat - lat) / (maxLat - minLat)
    const h = (lon - minLon) / (maxLon - minLon)
    if (v < UNION_V && h < UNION_H) return US_BLUE
    return Math.floor(v * STRIPES) % 2 === 0 ? US_RED : ""
}

export function flagTint(lat: number, lon: number): string {
    if (lon > 66 && lon < 100 && lat > 6 && lat < 37) {
        if (inPoly(lon, lat, INDIA_MAIN) || inPoly(lon, lat, INDIA_NE)) {
            // horizontal tricolour across the country's latitude span
            const v = (lat - 8) / 28
            return v > 0.667 ? SAFFRON : v > 0.333 ? "" : INDIA_GREEN
        }
        return ""
    }
    if (lon < -60 && lon > -130 && lat > 24 && lat < 50) {
        return inPoly(lon, lat, USA_MAIN) ? usaFlag(lat, lon, 24, 49.5, -125, -66.5) : ""
    }
    if (lat >= ALASKA.minLat && lat <= ALASKA.maxLat && lon >= ALASKA.minLon && lon <= ALASKA.maxLon) {
        return usaFlag(lat, lon, ALASKA.minLat, ALASKA.maxLat, ALASKA.minLon, ALASKA.maxLon)
    }
    return ""
}
