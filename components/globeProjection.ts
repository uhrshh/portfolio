/*
 * Sphere projection for GlobeStudy.
 *
 * The original mapping was x = cosφ·cos(λ+spin), z = cosφ·sin(λ+spin), which
 * puts INCREASING longitude to the LEFT — a mirror image of the world, with
 * the spin running backwards to match. The correct mapping swaps the two:
 *
 *     x = cosφ · sin(λ + spin)      east → screen-right
 *     z = cosφ · cos(λ + spin)      toward the viewer
 *
 * Earth turns eastward, so a point on the visible face travels to the right
 * and the sub-viewer longitude drifts west. With this mapping an increasing
 * spin does exactly that, so positive drift is now the real direction.
 */

export type Rot = {
    /** cos(spin), sin(spin) */
    cs: number
    sn: number
    /** cos(tilt), sin(tilt) */
    ct: number
    st: number
}

export type Projected = {
    /** screen-space x and y on the unit sphere (y up) */
    x: number
    y: number
    /** depth after tilt; > 0 faces the viewer */
    z: number
    /** depth before tilt, needed for the surface-tangent angle */
    zEq: number
}

/** Project a lat/lon (radians) onto the rotated, tilted unit sphere. */
export function project(lat: number, lon: number, r: Rot): Projected {
    const cl = Math.cos(lat)
    const a = cl * Math.cos(lon)
    const b = cl * Math.sin(lon)

    const x = b * r.cs + a * r.sn // cosφ·sin(λ + spin)
    const zEq = a * r.cs - b * r.sn // cosφ·cos(λ + spin)

    const y0 = Math.sin(lat)
    return {
        x,
        y: y0 * r.ct - zEq * r.st,
        z: y0 * r.st + zEq * r.ct,
        zEq,
    }
}

/**
 * Screen angle of the east-pointing surface tangent, used to lay glyphs along
 * the surface. Derived from the projected point rather than recomputed from
 * lat/lon, so it can never drift out of step with project().
 */
export function tangentAngle(p: Projected, st: number): number {
    return Math.atan2(-p.x * st, p.zEq)
}

/**
 * Inverse of project() for a point on the front face.
 * `nx`/`ny` are screen offsets from the centre, normalised by the radius.
 * Returns null when the point falls outside the sphere.
 */
export function unproject(nx: number, ny: number, r: Rot): { lat: number; lon: number } | null {
    const q = 1 - nx * nx - ny * ny
    if (q <= 0.002) return null

    const z = Math.sqrt(q)
    const y0 = ny * r.ct + z * r.st
    const zEq = -ny * r.st + z * r.ct

    return {
        lat: Math.asin(Math.max(-1, Math.min(1, y0))),
        lon: Math.atan2(nx * r.cs - zEq * r.sn, zEq * r.cs + nx * r.sn),
    }
}

/** Build a Rot from spin/tilt in radians. */
export function rot(spin: number, tilt: number): Rot {
    return { cs: Math.cos(spin), sn: Math.sin(spin), ct: Math.cos(tilt), st: Math.sin(tilt) }
}
