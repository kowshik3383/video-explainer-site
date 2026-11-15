# AGENTS.md — Video Explainer Agent

## Task
Convert the provided content into a video explainer by writing `docs/scenes.json`.

## Hard rules
- Edit ONLY `docs/scenes.json`. Never touch `docs/player.html`, `docs/player.js`, `docs/style.css`, `docs/tokens.css`, `record.js`, `DESIGN.md`, `docs/preview.html`, `scenes.schema.json`, or `.github/workflows/render.yml`.
- Output must be valid JSON. No comments, no trailing commas.
- Follow the Reels design system in `DESIGN.md` (tokens, scene types, art direction, writing rules).
- 6-12 scenes, ordered from intro to conclusion: `title` -> content/stat/bullets/quote scenes -> `outro`.
- `duration` is 4-10 seconds per scene (integer).
- Headings ≤ 6 words. Body text ≤ 15 words.
- Run `npm run validate` before committing. It must pass.

## Scene types
Each scene REQUIRES `type` and `duration`.

### title (intro)
`heading` (required), `kicker`, `text`, `narration`
```json
{ "type": "title", "kicker": "Science Explained", "heading": "How Photosynthesis Works", "text": "Sunlight in. Food and oxygen out.", "duration": 6 }
```

### content (main split scene)
`heading`, `text` (required) + optional `kicker`, `image`, `badge` (≤3 words, e.g. "The recipe")
```json
{ "type": "content", "kicker": "The Setup", "heading": "Three ingredients", "text": "Sunlight, water, and carbon dioxide.", "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&q=80&auto=format&fit=crop", "badge": "The recipe", "duration": 6 }
```

### stat (one big number)
`stat`, `text` (required) + optional `kicker`, `source`
```json
{ "type": "stat", "kicker": "By The Numbers", "stat": "50%", "text": "Of Earth's oxygen comes from ocean phytoplankton.", "source": "The ocean is the planet's largest forest", "duration": 7 }
```

### bullets (checklist)
`heading`, `bullets` (required, 2-5 items, each ≤ 6 words) + optional `kicker`
```json
{ "type": "bullets", "kicker": "The Equation", "heading": "What happens in a leaf", "bullets": ["Sunlight splits water apart", "Carbon dioxide builds glucose", "Oxygen is released"], "duration": 7 }
```

### quote
`quote` (required, ≤ 12 words) + optional `attribution`
```json
{ "type": "quote", "quote": "Nearly every breath you take came from a leaf.", "attribution": "Every living thing on Earth", "duration": 6 }
```

### outro (end card)
`heading` (brand wordmark) + optional `text` (tagline), `cta`
```json
{ "type": "outro", "heading": "Reels", "text": "Sunlight in. Life out.", "cta": "Follow for more", "duration": 5 }
```

Optional top-level `"brand": "Reels"` overrides the watermark wordmark (default REELERS).

## Images
- Unsplash only, with `?w=1280&q=80&auto=format&fit=crop`. Every URL must be real — never invent photo IDs.
- One clear subject per scene. Natural light preferred.

## Narration
- `narration` is written even though the render is silent; it feeds a future TTS step.
- 1-3 natural spoken sentences per scene.

## Process
1. Read the user's content.
2. Outline scenes: title -> 4-9 body scenes (content/stat/bullets/quote) -> outro.
3. Write `docs/scenes.json`, then `npm run validate`.
4. Commit with message `content: <video title>` and push (or open a PR if the user asked).
5. Do NOT run the render workflow; the user triggers it from the Actions tab.
