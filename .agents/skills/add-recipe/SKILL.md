---
name: add-recipe
description: When the user shares a recipe link (website, blog, Instagram Reel/post, YouTube, TikTok, Facebook, Pinterest, etc.) or pastes recipe text and wants it added to the family cookbook. Use when the user says "add this recipe", "save this", "put this in the cookbook", or just pastes a cooking link. Extracts ingredients + step-by-step method, converts all measurements to Hong Kong metric units (g, ml, °C), pulls images/video, files it under the right type, and updates the GitHub Pages cookbook site.
license: MIT
metadata:
  author: Family Cookbook
  version: 1.0.0
---

# Add Recipe to the Family Cookbook

You turn any recipe link (or pasted text) into a clean, structured recipe in this site's
cookbook. Everything is standardized to **Hong Kong metric units (g, ml, °C)**, filed under a
fixed set of categories, and the catalog index is kept in sync so the site updates automatically.

The cookbook lives in this repository:
- `recipes/index.json` — the catalog (one lightweight entry per recipe)
- `recipes/<slug>.json` — the full recipe data
- `images/<slug>/` — downloaded hero and step images
- `index.html` + `assets/` — the website (do not edit when adding a recipe)

## Workflow (follow in order)

### 1. Identify the source
Look at the URL (or note "pasted text"). Match it to a platform:
`website/blog`, `instagram`, `youtube`, `tiktok`, `facebook`, `pinterest`, `reddit`, `twitter`.
Then follow **`references/extraction-playbook.md`** for the exact tool and method per platform.

Summary of tools available to you:
- **Websites/blogs** → `WebFetch` (ask it to return the full recipe: title, ingredients, steps, image URLs). Many sites embed JSON-LD `Recipe` schema — extract it if present, it's the cleanest source.
- **Instagram / TikTok / YouTube / Facebook / Twitter** → the **Apify Actors** MCP tools (`apify--instagram-scraper`, `streamers--youtube-scraper`, `clockworks--tiktok-scraper`, `apify--facebook-posts-scraper`, `apidojo--tweet-scraper`). These return the caption/description, the video and thumbnail URLs, and (for YouTube) often a transcript. Use the caption **and** the transcript to reconstruct the recipe.
- **General fallback** → `WebSearch` to find the written version of a recipe that only exists in a video, or to fill gaps.

If a source has only a video and no written recipe, reconstruct the ingredients and steps from
the transcript + caption. Note in `notes` that the method was transcribed from video.

### 2. Extract the recipe
Pull out:
- **Title** (and a Chinese title `title_zh` if the dish has a common Cantonese/Chinese name — add it even if the source is English, when you're confident).
- **Ingredients**: item, quantity, unit, and any prep note ("finely diced").
- **Steps**: clear, numbered, imperative instructions. Merge rambling video narration into tight steps.
- **Servings**, **prep/cook/total time** if available.
- **Media**: the main image (hero) + any per-step images, and the video URL.

### 3. Convert ALL measurements to Hong Kong metric
This is mandatory. Use **`references/conversions.md`**.
- Weights → **grams (g)** or kilograms for large amounts.
- Volumes → **millilitres (ml)** or litres.
- Temperatures → **°C** (oven temps too).
- Convert US/UK cups, ounces, pounds, °F, tbsp/tsp, "sticks" of butter, etc.
- For volume-to-weight (e.g. "1 cup flour"), use the ingredient density table in conversions.md
  to give a sensible gram weight. When in doubt for a dry ingredient measured by volume, keep the
  spoon/cup measure too.
- **Always keep the original** measurement in the `original` field so nothing is lost.
- Round to cooking-sensible numbers (e.g. 453.6 g → 450 g; 236 ml → 240 ml).

### 3b. Translate ingredients & steps to Boso Suroboyoan
The household cook reads **Boso Suroboyoan** (Surabaya Javanese), so every recipe must also carry a
Suroboyoan version of the cooking content. Use **`references/suroboyoan-translation.md`**.
- Translate into each ingredient's `item_su` and `note_su`, each step's `text_su`, plus `title_su`
  and `notes_su`. Keep all **numbers and metric units the same** — only the words translate
  (e.g. `270 ml` stays `270 ml`; "Warm water" → "Banyu anget").
- Write natural, informal **Ngoko Suroboyoan** (the everyday Surabaya register), not formal Indonesian
  — use the dialect markers and cooking vocabulary in the reference (`gak`, `nang`, `ambek`, `-no`
  verb endings, `endhog`, `uyah`, `godhok`, `goreng`, `tumis`, …).
- It's fine to keep widely-used kitchen loanwords (e.g. `kecap`, `porsi`). If a term is genuinely
  uncertain, keep it simple and clear — the cook can refine wording later.

### 4. Categorize (fixed taxonomy — pick exactly one `type`)
Choose the single best fit. Keep these labels EXACT (the site groups and shows emoji by them):

| type label            | use for…                                                |
|-----------------------|---------------------------------------------------------|
| `Breakfast`           | eggs, congee, breakfast plates, morning food            |
| `Mains`               | main dishes, meat/fish/tofu centrepieces, stir-fries    |
| `Soups`               | soups, broths, 老火湯                                    |
| `Noodles & Rice`      | noodle dishes, fried rice, claypot rice, pasta          |
| `Vegetables & Sides`  | vegetable dishes, small side dishes, salads             |
| `Dim Sum & Snacks`    | dumplings, buns, finger food, snacks, street food       |
| `Desserts & Sweets`   | desserts, 糖水, puddings, ice cream                      |
| `Baking`              | bread, cakes, cookies, pastry, anything baked           |
| `Drinks`              | tea, coffee, smoothies, cocktails, 飲品                  |
| `Sauces & Basics`     | sauces, stocks, doughs, pastes, condiments, basics      |

Add freeform `tags` (e.g. `chicken`, `spicy`, `quick`, `weeknight`, `vegetarian`) for search.

### 5. Pull the media — ALWAYS capture a thumbnail of the finished dish
Every recipe must have a **hero image of the finished dish** — it's the card thumbnail in the
cookbook and the most important visual. Always try hard to capture it from the source content.

Create `images/<slug>/` and download with `Bash` + `curl` (the `-A` user-agent matters for social CDNs):
```bash
mkdir -p images/<slug>
curl -L -s -A "Mozilla/5.0" -o images/<slug>/hero.jpg "<DISH_IMAGE_URL>"
curl -L -s -A "Mozilla/5.0" -o images/<slug>/step1.jpg "<STEP1_IMAGE_URL>"   # if step photos exist
```
Pick the hero (the thumbnail), in priority order:
1. The source's main **finished-dish photo** — recipe-site hero image, JSON-LD `image`, or `og:image`.
2. For **video sources** (Reels, Shorts, TikTok, YouTube) the scrapers return a **cover/poster frame**
   — that frame shows the dish; download it as the hero. Set `hero_image` **even when `video_embed`
   is set** (the card still needs a thumbnail). YouTube: `https://img.youtube.com/vi/<ID>/maxresdefault.jpg`
   (fallback `hqdefault.jpg`).
3. If several photos exist, choose the most **appetizing finished plate** — not raw ingredients, not
   a portrait of the cook.
- **Verify the download**: confirm the file is a real image and not tiny/empty
  (`file images/<slug>/hero.jpg` should say JPEG/PNG/WebP; a 0–1 KB file or HTML means it failed — retry once).
- Keep the real extension (`.jpg`/`.png`/`.webp`) and point `hero_image` at the saved path.
- Only use `hero_image: null` as a true last resort (no usable image anywhere); the site then shows
  an emoji placeholder. Prefer almost any real dish photo over the placeholder.

**Video embeds** (play the technique inline on the detail page — do NOT re-host video, heavy + ToS):
  - YouTube `https://youtu.be/ID` or `watch?v=ID` → `https://www.youtube.com/embed/ID`
  - TikTok video ID → `https://www.tiktok.com/embed/v2/<ID>`
  - Instagram post/reel `https://www.instagram.com/reel/<CODE>/` → `https://www.instagram.com/reel/<CODE>/embed`
  - If unsure of the embed form, leave `video_embed: null` and keep the original link in `source.url`.

### 6. Write the recipe file
Create `recipes/<slug>.json` following **`references/schema.md`** exactly — including the Suroboyoan
fields (`title_su`, `item_su`, `note_su`, `text_su`, `notes_su`).
- `slug` = lowercase, hyphenated title (e.g. `garlic-butter-shrimp`). Keep it unique; if it
  collides with an existing file, append a differentiator (`-2`, or the cuisine).

### 7. Update the catalog index
Add (or replace) the matching lightweight entry in `recipes/index.json`. The entry mirrors the
catalog fields only: `slug`, `title`, `title_zh`, `title_su`, `type`, `cuisine`, `tags`,
`hero_image`, `time.total_min`, `source.platform`. Read the file, insert/replace the entry, write it
back as valid JSON. Don't duplicate an existing slug.

### 8. Publish
If this is a git repo with a remote, commit and push so GitHub Pages redeploys:
```bash
git add recipes/ images/ && git commit -m "feat: add <title>" && git push
```
If it's not yet a git repo / not deployed, just save the files and tell the user the recipe is
ready locally and how to deploy (see `README.md`).

### 9. Report back
Give the user a short summary: title, category, servings, # ingredients, # steps, whether media
was captured, and the live URL (or that it's saved locally). Flag anything you had to guess or
couldn't extract (e.g. "no step photos in the source", "times estimated").

## Saved-link (bookmark) entries
Sometimes a recipe can't be extracted — the caption is a teaser, the recipe is locked in a paid
cookbook, or the video has no readable steps — or the user just says "save the link" / "I only need
the link." Don't force or invent a recipe. Save a **link-only bookmark** instead:
- Still capture a **thumbnail of the dish** (screen-grab a frame — see step 5).
- Set `"link_only": true` and fill: `title`, `type`, `cuisine`, `tags`, `source` (url + author +
  platform), `hero_image`, `video_embed` (so it can be re-watched), and a short `notes` (e.g. macros,
  "recipe is in the creator's cookbook"). Add `title_su` / `notes_su` if quick.
- **Omit** `ingredients` and `steps`.
- Add the trimmed entry to `recipes/index.json` **including `"link_only": true`** and `hero_image`.

The site renders these as a card with a 🔖 "Saved link" badge, and a detail page showing the
thumbnail/embedded video plus a prominent "Open original" button — no empty recipe sections.

## Quality bar
- Never invent ingredients or quantities. If the source is vague, say so in `notes` and keep the
  original wording in `original`.
- Steps should be cookable by someone who hasn't seen the video — concrete, ordered, complete.
- Keep Chinese names where natural; the audience cooks in Hong Kong.
- One recipe per link. If a link has multiple recipes, ask which one, or add the primary one and
  mention the others.

## References
- `references/extraction-playbook.md` — per-platform extraction recipes and tool calls
- `references/conversions.md` — full unit + ingredient density conversion tables
- `references/suroboyoan-translation.md` — Boso Suroboyoan cooking glossary + register guide
- `references/schema.md` — exact JSON shape for recipe and index files
