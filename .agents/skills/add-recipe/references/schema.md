# Recipe JSON Schema

Two files are written per recipe. Both must be **valid JSON** (no comments, no trailing commas).

## 1. `recipes/<slug>.json` — full recipe

```json
{
  "slug": "garlic-butter-shrimp",
  "title": "Garlic Butter Shrimp",
  "title_zh": "蒜蓉牛油蝦",
  "title_su": "Udang Bawang Mentega",
  "type": "Mains",
  "cuisine": "Cantonese",
  "tags": ["shrimp", "quick", "weeknight", "seafood"],
  "source": {
    "url": "https://www.instagram.com/reel/ABC123/",
    "platform": "instagram",
    "author": "@some_cook"
  },
  "hero_image": "images/garlic-butter-shrimp/hero.jpg",
  "video_embed": "https://www.instagram.com/reel/ABC123/embed",
  "servings": "4",
  "time": { "prep_min": 15, "cook_min": 10, "total_min": 25 },
  "ingredients": [
    { "item": "Large prawns", "item_su": "Udang gedhe", "qty": 500, "unit": "g", "note": "shelled, deveined", "note_su": "dikupas, dibuwang ototé", "original": "1 lb" },
    { "item": "Butter", "item_su": "Mentega", "qty": 55, "unit": "g", "note": "", "note_su": "", "original": "4 tbsp" },
    { "item": "Garlic", "item_su": "Bawang putih", "qty": 6, "unit": "cloves", "note": "minced", "note_su": "dicacah lembut", "original": "6 cloves" }
  ],
  "steps": [
    { "n": 1, "text": "Pat the prawns dry and season with salt and pepper.", "text_su": "Garingno udange, terus bumboni nganggo uyah ambek mrico.", "image": "images/garlic-butter-shrimp/step1.jpg" },
    { "n": 2, "text": "Melt the butter over medium heat and fry the garlic until fragrant.", "text_su": "Lelehno mentega nganggo geni sedheng, terus goreng bawang putih ngasi mambu wangi.", "image": null }
  ],
  "notes": "Method transcribed from the video; times are approximate.",
  "notes_su": "Carane dijupuk teko video; wektune kiro-kiro.",
  "added": "2026-06-28",
  "added_by": "Derek"
}
```

### Field rules
| field          | type            | notes |
|----------------|-----------------|-------|
| `slug`         | string          | lowercase, hyphens only, unique. Matches filename. |
| `title`        | string          | English (or romanized) display title. |
| `title_zh`     | string \| null  | Chinese name if known; omit/null otherwise. |
| `title_su`     | string \| null  | Boso Suroboyoan title (see suroboyoan-translation.md). |
| `type`         | string          | EXACTLY one of the fixed categories (see SKILL.md). |
| `link_only`    | bool (optional) | `true` = a saved bookmark (thumbnail + link, no recipe). Omit `ingredients`/`steps`. See SKILL.md. |
| `cuisine`      | string \| null  | e.g. "Cantonese", "Thai", "Italian". |
| `tags`         | string[]        | lowercase keywords for search. |
| `source.url`   | string          | original link ("" if pasted text). |
| `source.platform` | string       | website, instagram, youtube, tiktok, facebook, pinterest, twitter, reddit, pasted. |
| `source.author`| string \| null  | creator/handle/site name. |
| `hero_image`   | string \| null  | repo-relative path, or null. |
| `video_embed`  | string \| null  | embeddable URL (see SKILL.md step 5), or null. |
| `servings`     | string \| null  | keep as string ("2-3", "4"). |
| `time`         | object          | any of `prep_min`, `cook_min`, `total_min` (integers). Provide `total_min` when possible — the catalog shows it. |
| `ingredients`  | array           | each: `item`, `item_su`, `qty` (number or "" ), `unit` (string, may be ""), `note`, `note_su`, `original`. |
| `steps`        | array           | each: `n` (1-based int), `text`, `text_su`, `image` (path or null). |
| `notes`        | string \| null  | tips, substitutions, caveats. |
| `notes_su`     | string \| null  | Suroboyoan version of `notes`. |
| `added`        | string          | ISO date `YYYY-MM-DD`. |
| `added_by`     | string \| null  | who added it. |

- Units are **always metric** (`g`, `kg`, `ml`, `l`, `°C`). Count-based units stay as-is
  (`cloves`, `pieces`, `stalk`, `eggs`). `qty` may be `""` for "to taste".
- `original` preserves the pre-conversion measurement so nothing is lost.
- **Suroboyoan fields** (`title_su`, `item_su`, `note_su`, `text_su`, `notes_su`) carry the Boso
  Suroboyoan translation of the words only — numbers/units stay identical. The site shows them when
  the reader picks "Suroboyoan", and falls back to English if a `_su` field is empty/missing.

## 2. `recipes/index.json` — catalog (array)

A trimmed mirror of every recipe, used for the homepage grid, search, and table of contents:

```json
[
  {
    "slug": "garlic-butter-shrimp",
    "title": "Garlic Butter Shrimp",
    "title_zh": "蒜蓉牛油蝦",
    "title_su": "Udang Bawang Mentega",
    "type": "Mains",
    "cuisine": "Cantonese",
    "tags": ["shrimp", "quick", "weeknight", "seafood"],
    "hero_image": "images/garlic-butter-shrimp/hero.jpg",
    "time": { "total_min": 25 },
    "source": { "platform": "instagram" }
  }
]
```

Keep one entry per recipe. When adding a recipe, append its entry (or replace if the slug
already exists). The order doesn't matter — the site groups by `type` and the fixed category order.
