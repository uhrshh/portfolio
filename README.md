# Arsh — portfolio

A dark, typographic single-page portfolio built on Next.js (App Router), using the
four Originkit React components as its moving parts.

---

## Running it

Node 24.21.0 (LTS) is installed at `~/.local/node` — a plain user-local extract
from nodejs.org, SHA256-verified against the official `SHASUMS256.txt`. Nothing
was installed system-wide and no sudo was used. To remove it: delete that folder
and the PATH line at the bottom of `~/.zshrc`.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm test        # geography tests for the globe's flag tinting
```

Verified on this machine: `tsc --noEmit` passes with zero errors, `next build`
succeeds (166 kB First Load JS, fully static prerender), and the running page
has no console errors.

## Layout

```
app/
  layout.tsx        metadata, fonts, <html> shell
  page.tsx          section order
  globals.css       the entire design system — colours, type scale, every section
components/
  GlobeStudy.tsx          ┐
  KineticTextGrid.tsx     │ your four Originkit components,
  LiquidGlassButton.tsx   │ unmodified
  LiquidGlassCluster.tsx  ┘
  site/
    content.ts      ← ALL copy lives here. Edit this, not the components.
    Hero / About / Experience / Work / Education / Contact ...
    Reveal.tsx      scroll-into-view fade
    LazyMount.tsx   defers canvas/WebGL work until it's near the viewport
public/
  arsh-resume.pdf   linked from the hero and contact section
```

### Editing content

Everything — bio, jobs, projects, skills, links — is in
`components/site/content.ts`. Paragraphs in `about` support `**bold**`.

---

## Where each component is used

| Component | Section | Notes |
|---|---|---|
| `KineticTextGrid` | Hero | A dim wall of `ARSH` behind a crisp `<h1>`. |
| `LiquidGlassCluster` | Hero | The glass ring encircling the name — also the light/dark switch. |
| `GlobeStudy` | About | Dot-matrix Earth; India and the USA in flag colours. |
| `LiquidGlassButton` | Hero | Résumé + Get in touch. |

### The ring is the theme switch

The torus sits face-on (`speed={0}`) and is sized from the measured width of
the `<h1>`, so it encircles the name at any viewport. Clicking it toggles
light/dark.

Its hit area is an SVG `<circle>` with `pointer-events: all`, so the whole disc
enclosed by the ring responds — including the name in the middle. Two
consequences worth knowing:

- `.hero__title` carries `pointer-events: none` and sits at `z-index: 2`,
  below the disc. The name is therefore **not selectable**; that is the cost of
  clicking it toggling the theme.
- `.hero__overlay` sits *above* the disc at `z-index: 4`, so the résumé buttons
  always win a click even on a short landscape viewport where the ring grows
  large enough to overlap them. `.hero__foot` is `pointer-events: none` so only
  the controls themselves catch clicks, not the empty width beside them.

There is no hover style on the ring. With the whole disc hit-testable, a hover
rule would paint a wide stroke over the glass torus the moment the cursor
entered the middle of the hero — the hover cue is the caption below the ring
instead.

Focus handling is deliberate: `onMouseDown` calls `preventDefault()` so pointer
interaction never focuses the circle (no outline lingering after a click), which
leaves plain `:focus` free to act as a keyboard-only indicator. It is keyed on
`:focus` rather than `:focus-visible` because the latter was not matching
reliably on this SVG element, which would have left keyboard users with no
indicator at all.

A pre-paint script in `app/layout.tsx` stamps `data-theme` before first paint so
the page never flashes the wrong palette, and `<html>` carries
`suppressHydrationWarning` because that script mutates it before React
hydrates. The choice persists in `localStorage`; without one, the OS preference
wins.

Colours live in `app/globals.css` as `:root` (dark) and `:root[data-theme="light"]`.
The canvas components can't read CSS variables, so their colours come from
`themeColors()` in `ThemeProvider.tsx` — update both together.

### Globe orientation

`components/globeProjection.ts` holds the sphere maths, unit-tested in
`globeProjection.test.ts`. Two things it fixes:

- **The globe used to be mirror-imaged.** The original mapping was
  `x = cosφ·cos(λ+spin)`, `z = cosφ·sin(λ+spin)`, which puts *increasing
  longitude to the left* — the Americas ended up east of Africa. Swapping sin
  and cos puts east on the right, and makes a positive drift the real direction
  of the Earth's rotation (a point on the visible face travels right).
- **It was tipped the wrong way.** A tilt of `-0.36 rad` centred the view on
  20.6°S with the north pole hidden behind the globe, which also pushed India
  and the USA — both northern-hemisphere, both flag-tinted — up against the
  limb where they foreshorten to nothing. It is now `+0.36`, centring on
  20.6°N. Dragging was inverted to match: drag down and the top of the sphere
  rolls toward you.

### Globe flag tinting

`components/flagTint.ts` paints India's tricolour and the US flag onto the dot
grid. Two deliberate compromises, both forced by resolution:

- **Outlines, not bounding boxes.** A box around India also swallows Pakistan,
  Nepal and Bangladesh. Since tinting only applies to dots the land mask already
  accepted, the rings are drawn tight against neighbouring countries and
  generous offshore.
- **Five stripes, not thirteen.** Real stripes are ~1.96° tall — finer than the
  ~1.8° dot grid — so they alias into noise. Five bands survive the sampling and
  still read as the flag next to the union.

White bands fall through to `baseColor` rather than literal white, so they stay
legible in both themes. Alaska is included; Hawaii is too small to register.

`npm test` checks 36 cases — that Indian and US cities get the right band, and
that Lahore, Dhaka, Kathmandu, Thimphu, Colombo, Tijuana, Monterrey, Toronto,
Vancouver and Havana get nothing.

### Integration details worth knowing

These are real behaviours of the components that needed handling — if you move
them around, carry these along:

1. **`GlobeStudy` hijacks page scroll.** It attaches a non-passive `wheel`
   listener that calls `preventDefault()`. It returns *before* that call when
   `pointer.zoom <= 0`, so the About globe passes `pointer={{ zoom: 0 }}`.
   Turning zoom back on means the page stops scrolling whenever the cursor is
   over the globe.

2. **`GlobeStudy` hard-codes `minWidth: 1200, minHeight: 800`** on its root
   element, which blows out any responsive layout. Overridden inline via
   `style`, with a CSS backstop in `.about__globe > div`.

3. **`LiquidGlassCluster` sets `touch-action: none`**, which traps vertical
   scrolling on touch devices across its full-bleed section. Overridden to
   `pan-y`.

4. **`LiquidGlassCluster` never calls `loseContext()`** on unmount. `LazyMount`
   therefore mounts it once and never unmounts — repeatedly remounting would
   walk into the browser's per-page WebGL context limit.

5. **Frost costs samples for nothing here.** With `backdrop.type: "None"` there
   is no plate to blur, so the contact section passes `frost: 0` to skip the
   shader's 24-tap loop.

---

## Before you launch

- [ ] **The résumé PDF in `public/` contains your phone number and both email
      addresses.** I deliberately left the phone out of the site's HTML, but
      anyone can download the PDF and read it there. If you don't want it
      public, publish a phone-free version of the PDF.
- [ ] Set your real domain in `app/layout.tsx` (`const SITE`) — it drives the
      canonical URL and social card metadata.
- [ ] Add **live demo** links for FinSight and SignSprout — the GitHub repos are
      wired up, but a hosted demo is the thing recruiters actually click. Add to
      the `links` array in `content.ts`.
- [ ] Add an OG image at `public/og.png` (1200×630) and reference it in
      `metadata.openGraph.images`.

## Deploying

The site is a fully static Next.js build, so Vercel needs no configuration.

### 1. Push to GitHub

```bash
git remote add origin https://github.com/uhrshh/portfolio.git
git push -u origin main
```

Create the empty repo at <https://github.com/new> first — no README, no
.gitignore, or the push will be rejected as a non-fast-forward. When git asks
for a password, it wants a **personal access token**
(<https://github.com/settings/tokens>), not your account password.

### 2. Import to Vercel

<https://vercel.com/new> → sign in with GitHub → pick the repo → Deploy.
Framework, build command and output directory are all detected. You get a URL
like `arsh-portfolio.vercel.app`, and every later `git push` redeploys.

`site.config.ts` falls back to Vercel's own production URL, so canonical links,
the social card, robots.txt and sitemap.xml are all correct on that first
deploy without setting anything.

### 3. Attach a custom domain, whenever you get one

1. Vercel → your project → **Settings → Domains** → add the domain.
2. At your registrar, add the records Vercel shows you — usually an `A` record
   for the apex (`@` → `76.76.21.21`) and a `CNAME` for `www` →
   `cname.vercel-dns.com`. Vercel issues the HTTPS certificate itself.
3. Vercel → **Settings → Environment Variables** → add
   `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com` (no trailing slash),
   then redeploy so the metadata picks it up.

DNS usually propagates in minutes, occasionally up to a day.

---
