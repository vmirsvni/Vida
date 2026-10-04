# Vida Beauty — AI image prompts (one campaign)

Use these to generate **original** replacement imagery (Midjourney v6+, Flux, Imagen…) that matches the demo's art direction.
Every prompt shares the same **campaign suffix** so all images look like one shoot.

**Campaign suffix (append to every prompt):**

> luxury beauty campaign, Iranian / Middle Eastern woman, natural skin texture with visible pores, soft window light from the left, warm ivory and deep burgundy (#35051F) palette with champagne accents, 85mm lens, f/2, shallow depth of field, premium matte colour grading, quiet luxury, editorial, realistic, no plastic skin, no heavy makeup, no text, no logo

**Negative prompt:** plastic skin, airbrushed, uncanny face, distorted eyes, extra fingers, fake eyebrows, heavy contour, glitter overload, neon, oversaturated, cheap stock photo, salon interior clutter, watermark, text

**Consistency tips:** keep one model (or two) across the set, same wardrobe tones (ivory silk, burgundy), same light direction. Export at ≥ 2000px on the long side, then drop the file into `public/images/` and update `src/data/media.ts`.

| Slot (`media.ts` key) | Ratio | Prompt |
|---|---|---|
| `hero` | 4:5 / 2:3 | close-up beauty portrait, direct calm gaze, full natural brows perfectly shaped, minimal makeup, hair falling softly, burgundy backdrop fading to dark |
| `svc-microblading` | 4:5 | portrait from shoulders up, brows with fine hair-like strokes, bare shoulder, chin resting on shoulder, dark warm studio background |
| `svc-fibroze` | 4:5 | extreme close-up of one eye and eyebrow, hair strokes following natural growth direction, soft light raking across the brow |
| `svc-vibroze` | 4:5 | three-quarter profile, eyes lowered, elegant defined brow, hand touching cheek, burgundy silk scarf |
| `svc-lip` | 4:5 | close-up of lips with soft natural rosy lip blush, even colour, relaxed mouth, skin texture visible |
| `svc-eyeliner` | 4:5 | close-up of eye with a fine, delicate semi-permanent eyeliner along the lash line, brown iris, subtle wing |
| `founder` | 4:5 | portrait of a confident PMU artist in her 30s, ivory blouse, hands relaxed, warm studio, calm professional expression |
| `editorial-profile` | 4:5 | side profile, hair tied back, champagne gold earring, burgundy background, cinematic |
| `editorial-closed` | 4:5 | eyes closed, head tilted, soft glowing skin, hand near face with a thin gold ring |
| `academy-brow` | 3:2 | artist's gloved hand mapping an eyebrow with a fine pencil on a model, macro, calm focus |
| `academy-liner` | 3:2 | artist applying fine eyeliner with a precision brush, model's eyes closed, shallow depth of field |
| `brow-before` / `brow-after` | 4:5 | **same framing & light for both:** eye-and-brow close-up; *before*: sparse, uneven light brows; *after*: full natural brows. Real client photos (with consent) are strongly preferred here |
| `lip-before` / `lip-after` | 4:5 | same framing for both; *before*: pale uneven lip colour; *after*: soft natural lip blush |
| `lip-*`, `eye-*`, `brow-*` (portfolio) | 4:5 / 1:1 | macro details of brows, lips and eyes in the same light and palette |
| `rose-profile`, `soft-face` (Instagram) | 1:1 | editorial moments: profile with a single rose, soft-focus face through silk |
| `podium` | 16:9 | empty champagne-toned podium on warm ivory, soft botanical shadow — used behind the final CTA |

> Never present AI images as real clients. Keep the «نمونه تصویری دمو» label until real, consented photos replace them.

## Demo 2 slots (`src/data/media2.ts`)

Same campaign suffix, but shift the palette to **dusty rose, mauve (#6F4541) and blush**, brighter and softer contrast.

| Slot | Ratio | Prompt |
|---|---|---|
| `d2-hero` | 16:9 | woman in profile facing right, eyes closed, serene, full natural brows, warm mauve-burgundy wall filling the right half (space for text), soft side light |
| `d2-interior` | 16:10 | calm PMU studio interior, arched mirrors, blush and cream tones, one treatment chair, morning light |
| `d2-cream` | 3:4 | a single swatch of ivory cream on a nude surface, soft shadow, top-down macro |
