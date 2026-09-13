// Glass Icon — Originkit

"use client"

import { useEffect, useRef } from "react"
import type { CSSProperties } from "react"

export type FontValue = {
    fontFamily?: string
    fontSize?: string | number
    fontWeight?: string | number
    fontStyle?: string
    letterSpacing?: string | number
    lineHeight?: string | number
}

export type BackdropGroup = {
    type?: "None" | "Image" | "Video" | "Text"
    image?: string
    video?: string

    text?: string
    font?: FontValue
    textColor?: string
}

export type GlassGroup = {
    tint?: string
    chromatic?: number
    frost?: number
}

export type OrientGroup = {
    angleX?: number

    angleY?: number

    angleZ?: number

    offsetX?: number
    offsetY?: number
}

export type LiquidGlassClusterProps = {
    className?: string
    style?: CSSProperties

    background?: string
    shape?: "X" | "Torus" | "Sphere" | "Logo"

    logo?: string

    depth?: number

    size?: number

    speed?: number
    direction?: "Clockwise" | "Counterclockwise"
    backdrop?: BackdropGroup
    glass?: GlassGroup
    orient?: OrientGroup
}

const BEVEL = 0.025
const CORE_REFRACT = 1.0
const IOR = 1.5
const THICKNESS = 2.0
const IDLE_FLOAT = 0.05
const TILT_RANGE = 0.5

const TILT_RATE = 5
const DRAG_GAIN = 0.01
const SPIN_YAW = 0.5
const SPIN_PITCH = 0.2
const FOV = (45 * Math.PI) / 180
const CAM_DIST = 5
const DEG = Math.PI / 180

export const DUMMY_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAG1klEQVR42u3d4Y3qMBBF4S0kjVAIhbiRFEIhaSSFZP8EbYR4CB6B2L7fSKeA9eKTmfE4+VmW5QdAJhYBIAAABACAAAAQAAACAEAAAAgAAAEAIAAABACAAAAQAAACAEAAAAgAVXJesRYEAAIAAYAAQAAgABAA+qasWAsCQCCXFWtBACAAEAAIAASACK5hLQgABAACQArDRgCD9SAA5M0AXMMsAAGAAEAASDoBuIaTAAIAAYAAkHYC4CSAAEAA1oQAkNgA1AgkAATeArwNtwIJAIENQI1AAkAY8x0BzNaFAJDZANQIJAAENwA1AgkAIYwPBDBaHwJA30wPBDBZHwJAZv2vD0AACK7/9QEIAMH1vz4AASC4/tcHIAB0zLA8H14RRgAIrP/1AQgAQfP//wr3AggAYcd/jgMJANJ/ZQABIDn9VwYQAMLTf2UAASA4/VcGEACC039lAAEgPP1XBhAAGqfsIAAvCyUAdDz7724AAaBDTst+cbKeBID+rv4+G64IEwDCmn+agQSA4OafZiABoFHmDwjAh0MIAJ1P/pkMJAA4+nMkSABIP/pzJEgA8PSXBRAAPP1lAQSA+Ke/LIAAEP70lwUQAIKf/rIAAkDIub+5AAJA4NSf6UACQOjMvzsCBIAGGJZ6wrcECQBf5lKRALw8lADQ+bGfY0ECgMafhiAB4EjGpd7w6jACQFjqrxQgAASn/koBAkB46q8UIAB0Ou5rTJgAcPDAz9ygAGYDQgSAvgZ+DAgRANT9+gEEAHW/fgABQN2vH0AAsPlJgAAQ3vTTFCQA2PwkQABI7Pg7GSAAhHf8nQwQAGx+EiAA2PwkQACw+UmAAGDzkwAB2Pz2OgkQgM0vSIAAnPMLcwIEYMJP3IaJQQLo4mKPzf+eBFwgIgC3+oLDLUICaLLZZ/PvKwHNQQLQ7NMc9BsjAPW+voDfGwFI+ZUEIAApv5IABPB1Tp761WQDPkhKAJ76sgG/TQLw1JcN+J0SgA6/kwK/WwLYg2I/NRvF75cAHO0pCxwZEsBLdf5k33QXk/4AAdj4gggIwMYXRJAugLONL9bfwJkAsrr6mnviXrOwEEC/ab7pPfFsjCnlQcLTXpov3ikPCgG0V9ub2hN7x6XHXoFNL0SwDFqezbfpRU0yGAjg80/5UU0vKu8ZjC1lBza8EMFCqGmzlzWdckYveo15/Y2XWqRwRN1+rd3V70L89REum/0xtCSA8w1l8wfZ5ELsI4dt5rCFAIQgACWAEEoATUAhqo3oJqBjQJEWjgEJQdjwBoGMAoue63ejwIvLQCJv07sMRAbCpicALwQRvdb0XgjSAV4JJl4JrwTrPCswayBuw0tBw/BacHFN870WPBgfBsnd+D4MQgBEYOMTAIjAxicALD4P3mNzz+fBCeCtUwPRZhS/XwLY6+6B6cJ24rI0OptPAPX3B5QFdaf76nwC+DimCuuL0e+SAGQDnvogANmApz4IwJGhoz0QgJMCHX4QgJJAyg8CUBJI+UEA3ykJSGCfzS/lJwB9AfU+CKBNSOD/Nr/fDgFoDmr2gQD6aQ6Kx6HZRwAkYPODAEjA5gcBkIDNDwIgAZsfBEACNj8IgARsfhCAOQHn/CAAE4PthAk/AkCoBGx+AsCSeYvQrT4CQKgEbH4CQPDJgI4/ASD0ZEDHnwAQ2hTU9CMAhPYD1P0EgOB+gLqfABDaD1D3EwA+QAulwOz/RAD4DKcGBOBDnQSA0FJA6k8ACC0FpP4EgOBSQOpPAAgdEDLwQwA4YEColjDwQwA4gFLB5i/+DwSAzIagxh8BIHhM2LgvAaACpgM2/2TdCQC5x4KO/QgAoVmApz8BIDgL8PQnAIRmAZ7+BIDgLMDTnwAQmgV4+hMAgucCnPsTAEKnA039EQCC7wiY+ScANMTeYU0JAA2x56vDvOqLABB8JOjojwAQeiTo6I8AENwM1PwjAAQ3A60hAaBh3nl5qJd9EgCCJwNN/hEAgssAa0cACC0DpP8EgOAyQPpPAAguA6wZASC0DJD+EwCCywDpPwGgM175lqBv/REAQu8GmP0nAHTKM1eEXf0lAAT3AdT/BIDg40BrRAAI7QOo/wkAwX0A9T8BILgPoP4nAAT3AawNASCAex8O8eEPAkDwvQDz/wSAEO69LNTLPwkAwY1ADUACQHAj0JoQAAgABIC0RqAGIAGAAEAASGwEagASAAgABIAUtq8I8wowAkDwSYC1IAAQAAgAaScBTgAIAAQAAgABgAAQdSvQLUACQPAsgBkAAgABgABAACAAEAAIAAABACAAAAQAgAAAEAAAAgBAAAAIAAABACAAAAQAgAAAEAAAAgBAAACO4RdJRpWIUNg59wAAAABJRU5ErkJggg=="
export const DUMMY_BACKDROP = "data:image/png;base64,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"

function parseColor(input: string | undefined, fallback: [number, number, number]): [number, number, number] {
    if (!input) return fallback
    const s = input.trim()
    if (s[0] === "#") {
        let h = s.slice(1)
        if (h.length === 3 || h.length === 4)
            h = h
                .split("")
                .map((c) => c + c)
                .join("")
        if (h.length >= 6) {
            const r = parseInt(h.slice(0, 2), 16) / 255
            const g = parseInt(h.slice(2, 4), 16) / 255
            const b = parseInt(h.slice(4, 6), 16) / 255
            if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [r, g, b]
        }
        return fallback
    }
    const m = s.match(/rgba?\(([^)]+)\)/i)
    if (m) {
        const p = m[1].split(",").map((v) => parseFloat(v))
        if (p.length >= 3) return [p[0] / 255, p[1] / 255, p[2] / 255]
    }
    return fallback
}

function numOf(v: string | number | undefined, fallback: number): number {
    if (typeof v === "number") return Number.isFinite(v) ? v : fallback
    if (typeof v === "string") {
        const n = parseFloat(v)
        if (Number.isFinite(n)) return n
    }
    return fallback
}

function srcOf(v: unknown): string | undefined {
    if (!v) return undefined
    if (typeof v === "string") return v
    const s = (v as { src?: unknown }).src
    return typeof s === "string" ? s : undefined
}

function rotYX(yaw: number, pitch: number): Float32Array {
    const cy = Math.cos(yaw)
    const sy = Math.sin(yaw)
    const cx = Math.cos(pitch)
    const sx = Math.sin(pitch)
    const m = new Float32Array(9)

    m[0] = cy
    m[1] = 0
    m[2] = -sy

    m[3] = sy * sx
    m[4] = cx
    m[5] = cy * sx

    m[6] = sy * cx
    m[7] = -sx
    m[8] = cy * cx
    return m
}

function transpose3(m: Float32Array): Float32Array {
    const o = new Float32Array(9)
    o[0] = m[0]
    o[1] = m[3]
    o[2] = m[6]
    o[3] = m[1]
    o[4] = m[4]
    o[5] = m[7]
    o[6] = m[2]
    o[7] = m[5]
    o[8] = m[8]
    return o
}

function mul3(a: Float32Array, b: Float32Array): Float32Array {
    const o = new Float32Array(9)
    for (let c = 0; c < 3; c++)
        for (let r = 0; r < 3; r++)
            o[c * 3 + r] = a[r] * b[c * 3] + a[3 + r] * b[c * 3 + 1] + a[6 + r] * b[c * 3 + 2]
    return o
}

function rotYXZ(yaw: number, pitch: number, roll: number): Float32Array {
    const base = rotYX(yaw, pitch)
    if (roll === 0) return base
    const c = Math.cos(roll)
    const s = Math.sin(roll)
    const rz = new Float32Array([c, s, 0, -s, c, 0, 0, 0, 1])
    return mul3(base, rz)
}

function buildEnvCanvas(): HTMLCanvasElement | null {
    if (typeof document === "undefined") return null
    const canvas = document.createElement("canvas")
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext("2d")
    if (!ctx) return null
    ctx.fillStyle = "#1a1a1a"
    ctx.fillRect(0, 0, 1024, 512)

    const softbox = (x: number, y: number, w: number, h: number, intensity: number) => {
        const grd = ctx.createLinearGradient(x, y, x, y + h)
        grd.addColorStop(0, `rgba(255, 255, 255, ${intensity})`)
        grd.addColorStop(1, `rgba(50, 50, 50, ${intensity * 0.2})`)
        ctx.fillStyle = grd
        ctx.shadowColor = "#ffffff"
        ctx.shadowBlur = 80
        ctx.beginPath()
        const rr = (ctx as any).roundRect
        if (typeof rr === "function") rr.call(ctx, x, y, w, h, 60)
        else ctx.rect(x, y, w, h)
        ctx.fill()
    }
    softbox(50, 100, 300, 312, 1)
    softbox(674, 100, 300, 312, 1)
    softbox(350, -50, 324, 150, 0.9)
    ctx.shadowBlur = 0
    return canvas
}

const SDF_MAX = 512
const SDF_PAD = 24
const SDF_SPREAD = 32

function edt1d(f: Float32Array, d: Float32Array, v: Int32Array, z: Float32Array, n: number) {
    let k = 0
    v[0] = 0
    z[0] = -Infinity
    z[1] = Infinity
    for (let q = 1; q < n; q++) {
        let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
        while (s <= z[k]) {
            k--
            s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
        }
        k++
        v[k] = q
        z[k] = s
        z[k + 1] = Infinity
    }
    k = 0
    for (let q = 0; q < n; q++) {
        while (z[k + 1] < q) k++
        d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]
    }
}

function edt2d(mask: Uint8Array, w: number, h: number): Float32Array {
    const INF = 1e20
    const grid = new Float32Array(w * h)
    for (let i = 0; i < w * h; i++) grid[i] = mask[i] ? 0 : INF
    const n = Math.max(w, h)
    const f = new Float32Array(n)
    const d = new Float32Array(n)
    const v = new Int32Array(n)
    const z = new Float32Array(n + 1)
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) f[y] = grid[y * w + x]
        edt1d(f, d, v, z, h)
        for (let y = 0; y < h; y++) grid[y * w + x] = d[y]
    }
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) f[x] = grid[y * w + x]
        edt1d(f, d, v, z, w)
        for (let x = 0; x < w; x++) grid[y * w + x] = d[x]
    }
    return grid
}

function bakeSDF(alpha: Uint8ClampedArray, w: number, h: number): Uint8Array {
    const inside = new Uint8Array(w * h)
    const outside = new Uint8Array(w * h)
    for (let i = 0; i < w * h; i++) {
        const on = alpha[i * 4 + 3] > 127 ? 1 : 0
        inside[i] = on
        outside[i] = on ? 0 : 1
    }
    const dOut = edt2d(inside, w, h)
    const dIn = edt2d(outside, w, h)
    const signed = new Float32Array(w * h)
    for (let i = 0; i < w * h; i++) signed[i] = inside[i] ? Math.sqrt(dIn[i]) : -Math.sqrt(dOut[i])

    const blurred = new Float32Array(w * h)
    const tmp = new Float32Array(w * h)
    const K = [0.06136, 0.24477, 0.38774, 0.24477, 0.06136]
    for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
            let s = 0
            for (let k = -2; k <= 2; k++) s += K[k + 2] * signed[y * w + Math.min(w - 1, Math.max(0, x + k))]
            tmp[y * w + x] = s
        }
    for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
            let s = 0
            for (let k = -2; k <= 2; k++) s += K[k + 2] * tmp[Math.min(h - 1, Math.max(0, y + k)) * w + x]
            blurred[y * w + x] = s
        }

    const out = new Uint8Array(w * h * 4)
    for (let i = 0; i < w * h; i++) {
        const norm = Math.max(0, Math.min(1, 0.5 + blurred[i] / (2 * SDF_SPREAD)))
        const b = Math.round(norm * 255)
        out[i * 4] = b
        out[i * 4 + 1] = b
        out[i * 4 + 2] = b
        out[i * 4 + 3] = 255
    }
    return out
}

function fallbackAlpha(w: number, h: number): Uint8ClampedArray {
    const px = new Uint8ClampedArray(w * h * 4)
    const hx = w / 2 - SDF_PAD
    const hy = h / 2 - SDF_PAD
    const r = Math.min(hx, hy) * 0.45
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const dx = Math.abs(x - w / 2) - (hx - r)
            const dy = Math.abs(y - h / 2) - (hy - r)
            const qx = Math.max(dx, 0)
            const qy = Math.max(dy, 0)
            const d = Math.hypot(qx, qy) + Math.min(Math.max(dx, dy), 0) - r
            px[(y * w + x) * 4 + 3] = d < 0 ? 255 : 0
        }
    }
    return px
}

const FULLSCREEN_VS = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`

const PLATE_FS = `
precision highp float;
uniform sampler2D uPlate;
uniform vec2 uPlateFit;
uniform vec2 uRes;
void main() {
    vec2 uv = (gl_FragCoord.xy / uRes - 0.5) * uPlateFit + 0.5;
    gl_FragColor = texture2D(uPlate, clamp(uv, 0.0, 1.0));
}`

const GLASS_FS = `
precision highp float;

uniform vec2 uRes;
uniform float uAspect;
uniform float uTanHalf;

uniform sampler2D uPlate;
uniform vec2 uPlateFit;
uniform float uHasPlate;
uniform sampler2D uEnv;
uniform sampler2D uSDF;

uniform mat3 uRot;
uniform mat3 uRotT;
uniform vec3 uCenter;
uniform float uScale;
uniform float uBoundR;

uniform float uShape;
uniform float uHalfDepth;
uniform float uBevel;
uniform float uTorusTube;
uniform vec2 uLogoHalf;
uniform float uSdfUnits;

uniform float uDisp;
uniform float uFrost;
uniform vec3 uTint;

const float PI = 3.14159265359;
const float CORE_REFRACT = ${CORE_REFRACT.toFixed(4)};
const float IOR = ${IOR.toFixed(4)};
const float THICKNESS = ${THICKNESS.toFixed(4)};

float sdCross(vec2 p, vec2 b) {
    p = abs(p);
    p = (p.y > p.x) ? p.yx : p.xy;
    vec2 q = p - b;
    float k = max(q.y, q.x);
    vec2 w = (k > 0.0) ? q : vec2(b.y - p.x, -k);
    return sign(k) * length(max(w, 0.0));
}

vec2 r45(vec2 p) {
    const float c = 0.7071067811865476;
    return vec2((p.x + p.y) * c, (p.y - p.x) * c);
}

float sdLogo(vec2 p) {
    vec2 uv = p / (2.0 * uLogoHalf) + 0.5;

    uv.y = 1.0 - uv.y;
    vec2 e = abs(p) - uLogoHalf;
    float dBox = length(max(e, 0.0)) + min(max(e.x, e.y), 0.0);

    float dTex = (0.5 - texture2D(uSDF, clamp(uv, 0.0, 1.0)).r) * 2.0 * uSdfUnits;
    return max(dTex, dBox);
}

float extrudeRound(float d2, float pz, float hd, float r) {
    vec2 q = vec2(d2 + r, abs(pz) - hd + r);
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

float map(vec3 p) {
    if (uShape < 0.5) {
        return extrudeRound(sdCross(r45(p.xy), vec2(1.3, 0.35)), p.z, uHalfDepth, uBevel);
    } else if (uShape < 1.5) {
        vec2 q = vec2(length(p.xy) - 0.8, p.z);
        return length(q) - uTorusTube;
    } else if (uShape < 2.5) {
        return length(p) - 1.2;
    }
    return extrudeRound(sdLogo(p.xy), p.z, uHalfDepth, uBevel);
}

vec3 mapNormal(vec3 p) {
    const float e = 0.0015;
    vec2 k = vec2(1.0, -1.0);
    return normalize(
        k.xyy * map(p + k.xyy * e) +
        k.yyx * map(p + k.yyx * e) +
        k.yxy * map(p + k.yxy * e) +
        k.xxx * map(p + k.xxx * e)
    );
}

vec4 plate(vec2 screenUv) {
    if (uHasPlate < 0.5) return vec4(0.0);
    vec2 uv = (screenUv - 0.5) * uPlateFit + 0.5;
    return texture2D(uPlate, clamp(uv, 0.0, 1.0));
}

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 screenUv = gl_FragCoord.xy / uRes;
    vec2 ndc = screenUv * 2.0 - 1.0;

    vec3 D = normalize(vec3(ndc.x * uTanHalf * uAspect, ndc.y * uTanHalf, -1.0));
    vec3 rd = normalize(uRotT * D);
    vec3 ro = (uRotT * -uCenter) / uScale;

    float bb = dot(ro, rd);
    float cc = dot(ro, ro) - uBoundR * uBoundR;
    float hh = bb * bb - cc;
    if (hh < 0.0) discard;
    hh = sqrt(hh);
    float t = max(-bb - hh, 0.0);
    float tMax = -bb + hh;

    bool hit = false;
    for (int i = 0; i < 80; i++) {
        if (t > tMax) break;
        float d = map(ro + rd * t);
        if (d < 0.0009) { hit = true; break; }
        t += d * 0.9;
    }
    if (!hit) discard;

    vec3 pObj = ro + rd * t;
    vec3 nObj = mapNormal(pObj);

    vec3 vP = uCenter + uScale * (uRot * pObj);
    vec3 normal = normalize(uRot * nObj);
    vec3 viewDir = normalize(-vP);

    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);

    float coreFactor = pow(max(dot(normal, viewDir), 0.0), 2.0);
    vec2 lensOffset = (screenUv - 0.5) * (CORE_REFRACT * 0.15) * coreFactor;

    vec3 refractView = refract(-viewDir, normal, 1.0 / IOR);
    vec2 offset = refractView.xy * (THICKNESS * 0.1) - lensOffset;

    vec3 reflectDir = reflect(-viewDir, normal);
    vec2 equirectUv = vec2(
        atan(reflectDir.z, reflectDir.x) / (2.0 * PI) + 0.5,
        asin(clamp(reflectDir.y, -1.0, 1.0)) / PI + 0.5
    );
    vec3 reflection = texture2D(uEnv, equirectUv).rgb * 2.5;

    vec3 transmission = vec3(0.0);
    float bgAlpha = 0.0;

    vec2 uvR = screenUv + offset * (1.0 + uDisp);
    vec2 uvG = screenUv + offset;
    vec2 uvB = screenUv + offset * (1.0 - uDisp);

    if (uFrost > 0.001) {
        float rnd = rand(screenUv) * 6.2831853;
        const int SAMPLES = 24;
        const float GOLDEN_ANGLE = 2.39996323;
        float radius = 0.0;
        float radiusStep = 1.0 / float(SAMPLES);
        float blurMultiplier = uFrost * 0.025;
        for (int i = 0; i < SAMPLES; i++) {
            float theta = float(i) * GOLDEN_ANGLE + rnd;
            radius += radiusStep;
            vec2 bo = vec2(cos(theta), sin(theta)) * radius * blurMultiplier;
            transmission.r += plate(uvR + bo).r;
            vec4 g = plate(uvG + bo);
            transmission.g += g.g;
            bgAlpha += g.a;
            transmission.b += plate(uvB + bo).b;
        }
        transmission /= float(SAMPLES);
        bgAlpha /= float(SAMPLES);
    } else {
        transmission.r = plate(uvR).r;
        vec4 g = plate(uvG);
        transmission.g = g.g;
        bgAlpha = g.a;
        transmission.b = plate(uvB).b;
    }

    transmission *= uTint;

    vec3 clearGlassTint = mix(uTint, reflection, 0.5);
    transmission = mix(clearGlassTint, transmission, bgAlpha);

    vec3 finalColor = mix(transmission, reflection, fresnel * 0.8);

    float baseAlpha = max(0.25, fresnel * 0.85);
    float outAlpha = mix(baseAlpha, 1.0, bgAlpha);

    gl_FragColor = vec4(finalColor, outAlpha);
}`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn("LiquidGlassCluster shader:", gl.getShaderInfoLog(s))
        gl.deleteShader(s)
        return null
    }
    return s
}

function link(gl: WebGLRenderingContext, vs: string, fs: string) {
    const v = compile(gl, gl.VERTEX_SHADER, vs)
    const f = compile(gl, gl.FRAGMENT_SHADER, fs)
    if (!v || !f) return null
    const p = gl.createProgram()!
    gl.attachShader(p, v)
    gl.attachShader(p, f)
    gl.linkProgram(p)
    gl.deleteShader(v)
    gl.deleteShader(f)
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.warn("LiquidGlassCluster link:", gl.getProgramInfoLog(p))
        return null
    }
    return p
}

const DEFAULT_FONT: Required<FontValue> = {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    fontSize: 96,
    fontWeight: 700,
    fontStyle: "normal",
    letterSpacing: 0,
    lineHeight: 1.1,
}

const DEFAULT_BACKDROP: Required<BackdropGroup> = {
    type: "Image",
    image: DUMMY_BACKDROP,
    video: "",
    text: "LIQUID\nGLASS",
    font: DEFAULT_FONT,
    textColor: "#FFFFFF",
}

const DEFAULT_GLASS: Required<GlassGroup> = {
    tint: "#FFFFFF",
    chromatic: 25,
    frost: 50,
}

const DEFAULT_ORIENT: Required<OrientGroup> = {
    angleX: 0,
    angleY: 0,
    angleZ: 0,
    offsetX: 0,
    offsetY: 0,
}

function __OriginkitBase_LiquidGlassCluster({
    className,
    style,
    background = "#000000",
    shape = "Torus",
    logo = DUMMY_LOGO,
    depth = 32,
    size = 60,
    speed = 100,
    direction = "Clockwise",
    backdrop,
    glass,
    orient,
}: LiquidGlassClusterProps) {
    const bd: Required<BackdropGroup> = {
        ...DEFAULT_BACKDROP,
        ...(backdrop ?? {}),

        font: { ...DEFAULT_FONT, ...(backdrop?.font ?? {}) },
    }
    const gl3: Required<GlassGroup> = { ...DEFAULT_GLASS, ...(glass ?? {}) }
    const or: Required<OrientGroup> = { ...DEFAULT_ORIENT, ...(orient ?? {}) }

    const hostRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const live = useRef({ background, shape, logo, depth, size, speed, direction, bd, gl3, or })
    live.current = { background, shape, logo, depth, size, speed, direction, bd, gl3, or }

    const rebuildSDF = useRef(true)
    const rebuildPlate = useRef(true)

    const logoSrc = srcOf(logo)
    const plateType = bd.type
    const plateImage = srcOf(bd.image)
    const plateVideo = srcOf(bd.video)
    const plateText = bd.text
    const plateTextColor = bd.textColor

    const plateFontKey = [
        bd.font.fontFamily,
        bd.font.fontSize,
        bd.font.fontWeight,
        bd.font.fontStyle,
        bd.font.letterSpacing,
        bd.font.lineHeight,
    ].join("|")

    useEffect(() => {
        rebuildSDF.current = true
    }, [logoSrc])

    useEffect(() => {
        rebuildPlate.current = true

    }, [plateType, plateImage, plateVideo, plateText, plateTextColor, plateFontKey, background])

    useEffect(() => {
        const canvasEl = canvasRef.current
        const hostEl = hostRef.current
        if (!canvasEl || !hostEl) return
        const canvas: HTMLCanvasElement = canvasEl
        const host: HTMLDivElement = hostEl

        const opts = { antialias: false, alpha: true, premultipliedAlpha: true }
        const ctx = (canvas.getContext("webgl2", opts) ||
            canvas.getContext("webgl", opts)) as WebGLRenderingContext | null
        if (!ctx) return

        const gl: WebGLRenderingContext = ctx

        const plateProg = link(gl, FULLSCREEN_VS, PLATE_FS)
        const glassProg = link(gl, FULLSCREEN_VS, GLASS_FS)
        if (!plateProg || !glassProg) return

        const uPlatePass = {
            plate: gl.getUniformLocation(plateProg, "uPlate"),
            fit: gl.getUniformLocation(plateProg, "uPlateFit"),
            res: gl.getUniformLocation(plateProg, "uRes"),
        }
        const u = {
            res: gl.getUniformLocation(glassProg, "uRes"),
            aspect: gl.getUniformLocation(glassProg, "uAspect"),
            tanHalf: gl.getUniformLocation(glassProg, "uTanHalf"),
            plate: gl.getUniformLocation(glassProg, "uPlate"),
            plateFit: gl.getUniformLocation(glassProg, "uPlateFit"),
            hasPlate: gl.getUniformLocation(glassProg, "uHasPlate"),
            env: gl.getUniformLocation(glassProg, "uEnv"),
            sdf: gl.getUniformLocation(glassProg, "uSDF"),
            rot: gl.getUniformLocation(glassProg, "uRot"),
            rotT: gl.getUniformLocation(glassProg, "uRotT"),
            center: gl.getUniformLocation(glassProg, "uCenter"),
            scale: gl.getUniformLocation(glassProg, "uScale"),
            boundR: gl.getUniformLocation(glassProg, "uBoundR"),
            shape: gl.getUniformLocation(glassProg, "uShape"),
            halfDepth: gl.getUniformLocation(glassProg, "uHalfDepth"),
            bevel: gl.getUniformLocation(glassProg, "uBevel"),
            torusTube: gl.getUniformLocation(glassProg, "uTorusTube"),
            logoHalf: gl.getUniformLocation(glassProg, "uLogoHalf"),
            sdfUnits: gl.getUniformLocation(glassProg, "uSdfUnits"),
            disp: gl.getUniformLocation(glassProg, "uDisp"),
            frost: gl.getUniformLocation(glassProg, "uFrost"),
            tint: gl.getUniformLocation(glassProg, "uTint"),
        }
        const aPlatePos = gl.getAttribLocation(plateProg, "aPos")
        const aGlassPos = gl.getAttribLocation(glassProg, "aPos")

        const quadBuf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

        function makeTex(wrap: number) {
            const t = gl.createTexture()
            gl.bindTexture(gl.TEXTURE_2D, t)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                1,
                1,
                0,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 0, 0])
            )
            return t
        }
        const plateTex = makeTex(gl.CLAMP_TO_EDGE)
        const sdfTex = makeTex(gl.CLAMP_TO_EDGE)

        const envTex = makeTex(gl.REPEAT)

        const envCanvas = buildEnvCanvas()
        if (envCanvas) {
            gl.bindTexture(gl.TEXTURE_2D, envTex)
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, envCanvas)
        }

        let vw = 1
        let vh = 1
        let dprCur = 1
        let sdfH = 1
        let sdfReady = false
        let logoAspect = 1

        function uploadSDF(alpha: Uint8ClampedArray, w: number, h: number, aspect: number) {
            const bytes = bakeSDF(alpha, w, h)
            sdfH = h
            logoAspect = aspect
            gl.bindTexture(gl.TEXTURE_2D, sdfTex)

            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, bytes)
            sdfReady = true
        }

        function bakeFallback() {
            uploadSDF(fallbackAlpha(320, 320), 320, 320, 1)
        }

        let sdfToken = 0
        function bakeLogo() {
            const url = srcOf(live.current.logo)
            if (!url) {
                bakeFallback()
                return
            }
            const token = ++sdfToken
            const img = new window.Image()
            img.crossOrigin = "anonymous"
            img.onload = () => {
                if (token !== sdfToken) return
                const scale = Math.min(
                    (SDF_MAX - SDF_PAD * 2) / Math.max(img.width, 1),
                    (SDF_MAX - SDF_PAD * 2) / Math.max(img.height, 1),
                    1
                )
                const iw = Math.max(1, Math.round(img.width * scale))
                const ih = Math.max(1, Math.round(img.height * scale))
                const w = iw + SDF_PAD * 2
                const h = ih + SDF_PAD * 2
                const c = document.createElement("canvas")
                c.width = w
                c.height = h
                const c2d = c.getContext("2d")
                if (!c2d) return
                c2d.clearRect(0, 0, w, h)
                c2d.drawImage(img, SDF_PAD, SDF_PAD, iw, ih)
                let data: ImageData
                try {
                    data = c2d.getImageData(0, 0, w, h)
                } catch {
                    bakeFallback()
                    return
                }
                uploadSDF(data.data, w, h, w / h)
            }
            img.onerror = () => {
                if (token === sdfToken) bakeFallback()
            }
            img.src = url
        }

        let plateReady = false
        let plateAspect = 1
        let video: HTMLVideoElement | null = null
        let plateToken = 0
        let fontsWaited = false

        function clearVideo() {
            if (!video) return
            video.pause()
            video.removeAttribute("src")
            video.load()
            video = null
        }

        function bakePlateText() {
            const p = live.current
            const w = Math.max(2, vw)
            const h = Math.max(2, vh)
            const c = document.createElement("canvas")
            c.width = w
            c.height = h
            const ctx2d = c.getContext("2d")
            if (!ctx2d) return

            const f = p.bd.font

            const fontPx = numOf(f.fontSize, 96) * dprCur
            const weight = f.fontWeight ?? 700
            const family = f.fontFamily || "Inter, system-ui, sans-serif"
            const fstyle = f.fontStyle || "normal"
            const lineH = numOf(f.lineHeight, 1.1) * fontPx
            const tracking = numOf(f.letterSpacing, 0) * dprCur

            ctx2d.clearRect(0, 0, w, h)

            ctx2d.fillStyle = p.background
            ctx2d.fillRect(0, 0, w, h)
            ctx2d.font = `${fstyle} ${weight} ${fontPx}px ${family}`
            ctx2d.textAlign = "center"
            ctx2d.textBaseline = "middle"
            ctx2d.fillStyle = p.bd.textColor || "#FFFFFF"

            const anyCtx = ctx2d as CanvasRenderingContext2D & { letterSpacing?: string }
            if ("letterSpacing" in anyCtx) anyCtx.letterSpacing = `${tracking}px`

            const lines = String(p.bd.text ?? "").split("\n")
            const top = h / 2 - ((lines.length - 1) * lineH) / 2
            for (let i = 0; i < lines.length; i++) {
                ctx2d.fillText(lines[i], w / 2, top + i * lineH)
            }

            plateAspect = w / h
            gl.bindTexture(gl.TEXTURE_2D, plateTex)
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c)
            plateReady = true

            if (!fontsWaited && typeof document !== "undefined" && document.fonts) {
                fontsWaited = true
                document.fonts.ready.then(() => {
                    if (live.current.bd.type === "Text") rebuildPlate.current = true
                })
            }
        }

        function loadPlate() {
            const p = live.current
            clearVideo()
            plateReady = false
            const token = ++plateToken

            if (p.bd.type === "Text") {
                bakePlateText()
                return
            }

            if (p.bd.type === "Image") {
                const url = srcOf(p.bd.image)
                if (!url) return
                const img = new window.Image()
                img.crossOrigin = "anonymous"
                img.onload = () => {
                    if (token !== plateToken) return
                    plateAspect = img.width / Math.max(img.height, 1)
                    gl.bindTexture(gl.TEXTURE_2D, plateTex)
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
                    plateReady = true
                }
                img.src = url
                return
            }

            if (p.bd.type === "Video") {
                const url = srcOf(p.bd.video)
                if (!url) return
                const v = document.createElement("video")
                v.crossOrigin = "anonymous"
                v.playsInline = true
                v.loop = true
                v.muted = true
                v.src = url
                v.play().catch(() => {
                })
                video = v
            }
        }

        function pumpVideo() {
            if (!video || video.readyState < 2 || !video.videoWidth) return
            plateAspect = video.videoWidth / Math.max(video.videoHeight, 1)
            gl.bindTexture(gl.TEXTURE_2D, plateTex)
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)
            plateReady = true
        }

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            dprCur = dpr
            const cw = canvas.clientWidth || host.clientWidth || 1
            const ch = canvas.clientHeight || host.clientHeight || 1
            const w = Math.max(1, Math.round(cw * dpr))
            const h = Math.max(1, Math.round(ch * dpr))
            if (w === vw && h === vh) return
            vw = w
            vh = h
            canvas.width = w
            canvas.height = h

            if (live.current.bd.type === "Text") rebuildPlate.current = true
        }

        const ro = new ResizeObserver(resize)
        ro.observe(canvas)
        resize()

        let baseYaw = 0
        let basePitch = 0

        let tiltX = 0
        let tiltY = 0
        let tiltTargetX = 0
        let tiltTargetY = 0
        let dragging = false
        let lastX = 0
        let lastY = 0

        function onPointerMove(e: PointerEvent) {
            if (dragging) {
                baseYaw += (e.clientX - lastX) * DRAG_GAIN
                basePitch += (e.clientY - lastY) * DRAG_GAIN
                basePitch = Math.max(-1.4, Math.min(1.4, basePitch))
                lastX = e.clientX
                lastY = e.clientY
                return
            }

            const r = canvas.getBoundingClientRect()
            tiltTargetX = (((e.clientX - r.left) / Math.max(r.width, 1)) * 2 - 1) * TILT_RANGE
            tiltTargetY = (-((e.clientY - r.top) / Math.max(r.height, 1)) * 2 + 1) * TILT_RANGE
        }
        function onPointerDown(e: PointerEvent) {
            dragging = true
            lastX = e.clientX
            lastY = e.clientY
        }
        function onPointerUp() {
            dragging = false
        }
        function onLeave() {
            if (!dragging) {
                tiltTargetX = 0
                tiltTargetY = 0
            }
        }

        canvas.addEventListener("pointerdown", onPointerDown)
        canvas.addEventListener("pointerleave", onLeave)

        window.addEventListener("pointermove", onPointerMove)
        window.addEventListener("pointerup", onPointerUp)
        window.addEventListener("pointercancel", onPointerUp)

        gl.disable(gl.DEPTH_TEST)
        gl.enable(gl.BLEND)

        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
        gl.clearColor(0, 0, 0, 0)

        let raf = 0
        let prev = performance.now()
        let elapsed = 0

        function frame(now: number) {
            raf = requestAnimationFrame(frame)
            const dt = Math.min((now - prev) / 1000, 0.05)
            prev = now
            elapsed += dt
            const p = live.current

            if (rebuildSDF.current) {
                rebuildSDF.current = false
                bakeLogo()
            }
            if (rebuildPlate.current) {
                rebuildPlate.current = false
                loadPlate()
            }
            if (video) pumpVideo()

            const isLogo = p.shape === "Logo"
            if (isLogo && !sdfReady) return

            const k = 1 - Math.exp(-TILT_RATE * dt)
            tiltX += (tiltTargetX - tiltX) * k
            tiltY += (tiltTargetY - tiltY) * k

            const spin = (p.speed / 50) * (p.direction === "Counterclockwise" ? -1 : 1)
            baseYaw += spin * SPIN_YAW * dt
            basePitch += spin * SPIN_PITCH * dt

            const o = p.or
            const yaw = baseYaw + tiltX + o.angleY * DEG
            const pitch = Math.max(-1.45, Math.min(1.45, basePitch - tiltY)) + o.angleX * DEG
            const rot = rotYXZ(yaw, pitch, o.angleZ * DEG)
            const rotT = transpose3(rot)

            const camDist = CAM_DIST
            const halfFrame = camDist * Math.tan(FOV / 2)
            const targetHalf = Math.max(0.02, p.size / 100) * halfFrame

            const nativeDepth = Math.max(0, p.depth / 100)
            const torusTube = Math.max(0.02, nativeDepth * 0.5)
            let refHalf: number
            let boundR: number
            let shapeId: number
            let halfDepth = nativeDepth * 0.5
            let bevel = BEVEL
            let logoHalfX = 1
            let logoHalfY = 1

            if (p.shape === "X") {
                shapeId = 0
                refHalf = 1.3
                boundR = Math.hypot(1.3, 0.35) + halfDepth + bevel
            } else if (p.shape === "Torus") {
                shapeId = 1
                refHalf = 0.8 + torusTube
                boundR = 0.8 + torusTube
            } else if (p.shape === "Sphere") {
                shapeId = 2
                refHalf = 1.2
                boundR = 1.2
            } else {
                shapeId = 3
                logoHalfY = 1
                logoHalfX = logoAspect
                refHalf = 1

                halfDepth *= refHalf / 1.3
                bevel *= refHalf / 1.3
                boundR = Math.hypot(logoHalfX, logoHalfY, halfDepth) + bevel
            }

            const scale = targetHalf / refHalf
            const floatY = Math.sin(elapsed * 2) * IDLE_FLOAT

            const screenAspect = vw / vh
            const fitX = screenAspect > plateAspect ? 1 : screenAspect / plateAspect
            const fitY = screenAspect > plateAspect ? plateAspect / screenAspect : 1
            const hasPlate = plateReady && p.bd.type !== "None" ? 1 : 0

            gl.viewport(0, 0, vw, vh)
            gl.clear(gl.COLOR_BUFFER_BIT)

            gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)

            if (hasPlate) {
                gl.useProgram(plateProg)
                gl.activeTexture(gl.TEXTURE0)
                gl.bindTexture(gl.TEXTURE_2D, plateTex)
                gl.uniform1i(uPlatePass.plate, 0)
                gl.uniform2f(uPlatePass.fit, fitX, fitY)
                gl.uniform2f(uPlatePass.res, vw, vh)
                gl.enableVertexAttribArray(aPlatePos)
                gl.vertexAttribPointer(aPlatePos, 2, gl.FLOAT, false, 0, 0)
                gl.drawArrays(gl.TRIANGLES, 0, 3)
            }

            gl.useProgram(glassProg)
            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, plateTex)
            gl.uniform1i(u.plate, 0)
            gl.activeTexture(gl.TEXTURE1)
            gl.bindTexture(gl.TEXTURE_2D, envTex)
            gl.uniform1i(u.env, 1)
            gl.activeTexture(gl.TEXTURE2)
            gl.bindTexture(gl.TEXTURE_2D, sdfTex)
            gl.uniform1i(u.sdf, 2)

            gl.uniform2f(u.res, vw, vh)
            gl.uniform1f(u.aspect, screenAspect)
            gl.uniform1f(u.tanHalf, Math.tan(FOV / 2))
            gl.uniform2f(u.plateFit, fitX, fitY)
            gl.uniform1f(u.hasPlate, hasPlate)

            gl.uniformMatrix3fv(u.rot, false, rot)
            gl.uniformMatrix3fv(u.rotT, false, rotT)

            gl.uniform3f(
                u.center,
                (o.offsetX / 100) * halfFrame * screenAspect,
                floatY + (o.offsetY / 100) * halfFrame,
                -camDist
            )
            gl.uniform1f(u.scale, scale)
            gl.uniform1f(u.boundR, boundR)

            gl.uniform1f(u.shape, shapeId)
            gl.uniform1f(u.halfDepth, halfDepth)
            gl.uniform1f(u.bevel, bevel)
            gl.uniform1f(u.torusTube, torusTube)
            gl.uniform2f(u.logoHalf, logoHalfX, logoHalfY)

            gl.uniform1f(u.sdfUnits, (SDF_SPREAD * (2 * logoHalfY)) / Math.max(sdfH, 1))

            const g = p.gl3
            gl.uniform1f(u.disp, g.chromatic / 1000)
            gl.uniform1f(u.frost, g.frost / 100)
            const tint = parseColor(g.tint, [1, 1, 1])
            gl.uniform3f(u.tint, tint[0], tint[1], tint[2])

            gl.enableVertexAttribArray(aGlassPos)
            gl.vertexAttribPointer(aGlassPos, 2, gl.FLOAT, false, 0, 0)
            gl.drawArrays(gl.TRIANGLES, 0, 3)
        }
        raf = requestAnimationFrame(frame)

        return () => {
            cancelAnimationFrame(raf)
            sdfToken++
            plateToken++
            clearVideo()
            ro.disconnect()
            canvas.removeEventListener("pointerdown", onPointerDown)
            canvas.removeEventListener("pointerleave", onLeave)
            window.removeEventListener("pointermove", onPointerMove)
            window.removeEventListener("pointerup", onPointerUp)
            window.removeEventListener("pointercancel", onPointerUp)
        }
    }, [])

    return (
        <div
            ref={hostRef}
            className={className}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                background,
                touchAction: "none",
                ...style,
            }}
        >
            <canvas
                ref={canvasRef}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
            />
        </div>
    )
}

const __originkitPresetProps = {
  "orient": {
    "angleX": 100,
    "angleY": 0,
    "angleZ": 0,
    "offsetX": 0,
    "offsetY": 0
  }
};

export default function LiquidGlassCluster(props: Record<string, unknown>) {
  return <__OriginkitBase_LiquidGlassCluster {...(__originkitPresetProps as Record<string, unknown>)} {...props} />;
}
