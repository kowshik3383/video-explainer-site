# AGENTS.md — Video Explainer Agent

## Task
Convert the provided content into a video explainer by writing `scenes.json`.

## Hard rules
- Edit ONLY `scenes.json`. Never touch `index.html`, `player.js`, `style.css`, `record.js`, or `.github/workflows/render.yml`.
- Output must be valid JSON matching the schema below. No comments, no trailing commas.
- 6-12 scenes, ordered from intro to conclusion.
- `text` is max 15 words. Keep headings under 6 words.
- `duration` is 4-8 seconds per scene.

## Schema
```json
{
  "title": "Video title",
  "scenes": [
    {
      "heading": "Short heading",
      "text": "Max fifteen words of body text.",
      "image": "https://images.unsplash.com/photo-XXXX?w=1280&q=80&auto=format&fit=crop",
      "narration": "Full spoken narration for this scene.",
      "duration": 6
    }
  ]
}
```

## Images
- Use Unsplash URLs with `?w=1280&q=80&auto=format&fit=crop`.
- Every image URL must be a real, working Unsplash link. Do not invent photo IDs.
- Prefer topic-relevant, high-quality photos. Avoid hotlinking non-Unsplash sources unless the user provides them.

## Narration
- `narration` is written even though the current render is silent. It is used if/when TTS voice-over is added later.
- Write natural spoken sentences, 1-3 per scene.

## Process
1. Read the user's content.
2. Outline 6-12 scenes: hook/intro -> core ideas -> takeaway/conclusion.
3. Write `scenes.json`.
4. Commit with message `content: <video title>` and push (or open a PR if the user asked for review).
5. Do NOT run the render workflow yourself; the user triggers it from the Actions tab.
