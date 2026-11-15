# Reels — Video Explainer Design System

Derived from the Reels marketing site reference: pale-mint page, white rounded frame, soft green gradient panels, editorial serif display type, butter-yellow and emerald accents, generous pill radii, soft diffuse shadows.

## Foundations (tokens.css)

| Token | Value |
|---|---|
| `--color-page` | #E9F4EC — mint page behind the frame |
| `--color-frame` | #FFFFFF — the rounded video frame |
| `--color-panel-start` → `--color-panel-end` | #DDF3E3 → #BDE9CB — signature green gradient panel |
| `--color-ink` | #10130F — primary text |
| `--color-ink-soft` / `--color-ink-faint` | 72% / 45% ink — secondary / meta text |
| `--color-accent-yellow` | #F7DC7D — floating badges, highlight pills |
| `--color-accent-green` | #2E9E63 — checks, progress, quote mark |
| `--color-hairline` | 14% ink — divider lines |

### Typography
- Display / headlines: **Fraunces** (variable serif, opsz) — 560–620 weight, tight tracking.
- Body / labels / kickers: **Inter** — 400–700 weight.
- Scale: kicker 15px (uppercase, 0.16em tracking) · body 24/28px · H2 54px · title display 108px · stat 150px.
- Line height: display 1.02, body 1.4.

### Shape & depth
- Radii: frame 32px · panel 26px · card 22px · pill 999px.
- Shadows are soft and green-tinted: frame `0 40px 80px rgba(16,40,24,.28)`, card `0 24px 60px rgba(16,40,24,.22)`, pill `0 10px 28px rgba(16,40,24,.16)`.
- Scene composition: 1280×720 stage → white rounded frame → 16px inset → gradient panel. Copy sits on the left; imagery on the right as a rounded card with a yellow floating badge overlapping its top-left corner.

### Motion
- Enter: panel fades in 0.35s; contents stagger up 34px → 0 over 0.75s, 90ms stagger, `power3.out`.
- Exit: scene fades out 0.35s. Progress bar fills linearly over scene duration.

## Scene types (scenes.json `type`)

| Type | Required | Purpose |
|---|---|---|
| `title` | heading | Intro. Kicker + giant Fraunces headline + optional one-line text. |
| `content` | heading, text | Workhorse split scene. Optional right-side image card + yellow `badge`, optional `kicker`. |
| `stat` | stat, text | One hero number + supporting line. Optional `kicker`, `source` (uppercase meta line). |
| `bullets` | heading, bullets[] | 2–5 checklist pills with emerald check icons on white. |
| `quote` | quote | Large italic Fraunces quote with emerald quote mark. Optional `attribution`. |
| `outro` | — | End card: brand mark + wordmark, tagline (`text`), black pill `cta`. |

Common fields: `kicker` (≤48 chars), `narration` (written even when silent), `duration` (4–10s, integer). Optional top-level `brand` overrides the watermark wordmark (default REELERS).

## Art direction
- Photography: Unsplash only, `?w=1280&q=80&auto=format&fit=crop`. Prefer natural light, human/nature subjects, no busy collages. One subject per scene.
- Card treatment: full-bleed photo inside `--radius-card`, soft shadow, single yellow badge with a short label (≤3 words).
- No more than one accent per scene (yellow badge OR green check OR emerald quote mark).

## Writing rules
- Headings ≤ 6 words. Body text ≤ 15 words. One idea per scene.
- Kicker is a category label in Title Case (e.g. "The Setup"), not a sentence.

## Validation
`npm run validate` checks scenes.json against `scenes.schema.json` (ajv). The render workflow runs it before recording — invalid content fails the job before any video is produced. Preview all types locally via `preview.html`.

## Do / Don't
- Do: keep one idea per scene, real image URLs, type scale from tokens only.
- Don't: hardcode hex values in scenes, use more than one image per scene, change player/index files for content-only updates.
